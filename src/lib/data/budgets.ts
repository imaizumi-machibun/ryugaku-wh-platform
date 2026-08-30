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
// 予算別マスター
// /budget/[range] のジェネレータが参照
// SegmentMeta 拡張フィールドを optional で持つ
// ============================================================

export type Budget = {
  // 既存
  slug: string;
  label: string;
  minJpy: number;
  maxJpy: number;
  description: string;
  targetKeywords: string[];
  recommendedCountries: string[];
  recommendedDuration: string;

  // 追加（SegmentMeta 由来、optional）
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

const DEFAULT_MID_CTA_CONTACT: SegmentMidCta = {
  title: '個別の費用シミュレーションを無料相談',
  description: 'あなたの希望条件で総額・スケジュール・資金計画を組み立てます。',
  primaryHref: '/contact',
  primaryLabel: '無料で相談する',
  secondaryHref: '/matching',
  secondaryLabel: '国診断ツールを使う',
};

const DEFAULT_MID_CTA_MATCHING: SegmentMidCta = {
  title: 'あなたに合う国を診断する',
  description: '6つの質問で、あなたにフィットする渡航先と予算プランを提案します。',
  primaryHref: '/matching',
  primaryLabel: '国診断を始める',
  secondaryHref: '/contact',
  secondaryLabel: '個別相談する',
};

export const BUDGETS: Budget[] = [
  {
    slug: 'under-300k',
    label: '30万円以下',
    minJpy: 0,
    maxJpy: 300000,
    description: '超短期＆物価安め国狙いの留学。フィリピン・東南アジア中心。',
    targetKeywords: ['30万円 留学', '安い 留学', 'フィリピン 1ヶ月 30万円'],
    recommendedCountries: ['philippines', 'thailand', 'vietnam', 'malaysia'],
    recommendedDuration: '2週間〜1ヶ月',
    h1Override: '【30万円以下】超短期留学プラン｜フィリピン・東南アジアで集中学習',
    metaTitle: '30万円以下で行ける留学｜フィリピン・東南アジアの2週間〜1ヶ月プラン【2026年版】',
    metaDescription: '30万円以下の予算で実現できる留学プランを完全ガイド。フィリピンセブ2週間、韓国・マルタ1ヶ月など、低予算でも効果を出せるシナリオを総額試算・体験談付きで解説。',
    heroLead: '30万円以下の予算でも、行き先・期間・コース設計を最適化すれば、英語力アップに繋がる留学は十分実現可能です。代表的な低予算シナリオを実費ベースで紹介します。',
    keyTakeaways: [
      '30万円以下で実現できる代表的な3パターン（フィリピン2週間・韓国1ヶ月・マルタ短期）',
      'フィリピン留学はマンツーマン中心で短期でも効果が出やすい',
      '航空券・SSP（ビザ）込みの総額試算',
      'シェアハウス活用で生活費を抑えるコツ',
      '低予算でもE-2/SSPなど必要書類は事前準備が必要',
    ],
    scenarioKeys: ['ph-2w', 'ph-1m', 'kr-1m'],
    midCta: DEFAULT_MID_CTA_MATCHING,
    relatedArticleSlugs: ['cebu-study-real-cost', 'korea-study', 'wh-budget-100man'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 1,
    schoolFilterHints: {
      countrySlugs: ['philippines', 'thailand', 'vietnam', 'malaysia'],
      maxTotalEstimateJpy: 300000,
    },
    experienceFilterHints: {
      countrySlugs: ['philippines', 'thailand', 'vietnam', 'malaysia', 'south-korea'],
      maxDurationMonths: 2,
    },
  },
  {
    slug: 'under-500k',
    label: '30〜50万円',
    minJpy: 300000,
    maxJpy: 500000,
    description: 'フィリピン1〜2ヶ月、東南アジア中期が射程に。短期欧米も可。',
    targetKeywords: ['50万円 留学', '50万円 ワーホリ'],
    recommendedCountries: ['philippines', 'malta', 'thailand', 'taiwan'],
    recommendedDuration: '1〜2ヶ月',
    h1Override: '【50万円以下】1〜2ヶ月の語学留学プラン｜フィリピン・マルタ・韓国',
    metaTitle: '50万円以下の留学プラン｜1〜2ヶ月で英語/韓国語を底上げ【2026年版】',
    metaDescription: '50万円以下で実現できる1〜2ヶ月の語学留学を、フィリピン・マルタ・韓国の3シナリオで総額試算。航空券・滞在費込みのリアル費用と、効率的な学習設計のコツを解説。',
    heroLead: '50万円以下なら、フィリピン2ヶ月集中・マルタ1ヶ月・韓国短期など、選択肢が一気に広がります。語学レベルや目的に応じた最適プランを比較できます。',
    keyTakeaways: [
      '50万円以下で実現できる3シナリオの総額試算',
      'フィリピン2ヶ月でTOEIC 100点アップを狙う設計',
      'マルタ・韓国は短期でも欧州/アジア文化体験ができる',
      '滞在費を抑えるシェアハウス・コシテル活用',
    ],
    scenarioKeys: ['ph-1m', 'malta-1m', 'kr-1m'],
    midCta: DEFAULT_MID_CTA_MATCHING,
    relatedArticleSlugs: ['cebu-study-real-cost', 'malta-study', 'korea-study'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 2,
    schoolFilterHints: {
      countrySlugs: ['philippines', 'malta', 'thailand', 'taiwan', 'south-korea'],
      maxTotalEstimateJpy: 500000,
    },
    experienceFilterHints: {
      countrySlugs: ['philippines', 'malta', 'thailand', 'taiwan', 'south-korea'],
      maxDurationMonths: 3,
    },
  },
  {
    slug: 'under-1m',
    label: '50〜100万円',
    minJpy: 500000,
    maxJpy: 1000000,
    description: '欧米3ヶ月、東南アジア半年。短期ワーホリのスタート資金として現実的。',
    targetKeywords: ['100万円 留学', 'ワーホリ 100万円', '100万円 海外'],
    recommendedCountries: ['australia', 'canada', 'new-zealand', 'malta', 'philippines'],
    recommendedDuration: '3〜6ヶ月',
    h1Override: '【100万円以下】3〜6ヶ月の留学・ワーホリスタートプラン',
    metaTitle: '100万円以下で行く留学・ワーホリ｜3〜6ヶ月の現実プラン【2026年版】',
    metaDescription: '100万円以下で実現できる留学・ワーホリスタートプランを、オーストラリア/カナダの短期ワーホリ、マルタ半年、フィリピン長期で総額試算。',
    heroLead: '100万円以下なら、ワーホリのスタート資金として現地で稼ぎながら滞在を伸ばす戦略、または半年集中の語学留学が現実的です。',
    keyTakeaways: [
      '100万円でワーホリ1年を実現するための初期費用設計',
      'マルタ・フィリピン半年集中で英語上達を最大化',
      '現地での就労収入を加味した実質コスト',
      '航空券・ビザ・保険の最適化で20%圧縮可能',
    ],
    scenarioKeys: ['malta-1m', 'au-wh-1y', 'ca-wh-1y'],
    midCta: DEFAULT_MID_CTA_MATCHING,
    relatedArticleSlugs: ['wh-budget-100man', 'malta-study', 'cebu-study-real-cost'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 6,
    schoolFilterHints: {
      countrySlugs: ['australia', 'canada', 'new-zealand', 'malta', 'philippines'],
      maxTotalEstimateJpy: 1000000,
    },
    experienceFilterHints: {
      countrySlugs: ['australia', 'canada', 'new-zealand', 'malta', 'philippines'],
      maxDurationMonths: 7,
    },
  },
  {
    slug: 'under-1.5m',
    label: '100〜150万円',
    minJpy: 1000000,
    maxJpy: 1500000,
    description: 'ワーホリ1年の最低ライン。働きながら現地で補填する前提。',
    targetKeywords: ['150万円 ワーホリ', 'ワーホリ 初期費用'],
    recommendedCountries: ['australia', 'canada', 'new-zealand'],
    recommendedDuration: '1年（働きながら）',
    h1Override: '【150万円】ワーホリ1年の標準予算｜豪/加/NZの初期費用と就労収入',
    metaTitle: '150万円のワーホリ1年プラン｜オーストラリア/カナダ/NZの実費【2026年版】',
    metaDescription: '150万円の予算でワーホリ1年を成立させる実費プランを、オーストラリア・カナダ・ニュージーランドの3シナリオで総額試算。就労収入控除後のリアル数字。',
    heroLead: '150万円はワーホリ1年の標準ライン。現地での就労収入を組み込めば1年継続が可能です。3国の比較と就労見込みを把握できます。',
    keyTakeaways: [
      'ワーホリ1年の初期費用テンプレ（語学3ヶ月＋就労9ヶ月）',
      'オーストラリア/カナダ/NZの就労時給と週時間制限',
      'TFN/SIN等の現地手続き費用',
      'シェアハウス・ファーム滞在で生活費圧縮',
    ],
    scenarioKeys: ['au-wh-1y', 'ca-wh-1y', 'nz-wh-1y', 'de-wh-1y'],
    midCta: DEFAULT_MID_CTA_MATCHING,
    relatedArticleSlugs: ['wh-budget-100man', 'australia-tfn-guide', 'wh-saving-tips'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 3,
    schoolFilterHints: {
      countrySlugs: ['australia', 'canada', 'new-zealand'],
      maxTotalEstimateJpy: 1500000,
    },
    experienceFilterHints: {
      countrySlugs: ['australia', 'canada', 'new-zealand', 'germany'],
      minDurationMonths: 6,
      maxDurationMonths: 13,
    },
  },
  {
    slug: 'under-2m',
    label: '150〜200万円',
    minJpy: 1500000,
    maxJpy: 2000000,
    description: 'ワーホリ1年を余裕を持って実現できる予算帯。',
    targetKeywords: ['200万円 ワーホリ', '200万円 留学'],
    recommendedCountries: ['australia', 'canada', 'united-kingdom', 'ireland'],
    recommendedDuration: '1年（余裕）',
    h1Override: '【200万円】ワーホリ1年＋語学半年｜英語圏で確実に成果を出すプラン',
    metaTitle: '200万円のワーホリ・留学｜豪/加/英で1年滞在を余裕で組むプラン【2026年版】',
    metaDescription: '200万円の予算で英語圏ワーホリ・留学を組み立てる実プランを、オーストラリア・カナダ・英国YMSなどで総額試算。語学半年＋就労6ヶ月の標準パターン。',
    heroLead: '200万円あれば、語学6ヶ月集中＋就労6ヶ月の組み立てや、英国YMSの厳しめな資金証明もクリア可能です。',
    keyTakeaways: [
      '200万円で実現する語学＋就労の標準パターン',
      '英国YMSの抽選条件と資金証明',
      'ロンドン生活費の現実とシェア物件',
      '帰国時の貯金残高目安',
    ],
    scenarioKeys: ['au-wh-1y', 'ca-wh-1y', 'uk-yms-2y', 'de-wh-1y'],
    midCta: DEFAULT_MID_CTA_MATCHING,
    relatedArticleSlugs: ['uk-yms-visa-guide', 'wh-budget-100man', 'london-livecost'],
    showFundingCard: false,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 6,
    schoolFilterHints: {
      countrySlugs: ['australia', 'canada', 'united-kingdom', 'ireland'],
      maxTotalEstimateJpy: 2000000,
    },
    experienceFilterHints: {
      countrySlugs: ['australia', 'canada', 'united-kingdom', 'ireland'],
      minDurationMonths: 9,
      maxDurationMonths: 14,
    },
  },
  {
    slug: 'under-3m',
    label: '200〜300万円',
    minJpy: 2000000,
    maxJpy: 3000000,
    description: '欧米長期留学+ワーホリ複数回が射程内。',
    targetKeywords: ['300万円 留学', '欧米 長期留学'],
    recommendedCountries: ['australia', 'canada', 'united-kingdom', 'united-states'],
    recommendedDuration: '1〜2年',
    h1Override: '【300万円】長期留学・専門コース・ワーホリ2年プラン',
    metaTitle: '300万円で行く長期留学｜カナダPGWP/豪Diploma/UK YMSの2年プラン【2026年版】',
    metaDescription: '300万円の予算で実現する長期留学プランを、カナダカレッジ+PGWP、オーストラリアDiploma、英国YMS 2年などで総額試算。永住権・キャリアチェンジ志望者向け。',
    heroLead: '300万円なら長期滞在・専門コース修了後の就労ビザ取得（PGWP/PSW等）が射程に入ります。永住権やキャリアチェンジを視野に入れたプランが組めます。',
    keyTakeaways: [
      'カナダPGWP取得までの総コストと年数',
      'オーストラリアDiploma+就労の流れ',
      '英国YMS 2年でロンドン就労を実現するプラン',
      'キャリアブランクをポジティブに転換する設計',
    ],
    scenarioKeys: ['uk-yms-2y', 'au-diploma-1y', 'ca-college-pgwp'],
    midCta: DEFAULT_MID_CTA_CONTACT,
    relatedArticleSlugs: ['canada-iec-visa', 'wh-after-30', 'uk-yms-visa-guide'],
    fundingNotes: {
      scholarships: ['JASSO第二種（貸与型）', 'トビタテ留学JAPAN（条件次第）'],
      loans: ['日本政策金融公庫「教育一般貸付」最大450万円', '銀行系教育ローン'],
      selfFundingTip: '長期滞在は為替変動が累積する。初期200万円＋月1万円のバッファを推奨。',
    },
    showFundingCard: true,
    showROICard: false,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 12,
    schoolFilterHints: {
      countrySlugs: ['australia', 'canada', 'united-kingdom', 'united-states'],
      minTotalEstimateJpy: 2000000,
      maxTotalEstimateJpy: 3000000,
    },
    experienceFilterHints: {
      countrySlugs: ['australia', 'canada', 'united-kingdom', 'united-states'],
      minDurationMonths: 12,
    },
  },
  {
    slug: 'under-5m',
    label: '300〜500万円',
    minJpy: 3000000,
    maxJpy: 5000000,
    description: '大学進学やアメリカ正規留学も視野に。',
    targetKeywords: ['アメリカ留学 費用', '大学留学 費用'],
    recommendedCountries: ['australia', 'canada', 'united-states', 'united-kingdom'],
    recommendedDuration: '1〜4年',
    h1Override: '【500万円以下】大学進学・正規留学・MBA準備の現実プラン',
    metaTitle: '500万円以下で行く大学留学・MBA準備｜英国修士・米国コミカレ編入【2026年版】',
    metaDescription: '500万円以下で実現する正規留学プランを、米国コミカレ→4大編入、英国修士1年、カナダPGWPなどで総額試算。奨学金・教育ローンの併用例も解説。',
    heroLead: '500万円以下なら、英国大学院（修士1年）、米国コミカレ→4大編入、医療系正規進学などが現実的な選択肢になります。',
    keyTakeaways: [
      '英国修士1年なら500〜700万円で完結可能',
      '米国は私立より州立out-of-stateの方が大幅に安い',
      'コミカレ→4大編入で総コストを30%圧縮',
      '奨学金と教育ローンを組み合わせた資金計画',
      'IELTS/TOEFLスコアによる学費差',
    ],
    scenarioKeys: ['uk-master-1y', 'us-college-pathway', 'ca-college-pgwp', 'au-diploma-1y'],
    midCta: DEFAULT_MID_CTA_CONTACT,
    relatedArticleSlugs: [
      'uk-postgraduate-cost',
      'us-private-vs-public-university',
      'scholarship-graduate-school',
      'education-loan-overseas',
    ],
    fundingNotes: {
      scholarships: [
        'JASSO（給付型/第二種貸与型）',
        'トビタテ留学JAPAN（給付型）',
        'Chevening（英国・修士1年・帰国義務あり）',
        '大学独自のmerit-based scholarship',
      ],
      loans: [
        '日本政策金融公庫「教育一般貸付」最大450万円',
        '銀行系教育ローン 500〜800万円',
      ],
      selfFundingTip: '自己資金は学費＋初期6ヶ月生活費を最低ラインに。為替バッファ5%必須。',
    },
    showFundingCard: true,
    showROICard: true,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 12,
    schoolFilterHints: {
      countrySlugs: ['australia', 'canada', 'united-states', 'united-kingdom'],
      minTotalEstimateJpy: 3000000,
      maxTotalEstimateJpy: 5000000,
    },
    experienceFilterHints: {
      countrySlugs: ['australia', 'canada', 'united-states', 'united-kingdom'],
      minDurationMonths: 12,
    },
  },
  {
    slug: 'over-5m',
    label: '500万円以上',
    minJpy: 5000000,
    maxJpy: Infinity,
    description: 'アメリカ・イギリスの長期正規留学・MBA等が現実的に。',
    targetKeywords: ['MBA 留学 費用', '大学院留学 費用'],
    recommendedCountries: ['united-states', 'united-kingdom', 'switzerland'],
    recommendedDuration: '2〜4年',
    h1Override: '予算500万円以上の留学プラン｜MBA・米英大学院・正規留学の総額と資金計画【2026年版】',
    metaTitle: '予算500万円以上の留学・MBA・大学院プラン｜総額シミュレーションと資金計画【2026年版】',
    metaDescription: '予算500万円超の留学を、米国大学4年・英国修士1年・MBA・スイス語学・医療系正規進学の5シナリオで総額シミュレーション。奨学金・教育ローン・為替リスク・ROIまで、社会人と保護者の判断材料を体験談ベースでまとめます。',
    heroLead: '500万円超の予算で現実的に検討できる「MBA」「米国大学正規4年」「英国修士1年」「スイス語学」「医療系正規」の5シナリオを、総額試算・要件・資金計画・ROIまで一つの記事で完結できるように整理しました。',
    keyTakeaways: [
      '500万円超で実現できる5シナリオの総額レンジ（1,500万〜3,500万円）',
      '米国MBAと英国修士はROIが組みやすい（3〜8年で回収）',
      '州立out-of-state vs 私立で米国学部は2倍以上の価格差',
      'JASSO・トビタテ・Chevening・Fulbright等の給付奨学金併用が必須',
      '為替変動±5%で総額±50〜150万円動くため事前固定推奨',
    ],
    personas: [
      {
        key: 'mba-aspirant',
        label: 'MBA志望（社会人）',
        intent: 'コンサル・金融・経営層転身を目指す30代前半',
        primaryScenarioKeys: ['mba-2y', 'uk-master-1y'],
      },
      {
        key: 'undergrad-applicant',
        label: '米国大学正規志望（高校生・保護者）',
        intent: '4年制大学卒業を目指す高校生と、その親世代',
        primaryScenarioKeys: ['us-undergrad-4y'],
      },
      {
        key: 'graduate-career-changer',
        label: '大学院修士でキャリアチェンジ',
        intent: '社会人2-5年目で専門スキル取得＋海外キャリア',
        primaryScenarioKeys: ['uk-master-1y', 'mba-2y'],
      },
      {
        key: 'medical-professional',
        label: '医療系資格切替',
        intent: '看護師等の海外資格切替＋永住権志望',
        primaryScenarioKeys: ['med-vocational-2y'],
      },
    ],
    scenarioKeys: ['mba-2y', 'us-undergrad-4y', 'uk-master-1y', 'swiss-language-1y', 'med-vocational-2y'],
    faqOverrides: [
      {
        question: '500万円の予算で行ける留学先は？',
        answer:
          '米国の州立大学2〜3年、英国の修士1年（学費£20〜35k＋ロンドン生活費）、スイスのホスピタリティ系1年、欧州MBA（INSEAD・IESE等の片道分）が現実的な射程です。米国私立大学やトップMBAは500万円では足りず、奨学金・教育ローン併用が前提になります。',
      },
      {
        question: '米国大学正規4年の総額は？',
        answer:
          '州立（out-of-state）で年間学費US$30〜45k＋生活費US$15〜20k、私立で年間学費US$55〜70k。4年で1,800〜3,500万円が一般的なレンジです。500万円だけでは賄えないため、JASSO第二種・トビタテ・大学独自スカラシップの併用が必須になります。',
      },
      {
        question: '英国大学院（修士1年）の総費用の目安は？',
        answer:
          '学費£20,000〜35,000（約400〜700万円）、ロンドン生活費月£1,500〜2,000、IHS（医療保険）£776/年、IELTSやUCAS出願費を加えると、ロンドンで700〜850万円、地方都市で500〜650万円が中央値です。',
      },
      {
        question: 'MBA留学にいくら必要？',
        answer:
          '米国Top10で2年総額3,500〜5,000万円、欧州1年制（INSEAD・IMD・LBS等）で1,500〜2,500万円。500万円は自己資金の頭金として位置づけ、教育ローン（国の教育ローン・銀行系上限あり）＋給付奨学金（IvyリーグFellowship・Fulbright・経団連等）で総額を組み立てるのが現実的です。',
      },
      {
        question: '500万円以上の留学に使える奨学金は？',
        answer:
          '給付型: トビタテ留学JAPAN・Fulbright・Chevening（英）・DAAD（独）・経団連グローバル人材・船井情報科学振興財団。貸与型: JASSO第二種（海外大学院・短期）。学校独自: 米英の大学院は合格時にmerit-based scholarshipが提示されることが多く、出願段階での交渉も視野に。',
      },
      {
        question: '教育ローンはいくらまで借りられる？',
        answer:
          '国の教育ローン（日本政策金融公庫）は1人あたり最大450万円、海外留学は最大450万円（条件により上限緩和）。銀行系教育ローン（オリコ・三井住友信託等）は500〜1,000万円超も可能。返済シミュレーションを必ず作成し、帰国後の想定年収（後述Q9）と照らし合わせるのが基本です。',
      },
      {
        question: '大学院留学に必要な英語スコアは？',
        answer:
          '米国大学院TOEFL 80〜100以上（MBAは100〜110）、英国大学院IELTS 6.5〜7.5（law/journalismは7.5+）、GRE/GMATは専攻次第。スコア未達でConditional Offer（条件付き合格）+語学コース（Pre-sessional）を組み合わせるルートもあります。',
      },
      {
        question: 'ビザ取得時に資金証明はいくら必要？',
        answer:
          '米国F-1: I-20記載の年間費用全額（学費＋生活費）を銀行残高証明で。英国Student visa: コース費用＋ロンドン圏月£1,483×9ヶ月分（約180万円）＋学費残額を最低28日間保持。スイス: 年間生活費CHF21,000〜の証明が必要です。',
      },
      {
        question: '留学後のROI（投資対効果）はどう考える？',
        answer:
          '米国MBA卒の日本帰国時想定年収は1,200〜1,800万円（コンサル・外資金融）、海外現職就職で15〜25万USD。返済10年で月10〜15万円返済が現実的か、卒業3年後の想定年収と照合してください。文系修士は年収増よりキャリアチェンジ目的が中心です。',
      },
      {
        question: '為替リスクと家族同伴の追加費用は？',
        answer:
          '為替は1円動くと米国4年留学で約80〜100万円総額が変動します。学費分は出発前にFX/外貨建定期で一部固定する選択肢も。家族同伴は配偶者ビザ（F-2/Dependant）＋子供の現地校（私立: 年US$20-40k、公立: 学区により条件）、滞在費は単身の1.6〜2倍が目安です。',
      },
    ],
    midCta: {
      title: '500万円以上の留学プランを無料で個別相談',
      description: 'MBA・大学院・正規留学のための資金計画・出願戦略を、あなたの希望と職歴に合わせて設計します。',
      primaryHref: '/contact',
      primaryLabel: '無料で相談する',
      secondaryHref: '/matching',
      secondaryLabel: '国・進路を診断する',
    },
    relatedArticleSlugs: [
      'mba-cost-comparison',
      'scholarship-graduate-school',
      'education-loan-overseas',
      'us-private-vs-public-university',
      'uk-postgraduate-cost',
    ],
    fundingNotes: {
      scholarships: [
        'JASSO（給付型/第二種貸与型）— 大学院海外コース対応',
        'トビタテ留学JAPAN — 給付型・大学生/高校生',
        'Fulbright（米国）— 大学院・研究者向け、競争率高',
        'Chevening（英国）— 修士1年・帰国義務あり',
        'DAAD（独）— ドイツ語学修士・博士',
        '経団連グローバル人材育成スカラシップ',
        '船井情報科学振興財団',
      ],
      loans: [
        '日本政策金融公庫「教育一般貸付」 — 海外留学は最大450万円',
        '銀行系教育ローン（オリコ・三井住友信託・JACCS等）— 500〜1,000万円超',
        'JASSO第二種奨学金（貸与型・有利子）',
      ],
      selfFundingTip:
        '自己資金は学費＋初期6ヶ月分の生活費を最低ラインに。為替変動±5%のバッファを必ず確保。MBAなど高額帯は給付奨学金・教育ローン・自己資金の3本立てが基本。',
    },
    showFundingCard: true,
    showROICard: true,
    showCostEstimator: true,
    monthsAssumedForSchoolEstimate: 24,
    schoolFilterHints: {
      countrySlugs: ['united-states', 'united-kingdom', 'switzerland', 'canada', 'australia'],
      minTotalEstimateJpy: 5000000,
    },
    experienceFilterHints: {
      countrySlugs: ['united-states', 'united-kingdom', 'switzerland', 'canada', 'australia'],
      minDurationMonths: 18,
    },
  },
];

export function getBudgetBySlug(slug: string): Budget | undefined {
  return BUDGETS.find((b) => b.slug === slug);
}

// ============================================================
// Budget を SegmentMeta に変換
// 共通テンプレ・共通関数で扱うためのアダプタ
// ============================================================
export function budgetToSegmentMeta(budget: Budget): SegmentMeta {
  return {
    segmentType: 'budget',
    slug: budget.slug,
    label: budget.label,
    h1Override: budget.h1Override,
    metaTitle: budget.metaTitle,
    metaDescription: budget.metaDescription,
    heroLead: budget.heroLead,
    keyTakeaways: budget.keyTakeaways,
    personas: budget.personas,
    scenarioKeys: budget.scenarioKeys,
    faqOverrides: budget.faqOverrides,
    midCta: budget.midCta,
    relatedArticleSlugs: budget.relatedArticleSlugs,
    fundingNotes: budget.fundingNotes,
    showFundingCard: budget.showFundingCard,
    showROICard: budget.showROICard,
    showCostEstimator: budget.showCostEstimator,
    schoolFilterHints: budget.schoolFilterHints,
    experienceFilterHints: budget.experienceFilterHints,
    monthsAssumedForSchoolEstimate: budget.monthsAssumedForSchoolEstimate,
  };
}
