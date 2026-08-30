import type { Metadata } from 'next';
import { getArticles } from '@/lib/microcms/articles';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/layout/PageHero';
import Pagination from '@/components/ui/Pagination';
import ArticleCard from '@/components/article/ArticleCard';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { PER_PAGE, ARTICLE_CATEGORIES } from '@/lib/utils/constants';

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
    ? `category[contains]${searchParams.category}`
    : undefined;

  const { contents: articles, totalCount } = await getArticles({
    limit: PER_PAGE,
    offset,
    filters,
  });

  return (
    <>
      <div className="container-custom pt-6">
        <Breadcrumb items={[{ label: 'お役立ち記事' }]} />
      </div>
      <PageHero
        eyebrow="Articles"
        title="お役立ち記事"
        description={`ビザ・費用・準備・仕事まで、留学・ワーホリに役立つ情報をカテゴリ別に。全${totalCount}件。`}
      />

      <div className="container-custom py-12 md:py-16">
        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap gap-2">
          <a
            href="/articles"
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              !searchParams.category
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-700'
            }`}
          >
            すべて
          </a>
          {ARTICLE_CATEGORIES.map((cat) => (
            <a
              key={cat.value}
              href={`/articles?category=${cat.value}`}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                searchParams.category === cat.value
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-700'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} headingLevel="h2" />
              ))}
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
          <div className="py-12 text-center text-gray-500">
            <p>記事がまだありません。</p>
          </div>
        )}
      </div>
    </>
  );
}
