import { serializeUrlset } from '@/lib/sitemap/serialize';
import { findSitemap } from '@/lib/sitemap/templates';

export const revalidate = 3600;

export async function GET() {
  const def = findSitemap('sitemap-budget.xml');
  return new Response(serializeUrlset(await def.loader()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
