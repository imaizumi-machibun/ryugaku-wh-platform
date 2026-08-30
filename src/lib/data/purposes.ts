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
// 留学・ワーホリの目的別マスター
// /countries/[slug]/purpose/[purpose] のジェネレータが参照
// ============================================================

export type Purpose = {
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
  targetKeywords: string[];
  recommendedDurationMonths: { min: number; max: number };
  whoFor: string;
  highlights: string[];

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

export const PURPOSES: Purpose[] = [
  {
    slug: 'language',
    label: '語学留学',
    shortLabel: '語学留学',
    description: '語学力を体系的に伸ばしたい方向け。短期から長期まで自分に合った学校を選べる。',
    targetKeywords: ['語学留学', '英語留学', '短期語学留学', '社会人 語学留学'],
    recommendedDurationMonths: { min: 1, max: 12 },
    whoFor: '英語/現地語の運用力を集中的に伸ばしたい方',
    highlights: ['語学学校の集中授業', 'TOEIC/IELTS対策可', '社会人の休職留学にも対応'],
  },
  {
    slug: 'working-holiday',
    label: 'ワーキングホリデー',
    shortLabel: 'ワーキングホリデー',
    description: '働きながら現地で生活し、語学と国際経験を同時に得るプログラム。18〜30歳が対象。',
    targetKeywords: ['ワーホリ', 'ワーキングホリデー', 'ワーホリ ビザ', 'ワーホリ 仕事'],
    recommendedDurationMonths: { min: 6, max: 24 },
    whoFor: '18〜30歳で、現地で働きながら長期滞在したい方',
    highlights: ['ビザ取得が比較的容易', '働いて生活費を稼げる', '最長2〜3年滞在可能な国も'],
  },
  {
    slug: 'university',
    label: '大学進学・正規留学',
    shortLabel: '大学進学',
    description: '海外大学・大学院への正規入学を目指す留学。1〜4年の長期滞在が前提。',
    targetKeywords: ['大学留学', '海外大学 進学', '正規留学', '修士留学'],
    recommendedDurationMonths: { min: 12, max: 48 },
    whoFor: '海外で学位を取得したい高校生・大学生・社会人',
    highlights: ['学位取得', '英語+専門知識', '将来の海外就職に直結'],
  },
  {
    slug: 'internship',
    label: 'インターンシップ',
    shortLabel: 'インターン',
    description: '海外企業で実務経験を積む有給/無給インターン。キャリアアップ志向の方に。',
    targetKeywords: ['海外インターン', '英語 インターンシップ', '海外 仕事 経験'],
    recommendedDurationMonths: { min: 3, max: 12 },
    whoFor: '海外実務経験を履歴書に書きたい大学生・若手社会人',
    highlights: ['実務経験', '英語ビジネス力', '帰国後の就活に有利'],
  },
  {
    slug: 'parent-child',
    label: '親子留学',
    shortLabel: '親子留学',
    description: '子どもと一緒に短期〜中期で留学する形態。サマースクールが人気。',
    targetKeywords: ['親子留学', '小学生 留学', '子連れ 留学', 'サマースクール 海外'],
    recommendedDurationMonths: { min: 1, max: 6 },
    whoFor: 'お子さんの語学・国際感覚を育てたい家族',
    highlights: ['短期から可', '夏休み・春休み対応', '家族向けプログラム充実'],
  },
];

export function getPurposeBySlug(slug: string): Purpose | undefined {
  return PURPOSES.find((p) => p.slug === slug);
}

// ============================================================
// Purpose を SegmentMeta に変換
// /countries/[slug]/purpose/[purpose] では countrySlug を呼び出し側で注入
// ============================================================
export function purposeToSegmentMeta(p: Purpose, countrySlug?: string): SegmentMeta {
  const countrySlugs = countrySlug ? [countrySlug] : undefined;
  return {
    segmentType: countrySlug ? 'country-purpose' : 'purpose',
    slug: countrySlug ? `${countrySlug}-${p.slug}` : p.slug,
    label: p.label,
    h1Override: p.h1Override,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    heroLead: p.heroLead,
    keyTakeaways: p.keyTakeaways,
    personas: p.personas,
    scenarioKeys: p.scenarioKeys,
    faqOverrides: p.faqOverrides,
    midCta: p.midCta,
    relatedArticleSlugs: p.relatedArticleSlugs,
    fundingNotes: p.fundingNotes,
    showFundingCard: p.showFundingCard,
    showROICard: p.showROICard,
    showCostEstimator: p.showCostEstimator,
    schoolFilterHints: p.schoolFilterHints ?? (countrySlugs ? { countrySlugs } : undefined),
    experienceFilterHints: p.experienceFilterHints ?? {
      minDurationMonths: p.recommendedDurationMonths.min,
      maxDurationMonths: p.recommendedDurationMonths.max,
      ...(countrySlugs && { countrySlugs }),
    },
    monthsAssumedForSchoolEstimate:
      p.monthsAssumedForSchoolEstimate ??
      Math.round((p.recommendedDurationMonths.min + p.recommendedDurationMonths.max) / 2),
  };
}
