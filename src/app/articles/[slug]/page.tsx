import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticleSlugs } from '@/lib/microcms/articles';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import { generateArticleMetadata } from '@/lib/seo/metadata';
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { extractFaqFromArticleBody } from '@/lib/utils/article-faq';
import { ARTICLE_CATEGORIES } from '@/lib/utils/constants';
import { formatDate } from '@/lib/utils/format';
import { getArticleImage } from '@/lib/utils/article-images';
import ShareButtons from '@/components/ui/ShareButtons';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { buildArticleRelatedSections } from '@/lib/seo/relations';
import { getArticles } from '@/lib/microcms/articles';
import AuthorBox from '@/components/article/AuthorBox';
import MoshimoAffiliateCard from '@/components/affiliate/MoshimoAffiliateCard';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const article = await getArticleBySlug(params.slug);
    const catLabel = ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.label;
    const year = new Date().getFullYear();
    const keywords = [
      ...(catLabel ? [`留学 ${catLabel}`, `ワーホリ ${catLabel}`] : []),
      ...(article.relatedCountries?.flatMap((c) => [`${c.nameJp} 留学`, `${c.nameJp} ワーホリ`]) ?? []),
      'ワーホリ お役立ち情報',
      `${year}年 ワーホリ`,
    ];
    return generateArticleMetadata({
      title: article.title,
      description: article.description || `${article.title}についての解説記事。留学・ワーホリ希望者に役立つ情報を提供します。`,
      path: `/articles/${params.slug}`,
      ogImage:
        article.heroImage?.url ??
        `/api/og?title=${encodeURIComponent(article.title)}${catLabel ? `&cat=${encodeURIComponent(catLabel)}` : ''}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      keywords,
    });
  } catch {
    return {};
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  let article;
  try {
    article = await getArticleBySlug(params.slug);
  } catch {
    notFound();
  }

  const catLabel = ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.label;
  const faqs = extractFaqFromArticleBody(article.body);

  // 同じカテゴリの関連記事を取得
  const sameCategoryData = article.category
    ? await getArticles({
        filters: `category[equals]${article.category}[and]phase[not_exists]`,
        limit: 6,
      }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 }))
    : { contents: [], totalCount: 0, offset: 0, limit: 0 };

  return (
    <>
      <JsonLd data={generateArticleJsonLd(article)} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'お役立ち記事', url: '/articles' },
          { name: article.title, url: `/articles/${params.slug}` },
        ])}
      />
      {faqs.length > 0 && <JsonLd data={generateFAQJsonLd(faqs)} />}

      <div className="container-custom py-8">
        <Breadcrumb
          items={[
            { label: 'お役立ち記事', href: '/articles' },
            { label: article.title },
          ]}
        />

        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              {catLabel && <Badge variant="primary">{catLabel}</Badge>}
              <span className="text-sm text-gray-500">
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            {article.description && (
              <p className="text-gray-600 text-lg">{article.description}</p>
            )}
            <div className="mt-3">
              <ShareButtons url={`/articles/${params.slug}`} title={article.title} />
            </div>
          </header>

          {/* Hero Image（heroImage が無い記事はカテゴリ別デフォルト画像にフォールバック） */}
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8 bg-primary-900/5">
            <Image
              src={getArticleImage(article)}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
            {/* サイトのトーンに馴染ませるグリーンの微オーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-transparent" />
          </div>

          {/* Body */}
          <div
            className="prose-custom mb-12"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {params.slug === 'wh-packing-list-2026-complete' && (
            <MoshimoAffiliateCard />
          )}

          {/* Author Box (E-E-A-T強化) */}
          <AuthorBox article={article} />

          {/* Related Countries & Schools */}
          {((article.relatedCountries && article.relatedCountries.length > 0) ||
            (article.relatedSchools && article.relatedSchools.length > 0)) && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold mb-4">関連情報</h2>
              <div className="flex flex-wrap gap-3">
                {article.relatedCountries?.map((c) => (
                  <Link
                    key={c.id}
                    href={`/countries/${c.id}`}
                    className="flex items-center gap-1 bg-gray-100 rounded-full px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
                  >
                    {c.flagEmoji} {c.nameJp}
                  </Link>
                ))}
                {article.relatedSchools?.map((s) => (
                  <Link
                    key={s.id}
                    href={`/schools/${s.id}`}
                    className="bg-gray-100 rounded-full px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* SEO関連リンク（同カテゴリ記事 + 関連国） */}
        <div className="max-w-3xl mx-auto">
          <RelatedLinks
            sections={buildArticleRelatedSections(article, {
              sameCategory: sameCategoryData.contents,
            })}
          />
        </div>
      </div>
    </>
  );
}
