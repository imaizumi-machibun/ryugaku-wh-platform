import { client } from './client';
import { isArticlePublished, filterPublishedArticleSlugs, ARTICLE_PUBLISH_DATES } from '@/lib/publish/schedule';
import type { Article, MicroCMSListResponse, MicroCMSQueries } from './types';

const ENDPOINT = 'articles';

/**
 * 現時点で未公開（予約公開で未来日時）の slug 一覧
 */
function getReservedSlugs(now: Date = new Date()): string[] {
  return Object.entries(ARTICLE_PUBLISH_DATES)
    .filter(([, dateStr]) => new Date(dateStr) > now)
    .map(([slug]) => slug);
}

/**
 * 予約公開記事を microCMS 側で除外するフィルタを構築する
 */
function buildReservedExcludeFilter(): string {
  const reserved = getReservedSlugs();
  if (reserved.length === 0) return '';
  return reserved.map((s) => `id[not_equals]${s}`).join('[and]');
}

export async function getArticles(
  queries?: MicroCMSQueries
): Promise<MicroCMSListResponse<Article>> {
  const baseFilter = 'phase[not_exists]';
  const reservedFilter = buildReservedExcludeFilter();
  const filters = [
    baseFilter,
    reservedFilter,
    queries?.filters,
  ].filter(Boolean).join('[and]');

  const res = await client.getList<Article>({
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

  // 念のためサーバ側でも二重チェック（時間差で公開済みになった記事の救済）
  const visible = res.contents.filter((a) => isArticlePublished(a.id));
  const excluded = res.contents.length - visible.length;

  return {
    ...res,
    contents: visible,
    totalCount: Math.max(0, res.totalCount - excluded),
  };
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  // 予約公開チェック: 未公開なら notFound 相当のエラーを投げる
  if (!isArticlePublished(slug)) {
    throw new Error(`Article not yet published: ${slug}`);
  }
  return client.getListDetail<Article>({
    endpoint: ENDPOINT,
    contentId: slug,
    queries: { depth: 2 },
  });
}

export async function getArticleSlugs(): Promise<string[]> {
  // microCMS の1リクエスト上限は100件のため、全件になるまで offset を進めて取得する
  const LIMIT = 100;
  const slugs: string[] = [];
  let offset = 0;
  let totalCount = Infinity;

  while (offset < totalCount) {
    const data = await client.getList<Article>({
      endpoint: ENDPOINT,
      queries: { limit: LIMIT, offset, fields: ['id'], filters: 'phase[not_exists]' },
    });
    slugs.push(...data.contents.map((a) => a.id));
    totalCount = data.totalCount;
    if (data.contents.length === 0) break;
    offset += LIMIT;
  }

  return filterPublishedArticleSlugs(slugs);
}

/**
 * サイトマップ用: slug と実際の最終更新日時のペア（公開済みのみ）。
 * lastmod にリクエスト時刻を使うと Google が lastmod を信用しなくなるため、
 * microCMS の updatedAt（実更新日）を渡す。
 */
export async function getArticleSitemapItems(): Promise<{ id: string; updatedAt?: string }[]> {
  const LIMIT = 100;
  const items: { id: string; updatedAt?: string }[] = [];
  let offset = 0;
  let totalCount = Infinity;

  while (offset < totalCount) {
    const data = await client.getList<Article>({
      endpoint: ENDPOINT,
      queries: { limit: LIMIT, offset, fields: ['id', 'updatedAt'], filters: 'phase[not_exists]' },
    });
    items.push(...data.contents.map((a) => ({ id: a.id, updatedAt: a.updatedAt })));
    totalCount = data.totalCount;
    if (data.contents.length === 0) break;
    offset += LIMIT;
  }

  const published = new Set(filterPublishedArticleSlugs(items.map((i) => i.id)));
  return items.filter((i) => published.has(i.id));
}
