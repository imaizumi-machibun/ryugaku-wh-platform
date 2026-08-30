import type {
  Persona,
  SegmentFAQ,
  SegmentFundingNotes,
  SegmentMidCta,
  SegmentMeta,
  SegmentExperienceFilterHints,
  SegmentSchoolFilterHints,
} from '@/lib/segments/types';

// ============================================================
// 期間別マスター
// /duration/[period] のジェネレータが参照
// ============================================================

export type Duration = {
  slug: string;
  label: string;
  minMonths: number;
  maxMonths: number;
  description: string;
  targetKeywords: string[];
  recommendedFor: string[];
  budgetRangeJpy: { min: number; max: number };

  // SegmentMeta 拡張（optional）
  h1Override?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroLead?: string;
  keyTakeaways?: string[];
  personas?: Persona[];
  scenarioKeys?: string[];
  faqOverrides?: SegmentFAQ[];
  midCta?: SegmentMidCta;
  relatedArticleSlugs?: string[];
  fundingNotes?: SegmentFundingNotes;
  showFundingCard?: boolean;
  showROICard?: boolean;
  showCostEstimator?: boolean;
  schoolFilterHints?: SegmentSchoolFilterHints;
  experienceFilterHints?: SegmentExperienceFilterHints;
  monthsAssumedForSchoolEstimate?: number;
};

const MID_CTA_MATCHING: SegmentMidCta = {
  title: 'あなたに合う国を診断する',
  description: '6つの質問で、あなたにフィットする渡航先と期間プランを提案します。',
  primaryHref: '/matching',
  primaryLabel: '国診断を始める',
  secondaryHref: '/contact',
  secondaryLabel: '個別相談する',
};

const MID_CTA_CONTACT: SegmentMidCta = {
  title: '長期留学・正規進学を無料で個別相談',
  description: '滞在期間・進路・予算に応じた現実的なシミュレーションを編集部が作成します。',
  primaryHref: '/contact',
  primaryLabel: '無料で相談する',
  secondaryHref: '/matching',
  secondaryLabel: '国診断ツールを使う',
};

export const DURATIONS: Duration[] = [
  {
    slug: '2weeks',
    label: '2週間',
    minMonths: 0,
    maxMonths: 1,
    description: '夏休み・有給休暇を使った超短期留学。語学体験・観光ミックス型。',
    targetKeywords: ['2週間 留学', '短期 留学', '夏休み 留学'],
    recommendedFor: ['社会人の有給', '夏休み学生', '初海外'],
    budgetRangeJpy: { min: 150000, max: 400000 },
    h1Override: '【2週間留学】夏休み・有給で行ける超短期プラン｜費用15-40万円',
    metaTitle: '2週間の語学留学｜フィリピン・韓国・マルタの超短期プラン【2026年版】',
    metaDescription: '2週間の超短期留学を、フィリピンセブ・韓国・マルタの3シナリオで総額試算。社会人の有給活用、夏休み学生、初海外向けの現実プランを体験談ベースで解説。',
    heroLead: '2週間の超短期でも、フィリピンセブのマンツーマン集中なら語学体験＋海外慣れに十分。社会人の有給活用や学生の夏休みに最適なプランを比較できます。',
    keyTakeaways: [
      '2週間プランの総額は15-40万円が標準',
      'フィリピンはマンツーマンレッスンで学習密度最大',
      '韓国・マルタは観光ミックス型に向く',
      'ビザは観光ビザでOK（一部国はSSP要）',
      '航空券・滞在費パック型で手続き最小化',
    ],
    scenarioKeys: ['ph-2w', 'kr-1m'],
    midCta: MID_CTA_MATCHING,
    relatedArticleSlugs: ['cebu-study-real-cost', 'korea-study', 'short-term-study'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 1,
    experienceFilterHints: { maxDurationMonths: 1 },
  },
  {
    slug: '1month',
    label: '1ヶ月',
    minMonths: 1,
    maxMonths: 2,
    description: '一定の学習効果が得られる王道短期。フィリピン留学が圧倒的人気。',
    targetKeywords: ['1ヶ月 留学', '1ヶ月 ワーホリ', 'フィリピン留学 1ヶ月'],
    recommendedFor: ['社会人', '休職', '春休み'],
    budgetRangeJpy: { min: 250000, max: 600000 },
    h1Override: '【1ヶ月留学】社会人・休職に最適な王道プラン｜費用25-60万円',
    metaTitle: '1ヶ月の語学留学｜フィリピン・マルタ・韓国の王道短期プラン【2026年版】',
    metaDescription: '1ヶ月の語学留学で確実に効果を出す王道プランを、フィリピン集中・マルタ・韓国の3シナリオで総額試算。TOEIC 100点アップを狙う設計と体験談付き。',
    heroLead: '1ヶ月留学は社会人の休職・春休みの王道。フィリピン集中ならTOEIC 100点アップも現実的、マルタは欧州体験ミックスに向きます。',
    keyTakeaways: [
      '1ヶ月の総額は25-60万円',
      'フィリピン集中でTOEIC 100点アップ事例多数',
      'マルタは多国籍環境＋欧州文化体験',
      '韓国はコシテル活用で滞在費圧縮',
      '社会人の休職留学にも対応',
    ],
    scenarioKeys: ['ph-1m', 'malta-1m', 'kr-1m'],
    midCta: MID_CTA_MATCHING,
    relatedArticleSlugs: ['cebu-study-real-cost', 'malta-study', 'korea-study'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 1,
    experienceFilterHints: { minDurationMonths: 1, maxDurationMonths: 2 },
  },
  {
    slug: '3months',
    label: '3ヶ月',
    minMonths: 2,
    maxMonths: 4,
    description: '観光ビザで滞在可能な多くの国でできる中期留学。語学が大きく伸びる期間。',
    targetKeywords: ['3ヶ月 留学', '3ヶ月 ワーホリ', '中期留学'],
    recommendedFor: ['休職社会人', '新卒前', '転職前'],
    budgetRangeJpy: { min: 500000, max: 1200000 },
    h1Override: '【3ヶ月留学】中期で語学を本格的に伸ばす｜費用50-120万円',
    metaTitle: '3ヶ月の語学留学・ワーホリ｜中級突入・観光ビザ滞在の現実プラン【2026年版】',
    metaDescription: '3ヶ月の中期留学で語学を本格的に伸ばすプランを、フィリピン・マルタ・ワーホリ短期で総額試算。観光ビザ滞在の手続きと滞在費の現実値を解説。',
    heroLead: '3ヶ月は語学が「日常会話に困らないレベル」に到達できる期間。観光ビザ滞在のままでフィリピン・マルタが選択肢に入ります。',
    keyTakeaways: [
      '3ヶ月の総額は50-120万円',
      '基礎の固め直し〜中級突入が現実的',
      '観光ビザ滞在で手続き最小化',
      '転職前・新卒前のキャリアブランク活用',
      '滞在3ヶ月でTOEIC 150-200点アップも',
    ],
    scenarioKeys: ['ph-1m', 'malta-1m', 'au-wh-1y'],
    midCta: MID_CTA_MATCHING,
    relatedArticleSlugs: ['cebu-study-real-cost', 'malta-study'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 3,
    experienceFilterHints: { minDurationMonths: 2, maxDurationMonths: 4 },
  },
  {
    slug: '6months',
    label: '半年',
    minMonths: 5,
    maxMonths: 8,
    description: '中級から上級レベルに到達できる本格留学。学生ビザ/ワーホリビザ要。',
    targetKeywords: ['半年 留学', '6ヶ月 ワーホリ', '半年 ワーホリ'],
    recommendedFor: ['キャリアブレイク', '海外就職前', '本格的な語学習得'],
    budgetRangeJpy: { min: 900000, max: 2000000 },
    h1Override: '【半年留学】中級〜上級到達・海外就職前の本気プラン｜費用90-200万円',
    metaTitle: '半年の語学留学・ワーホリ｜中級到達・キャリアブレイク向け【2026年版】',
    metaDescription: '半年の本格留学プランを、フィリピン6ヶ月集中・ワーホリスタート・マルタ半年の3シナリオで総額試算。中級〜上級到達と海外就職準備のプラン。',
    heroLead: '半年あれば語学は中級〜上級到達可能、ビジネス英語も視野に。キャリアブレイクからの海外就職準備期間としても最適です。',
    keyTakeaways: [
      '半年の総額は90-200万円',
      'ビジネス英語・上級レベルが現実的射程',
      'ワーホリビザ取得で就労収入も視野',
      'キャリアブレイク→海外就職への橋渡し',
      'フィリピン3ヶ月＋ワーホリ3ヶ月の組み合わせも人気',
    ],
    scenarioKeys: ['au-wh-1y', 'ca-wh-1y', 'malta-1m'],
    midCta: MID_CTA_MATCHING,
    relatedArticleSlugs: ['wh-budget-100man', 'cebu-study-real-cost'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 6,
    experienceFilterHints: { minDurationMonths: 5, maxDurationMonths: 8 },
  },
  {
    slug: '1year',
    label: '1年間',
    minMonths: 9,
    maxMonths: 14,
    description: '王道ワーキングホリデー期間。最も多くの体験談がある。',
    targetKeywords: ['1年 ワーホリ', '1年間 留学', 'ワーホリ 1年'],
    recommendedFor: ['ワーホリビザ', '新卒前ギャップイヤー', '転職前'],
    budgetRangeJpy: { min: 1500000, max: 3500000 },
    h1Override: '【1年間】王道ワーホリ・語学留学完全プラン｜費用150-350万円',
    metaTitle: '1年間のワーホリ・留学｜豪/加/NZ/英の王道プラン総額シミュレーション【2026年版】',
    metaDescription: '1年間のワーホリ・留学を、オーストラリア・カナダ・ニュージーランド・英国YMSの4シナリオで総額試算。就労収入を加味した実質コストと体験談付き。',
    heroLead: '1年ワーホリは最も体験談データが豊富な王道期間。語学3ヶ月＋就労9ヶ月の標準パターンを国別に比較できます。',
    keyTakeaways: [
      '1年の総額は150-350万円（就労収入控除前）',
      '豪/加/NZは就労収入で実質コストを大幅圧縮',
      '英国YMSは資金証明が厳しい（£2,530必須）',
      '英国大学院修士1年なら500-900万円',
      '帰国時の貯金残高を組み込んだ設計が必要',
    ],
    scenarioKeys: ['au-wh-1y', 'ca-wh-1y', 'nz-wh-1y', 'de-wh-1y', 'uk-master-1y'],
    midCta: MID_CTA_MATCHING,
    relatedArticleSlugs: ['wh-budget-100man', 'uk-yms-visa-guide', 'australia-tfn-guide'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 12,
    experienceFilterHints: { minDurationMonths: 9, maxDurationMonths: 14 },
  },
  {
    slug: '2years',
    label: '2年以上',
    minMonths: 15,
    maxMonths: 36,
    description: 'セカンド・サードビザを活用した長期滞在。永住権申請も視野に。',
    targetKeywords: ['2年 ワーホリ', '3年 ワーホリ', 'セカンドビザ'],
    recommendedFor: ['永住希望', 'キャリアチェンジ', 'ワーホリ複数回'],
    budgetRangeJpy: { min: 2500000, max: 6000000 },
    h1Override: '【2年以上】長期滞在・永住権・正規進学プラン｜費用250-600万円',
    metaTitle: '2年以上の長期滞在｜セカンドビザ・PGWP・MBA・正規進学の総額【2026年版】',
    metaDescription: '2年以上の長期滞在プランを、英国YMS 2年・カナダPGWP・米国学部4年・MBA・スイス語学の5シナリオで総額試算。永住権・キャリアチェンジ向け。',
    heroLead: '2年以上の長期滞在は、セカンドビザ・PGWP・正規進学・MBAなど多様な選択肢が射程に。永住権申請やキャリアチェンジを視野に入れた設計が必要です。',
    keyTakeaways: [
      '2年以上の総額は250万円（ワーホリ延長）〜数千万円（MBA）',
      'カナダPGWPで卒業後3年就労＋永住権',
      '英国YMS 2年でロンドン就労を実現',
      'MBA 2年制は1,500-5,000万円が現実',
      '為替変動が累積するためバッファ必須',
    ],
    scenarioKeys: ['uk-yms-2y', 'mba-2y', 'us-college-pathway', 'ca-college-pgwp', 'au-diploma-1y', 'swiss-language-1y'],
    midCta: MID_CTA_CONTACT,
    relatedArticleSlugs: [
      'mba-cost-comparison',
      'scholarship-graduate-school',
      'education-loan-overseas',
      'us-private-vs-public-university',
      'uk-postgraduate-cost',
    ],
    fundingNotes: {
      scholarships: ['JASSO（給付/第二種貸与）', 'トビタテ', 'Chevening（英国）', 'Fulbright（米国）'],
      loans: ['日本政策金融公庫「教育一般貸付」最大450万円', '銀行系教育ローン500-3,000万円'],
      selfFundingTip: '長期滞在は為替変動が累積。初期総額＋月1万円のバッファを推奨。',
    },
    showFundingCard: true,
    showROICard: true,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 24,
    experienceFilterHints: { minDurationMonths: 15 },
  },
];

export function getDurationBySlug(slug: string): Duration | undefined {
  return DURATIONS.find((d) => d.slug === slug);
}

// 月数から該当する期間slugを返す
export function durationToSlug(months: number): string {
  for (const d of DURATIONS) {
    if (months >= d.minMonths && months <= d.maxMonths) return d.slug;
  }
  return '1year';
}

// ============================================================
// Duration を SegmentMeta に変換
// ============================================================
export function durationToSegmentMeta(d: Duration): SegmentMeta {
  return {
    segmentType: 'duration',
    slug: d.slug,
    label: d.label,
    h1Override: d.h1Override,
    metaTitle: d.metaTitle,
    metaDescription: d.metaDescription,
    heroLead: d.heroLead,
    keyTakeaways: d.keyTakeaways,
    personas: d.personas,
    scenarioKeys: d.scenarioKeys,
    faqOverrides: d.faqOverrides,
    midCta: d.midCta,
    relatedArticleSlugs: d.relatedArticleSlugs,
    fundingNotes: d.fundingNotes,
    showFundingCard: d.showFundingCard,
    showROICard: d.showROICard,
    showCostEstimator: d.showCostEstimator,
    schoolFilterHints: d.schoolFilterHints,
    experienceFilterHints: d.experienceFilterHints ?? {
      minDurationMonths: d.minMonths,
      maxDurationMonths: d.maxMonths,
    },
    monthsAssumedForSchoolEstimate: d.monthsAssumedForSchoolEstimate ?? Math.round((d.minMonths + d.maxMonths) / 2),
  };
}
