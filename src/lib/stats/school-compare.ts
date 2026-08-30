import type { School } from '../microcms/types';

// ============================================================
// 学校詳細ページ用の同都市・同国比較ヘルパー
// テンプレ量産による類似判定を避けるため、学校ごとに固有の
// 実データ集計（費用相場・近隣校比較・体験談ローテーション）を作る
// 全関数とも取得済みデータのみを扱う純関数（推測値は使わない）
// ============================================================

export type FeeComparisonScope = 'city' | 'country';

export type FeeComparison = {
  scope: FeeComparisonScope; // 比較母集団（同都市 or 同国フォールバック）
  count: number; // 費用データがある学校数（自校含む）
  min: number;
  average: number;
  median: number;
  self: number; // 当校の週あたり費用（weeklyFeeLow）
};

/** weeklyFeeLow が正の数の学校だけ残し、id で重複排除 */
function feePool(schools: School[]): School[] {
  const seen = new Set<string>();
  const pool: School[] = [];
  for (const s of schools) {
    if (s.weeklyFeeLow == null || s.weeklyFeeLow <= 0) continue;
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    pool.push(s);
  }
  return pool;
}

/** 昇順ソート済み配列の中央値（偶数個は中央2値の平均を四捨五入） */
function medianOf(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/**
 * 同都市の学校の weeklyFeeLow から最安・平均・中央値を計算
 * - 同都市の費用データが3校未満なら同国プールでフォールバック
 * - それも3校未満、または自校に費用データがなければ null（ブロックごと非表示）
 */
export function buildFeeComparison(
  school: School,
  citySchools: School[],
  countrySchools: School[]
): FeeComparison | null {
  const self = school.weeklyFeeLow;
  if (self == null || self <= 0) return null;

  const scopes: { scope: FeeComparisonScope; schools: School[] }[] = [
    { scope: 'city', schools: citySchools },
    { scope: 'country', schools: countrySchools },
  ];
  for (const { scope, schools } of scopes) {
    // 取得漏れがあっても自校は必ず母集団に含める
    const fees = feePool([school, ...schools])
      .map((s) => s.weeklyFeeLow as number)
      .sort((a, b) => a - b);
    if (fees.length < 3) continue;
    return {
      scope,
      count: fees.length,
      min: fees[0],
      average: Math.round(fees.reduce((sum, v) => sum + v, 0) / fees.length),
      median: medianOf(fees),
      self,
    };
  }
  return null;
}

/**
 * 同都市で費用データがある他校から、当校と週あたり費用が近い順に最大 max 校を選ぶ
 * - 自校に費用データがない、または他校が3校未満なら null（ブロックごと非表示）
 * - 同差額は費用の安い順 → id 順で安定ソート（ビルド間で結果が変わらない）
 */
export function pickNearbyFeeSchools(
  school: School,
  citySchools: School[],
  max = 4
): School[] | null {
  const self = school.weeklyFeeLow;
  if (self == null || self <= 0) return null;

  const others = feePool(citySchools).filter((s) => s.id !== school.id);
  if (others.length < 3) return null;

  return others
    .sort((a, b) => {
      const da = Math.abs((a.weeklyFeeLow as number) - self);
      const db = Math.abs((b.weeklyFeeLow as number) - self);
      if (da !== db) return da - db;
      if (a.weeklyFeeLow !== b.weeklyFeeLow) {
        return (a.weeklyFeeLow as number) - (b.weeklyFeeLow as number);
      }
      return a.id.localeCompare(b.id);
    })
    .slice(0, max);
}

/**
 * 文字列から決定論的なハッシュ値を計算（djb2）
 * 乱数を使わないため、ビルドごとに結果が変わらない
 */
export function hashKey(key: string): number {
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 33 + key.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * key（学校ID）のハッシュで開始位置をずらして count 件を選ぶ
 * 同都市の全校が同じ体験談を並べる重複を避けるためのローテーション
 */
export function rotateByKey<T>(items: T[], key: string, count: number): T[] {
  if (items.length <= count) return items;
  const offset = hashKey(key) % items.length;
  return Array.from({ length: count }, (_, i) => items[(offset + i) % items.length]);
}
