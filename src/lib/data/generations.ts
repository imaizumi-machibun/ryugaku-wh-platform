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
// 年代別マスター
// /age/[generation] のジェネレータが参照
// ============================================================

export type Generation = {
  slug: string;
  label: string;
  minAge: number;
  maxAge: number;
  description: string;
  targetKeywords: string[];
  whoFor: string;
  recommendedPath: string;

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
  title: 'あなたに合う国・進路を診断する',
  description: '6つの質問で、あなたの年代・目的に合う渡航先を提案します。',
  primaryHref: '/matching',
  primaryLabel: '国診断を始める',
  secondaryHref: '/contact',
  secondaryLabel: '個別相談する',
};

const MID_CTA_CONTACT: SegmentMidCta = {
  title: 'キャリアと予算に合うプランを無料相談',
  description: '年代・職歴・予算からの個別シミュレーションを編集部が作成します。',
  primaryHref: '/contact',
  primaryLabel: '無料で相談する',
  secondaryHref: '/matching',
  secondaryLabel: '国診断ツールを使う',
};

export const GENERATIONS: Generation[] = [
  {
    slug: '20s-early',
    label: '20代前半',
    minAge: 18,
    maxAge: 24,
    description: '学生・新卒の王道ワーホリ世代。語学習得スピードも最速。',
    targetKeywords: ['20代前半 ワーホリ', '大学生 ワーホリ', '新卒 ワーホリ'],
    whoFor: '大学休学者・新卒・専門学校卒',
    recommendedPath: 'ワーホリ1年→大学復学/就職',
    h1Override: '【20代前半】学生・新卒の王道ワーホリ・留学プラン',
    metaTitle: '20代前半のワーホリ・留学｜学生・新卒に最適なプラン総額シミュレーション【2026年版】',
    metaDescription: '20代前半（18-24歳）のワーホリ・留学プランを、オーストラリア・カナダ・NZ・フィリピンの代表シナリオで総額試算。学生・新卒・休学者向けの体験談付き。',
    heroLead: '20代前半は語学習得スピードと体力面で最強の世代。ワーホリビザもほぼ全ての国で問題なく取得可能。学生・新卒に最適なプランを比較できます。',
    keyTakeaways: [
      'ワーホリビザはほぼ全ての国で取得可能',
      '20代前半の総額は100-350万円が中心',
      '学生は休学＋ワーホリの二段階構成も可',
      '語学習得スピードが最も速い世代',
      '就労収入で実質コスト圧縮可能',
    ],
    scenarioKeys: ['au-wh-1y', 'ca-wh-1y', 'nz-wh-1y', 'ph-1m'],
    midCta: MID_CTA_MATCHING,
    relatedArticleSlugs: ['wh-budget-100man', 'fresh-grad-wh', 'cebu-study-real-cost'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 12,
    experienceFilterHints: { countrySlugs: undefined },
  },
  {
    slug: '20s-late',
    label: '20代後半',
    minAge: 25,
    maxAge: 29,
    description: '社会人経験を活かしてキャリア軸でワーホリに行く世代。30歳のリミット前最後の駆け込みも多い。',
    targetKeywords: ['20代後半 ワーホリ', '社会人 ワーホリ', '20代 留学'],
    whoFor: '社会人3〜5年目、転職前',
    recommendedPath: '退職→ワーホリ→帰国後英語スキルで転職',
    h1Override: '社会人のワーホリ完全ガイド｜20代後半の費用・退職タイミング・帰国後転職',
    metaTitle: '社会人のワーホリ完全ガイド｜20代後半の費用・退職タイミング・帰国後転職【2026年版】',
    metaDescription: '20代後半・社会人のワーキングホリデーを完全解説。退職タイミング、社会保険手続き、キャリアへの影響、帰国後の転職活動まで、実体験ベースの一次情報でお答えします。',
    heroLead: '20代後半は「30歳のビザ年齢リミット前最後のチャンス」かつ「社会人経験を活かした現地就労」が両立できる最強の年代。退職タイミングから帰国後の転職まで完全網羅します。',
    keyTakeaways: [
      '社会人ワーホリは25-28歳が最も動きやすい',
      '退職タイミング・社会保険・年金・住民税の手続き',
      'キャリアブランクを「投資期間」に変える戦略',
      '英国YMS 2年で社会人転身も視野',
      '帰国後3ヶ月で内定獲得の標準スケジュール',
    ],
    scenarioKeys: ['au-wh-1y', 'ca-wh-1y', 'uk-yms-2y', 'uk-master-1y', 'mba-2y'],
    midCta: MID_CTA_CONTACT,
    relatedArticleSlugs: ['after-wh', 'wh-budget-100man', 'wh-job-hunting-japan', 'regret'],
    showFundingCard: false,
    showROICard: true,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 12,
  },
  {
    slug: '30s',
    label: '30代',
    minAge: 30,
    maxAge: 39,
    description: 'ワーホリ最終リミット30歳超え。アイルランドや一部国は35歳までOK。語学留学+インターン中心。',
    targetKeywords: ['30代 ワーホリ', '30代 留学', '30代 海外'],
    whoFor: '30代キャリアブレイク・転職前',
    recommendedPath: '短期語学留学+海外就職活動',
    h1Override: '【30代】キャリアチェンジ・大学院留学の現実プラン',
    metaTitle: '30代のワーホリ・大学院留学｜キャリアチェンジ・35歳までOKな国【2026年版】',
    metaDescription: '30代の留学プランを、英国修士1年・MBA・カナダPGWP・オーストラリア（35歳まで）の代表シナリオで総額試算。キャリアブランクを最小化する戦略付き。',
    heroLead: '30代はワーホリ年齢制限が出始める世代ですが、大学院修士1年・MBA・カナダPGWPなど社会人としての投資価値が高いプランが豊富です。',
    keyTakeaways: [
      '30代でもオーストラリア（35歳まで）等は申請可能',
      '英国修士1年で投資回収しやすい構造',
      'MBA・カナダPGWP・米国学部編入が射程',
      '帰国後の転職市場で「即戦力＋語学」評価',
      '資金計画は教育ローン併用が現実的',
    ],
    scenarioKeys: ['uk-master-1y', 'mba-2y', 'ca-college-pgwp', 'au-diploma-1y', 'ph-1m'],
    midCta: MID_CTA_CONTACT,
    relatedArticleSlugs: [
      '30s-guide',
      'after-wh',
      'mba-cost-comparison',
      'scholarship-graduate-school',
      'uk-postgraduate-cost',
    ],
    fundingNotes: {
      scholarships: ['Chevening（英国・社会人向き）', 'JASSO第二種貸与', '伊藤国際教育交流財団'],
      loans: ['日本政策金融公庫教育一般貸付', '銀行系教育ローン'],
      selfFundingTip: '30代は教育ローン＋給付奨学金併用が主流。配偶者の収入もポートフォリオに組み込む。',
    },
    showFundingCard: true,
    showROICard: true,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 12,
  },
  {
    slug: '40s',
    label: '40代以上',
    minAge: 40,
    maxAge: 100,
    description: 'ミドル世代の留学。語学学校はもちろん、シニア向けプログラムも増加中。',
    targetKeywords: ['40代 留学', '主婦 留学', 'シニア 留学'],
    whoFor: 'セカンドキャリア層・子育てひと段落',
    recommendedPath: '短期語学留学+観光のミックス',
    h1Override: '【40代以上】ミドル・シニアの語学留学プラン',
    metaTitle: '40代以上の語学留学｜セカンドキャリア・親子留学・短期集中プラン【2026年版】',
    metaDescription: '40代以上の語学留学を、フィリピン・マルタ・韓国の短期集中シナリオで総額試算。シニア向けプログラム、親子留学、セカンドキャリア向けの現実プラン。',
    heroLead: 'ワーホリ年齢制限を超えていても、短期語学留学・親子留学・観光ミックスなど40代以上に最適化されたプランが充実しています。',
    keyTakeaways: [
      'ワーホリは原則30歳まで、40代以上は短期語学が現実的',
      'フィリピン・マルタは40代以上の参加者も多い',
      '親子留学プログラムも豊富',
      '健康保険は厚めに設計',
      '観光ミックス型で楽しみながら学べる',
    ],
    scenarioKeys: ['ph-1m', 'malta-1m', 'kr-1m'],
    midCta: MID_CTA_MATCHING,
    relatedArticleSlugs: ['cebu-study-real-cost', 'malta-study', 'family-study'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 1,
  },
  {
    slug: 'students',
    label: '学生（高校・大学生）',
    minAge: 16,
    maxAge: 22,
    description: '休学・夏休み・春休み・卒業前を活用した学生留学。',
    targetKeywords: ['高校生 留学', '大学生 留学', '休学 留学'],
    whoFor: '高校生・大学生',
    recommendedPath: '夏休み短期→休学長期 の二段階',
    h1Override: '【学生】高校生・大学生の留学・休学プラン',
    metaTitle: '高校生・大学生の留学｜夏休み短期から休学1年までの完全プラン【2026年版】',
    metaDescription: '高校生・大学生の留学プランを、夏休み短期（フィリピン2週間）から休学1年（ワーホリ）まで網羅。米国大学正規留学・英国大学進学のシナリオも収録。',
    heroLead: '学生は最も柔軟に留学プランを組める世代。夏休み短期から休学1年、米国正規留学までフェーズ別に設計できます。',
    keyTakeaways: [
      '夏休み短期＋休学長期の二段階が王道',
      '休学ワーホリで1年集中も可能',
      '米国大学正規留学なら4年総額1,800-3,500万円',
      'コミカレ→4年制編入でコスト圧縮',
      'JASSO・トビタテ等の給付奨学金併用',
    ],
    scenarioKeys: ['ph-2w', 'ph-1m', 'au-wh-1y', 'us-college-pathway', 'us-undergrad-4y'],
    midCta: MID_CTA_MATCHING,
    relatedArticleSlugs: [
      'us-private-vs-public-university',
      'scholarship-graduate-school',
      'cebu-study-real-cost',
      'wh-budget-100man',
    ],
    showFundingCard: true,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 6,
  },
];

export function getGenerationBySlug(slug: string): Generation | undefined {
  return GENERATIONS.find((g) => g.slug === slug);
}

export function ageToGenerationSlug(age: number): string {
  if (age < 25) return '20s-early';
  if (age < 30) return '20s-late';
  if (age < 40) return '30s';
  return '40s';
}

// ============================================================
// Generation を SegmentMeta に変換
// ============================================================
export function generationToSegmentMeta(g: Generation): SegmentMeta {
  return {
    segmentType: 'age',
    slug: g.slug,
    label: g.label,
    h1Override: g.h1Override,
    metaTitle: g.metaTitle,
    metaDescription: g.metaDescription,
    heroLead: g.heroLead,
    keyTakeaways: g.keyTakeaways,
    personas: g.personas,
    scenarioKeys: g.scenarioKeys,
    faqOverrides: g.faqOverrides,
    midCta: g.midCta,
    relatedArticleSlugs: g.relatedArticleSlugs,
    fundingNotes: g.fundingNotes,
    showFundingCard: g.showFundingCard,
    showROICard: g.showROICard,
    showCostEstimator: g.showCostEstimator,
    schoolFilterHints: g.schoolFilterHints,
    experienceFilterHints: g.experienceFilterHints,
    monthsAssumedForSchoolEstimate: g.monthsAssumedForSchoolEstimate,
  };
}
