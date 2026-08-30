// ============================================================
// Segment 共通型
// 絞り込み一覧ページ（budget / duration / age / jobs / purpose / cities）
// が共通で参照する型定義
// ============================================================

export type SegmentType =
  | 'budget'
  | 'duration'
  | 'age'
  | 'occupation'
  | 'purpose'
  | 'city'
  | 'country-purpose'
  | 'country-city';

export type ScenarioBreakdownItem = {
  item: string;
  lowJpy: number;
  highJpy: number;
  note?: string;
};

export type Scenario = {
  key: string;
  label: string;
  audience: string;
  durationMonths: { min: number; max: number };
  countrySlugs: string[];
  totalJpy: { min: number; max: number };
  breakdown: ScenarioBreakdownItem[];
  requirementNote?: string;
  roi?: {
    yearsToRecover: { min: number; max: number };
    expectedIncomeJpy?: { min: number; max: number };
    note?: string;
  };
  relatedArticleSlugs?: string[];
};

export type Persona = {
  key: string;
  label: string;
  intent: string;
  primaryScenarioKeys: string[];
};

export type SegmentMidCta = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export type SegmentFundingNotes = {
  scholarships?: string[];
  loans?: string[];
  selfFundingTip?: string;
};

export type SegmentSchoolFilterHints = {
  minTotalEstimateJpy?: number;
  maxTotalEstimateJpy?: number;
  countrySlugs?: string[];
  courseTypes?: string[];
};

export type SegmentExperienceFilterHints = {
  minDurationMonths?: number;
  maxDurationMonths?: number;
  minTotalEstimateJpy?: number;
  maxTotalEstimateJpy?: number;
  countrySlugs?: string[];
  regionSlugs?: string[];
  languageSlugs?: string[];
};

export type SegmentFAQ = {
  question: string;
  answer: string;
};

export type SegmentMeta = {
  segmentType: SegmentType;
  slug: string;
  label: string;
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
