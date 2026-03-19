import { client } from './client';
import type { Country, MicroCMSListResponse, MicroCMSQueries } from './types';

const ENDPOINT = 'countries';

export async function getCountries(
  queries?: MicroCMSQueries
): Promise<MicroCMSListResponse<Country>> {
  return client.getList<Country>({
    endpoint: ENDPOINT,
    queries: {
      limit: queries?.limit ?? 100,
      offset: queries?.offset,
      orders: queries?.orders,
      filters: queries?.filters,
      fields: queries?.fields,
      q: queries?.q,
      depth: queries?.depth ?? 2,
    },
  });
}

export async function getCountryBySlug(slug: string): Promise<Country> {
  return client.getListDetail<Country>({
    endpoint: ENDPOINT,
    contentId: slug,
    queries: { depth: 2 },
  });
}

export async function getCountrySlugs(): Promise<string[]> {
  const data = await client.getList<Country>({
    endpoint: ENDPOINT,
    queries: { limit: 100, fields: ['id'] },
  });
  return data.contents.map((c) => c.id);
}
