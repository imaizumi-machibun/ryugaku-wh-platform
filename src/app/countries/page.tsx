import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCountries } from '@/lib/microcms/countries';
import CountryCard from '@/components/country/CountryCard';
import CountryFilterPanel from '@/components/country/CountryFilterPanel';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/layout/PageHero';
import { buildCountriesMetadata } from '@/lib/countries/countries-metadata';
import {
  filterCountriesByWage,
  parseWageFilter,
  type SearchParamValue,
} from '@/lib/countries/wage-filter';

export const revalidate = 3600;

type Props = {
  searchParams: Record<string, SearchParamValue> & {
    region?: SearchParamValue;
    cost?: SearchParamValue;
    q?: SearchParamValue;
    wageUnit?: SearchParamValue;
    wageMin?: SearchParamValue;
  };
};

export function generateMetadata({ searchParams }: Props): Metadata {
  return buildCountriesMetadata(searchParams);
}

export default async function CountriesPage({ searchParams }: Props) {
  const filters: string[] = [];
  if (typeof searchParams.region === 'string' && searchParams.region) {
    filters.push(`region[contains]${searchParams.region}`);
  }
  if (typeof searchParams.cost === 'string' && searchParams.cost) {
    filters.push(`costLevel[contains]${searchParams.cost}`);
  }

  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const wageFilter = parseWageFilter(searchParams);

  const { contents } = await getCountries({
    filters: filters.length > 0 ? filters.join('[and]') : undefined,
    orders: 'nameJp',
    q: query || undefined,
  });
  const countries = filterCountriesByWage(contents, wageFilter);

  return (
    <>
      <div className="container-custom pt-6">
        <Breadcrumb items={[{ label: '国から探す' }]} />
      </div>
      <PageHero
        eyebrow="Countries"
        title="国から探す"
        description="留学・ワーキングホリデーの対象国を、地域や費用レベルで絞り込めます。"
      />

      <div className="container-custom py-12 md:py-16">
        <div className="mb-8">
          <Suspense fallback={<div className="h-32 bg-gray-50 rounded-xl animate-pulse" />}>
            <CountryFilterPanel />
          </Suspense>
        </div>

        {countries.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {countries.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                activeWageUnit={wageFilter?.unit}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>条件に一致する国が見つかりませんでした。</p>
          </div>
        )}
      </div>
    </>
  );
}
