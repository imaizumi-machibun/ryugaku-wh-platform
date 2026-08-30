import { client } from './client';
import type { Country, MicroCMSListResponse, MicroCMSQueries } from './types';

const ENDPOINT = 'countries';

// microCMS のセレクトフィールドは ["open"] のような配列で返るため、
// アプリ内の型（スカラー）に合わせて先頭要素へ正規化する。
// これを怠ると `programStatus === 'open'` などの比較が全て false になる。
// ※programStatus は現行のワーキングホリデー協定国マッピングを正として管理する
//   （協定あり32カ国=open）。
const SELECT_FIELDS = ['programStatus', 'costLevel', 'region'] as const;

function normalizeCountry(country: Country): Country {
  const c = country as unknown as Record<string, unknown>;
  for (const key of SELECT_FIELDS) {
    if (Array.isArray(c[key])) c[key] = (c[key] as unknown[])[0];
  }
  return country;
}

export async function getCountries(
  queries?: MicroCMSQueries
): Promise<MicroCMSListResponse<Country>> {
  const res = await client.getList<Country>({
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
  return { ...res, contents: res.contents.map(normalizeCountry) };
}

export async function getCountryBySlug(slug: string): Promise<Country> {
  const country = await client.getListDetail<Country>({
    endpoint: ENDPOINT,
    contentId: slug,
    queries: { depth: 2 },
  });
  return normalizeCountry(country);
}

export async function getCountrySlugs(): Promise<string[]> {
  const data = await client.getList<Country>({
    endpoint: ENDPOINT,
    queries: { limit: 100, fields: ['id'] },
  });
  return data.contents.map((c) => c.id);
}
