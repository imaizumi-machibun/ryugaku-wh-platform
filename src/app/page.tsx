import Image from 'next/image';
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
import DatabaseGateway from '@/components/home/DatabaseGateway';
import SituationGuide from '@/components/home/SituationGuide';
import TrustBanner from '@/components/home/TrustBanner';
import BeginnerGuide from '@/components/home/BeginnerGuide';
import LifeGallery from '@/components/home/LifeGallery';
import SchoolCard from '@/components/school/SchoolCard';
import ArticleCard from '@/components/article/ArticleCard';
import Reveal from '@/components/ui/Reveal';
import JsonLd from '@/components/seo/JsonLd';
import {
  generateWebSiteJsonLd,
  generateOrganizationJsonLd,
  generateItemListJsonLd,
} from '@/lib/seo/jsonld';
import { SITE_URL } from '@/lib/utils/constants';
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
      getArticles({ limit: 8, orders: '-publishedAt' }).catch(() =>
        getArticles({ limit: 8 })
      ),
    ]);

  const featuredCountryIds = [
    'united-states',
    'canada',
    'australia',
    'united-kingdom',
    'china',
    'philippines',
    'taiwan',
    'spain',
  ];
  const featuredCountries = featuredCountryIds
    .map((id) => countriesData.contents.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const featuredSchools = schoolsData.contents.filter((s) => s.isFeatured).slice(0, 4);

  const dbListJsonLd = generateItemListJsonLd({
    name: '主要データベース・ツール',
    description: '留学・ワーホリの国・学校・体験談・記事データベースと診断ツール',
    items: [
      { name: '国から探す', url: '/countries' },
      { name: '学校から探す', url: '/schools' },
      { name: '体験談を読む', url: '/experiences' },
      { name: 'お役立ち記事', url: '/articles' },
      { name: '国を比較する', url: '/compare' },
      { name: '国を診断する', url: '/matching' },
    ],
  });

  return (
    <>
      <JsonLd data={generateWebSiteJsonLd()} />
      <JsonLd data={generateOrganizationJsonLd()} />
      <JsonLd data={dbListJsonLd} />

      {/* 1. Hero（暗・写真） */}
      <HeroSection />

      {/* 2. Trust（明・細帯） */}
      <TrustBanner countryCount={countriesData.totalCount} />

      {/* 3. 巨大数字（暗・濃緑・見せ場） */}
      <StatsOverview
        countryCount={countriesData.totalCount}
        schoolCount={schoolsData.totalCount}
        experienceCount={experiencesData.totalCount}
        reviewCount={reviewsData.totalCount}
      />

      {/* 4. データベース入口（明・白） */}
      <Reveal>
        <DatabaseGateway
          countryCount={countriesData.totalCount}
          schoolCount={schoolsData.totalCount}
          experienceCount={experiencesData.totalCount}
          articleCount={articlesData.totalCount}
        />
      </Reveal>

      {/* 5. 状況別ガイド（明・アイボリー） */}
      <Reveal>
        <SituationGuide />
      </Reveal>

      {/* 6. 人気の国（明・白） */}
      <Reveal>
        <FeaturedCountries countries={featuredCountries} />
      </Reveal>

      {/* 6.5 リアルな毎日（写真ギャラリー・アイボリー） */}
      <Reveal>
        <LifeGallery />
      </Reveal>

      {/* 7. 体験談（暗・濃緑・見せ場） */}
      <Reveal>
        <LatestExperiences experiences={experiencesData.contents} />
      </Reveal>

      {/* 8. おすすめ学校（明・白） */}
      {featuredSchools.length > 0 && (
        <Reveal>
          <section className="bg-white py-24 md:py-32">
            <div className="container-custom">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-primary-600">Schools</p>
              <div className="mb-12 flex items-baseline justify-between gap-4">
                <h2 className="text-display font-black text-gray-900">おすすめの学校</h2>
                <Link href="/schools" className="shrink-0 text-sm font-bold text-primary-600 transition-opacity hover:opacity-80">
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredSchools.map((school) => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* 9. お役立ち記事（明・アイボリー・アイキャッチ付きカード） */}
      {articlesData.contents.length > 0 && (
        <Reveal>
          <section className="bg-gray-50 py-24 md:py-32">
            <div className="container-custom">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-primary-600">Articles</p>
              <div className="mb-12 flex items-baseline justify-between gap-4">
                <h2 className="text-display font-black text-gray-900">お役立ち記事</h2>
                <Link href="/articles" className="shrink-0 text-sm font-bold text-primary-600 transition-opacity hover:opacity-80">
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                {articlesData.contents.map((article) => (
                  <ArticleCard key={article.id} article={article} headingLevel="h3" />
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* 10. はじめての方へ（明・アイボリー） */}
      <Reveal>
        <BeginnerGuide />
      </Reveal>

      {/* 11. 投稿CTA（暗・濃緑・締め） */}
      <section className="section-dark grain relative overflow-hidden py-24 text-white md:py-32">
        {/* 背景写真（旅立ち）。グリーンで深く沈める */}
        <div className="absolute inset-0 z-0">
          <Image src="/home/cta-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 z-[1] bg-primary-900/85" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-tr from-primary-900/95 via-primary-900/80 to-primary-900/70" />
        <div className="container-custom relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-display font-black text-white">
            あなたの体験が、
            <br className="hidden sm:block" />
            次の誰かの地図になる。
          </h2>
          <p className="mt-6 leading-relaxed text-white/70">
            留学・ワーホリ経験者の声が、これから旅立つ人の道しるべになります。
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/submit/experience"
              className="rounded-xl bg-accent-400 px-8 py-4 font-bold text-primary-900 transition-all duration-200 ease-smooth hover:bg-accent-300 hover:shadow-glow-accent"
            >
              体験談を投稿する
            </Link>
            <Link
              href="/submit/review"
              className="rounded-xl border border-white/40 px-8 py-4 font-bold text-white transition-colors duration-200 hover:bg-white/10"
            >
              口コミを投稿する
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
