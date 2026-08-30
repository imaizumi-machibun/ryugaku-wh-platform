import type { MetadataRoute } from 'next';
import { SITE_URL, GUIDE_PHASES } from '@/lib/utils/constants';
import { getCountrySlugs } from '@/lib/microcms/countries';
import { getSchoolSlugs } from '@/lib/microcms/schools';
import { getExperienceSlugs } from '@/lib/microcms/experiences';
import { getArticleSitemapItems } from '@/lib/microcms/articles';
import { getGuideSlugs } from '@/lib/microcms/guides';
import { CITY_MASTERS } from '@/lib/data/cities';
import { OCCUPATIONS } from '@/lib/data/occupations';
import { DURATIONS } from '@/lib/data/durations';
import { BUDGETS } from '@/lib/data/budgets';
import { GENERATIONS } from '@/lib/data/generations';
import { COMPARE_COUNTRY_COMBOS } from '@/lib/data/compare-combos';
import {
  COUNTRY_PURPOSE_GUIDES,
  REDIRECTED_ARTICLE_SLUGS,
  REDIRECTED_STATIC_PATHS,
} from '@/lib/country-purpose/registry';

export type SitemapEntry = MetadataRoute.Sitemap[number];

// lastmod ポリシー（2026-07-10）:
// リクエスト時刻を lastmod に入れると「全URLが常に更新済み」という嘘になり、
// Google は不正確な lastmod を学習して無視する。実更新日を持つ articles のみ
// updatedAt を出力し、それ以外は lastmod を省略する（嘘をつくより省略が正しい）。

export async function getStaticEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/countries`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/schools`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/experiences`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/articles`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/compare`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/compare/countries`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/packing`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/after-wh`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/matching`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/research`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/regret`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/women`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/no-english`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/30s-guide`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/tax-return`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/australia-jobs`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wise-payment-guide`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/departure-timing`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-anxiety-and-persuasion`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/agent-comparison`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/housing-comparison`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/family-study`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-saving-tips`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/quit-job-wh`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/fresh-grad-wh`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/engineer-wh`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/canada-iec-visa`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/australia-farm-job`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-connections`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/scholarship-wh`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/ireland-wh`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/germany-wh`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-mental-health`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/couple-wh`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-labor-rights`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/homestay-guide`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/passport-lost-overseas`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/language-school-ranking`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/english-resume-guide`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/cebu-study-real-cost`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/sydney-sharehouse`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/uk-yms-visa-guide`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/melbourne-barista`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/vancouver-language-school`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/canada-sim-card`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/toronto-vs-vancouver`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/pre-departure-checklist`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/australia-tfn-guide`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/overseas-hospital-guide`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/wh-scam-crime-response`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/malta-study`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-pension-refund-australia`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/english-test-waiver`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/berlin-livecost`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/international-driving-permit`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/uk-yms-lottery-tips`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/canada-tax-return`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/vancouver-vs-melbourne`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/banking-overseas`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/sydney-vs-melbourne`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/korea-study`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-after-30`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-job-hunting-japan`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/au-second-year-visa`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/sim-vs-esim`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/us-language-school`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-budget-100man`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/au-pr-route`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/toronto-livecost`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/seoul-livecost`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-female-safety`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/uk-language-school`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/au-rural-job`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-loneliness`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/au-vs-canada`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/wh-japanese-restaurant`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/nz-language-school`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-credit-history`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-internship`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/aus-vs-newzealand`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/europe-budget-travel`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-after-wh-stay`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/short-term-study`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/wh-volunteer`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/au-vs-uk`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-after-japan-tax`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/vancouver-livecost`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/uk-london-cost`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/wh-tech-engineer`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/wh-marriage-international`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-au-pair`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-nurse`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/sydney-livecost`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-childcare`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-overseas-university`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/us-vs-canada`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/wh-cook-chef`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-online-business`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-bilingual-job`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-after-30-no-experience`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/paris-livecost`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-art-design`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-snowboard-ski`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-yoga`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/uk-vs-ireland`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-multi-country`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-hotel-management`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-music`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-fashion`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wh-business-english`, changeFrequency: 'monthly', priority: 0.7 },
  ];
  return entries.filter((entry) => !REDIRECTED_STATIC_PATHS.has(new URL(entry.url).pathname));
}

export async function getCountryEntries(): Promise<SitemapEntry[]> {
  const slugs = await getCountrySlugs();
  return slugs.map((slug) => ({
    url: `${SITE_URL}/countries/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
}

export async function getSchoolEntries(): Promise<SitemapEntry[]> {
  const slugs = await getSchoolSlugs();
  return slugs.map((slug) => ({
    url: `${SITE_URL}/schools/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
}

export async function getExperienceEntries(): Promise<SitemapEntry[]> {
  const slugs = await getExperienceSlugs();
  return slugs.map((slug) => ({
    url: `${SITE_URL}/experiences/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}

export async function getArticleEntries(): Promise<SitemapEntry[]> {
  const items = await getArticleSitemapItems();
  return items.filter((item) => !REDIRECTED_ARTICLE_SLUGS.has(item.id)).map((item) => ({
    url: `${SITE_URL}/articles/${item.id}`,
    ...(item.updatedAt ? { lastModified: item.updatedAt } : {}),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}

export async function getGuideEntries(): Promise<SitemapEntry[]> {
  const slugs = await getGuideSlugs();
  return [
    { url: `${SITE_URL}/guide`, changeFrequency: 'weekly', priority: 0.9 },
    ...GUIDE_PHASES.map((p) => ({
      url: `${SITE_URL}/guide/${p.value}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...slugs.map((s) => ({
      url: `${SITE_URL}/guide/${s.phase}/${s.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}

export async function getCityEntries(): Promise<SitemapEntry[]> {
  const countrySlugs = await getCountrySlugs();
  return CITY_MASTERS.flatMap((city) => {
    if (!countrySlugs.includes(city.countrySlug)) return [];
    return [
      {
        url: `${SITE_URL}/countries/${city.countrySlug}/cities/${city.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];
  });
}

export async function getCountryCostEntries(): Promise<SitemapEntry[]> {
  const slugs = await getCountrySlugs();
  return slugs.map((slug) => ({
    url: `${SITE_URL}/countries/${slug}/cost`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
}

export async function getCompareCountryEntries(): Promise<SitemapEntry[]> {
  return COMPARE_COUNTRY_COMBOS.map((combo) => ({
    url: `${SITE_URL}/compare/countries/${combo.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}

export async function getCountryPurposeEntries(): Promise<SitemapEntry[]> {
  return COUNTRY_PURPOSE_GUIDES.map((guide) => ({
    url: `${SITE_URL}/countries/${guide.countrySlug}/${guide.purpose}`,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));
}

export async function getJobsEntries(): Promise<SitemapEntry[]> {
  return OCCUPATIONS.map((o) => ({
    url: `${SITE_URL}/jobs/${o.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}

export async function getBudgetEntries(): Promise<SitemapEntry[]> {
  return BUDGETS.map((b) => ({
    url: `${SITE_URL}/budget/${b.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}

export async function getDurationEntries(): Promise<SitemapEntry[]> {
  return DURATIONS.map((d) => ({
    url: `${SITE_URL}/duration/${d.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}

export async function getAgeEntries(): Promise<SitemapEntry[]> {
  return GENERATIONS.map((g) => ({
    url: `${SITE_URL}/age/${g.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}
