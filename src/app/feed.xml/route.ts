import { getArticles } from '@/lib/microcms/articles';
import { GUIDE_ARTICLES } from '@/lib/data/guide-articles';
import { isPublished, getPublishDate } from '@/lib/publish/schedule';
import { SITE_NAME, SITE_URL } from '@/lib/utils/constants';

export const revalidate = 3600;

const FEED_LIMIT = 50;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type FeedItem = {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  category?: string;
};

export async function GET() {
  const articles = await getArticles({
    limit: FEED_LIMIT,
    orders: '-publishedAt',
    fields: ['id', 'title', 'description', 'publishedAt', 'category'],
  });

  const items: FeedItem[] = [];

  for (const a of articles.contents) {
    if (!a.publishedAt) continue;
    // microCMS のセレクトフィールドは配列で返る（例: ["cost"]）
    const category = Array.isArray(a.category) ? a.category[0] : a.category;
    items.push({
      title: a.title,
      link: `${SITE_URL}/articles/${a.id}`,
      description: a.description ?? '',
      pubDate: new Date(a.publishedAt),
      category,
    });
  }

  // 静的ルート記事は公開日が登録されているものだけ載せる
  // （公開日情報のない初期記事は「新着」フィードの対象外）
  for (const g of GUIDE_ARTICLES) {
    const date = getPublishDate(g.href);
    if (!date || !isPublished(g.href)) continue;
    items.push({
      title: g.title,
      link: `${SITE_URL}${g.href}`,
      description: g.description,
      pubDate: date,
      category: g.category,
    });
  }

  items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  const latest = items.slice(0, FEED_LIMIT);

  const body = latest
    .map((i) =>
      [
        '    <item>',
        `      <title>${escapeXml(i.title)}</title>`,
        `      <link>${escapeXml(i.link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(i.link)}</guid>`,
        `      <description>${escapeXml(i.description)}</description>`,
        `      <pubDate>${i.pubDate.toUTCString()}</pubDate>`,
        ...(i.category ? [`      <category>${escapeXml(i.category)}</category>`] : []),
        '    </item>',
      ].join('\n')
    )
    .join('\n');

  const lastBuildDate = (latest[0]?.pubDate ?? new Date()).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_NAME}｜留学・ワーホリの新着記事`)}</title>
    <link>${SITE_URL}</link>
    <description>留学・ワーキングホリデーの費用・ビザ・体験談・学校情報。新着記事とガイドの更新情報を配信します。</description>
    <language>ja</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${body}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
