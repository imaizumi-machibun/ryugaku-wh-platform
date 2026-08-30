// ============================================================
// 都市ページ 本文画像（/cities/{slug}-1.jpg, -2.jpg, -3.jpg）
// ============================================================
// public/cities/ を python3 で実スキャンした結果をもとにした静的データ。
// 実行時にファイルシステムを参照しないことで、ビルド/SSR を軽量に保つ。
//
// スキャン日: 2026-06-20
// 対象 27 都市すべてで -1.jpg / -2.jpg / -3.jpg の 3 枚が実在することを確認済み。
// （将来、画像の増減があった場合はこのマップの数値だけを更新すれば反映される）
//
// 値 = 実在する連番画像の枚数（1〜3）。0 の都市は本文画像なし扱い。

const CITY_BODY_IMAGE_COUNTS: Readonly<Record<string, number>> = {
  // オセアニア
  sydney: 3,
  melbourne: 3,
  brisbane: 3,
  perth: 3,
  cairns: 3,
  'gold-coast': 3,
  auckland: 3,
  wellington: 3,
  queenstown: 3,
  // イギリス・アイルランド
  london: 3,
  manchester: 3,
  edinburgh: 3,
  dublin: 3,
  cork: 3,
  galway: 3,
  // フランス
  paris: 3,
  lyon: 3,
  nice: 3,
  // ドイツ
  berlin: 3,
  munich: 3,
  frankfurt: 3,
  // スペイン
  barcelona: 3,
  madrid: 3,
  valencia: 3,
  // イタリア
  rome: 3,
  milan: 3,
  florence: 3,
};

/**
 * 都市 slug を渡すと、その都市の本文画像パス配列を返す。
 * 例: getCityBodyImages('sydney') => ['/cities/sydney-1.jpg', '/cities/sydney-2.jpg', '/cities/sydney-3.jpg']
 *
 * 画像が用意されていない都市は空配列 [] を返す。
 * 実行時のファイルシステム参照は行わず、上記の静的マップに基づく。
 */
export function getCityBodyImages(slug: string): string[] {
  const count = CITY_BODY_IMAGE_COUNTS[slug] ?? 0;
  const paths: string[] = [];
  for (let i = 1; i <= count; i++) {
    paths.push(`/cities/${slug}-${i}.jpg`);
  }
  return paths;
}
