import { client } from './client';
import type { Experience, MicroCMSListResponse, MicroCMSQueries } from './types';

const ENDPOINT = 'experiences';

export async function getExperiences(
  queries?: MicroCMSQueries
): Promise<MicroCMSListResponse<Experience>> {
  return client.getList<Experience>({
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
}

export async function getExperienceBySlug(slug: string): Promise<Experience> {
  return client.getListDetail<Experience>({
    endpoint: ENDPOINT,
    contentId: slug,
    queries: { depth: 2 },
  });
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
