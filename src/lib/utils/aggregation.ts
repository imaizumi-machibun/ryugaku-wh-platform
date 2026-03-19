import type { Experience, Review } from '../microcms/types';

export type ExperienceRatingAgg = {
  ratingOverall: number;
  ratingSafety: number;
  ratingJob: number;
  ratingCost: number;
  ratingLifestyle: number;
  ratingLanguage: number;
  count: number;
};

export type ReviewRatingAgg = {
  ratingOverall: number;
  ratingTeaching: number;
  ratingFacilities: number;
  ratingLocation: number;
  ratingCostPerf: number;
  count: number;
};

function avg(values: (number | undefined | null)[]): number {
  const valid = values.filter((v): v is number => v != null);
  if (valid.length === 0) return 0;
  return Math.round((valid.reduce((s, v) => s + v, 0) / valid.length) * 10) / 10;
}

/**
 * 体験談の6軸評価の平均を計算
 */
export function aggregateExperienceRatings(experiences: Experience[]): ExperienceRatingAgg | null {
  if (experiences.length === 0) return null;

  return {
    ratingOverall: avg(experiences.map((e) => e.ratingOverall)),
    ratingSafety: avg(experiences.map((e) => e.ratingSafety)),
    ratingJob: avg(experiences.map((e) => e.ratingJob)),
    ratingCost: avg(experiences.map((e) => e.ratingCost)),
    ratingLifestyle: avg(experiences.map((e) => e.ratingLifestyle)),
    ratingLanguage: avg(experiences.map((e) => e.ratingLanguage)),
    count: experiences.length,
  };
}

/**
 * 口コミの評価平均を計算
 */
export function aggregateReviewRatings(reviews: Review[]): ReviewRatingAgg | null {
  if (reviews.length === 0) return null;

  return {
    ratingOverall: avg(reviews.map((r) => r.ratingOverall)),
    ratingTeaching: avg(reviews.map((r) => r.ratingTeaching)),
    ratingFacilities: avg(reviews.map((r) => r.ratingFacilities)),
    ratingLocation: avg(reviews.map((r) => r.ratingLocation)),
    ratingCostPerf: avg(reviews.map((r) => r.ratingCostPerf)),
    count: reviews.length,
  };
}

/**
 * 体験談の費用平均を計算
 */
export function aggregateExperienceCosts(experiences: Experience[]) {
  const livingValues = experiences.map((e) => e.monthlyLivingJpy).filter((v): v is number => v != null);
  const rentValues = experiences.map((e) => e.monthlyRentJpy).filter((v): v is number => v != null);
  const foodValues = experiences.map((e) => e.monthlyFoodJpy).filter((v): v is number => v != null);
  const incomeValues = experiences.map((e) => e.monthlyIncomeJpy).filter((v): v is number => v != null);

  return {
    monthlyLivingJpy: livingValues.length > 0 ? Math.round(livingValues.reduce((s, v) => s + v, 0) / livingValues.length) : null,
    monthlyRentJpy: rentValues.length > 0 ? Math.round(rentValues.reduce((s, v) => s + v, 0) / rentValues.length) : null,
    monthlyFoodJpy: foodValues.length > 0 ? Math.round(foodValues.reduce((s, v) => s + v, 0) / foodValues.length) : null,
    monthlyIncomeJpy: incomeValues.length > 0 ? Math.round(incomeValues.reduce((s, v) => s + v, 0) / incomeValues.length) : null,
  };
}
