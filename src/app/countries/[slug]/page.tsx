import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountryBySlug, getCountrySlugs } from '@/lib/microcms/countries';
import { getExperiencesByCountry } from '@/lib/microcms/experiences';
import { getSchools } from '@/lib/microcms/schools';
import QuickFacts from '@/components/country/QuickFacts';
import VisaInfo from '@/components/country/VisaInfo';
import RadarChart from '@/components/country/RadarChart';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ExperienceCard from '@/components/experience/ExperienceCard';
import SchoolCard from '@/components/school/SchoolCard';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateCountryJsonLd, generateFAQJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { generateCountryFAQs } from '@/lib/seo/faq-generator';
import { aggregateExperienceRatings } from '@/lib/utils/aggregation';
import { RATING_LABELS } from '@/lib/utils/constants';

export const revalidate = 1800;

export async function generateStaticParams() {
  const slugs = await getCountrySlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const country = await getCountryBySlug(params.slug);
    return generatePageMetadata({
      title: `${country.nameJp}のワーキングホリデー・留学情報【${new Date().getFullYear()}年最新】`,
      description: `${country.nameJp}（${country.nameEn}）のワーキングホリデー・留学完全ガイド。ビザ情報、費用、体験談、おすすめ学校を紹介。`,
      path: `/countries/${params.slug}`,
      ogImage: country.heroImage?.url,
    });
  } catch {
    return {};
  }
}

export default async function CountryDetailPage({ params }: Props) {
  let country;
  try {
    country = await getCountryBySlug(params.slug);
  } catch {
    notFound();
  }

  const [experiencesData, schoolsData] = await Promise.all([
    getExperiencesByCountry(params.slug, 6),
    getSchools({ filters: `country[equals]${params.slug}`, limit: 6 }),
  ]);

  const experiences = experiencesData.contents;
  const schools = schoolsData.contents;
  const ratings = aggregateExperienceRatings(experiences);
  const faqs = generateCountryFAQs(country);

  const ratingLabels = ['治安', '仕事', 'コスパ', '充実度', '語学上達'];
  const ratingValues = ratings
    ? [
        ratings.ratingSafety || 0,
        ratings.ratingJob || 0,
        ratings.ratingCost || 0,
        ratings.ratingLifestyle || 0,
        ratings.ratingLanguage || 0,
      ]
    : [];

  return (
    <>
      <JsonLd data={generateCountryJsonLd(country, ratings ? { average: ratings.ratingOverall || 0, count: ratings.count } : undefined)} />
      <JsonLd data={generateBreadcrumbJsonLd([{ name: 'ホーム', url: '/' }, { name: '国から探す', url: '/countries' }, { name: country.nameJp, url: `/countries/${params.slug}` }])} />
      {faqs.length > 0 && <JsonLd data={generateFAQJsonLd(faqs)} />}

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '国から探す', href: '/countries' }, { label: country.nameJp }]} />

        {/* Hero */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          {country.heroImage && (
            <div className="relative h-64 md:h-80">
              <Image src={country.heroImage.url} alt={country.nameJp} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          <div className={country.heroImage ? 'absolute bottom-0 left-0 p-6 text-white' : 'py-4'}>
            <div className="flex items-center gap-3 mb-2">
              {country.flagEmoji && <span className="text-4xl">{country.flagEmoji}</span>}
              <h1 className="text-3xl md:text-4xl font-bold">{country.nameJp}</h1>
            </div>
            <p className={country.heroImage ? 'text-white/80' : 'text-gray-600'}>{country.nameEn} | {country.region}</p>
          </div>
        </div>

        {/* Description */}
        {country.description && (
          <div className="prose-custom mb-8" dangerouslySetInnerHTML={{ __html: country.description }} />
        )}

        {/* Quick Facts */}
        <QuickFacts country={country} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Visa Info */}
            <VisaInfo country={country} />

            {/* Popular Cities */}
            {country.popularCities && country.popularCities.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold mb-4">人気都市</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {country.popularCities.map((city, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold">{city.cityName}</h3>
                      {city.cityDescription && <p className="text-sm text-gray-600 mt-1">{city.cityDescription}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold mb-4">よくある質問</h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <details key={i} className="bg-gray-50 rounded-lg p-4 group">
                      <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                        {faq.question}
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">&#9660;</span>
                      </summary>
                      <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Sticky CTA */}
            <div className="bg-accent-50 border border-accent-200 rounded-xl p-5">
              <h3 className="font-bold text-accent-800 mb-2">{country.nameJp}の体験をシェア</h3>
              <p className="text-sm text-accent-700 mb-4">
                {country.nameJp}での留学・ワーホリ体験を投稿しませんか？
              </p>
              <Link
                href="/submit/experience"
                className="block w-full bg-accent-500 text-white text-center py-2.5 rounded-lg hover:bg-accent-600 transition-colors font-semibold text-sm"
              >
                体験談を投稿する
              </Link>
            </div>

            {/* Radar Chart */}
            {ratings && ratings.count > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="font-bold mb-4 text-center">体験者の評価 ({ratings.count}件)</h3>
                <RadarChart labels={ratingLabels} values={ratingValues} />
              </div>
            )}

            {/* Links */}
            {country.sourceUrls && country.sourceUrls.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold mb-3">参考リンク</h3>
                <ul className="space-y-2">
                  {country.sourceUrls.map((src, i) => (
                    <li key={i}>
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                        {src.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Experiences */}
        {experiences.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{country.nameJp}の体験談</h2>
              <Link href={`/experiences?country=${params.slug}`} className="text-primary-600 hover:underline text-sm">
                すべて見る →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </section>
        )}

        {/* Related Schools */}
        {schools.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{country.nameJp}の学校</h2>
              <Link href={`/schools?country=${params.slug}`} className="text-primary-600 hover:underline text-sm">
                すべて見る →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
