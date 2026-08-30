import type { Country, Experience, School, CourseType, CostLevel } from '@/lib/microcms/types';
import type { Scenario } from './types';

// ============================================================
// 共通固定費（為替注記の根拠と同期させる）
// ExchangeRateNotice.tsx の表記とこの定数を必ず同時に更新すること
// ============================================================
export const COST_ASSUMPTIONS = {
  flightJpyRoundTrip: 300_000,
  insuranceJpyPerYear: 200_000,
  bookFeeJpyPerYear: 80_000,
  visaDefaultJpy: 30_000,
  exchangeRateNote: '1USD=155円換算（2026年Q2時点、為替により±5%変動）',
  exchangeRateUpdatedAt: '2026-06-04',
} as const;

const WEEKS_PER_MONTH = 4.345;

const TUITION_BY_COST_LEVEL_WEEKLY_JPY: Record<CostLevel, { low: number; high: number }> = {
  low: { low: 25_000, high: 45_000 },
  medium: { low: 45_000, high: 80_000 },
  high: { low: 70_000, high: 120_000 },
  'very-high': { low: 100_000, high: 180_000 },
};

const COURSE_TYPE_MULTIPLIER: Record<CourseType, number> = {
  general: 1.0,
  conversation: 0.95,
  business: 1.25,
  'exam-prep': 1.2,
  intensive: 1.35,
};

function getCountryCostLevel(country?: Country): CostLevel {
  return country?.costLevel ?? 'medium';
}

function estimateTuitionWeeklyByCountry(country: Country | undefined): { low: number; high: number } {
  return TUITION_BY_COST_LEVEL_WEEKLY_JPY[getCountryCostLevel(country)];
}

function estimateLivingMonthlyByCountry(country: Country | undefined): number {
  if (country?.livingCostMonthJpy != null) return country.livingCostMonthJpy;
  switch (getCountryCostLevel(country)) {
    case 'low':
      return 80_000;
    case 'medium':
      return 130_000;
    case 'high':
      return 180_000;
    case 'very-high':
      return 250_000;
  }
}

function estimateVisaCost(country: Country | undefined): number {
  return country?.visaCostJpy ?? COST_ASSUMPTIONS.visaDefaultJpy;
}

function estimateInsurance(months: number): number {
  return Math.round((COST_ASSUMPTIONS.insuranceJpyPerYear / 12) * months);
}

function estimateBookFee(months: number): number {
  return Math.round((COST_ASSUMPTIONS.bookFeeJpyPerYear / 12) * months);
}

// ============================================================
// 体験談の総額推計
// ============================================================
export function estimateExperienceTotalJpy(exp: Experience): number | null {
  const months = exp.durationMonths;
  if (!months || months <= 0) return null;

  const weeks = months * WEEKS_PER_MONTH;
  const country = exp.country;

  let tuition: number;
  if (exp.school?.weeklyFeeLow != null && exp.school?.weeklyFeeHigh != null) {
    const mid = (exp.school.weeklyFeeLow + exp.school.weeklyFeeHigh) / 2;
    tuition = mid * weeks;
  } else if (exp.school?.weeklyFeeLow != null) {
    tuition = exp.school.weeklyFeeLow * weeks;
  } else {
    const range = estimateTuitionWeeklyByCountry(country);
    tuition = ((range.low + range.high) / 2) * weeks;
  }

  const livingMonthly = exp.monthlyLivingJpy ?? estimateLivingMonthlyByCountry(country);
  const living = livingMonthly * months;

  const income = (exp.monthlyIncomeJpy ?? 0) * months;
  const visa = estimateVisaCost(country);
  const flight = COST_ASSUMPTIONS.flightJpyRoundTrip;
  const insurance = estimateInsurance(months);

  return Math.max(0, Math.round(tuition + living + visa + flight + insurance - income));
}

// ============================================================
// 学校の総額推計（指定された期間で滞在した場合）
// ============================================================
export function estimateSchoolTotalJpy(school: School, monthsAssumed: number): number {
  const weeks = monthsAssumed * WEEKS_PER_MONTH;
  const tuitionWeekly = school.weeklyFeeHigh ?? school.weeklyFeeLow ?? estimateTuitionWeeklyByCountry(school.country).high;
  const tuition = tuitionWeekly * weeks;
  const living = estimateLivingMonthlyByCountry(school.country) * monthsAssumed;
  const visa = estimateVisaCost(school.country);
  const flight = COST_ASSUMPTIONS.flightJpyRoundTrip;
  const insurance = estimateInsurance(monthsAssumed);
  return Math.round(tuition + living + visa + flight + insurance);
}

// ============================================================
// シナリオの総額レンジ
// ============================================================
export function estimateScenarioTotalJpy(scenario: Scenario): { min: number; max: number } {
  return scenario.totalJpy;
}

// ============================================================
// CostEstimator ウィジェット用のクイック試算
// ============================================================
export type QuickEstimateInput = {
  country: Country;
  months: number;
  courseType?: CourseType;
  hasWorkIncome?: boolean;
  estimatedMonthlyIncomeJpy?: number;
};

export type QuickEstimateResult = {
  tuition: number;
  living: number;
  visa: number;
  flight: number;
  insurance: number;
  bookFee: number;
  income: number;
  total: number;
  breakdown: { label: string; valueJpy: number }[];
};

export function quickEstimate(input: QuickEstimateInput): QuickEstimateResult {
  const { country, months, courseType = 'general', hasWorkIncome = false, estimatedMonthlyIncomeJpy } = input;
  const safeMonths = Math.max(0.5, months);
  const weeks = safeMonths * WEEKS_PER_MONTH;

  const tuitionRange = estimateTuitionWeeklyByCountry(country);
  const tuitionWeekly = ((tuitionRange.low + tuitionRange.high) / 2) * COURSE_TYPE_MULTIPLIER[courseType];
  const tuition = Math.round(tuitionWeekly * weeks);

  const livingMonthly = estimateLivingMonthlyByCountry(country);
  const living = Math.round(livingMonthly * safeMonths);

  const visa = estimateVisaCost(country);
  const flight = COST_ASSUMPTIONS.flightJpyRoundTrip;
  const insurance = estimateInsurance(safeMonths);
  const bookFee = estimateBookFee(safeMonths);

  let income = 0;
  if (hasWorkIncome) {
    const monthlyIncome = estimatedMonthlyIncomeJpy ?? 120_000;
    income = Math.round(monthlyIncome * safeMonths);
  }

  const total = Math.max(0, tuition + living + visa + flight + insurance + bookFee - income);

  return {
    tuition,
    living,
    visa,
    flight,
    insurance,
    bookFee,
    income,
    total,
    breakdown: [
      { label: '学費', valueJpy: tuition },
      { label: '生活費', valueJpy: living },
      { label: 'ビザ', valueJpy: visa },
      { label: '航空券（往復）', valueJpy: flight },
      { label: '保険', valueJpy: insurance },
      { label: '教材・諸費用', valueJpy: bookFee },
      ...(income > 0 ? [{ label: '想定収入（控除）', valueJpy: -income }] : []),
    ],
  };
}

export function formatJpyShort(jpy: number): string {
  if (jpy >= 100_000_000) return `${(jpy / 100_000_000).toFixed(1)}億円`;
  if (jpy >= 10_000) return `${Math.round(jpy / 10_000).toLocaleString()}万円`;
  return `${jpy.toLocaleString()}円`;
}
