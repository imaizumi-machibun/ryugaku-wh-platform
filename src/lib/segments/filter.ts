import type { Article, Experience, School } from '@/lib/microcms/types';
import type { SegmentMeta } from './types';
import { estimateExperienceTotalJpy, estimateSchoolTotalJpy } from './cost-estimator';

// ============================================================
// 体験談を SegmentMeta の条件で絞り込む
// フォールバック戦略: 厳密 → 国セット → 期間 → 最新N件
// ============================================================
export type FilteredExperiences = {
  matched: Experience[];
  withEstimates: Map<string, number>;
  fallbackTier: 0 | 1 | 2 | 3 | 4 | 5;
  appliedHint: 'strict' | 'country' | 'region' | 'language' | 'duration' | 'recent';
};

export function filterExperiencesBySegment(
  experiences: Experience[],
  seg: SegmentMeta,
  limit = 6
): FilteredExperiences {
  const hints = seg.experienceFilterHints ?? {};
  const estimates = new Map<string, number>();
  for (const exp of experiences) {
    const total = estimateExperienceTotalJpy(exp);
    if (total != null) estimates.set(exp.id, total);
  }

  const strict = experiences.filter((exp) => matchesExperienceStrict(exp, seg, estimates));
  if (strict.length > 0) {
    return {
      matched: sortExperiences(strict, seg).slice(0, limit),
      withEstimates: estimates,
      fallbackTier: 0,
      appliedHint: 'strict',
    };
  }

  if (hints.countrySlugs && hints.countrySlugs.length > 0) {
    const byCountry = experiences.filter((exp) => hints.countrySlugs!.includes(exp.country?.id));
    if (byCountry.length > 0) {
      return {
        matched: sortExperiences(byCountry, seg).slice(0, limit),
        withEstimates: estimates,
        fallbackTier: 1,
        appliedHint: 'country',
      };
    }
  }

  if (hints.regionSlugs && hints.regionSlugs.length > 0) {
    const byRegion = experiences.filter((exp) => hints.regionSlugs!.includes(exp.country?.id));
    if (byRegion.length > 0) {
      return {
        matched: sortExperiences(byRegion, seg).slice(0, limit),
        withEstimates: estimates,
        fallbackTier: 2,
        appliedHint: 'region',
      };
    }
  }

  if (hints.languageSlugs && hints.languageSlugs.length > 0) {
    const byLanguage = experiences.filter((exp) => hints.languageSlugs!.includes(exp.country?.id));
    if (byLanguage.length > 0) {
      return {
        matched: sortExperiences(byLanguage, seg).slice(0, limit),
        withEstimates: estimates,
        fallbackTier: 3,
        appliedHint: 'language',
      };
    }
  }

  if (hints.minDurationMonths != null || hints.maxDurationMonths != null) {
    const byDuration = experiences.filter((exp) => {
      const months = exp.durationMonths;
      if (months == null) return false;
      if (hints.minDurationMonths != null && months < hints.minDurationMonths) return false;
      if (hints.maxDurationMonths != null && months > hints.maxDurationMonths) return false;
      return true;
    });
    if (byDuration.length > 0) {
      return {
        matched: sortExperiences(byDuration, seg).slice(0, limit),
        withEstimates: estimates,
        fallbackTier: 4,
        appliedHint: 'duration',
      };
    }
  }

  return {
    matched: experiences.slice(0, limit),
    withEstimates: estimates,
    fallbackTier: 5,
    appliedHint: 'recent',
  };
}

function matchesExperienceStrict(
  exp: Experience,
  seg: SegmentMeta,
  estimates: Map<string, number>
): boolean {
  const hints = seg.experienceFilterHints ?? {};
  const total = estimates.get(exp.id);
  if (hints.minTotalEstimateJpy != null && (total == null || total < hints.minTotalEstimateJpy)) return false;
  if (hints.maxTotalEstimateJpy != null && (total == null || total > hints.maxTotalEstimateJpy)) return false;
  if (hints.minDurationMonths != null && (exp.durationMonths == null || exp.durationMonths < hints.minDurationMonths)) return false;
  if (hints.maxDurationMonths != null && (exp.durationMonths == null || exp.durationMonths > hints.maxDurationMonths)) return false;
  if (hints.countrySlugs && hints.countrySlugs.length > 0 && !hints.countrySlugs.includes(exp.country?.id)) return false;
  return true;
}

function sortExperiences(list: Experience[], seg: SegmentMeta): Experience[] {
  if (seg.segmentType === 'budget' && seg.experienceFilterHints?.minTotalEstimateJpy != null) {
    return [...list].sort((a, b) => (b.ratingOverall ?? 0) - (a.ratingOverall ?? 0));
  }
  return [...list].sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
}

// ============================================================
// 学校を SegmentMeta の条件で絞り込む
// フォールバック: 厳密 → costRange → weeklyFeeHigh DESC 上位N
// ============================================================
export type FilteredSchools = {
  matched: School[];
  withEstimates: Map<string, number>;
  fallbackTier: 0 | 1 | 2;
};

export function filterSchoolsBySegment(
  schools: School[],
  seg: SegmentMeta,
  limit = 10
): FilteredSchools {
  const hints = seg.schoolFilterHints ?? {};
  const monthsAssumed = seg.monthsAssumedForSchoolEstimate ?? 12;
  const estimates = new Map<string, number>();
  for (const school of schools) {
    estimates.set(school.id, estimateSchoolTotalJpy(school, monthsAssumed));
  }

  const strict = schools.filter((school) => matchesSchoolStrict(school, hints, estimates));
  if (strict.length > 0) {
    return {
      matched: sortSchoolsByTotal(strict, estimates),
      withEstimates: estimates,
      fallbackTier: 0,
    };
  }

  const byCountry = hints.countrySlugs && hints.countrySlugs.length > 0
    ? schools.filter((s) => hints.countrySlugs!.includes(s.country?.id))
    : schools;

  if (hints.minTotalEstimateJpy != null) {
    const premium = byCountry.filter((s) => s.costRange === 'premium');
    if (premium.length > 0) {
      return {
        matched: sortSchoolsByTotal(premium, estimates).slice(0, limit),
        withEstimates: estimates,
        fallbackTier: 1,
      };
    }
  }

  const sortedByFee = [...byCountry].sort((a, b) => {
    const aHigh = a.weeklyFeeHigh ?? a.weeklyFeeLow ?? 0;
    const bHigh = b.weeklyFeeHigh ?? b.weeklyFeeLow ?? 0;
    if (hints.minTotalEstimateJpy != null) return bHigh - aHigh;
    return aHigh - bHigh;
  });

  return {
    matched: sortedByFee.slice(0, limit),
    withEstimates: estimates,
    fallbackTier: 2,
  };

  function sortSchoolsByTotal(list: School[], est: Map<string, number>): School[] {
    return [...list]
      .sort((a, b) => (est.get(a.id) ?? 0) - (est.get(b.id) ?? 0))
      .slice(0, limit);
  }
}

function matchesSchoolStrict(
  school: School,
  hints: NonNullable<SegmentMeta['schoolFilterHints']>,
  estimates: Map<string, number>
): boolean {
  const total = estimates.get(school.id);
  if (hints.minTotalEstimateJpy != null && (total == null || total < hints.minTotalEstimateJpy)) return false;
  if (hints.maxTotalEstimateJpy != null && (total == null || total > hints.maxTotalEstimateJpy)) return false;
  if (hints.countrySlugs && hints.countrySlugs.length > 0 && !hints.countrySlugs.includes(school.country?.id)) return false;
  if (hints.courseTypes && hints.courseTypes.length > 0) {
    const intersect = school.courseTypes?.some((c) => hints.courseTypes!.includes(c));
    if (!intersect) return false;
  }
  return true;
}

// ============================================================
// 記事を SegmentMeta の関連スラグから引く
// ============================================================
export function filterArticlesBySegment(articles: Article[], seg: SegmentMeta): Article[] {
  if (!seg.relatedArticleSlugs || seg.relatedArticleSlugs.length === 0) return [];
  const slugSet = new Set(seg.relatedArticleSlugs);
  return articles.filter((a) => slugSet.has(a.id));
}
