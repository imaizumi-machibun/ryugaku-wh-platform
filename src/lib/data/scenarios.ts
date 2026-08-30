import type { Scenario } from '@/lib/segments/types';

// ============================================================
// シナリオライブラリ
// 複数 Segment（budget / duration / age / purpose / city）が
// scenarioKeys でこのライブラリを参照する
// ============================================================

export const SCENARIOS: Scenario[] = [
  // =================================================
  // 高額帯（over-5m / under-5m の上端）
  // =================================================
  {
    key: 'mba-2y',
    label: 'MBA留学（2年制）',
    audience: '社会人 / コンサル・金融・経営志望',
    durationMonths: { min: 12, max: 24 },
    countrySlugs: ['united-states', 'united-kingdom', 'switzerland', 'france'],
    totalJpy: { min: 15_000_000, max: 25_000_000 },
    breakdown: [
      { item: '学費', lowJpy: 7_000_000, highJpy: 14_000_000, note: '米トップMBAは$80k-150k/年' },
      { item: '生活費', lowJpy: 5_000_000, highJpy: 8_000_000, note: 'ボストン・NYなど大都市圏' },
      { item: 'ビザ', lowJpy: 30_000, highJpy: 50_000 },
      { item: '航空券（複数回）', lowJpy: 500_000, highJpy: 800_000 },
      { item: '保険・教材・諸費用', lowJpy: 500_000, highJpy: 1_000_000 },
    ],
    requirementNote: 'TOEFL 100+ / GMAT 700+ / 職務経歴3年以上が一般的',
    roi: {
      yearsToRecover: { min: 4, max: 8 },
      expectedIncomeJpy: { min: 12_000_000, max: 25_000_000 },
      note: '卒業後コンサル・外資金融なら3-5年で回収可能。事業会社系は5-8年。',
    },
    relatedArticleSlugs: ['mba-cost-comparison', 'scholarship-graduate-school'],
  },
  {
    key: 'us-undergrad-4y',
    label: '米国大学正規留学（学士4年）',
    audience: '高校生・大学生（編入含む） / 保護者',
    durationMonths: { min: 36, max: 48 },
    countrySlugs: ['united-states'],
    totalJpy: { min: 18_000_000, max: 35_000_000 },
    breakdown: [
      { item: '学費', lowJpy: 12_000_000, highJpy: 24_000_000, note: '州立out-of-state $35k/年〜、私立 $60-70k/年' },
      { item: '生活費（4年）', lowJpy: 5_000_000, highJpy: 8_000_000 },
      { item: 'ビザ（F-1）', lowJpy: 30_000, highJpy: 50_000 },
      { item: '航空券（毎年帰国）', lowJpy: 600_000, highJpy: 1_200_000 },
      { item: '保険・教材', lowJpy: 800_000, highJpy: 1_500_000 },
    ],
    requirementNote: 'TOEFL 80-100 / SAT 推奨。Pathwayプログラム経由なら条件緩和',
    roi: {
      yearsToRecover: { min: 5, max: 12 },
      note: '進路により大きく異なる。STEM系はOPT 3年延長で米国就職→投資回収可能',
    },
    relatedArticleSlugs: ['us-private-vs-public-university', 'scholarship-graduate-school'],
  },
  {
    key: 'uk-master-1y',
    label: '英国大学院（修士1年制）',
    audience: '社会人 / 既卒 / キャリアチェンジ志望',
    durationMonths: { min: 12, max: 13 },
    countrySlugs: ['united-kingdom'],
    totalJpy: { min: 5_000_000, max: 9_000_000 },
    breakdown: [
      { item: '学費', lowJpy: 3_000_000, highJpy: 5_500_000, note: '£20k-35k（大学・専攻により）' },
      { item: '生活費（ロンドン）', lowJpy: 1_800_000, highJpy: 2_500_000 },
      { item: 'ビザ・IHS', lowJpy: 150_000, highJpy: 200_000 },
      { item: '航空券', lowJpy: 200_000, highJpy: 400_000 },
      { item: '保険・教材', lowJpy: 200_000, highJpy: 400_000 },
    ],
    requirementNote: 'IELTS 6.5-7.5 / GRE 不要が多い / 学士GPA 3.0+',
    roi: {
      yearsToRecover: { min: 3, max: 6 },
      expectedIncomeJpy: { min: 6_000_000, max: 12_000_000 },
      note: '英国大学院は1年で完結するため投資回収しやすい。Graduate Routeで2年就労可',
    },
    relatedArticleSlugs: ['uk-postgraduate-cost', 'scholarship-graduate-school'],
  },
  {
    key: 'swiss-language-1y',
    label: 'スイス語学・ホスピタリティ（1年）',
    audience: '富裕層 / ホスピタリティ業界志望 / 既卒',
    durationMonths: { min: 6, max: 12 },
    countrySlugs: ['switzerland'],
    totalJpy: { min: 5_000_000, max: 8_000_000 },
    breakdown: [
      { item: '学費', lowJpy: 3_500_000, highJpy: 5_500_000, note: 'レザン・モントルー系の上位校' },
      { item: '生活費', lowJpy: 1_200_000, highJpy: 1_800_000 },
      { item: 'ビザ', lowJpy: 20_000, highJpy: 40_000 },
      { item: '航空券', lowJpy: 200_000, highJpy: 400_000 },
      { item: '保険・教材', lowJpy: 200_000, highJpy: 400_000 },
    ],
    requirementNote: '入学要件は比較的緩いが、英語または仏語の基礎力が必要',
  },
  {
    key: 'med-vocational-2y',
    label: '医療・看護系の海外正規留学（2年）',
    audience: '医療従事者 / 国家資格切替志望',
    durationMonths: { min: 18, max: 30 },
    countrySlugs: ['australia', 'canada', 'united-kingdom'],
    totalJpy: { min: 5_000_000, max: 9_000_000 },
    breakdown: [
      { item: '学費', lowJpy: 3_000_000, highJpy: 5_500_000 },
      { item: '生活費', lowJpy: 1_500_000, highJpy: 2_500_000 },
      { item: 'ビザ', lowJpy: 50_000, highJpy: 100_000 },
      { item: '航空券', lowJpy: 200_000, highJpy: 400_000 },
      { item: '保険・教材・試験費', lowJpy: 300_000, highJpy: 600_000 },
    ],
    requirementNote: 'IELTS 7.0（OETでも可）/ 日本での看護師資格 / 試験合格',
  },

  // =================================================
  // 中額帯（under-5m / under-3m）
  // =================================================
  {
    key: 'us-college-pathway',
    label: '米国コミカレ→4年制大学編入',
    audience: '高校生・大学生 / 費用を抑えたい層',
    durationMonths: { min: 24, max: 48 },
    countrySlugs: ['united-states'],
    totalJpy: { min: 3_500_000, max: 7_000_000 },
    breakdown: [
      { item: '学費（CC 2年）', lowJpy: 1_500_000, highJpy: 3_000_000 },
      { item: '学費（4大編入後2年）', lowJpy: 1_200_000, highJpy: 2_500_000 },
      { item: '生活費', lowJpy: 1_500_000, highJpy: 2_500_000 },
      { item: 'ビザ・航空券・保険', lowJpy: 400_000, highJpy: 800_000 },
    ],
    requirementNote: 'TOEFL 60-80 / GPA重視。費用を米国4年正規より大幅圧縮できるルート',
    relatedArticleSlugs: ['us-private-vs-public-university'],
  },
  {
    key: 'ca-college-pgwp',
    label: 'カナダカレッジ＋PGWP（就労ビザ）',
    audience: '永住権志望 / キャリアチェンジ',
    durationMonths: { min: 12, max: 36 },
    countrySlugs: ['canada'],
    totalJpy: { min: 3_000_000, max: 6_000_000 },
    breakdown: [
      { item: '学費', lowJpy: 1_500_000, highJpy: 3_500_000 },
      { item: '生活費', lowJpy: 1_000_000, highJpy: 2_000_000 },
      { item: 'ビザ・PGWP申請', lowJpy: 50_000, highJpy: 100_000 },
      { item: '航空券・保険', lowJpy: 300_000, highJpy: 500_000 },
    ],
    requirementNote: 'IELTS 6.0+ / 2年以上の課程修了でPGWP最大3年取得可能',
  },
  {
    key: 'au-diploma-1y',
    label: 'オーストラリアDiploma+専門コース',
    audience: '若手社会人 / 専門スキル習得志望',
    durationMonths: { min: 12, max: 24 },
    countrySlugs: ['australia'],
    totalJpy: { min: 2_500_000, max: 4_500_000 },
    breakdown: [
      { item: '学費', lowJpy: 1_200_000, highJpy: 2_500_000 },
      { item: '生活費', lowJpy: 1_000_000, highJpy: 1_500_000 },
      { item: 'ビザ', lowJpy: 60_000, highJpy: 100_000 },
      { item: '航空券・保険', lowJpy: 250_000, highJpy: 500_000 },
    ],
    requirementNote: 'IELTS 5.5-6.0 / 週20h就労可',
  },

  // =================================================
  // ワーホリ帯（under-1.5m / under-2m）
  // =================================================
  {
    key: 'au-wh-1y',
    label: 'オーストラリアワーホリ1年',
    audience: '20代 / 海外就労経験志望',
    durationMonths: { min: 12, max: 12 },
    countrySlugs: ['australia'],
    totalJpy: { min: 1_000_000, max: 2_000_000 },
    breakdown: [
      { item: '初期費用（語学3ヶ月）', lowJpy: 400_000, highJpy: 700_000 },
      { item: '生活費（9ヶ月、収入控除前）', lowJpy: 1_300_000, highJpy: 2_000_000 },
      { item: '想定収入（フルタイム就労）', lowJpy: -1_500_000, highJpy: -800_000, note: '時給A$25-35×週38h想定' },
      { item: 'ビザ', lowJpy: 60_000, highJpy: 70_000 },
      { item: '航空券・保険', lowJpy: 250_000, highJpy: 400_000 },
    ],
    requirementNote: '18-30歳（特定国は35歳まで）/ 英語要件なし',
  },
  {
    key: 'ca-wh-1y',
    label: 'カナダワーホリ1年',
    audience: '20代 / IT・カフェ系就労志望',
    durationMonths: { min: 12, max: 12 },
    countrySlugs: ['canada'],
    totalJpy: { min: 1_000_000, max: 1_800_000 },
    breakdown: [
      { item: '初期費用（語学3ヶ月）', lowJpy: 400_000, highJpy: 700_000 },
      { item: '生活費（9ヶ月）', lowJpy: 1_100_000, highJpy: 1_700_000 },
      { item: '想定収入', lowJpy: -1_200_000, highJpy: -600_000 },
      { item: 'ビザ・保険・航空券', lowJpy: 300_000, highJpy: 500_000 },
    ],
    requirementNote: '18-30歳 / IEC抽選あり',
  },
  {
    key: 'nz-wh-1y',
    label: 'ニュージーランドワーホリ1年',
    audience: '20代 / 自然・農業系志望',
    durationMonths: { min: 12, max: 12 },
    countrySlugs: ['new-zealand'],
    totalJpy: { min: 900_000, max: 1_700_000 },
    breakdown: [
      { item: '語学・初期費用', lowJpy: 350_000, highJpy: 600_000 },
      { item: '生活費（9ヶ月）', lowJpy: 1_000_000, highJpy: 1_500_000 },
      { item: '想定収入', lowJpy: -1_100_000, highJpy: -500_000 },
      { item: 'ビザ・航空券・保険', lowJpy: 250_000, highJpy: 400_000 },
    ],
    requirementNote: '18-30歳 / 英語要件なし',
  },
  {
    key: 'uk-yms-2y',
    label: '英国YMS（ワーホリ）2年',
    audience: '20代 / ロンドン就労志望',
    durationMonths: { min: 12, max: 24 },
    countrySlugs: ['united-kingdom'],
    totalJpy: { min: 1_500_000, max: 3_000_000 },
    breakdown: [
      { item: '初期費用', lowJpy: 400_000, highJpy: 800_000 },
      { item: '生活費（ロンドン2年）', lowJpy: 3_000_000, highJpy: 5_000_000 },
      { item: '想定収入', lowJpy: -2_500_000, highJpy: -1_500_000 },
      { item: 'ビザ・IHS', lowJpy: 150_000, highJpy: 250_000 },
      { item: '航空券・保険', lowJpy: 250_000, highJpy: 400_000 },
    ],
    requirementNote: '18-30歳 / 抽選制（年2回）/ 資金£2,530証明必要',
  },
  {
    key: 'de-wh-1y',
    label: 'ドイツワーホリ1年',
    audience: '20代 / 欧州拠点志望',
    durationMonths: { min: 12, max: 12 },
    countrySlugs: ['germany'],
    totalJpy: { min: 1_000_000, max: 1_800_000 },
    breakdown: [
      { item: '生活費（ベルリン1年）', lowJpy: 1_400_000, highJpy: 2_000_000 },
      { item: '想定収入', lowJpy: -1_000_000, highJpy: -400_000 },
      { item: 'ビザ', lowJpy: 10_000, highJpy: 15_000 },
      { item: '航空券・保険', lowJpy: 300_000, highJpy: 500_000 },
    ],
    requirementNote: '18-30歳 / 資金€2,000証明必要',
  },

  // =================================================
  // 短期・低額帯（under-300k / under-500k / under-1m）
  // =================================================
  {
    key: 'ph-2w',
    label: 'フィリピン語学2週間',
    audience: '初心者 / 短期集中希望',
    durationMonths: { min: 0.5, max: 0.5 },
    countrySlugs: ['philippines'],
    totalJpy: { min: 150_000, max: 250_000 },
    breakdown: [
      { item: '学費・滞在費（パック）', lowJpy: 100_000, highJpy: 170_000 },
      { item: 'ビザ・SSP', lowJpy: 10_000, highJpy: 15_000 },
      { item: '航空券', lowJpy: 40_000, highJpy: 70_000 },
    ],
    requirementNote: 'ビザ免除30日（延長で最大3年滞在可）',
  },
  {
    key: 'ph-1m',
    label: 'フィリピン語学1ヶ月',
    audience: '初級〜中級 / 短期で英語底上げ',
    durationMonths: { min: 1, max: 1 },
    countrySlugs: ['philippines'],
    totalJpy: { min: 200_000, max: 350_000 },
    breakdown: [
      { item: '学費・滞在費（パック）', lowJpy: 150_000, highJpy: 250_000 },
      { item: 'ビザ・SSP', lowJpy: 15_000, highJpy: 25_000 },
      { item: '航空券', lowJpy: 40_000, highJpy: 80_000 },
    ],
    requirementNote: 'マンツーマン中心 / 1日4-8時間レッスン',
  },
  {
    key: 'malta-1m',
    label: 'マルタ語学1ヶ月',
    audience: '欧州体験志望 / 中級〜',
    durationMonths: { min: 1, max: 1 },
    countrySlugs: ['malta'],
    totalJpy: { min: 300_000, max: 500_000 },
    breakdown: [
      { item: '学費', lowJpy: 120_000, highJpy: 200_000 },
      { item: '滞在費', lowJpy: 100_000, highJpy: 180_000 },
      { item: '航空券', lowJpy: 150_000, highJpy: 200_000 },
      { item: 'ビザ・保険', lowJpy: 30_000, highJpy: 50_000 },
    ],
    requirementNote: '90日以内はビザ不要 / 多国籍環境',
  },
  {
    key: 'kr-1m',
    label: '韓国語学1ヶ月',
    audience: '韓国文化好き / K-Pop世代',
    durationMonths: { min: 1, max: 1 },
    countrySlugs: ['south-korea'],
    totalJpy: { min: 200_000, max: 400_000 },
    breakdown: [
      { item: '学費', lowJpy: 100_000, highJpy: 180_000 },
      { item: '滞在費（コシテル等）', lowJpy: 60_000, highJpy: 120_000 },
      { item: '航空券', lowJpy: 40_000, highJpy: 80_000 },
    ],
    requirementNote: '延世大・西江大・成均館大などが人気',
  },
];

export function getScenarioByKey(key: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.key === key);
}

export function getScenariosByKeys(keys: string[] | undefined): Scenario[] {
  if (!keys || keys.length === 0) return [];
  return keys
    .map((k) => SCENARIOS.find((s) => s.key === k))
    .filter((s): s is Scenario => s != null);
}
