import { client } from './client';
import type { School, MicroCMSListResponse, MicroCMSQueries } from './types';

const ENDPOINT = 'schools';

export async function getSchools(
  queries?: MicroCMSQueries
): Promise<MicroCMSListResponse<School>> {
  return client.getList<School>({
    endpoint: ENDPOINT,
    queries: {
      limit: queries?.limit ?? 20,
      offset: queries?.offset,
      orders: queries?.orders,
      filters: queries?.filters,
      fields: queries?.fields,
      q: queries?.q,
      depth: queries?.depth ?? 2,
    },
  });
}

export async function getSchoolBySlug(slug: string): Promise<School> {
  return client.getListDetail<School>({
    endpoint: ENDPOINT,
    contentId: slug,
    queries: { depth: 2 },
  });
}

export async function getSchoolSlugs(): Promise<string[]> {
  const data = await client.getList<School>({
    endpoint: ENDPOINT,
    queries: { limit: 100, fields: ['id'] },
  });
  return data.contents.map((s) => s.id);
}

export function buildSchoolFilters(params: {
  country?: string;
  language?: string;
  cost?: string;
}): string {
  const conditions: string[] = [];
  if (params.country) {
    conditions.push(`country[equals]${params.country}`);
  }
  if (params.language) {
    conditions.push(`languages[contains]${params.language}`);
  }
  if (params.cost) {
    conditions.push(`costRange[equals]${params.cost}`);
  }
  return conditions.join('[and]');
}
