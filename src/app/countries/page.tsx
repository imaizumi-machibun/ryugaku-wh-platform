import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCountries } from '@/lib/microcms/countries';
import CountryCard from '@/components/country/CountryCard';
import CountryFilterPanel from '@/components/country/CountryFilterPanel';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const revalidate = 3600;

type Props = {
  searchParams: { region?: string; cost?: string; q?: string };
};

export function generateMetadata({ searchParams }: Props): Metadata {
  const hasQuery = !!searchParams.q;
  return generatePageMetadata({
    title: '国から探す',
    description: '留学・ワーキングホリデーの対象国一覧。地域や費用レベルで絞り込んで、あなたにぴったりの留学先を見つけましょう。',
    path: hasQuery ? `/countries?q=${encodeURIComponent(searchParams.q!)}` : '/countries',
    noindex: hasQuery,
  });
}

export default async function CountriesPage({ searchParams }: Props) {
  const filters: string[] = [];
  if (searchParams.region) {
    filters.push(`region[contains]${searchParams.region}`);
  }
  if (searchParams.cost) {
    filters.push(`costLevel[contains]${searchParams.cost}`);
  }

  const { contents: countries } = await getCountries({
    filters: filters.length > 0 ? filters.join('[and]') : undefined,
    orders: 'nameJp',
    q: searchParams.q || undefined,
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: '国から探す' }]} />

      <h1 className="text-3xl font-bold mb-2">国から探す</h1>
      <p className="text-gray-600 mb-8">留学・ワーキングホリデーの対象国を地域や費用レベルで絞り込み</p>

      <div className="mb-8">
        <Suspense fallback={<div className="h-32 bg-gray-50 rounded-xl animate-pulse" />}>
          <CountryFilterPanel />
        </Suspense>
      </div>

      {/* Country grid */}
      {countries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {countries.map((country) => (
            <CountryCard key={country.id} country={country} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>条件に一致する国が見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}
