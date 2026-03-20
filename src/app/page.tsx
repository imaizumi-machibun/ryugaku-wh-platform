import Link from 'next/link';
import { getCountries } from '@/lib/microcms/countries';
import { getExperiences } from '@/lib/microcms/experiences';
import { getSchools } from '@/lib/microcms/schools';
import { getReviews } from '@/lib/microcms/reviews';
import { getArticles } from '@/lib/microcms/articles';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCountries from '@/components/home/FeaturedCountries';
import LatestExperiences from '@/components/home/LatestExperiences';
import StatsOverview from '@/components/home/StatsOverview';
import DiscoveryPathways from '@/components/home/DiscoveryPathways';
import TrustBanner from '@/components/home/TrustBanner';
import BeginnerGuide from '@/components/home/BeginnerGuide';
import SchoolCard from '@/components/school/SchoolCard';
import JsonLd from '@/components/seo/JsonLd';
import { generateWebSiteJsonLd, generateOrganizationJsonLd } from '@/lib/seo/jsonld';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ARTICLE_CATEGORIES, SITE_URL } from '@/lib/utils/constants';
import { formatDate } from '@/lib/utils/format';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const [countriesData, experiencesData, schoolsData, reviewsData, articlesData] =
    await Promise.all([
      getCountries({ limit: 100 }),
      getExperiences({ limit: 6 }),
      getSchools({ limit: 100 }),
      getReviews({ limit: 100 }),
      getArticles({ limit: 4, filters: 'isFeatured[equals]true' }).catch(() =>
        getArticles({ limit: 4 })
      ),
    ]);

  const featuredCountryIds = [
    'united-states',
    'canada',
    'australia',
    'united-kingdom',
    'china',
    'philippines',
  ];
  const featuredCountries = featuredCountryIds
    .map((id) => countriesData.contents.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const featuredSchools = schoolsData.contents.filter((s) => s.isFeatured).slice(0, 4);

  return (
    <>
      <JsonLd data={generateWebSiteJsonLd()} />
      <JsonLd data={generateOrganizationJsonLd()} />

      {/* Hero */}
      <HeroSection />

      {/* Trust Banner */}
      <TrustBanner countryCount={countriesData.totalCount} />

      {/* Stats */}
      <StatsOverview
        countryCount={countriesData.totalCount}
        schoolCount={schoolsData.totalCount}
        experienceCount={experiencesData.totalCount}
        reviewCount={reviewsData.totalCount}
      />

      {/* Discovery Pathways */}
      <DiscoveryPathways />

      {/* Featured Countries */}
      <FeaturedCountries countries={featuredCountries} />

      {/* Latest Experiences */}
      <LatestExperiences experiences={experiencesData.contents} />

      {/* Featured Schools */}
      {featuredSchools.length > 0 && (
        <section className="py-12">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">おすすめの学校</h2>
              <Link href="/schools" className="text-primary-600 hover:underline text-sm">
                すべて見る →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSchools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles */}
      {articlesData.contents.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">お役立ち記事</h2>
              <Link href="/articles" className="text-primary-600 hover:underline text-sm">
                すべて見る →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {articlesData.contents.map((article) => {
                const catLabel = ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.label;
                return (
                  <Link key={article.id} href={`/articles/${article.id}`}>
                    <Card hover className="h-full">
                      {article.heroImage && (
                        <div className="relative h-36 w-full">
                          <Image
                            src={article.heroImage.url}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        {catLabel && <Badge variant="primary" className="mb-1">{catLabel}</Badge>}
                        <h3 className="font-bold text-sm line-clamp-2">{article.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(article.publishedAt || article.createdAt)}
                        </p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Beginner Guide */}
      <BeginnerGuide />

      {/* CTA */}
      <section className="py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-4">あなたの体験をシェアしませんか？</h2>
          <p className="text-gray-600 mb-6">
            留学・ワーホリ経験者の声がこれから行く人の道しるべになります
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/submit/experience"
              className="bg-accent-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-accent-600 transition-colors shadow-lg"
            >
              体験談を投稿する
            </Link>
            <Link
              href="/submit/review"
              className="border-2 border-accent-500 text-accent-600 font-semibold px-8 py-3 rounded-lg hover:bg-accent-50 transition-colors"
            >
              口コミを投稿する
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
