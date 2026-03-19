import type { Metadata } from 'next';
import { getCountries } from '@/lib/microcms/countries';
import CountryCard from '@/components/country/CountryCard';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { REGIONS, COST_LEVELS } from '@/lib/utils/constants';
import type { Region, CostLevel } from '@/lib/microcms/types';

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: '国から探す',
  description: '留学・ワーキングホリデーの対象国一覧。地域や費用レベルで絞り込んで、あなたにぴったりの留学先を見つけましょう。',
  path: '/countries',
});

type Props = {
  searchParams: { region?: string; cost?: string };
};

export default async function CountriesPage({ searchParams }: Props) {
  const filters: string[] = [];
  if (searchParams.region) {
    filters.push(`region[equals]${searchParams.region}`);
  }
  if (searchParams.cost) {
    filters.push(`costLevel[equals]${searchParams.cost}`);
  }

  const { contents: countries } = await getCountries({
    filters: filters.length > 0 ? filters.join('[and]') : undefined,
    orders: 'nameJp',
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: '国から探す' }]} />

      <h1 className="text-3xl font-bold mb-2">国から探す</h1>
      <p className="text-gray-600 mb-8">留学・ワーキングホリデーの対象国を地域や費用レベルで絞り込み</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">地域</label>
          <div className="flex flex-wrap gap-2">
            <a
              href="/countries"
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                !searchParams.region ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              すべて
            </a>
            {REGIONS.map((r) => (
              <a
                key={r.value}
                href={`/countries?region=${r.value}${searchParams.cost ? `&cost=${searchParams.cost}` : ''}`}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  searchParams.region === r.value ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                {r.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">費用レベル</label>
          <div className="flex flex-wrap gap-2">
            <a
              href={`/countries${searchParams.region ? `?region=${searchParams.region}` : ''}`}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                !searchParams.cost ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              すべて
            </a>
            {COST_LEVELS.map((c) => (
              <a
                key={c.value}
                href={`/countries?${searchParams.region ? `region=${searchParams.region}&` : ''}cost=${c.value}`}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  searchParams.cost === c.value ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
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
