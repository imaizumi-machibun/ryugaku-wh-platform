import { serializeUrlset } from '@/lib/sitemap/serialize';
import { findSitemap } from '@/lib/sitemap/templates';

export const revalidate = 3600;

export async function GET() {
  const definition = findSitemap('sitemap-country-purposes.xml');
  return new Response(serializeUrlset(await definition.loader()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
