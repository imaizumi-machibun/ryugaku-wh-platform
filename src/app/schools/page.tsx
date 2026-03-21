import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getSchools, buildSchoolFilters } from '@/lib/microcms/schools';
import { getCountries } from '@/lib/microcms/countries';
import { getReviews } from '@/lib/microcms/reviews';
import SchoolCard from '@/components/school/SchoolCard';
import SchoolFilterPanel from '@/components/school/SchoolFilterPanel';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Pagination from '@/components/ui/Pagination';
import SortSelect from '@/components/ui/SortSelect';
import EmptyState from '@/components/ui/EmptyState';
import { CardGridSkeleton } from '@/components/ui/Skeleton';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { PER_PAGE } from '@/lib/utils/constants';

export const revalidate = 3600;

export function generateMetadata({ searchParams }: Props): Metadata {
  const hasQuery = !!searchParams.q;
  return generatePageMetadata({
    title: '学校から探す',
    description: '語学学校・留学スクールを国・言語・費用帯で比較検索。口コミ・評価付き。',
    path: hasQuery ? `/schools?q=${encodeURIComponent(searchParams.q!)}` : '/schools',
    noindex: hasQuery,
  });
}

const SORT_OPTIONS = [
  { value: '', label: '新しい順' },
  { value: 'name', label: '名前順' },
];

type Props = {
  searchParams: { country?: string; language?: string; cost?: string; page?: string; sort?: string; q?: string };
};

export default async function SchoolsPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * PER_PAGE;

  const filters = buildSchoolFilters({
    country: searchParams.country,
    language: searchParams.language,
    cost: searchParams.cost,
  });

  // Map sort param to microCMS orders
  const ordersMap: Record<string, string> = {
    name: 'name',
  };
  const orders = ordersMap[searchParams.sort || ''] || '-createdAt';

  const [schoolsData, countriesData, reviewsData] = await Promise.all([
    getSchools({
      limit: PER_PAGE,
      offset,
      filters: filters || undefined,
      orders,
      q: searchParams.q || undefined,
    }),
    getCountries({ limit: 100 }),
    getReviews({ limit: 100 }),
  ]);

  const { contents: schools, totalCount } = schoolsData;

  // Build review aggregation map per school
  const reviewMap: Record<string, { count: number; totalRating: number }> = {};
  for (const review of reviewsData.contents) {
    const schoolId = review.school?.id;
    if (!schoolId) continue;
    if (!reviewMap[schoolId]) reviewMap[schoolId] = { count: 0, totalRating: 0 };
    reviewMap[schoolId].count++;
    reviewMap[schoolId].totalRating += review.ratingOverall;
  }

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: '学校から探す' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
        <div>
          <h1 className="text-3xl font-bold">学校から探す</h1>
          <p className="text-gray-600">
            語学学校・留学スクールを比較検索（{totalCount}件）
          </p>
        </div>
        <Suspense>
          <SortSelect options={SORT_OPTIONS} basePath="/schools" />
        </Suspense>
      </div>

      <div className="mb-8">
        <Suspense fallback={<div className="h-32 bg-gray-50 rounded-xl animate-pulse" />}>
          <SchoolFilterPanel
            countries={countriesData.contents}
          />
        </Suspense>
      </div>

      {schools.length > 0 ? (
        <>
          <Suspense fallback={<CardGridSkeleton count={PER_PAGE} cols={4} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {schools.map((school) => {
                const rev = reviewMap[school.id];
                return (
                  <SchoolCard
                    key={school.id}
                    school={school}
                    reviewCount={rev?.count}
                    averageRating={rev ? Math.round((rev.totalRating / rev.count) * 10) / 10 : undefined}
                  />
                );
              })}
            </div>
          </Suspense>
          <Pagination
            totalCount={totalCount}
            perPage={PER_PAGE}
            currentPage={page}
            basePath="/schools"
            searchParams={Object.fromEntries(
              Object.entries({
                country: searchParams.country,
                language: searchParams.language,
                cost: searchParams.cost,
                sort: searchParams.sort,
                q: searchParams.q,
              }).filter(([, v]) => v != null) as [string, string][]
            )}
          />
        </>
      ) : (
        <EmptyState
          title="条件に一致する学校が見つかりませんでした"
          description="フィルター条件を変更して再度お試しください"
          actionLabel="フィルターをリセット"
          actionHref="/schools"
        />
      )}
    </div>
  );
}
