import * as sources from './sources';
import type { SitemapEntry } from './sources';

export type SitemapDefinition = {
  fileName: string;
  loader: () => Promise<SitemapEntry[]>;
};

export const SITEMAPS: SitemapDefinition[] = [
  { fileName: 'sitemap-static.xml', loader: () => sources.getStaticEntries() },
  { fileName: 'sitemap-countries.xml', loader: () => sources.getCountryEntries() },
  { fileName: 'sitemap-schools.xml', loader: () => sources.getSchoolEntries() },
  { fileName: 'sitemap-experiences.xml', loader: () => sources.getExperienceEntries() },
  { fileName: 'sitemap-articles.xml', loader: () => sources.getArticleEntries() },
  { fileName: 'sitemap-guides.xml', loader: () => sources.getGuideEntries() },
  { fileName: 'sitemap-cities.xml', loader: () => sources.getCityEntries() },
  { fileName: 'sitemap-country-costs.xml', loader: () => sources.getCountryCostEntries() },
  { fileName: 'sitemap-country-purposes.xml', loader: () => sources.getCountryPurposeEntries() },
  { fileName: 'sitemap-compare-countries.xml', loader: () => sources.getCompareCountryEntries() },
  { fileName: 'sitemap-jobs.xml', loader: () => sources.getJobsEntries() },
  { fileName: 'sitemap-budget.xml', loader: () => sources.getBudgetEntries() },
  { fileName: 'sitemap-duration.xml', loader: () => sources.getDurationEntries() },
  { fileName: 'sitemap-age.xml', loader: () => sources.getAgeEntries() },
];

export function findSitemap(fileName: string): SitemapDefinition {
  const def = SITEMAPS.find((s) => s.fileName === fileName);
  if (!def) throw new Error(`Unknown sitemap: ${fileName}`);
  return def;
}
