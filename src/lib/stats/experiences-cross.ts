import type { Experience } from '@/lib/microcms/types';

// ============================================================
// 体験談77件から作る独自統計のためのクロス集計ヘルパー
// 全関数 n=◯件 を明示できるよう件数を返す
// ============================================================

export type CountedItem = { label: string; count: number };

/**
 * 出発月分布（publishedAt or createdAt から月を推定）
 * 注: 厳密な出発月フィールドがないため、投稿月をプロキシとして使用
 */
export function getDepartureMonthDistribution(experiences: Experience[]): {
  monthly: { month: number; count: number }[];
  total: number;
} {
  const counts = new Array(12).fill(0) as number[];
  let total = 0;
  for (const exp of experiences) {
    const iso = exp.publishedAt || exp.createdAt;
    if (!iso) continue;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;
    counts[d.getMonth()]++;
    total++;
  }
  return {
    monthly: counts.map((count, i) => ({ month: i + 1, count })),
    total,
  };
}

/**
 * 男女別評価平均
 */
export function getGenderRatingAverage(experiences: Experience[]): {
  female: { overall: number; safety: number; job: number; count: number };
  male: { overall: number; safety: number; job: number; count: number };
} {
  const calc = (filtered: Experience[]) => {
    if (filtered.length === 0) return { overall: 0, safety: 0, job: 0, count: 0 };
    const avg = (vals: (number | undefined)[]) => {
      const valid = vals.filter((v): v is number => v != null);
      return valid.length === 0 ? 0 : Math.round((valid.reduce((s, v) => s + v, 0) / valid.length) * 10) / 10;
    };
    return {
      overall: avg(filtered.map((e) => e.ratingOverall)),
      safety: avg(filtered.map((e) => e.ratingSafety)),
      job: avg(filtered.map((e) => e.ratingJob)),
      count: filtered.length,
    };
  };
  return {
    female: calc(experiences.filter((e) => e.gender === 'female')),
    male: calc(experiences.filter((e) => e.gender === 'male')),
  };
}

const LANG_LEVEL_ORDER: Record<string, number> = {
  beginner: 1,
  elementary: 2,
  intermediate: 3,
  'upper-intermediate': 4,
  advanced: 5,
};

const LANG_LEVEL_LABEL: Record<string, string> = {
  beginner: '初級',
  elementary: '初級〜中級',
  intermediate: '中級',
  'upper-intermediate': '中上級',
  advanced: '上級',
};

/**
 * 言語レベルの上達率（before → after のクロス集計）
 */
export function getLanguageProgressStats(experiences: Experience[]): {
  improvedCount: number;
  noChangeCount: number;
  totalWithBoth: number;
  beginnerStartImproved: number;
  beginnerStartTotal: number;
  byBefore: { label: string; total: number; improved: number; advancedRate: number }[];
} {
  let improved = 0;
  let noChange = 0;
  let beginnerImproved = 0;
  let beginnerTotal = 0;
  const byBefore = new Map<string, { total: number; improved: number; reachedIntermediate: number }>();

  for (const exp of experiences) {
    const beforeKey = exp.languageBefore;
    const afterKey = exp.languageAfter;
    if (!beforeKey || !afterKey) continue;
    const beforeLevel = LANG_LEVEL_ORDER[beforeKey] ?? 0;
    const afterLevel = LANG_LEVEL_ORDER[afterKey] ?? 0;
    if (beforeLevel === 0 || afterLevel === 0) continue;

    const entry = byBefore.get(beforeKey) ?? { total: 0, improved: 0, reachedIntermediate: 0 };
    entry.total++;
    if (afterLevel > beforeLevel) {
      improved++;
      entry.improved++;
    } else {
      noChange++;
    }
    if (afterLevel >= 3) entry.reachedIntermediate++;
    byBefore.set(beforeKey, entry);

    if (beforeKey === 'beginner') {
      beginnerTotal++;
      if (afterLevel > 1) beginnerImproved++;
    }
  }

  return {
    improvedCount: improved,
    noChangeCount: noChange,
    totalWithBoth: improved + noChange,
    beginnerStartImproved: beginnerImproved,
    beginnerStartTotal: beginnerTotal,
    byBefore: Array.from(byBefore.entries()).map(([key, v]) => ({
      label: LANG_LEVEL_LABEL[key] ?? key,
      total: v.total,
      improved: v.improved,
      advancedRate: v.total === 0 ? 0 : Math.round((v.reachedIntermediate / v.total) * 100),
    })),
  };
}

/**
 * advice/cons/pros テキストから特定キーワードを含むものをカウント
 * 返却: { containsCount, totalChecked, percentage, samples（3件） }
 */
export function countMentions(
  experiences: Experience[],
  keywords: RegExp,
  options: { source?: 'advice' | 'cons' | 'pros' | 'all' } = {}
): {
  containsCount: number;
  totalChecked: number;
  percentage: number;
  samples: Experience[];
} {
  const source = options.source ?? 'all';
  let containsCount = 0;
  const samples: Experience[] = [];
  for (const exp of experiences) {
    let text = '';
    if (source === 'advice' || source === 'all') text += ' ' + (exp.advice ?? '');
    if (source === 'cons' || source === 'all') text += ' ' + (exp.cons?.map((c) => c.text).join(' ') ?? '');
    if (source === 'pros' || source === 'all') text += ' ' + (exp.pros?.map((p) => p.text).join(' ') ?? '');
    if (keywords.test(text)) {
      containsCount++;
      if (samples.length < 3) samples.push(exp);
    }
  }
  return {
    containsCount,
    totalChecked: experiences.length,
    percentage: experiences.length === 0 ? 0 : Math.round((containsCount / experiences.length) * 100),
    samples,
  };
}

/**
 * 国別の体験談集計（job/safety/cost評価）
 */
export function getCountryAggregation(experiences: Experience[]): {
  slug: string;
  name: string;
  flag?: string;
  count: number;
  monthlyLivingAvg: number | null;
  ratingOverall: number;
  ratingJob: number;
  ratingSafety: number;
}[] {
  const map = new Map<string, {
    name: string;
    flag?: string;
    livings: number[];
    overall: number[];
    job: number[];
    safety: number[];
  }>();
  for (const exp of experiences) {
    if (!exp.country?.id) continue;
    const entry = map.get(exp.country.id) ?? {
      name: exp.country.nameJp,
      flag: exp.country.flagEmoji,
      livings: [],
      overall: [],
      job: [],
      safety: [],
    };
    if (exp.monthlyLivingJpy != null) entry.livings.push(exp.monthlyLivingJpy);
    if (exp.ratingOverall != null) entry.overall.push(exp.ratingOverall);
    if (exp.ratingJob != null) entry.job.push(exp.ratingJob);
    if (exp.ratingSafety != null) entry.safety.push(exp.ratingSafety);
    map.set(exp.country.id, entry);
  }
  const avg = (vals: number[]) =>
    vals.length === 0 ? 0 : Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;

  return Array.from(map.entries()).map(([slug, v]) => ({
    slug,
    name: v.name,
    flag: v.flag,
    count: v.overall.length,
    monthlyLivingAvg: v.livings.length === 0 ? null : Math.round(v.livings.reduce((s, n) => s + n, 0) / v.livings.length),
    ratingOverall: avg(v.overall),
    ratingJob: avg(v.job),
    ratingSafety: avg(v.safety),
  }));
}

/**
 * 体験談から最初に見つかった「指定パターンに合う文」を抽出（引用用）
 */
export function extractMatchingSentence(text: string, pattern: RegExp, minLen = 15, maxLen = 120): string | null {
  if (!text) return null;
  const sentences = text.split(/[。．！!?？]/);
  for (const s of sentences) {
    const trimmed = s.trim();
    if (trimmed.length >= minLen && trimmed.length <= maxLen && pattern.test(trimmed)) {
      return trimmed + '。';
    }
  }
  return null;
}

/**
 * 体験談から任意のテキスト抽出（パターン無視、長さだけ）
 */
export function extractAnySentence(text: string, minLen = 20, maxLen = 120): string | null {
  if (!text) return null;
  const sentences = text.split(/[。．！!?？]/);
  for (const s of sentences) {
    const trimmed = s.trim();
    if (trimmed.length >= minLen && trimmed.length <= maxLen) {
      return trimmed + '。';
    }
  }
  return null;
}

// ============================================================
// 調査レポート（/research）用の追加集計関数
// すべて n=件数 を返し、引用に耐える統計を出す
// ============================================================

function meanRounded(vals: number[]): number | null {
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
}

function median(vals: number[]): number | null {
  if (vals.length === 0) return null;
  const sorted = [...vals].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function avg1(vals: number[]): number {
  if (vals.length === 0) return 0;
  return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
}

/**
 * レポート冒頭のサマリー指標（各指標に分母 n を同梱）
 */
export function getReportSummary(experiences: Experience[]): {
  totalCount: number;
  avgOverall: number;
  avgOverallN: number;
  medianMonthlyLiving: number | null;
  monthlyLivingN: number;
  recommendRate: number;
  recommendN: number;
  avgDurationMonths: number | null;
  durationN: number;
} {
  const overalls = experiences.map((e) => e.ratingOverall).filter((v): v is number => v != null);
  const livings = experiences.map((e) => e.monthlyLivingJpy).filter((v): v is number => v != null);
  const durations = experiences.map((e) => e.durationMonths).filter((v): v is number => v != null);
  const recommendResponders = experiences.filter((e) => e.wouldRecommend != null);
  const recommendYes = recommendResponders.filter((e) => e.wouldRecommend === true);
  return {
    totalCount: experiences.length,
    avgOverall: avg1(overalls),
    avgOverallN: overalls.length,
    medianMonthlyLiving: median(livings),
    monthlyLivingN: livings.length,
    recommendRate:
      recommendResponders.length === 0
        ? 0
        : Math.round((recommendYes.length / recommendResponders.length) * 100),
    recommendN: recommendResponders.length,
    avgDurationMonths: durations.length === 0 ? null : avg1(durations),
    durationN: durations.length,
  };
}

/**
 * 費用の内訳統計（家賃・食費・生活費合計・収入）
 */
export function getCostBreakdownStats(experiences: Experience[]): {
  key: string;
  label: string;
  avg: number | null;
  median: number | null;
  count: number;
}[] {
  const fields: { key: 'monthlyRentJpy' | 'monthlyFoodJpy' | 'monthlyLivingJpy' | 'monthlyIncomeJpy'; label: string }[] = [
    { key: 'monthlyRentJpy', label: '家賃（月）' },
    { key: 'monthlyFoodJpy', label: '食費（月）' },
    { key: 'monthlyLivingJpy', label: '生活費合計（月）' },
    { key: 'monthlyIncomeJpy', label: '収入（月）' },
  ];
  return fields.map(({ key, label }) => {
    const vals = experiences
      .map((e) => e[key])
      .filter((v): v is number => typeof v === 'number');
    return { key, label, avg: meanRounded(vals), median: median(vals), count: vals.length };
  });
}

export type RatingAxis = 'overall' | 'safety' | 'job' | 'cost' | 'lifestyle' | 'language';

const RATING_FIELD: Record<RatingAxis, 'ratingOverall' | 'ratingSafety' | 'ratingJob' | 'ratingCost' | 'ratingLifestyle' | 'ratingLanguage'> = {
  overall: 'ratingOverall',
  safety: 'ratingSafety',
  job: 'ratingJob',
  cost: 'ratingCost',
  lifestyle: 'ratingLifestyle',
  language: 'ratingLanguage',
};

/**
 * 評価軸ごとの★1〜5分布（度数分布グラフ用）
 */
export function getRatingDistribution(experiences: Experience[], axis: RatingAxis): {
  distribution: { star: number; count: number }[];
  total: number;
  average: number;
} {
  const field = RATING_FIELD[axis];
  const counts = [0, 0, 0, 0, 0];
  const vals: number[] = [];
  for (const e of experiences) {
    const v = e[field];
    if (typeof v !== 'number') continue;
    const star = Math.min(5, Math.max(1, Math.round(v)));
    counts[star - 1]++;
    vals.push(v);
  }
  return {
    distribution: counts.map((count, i) => ({ star: i + 1, count })),
    total: vals.length,
    average: avg1(vals),
  };
}

/**
 * 年代別の集計（件数・平均満足度・生活費の中央値）
 */
export function getAgeBandStats(experiences: Experience[]): {
  band: string;
  count: number;
  avgOverall: number | null;
  medianMonthlyLiving: number | null;
}[] {
  const bands: { band: string; min: number; max: number }[] = [
    { band: '〜19歳', min: 0, max: 19 },
    { band: '20〜24歳', min: 20, max: 24 },
    { band: '25〜29歳', min: 25, max: 29 },
    { band: '30〜34歳', min: 30, max: 34 },
    { band: '35歳〜', min: 35, max: 200 },
  ];
  return bands.map(({ band, min, max }) => {
    const inBand = experiences.filter(
      (e) => typeof e.ageAtDeparture === 'number' && e.ageAtDeparture >= min && e.ageAtDeparture <= max
    );
    const overalls = inBand.map((e) => e.ratingOverall).filter((v): v is number => v != null);
    const livings = inBand.map((e) => e.monthlyLivingJpy).filter((v): v is number => v != null);
    return {
      band,
      count: inBand.length,
      avgOverall: overalls.length === 0 ? null : avg1(overalls),
      medianMonthlyLiving: median(livings),
    };
  });
}

/**
 * 国別ランキング: getCountryAggregation を指定キーでソートし、
 * 最小サンプル数 minN（既定3件）未満と、対象キーが欠損の国を除外する。
 * 「N=1〜2 の国を1位にしない」ための信頼性ガード。
 */
export function getCountryRanking(
  experiences: Experience[],
  key: 'ratingOverall' | 'ratingJob' | 'ratingSafety' | 'monthlyLivingAvg',
  options: { minN?: number; order?: 'asc' | 'desc' } = {}
): ReturnType<typeof getCountryAggregation> {
  const minN = options.minN ?? 3;
  const order = options.order ?? 'desc';
  const filtered = getCountryAggregation(experiences).filter((c) => {
    if (c.count < minN) return false;
    return c[key] != null;
  });
  return filtered.sort((a, b) => {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    return order === 'asc' ? av - bv : bv - av;
  });
}
