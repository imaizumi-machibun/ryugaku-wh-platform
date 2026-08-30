import { client } from './client';
import { getArticleBySlug } from './articles';
import type {
  Article,
  Country,
  CountryPurposeGuide,
  CountryPurposeGuidePurpose,
} from './types';
import { getPurposeGuideDefinition } from '@/lib/country-purpose/registry';

export type ResolvedCountryPurposeGuide = {
  title: string;
  introduction: string;
  body: string;
  heroImage?: Article['heroImage'];
  checkedAt: string;
  nextCheckAt?: string;
  status: 'publishable';
  sources: { label: string; url: string; supports: string; checkedAt: string }[];
  sourceArticleId: string;
  updatedAt?: string;
};

const stripHtml = (value: string): string => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function selectScalar<T extends string>(value: T | T[] | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : value;
}
async function getGuideFromCms(
  countrySlug: string,
  purpose: CountryPurposeGuidePurpose
): Promise<CountryPurposeGuide | null> {
  if (process.env.MICROCMS_COUNTRY_PURPOSE_GUIDES_ENABLED !== 'true') return null;
  const result = await client.getList<CountryPurposeGuide>({
    endpoint: 'countryPurposeGuides',
    queries: {
      limit: 1,
      depth: 2,
      filters: `country[equals]${countrySlug}[and]purpose[contains]${purpose}`,
    },
  });
  const guide = result.contents[0];
  if (!guide) return null;
  guide.purpose = selectScalar(guide.purpose as CountryPurposeGuidePurpose | CountryPurposeGuidePurpose[]) ?? purpose;
  guide.status = selectScalar(guide.status as CountryPurposeGuide['status'] | CountryPurposeGuide['status'][]) ?? 'draft';
  return guide;
}

export async function resolveCountryPurposeGuide(
  country: Country,
  purpose: CountryPurposeGuidePurpose
): Promise<ResolvedCountryPurposeGuide | null> {
  const definition = getPurposeGuideDefinition(country.id, purpose);
  if (!definition) return null;

  const cmsGuide = await getGuideFromCms(country.id, purpose).catch(() => null);
  if (cmsGuide?.status === 'publishable') {
    return {
      title: cmsGuide.title,
      introduction: cmsGuide.introduction,
      body: cmsGuide.body,
      heroImage: cmsGuide.heroImage,
      checkedAt: cmsGuide.checkedAt,
      nextCheckAt: cmsGuide.nextCheckAt,
      status: 'publishable',
      sources: (cmsGuide.sources ?? []).map((source) => ({
        label: source.label,
        url: source.url,
        supports: source.supports,
        checkedAt: source.checkedAt,
      })),
      sourceArticleId: definition.sourceArticleId,
      updatedAt: cmsGuide.updatedAt,
    };
  }

  const article = await getArticleBySlug(definition.sourceArticleId).catch(() => null);
  if (!article) return null;
  const introduction = article.description || stripHtml(article.body).slice(0, 220);
  const checkedAt = article.updatedAt || article.publishedAt || '2026-08-27';
  return {
    title: article.title,
    introduction,
    body: article.body,
    heroImage: article.heroImage,
    checkedAt,
    status: 'publishable',
    sources: definition.officialSources.map((source) => ({
      ...source,
      checkedAt,
    })),
    sourceArticleId: definition.sourceArticleId,
    updatedAt: article.updatedAt,
  };
}
