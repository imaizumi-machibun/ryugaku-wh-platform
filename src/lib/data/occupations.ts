import type {
  Persona,
  SegmentFAQ,
  SegmentFundingNotes,
  SegmentMidCta,
  SegmentMeta,
  SegmentExperienceFilterHints,
  SegmentSchoolFilterHints,
} from '@/lib/segments/types';
import { SCENARIOS } from './scenarios';

const DEFAULT_MID_CTA_MATCHING: SegmentMidCta = {
  title: 'あなたに合う国・職種を診断する',
  description: '6つの質問で、あなたの職種・スキルに合う渡航先と職場プランを提案します。',
  primaryHref: '/matching',
  primaryLabel: '国診断を始める',
  secondaryHref: '/contact',
  secondaryLabel: '個別相談する',
};

function autoSelectScenarioKeysForCountries(countrySlugs: string[], max = 4): string[] {
  const seen = new Set<string>();
  for (const s of SCENARIOS) {
    if (s.countrySlugs.some((c) => countrySlugs.includes(c))) seen.add(s.key);
    if (seen.size >= max) break;
  }
  return Array.from(seen);
}

// ============================================================
// 職業別マスター
// /jobs/[occupation] のジェネレータが参照
// ============================================================

export type Occupation = {
  slug: string;
  label: string;
  description: string;
  targetKeywords: string[];
  recommendedCountries: string[];   // countrySlug[]
  visaTips: string;
  salaryRange?: string;

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

export const OCCUPATIONS: Occupation[] = [
  {
    slug: 'nurse',
    label: '看護師',
    description: '看護師資格を持ち、海外でのキャリアを目指す方向け。オーストラリア/カナダ/イギリスが有力。',
    targetKeywords: ['看護師 ワーホリ', '看護師 海外', '看護師 留学'],
    recommendedCountries: ['australia', 'canada', 'united-kingdom', 'new-zealand'],
    visaTips: '看護師ビザは英語要件(IELTS 7.0等)あり。ワーホリでまず渡航し現地適応する例多数。',
    salaryRange: '時給25〜40 AUD相当',
  },
  {
    slug: 'engineer',
    label: 'エンジニア・IT',
    description: 'IT・Web開発者のための海外キャリア。技術ビザ・スポンサービザでの渡航が現実的。',
    targetKeywords: ['エンジニア 海外', 'IT 海外就職', 'エンジニア ワーホリ'],
    recommendedCountries: ['australia', 'canada', 'germany', 'singapore', 'united-states'],
    visaTips: '技術ビザ(Skilled Migrant)、Tech Talent、H-1B等。ワーホリでネットワーキングする戦略も。',
  },
  {
    slug: 'barista',
    label: 'バリスタ',
    description: 'カフェ大国オーストラリア・ニュージーランドで人気の職種。ワーホリ最定番。',
    targetKeywords: ['バリスタ ワーホリ', 'バリスタ オーストラリア', 'カフェ 仕事'],
    recommendedCountries: ['australia', 'new-zealand', 'canada'],
    visaTips: 'ワーホリビザで取得可能。事前にバリスタ講座修了が望ましい。',
    salaryRange: '時給22〜28 AUD相当',
  },
  {
    slug: 'chef',
    label: '料理人・シェフ',
    description: '日本料理・アジア料理の需要は世界中で高く、シェフは技術ビザにも繋がりやすい。',
    targetKeywords: ['シェフ ワーホリ', '料理人 海外', '寿司職人 海外'],
    recommendedCountries: ['australia', 'canada', 'united-states', 'united-kingdom'],
    visaTips: '日本食レストランは雇用主スポンサーになりやすい。',
  },
  {
    slug: 'hairdresser',
    label: '美容師',
    description: '日本人美容師の技術は海外で高評価。日系サロンでの就労が主流。',
    targetKeywords: ['美容師 ワーホリ', '美容師 海外', 'スタイリスト 海外'],
    recommendedCountries: ['australia', 'canada', 'united-states', 'new-zealand'],
    visaTips: '現地美容師資格が必要な国あり。ワーホリで現地経験を積む人多数。',
  },
  {
    slug: 'designer',
    label: 'デザイナー・クリエイター',
    description: 'デザイン・イラスト・写真等のクリエイター職向け。ワーホリ+リモート案件併用も多い。',
    targetKeywords: ['デザイナー 海外', 'クリエイター ワーホリ', 'フリーランス 海外'],
    recommendedCountries: ['australia', 'germany', 'netherlands', 'canada', 'portugal'],
    visaTips: 'ノマド向けビザのある国（ポルトガル等）も検討候補。',
  },
  {
    slug: 'farmer',
    label: 'ファームジョブ・農業',
    description: 'オーストラリアのセカンドビザ取得条件にも組み込まれる定番ワーホリ職。',
    targetKeywords: ['ファームジョブ', 'ファームステイ', 'セカンドワーホリ 農業'],
    recommendedCountries: ['australia', 'new-zealand', 'canada'],
    visaTips: 'オーストラリアでは88日のスペシファイドワークでセカンドビザ取得可。',
  },
  {
    slug: 'teacher',
    label: '日本語教師・教員',
    description: '日本語を教える仕事は世界中に需要あり。教員資格 or 日本語教師420時間で就職可能。',
    targetKeywords: ['日本語教師 海外', '海外 教員', '日本語 教える 海外'],
    recommendedCountries: ['australia', 'china', 'taiwan', 'south-korea', 'thailand'],
    visaTips: '420時間講座修了 or 大学日本語専攻が条件の場合多。',
  },
  {
    slug: 'office-worker',
    label: '事務職・オフィスワーク',
    description: '日本企業の海外支店、駐在員アシスタント等。バイリンガル人材として需要あり。',
    targetKeywords: ['事務職 海外', '海外 オフィスワーク', '日系企業 海外'],
    recommendedCountries: ['australia', 'singapore', 'thailand', 'vietnam', 'united-states'],
    visaTips: 'ワーホリ後にスポンサービザ取得を狙う流れが多い。',
  },
  {
    slug: 'sales',
    label: '営業・販売',
    description: '小売・観光業の販売員、日本企業の海外営業など。',
    targetKeywords: ['販売員 ワーホリ', '海外 営業'],
    recommendedCountries: ['australia', 'canada', 'new-zealand'],
    visaTips: 'ワーホリビザで短期就労OK。観光地は採用多数。',
  },
  {
    slug: 'translator',
    label: '翻訳・通訳',
    description: '在宅翻訳のリモート案件をしながら海外滞在する人気スタイル。',
    targetKeywords: ['翻訳 海外', '通訳 海外', '翻訳家 海外'],
    recommendedCountries: ['australia', 'portugal', 'thailand', 'malaysia'],
    visaTips: 'リモートワーカー向けノマドビザ活用の選択肢あり。',
  },
  {
    slug: 'au-pair',
    label: 'オーペア',
    description: 'ホストファミリー宅で子守・家事をする代わりに滞在費が無料に。10代後半〜20代前半人気。',
    targetKeywords: ['オーペア', 'オーペア アメリカ', 'au pair'],
    recommendedCountries: ['united-states', 'germany', 'france', 'australia'],
    visaTips: '専用ビザ(J-1等)。最大1〜2年。',
  },
  {
    slug: 'tour-guide',
    label: 'ツアーガイド・観光',
    description: '日本人観光客向けガイド業務。日系旅行会社の現地法人で募集。',
    targetKeywords: ['ツアーガイド ワーホリ', '海外 ガイド', '観光業 ワーホリ'],
    recommendedCountries: ['australia', 'new-zealand', 'canada', 'mexico', 'thailand'],
    visaTips: 'ワーホリビザでスタート、観光業はシーズン雇用が多い。',
  },
  {
    slug: 'student',
    label: '学生（高校・大学生）',
    description: '休学・夏休みを利用した学生ワーホリ/留学。',
    targetKeywords: ['大学生 ワーホリ', '休学 留学', '学生 ワーホリ'],
    recommendedCountries: ['australia', 'canada', 'philippines', 'malta'],
    visaTips: '休学留学なら短期語学留学が人気、休学ワーホリは1年間。',
  },
  {
    slug: 'mom',
    label: '主婦・ママ',
    description: '子育てひと段落の主婦の方や、親子留学を希望するママ向け。',
    targetKeywords: ['主婦 留学', 'ママ 留学', '主婦 ワーホリ'],
    recommendedCountries: ['philippines', 'malta', 'australia', 'canada'],
    visaTips: 'ワーホリは原則30歳まで。31歳以降は短期留学/親子留学/ESLが現実的。',
  },
  {
    slug: 'sports-coach',
    label: 'スポーツコーチ・インストラクター',
    description: 'スキー、ダイビング、ヨガなどスポーツ指導者向け。',
    targetKeywords: ['スキー ワーホリ', 'ヨガ 海外 仕事', 'ダイビング インストラクター 海外'],
    recommendedCountries: ['new-zealand', 'canada', 'australia', 'thailand'],
    visaTips: '資格(PADI, スキー検定等)があれば採用されやすい。',
  },
  {
    slug: 'caregiver',
    label: '介護士',
    description: '介護人材は世界中で不足。日本の介護資格は海外でも評価されつつある。',
    targetKeywords: ['介護士 海外', '介護 ワーホリ', 'ケアワーカー 海外'],
    recommendedCountries: ['australia', 'germany', 'united-kingdom'],
    visaTips: 'ドイツは介護人材向け制度あり。',
  },
  {
    slug: 'freelancer',
    label: 'フリーランス',
    description: 'リモート案件で稼ぎながら海外滞在するライフスタイル。',
    targetKeywords: ['フリーランス 海外', 'ノマド 海外', 'リモートワーク 海外'],
    recommendedCountries: ['portugal', 'thailand', 'malaysia', 'mexico', 'indonesia'],
    visaTips: 'デジタルノマドビザのある国を中心に検討。',
  },
  {
    slug: 'gap-year',
    label: 'ギャップイヤー',
    description: '大学卒業後すぐ就職せず、海外で1年間自分探しをする選択。',
    targetKeywords: ['ギャップイヤー', '新卒 ワーホリ', '卒業後 海外'],
    recommendedCountries: ['australia', 'canada', 'new-zealand', 'ireland'],
    visaTips: 'ワーホリビザは新卒者にも最適。',
  },
  {
    slug: 'second-career',
    label: 'セカンドキャリア・転職前',
    description: '転職前/休職中に海外でキャリアの方向性を見つめ直す。',
    targetKeywords: ['転職 留学', 'キャリアブレイク 海外', '休職 留学'],
    recommendedCountries: ['canada', 'australia', 'united-kingdom', 'philippines'],
    visaTips: '30歳までならワーホリ、31歳以降は短期語学+インターン。',
  },
];

export function getOccupationBySlug(slug: string): Occupation | undefined {
  return OCCUPATIONS.find((o) => o.slug === slug);
}

// ============================================================
// Occupation を SegmentMeta に変換
// scenarioKeys / midCta / heroLead / keyTakeaways は未指定なら
// recommendedCountries / visaTips からフォールバックを自動生成
// ============================================================
export function occupationToSegmentMeta(o: Occupation): SegmentMeta {
  const scenarioKeys = o.scenarioKeys ?? autoSelectScenarioKeysForCountries(o.recommendedCountries);
  const heroLead =
    o.heroLead ??
    `${o.label}が海外で働く・学ぶための現実的なプランをまとめました。${o.description}`;
  const keyTakeaways =
    o.keyTakeaways ?? [
      `${o.label}におすすめの国は${o.recommendedCountries.slice(0, 3).join('・')}`,
      o.visaTips,
      o.salaryRange ? `想定報酬レンジ：${o.salaryRange}` : '渡航前の英語スコア・現地資格要件を要確認',
      'ワーホリビザでまず渡航し、現地で就労ビザに切り替える戦略が一般的',
    ];

  return {
    segmentType: 'occupation',
    slug: o.slug,
    label: o.label,
    h1Override: o.h1Override,
    metaTitle: o.metaTitle,
    metaDescription: o.metaDescription,
    heroLead,
    keyTakeaways,
    personas: o.personas,
    scenarioKeys,
    faqOverrides: o.faqOverrides,
    midCta: o.midCta ?? DEFAULT_MID_CTA_MATCHING,
    relatedArticleSlugs: o.relatedArticleSlugs,
    fundingNotes: o.fundingNotes,
    showFundingCard: o.showFundingCard ?? false,
    showROICard: o.showROICard ?? false,
    showCostEstimator: o.showCostEstimator ?? true,
    schoolFilterHints: o.schoolFilterHints ?? { countrySlugs: o.recommendedCountries },
    experienceFilterHints: o.experienceFilterHints ?? { countrySlugs: o.recommendedCountries },
    monthsAssumedForSchoolEstimate: o.monthsAssumedForSchoolEstimate ?? 12,
  };
}
