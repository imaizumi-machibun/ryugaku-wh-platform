import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountries, getCountryBySlug, getCountrySlugs } from '@/lib/microcms/countries';
import { getExperiences } from '@/lib/microcms/experiences';
import { getSchools } from '@/lib/microcms/schools';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import MidCTA from '@/components/article/MidCTA';
import QuickFacts from '@/components/country/QuickFacts';
import VisaInfo from '@/components/country/VisaInfo';
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
import { generateCostMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { buildSegmentJsonLdBundle } from '@/lib/segments/jsonld-bundle';
import { filterExperiencesBySegment, filterSchoolsBySegment } from '@/lib/segments/filter';
import { formatJpyShort, estimateExperienceTotalJpy } from '@/lib/segments/cost-estimator';
import { SCENARIOS, getScenariosByKeys } from '@/lib/data/scenarios';
import { BUDGETS } from '@/lib/data/budgets';
import { PURPOSES } from '@/lib/data/purposes';
import {
  getRegionalCountrySlugs,
  getRegionalCountries,
  getLanguageGroupSlugs,
  getLanguageDisplayName,
  getRegionDisplayName,
} from '@/lib/data/country-region-map';
import { countMentions } from '@/lib/stats/experiences-cross';
import type { SegmentMeta } from '@/lib/segments/types';
import { formatJPY } from '@/lib/utils/format';
import { SITE_URL } from '@/lib/utils/constants';

export const revalidate = 3600;

type Props = { params: { slug: string } };

const PRIORITY_COUNTRIES = [
  'australia', 'canada', 'new-zealand', 'united-kingdom', 'ireland',
  'united-states', 'philippines', 'malta', 'germany', 'france',
  'spain', 'italy', 'south-korea', 'taiwan', 'thailand',
];

export async function generateStaticParams() {
  const slugs = await getCountrySlugs();
  return slugs.filter((s) => PRIORITY_COUNTRIES.includes(s)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const country = await getCountryBySlug(params.slug);
    return generateCostMetadata(country, `/countries/${params.slug}/cost`);
  } catch {
    return {};
  }
}

export default async function CostPage({ params }: Props) {
  let country;
  try {
    country = await getCountryBySlug(params.slug);
  } catch {
    notFound();
  }

  const path = `/countries/${params.slug}/cost`;
  const url = `${SITE_URL}${path}`;

  const [allCountriesData, experiencesData, schoolsData] = await Promise.all([
    getCountries({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getExperiences({ limit: 80, orders: '-publishedAt' }).catch(() => ({
      contents: [], totalCount: 0, offset: 0, limit: 0,
    })),
    getSchools({ limit: 80, depth: 2 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
  ]);

  const allCountries = allCountriesData.contents;
  const regionalSlugs = getRegionalCountrySlugs(params.slug, allCountries);
  const languageSlugs = getLanguageGroupSlugs(params.slug);
  const regionalCountries = getRegionalCountries(params.slug, allCountries, 6);
  const regionName = getRegionDisplayName(params.slug, allCountries);
  const languageName = getLanguageDisplayName(params.slug);

  // SegmentMeta を country 情報から動的に組み立てる
  // 4段フォールバック: 当国 → 同地域 → 同言語圏 → 低額帯（短期語学）
  const scenarioKeysAuto = SCENARIOS.filter((s) => s.countrySlugs.includes(params.slug))
    .slice(0, 4)
    .map((s) => s.key);
  let scenarioKeysFinal: string[];
  let scenarioFallbackOrigin: 'own' | 'region' | 'language' | 'global' = 'own';
  if (scenarioKeysAuto.length > 0) {
    scenarioKeysFinal = scenarioKeysAuto;
  } else {
    const byRegion = SCENARIOS.filter((s) => s.countrySlugs.some((c) => regionalSlugs.includes(c)))
      .slice(0, 3)
      .map((s) => s.key);
    if (byRegion.length > 0) {
      scenarioKeysFinal = byRegion;
      scenarioFallbackOrigin = 'region';
    } else {
      const byLanguage = SCENARIOS.filter((s) => s.countrySlugs.some((c) => languageSlugs.includes(c)))
        .slice(0, 3)
        .map((s) => s.key);
      if (byLanguage.length > 0) {
        scenarioKeysFinal = byLanguage;
        scenarioFallbackOrigin = 'language';
      } else {
        // 最終フォールバック: 短期語学帯（ボリビアのような低物価国に近い）
        scenarioKeysFinal = ['ph-1m', 'malta-1m', 'kr-1m'];
        scenarioFallbackOrigin = 'global';
      }
    }
  }
  const scenarios = getScenariosByKeys(scenarioKeysFinal);

  const seg: SegmentMeta = {
    segmentType: 'country-purpose',
    slug: params.slug,
    label: country.nameJp,
    schoolFilterHints: {
      countrySlugs: [params.slug],
    },
    experienceFilterHints: {
      countrySlugs: [params.slug],
      regionSlugs: regionalSlugs,
      languageSlugs,
    },
    monthsAssumedForSchoolEstimate: 6,
  };

  const filteredExperiences = filterExperiencesBySegment(experiencesData.contents, seg, 6);
  const filteredSchools = filterSchoolsBySegment(schoolsData.contents, seg, 8);

  // 体験談から平均生活費（当国体験談のみ）
  const ownExps = experiencesData.contents.filter((e) => e.country?.id === params.slug && e.monthlyLivingJpy);
  const avgFromExperience = ownExps.length
    ? Math.round(ownExps.reduce((sum, e) => sum + (e.monthlyLivingJpy || 0), 0) / ownExps.length)
    : null;

  // 1年間モデル計算
  const monthly = country.livingCostMonthJpy || avgFromExperience || 150000;
  const annualLiving = monthly * 12;
  const visaCost = country.visaCostJpy || 0;
  const flightEstimate = country.flightTimeHours
    ? country.flightTimeHours > 10 ? 200000 : 150000
    : 150000;
  const totalAnnual = annualLiving + visaCost + flightEstimate + 200000;

  // 体験談がない場合の節約コツ抽出（同地域から）
  const savingMentions = filteredExperiences.matched.length > 0
    ? countMentions(filteredExperiences.matched, /(シェア|自炊|節約|安い|物価|抑え)/, { source: 'advice' })
    : { containsCount: 0, totalChecked: 0, percentage: 0, samples: [] };

  // FAQ 拡充
  const faqs = [
    {
      question: `${country.nameJp}に1年間滞在するのに必要な総額はいくら？`,
      answer: `生活費（月${formatJPY(monthly)} × 12ヶ月）+ 航空券（往復${formatJPY(flightEstimate)}）+ ビザ代${formatJPY(visaCost)} + 雑費20万円を合計すると、約${formatJPY(totalAnnual)}が目安です。働きながら現地で稼ぐワーホリの場合、初期費用としては150〜200万円あれば心強いです。`,
    },
    {
      question: `${country.nameJp}の生活費を節約するコツは？`,
      answer: `1) シェアハウスを利用する（家賃が半分以下に）、2) 自炊中心にする、3) スーパーは閉店間際の値引きを狙う、4) 公共交通機関の月額パスを買う、5) フリーWi-Fiやキャンパス施設を活用する。これらを組み合わせれば月の生活費を3〜5割削減できることが多いです。`,
    },
    {
      question: `${country.nameJp}のビザ代はいくら？`,
      answer: visaCost > 0
        ? `${country.nameJp}のワーキングホリデービザ申請料は約${formatJPY(visaCost)}です。学生ビザはこれとは別途必要です。為替レートで変動するため、最新情報は公式サイトでご確認ください。`
        : `${country.nameJp}はワーキングホリデー協定がない、もしくは情報未確定です。学生ビザ・観光ビザ・有給インターン等の代替手段を検討するのが現実的です。最新情報は各国大使館・移民局の公式サイトで確認しましょう。`,
    },
    {
      question: `${country.nameJp}で働いて生活費を稼げる？`,
      answer: country.minimumWageLocal
        ? `${country.nameJp}の最低賃金は${country.minimumWageLocal}。週20〜38時間の労働で家賃と食費はカバーできるケースが多いです。`
        : `${country.nameJp}では多くのワーホリメーカーが現地で働いて生活費を稼いでいます。実体験は体験談ページで確認できます。`,
    },
    {
      question: `${country.nameJp}での留学・ワーホリにおすすめの期間は？`,
      answer: `語学習得を目的とするなら最低3ヶ月、本格的に上達させたいなら6ヶ月〜1年が目安です。${country.visaDurationMonths ? `${country.nameJp}のワーホリビザは${country.visaDurationMonths}ヶ月まで滞在可能。` : ''}短期で1ヶ月の語学体験から、長期2年のセカンドビザ滞在まで、目的に応じて選べます。`,
    },
    {
      question: `${country.nameJp}留学で奨学金は使える？`,
      answer: `日本人向け給付奨学金（トビタテ留学JAPAN、JASSO第二種など）は多くの国で利用可能です。${country.nameJp}が大学院留学・正規留学に対応している場合は、Fulbright（米国）、Chevening（英国）、DAAD（独）等の海外政府系奨学金も検討できます。資金計画の詳細は「大学院留学の奨学金完全ガイド」をご覧ください。`,
    },
    {
      question: `${country.nameJp}の治安はどう？`,
      answer: `${country.nameJp}は${country.region}地域にあり、主要都市の治安は概ね安定しています。ただし観光地や繁華街ではスリ・置き引きなどの軽犯罪に注意。深夜の単独行動を避ける、貴重品管理を徹底する、シェアハウスを選ぶ際は治安の良いエリアを確認する、などの基本的な対策が重要です。`,
    },
    {
      question: `${country.nameJp}留学で為替リスクをどう抑える？`,
      answer: `1) 出発前にFX外貨建定期で一部資金を固定、2) 為替変動±5%のバッファを予算に組み込む、3) Wise（旧TransferWise）等の低手数料海外送金を活用、4) 現地クレジットカードで日常決済（為替手数料を抑える）。長期滞在ほど為替の影響が累積するため、初期予算＋月1万円のバッファを推奨します。`,
    },
  ];

  // KeyTakeaway を動的生成
  const keyTakeaways = [
    `${country.nameJp}の月生活費目安は${formatJpyShort(monthly)}${avgFromExperience ? `（体験者${ownExps.length}名平均${formatJpyShort(avgFromExperience)}）` : ''}`,
    `1年滞在総額の目安は${formatJpyShort(totalAnnual)}（生活費＋航空券＋ビザ＋雑費）`,
    visaCost > 0
      ? `ワーホリビザ申請料は${formatJpyShort(visaCost)}${country.visaDurationMonths ? `、最長${country.visaDurationMonths}ヶ月滞在可能` : ''}`
      : `ワーホリ協定が未確定。学生ビザ・観光ビザ等の代替手段も検討`,
    country.minimumWageLocal
      ? `現地最低賃金は${country.minimumWageLocal}、就労による生活費補填が現実的`
      : `就労による収入補填の現実性は当国の事情により要確認`,
    regionName
      ? `同地域（${regionName}）の他国データも参考に総合判断できます`
      : '他軸（予算・期間・目的）から横断的に検討するのがおすすめ',
  ];

  const h1 = `${country.nameJp}の留学・ワーホリ費用は実際いくら？`;
  const heroLead = `${country.nameJp}での留学・ワーキングホリデーに必要な費用を、生活費・住居費・学費・ビザ代・航空券まで実体験ベースで解説します。${avgFromExperience ? `当サイトに掲載されている${ownExps.length}件の体験談データに基づいた、現地のリアルな費用感もまとめています。` : `${country.nameJp}は体験談データがまだ少ないため、同地域${regionName ? `（${regionName}）` : ''}の参考情報も併せてご覧ください。`}`;

  const tocItems: { id: string; label: string }[] = [
    { id: 'overview', label: 'この記事でわかること' },
    { id: 'summary', label: '月生活費・ビザ・1年総額' },
    { id: 'quickfacts', label: '基本情報' },
    { id: 'breakdown', label: '費用内訳（1年間モデル）' },
    ...(scenarios.length > 0 ? [{ id: 'scenarios', label: 'シナリオ別の総額' }] : []),
    { id: 'estimator', label: '費用かんたん試算' },
    { id: 'visa', label: 'ビザ情報' },
    ...(filteredSchools.matched.length > 0 ? [{ id: 'schools', label: 'おすすめ学校' }] : []),
    ...(filteredExperiences.matched.length > 0 || filteredExperiences.appliedHint !== 'recent' ? [{ id: 'experiences', label: '体験談' }] : []),
    ...(savingMentions.samples.length > 0 ? [{ id: 'saving-tips', label: '節約コツ（体験談から）' }] : []),
    { id: 'faq', label: 'よくある質問' },
    { id: 'related', label: '関連リンク' },
  ];

  const midCta = {
    title: `${country.nameJp}留学の費用プランを無料で個別相談`,
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
      { name: '費用', url: path },
    ],
    scenarios,
    schools: filteredSchools.matched,
    countries: [country, ...regionalCountries.slice(0, 3)],
    experiences: filteredExperiences.matched,
    faqs,
  });

  // 体験談セクションのラベル分岐
  const experienceLabel = (() => {
    if (filteredExperiences.appliedHint === 'strict' || filteredExperiences.appliedHint === 'country') {
      return `${country.nameJp}の体験者のリアル費用（${filteredExperiences.matched.length}件）`;
    }
    if (filteredExperiences.appliedHint === 'region') {
      return `同地域（${regionName ?? '近隣国'}）の参考体験談`;
    }
    if (filteredExperiences.appliedHint === 'language') {
      return `${languageName ?? '同言語圏'}の参考体験談`;
    }
    return `他の人気留学先の体験談（${country.nameJp}での費用感を考える際の参考用）`;
  })();

  const experienceCaption = (() => {
    if (filteredExperiences.appliedHint === 'strict' || filteredExperiences.appliedHint === 'country') {
      return null;
    }
    if (filteredExperiences.appliedHint === 'region') {
      return `${country.nameJp}の体験談はまだ集まっていません。同地域（${regionName ?? '近隣国'}）の参考例を表示しています。`;
    }
    if (filteredExperiences.appliedHint === 'language') {
      return `${country.nameJp}・同地域ともに体験談がありません。${languageName ?? '同言語圏'}の参考例を表示しています。`;
    }
    return `${country.nameJp}とその近隣・同言語圏の体験談がまだ集まっていないため、他の人気留学先の体験談を「費用感を考える際の参考」として表示しています。あなたが最初の投稿者になっていただけませんか？`;
  })();

  const showFirstSubmitCta = filteredExperiences.matched.length === 0 || filteredExperiences.appliedHint === 'recent';

  // 体験談に推計総額を補完（filter ではすでに入っているはずだが、念のため）
  const expEstimatesFinal = new Map<string, number>(filteredExperiences.withEstimates);
  for (const exp of filteredExperiences.matched) {
    if (!expEstimatesFinal.has(exp.id)) {
      const total = estimateExperienceTotalJpy(exp);
      if (total != null) expEstimatesFinal.set(exp.id, total);
    }
  }

  return (
    <>
      {jsonLdBundle.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      {/* 旧 BreadcrumbList は jsonLdBundle に含まれるが、SEO 強化のため冗長に別途も発行 */}
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '国から探す', url: '/countries' },
          { name: country.nameJp, url: `/countries/${params.slug}` },
          { name: '費用', url: path },
        ])}
      />

      <div className="container-custom py-8 pb-24 md:pb-8">
        <Breadcrumb
          items={[
            { label: '国から探す', href: '/countries' },
            { label: country.nameJp, href: `/countries/${params.slug}` },
            { label: `${country.nameJp}の留学・ワーホリ費用` },
          ]}
        />

        <SegmentHero seg={seg} h1={h1} lead={heroLead} />

        <ArticleMetaBadge
          readingMinutes={Math.min(12, Math.max(6, scenarios.length * 2 + 6))}
          updatedAt="2026-06-05"
          targetAudience={`${country.nameJp}留学検討者`}
        />

        <ExchangeRateNotice className="mb-6" />

        <section id="overview">
          <KeyTakeaway items={keyTakeaways} title={`${country.nameJp}の費用でわかること`} />
        </section>

        <InPageTOC headings={tocItems} defaultOpen />

        <section id="summary" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">月の生活費目安</p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatJpyShort(monthly)}</p>
            {avgFromExperience && (
              <p className="text-xs text-gray-500 mt-2">
                体験者{ownExps.length}名の平均: {formatJpyShort(avgFromExperience)}
              </p>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">ビザ申請料</p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">
              {visaCost > 0 ? formatJpyShort(visaCost) : '要確認'}
            </p>
            {country.visaDurationMonths && (
              <p className="text-xs text-gray-500 mt-2">最長{country.visaDurationMonths}ヶ月</p>
            )}
          </div>
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-5">
            <p className="text-xs text-primary-700 mb-1">1年間の想定総額</p>
            <p className="text-2xl font-bold text-primary-900 tabular-nums">{formatJpyShort(totalAnnual)}</p>
          </div>
        </section>

        <section id="quickfacts" className="mb-10">
          <QuickFacts country={country} />
        </section>

        <section id="breakdown" className="bg-white border border-gray-200 rounded-xl p-5 mb-10">
          <h2 className="text-xl font-bold mb-4">費用内訳（1年間モデル）</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left text-gray-500 font-medium">項目</th>
                  <th className="py-2 text-right text-gray-500 font-medium">金額</th>
                  <th className="py-2 text-left text-gray-500 font-medium pl-4">備考</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3">生活費（12ヶ月）</td>
                  <td className="py-3 text-right font-medium tabular-nums">{formatJPY(annualLiving)}</td>
                  <td className="py-3 pl-4 text-gray-500">家賃・食費・交通費・通信費の合計</td>
                </tr>
                <tr>
                  <td className="py-3">ビザ申請料</td>
                  <td className="py-3 text-right font-medium tabular-nums">{visaCost > 0 ? formatJPY(visaCost) : '—'}</td>
                  <td className="py-3 pl-4 text-gray-500">{country.visaQuota || 'ワーホリビザ or 学生ビザ'}</td>
                </tr>
                <tr>
                  <td className="py-3">往復航空券</td>
                  <td className="py-3 text-right font-medium tabular-nums">{formatJPY(flightEstimate)}</td>
                  <td className="py-3 pl-4 text-gray-500">飛行時間 {country.flightTimeHours || '?'}時間</td>
                </tr>
                <tr>
                  <td className="py-3">海外保険・その他</td>
                  <td className="py-3 text-right font-medium tabular-nums">{formatJPY(200000)}</td>
                  <td className="py-3 pl-4 text-gray-500">医療保険、通信費初期、デポジット等</td>
                </tr>
                <tr className="bg-primary-50">
                  <td className="py-3 font-bold">合計（1年）</td>
                  <td className="py-3 text-right font-bold text-primary-900 tabular-nums">{formatJPY(totalAnnual)}</td>
                  <td className="py-3 pl-4" />
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {scenarios.length > 0 && (
          <section id="scenarios" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{country.nameJp}で取れる主要シナリオ</h2>
            <p className="text-sm text-gray-600 mb-4">
              {scenarioFallbackOrigin === 'own'
                ? `${country.nameJp}に該当するシナリオを総額・期間別に比較できます。`
                : scenarioFallbackOrigin === 'region'
                ? `${country.nameJp}に直接該当するシナリオはまだありませんが、同地域（${regionName}）の参考シナリオを表示しています。`
                : scenarioFallbackOrigin === 'language'
                ? `${country.nameJp}に直接該当するシナリオはまだありませんが、${languageName ?? '同言語圏'}の参考シナリオを表示しています。`
                : `${country.nameJp}に該当する固有シナリオはまだありませんが、似たコスト感の代表的な短期語学プランを参考までに表示しています。`}
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
          <CostEstimator countries={[country]} defaultCountrySlug={params.slug} defaultMonths={6} />
        </section>

        <section id="visa" className="mb-12">
          <VisaInfo country={country} />
          {!country.applicationSteps?.length && !country.requiredDocuments?.length && (
            <aside className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-900">
              <p className="font-semibold mb-1">ビザ詳細について</p>
              <p className="leading-relaxed">
                {country.nameJp}のワーキングホリデー協定情報は当サイトでまだ整備中です。学生ビザ・観光ビザ・有給インターン・ボランティアビザ等、目的に応じた代替手段の検討をおすすめします。最新情報は<Link href="/contact" className="text-amber-700 hover:underline font-medium">無料相談</Link>でご質問ください。
              </p>
            </aside>
          )}
        </section>

        {filteredSchools.matched.length > 0 && (
          <section id="schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {filteredSchools.fallbackTier === 0
                ? `${country.nameJp}の語学・専門学校`
                : `同地域のおすすめ学校（${country.nameJp}は登録準備中）`}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              総額は{seg.monthsAssumedForSchoolEstimate ?? 6}ヶ月想定（学費＋生活費＋ビザ＋航空券＋保険）。安い順に表示。
            </p>
            <SchoolPriceList
              schools={filteredSchools.matched}
              estimates={filteredSchools.withEstimates}
              monthsAssumed={seg.monthsAssumedForSchoolEstimate ?? 6}
            />
          </section>
        )}

        {filteredExperiences.matched.length > 0 && (
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{experienceLabel}</h2>
            {experienceCaption && (
              <aside className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-2 mb-4 text-sm text-amber-900">
                {experienceCaption}
              </aside>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExperiences.matched.map((exp) => (
                <ExperienceWithCost key={exp.id} experience={exp} estimatedTotalJpy={expEstimatesFinal.get(exp.id)} />
              ))}
            </div>
          </section>
        )}

        {showFirstSubmitCta && (
          <section className="mb-12 bg-primary-50 border border-primary-100 rounded-xl p-6 text-center">
            <h2 className="text-lg sm:text-xl font-bold text-primary-900 mb-2">
              あなたが{country.nameJp}の最初の体験談投稿者になりませんか？
            </h2>
            <p className="text-sm text-primary-800 mb-4 leading-relaxed">
              {country.nameJp}での留学・ワーキングホリデー体験談は、これから渡航を検討する人にとって唯一無二の一次情報です。投稿いただいた方には編集部から個別フィードバックと、ご希望に応じて記事化のサポートも行っています。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/submit"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                体験談を投稿する
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-white text-primary-700 border border-primary-200 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
              >
                編集部に相談する
              </Link>
            </div>
          </section>
        )}

        {savingMentions.samples.length > 0 && (
          <section id="saving-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">節約のコツ（体験談から）</h2>
            <p className="text-sm text-gray-600 mb-4">
              {savingMentions.totalChecked}件の体験談中{savingMentions.containsCount}件（{savingMentions.percentage}%）に節約に関する言及がありました。代表的なアドバイスを引用します。
            </p>
            <div className="space-y-3">
              {savingMentions.samples.map((exp) => (
                <blockquote
                  key={exp.id}
                  className="border-l-4 border-primary-300 bg-primary-50/50 pl-4 py-2 text-sm text-gray-800"
                >
                  <p className="leading-relaxed">{(exp.advice ?? '').slice(0, 160)}{(exp.advice ?? '').length > 160 ? '…' : ''}</p>
                  <footer className="mt-2 text-xs text-gray-500">
                    — {exp.country?.nameJp} / {exp.cityPrimary}
                    {exp.durationMonths && ` / 滞在${exp.durationMonths}ヶ月`}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        <section id="faq" className="mb-12">
          <SegmentFAQ faqs={faqs} title={`${country.nameJp}の費用 よくある質問`} />
        </section>

        <SegmentAuthorBox />

        <section id="related" className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">関連リンク</h2>
          <SegmentRelatedLinks
            sections={[
              {
                title: `${country.nameJp}関連`,
                links: [
                  { label: `${country.nameJp}の留学・ワーホリ完全ガイド`, href: `/countries/${params.slug}` },
                  { label: `${country.nameJp}の体験談を読む`, href: `/experiences?country=${params.slug}` },
                  { label: `${country.nameJp}の語学学校一覧`, href: `/schools?country=${params.slug}` },
                  ...PURPOSES.slice(0, 3).map((p) => ({
                    label: `${country.nameJp}で${p.label}`,
                    href: `/countries/${params.slug}/purpose/${p.slug}`,
                  })),
                ],
              },
              {
                title: `同地域（${regionName ?? '近隣国'}）の費用ページ`,
                links: regionalCountries.slice(0, 6).map((c) => ({
                  label: `${c.flagEmoji ?? ''} ${c.nameJp}の留学・ワーホリ費用`,
                  href: `/countries/${c.id}/cost`,
                })),
              },
              {
                title: '予算別で探す',
                links: BUDGETS.slice(0, 6).map((b) => ({
                  label: `予算${b.label}（${b.recommendedDuration}）`,
                  href: `/budget/${b.slug}`,
                })),
              },
            ]}
          />
        </section>
      </div>

      <SegmentStickyCTA href={midCta.primaryHref} label={midCta.primaryLabel} subLabel={`${country.nameJp}の費用`} />
    </>
  );
}
