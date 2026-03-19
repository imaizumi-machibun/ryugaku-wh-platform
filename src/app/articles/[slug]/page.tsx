import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticleSlugs } from '@/lib/microcms/articles';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import { generateArticleMetadata } from '@/lib/seo/metadata';
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { ARTICLE_CATEGORIES } from '@/lib/utils/constants';
import { formatDate } from '@/lib/utils/format';
import ShareButtons from '@/components/ui/ShareButtons';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const article = await getArticleBySlug(params.slug);
    return generateArticleMetadata({
      title: article.title,
      description: article.description || `${article.title}に関する情報`,
      path: `/articles/${params.slug}`,
      ogImage: article.heroImage?.url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
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

          {/* Hero Image */}
          {article.heroImage && (
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={article.heroImage.url}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Body */}
          <div
            className="prose-custom mb-12"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

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
      </div>
    </>
  );
}
