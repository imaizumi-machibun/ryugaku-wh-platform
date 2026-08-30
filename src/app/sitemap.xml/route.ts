import { serializeSitemapIndex } from '@/lib/sitemap/serialize';
import { SITEMAPS } from '@/lib/sitemap/templates';
import { SITE_URL } from '@/lib/utils/constants';

export const revalidate = 3600;

export async function GET() {
  // lastmod は省略（リクエスト時刻を入れると全サイトマップが常に「更新済み」という嘘になるため）
  const xml = serializeSitemapIndex(SITEMAPS.map((s) => ({ loc: `${SITE_URL}/${s.fileName}` })));
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
