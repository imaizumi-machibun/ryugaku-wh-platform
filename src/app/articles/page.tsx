import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getArticles } from '@/lib/microcms/articles';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Pagination from '@/components/ui/Pagination';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { PER_PAGE, ARTICLE_CATEGORIES } from '@/lib/utils/constants';
import { formatDate } from '@/lib/utils/format';

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: 'お役立ち記事',
  description: '留学・ワーキングホリデーに役立つ記事。ビザ、費用、準備、仕事などの情報をカテゴリ別に紹介。',
  path: '/articles',
});

type Props = {
  searchParams: { page?: string; category?: string };
};

export default async function ArticlesPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * PER_PAGE;

  const filters = searchParams.category
    ? `category[equals]${searchParams.category}`
    : undefined;

  const { contents: articles, totalCount } = await getArticles({
    limit: PER_PAGE,
    offset,
    filters,
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: 'お役立ち記事' }]} />

      <h1 className="text-3xl font-bold mb-2">お役立ち記事</h1>
      <p className="text-gray-600 mb-6">留学・ワーホリに役立つ情報（{totalCount}件）</p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/articles"
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            !searchParams.category ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          すべて
        </a>
        {ARTICLE_CATEGORIES.map((cat) => (
          <a
            key={cat.value}
            href={`/articles?category=${cat.value}`}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              searchParams.category === cat.value ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const catLabel = ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.label;
              return (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <Card hover className="h-full">
                    {article.heroImage && (
                      <div className="relative h-44 w-full">
                        <Image
                          src={article.heroImage.url}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {catLabel && <Badge variant="primary" className="mb-2">{catLabel}</Badge>}
                      <h3 className="font-bold text-base mb-2 line-clamp-2">{article.title}</h3>
                      {article.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{article.description}</p>
                      )}
                      <p className="text-xs text-gray-400">{formatDate(article.publishedAt || article.createdAt)}</p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
          <Pagination
            totalCount={totalCount}
            perPage={PER_PAGE}
            currentPage={page}
            basePath="/articles"
            searchParams={searchParams.category ? { category: searchParams.category } : {}}
          />
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>記事がまだありません。</p>
        </div>
      )}
    </div>
  );
}
