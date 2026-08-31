import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import type { CountryPurposeGuidePurpose, Experience, School } from '@/lib/microcms/types';
import { getCountryBySlug } from '@/lib/microcms/countries';
import { getExperiencesByCountry } from '@/lib/microcms/experiences';
import { getAllSchoolsByCountry } from '@/lib/microcms/schools';
import { resolveCountryPurposeGuide } from '@/lib/microcms/countryPurposeGuides';
import { evaluateCountryPurposeGate } from '@/lib/country-purpose/gate';
import {
  isVerifiedForPurpose,
  STUDY_TYPE_LABELS,
} from '@/lib/experiences/classification';
import { extractFaqFromArticleBody } from '@/lib/utils/article-faq';
import { ARTICLE_IMAGE_SLUGS } from '@/lib/utils/article-images';
import {
  getCountryPurposeVisuals,
  type CountryPurposeVisual,
} from '@/lib/country-purpose/visuals';
import { cleanPurposeArticleReaderContent } from '@/lib/country-purpose/article-reader-content';
import { SITE_URL } from '@/lib/utils/constants';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ExperienceCard from '@/components/experience/ExperienceCard';
import JsonLd from '@/components/seo/JsonLd';
import {
  generateBreadcrumbJsonLd,
  generateCollectionPageJsonLd,
  generateFAQJsonLd,
  generateItemListJsonLd,
} from '@/lib/seo/jsonld';

const PAGE_SIZE = 12;

export type PurposeSearchParams = {
  city?: string;
  duration?: string;
  age?: string;
  studyType?: string;
  school?: string;
  schoolCity?: string;
  schoolQuery?: string;
  q?: string;
  page?: string;
};

const PURPOSE_COPY = {
  'working-holiday': {
    label: 'ワーホリ',
    titleSuffix: 'ワーホリ完全ガイド',
    experienceHeading: 'ワーホリ体験談',
    summary:
      '制度・申請・費用・仕事・住居・税・安全と、本人確認済みのワーホリ体験談を一つのページで確認できます。',
  },
  'study-abroad': {
    label: '留学',
    titleSuffix: '留学完全ガイド',
    experienceHeading: '留学体験談',
    summary:
      '留学種別・学校選び・入学条件・学費・ビザ・住居・卒業後と、本人確認済みの留学体験談を一つのページで確認できます。',
  },
} as const;

function scalar(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function inDurationBucket(months: number | undefined, bucket: string): boolean {
  if (!bucket) return true;
  if (!months) return false;
  if (bucket === 'short') return months <= 3;
  if (bucket === 'medium') return months >= 4 && months <= 8;
  if (bucket === 'long') return months >= 9 && months <= 12;
  if (bucket === 'over-year') return months >= 13;
  return true;
}

function inAgeBucket(age: number | undefined, bucket: string): boolean {
  if (!bucket) return true;
  if (!age) return false;
  if (bucket === 'under-24') return age <= 24;
  if (bucket === '25-29') return age >= 25 && age <= 29;
  if (bucket === '30-plus') return age >= 30;
  return true;
}

function filterExperiences(
  experiences: Experience[],
  purpose: CountryPurposeGuidePurpose,
  params: PurposeSearchParams
): Experience[] {
  const city = scalar(params.city);
  const duration = scalar(params.duration);
  const age = scalar(params.age);
  const studyType = scalar(params.studyType);
  const school = scalar(params.school);
  const query = scalar(params.q).toLowerCase();
  return experiences.filter((experience) => {
    if (!isVerifiedForPurpose(experience, purpose)) return false;
    if (city && experience.cityPrimary !== city) return false;
    if (!inDurationBucket(experience.durationMonths, duration)) return false;
    if (!inAgeBucket(experience.ageAtDeparture, age)) return false;
    if (purpose === 'study-abroad' && studyType && experience.studyType !== studyType) return false;
    if (purpose === 'study-abroad' && school && experience.school?.id !== school) return false;
    if (query) {
      const haystack = `${experience.title} ${experience.content} ${experience.advice ?? ''}`
        .replace(/<[^>]+>/g, ' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

function filterSchools(schools: School[], params: PurposeSearchParams): School[] {
  const city = scalar(params.schoolCity);
  const query = scalar(params.schoolQuery).trim().toLocaleLowerCase('ja');
  return schools.filter((school) => {
    if (city && school.city !== city) return false;
    if (query && !`${school.name} ${school.city}`.toLocaleLowerCase('ja').includes(query)) return false;
    return true;
  });
}

function buildQuery(params: PurposeSearchParams, page: number): string {
  const query = new URLSearchParams();
  for (const key of ['city', 'duration', 'age', 'studyType', 'school', 'schoolCity', 'schoolQuery', 'q'] as const) {
    const value = scalar(params[key]);
    if (value) query.set(key, value);
  }
  if (page > 1) query.set('page', String(page));
  const value = query.toString();
  return value ? `?${value}` : '';
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

function GuideSources({
  sources,
}: {
  sources: { label: string; url: string; supports: string; checkedAt?: string }[];
}) {
  if (sources.length === 0) return null;
  return (
    <section className="mt-14" aria-labelledby="official-sources">
      <h2 id="official-sources" className="text-2xl font-bold">公式出典と確認日</h2>
      <p className="mt-2 text-sm leading-7 text-gray-600">
        変動する制度・料金・就労条件は、公開前と申請前に各公式ページを再確認してください。
      </p>
      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {sources.map((source) => (
          <li key={source.url} className="rounded-xl border border-gray-200 p-4">
            <a className="font-semibold text-primary-700 hover:underline" href={source.url} target="_blank" rel="noopener noreferrer">
              {source.label} ↗
            </a>
            <p className="mt-1 text-sm text-gray-600">確認対象：{source.supports}</p>
            {source.checkedAt && <p className="mt-1 text-xs text-gray-500">確認日：{source.checkedAt.slice(0, 10)}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function PurposeVisualFigure({ visual }: { visual: CountryPurposeVisual }) {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-soft">
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
        />
      </div>
      <figcaption className="px-4 py-3 text-xs leading-6 text-gray-600 md:px-5">
        <span>{visual.caption}</span>
        <span className="ml-1 whitespace-nowrap">
          Photo: <a className="font-medium text-primary-700 hover:underline" href={`${visual.photographerProfileUrl}?utm_source=study_work_hub&utm_medium=referral`} target="_blank" rel="noopener noreferrer">{visual.photographerName}</a>
          {' / '}
          <a className="text-primary-700 hover:underline" href={`${visual.sourceUrl}?utm_source=study_work_hub&utm_medium=referral`} target="_blank" rel="noopener noreferrer">Unsplash</a>
        </span>
      </figcaption>
    </figure>
  );
}

function splitGuideBody(body: string): string[] {
  return body.split(/(?=<h2(?:\s|>))/i).filter((section) => section.trim().length > 0);
}

export default async function CountryPurposePage({
  countrySlug,
  purpose,
  searchParams,
}: {
  countrySlug: string;
  purpose: CountryPurposeGuidePurpose;
  searchParams: PurposeSearchParams;
}) {
  const country = await getCountryBySlug(countrySlug).catch(() => null);
  if (!country) notFound();

  const [guide, experiencesData, schools] = await Promise.all([
    resolveCountryPurposeGuide(country, purpose),
    getExperiencesByCountry(countrySlug, 100).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    purpose === 'study-abroad' ? getAllSchoolsByCountry(countrySlug).catch(() => []) : Promise.resolve([]),
  ]);
  const allExperiences = experiencesData.contents;
  const gate = evaluateCountryPurposeGate({ country, purpose, guide, experiences: allExperiences, schools });
  if (!guide || !gate.pass) notFound();

  const verifiedExperiences = allExperiences.filter((experience) => isVerifiedForPurpose(experience, purpose));
  const filtered = filterExperiences(verifiedExperiences, purpose, searchParams);
  const filteredSchools = purpose === 'study-abroad' ? filterSchools(schools, searchParams) : [];
  const displayedSchools = filteredSchools.slice(0, PAGE_SIZE);
  const currentPage = Math.max(1, Number.parseInt(scalar(searchParams.page) || '1', 10) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages && filtered.length > 0) notFound();
  const displayed = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const copy = PURPOSE_COPY[purpose];
  const pageSummary = purpose === 'study-abroad' && guide.introduction
    ? guide.introduction
    : verifiedExperiences.length > 0
      ? copy.summary
      : `${copy.label}の制度・申請・費用・仕事・住居・安全・渡航後手続を、公的一次情報に基づいて具体的に解説します。`;
  const basePath = `/countries/${countrySlug}/${purpose}`;
  const cities = Array.from(
    new Set(verifiedExperiences.map((experience) => experience.cityPrimary).filter(Boolean))
  ).sort();
  const usedSchools = schools.filter((school) => verifiedExperiences.some((experience) => experience.school?.id === school.id));
  const schoolCities = Array.from(new Set(schools.map((school) => school.city).filter(Boolean))).sort();
  const durationMedian = median(verifiedExperiences.flatMap((experience) => experience.durationMonths ? [experience.durationMonths] : []));
  const ages = verifiedExperiences.flatMap((experience) => experience.ageAtDeparture ? [experience.ageAtDeparture] : []);
  const readerGuideBody = cleanPurposeArticleReaderContent(guide.body, {
    adviceHeading: `${country.nameJp}${copy.label}が向いている人`,
    safetyHeading: `${country.nameJp}で安全に暮らすための対策`,
  });
  const faqs = extractFaqFromArticleBody(readerGuideBody);
  const purposeVisuals = getCountryPurposeVisuals(countrySlug, purpose);
  const heroVisual = purposeVisuals?.hero;
  const heroImageUrl = heroVisual?.src
    ?? guide.heroImage?.url
    ?? country.heroImage?.url
    ?? (ARTICLE_IMAGE_SLUGS.has(guide.sourceArticleId)
      ? `/articles/article-${guide.sourceArticleId}.jpg`
      : null);
  const guideBodySections = splitGuideBody(readerGuideBody);
  const breadcrumb = [
    { name: 'ホーム', url: '/' },
    { name: '国一覧', url: '/countries' },
    { name: country.nameJp, url: `/countries/${countrySlug}` },
    { name: `${country.nameJp}${copy.label}`, url: basePath },
  ];
  const experienceItemList = generateItemListJsonLd({
    name: `${country.nameJp}${copy.experienceHeading}`,
    items: displayed.map((experience) => ({ name: experience.title, url: `/experiences/${experience.id}` })),
  });
  const schoolItemList = generateItemListJsonLd({
    name: `${country.nameJp}の掲載校`,
    items: displayedSchools.map((school) => ({
      name: school.name,
      url: `/schools/${school.id}`,
      image: school.heroImage?.url,
    })),
  });
  const primaryItemList = purpose === 'study-abroad' && displayedSchools.length > 0
    ? schoolItemList
    : displayed.length > 0
      ? experienceItemList
      : undefined;

  const sources = [...guide.sources];
  for (const source of country.sourceUrls ?? []) {
    if (!sources.some((item) => item.url === source.url)) {
      sources.push({ label: source.label, url: source.url, supports: '国別の基礎情報', checkedAt: guide.checkedAt });
    }
  }

  return (
    <>
      <JsonLd data={generateCollectionPageJsonLd({
        name: `${country.nameJp}${copy.titleSuffix}`,
        description: pageSummary,
        url: `${SITE_URL}${basePath}`,
        itemListJsonLd: primaryItemList,
      })} />
      {purpose === 'study-abroad' && displayed.length > 0 && <JsonLd data={experienceItemList} />}
      <JsonLd data={generateBreadcrumbJsonLd(breadcrumb)} />
      {faqs.length > 0 && <JsonLd data={generateFAQJsonLd(faqs)} />}

      <div className="container-custom py-8">
        <Breadcrumb items={[
          { label: '国一覧', href: '/countries' },
          { label: country.nameJp, href: `/countries/${countrySlug}` },
          { label: `${country.nameJp}${copy.label}` },
        ]} />

        <header className="relative mt-4 min-h-[390px] overflow-hidden rounded-3xl bg-primary-900 text-white md:min-h-[430px]">
          {heroImageUrl && (
            <Image src={heroImageUrl} alt={heroVisual?.alt ?? `${country.nameJp}${copy.label}の現地風景`} fill priority sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover" />
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-900/50 to-transparent" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />
          <div className="relative z-10 flex min-h-[390px] flex-col justify-end px-6 py-10 md:min-h-[430px] md:px-12 md:py-14">
            <p className="text-sm font-semibold text-accent-300">{country.flagEmoji} {country.nameEn}</p>
            <h1 className="mt-2 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
              {country.nameJp}{copy.titleSuffix}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/85">{pageSummary}</p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm">
              {verifiedExperiences.length > 0 && <span className="rounded-full bg-white/15 px-4 py-2">体験談 {verifiedExperiences.length}件</span>}
              <span className="rounded-full bg-white/15 px-4 py-2">公式情報確認 {guide.checkedAt.slice(0, 10)}</span>
              <span className="rounded-full bg-white/15 px-4 py-2">
                {purpose === 'study-abroad' ? '学校・費用・ビザ・生活を網羅' : '制度・費用・仕事・生活を網羅'}
              </span>
            </div>
          </div>
          {heroVisual && (
            <p className="absolute bottom-3 right-4 z-20 rounded-full bg-black/45 px-3 py-1 text-[11px] text-white/90 backdrop-blur-sm">
              Photo: <a className="hover:underline" href={`${heroVisual.photographerProfileUrl}?utm_source=study_work_hub&utm_medium=referral`} target="_blank" rel="noopener noreferrer">{heroVisual.photographerName}</a>
              {' / '}
              <a className="hover:underline" href={`${heroVisual.sourceUrl}?utm_source=study_work_hub&utm_medium=referral`} target="_blank" rel="noopener noreferrer">Unsplash</a>
            </p>
          )}
        </header>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="このページの目次">
          <a href="#complete-guide" className="rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">詳細ガイド</a>
          {purpose === 'study-abroad' && <a href="#school-list" className="rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">学校一覧</a>}
          {verifiedExperiences.length > 0 && <a href="#experience-data" className="rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">体験者データ</a>}
          <a href="#experience-list" className="rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">体験談一覧</a>
          <a href="#official-sources" className="rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">公式出典</a>
        </nav>

        <article id="complete-guide" className="prose-custom mx-auto mt-12 max-w-4xl">
          {guideBodySections.map((section, index) => {
            const inlineVisual = index === 1
              ? purposeVisuals?.inline[0]
              : index === 3
                ? purposeVisuals?.inline[1]
                : undefined;
            return (
              <Fragment key={`${guide.sourceArticleId}-${index}`}>
                <div dangerouslySetInnerHTML={{ __html: section }} />
                {inlineVisual && <PurposeVisualFigure visual={inlineVisual} />}
              </Fragment>
            );
          })}
        </article>

        {purpose === 'study-abroad' && (
          <section id="school-list" className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">{country.nameJp}の学校を比較する</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-600">
                  Study Work Hubに掲載中の{schools.length}校から、学校名と都市で候補を絞れます。
                  コース、授業料、認定、入学可否は変わるため、比較の最終段階で必ず各校の公式情報を確認してください。
                </p>
              </div>
              <Link href={`/schools?country=${countrySlug}`} className="text-sm font-semibold text-primary-700 hover:underline">
                {country.nameJp}の掲載校をすべて見る
              </Link>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4"><dt className="text-sm text-gray-500">掲載校</dt><dd className="mt-1 text-2xl font-bold">{schools.length}校</dd></div>
              <div className="rounded-xl border border-gray-200 bg-white p-4"><dt className="text-sm text-gray-500">掲載都市</dt><dd className="mt-1 text-2xl font-bold">{schoolCities.length}都市</dd></div>
              <div className="rounded-xl border border-gray-200 bg-white p-4"><dt className="text-sm text-gray-500">留学体験談</dt><dd className="mt-1 text-2xl font-bold">{verifiedExperiences.length > 0 ? `${verifiedExperiences.length}件` : '募集中'}</dd></div>
              <div className="rounded-xl border border-gray-200 bg-white p-4"><dt className="text-sm text-gray-500">公式参考先</dt><dd className="mt-1 text-2xl font-bold">{sources.length}件</dd></div>
            </dl>

            <form method="get" className="mt-6 grid gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[1fr_1fr_auto]">
              <label className="text-xs font-semibold text-gray-700">学校名
                <input name="schoolQuery" defaultValue={scalar(searchParams.schoolQuery)} placeholder="学校名を入力" className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
              </label>
              <label className="text-xs font-semibold text-gray-700">都市
                <select name="schoolCity" defaultValue={scalar(searchParams.schoolCity)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm">
                  <option value="">すべて</option>
                  {schoolCities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </label>
              <button className="self-end rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800">学校を絞り込む</button>
            </form>

            {displayedSchools.length > 0 ? (
              <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayedSchools.map((school) => (
                  <Link key={school.id} href={`/schools/${school.id}`} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md">
                    <h3 className="font-bold text-gray-900">{school.name}</h3>
                    <p className="mt-2 text-sm text-gray-600">{school.city || '都市情報を確認中'}</p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-primary-700">学校詳細を見る →</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
                この条件に合う掲載校はありません。条件を減らしてもう一度お試しください。
              </div>
            )}
            {filteredSchools.length > displayedSchools.length && (
              <p className="mt-5 text-center text-sm text-gray-600">
                最初の{displayedSchools.length}校を表示しています。残りは「掲載校をすべて見る」から確認できます。
              </p>
            )}
          </section>
        )}

        {verifiedExperiences.length > 0 && <section id="experience-data" className="mt-14 rounded-2xl border border-primary-100 bg-primary-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold">
            {copy.experienceHeading}から分かること
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-700">
            本人の記述から渡航目的を確認できた{verifiedExperiences.length}件を集計しています。
            回答者の自己選択データであり、国全体の平均や成功率を示すものではありません。
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4"><dt className="text-sm text-gray-500">検証済み件数</dt><dd className="mt-1 text-2xl font-bold">{verifiedExperiences.length}件</dd></div>
            <div className="rounded-xl bg-white p-4"><dt className="text-sm text-gray-500">登場する都市</dt><dd className="mt-1 text-2xl font-bold">{verifiedExperiences.length > 0 ? `${cities.length}都市` : '集計対象なし'}</dd></div>
            <div className="rounded-xl bg-white p-4"><dt className="text-sm text-gray-500">滞在期間の中央値</dt><dd className="mt-1 text-2xl font-bold">{durationMedian ? `${durationMedian}か月` : '集計対象なし'}</dd></div>
          </dl>
          {ages.length > 0 && <p className="mt-4 text-xs text-gray-600">回答者の出発年齢範囲：{Math.min(...ages)}〜{Math.max(...ages)}歳（確認できた回答のみ）</p>}
        </section>}

        <section id="experience-list" className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">{country.nameJp}の{copy.experienceHeading}</h2>
              {verifiedExperiences.length > 0 && <p className="mt-2 text-sm text-gray-600">条件に合う体験談：{filtered.length}件</p>}
            </div>
            {Object.values(searchParams).some(Boolean) && <Link href={basePath} className="text-sm text-primary-700 hover:underline">絞り込みを解除</Link>}
          </div>

          {verifiedExperiences.length > 0 && <form method="get" className="mt-6 grid gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-3 lg:grid-cols-6">
            <label className="text-xs font-semibold text-gray-700">都市
              <select name="city" defaultValue={scalar(searchParams.city)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm">
                <option value="">すべて</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-gray-700">期間
              <select name="duration" defaultValue={scalar(searchParams.duration)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm">
                <option value="">すべて</option><option value="short">3か月以内</option><option value="medium">4〜8か月</option><option value="long">9〜12か月</option><option value="over-year">13か月以上</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-gray-700">出発年齢
              <select name="age" defaultValue={scalar(searchParams.age)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm">
                <option value="">すべて</option><option value="under-24">24歳以下</option><option value="25-29">25〜29歳</option><option value="30-plus">30歳以上</option>
              </select>
            </label>
            {purpose === 'study-abroad' ? (
              <>
                <label className="text-xs font-semibold text-gray-700">留学種別
                  <select name="studyType" defaultValue={scalar(searchParams.studyType)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm">
                    <option value="">すべて</option>{Object.entries(STUDY_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="text-xs font-semibold text-gray-700">学校
                  <select name="school" defaultValue={scalar(searchParams.school)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm">
                    <option value="">すべて</option>{usedSchools.map((school: School) => <option key={school.id} value={school.id}>{school.name}</option>)}
                  </select>
                </label>
              </>
            ) : (
              <label className="text-xs font-semibold text-gray-700 md:col-span-2">仕事・テーマ
                <input name="q" defaultValue={scalar(searchParams.q)} placeholder="例：カフェ、農場、仕事探し" className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
              </label>
            )}
            <button className="self-end rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800">絞り込む</button>
          </form>}

          {displayed.length > 0 ? (
            <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayed.map((experience) => <ExperienceCard key={experience.id} experience={experience} />)}
            </div>
          ) : verifiedExperiences.length === 0 ? (
            <div className="mt-7 rounded-xl border border-dashed border-primary-300 bg-primary-50 p-8 text-center">
              <p className="font-semibold text-gray-900">{country.nameJp}の{copy.experienceHeading}を募集しています</p>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-gray-600">
                {purpose === 'study-abroad'
                  ? '学校選び、授業、住まい、現地で困ったことなど、これから留学する人の参考になる体験をお寄せください。'
                  : '現地で働いた経験、住まい探し、日々の暮らしなど、これから渡航する人の参考になる体験をお寄せください。'}
              </p>
              <Link href="/submit/experience" className="mt-5 inline-flex rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-800">
                体験談を投稿する
              </Link>
            </div>
          ) : (
            <div className="mt-7 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">条件に合う検証済み体験談はありません。</div>
          )}

          {totalPages > 1 && (
            <nav aria-label="体験談のページ送り" className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <Link key={page} href={`${basePath}${buildQuery(searchParams, page)}`} aria-current={page === currentPage ? 'page' : undefined} className={`rounded-lg px-4 py-2 text-sm ${page === currentPage ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{page}</Link>
              ))}
            </nav>
          )}
        </section>

        <GuideSources sources={sources} />
      </div>
    </>
  );
}
