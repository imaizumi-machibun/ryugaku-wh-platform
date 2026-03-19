import Link from 'next/link';
import type { Country } from '@/lib/microcms/types';
import CountryCard from '@/components/country/CountryCard';

type Props = {
  countries: Country[];
};

export default function FeaturedCountries({ countries }: Props) {
  if (countries.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">おすすめの国</h2>
          <Link href="/countries" className="text-primary-600 hover:underline text-sm">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {countries.map((country) => (
            <CountryCard key={country.id} country={country} />
          ))}
        </div>
      </div>
    </section>
  );
}
