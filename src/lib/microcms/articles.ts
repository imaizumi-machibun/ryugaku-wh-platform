import { client } from './client';
import type { Article, MicroCMSListResponse, MicroCMSQueries } from './types';

const ENDPOINT = 'articles';

export async function getArticles(
  queries?: MicroCMSQueries
): Promise<MicroCMSListResponse<Article>> {
  const baseFilter = 'phase[not_exists]';
  const filters = queries?.filters
    ? `${baseFilter}[and]${queries.filters}`
    : baseFilter;

  return client.getList<Article>({
    endpoint: ENDPOINT,
    queries: {
      limit: queries?.limit ?? 20,
      offset: queries?.offset,
      orders: queries?.orders ?? '-publishedAt',
      filters,
      fields: queries?.fields,
      q: queries?.q,
      depth: queries?.depth ?? 2,
    },
  });
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  return client.getListDetail<Article>({
    endpoint: ENDPOINT,
    contentId: slug,
    queries: { depth: 2 },
  });
}

export async function getArticleSlugs(): Promise<string[]> {
  const data = await client.getList<Article>({
    endpoint: ENDPOINT,
    queries: { limit: 100, fields: ['id'], filters: 'phase[not_exists]' },
  });
  return data.contents.map((a) => a.id);
}
