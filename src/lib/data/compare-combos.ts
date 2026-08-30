// ============================================================
// 比較ページ用の組み合わせマスター
// /compare/countries/[combo] のジェネレータが参照
// slugフォーマット: {countryA}-vs-{countryB}（アルファベット昇順）
// ============================================================

export type CompareCombo = {
  slug: string;
  countryASlug: string;
  countryBSlug: string;
  description: string;
  targetKeywords: string[];
};

function build(a: string, b: string, description: string, targetKeywords: string[]): CompareCombo {
  const [first, second] = [a, b].sort();
  return {
    slug: `${first}-vs-${second}`,
    countryASlug: first,
    countryBSlug: second,
    description,
    targetKeywords,
  };
}

export const COMPARE_COUNTRY_COMBOS: CompareCombo[] = [
  build('australia', 'canada',
    'ワーホリ二大人気国の徹底比較。気候・求人・賃金・物価・治安まで網羅。',
    ['オーストラリア カナダ', 'カナダ オーストラリア どっち', 'オーストラリア カナダ ワーホリ 比較']),
  build('australia', 'new-zealand',
    '隣国オセアニアでも特徴の異なる2国。コスト・自然・仕事の探しやすさで比較。',
    ['オーストラリア ニュージーランド 比較', 'ワーホリ ニュージーランド オーストラリア どっち']),
  build('canada', 'united-states',
    '英語留学の選択肢として並び称される北米2国を比較。',
    ['カナダ アメリカ 留学 比較', 'アメリカ カナダ どっち']),
  build('australia', 'ireland',
    'オーストラリアとアイルランド、年齢制限35歳まで延長されたワーホリ国の比較。',
    ['オーストラリア アイルランド 比較', 'アイルランド ワーホリ オーストラリア']),
  build('canada', 'ireland',
    'カナダとアイルランド、英語圏の中規模国2つを徹底比較。',
    ['カナダ アイルランド 比較']),
  build('australia', 'united-kingdom',
    'オーストラリアと英国（YMSビザ）、英語圏ワーホリ比較。',
    ['オーストラリア イギリス 比較', 'イギリス YMS ワーホリ']),
  build('new-zealand', 'canada',
    '大自然のニュージーランドと多文化のカナダ、ライフスタイルで比較。',
    ['ニュージーランド カナダ どっち']),
  build('australia', 'united-states',
    'ワーホリのオーストラリアと正規留学のアメリカ、目的別の使い分け。',
    ['オーストラリア アメリカ 比較']),
  build('united-kingdom', 'ireland',
    'イギリスとアイルランドの英語圏徹底比較。',
    ['イギリス アイルランド 比較']),
  build('philippines', 'malta',
    '英語格安留学の二強、フィリピンとマルタを徹底比較。',
    ['フィリピン マルタ 比較', 'フィリピン留学 マルタ留学']),
  build('australia', 'philippines',
    'ワーホリのオーストラリアと格安英語留学のフィリピン、留学スタイル比較。',
    ['オーストラリア フィリピン 比較']),
  build('germany', 'france',
    '欧州大陸の主要2国、ドイツとフランスを多角的に比較。',
    ['ドイツ フランス 比較', 'ドイツ留学 フランス留学']),
  build('south-korea', 'taiwan',
    '韓国語と中国語(繁体字)、東アジア2国の留学を比較。',
    ['韓国 台湾 比較', '韓国留学 台湾留学']),
  build('china', 'south-korea',
    '中国語と韓国語、それぞれの本場で学ぶならどっち？',
    ['中国 韓国 比較']),
  build('spain', 'mexico',
    'スペイン語留学の本場2国を徹底比較。',
    ['スペイン メキシコ 比較', 'スペイン語 留学 どこ']),
  build('italy', 'spain',
    '南欧の地中海2国、イタリアとスペインを比較。',
    ['イタリア スペイン 比較']),
  build('portugal', 'spain',
    'ポルトガルとスペイン、イベリア半島2国を比較。',
    ['ポルトガル スペイン 比較']),
  build('canada', 'united-kingdom',
    'カナダとイギリス、英語圏の英連邦2国を比較。',
    ['カナダ イギリス 比較']),
  build('new-zealand', 'ireland',
    'ニュージーランドとアイルランド、自然派ワーホリ国を比較。',
    ['ニュージーランド アイルランド 比較']),
  build('thailand', 'vietnam',
    '東南アジア2国の物価・暮らしやすさを比較。',
    ['タイ ベトナム 比較', 'タイ留学 ベトナム留学']),
  build('malaysia', 'singapore',
    'マレーシアとシンガポール、東南アジア英語圏を比較。',
    ['マレーシア シンガポール 比較']),
  build('philippines', 'thailand',
    'フィリピンとタイ、東南アジアの英語留学/タイ語留学を比較。',
    ['フィリピン タイ 比較']),
  build('australia', 'malta',
    'オーストラリアとマルタ、英語留学の選び方比較。',
    ['オーストラリア マルタ 比較']),
  build('united-states', 'united-kingdom',
    'アメリカとイギリス、超人気2大英語圏の比較。',
    ['アメリカ イギリス 比較']),
  build('south-korea', 'philippines',
    '韓国とフィリピン、アジア留学2大コスパ国を比較。',
    ['韓国 フィリピン 比較']),
  build('germany', 'netherlands',
    'ドイツとオランダ、欧州大陸の英語通じる留学先比較。',
    ['ドイツ オランダ 比較']),
  build('australia', 'germany',
    'オーストラリアとドイツ、英語圏とドイツ語圏の比較。',
    ['オーストラリア ドイツ 比較']),
  build('canada', 'australia', // 同じ組み合わせがソート結果として既出なら重複削除
    'デュアル比較（バックアップ）',
    []),
  build('mexico', 'argentina',
    'メキシコとアルゼンチン、スペイン語ラテンアメリカ2国比較。',
    ['メキシコ アルゼンチン 比較']),
  build('australia', 'thailand',
    'オーストラリアワーホリとタイ留学、対極の2国を比較。',
    ['オーストラリア タイ 比較']),
].filter((combo, i, arr) => arr.findIndex((c) => c.slug === combo.slug) === i);

export function getCompareComboBySlug(slug: string): CompareCombo | undefined {
  return COMPARE_COUNTRY_COMBOS.find((c) => c.slug === slug);
}
