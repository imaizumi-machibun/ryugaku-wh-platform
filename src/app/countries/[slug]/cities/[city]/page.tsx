import type { Metadata } from 'next';
import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCountryBySlug } from '@/lib/microcms/countries';
import { getSchools } from '@/lib/microcms/schools';
import { getExperiences } from '@/lib/microcms/experiences';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import MidCTA from '@/components/article/MidCTA';
import SegmentHero from '@/components/segment/SegmentHero';
import ExchangeRateNotice from '@/components/segment/ExchangeRateNotice';
import ScenarioTabs from '@/components/segment/ScenarioTabs';
import CostEstimator from '@/components/segment/CostEstimator';
import SchoolPriceList from '@/components/segment/SchoolPriceList';
import ExperienceWithCost from '@/components/segment/ExperienceWithCost';
import SegmentFAQ from '@/components/segment/SegmentFAQ';
import SegmentRelatedLinks from '@/components/segment/SegmentRelatedLinks';
import SegmentStickyCTA from '@/components/segment/SegmentStickyCTA';
import SegmentAuthorBox from '@/components/segment/SegmentAuthorBox';
import { generateCityMetadata } from '@/lib/seo/metadata';
import {
  getCitiesByCountry,
  getCityBySlug,
  getCityStaticParams,
  getCityHeroImage,
  CITY_MASTERS,
  cityToSegmentMeta,
} from '@/lib/data/cities';
import { CITY_META } from '@/lib/data/city-meta';
import { getCityBodyImages } from '@/lib/data/city-images';
import { PURPOSES } from '@/lib/data/purposes';
import { SCENARIOS, getScenariosByKeys } from '@/lib/data/scenarios';
import { filterSchoolsBySegment } from '@/lib/segments/filter';
import { buildSegmentJsonLdBundle } from '@/lib/segments/jsonld-bundle';
import { formatJpyShort, estimateExperienceTotalJpy } from '@/lib/segments/cost-estimator';
import { SITE_URL } from '@/lib/utils/constants';

export const revalidate = 1800;

type Props = { params: { slug: string; city: string } };

export async function generateStaticParams() {
  return getCityStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(params.slug, params.city);
  if (!city) return {};
  try {
    const country = await getCountryBySlug(params.slug);
    const cityMeta = CITY_META[city.slug];
    return generateCityMetadata({
      cityNameJp: city.nameJp,
      countryNameJp: country.nameJp,
      path: `/countries/${params.slug}/cities/${params.city}`,
      description: city.description,
      metaTitle: cityMeta?.metaTitle ?? city.metaTitle,
      metaDescription: cityMeta?.metaDescription ?? city.metaDescription,
    });
  } catch {
    return {};
  }
}

export default async function CityPage({ params }: Props) {
  const city = getCityBySlug(params.slug, params.city);
  if (!city) notFound();

  let country;
  try {
    country = await getCountryBySlug(params.slug);
  } catch {
    notFound();
  }

  const seg = cityToSegmentMeta(city);
  const path = `/countries/${params.slug}/cities/${params.city}`;
  const url = `${SITE_URL}${path}`;

  const [schoolsData, experiencesData] = await Promise.all([
    getSchools({
      filters: `country[equals]${params.slug}[and]city[contains]${city.nameJp}`,
      limit: 40,
      depth: 2,
    }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getExperiences({
      filters: `country[equals]${params.slug}[and]cityPrimary[contains]${city.nameJp}`,
      limit: 30,
    }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
  ]);

  // real-voice セクション用：都市一致が0件なら国フォールバック
  let cityVoicesIsFallback = false;
  let cityVoices = experiencesData;
  if (experiencesData.contents.length === 0) {
    const countryVoices = await getExperiences({
      filters: `country[equals]${params.slug}`,
      limit: 6,
    }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 }));
    if (countryVoices.contents.length > 0) {
      cityVoicesIsFallback = true;
      cityVoices = countryVoices;
    }
  }

  const filteredSchools = filterSchoolsBySegment(schoolsData.contents, seg, 8);

  const expEstimates = new Map<string, number>();
  for (const exp of experiencesData.contents) {
    const total = estimateExperienceTotalJpy(exp);
    if (total != null) expEstimates.set(exp.id, total);
  }

  const scenarioKeys =
    seg.scenarioKeys && seg.scenarioKeys.length > 0
      ? seg.scenarioKeys
      : SCENARIOS.filter((s) => s.countrySlugs.includes(params.slug))
          .slice(0, 4)
          .map((s) => s.key);
  const scenarios = getScenariosByKeys(scenarioKeys);

  const faqs = seg.faqOverrides ?? [
    {
      question: `${city.nameJp}での生活費は月いくらくらい？`,
      answer: city.monthlyLivingJpy
        ? `${city.nameJp}での月の生活費は約${formatJpyShort(city.monthlyLivingJpy)}が目安です。家賃・食費・交通費・通信費を含んだ平均額で、住居タイプや生活スタイルで上下します。`
        : `${city.nameJp}での月の生活費は住居タイプやライフスタイルで大きく変動します。シェアハウスを利用すれば抑えられます。`,
    },
    {
      question: `${city.nameJp}で語学学校はどう選べばいい？`,
      answer: `${city.nameJp}にはさまざまな語学学校があります。目的（一般英語・試験対策・ビジネス英語）や予算、滞在期間、日本人比率の希望に応じて選びましょう。本ページ下部に当サイト掲載の${city.nameJp}の学校一覧があります。`,
    },
    {
      question: `${city.nameJp}でワーホリ中の仕事はどんな職種がある？`,
      answer: `${city.nameJp}では飲食（レストラン/カフェ/バリスタ）、観光業、日本食店、リテール販売、ファームジョブなどがワーホリメーカーの主な就業先です。${country.nameJp}全体としても求人豊富なエリアです。`,
    },
    {
      question: `${city.nameJp}の治安は？`,
      answer: `${city.nameJp}は${country.nameJp}の主要都市の中でも比較的安全とされています。ただし観光地や繁華街ではスリ・置き引きなど軽犯罪に注意。深夜の単独行動は避け、貴重品の管理は徹底しましょう。`,
    },
    {
      question: `${city.nameJp}留学のベストシーズンは？`,
      answer: country.bestSeason
        ? `${country.nameJp}全体のベストシーズンは「${country.bestSeason}」とされています。${city.nameJp}も同様の傾向ですが、夏休み/冬休みは語学学校が混みやすいため、早めの申込が安心です。`
        : `${city.nameJp}は季節を問わず留学可能です。語学学校は通年でクラスを開講しています。`,
    },
  ];

  const h1 = seg.h1Override ?? `${city.nameJp}（${country.nameJp}）の留学・ワーホリ完全ガイド`;
  const heroLead = seg.heroLead ?? city.description;
  const keyTakeaways =
    seg.keyTakeaways ??
    (city.highlights && city.highlights.length > 0 ? city.highlights : undefined);

  const cd = city.cityDetails;
  const tocItems: { id: string; label: string }[] = [
    ...(keyTakeaways ? [{ id: 'overview', label: `${city.nameJp}の特徴` }] : []),
    { id: 'facts', label: '生活費・人口・言語' },
    ...(cd?.areaOverview ? [{ id: 'area-overview', label: `${city.nameJp}はどんな街か` }] : []),
    ...(cd?.goodFit || cd?.notFit ? [{ id: 'good-fit', label: '向いている人／注意したい人' }] : []),
    ...(cd?.climate ? [{ id: 'climate', label: '気候・季節' }] : []),
    ...(cd?.safety ? [{ id: 'safety', label: '治安と注意点' }] : []),
    ...(cd?.cityscape ? [{ id: 'cityscape', label: '街並みとエリア区分' }] : []),
    ...(cd?.transport ? [{ id: 'transport', label: '交通アクセス' }] : []),
    ...(cd?.living ? [{ id: 'living', label: '生活環境' }] : []),
    ...(cd?.forStudents ? [{ id: 'for-students', label: '留学・ワーホリ参加者向け' }] : []),
    ...(cd?.realVoice ? [{ id: 'real-voice', label: '編集部より：リアルな声' }] : []),
    ...(cd?.costSummary ? [{ id: 'cost-summary', label: '生活費の目安' }] : []),
    ...(cd?.firstSteps ? [{ id: 'first-steps', label: '到着後にやること' }] : []),
    ...(scenarios.length > 0 ? [{ id: 'scenarios', label: '主要シナリオ' }] : []),
    { id: 'estimator', label: '費用かんたん試算' },
    ...(filteredSchools.matched.length > 0 ? [{ id: 'schools', label: '語学学校' }] : []),
    ...(experiencesData.contents.length > 0 ? [{ id: 'experiences', label: '体験談' }] : []),
    { id: 'faq', label: 'よくある質問' },
    { id: 'related', label: '関連リンク' },
  ];

  // 本文セクションの合間に挟む街並み写真（/cities/{slug}-1.jpg 〜 -3.jpg のうち実在分）
  const cityBodyImages = getCityBodyImages(city.slug);
  // interleave で本文に挟み込んだ画像枚数。残り（未使用分）は末尾ギャラリーに回す。
  // cityDetails が無い都市はセクション0個なので interleave は0枚 → 全枚数がギャラリーへ。
  let usedBodyImageCount = 0;

  const midCta = seg.midCta ?? {
    title: `${city.nameJp}での留学・ワーホリを無料で個別相談`,
    description: '希望条件・時期・予算に応じた個別シミュレーションを編集部が作成します。',
    primaryHref: '/contact',
    primaryLabel: '無料で相談する',
    secondaryHref: '/matching',
    secondaryLabel: '国診断ツールを使う',
  };

  const jsonLdBundle = buildSegmentJsonLdBundle({
    seg,
    url,
    pageName: h1,
    pageDescription: heroLead,
    breadcrumb: [
      { name: 'ホーム', url: '/' },
      { name: '国から探す', url: '/countries' },
      { name: country.nameJp, url: `/countries/${params.slug}` },
      { name: city.nameJp, url: path },
    ],
    scenarios,
    schools: filteredSchools.matched,
    countries: [country],
    experiences: experiencesData.contents.slice(0, 6),
    faqs,
  });

  return (
    <>
      {jsonLdBundle.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

      <div className="container-custom py-8 pb-24 md:pb-8">
        <Breadcrumb
          items={[
            { label: '国から探す', href: '/countries' },
            { label: country.nameJp, href: `/countries/${params.slug}` },
            { label: `${city.nameJp}の留学・ワーホリ` },
          ]}
        />

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href={`/countries/${params.slug}`} className="hover:text-primary-600">
            {country.flagEmoji} {country.nameJp}
          </Link>
          <span>/</span>
          <span>{city.nameEn}</span>
        </div>

        <SegmentHero seg={seg} h1={h1} lead={heroLead} heroImage={getCityHeroImage(city.slug)} />

        <ArticleMetaBadge readingMinutes={Math.min(12, Math.max(5, scenarios.length * 2 + 4))} updatedAt="2026-06-05" targetAudience={`${city.nameJp}留学検討者`} />

        <ExchangeRateNotice className="mb-6" />

        {keyTakeaways && keyTakeaways.length > 0 && (
          <section id="overview">
            <KeyTakeaway items={keyTakeaways} title={`${city.nameJp}の特徴`} />
          </section>
        )}

        <InPageTOC headings={tocItems} defaultOpen />

        <section id="facts" className="mb-10 bg-gradient-to-br from-primary-50 to-amber-50 border border-primary-100 rounded-2xl p-5 sm:p-6">
          <p className="text-xs font-bold text-primary-700 mb-4 tracking-wide">
            {city.nameJp}留学・ワーホリ 早わかり
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-bold text-gray-600 mb-3">主要データ</p>
              <dl className="space-y-2.5 bg-white/60 rounded-xl p-4">
                {city.monthlyLivingJpy && (
                  <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                    <dt className="text-sm text-gray-700">月の生活費目安</dt>
                    <dd className="text-lg font-bold text-gray-900 tabular-nums">
                      {formatJpyShort(city.monthlyLivingJpy)}
                    </dd>
                  </div>
                )}
                {city.population && (
                  <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                    <dt className="text-sm text-gray-700">都市圏人口</dt>
                    <dd className="text-lg font-bold text-gray-900 tabular-nums">
                      {(city.population / 10000).toFixed(0)}万人
                    </dd>
                  </div>
                )}
                {country.officialLanguage && (
                  <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                    <dt className="text-sm text-gray-700">使用言語</dt>
                    <dd className="text-base font-bold text-gray-900">{country.officialLanguage}</dd>
                  </div>
                )}
                <div className="flex justify-between items-baseline">
                  <dt className="text-sm text-gray-700">国</dt>
                  <dd className="text-base font-bold text-gray-900">
                    {country.flagEmoji} {country.nameJp}
                  </dd>
                </div>
              </dl>
            </div>
            {cd?.goodFit && cd.goodFit.length > 0 && (
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-3">こんな人に特に向いている</p>
                <ul className="space-y-2 bg-white/60 rounded-xl p-4">
                  {cd.goodFit.slice(0, 3).map((it, i) => (
                    <li key={i} className="text-sm text-gray-800 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5 shrink-0">・</span>
                      <span>{it.type}</span>
                    </li>
                  ))}
                </ul>
                {cd.goodFit.length > 3 && (
                  <p className="text-xs text-gray-600 mt-2 text-right">
                    <a href="#good-fit" className="text-primary-700 hover:underline">
                      残り{cd.goodFit.length - 3}項目を見る →
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
          {cd && (cd.goodFit || cd.firstSteps || cd.realVoice || cd.costSummary) && (
            <div className="mt-5 pt-4 border-t border-primary-100 flex flex-wrap gap-2">
              <p className="text-xs font-bold text-gray-700 w-full mb-1">急いで読むなら</p>
              {cd.goodFit && (
                <a href="#good-fit" className="text-xs bg-white text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100 border border-primary-200 transition-colors">
                  向き不向き
                </a>
              )}
              {cd.firstSteps && (
                <a href="#first-steps" className="text-xs bg-white text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100 border border-primary-200 transition-colors">
                  到着後にやること
                </a>
              )}
              {cd.realVoice && (
                <a href="#real-voice" className="text-xs bg-white text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100 border border-primary-200 transition-colors">
                  編集部のリアル
                </a>
              )}
              {cd.costSummary && (
                <a href="#cost-summary" className="text-xs bg-white text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100 border border-primary-200 transition-colors">
                  生活費の目安
                </a>
              )}
            </div>
          )}
        </section>

        {cd && (() => {
          // 本文セクションを配列化し、写真を均等位置に挟み込む。
          // 各セクションは従来どおりの条件付きレンダリングのまま、配列要素として収集する。
          const sections: ReactNode[] = [
            cd.areaOverview && (
              <section id="area-overview" key="area-overview">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">
                  {city.nameJp}はどんな街か
                </h2>
                <div className="prose-custom text-sm sm:text-base text-gray-800 leading-relaxed">
                  <p>{cd.areaOverview}</p>
                </div>
              </section>
            ),
            (cd.goodFit || cd.notFit) && (
              <section id="good-fit" key="good-fit">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">
                  {city.nameJp}が向いている人／注意したい人
                </h2>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  渡航先選びで最も重要なのは「自分の性格・目的・予算」とのマッチング。
                  {city.nameJp} の特性を踏まえて、留学・ワーホリ参加者の向き不向きを編集部の視点で率直に整理しました。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cd.goodFit && cd.goodFit.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                      <p className="text-sm font-bold text-emerald-900 mb-3 pb-2 border-b border-emerald-200">
                        こんな人に向いている
                      </p>
                      <ul className="space-y-3">
                        {cd.goodFit.map((it, i) => (
                          <li key={i} className="text-sm text-emerald-900">
                            <p className="font-semibold mb-1">{it.type}</p>
                            <p className="text-emerald-800 text-xs leading-relaxed">{it.reason}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cd.notFit && cd.notFit.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                      <p className="text-sm font-bold text-amber-900 mb-3 pb-2 border-b border-amber-200">
                        注意・向かない場合
                      </p>
                      <ul className="space-y-3">
                        {cd.notFit.map((it, i) => (
                          <li key={i} className="text-sm text-amber-900">
                            <p className="font-semibold mb-1">{it.type}</p>
                            <p className="text-amber-800 text-xs leading-relaxed">{it.reason}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <a href="#facts" className="inline-block mt-3 text-xs text-gray-500 hover:text-primary-700 hover:underline">
                  ↑ 早わかりに戻る
                </a>
              </section>
            ),
            cd.climate && (
              <section id="climate" key="climate">
                <details open className="group">
                  <summary className="list-none cursor-pointer hover:opacity-80 flex items-center justify-between mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold">気候・季節の特徴</h2>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 text-sm ml-2">▼</span>
                  </summary>
                  <div className="prose-custom text-sm sm:text-base text-gray-800 leading-relaxed">
                    <p>{cd.climate}</p>
                  </div>
                  <a href="#facts" className="inline-block mt-3 text-xs text-gray-500 hover:text-primary-700 hover:underline">
                    ↑ 早わかりに戻る
                  </a>
                </details>
              </section>
            ),
            cd.safety && (
              <section id="safety" key="safety">
                <details open className="group">
                  <summary className="list-none cursor-pointer hover:opacity-80 flex items-center justify-between mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold">治安と注意点</h2>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 text-sm ml-2">▼</span>
                  </summary>
                  <div className="prose-custom text-sm sm:text-base text-gray-800 leading-relaxed">
                    <p>{cd.safety}</p>
                  </div>
                  <a href="#facts" className="inline-block mt-3 text-xs text-gray-500 hover:text-primary-700 hover:underline">
                    ↑ 早わかりに戻る
                  </a>
                </details>
              </section>
            ),
            cd.cityscape && (
              <section id="cityscape" key="cityscape">
                <details open className="group">
                  <summary className="list-none cursor-pointer hover:opacity-80 flex items-center justify-between mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold">街並みとエリア区分</h2>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 text-sm ml-2">▼</span>
                  </summary>
                  <div className="prose-custom text-sm sm:text-base text-gray-800 leading-relaxed">
                    <p>{cd.cityscape}</p>
                  </div>
                  <a href="#facts" className="inline-block mt-3 text-xs text-gray-500 hover:text-primary-700 hover:underline">
                    ↑ 早わかりに戻る
                  </a>
                </details>
              </section>
            ),
            cd.transport && (
              <section id="transport" key="transport">
                <details open className="group">
                  <summary className="list-none cursor-pointer hover:opacity-80 flex items-center justify-between mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold">交通アクセス・移動</h2>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 text-sm ml-2">▼</span>
                  </summary>
                  <div className="prose-custom text-sm sm:text-base text-gray-800 leading-relaxed">
                    <p>{cd.transport}</p>
                  </div>
                  <a href="#facts" className="inline-block mt-3 text-xs text-gray-500 hover:text-primary-700 hover:underline">
                    ↑ 早わかりに戻る
                  </a>
                </details>
              </section>
            ),
            cd.living && (
              <section id="living" key="living">
                <details open className="group">
                  <summary className="list-none cursor-pointer hover:opacity-80 flex items-center justify-between mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold">生活環境・暮らしの特徴</h2>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 text-sm ml-2">▼</span>
                  </summary>
                  <div className="prose-custom text-sm sm:text-base text-gray-800 leading-relaxed">
                    <p>{cd.living}</p>
                  </div>
                  <a href="#facts" className="inline-block mt-3 text-xs text-gray-500 hover:text-primary-700 hover:underline">
                    ↑ 早わかりに戻る
                  </a>
                </details>
              </section>
            ),
            cd.forStudents && (
              <section id="for-students" key="for-students">
                <details open className="group">
                  <summary className="list-none cursor-pointer hover:opacity-80 flex items-center justify-between mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold">留学・ワーホリ参加者にとっての魅力</h2>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 text-sm ml-2">▼</span>
                  </summary>
                  <div className="prose-custom text-sm sm:text-base text-gray-800 leading-relaxed">
                    <p>{cd.forStudents}</p>
                  </div>
                  <a href="#facts" className="inline-block mt-3 text-xs text-gray-500 hover:text-primary-700 hover:underline">
                    ↑ 早わかりに戻る
                  </a>
                </details>
              </section>
            ),
            cd.realVoice && (
              <section id="real-voice" key="real-voice">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">編集部より：リアルな声</h2>
                <div className="bg-gray-50 border-l-4 border-primary-500 rounded-r-xl p-5">
                  <p className="text-xs font-bold text-primary-700 mb-2 tracking-wide">
                    観光ガイドが書かない、{city.nameJp}留学のリアル
                  </p>
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                    {cd.realVoice}
                  </p>
                </div>
                {cityVoices.contents.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2 flex-wrap">
                      {cityVoicesIsFallback
                        ? `${country.nameJp}の体験談から（${city.nameJp}単体の声はこれから募集中）`
                        : '実際に行った人の声'}
                      <span className="text-xs font-normal text-gray-500">
                        （体験談DBより{cityVoices.contents.length}件）
                      </span>
                    </p>
                    {cityVoicesIsFallback && (
                      <p className="text-xs text-gray-600 mb-3">
                        {city.nameJp}に絞った体験談はまだ集まっていませんが、{country.nameJp}の他都市で渡航した方の声を参考にしてください。
                      </p>
                    )}
                    <ul className="space-y-3">
                      {cityVoices.contents.slice(0, 3).map((exp) => {
                        const plain = (exp.content || '')
                          .replace(/<\/(p|div|li|h\d|br)>/gi, ' ')
                          .replace(/<br\s*\/?>/gi, ' ')
                          .replace(/<[^>]+>/g, '')
                          .replace(/投稿者[:：]\s*\S+\s*/g, '')
                          .replace(/通った学校[:：]\s*[^\n]+?(?=\s{2,}|[。、])/g, '')
                          .replace(/\s+/g, ' ')
                          .trim();
                        const excerpt = plain.length > 160 ? plain.slice(0, 160) + '…' : plain;
                        const meta = [
                          exp.ageAtDeparture ? `${exp.ageAtDeparture}歳で渡航` : null,
                          exp.gender === 'male' ? '男性' : exp.gender === 'female' ? '女性' : null,
                          exp.durationMonths ? `${exp.durationMonths}ヶ月滞在` : null,
                        ].filter(Boolean).join(' / ');
                        return (
                          <li key={exp.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-200 transition-colors">
                            <p className="text-sm text-gray-800 leading-relaxed mb-2">
                              「{excerpt}」
                            </p>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <p className="text-xs text-gray-500">{meta || '体験者'}</p>
                              <Link
                                href={`/experiences/${exp.id}`}
                                className="text-xs text-primary-700 hover:underline font-semibold"
                              >
                                体験談の詳細を見る →
                              </Link>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {cityVoices.contents.length > 3 && (
                      <p className="text-xs text-right mt-3">
                        <Link
                          href={`/experiences?country=${params.slug}`}
                          className="text-primary-700 hover:underline"
                        >
                          {country.nameJp}の体験談をもっと読む →
                        </Link>
                      </p>
                    )}
                  </div>
                )}
                <a href="#facts" className="inline-block mt-3 text-xs text-gray-500 hover:text-primary-700 hover:underline">
                  ↑ 早わかりに戻る
                </a>
              </section>
            ),
            cd.costSummary && (
              <section id="cost-summary" key="cost-summary">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">生活費の目安</h2>
                <div className="prose-custom text-sm sm:text-base text-gray-800 leading-relaxed mb-3">
                  <p>{cd.costSummary}</p>
                </div>
                {city.liveCostArticleSlug && (
                  <aside className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-primary-900">
                      <p className="font-semibold mb-0.5">生活費の詳細な内訳と節約のコツ</p>
                      <p className="text-xs text-primary-800">家賃・食費・交通費・通信費の月額目安を別記事で深掘りしています。</p>
                    </div>
                    <Link
                      href={`/${city.liveCostArticleSlug}`}
                      className="inline-block bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap"
                    >
                      {city.nameJp}の生活費を詳しく見る →
                    </Link>
                  </aside>
                )}
                <a href="#facts" className="inline-block mt-3 text-xs text-gray-500 hover:text-primary-700 hover:underline">
                  ↑ 早わかりに戻る
                </a>
              </section>
            ),
            cd.firstSteps && cd.firstSteps.length > 0 && (
              <section id="first-steps" key="first-steps">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">到着後にやること（最短ルート）</h2>
                <p className="text-sm text-gray-700 mb-5 leading-relaxed">
                  {city.nameJp}に到着してから生活基盤を整えるまでの段取りを時系列でまとめました。
                  住民登録 → 銀行口座 → 仕事探しのように、順序を間違えると次の手続きが進まない項目もあるため、出発前に流れを把握しておくのがおすすめです。
                </p>
                <ol className="space-y-4">
                  {cd.firstSteps.map((step, i) => (
                    <li key={i} className="flex gap-3 sm:gap-4">
                      <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                        {i + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <span className="text-xs font-semibold bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
                            {step.when}
                          </span>
                          <p className="text-sm sm:text-base font-bold text-gray-900">
                            {step.title}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <a href="#facts" className="inline-block mt-4 text-xs text-gray-500 hover:text-primary-700 hover:underline">
                  ↑ 早わかりに戻る
                </a>
              </section>
            ),
          ].filter(Boolean) as ReactNode[];

          // 実在するセクションだけが sections に残っている。
          // 写真は「セクション数 ÷ (画像数+1)」の境界に均等配置する。
          // 例: セクション9個・画像3枚 → 約2〜3セクションごとに1枚挟む。
          // 先頭（index 0 の前）と末尾には挿入せず、本文に自然に溶け込ませる。
          const totalSections = sections.length;
          const imgs = cityBodyImages;
          // 各画像の「直前に来るセクション数」をフロート位置で算出し、挿入先 index を確定する。
          const insertAfter = new Map<number, string[]>();
          if (totalSections >= 2 && imgs.length > 0) {
            for (let k = 0; k < imgs.length; k++) {
              // (k+1)/(imgs.length+1) の比率位置 → セクション境界の index
              const ratio = (k + 1) / (imgs.length + 1);
              let idx = Math.round(totalSections * ratio);
              // 先頭・末尾を避けて 1..totalSections-1 にクランプ
              if (idx < 1) idx = 1;
              if (idx > totalSections - 1) idx = totalSections - 1;
              // 同一境界への重複を避けて後ろにずらす
              while (insertAfter.has(idx) && idx < totalSections - 1) idx++;
              const arr = insertAfter.get(idx) ?? [];
              arr.push(imgs[k]);
              insertAfter.set(idx, arr);
              usedBodyImageCount++;
            }
          }

          return (
            <div className="space-y-10 mb-12">
              {sections.map((node, i) => (
                <Fragment key={i}>
                  {node}
                  {(insertAfter.get(i + 1) ?? []).map((src, j) => (
                    <figure key={`cityimg-${i}-${j}`} className="overflow-hidden rounded-2xl border border-primary-100 shadow-sm">
                      <div className="relative aspect-[16/9] w-full bg-primary-50">
                        <Image
                          src={src}
                          alt={`${city.nameJp}（${city.nameEn}）の街並み`}
                          fill
                          sizes="(max-width: 768px) 100vw, 768px"
                          className="object-cover"
                        />
                      </div>
                    </figure>
                  ))}
                </Fragment>
              ))}
            </div>
          );
        })()}

        {/* フォールバック街並みギャラリー：
            interleave で挿入しきれなかった残り画像（cityDetails 未設定の都市は全画像）を
            本文エリア末尾にまとめて描画する。これにより本文セクションが少ない/無い都市でも
            用意した街並み写真が必ず表示される。usedBodyImageCount で二重表示を防止。 */}
        {(() => {
          const galleryImages = cityBodyImages.slice(usedBodyImageCount);
          if (galleryImages.length === 0) return null;
          return (
            <section id="cityscape-gallery" className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">{city.nameJp}の街並み</h2>
              <div
                className={`grid gap-3 sm:gap-4 ${
                  galleryImages.length === 1
                    ? 'grid-cols-1'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {galleryImages.map((src, i) => (
                  <figure
                    key={`citygallery-${i}`}
                    className="overflow-hidden rounded-2xl border border-primary-100 shadow-sm"
                  >
                    <div className="relative aspect-[16/9] w-full bg-primary-50">
                      <Image
                        src={src}
                        alt={`${city.nameJp}（${city.nameEn}）の街並み ${usedBodyImageCount + i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                        className="object-cover"
                      />
                    </div>
                  </figure>
                ))}
              </div>
            </section>
          );
        })()}

        {scenarios.length > 0 && (
          <section id="scenarios" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{city.nameJp}で取れる主要シナリオ</h2>
            <p className="text-sm text-gray-600 mb-4">
              {city.nameJp}・{country.nameJp}での留学・ワーホリの代表シナリオを総額・期間で比較できます。
            </p>
            <ScenarioTabs scenarios={scenarios} />
          </section>
        )}

        <MidCTA
          title={midCta.title}
          description={midCta.description}
          primaryHref={midCta.primaryHref}
          primaryLabel={midCta.primaryLabel}
          secondaryHref={midCta.secondaryHref}
          secondaryLabel={midCta.secondaryLabel}
        />

        <section id="estimator" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">費用かんたん試算</h2>
          <CostEstimator
            countries={[country]}
            defaultCountrySlug={params.slug}
            defaultMonths={seg.monthsAssumedForSchoolEstimate ?? 6}
          />
        </section>

        {filteredSchools.matched.length > 0 && (
          <section id="schools" className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl sm:text-2xl font-bold">{city.nameJp}の語学・専門学校</h2>
              <Link href={`/schools?country=${params.slug}`} className="text-primary-600 hover:underline text-sm">
                すべて見る →
              </Link>
            </div>
            <SchoolPriceList
              schools={filteredSchools.matched}
              estimates={filteredSchools.withEstimates}
              monthsAssumed={seg.monthsAssumedForSchoolEstimate ?? 6}
            />
          </section>
        )}

        {experiencesData.contents.length > 0 && (
          <section id="experiences" className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl sm:text-2xl font-bold">{city.nameJp}の体験談</h2>
              <Link
                href={`/experiences?country=${params.slug}`}
                className="text-primary-600 hover:underline text-sm"
              >
                すべて見る →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiencesData.contents.slice(0, 6).map((exp) => (
                <ExperienceWithCost key={exp.id} experience={exp} estimatedTotalJpy={expEstimates.get(exp.id)} />
              ))}
            </div>
          </section>
        )}

        <section id="faq" className="mb-12">
          <SegmentFAQ faqs={faqs} title={`${city.nameJp}のよくある質問`} />
        </section>

        <SegmentAuthorBox />

        <section id="related" className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">関連リンク</h2>
          <SegmentRelatedLinks
            crossAxis="country-city"
            sections={[
              {
                title: `${country.nameJp}の他の都市`,
                links: getCitiesByCountry(params.slug)
                  .filter((c) => c.slug !== params.city)
                  .slice(0, 6)
                  .map((c) => ({
                    label: `${c.nameJp}の留学・ワーホリ`,
                    href: `/countries/${params.slug}/cities/${c.slug}`,
                  })),
              },
              {
                title: `${country.nameJp}関連`,
                links: [
                  { label: `${country.nameJp}の完全ガイド`, href: `/countries/${params.slug}` },
                  { label: `${country.nameJp}の費用詳細`, href: `/countries/${params.slug}/cost` },
                  ...PURPOSES.slice(0, 3).map((p) => ({
                    label: `${country.nameJp}で${p.label}`,
                    href: `/countries/${params.slug}/purpose/${p.slug}`,
                  })),
                ],
              },
              {
                title: '世界の主要都市',
                links: CITY_MASTERS.filter((c) => c.countrySlug !== params.slug)
                  .slice(0, 6)
                  .map((c) => ({
                    label: `${c.nameJp}（${c.nameEn}）`,
                    href: `/countries/${c.countrySlug}/cities/${c.slug}`,
                  })),
              },
            ]}
          />
        </section>
      </div>

      <details className="fixed bottom-20 right-3 z-40 md:hidden group">
        <summary className="list-none cursor-pointer bg-primary-600 hover:bg-primary-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl text-2xl font-bold leading-none select-none" aria-label="目次を開く">
          <span className="group-open:hidden">≡</span>
          <span className="hidden group-open:inline">×</span>
        </summary>
        <div className="absolute bottom-14 right-0 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl p-3 max-h-[60vh] overflow-y-auto">
          <p className="text-xs font-bold text-gray-900 mb-2 pb-2 border-b border-gray-200">
            {city.nameJp}ガイド 目次
          </p>
          <ul className="space-y-0.5">
            {tocItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block text-xs text-gray-700 hover:text-primary-700 hover:bg-primary-50 px-2 py-1.5 rounded leading-tight"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </details>

      <SegmentStickyCTA href={midCta.primaryHref} label={midCta.primaryLabel} subLabel={city.nameJp} />
    </>
  );
}
