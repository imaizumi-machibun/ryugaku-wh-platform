import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountryBySlug, getCountrySlugs } from '@/lib/microcms/countries';
import { getExperiencesByCountry } from '@/lib/microcms/experiences';
import { getSchools } from '@/lib/microcms/schools';
import { resolveCountryPurposeGuide } from '@/lib/microcms/countryPurposeGuides';
import { evaluateCountryPurposeGate } from '@/lib/country-purpose/gate';
import { isVerifiedForPurpose } from '@/lib/experiences/classification';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ExperienceCard from '@/components/experience/ExperienceCard';
import SchoolCard from '@/components/school/SchoolCard';
import { generateCountryMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generatePlaceJsonLd } from '@/lib/seo/jsonld';
import { getCitiesByCountry } from '@/lib/data/cities';

export const revalidate = 1800;

export async function generateStaticParams() {
  const slugs = await getCountrySlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const country = await getCountryBySlug(params.slug).catch(() => null);
  return country ? generateCountryMetadata(country, `/countries/${params.slug}`) : {};
}

function OverviewFacts({ country }: { country: Awaited<ReturnType<typeof getCountryBySlug>> }) {
  const facts = [
    ['首都', country.capital],
    ['公用語・主要言語', country.officialLanguage],
    ['通貨', country.currency ? `${country.currency}${country.currencyCode ? `（${country.currencyCode}）` : ''}` : undefined],
    ['日本との時差', country.timeDifferenceJapan],
    ['フライト時間', country.flightTimeHours ? `約${country.flightTimeHours}時間` : undefined],
    ['過ごしやすい時期', country.bestSeason],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));
  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
      {facts.map(([label, value]) => (
        <div key={label} className="bg-white p-5">
          <dt className="text-sm text-gray-500">{label}</dt>
          <dd className="mt-1 font-semibold text-gray-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function CountryDetailPage({ params }: Props) {
  const country = await getCountryBySlug(params.slug).catch(() => null);
  if (!country) notFound();

  const [experiencesData, schoolsData, whGuide, studyGuide] = await Promise.all([
    getExperiencesByCountry(params.slug, 100).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getSchools({ filters: `country[equals]${params.slug}`, limit: 6, depth: 2 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    resolveCountryPurposeGuide(country, 'working-holiday'),
    resolveCountryPurposeGuide(country, 'study-abroad'),
  ]);
  const experiences = experiencesData.contents;
  const schools = schoolsData.contents;
  const whExperiences = experiences.filter((experience) => isVerifiedForPurpose(experience, 'working-holiday'));
  const studyExperiences = experiences.filter((experience) => isVerifiedForPurpose(experience, 'study-abroad'));
  const whGate = evaluateCountryPurposeGate({ country, purpose: 'working-holiday', guide: whGuide, experiences, schools });
  const studyGate = evaluateCountryPurposeGate({ country, purpose: 'study-abroad', guide: studyGuide, experiences, schools });
  const cities = getCitiesByCountry(params.slug);

  const purposeCards = [
    {
      purpose: 'working-holiday' as const,
      label: `${country.nameJp}ワーホリ`,
      description: '制度、ビザ申請、仕事、賃金、税、年間予算、住居、安全、渡航後手続をワーホリ視点で確認します。',
      count: whExperiences.length,
      published: whGate.pass,
    },
    {
      purpose: 'study-abroad' as const,
      label: `${country.nameJp}留学`,
      description: '留学種別、入学条件、学校・都市選び、学費、ビザ、住居、奨学金、卒業後を留学視点で確認します。',
      count: studyExperiences.length,
      published: studyGate.pass,
    },
  ];

  return (
    <>
      <JsonLd data={generatePlaceJsonLd({
        name: country.nameJp,
        countryName: country.nameEn,
        description: country.description?.replace(/<[^>]+>/g, '').slice(0, 200),
      })} />
      <JsonLd data={generateBreadcrumbJsonLd([
        { name: 'ホーム', url: '/' },
        { name: '国一覧', url: '/countries' },
        { name: country.nameJp, url: `/countries/${params.slug}` },
      ])} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '国一覧', href: '/countries' }, { label: country.nameJp }]} />

        <header className="relative mt-4 overflow-hidden rounded-3xl bg-gray-900">
          {country.heroImage && <Image src={country.heroImage.url} alt={`${country.nameJp}の風景`} fill priority className="object-cover opacity-60" />}
          <div className="relative z-10 px-6 py-14 text-white md:px-12 md:py-20">
            <div className="flex items-center gap-3">
              {country.flagEmoji && <span className="text-4xl" aria-hidden>{country.flagEmoji}</span>}
              <div>
                <p className="text-sm text-white/75">{country.region}</p>
                <h1 className="text-4xl font-bold md:text-5xl">{country.nameJp}</h1>
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/85">
              {country.nameEn}の基本情報、気候、通貨、主要都市、生活環境を確認する国別ハブです。
              ワーホリと留学の制度・費用・体験談は、目的別ページで分けて詳しく解説します。
            </p>
            {purposeCards.some((card) => card.published) && (
              <nav aria-label={`${country.nameJp}の目的別ガイド`} className="mt-7 flex flex-wrap gap-3">
                {purposeCards.filter((card) => card.published).map((card) => (
                  <Link
                    key={card.purpose}
                    href={`/countries/${params.slug}/${card.purpose}`}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary-800 shadow-sm transition hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {card.label}完全ガイドへ
                    <span className="ml-2 font-normal text-primary-600">
                      {card.count > 0 ? `体験談${card.count}件` : '制度・費用・生活を詳しく解説'}
                    </span>
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </header>

        {country.description && <div className="prose-custom mx-auto my-10 max-w-4xl" dangerouslySetInnerHTML={{ __html: country.description }} />}
        <OverviewFacts country={country} />

        <section className="mt-14">
          <h2 className="text-2xl font-bold">目的から詳しく見る</h2>
          <p className="mt-2 text-gray-600">同じ国でも、ワーホリ生活と留学生活では必要な準備や判断軸が異なります。</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {purposeCards.map((card) => (
              <article key={card.purpose} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-bold">{card.label}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${card.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {card.published ? '公開中' : '準備中'}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-sm leading-7 text-gray-600">{card.description}</p>
                <p className="mt-4 text-sm font-semibold text-gray-800">
                  {card.count > 0 ? `体験談 ${card.count}件を掲載` : '制度・申請・現地生活を公的一次情報から解説'}
                </p>
                {card.published ? (
                  <Link href={`/countries/${params.slug}/${card.purpose}`} className="mt-5 rounded-xl bg-primary-700 px-5 py-3 text-center font-semibold text-white hover:bg-primary-800">
                    {card.label}の詳細と体験談を見る
                  </Link>
                ) : (
                  <p className="mt-5 rounded-xl bg-gray-50 px-5 py-3 text-center text-sm text-gray-600">
                    公式情報・体験談・国固有データが公開基準に達し次第公開します
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        {cities.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold">{country.nameJp}の主要都市</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <Link key={city.slug} href={`/countries/${params.slug}/cities/${city.slug}`} className="rounded-xl border border-gray-200 p-5 hover:border-primary-300 hover:bg-primary-50">
                  <h3 className="font-semibold">{city.nameJp}<span className="ml-2 text-sm font-normal text-gray-500">{city.nameEn}</span></h3>
                  <p className="mt-2 text-sm text-gray-600">{city.monthlyLivingJpy ? `生活費 月${Math.round(city.monthlyLivingJpy / 10000)}万円目安` : city.highlights?.[0]}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {(whExperiences.length > 0 || studyExperiences.length > 0) && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold">最新の検証済み体験談</h2>
            {whExperiences.length > 0 && (
              <div className="mt-7">
                <div className="flex items-center justify-between"><h3 className="text-lg font-bold">ワーホリ</h3>{whGate.pass && <Link href={`/countries/${params.slug}/working-holiday#experience-list`} className="text-sm text-primary-700 hover:underline">すべて見る</Link>}</div>
                <div className="mt-4 grid gap-6 md:grid-cols-3">{whExperiences.slice(0, 3).map((experience) => <ExperienceCard key={experience.id} experience={experience} />)}</div>
              </div>
            )}
            {studyExperiences.length > 0 && (
              <div className="mt-9">
                <div className="flex items-center justify-between"><h3 className="text-lg font-bold">留学</h3>{studyGate.pass && <Link href={`/countries/${params.slug}/study-abroad#experience-list`} className="text-sm text-primary-700 hover:underline">すべて見る</Link>}</div>
                <div className="mt-4 grid gap-6 md:grid-cols-3">{studyExperiences.slice(0, 3).map((experience) => <ExperienceCard key={experience.id} experience={experience} />)}</div>
              </div>
            )}
          </section>
        )}

        {schools.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">{country.nameJp}の学校</h2><Link href={`/schools?country=${params.slug}`} className="text-sm text-primary-700 hover:underline">すべて見る</Link></div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{schools.map((school) => <SchoolCard key={school.id} school={school} />)}</div>
          </section>
        )}

        {country.sourceUrls && country.sourceUrls.length > 0 && (
          <section className="mt-14 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold">国の概要に関する参考リンク</h2>
            <ul className="mt-4 flex flex-wrap gap-3">{country.sourceUrls.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:underline">{source.label} ↗</a></li>)}</ul>
          </section>
        )}
      </div>
    </>
  );
}
