import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCountries } from '@/lib/microcms/countries';
import { getExperiences } from '@/lib/microcms/experiences';
import { getSchools } from '@/lib/microcms/schools';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import MidCTA from '@/components/article/MidCTA';
import SegmentAuthorBox from '@/components/segment/SegmentAuthorBox';
import SegmentHero from '@/components/segment/SegmentHero';
import ExchangeRateNotice from '@/components/segment/ExchangeRateNotice';
import ScenarioTabs from '@/components/segment/ScenarioTabs';
import CostEstimator from '@/components/segment/CostEstimator';
import SchoolPriceList from '@/components/segment/SchoolPriceList';
import ExperienceWithCost from '@/components/segment/ExperienceWithCost';
import ROICalloutCard from '@/components/segment/ROICalloutCard';
import FundingOptionsCard from '@/components/segment/FundingOptionsCard';
import SegmentFAQ from '@/components/segment/SegmentFAQ';
import SegmentRelatedLinks from '@/components/segment/SegmentRelatedLinks';
import SegmentStickyCTA from '@/components/segment/SegmentStickyCTA';
import { generatePageMetadata, generateSegmentMetadata } from '@/lib/seo/metadata';
import { BUDGETS, getBudgetBySlug, budgetToSegmentMeta } from '@/lib/data/budgets';
import { DURATIONS } from '@/lib/data/durations';
import { getScenariosByKeys } from '@/lib/data/scenarios';
import { filterExperiencesBySegment, filterSchoolsBySegment } from '@/lib/segments/filter';
import { buildSegmentJsonLdBundle } from '@/lib/segments/jsonld-bundle';
import { formatJpyShort } from '@/lib/segments/cost-estimator';
import { SITE_URL } from '@/lib/utils/constants';
import Link from 'next/link';

export const revalidate = 3600;

type Props = { params: { range: string } };

export async function generateStaticParams() {
  return BUDGETS.map((b) => ({ range: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const budget = getBudgetBySlug(params.range);
  if (!budget) return {};
  const path = `/budget/${params.range}`;

  if (budget.metaTitle && budget.metaDescription) {
    return generatePageMetadata({
      title: budget.metaTitle,
      description: budget.metaDescription,
      path,
      keywords: budget.targetKeywords,
    });
  }

  return generateSegmentMetadata({
    segmentLabel: `予算${budget.label}`,
    segmentType: '予算',
    path,
  });
}

export default async function BudgetPage({ params }: Props) {
  const budget = getBudgetBySlug(params.range);
  if (!budget) notFound();

  const seg = budgetToSegmentMeta(budget);
  const path = `/budget/${params.range}`;
  const url = `${SITE_URL}${path}`;

  const [countriesData, experiencesData, schoolsData] = await Promise.all([
    getCountries({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getExperiences({ limit: 60, orders: '-publishedAt' }).catch(() => ({
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    })),
    getSchools({ limit: 100, depth: 2 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
  ]);

  const recommendedCountries = countriesData.contents.filter((c) =>
    budget.recommendedCountries.includes(c.id)
  );

  const filteredExperiences = filterExperiencesBySegment(experiencesData.contents, seg, 6);
  const filteredSchools = filterSchoolsBySegment(schoolsData.contents, seg, 8);

  const scenarios = getScenariosByKeys(budget.scenarioKeys);
  const faqs = budget.faqOverrides ?? generateDefaultFaqs(budget, recommendedCountries);

  const h1 =
    budget.h1Override ?? `予算${budget.label}で行けるワーホリ・留学先まとめ`;
  const heroLead = budget.heroLead ?? budget.description;

  const tocItems: { id: string; label: string }[] = [
    { id: 'overview', label: 'この予算でわかること' },
    ...(scenarios.length > 0 ? [{ id: 'scenarios', label: 'シナリオ早見表と詳細' }] : []),
    ...(budget.showCostEstimator !== false ? [{ id: 'estimator', label: '費用かんたん試算' }] : []),
    ...(recommendedCountries.length > 0 ? [{ id: 'countries', label: 'おすすめの国' }] : []),
    ...(budget.showROICard ? [{ id: 'roi', label: '投資回収（ROI）の目安' }] : []),
    ...(filteredSchools.matched.length > 0 ? [{ id: 'schools', label: 'おすすめ語学・専門学校' }] : []),
    ...(budget.showFundingCard ? [{ id: 'funding', label: '資金計画の3本柱' }] : []),
    ...(filteredExperiences.matched.length > 0 ? [{ id: 'experiences', label: '体験談' }] : []),
    { id: 'faq', label: 'よくある質問' },
    { id: 'related', label: '関連リンク' },
  ];

  const jsonLdBundle = buildSegmentJsonLdBundle({
    seg,
    url,
    pageName: h1,
    pageDescription: heroLead,
    breadcrumb: [
      { name: 'ホーム', url: '/' },
      { name: '予算から探す', url: '/budget' },
      { name: budget.label, url: path },
    ],
    scenarios,
    schools: filteredSchools.matched,
    countries: recommendedCountries,
    experiences: filteredExperiences.matched,
    faqs,
  });

  const currentBudgetIndex = BUDGETS.findIndex((b) => b.slug === budget.slug);
  const prevBudget = currentBudgetIndex > 0 ? BUDGETS[currentBudgetIndex - 1] : null;
  const nextBudget =
    currentBudgetIndex < BUDGETS.length - 1 ? BUDGETS[currentBudgetIndex + 1] : null;

  return (
    <>
      {jsonLdBundle.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

      <div className="container-custom py-8 pb-24 md:pb-8">
        <Breadcrumb
          items={[
            { label: '予算から探す', href: '/budget' },
            { label: `予算${budget.label}` },
          ]}
        />

        <SegmentHero seg={seg} h1={h1} lead={heroLead} />

        <ArticleMetaBadge
          readingMinutes={Math.min(15, Math.max(5, scenarios.length * 2 + 4))}
          updatedAt="2026-06-04"
          targetAudience={budget.personas?.map((p) => p.label).slice(0, 2).join(' / ')}
        />

        <ExchangeRateNotice className="mb-6" />

        {budget.keyTakeaways && budget.keyTakeaways.length > 0 && (
          <section id="overview">
            <KeyTakeaway
              items={budget.keyTakeaways}
              title={`${budget.label}で何ができるか`}
            />
          </section>
        )}

        <InPageTOC headings={tocItems} defaultOpen />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
            <p className="text-xs text-primary-700 mb-1">予算レンジ</p>
            <p className="text-xl font-bold text-primary-900">
              {budget.minJpy === 0
                ? `〜${formatJpyShort(budget.maxJpy)}`
                : budget.maxJpy === Infinity
                ? `${formatJpyShort(budget.minJpy)}〜`
                : `${formatJpyShort(budget.minJpy)}〜${formatJpyShort(budget.maxJpy)}`}
            </p>
          </div>
          <div className="bg-accent-50 border border-accent-100 rounded-xl p-5">
            <p className="text-xs text-accent-700 mb-1">想定期間</p>
            <p className="text-xl font-bold text-accent-900">{budget.recommendedDuration}</p>
          </div>
        </section>

        {scenarios.length > 0 && (
          <section id="scenarios" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">この予算で取れる主要シナリオ</h2>
            <p className="text-sm text-gray-600 mb-4">
              下の表から各シナリオの詳細にジャンプできます。総額は学費・生活費・ビザ・航空券・保険の合算（為替により±5%変動）。
            </p>
            <ScenarioTabs scenarios={scenarios} />
          </section>
        )}

        {budget.midCta && (
          <MidCTA
            title={budget.midCta.title}
            description={budget.midCta.description}
            primaryHref={budget.midCta.primaryHref}
            primaryLabel={budget.midCta.primaryLabel}
            secondaryHref={budget.midCta.secondaryHref}
            secondaryLabel={budget.midCta.secondaryLabel}
          />
        )}

        {budget.showCostEstimator !== false && countriesData.contents.length > 0 && (
          <section id="estimator" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用かんたん試算</h2>
            <CostEstimator
              countries={countriesData.contents.filter((c) =>
                budget.recommendedCountries.includes(c.id) || budget.recommendedCountries.length === 0
              )}
              defaultCountrySlug={budget.recommendedCountries[0]}
              defaultMonths={budget.monthsAssumedForSchoolEstimate ?? 12}
            />
          </section>
        )}

        {recommendedCountries.length > 0 && (
          <section id="countries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {budget.label}でおすすめの国
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCountries.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-gray-200 hover:border-primary-400 rounded-xl transition-colors"
                >
                  <Link href={`/countries/${c.id}`} className="block p-5 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{c.flagEmoji}</span>
                      <h3 className="font-bold">{c.nameJp}</h3>
                    </div>
                    {c.livingCostMonthJpy && (
                      <p className="text-xs text-gray-600">
                        月生活費: {formatJpyShort(c.livingCostMonthJpy)}
                      </p>
                    )}
                    {c.visaCostJpy != null && (
                      <p className="text-xs text-gray-600">ビザ: {formatJpyShort(c.visaCostJpy)}</p>
                    )}
                  </Link>
                  <div className="px-5 pb-4">
                    <Link
                      href={`/countries/${c.id}/cost`}
                      className="text-xs font-medium text-primary-700 hover:underline"
                    >
                      {c.nameJp}の費用詳細を見る →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {budget.showROICard && scenarios.length > 0 && (
          <section id="roi" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">投資回収（ROI）の目安</h2>
            <ROICalloutCard scenarios={scenarios} />
          </section>
        )}

        {filteredSchools.matched.length > 0 && (
          <section id="schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {budget.label}におすすめの語学・専門学校
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              総額は{budget.monthsAssumedForSchoolEstimate ?? 12}ヶ月想定（学費＋生活費＋ビザ＋航空券＋保険）。安い順に表示。
            </p>
            <SchoolPriceList
              schools={filteredSchools.matched}
              estimates={filteredSchools.withEstimates}
              monthsAssumed={budget.monthsAssumedForSchoolEstimate ?? 12}
            />
          </section>
        )}

        {budget.showFundingCard && (
          <section id="funding" className="mb-12">
            <FundingOptionsCard notes={budget.fundingNotes} />
          </section>
        )}

        {budget.midCta && filteredSchools.matched.length > 0 && (
          <MidCTA
            title="この予算でのプラン、無料相談で作りませんか"
            description="希望条件・時期・優先軸を伝えれば、個別のシミュレーションをお渡しします。"
            primaryHref={budget.midCta.primaryHref}
            primaryLabel={budget.midCta.primaryLabel}
            secondaryHref={budget.midCta.secondaryHref}
            secondaryLabel={budget.midCta.secondaryLabel}
          />
        )}

        {filteredExperiences.matched.length > 0 && (
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {budget.label}の留学・ワーホリ体験談
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {filteredExperiences.appliedHint === 'strict'
                ? '予算と期間が条件に合致する体験談'
                : filteredExperiences.appliedHint === 'country'
                ? '推奨国の体験談（予算は近似）'
                : filteredExperiences.appliedHint === 'duration'
                ? '近い滞在期間の体験談'
                : '最新の体験談'}
              （{filteredExperiences.matched.length}件）
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExperiences.matched.map((exp) => (
                <ExperienceWithCost
                  key={exp.id}
                  experience={exp}
                  estimatedTotalJpy={filteredExperiences.withEstimates.get(exp.id)}
                />
              ))}
            </div>
          </section>
        )}

        <section id="faq" className="mb-12">
          <SegmentFAQ faqs={faqs} />
        </section>

        <SegmentAuthorBox />

        <section id="related" className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">関連リンク</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {prevBudget && (
              <Link
                href={`/budget/${prevBudget.slug}`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-primary-400 hover:bg-primary-50/30"
              >
                <p className="text-xs text-gray-500 mb-1">← 前の予算レンジ</p>
                <p className="font-semibold text-primary-700">
                  予算{prevBudget.label}で行ける留学・ワーホリ
                </p>
              </Link>
            )}
            {nextBudget && (
              <Link
                href={`/budget/${nextBudget.slug}`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-primary-400 hover:bg-primary-50/30 text-right"
              >
                <p className="text-xs text-gray-500 mb-1">次の予算レンジ →</p>
                <p className="font-semibold text-primary-700">
                  予算{nextBudget.label}で行ける留学・ワーホリ
                </p>
              </Link>
            )}
          </div>

          <SegmentRelatedLinks
            crossAxis="budget"
            sections={[
              {
                title: '他の予算で探す',
                links: BUDGETS.filter((b) => b.slug !== params.range)
                  .slice(0, 7)
                  .map((b) => ({
                    label: `予算${b.label}（${b.recommendedDuration}）`,
                    href: `/budget/${b.slug}`,
                  })),
              },
              {
                title: '期間から探す',
                links: DURATIONS.map((d) => ({
                  label: `${d.label}の体験談`,
                  href: `/duration/${d.slug}`,
                })),
              },
              {
                title: '関連ガイド',
                links: [
                  { label: '国別ランキング', href: '/countries' },
                  { label: '学校一覧（言語・予算で絞り込み）', href: '/schools' },
                  { label: '体験談一覧', href: '/experiences' },
                  { label: 'マッチング診断', href: '/matching' },
                ],
              },
            ]}
          />
        </section>
      </div>

      {budget.midCta && (
        <SegmentStickyCTA
          href={budget.midCta.primaryHref}
          label={budget.midCta.primaryLabel}
          subLabel={budget.label}
        />
      )}
    </>
  );
}

function generateDefaultFaqs(
  budget: ReturnType<typeof getBudgetBySlug> & object,
  recommendedCountries: { nameJp: string }[]
) {
  return [
    {
      question: `${budget.label}でどんな国に留学・ワーホリできる？`,
      answer: `${budget.label}の予算では、${budget.recommendedCountries.length}カ国程度がおすすめ候補です。具体的には${recommendedCountries
        .map((c) => c.nameJp)
        .slice(0, 5)
        .join('・')}など。${budget.description}`,
    },
    {
      question: `${budget.label}で現実的な滞在期間は？`,
      answer: `${budget.label}の予算なら、おおむね「${budget.recommendedDuration}」が現実的です。働きながらのワーホリなら現地で生活費を補填できるため、もう少し長期化することも可能です。`,
    },
    {
      question: `${budget.label}で節約するコツは？`,
      answer:
        '1) 物価の安い国を選ぶ、2) シェアハウス利用、3) 自炊中心、4) 学生ビザではなくワーホリビザにする、5) 渡航時期を閑散期にする（航空券が安い）。これらで2〜3割は削減できます。',
    },
  ];
}
