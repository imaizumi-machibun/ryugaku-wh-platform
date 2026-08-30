import Link from 'next/link';
import type { Country } from '@/lib/microcms/types';
import CountryCard from '@/components/country/CountryCard';

type Props = {
  countries: Country[];
};

export default function FeaturedCountries({ countries }: Props) {
  if (countries.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-custom">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-primary-600">Countries</p>
        <div className="mb-12 flex items-baseline justify-between gap-4">
          <h2 className="text-display font-black text-gray-900">人気の国から探す</h2>
          <Link href="/countries" className="shrink-0 text-sm font-bold text-primary-600 transition-opacity hover:opacity-80">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {countries.map((country) => (
            <CountryCard key={country.id} country={country} />
          ))}
        </div>
      </div>
    </section>
  );
}
