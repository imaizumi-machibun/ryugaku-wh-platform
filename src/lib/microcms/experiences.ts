import { client } from './client';
import type { Experience, MicroCMSListResponse, MicroCMSQueries } from './types';
import { normalizeExperienceClassification } from '@/lib/experiences/classification';

const ENDPOINT = 'experiences';

export async function getExperiences(
  queries?: MicroCMSQueries
): Promise<MicroCMSListResponse<Experience>> {
  const response = await client.getList<Experience>({
    endpoint: ENDPOINT,
    queries: {
      limit: queries?.limit ?? 20,
      offset: queries?.offset,
      orders: queries?.orders ?? '-publishedAt',
      filters: queries?.filters,
      fields: queries?.fields,
      q: queries?.q,
      depth: queries?.depth ?? 2,
    },
  });
  return {
    ...response,
    contents: response.contents.map(normalizeExperienceClassification),
  };
}

export async function getExperienceBySlug(slug: string): Promise<Experience> {
  const experience = await client.getListDetail<Experience>({
    endpoint: ENDPOINT,
    contentId: slug,
    queries: { depth: 2 },
  });
  return normalizeExperienceClassification(experience);
}

export async function getExperienceSlugs(): Promise<string[]> {
  const data = await client.getList<Experience>({
    endpoint: ENDPOINT,
    queries: { limit: 100, fields: ['id'] },
  });
  return data.contents.map((e) => e.id);
}

export async function getExperiencesByCountry(
  countryId: string,
  limit = 10
): Promise<MicroCMSListResponse<Experience>> {
  return getExperiences({
    filters: `country[equals]${countryId}`,
    limit,
    orders: '-publishedAt',
  });
}

export async function getExperiencesByCity(
  cityName: string,
  limit = 6
): Promise<MicroCMSListResponse<Experience>> {
  return getExperiences({
    filters: `cityPrimary[equals]${cityName}`,
    limit,
    orders: '-publishedAt',
  });
}

export async function getAllExperiences(): Promise<Experience[]> {
  const pageSize = 100;
  const all: Experience[] = [];
  let offset = 0;
  let totalCount = Infinity;

  while (offset < totalCount) {
    const page = await getExperiences({ limit: pageSize, offset, depth: 2 });
    all.push(...page.contents);
    totalCount = page.totalCount;
    if (page.contents.length === 0) break;
    offset += pageSize;
  }
  return all;
}
