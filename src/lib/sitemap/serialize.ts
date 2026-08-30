import type { MetadataRoute } from 'next';
import { isPublished } from '@/lib/publish/schedule';
import { SITE_URL } from '@/lib/utils/constants';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoString(value: Date | string | number): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function urlToPath(url: string): string {
  if (url.startsWith(SITE_URL)) return url.slice(SITE_URL.length) || '/';
  return url;
}

export function serializeUrlset(entries: MetadataRoute.Sitemap): string {
  const published = entries.filter((e) => isPublished(urlToPath(String(e.url))));
  const body = published
    .map((e) => {
      const lines: string[] = [`  <url>`, `    <loc>${escapeXml(String(e.url))}</loc>`];
      if (e.lastModified) lines.push(`    <lastmod>${toIsoString(e.lastModified)}</lastmod>`);
      if (e.changeFrequency) lines.push(`    <changefreq>${e.changeFrequency}</changefreq>`);
      if (e.priority != null) lines.push(`    <priority>${e.priority}</priority>`);
      lines.push(`  </url>`);
      return lines.join('\n');
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function serializeSitemapIndex(
  sitemaps: { loc: string; lastmod?: Date | string | number }[]
): string {
  const body = sitemaps
    .map((s) => {
      const lines: string[] = [`  <sitemap>`, `    <loc>${escapeXml(s.loc)}</loc>`];
      if (s.lastmod) lines.push(`    <lastmod>${toIsoString(s.lastmod)}</lastmod>`);
      lines.push(`  </sitemap>`);
      return lines.join('\n');
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}
