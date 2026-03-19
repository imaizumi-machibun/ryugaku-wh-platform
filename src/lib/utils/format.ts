/**
 * 数値を日本円フォーマット（¥1,234,567）
 */
export function formatJPY(amount: number | undefined | null): string {
  if (amount == null) return '—';
  return `¥${amount.toLocaleString('ja-JP')}`;
}

/**
 * 数値を「約XX万円」形式に
 */
export function formatManYen(amount: number | undefined | null): string {
  if (amount == null) return '—';
  const man = Math.round(amount / 10000);
  return `約${man}万円`;
}

/**
 * 月数を「X年Yヶ月」に変換
 */
export function formatDuration(months: number | undefined | null): string {
  if (months == null) return '—';
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  if (years === 0) return `${remaining}ヶ月`;
  if (remaining === 0) return `${years}年`;
  return `${years}年${remaining}ヶ月`;
}

/**
 * 日付をYYYY年MM月DD日に変換
 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * 小数を★表示に変換
 */
export function formatRating(rating: number | undefined | null): string {
  if (rating == null) return '—';
  return rating.toFixed(1);
}

/**
 * 数値の平均を計算
 */
export function average(values: (number | undefined | null)[]): number {
  const valid = values.filter((v): v is number => v != null);
  if (valid.length === 0) return 0;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

/**
 * 作成日から14日以内かどうか判定
 */
export function isNew(dateStr: string): boolean {
  const created = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
}
