import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getExperiences } from '@/lib/microcms/experiences';
import ExperienceCard from '@/components/experience/ExperienceCard';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Pagination from '@/components/ui/Pagination';
import SortSelect from '@/components/ui/SortSelect';
import EmptyState from '@/components/ui/EmptyState';
import { CardGridSkeleton } from '@/components/ui/Skeleton';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { PER_PAGE } from '@/lib/utils/constants';

export const revalidate = 1800;

export const metadata: Metadata = generatePageMetadata({
  title: '体験談一覧',
  description: '留学・ワーキングホリデー体験者のリアルな声を掲載。費用、仕事、生活のリアルな情報が満載。',
  path: '/experiences',
});

const SORT_OPTIONS = [
  { value: '', label: '新しい順' },
  { value: 'rating', label: '評価が高い順' },
];

type Props = {
  searchParams: { page?: string; country?: string; sort?: string };
};

export default async function ExperiencesPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * PER_PAGE;

  const filters = searchParams.country
    ? `country[equals]${searchParams.country}`
    : undefined;

  const ordersMap: Record<string, string> = {
    rating: '-ratingOverall',
  };
  const orders = ordersMap[searchParams.sort || ''] || '-publishedAt';

  const { contents: experiences, totalCount } = await getExperiences({
    limit: PER_PAGE,
    offset,
    filters,
    orders,
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: '体験談' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-2">
        <div>
          <h1 className="text-3xl font-bold">体験談</h1>
          <p className="text-gray-600">
            留学・ワーキングホリデー経験者のリアルな声（{totalCount}件）
          </p>
        </div>
        <Suspense>
          <SortSelect options={SORT_OPTIONS} basePath="/experiences" />
        </Suspense>
      </div>

      {experiences.length > 0 ? (
        <>
          <Suspense fallback={<CardGridSkeleton count={PER_PAGE} cols={3} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </Suspense>
          <Pagination
            totalCount={totalCount}
            perPage={PER_PAGE}
            currentPage={page}
            basePath="/experiences"
            searchParams={Object.fromEntries(
              Object.entries({
                country: searchParams.country,
                sort: searchParams.sort,
              }).filter(([, v]) => v != null) as [string, string][]
            )}
          />
        </>
      ) : (
        <EmptyState
          title="体験談がまだありません"
          description="最初の体験談を投稿して、これから留学する人の助けになりましょう"
          actionLabel="体験談を投稿する"
          actionHref="/submit/experience"
        />
      )}
    </div>
  );
}
