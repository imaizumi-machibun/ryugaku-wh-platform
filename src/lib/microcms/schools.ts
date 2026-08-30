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
  const slugs: string[] = [];
  const limit = 100;
  let offset = 0;

  while (true) {
    const data = await client.getList<School>({
      endpoint: ENDPOINT,
      queries: { limit, offset, fields: ['id'] },
    });
    for (const s of data.contents) {
      slugs.push(s.id);
    }
    if (offset + limit >= data.totalCount) break;
    offset += limit;
  }

  return slugs;
}

/**
 * 同都市の学校を比較用に取得（費用相場・比較ミニ表で使用）
 * fields を絞って軽量に取る。都市あたり最大は30校未満のため limit 50 で全件になる
 */
export async function getSchoolsByCity(
  countryId: string,
  city: string,
  limit = 50
): Promise<MicroCMSListResponse<School>> {
  return getSchools({
    filters: `country[equals]${countryId}[and]city[equals]${city}`,
    limit,
    fields: ['id', 'name', 'city', 'weeklyFeeLow', 'weeklyFeeHigh', 'courseTypes', 'features'],
    depth: 1,
  });
}

/**
 * 同国全校の費用データを集計用に取得（同都市が3校未満のときのフォールバック）
 * 国あたり100校超（例: 中国107校）があるためページングで全件取る
 */
export async function getSchoolFeesByCountry(countryId: string): Promise<School[]> {
  const contents: School[] = [];
  const limit = 100;
  let offset = 0;

  while (true) {
    const data = await client.getList<School>({
      endpoint: ENDPOINT,
      queries: {
        limit,
        offset,
        filters: `country[equals]${countryId}`,
        fields: ['id', 'weeklyFeeLow'],
        depth: 1,
      },
    });
    contents.push(...data.contents);
    if (offset + limit >= data.totalCount) break;
    offset += limit;
  }

  return contents;
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
    conditions.push(`costRange[contains]${params.cost}`);
  }
  return conditions.join('[and]');
}
