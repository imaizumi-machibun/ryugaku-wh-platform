import type { Metadata } from 'next';
import Link from 'next/link';
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
import SegmentAuthorBox from '@/components/segment/SegmentAuthorBox';
import { generatePageMetadata, generateSegmentMetadata } from '@/lib/seo/metadata';
import { DURATIONS, getDurationBySlug, durationToSegmentMeta } from '@/lib/data/durations';
import { BUDGETS } from '@/lib/data/budgets';
import { getScenariosByKeys } from '@/lib/data/scenarios';
import { filterExperiencesBySegment, filterSchoolsBySegment } from '@/lib/segments/filter';
import { buildSegmentJsonLdBundle } from '@/lib/segments/jsonld-bundle';
import { formatJpyShort } from '@/lib/segments/cost-estimator';
import { SITE_URL } from '@/lib/utils/constants';

export const revalidate = 3600;

type Props = { params: { period: string } };

export async function generateStaticParams() {
  return DURATIONS.map((d) => ({ period: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const duration = getDurationBySlug(params.period);
  if (!duration) return {};
  const path = `/duration/${params.period}`;

  if (duration.metaTitle && duration.metaDescription) {
    return generatePageMetadata({
      title: duration.metaTitle,
      description: duration.metaDescription,
      path,
      keywords: duration.targetKeywords,
    });
  }

  return generateSegmentMetadata({
    segmentLabel: `${duration.label}のワーホリ・留学`,
    segmentType: '期間',
    path,
  });
}

export default async function DurationPage({ params }: Props) {
  const duration = getDurationBySlug(params.period);
  if (!duration) notFound();

  const seg = durationToSegmentMeta(duration);
  const path = `/duration/${params.period}`;
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

  const filteredExperiences = filterExperiencesBySegment(experiencesData.contents, seg, 6);
  const filteredSchools = filterSchoolsBySegment(schoolsData.contents, seg, 8);

  const scenarios = getScenariosByKeys(duration.scenarioKeys);
  const faqs = duration.faqOverrides ?? generateDefaultFaqs(duration);

  const h1 = duration.h1Override ?? `${duration.label}のワーホリ・留学完全ガイド`;
  const heroLead = duration.heroLead ?? duration.description;

  const tocItems: { id: string; label: string }[] = [
    { id: 'overview', label: 'この期間でわかること' },
    ...(scenarios.length > 0 ? [{ id: 'scenarios', label: 'シナリオ早見表と詳細' }] : []),
    ...(duration.showCostEstimator !== false ? [{ id: 'estimator', label: '費用かんたん試算' }] : []),
    ...(duration.showROICard ? [{ id: 'roi', label: '投資回収（ROI）の目安' }] : []),
    ...(filteredSchools.matched.length > 0 ? [{ id: 'schools', label: 'おすすめ語学・専門学校' }] : []),
    ...(duration.showFundingCard ? [{ id: 'funding', label: '資金計画の3本柱' }] : []),
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
      { name: '期間から探す', url: '/duration' },
      { name: duration.label, url: path },
    ],
    scenarios,
    schools: filteredSchools.matched,
    countries: countriesData.contents.filter((c) => c.programStatus === 'open').slice(0, 6),
    experiences: filteredExperiences.matched,
    faqs,
  });

  const currentIndex = DURATIONS.findIndex((d) => d.slug === duration.slug);
  const prev = currentIndex > 0 ? DURATIONS[currentIndex - 1] : null;
  const next = currentIndex < DURATIONS.length - 1 ? DURATIONS[currentIndex + 1] : null;

  return (
    <>
      {jsonLdBundle.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

      <div className="container-custom py-8 pb-24 md:pb-8">
        <Breadcrumb
          items={[
            { label: '期間から探す', href: '/duration' },
            { label: `${duration.label}のワーホリ・留学` },
          ]}
        />

        <SegmentHero seg={seg} h1={h1} lead={heroLead} />

        <ArticleMetaBadge
          readingMinutes={Math.min(15, Math.max(5, scenarios.length * 2 + 4))}
          updatedAt="2026-06-04"
          targetAudience={duration.recommendedFor.slice(0, 2).join(' / ')}
        />

        <ExchangeRateNotice className="mb-6" />

        {duration.keyTakeaways && duration.keyTakeaways.length > 0 && (
          <section id="overview">
            <KeyTakeaway items={duration.keyTakeaways} title={`${duration.label}で何ができるか`} />
          </section>
        )}

        <InPageTOC headings={tocItems} defaultOpen />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
            <p className="text-xs text-primary-700 mb-1">予算レンジ</p>
            <p className="text-xl font-bold text-primary-900 tabular-nums">
              {formatJpyShort(duration.budgetRangeJpy.min)}〜{formatJpyShort(duration.budgetRangeJpy.max)}
            </p>
          </div>
          <div className="bg-accent-50 border border-accent-100 rounded-xl p-5">
            <p className="text-xs text-accent-700 mb-1">こんな方に</p>
            <p className="text-sm font-bold text-accent-900">{duration.recommendedFor.join('・')}</p>
          </div>
        </section>

        {scenarios.length > 0 && (
          <section id="scenarios" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">この期間で取れる主要シナリオ</h2>
            <p className="text-sm text-gray-600 mb-4">
              シナリオごとの総額・期間・要件を早見表で比較できます。クリックで詳細にジャンプします。
            </p>
            <ScenarioTabs scenarios={scenarios} />
          </section>
        )}

        {duration.midCta && (
          <MidCTA
            title={duration.midCta.title}
            description={duration.midCta.description}
            primaryHref={duration.midCta.primaryHref}
            primaryLabel={duration.midCta.primaryLabel}
            secondaryHref={duration.midCta.secondaryHref}
            secondaryLabel={duration.midCta.secondaryLabel}
          />
        )}

        {duration.showCostEstimator !== false && countriesData.contents.length > 0 && (
          <section id="estimator" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用かんたん試算</h2>
            <CostEstimator
              countries={countriesData.contents}
              defaultMonths={Math.round((duration.minMonths + duration.maxMonths) / 2) || 1}
            />
          </section>
        )}

        {duration.showROICard && scenarios.length > 0 && (
          <section id="roi" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">投資回収（ROI）の目安</h2>
            <ROICalloutCard scenarios={scenarios} />
          </section>
        )}

        {filteredSchools.matched.length > 0 && (
          <section id="schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {duration.label}におすすめの語学・専門学校
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              総額は{duration.monthsAssumedForSchoolEstimate ?? Math.round((duration.minMonths + duration.maxMonths) / 2)}ヶ月想定（学費＋生活費＋ビザ＋航空券＋保険）。
            </p>
            <SchoolPriceList
              schools={filteredSchools.matched}
              estimates={filteredSchools.withEstimates}
              monthsAssumed={
                duration.monthsAssumedForSchoolEstimate ??
                (Math.round((duration.minMonths + duration.maxMonths) / 2) || 1)
              }
            />
          </section>
        )}

        {duration.showFundingCard && (
          <section id="funding" className="mb-12">
            <FundingOptionsCard notes={duration.fundingNotes} />
          </section>
        )}

        {filteredExperiences.matched.length > 0 && (
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{duration.label}の留学・ワーホリ体験談</h2>
            <p className="text-sm text-gray-600 mb-4">
              {filteredExperiences.appliedHint === 'strict'
                ? '期間が一致する体験談'
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
            {prev && (
              <Link
                href={`/duration/${prev.slug}`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-primary-400 hover:bg-primary-50/30"
              >
                <p className="text-xs text-gray-500 mb-1">← 短い期間</p>
                <p className="font-semibold text-primary-700">{prev.label}のワーホリ・留学</p>
              </Link>
            )}
            {next && (
              <Link
                href={`/duration/${next.slug}`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-primary-400 hover:bg-primary-50/30 text-right"
              >
                <p className="text-xs text-gray-500 mb-1">長い期間 →</p>
                <p className="font-semibold text-primary-700">{next.label}のワーホリ・留学</p>
              </Link>
            )}
          </div>

          <SegmentRelatedLinks
            crossAxis="duration"
            sections={[
              {
                title: '他の期間で探す',
                links: DURATIONS.filter((d) => d.slug !== params.period).map((d) => ({
                  label: `${d.label}の体験談`,
                  href: `/duration/${d.slug}`,
                })),
              },
              {
                title: '予算から探す',
                links: BUDGETS.slice(0, 6).map((b) => ({
                  label: `予算${b.label}で行ける留学・ワーホリ`,
                  href: `/budget/${b.slug}`,
                })),
              },
              {
                title: '関連ガイド',
                links: [
                  { label: '国別ランキング', href: '/countries' },
                  { label: '学校一覧', href: '/schools' },
                  { label: '体験談一覧', href: '/experiences' },
                  { label: 'マッチング診断', href: '/matching' },
                ],
              },
            ]}
          />
        </section>
      </div>

      {duration.midCta && (
        <SegmentStickyCTA
          href={duration.midCta.primaryHref}
          label={duration.midCta.primaryLabel}
          subLabel={duration.label}
        />
      )}
    </>
  );
}

function generateDefaultFaqs(duration: ReturnType<typeof getDurationBySlug> & object) {
  return [
    {
      question: `${duration.label}の留学・ワーホリにはどのくらいの予算が必要？`,
      answer: `${duration.label}の留学・ワーホリの予算は、${formatJpyShort(duration.budgetRangeJpy.min)}〜${formatJpyShort(duration.budgetRangeJpy.max)}程度が目安です。国・都市・滞在スタイルで大きく変動します。`,
    },
    {
      question: `${duration.label}でおすすめの国は？`,
      answer:
        duration.minMonths < 3
          ? '物価の安いフィリピン・タイ・マルタが圧倒的に人気です。短期は航空券コスト比率が高いため、近距離国の優位性が出やすい。'
          : duration.minMonths < 6
          ? 'ワーホリ前のお試しとしてフィリピン+ワーホリビザ申請が一般的。マルタ・カナダの中期も選択肢。'
          : 'オーストラリア・カナダのワーホリビザ取得が定番。長期になるほど就労収入で生活費を補填する設計が重要。',
    },
    {
      question: `${duration.label}でどのくらい語学力が伸びる？`,
      answer:
        duration.maxMonths <= 1
          ? '短期間では大幅な伸びは難しいですが、海外慣れ・日常会話の自信向上には有効。'
          : duration.maxMonths <= 3
          ? '基礎の固め直し〜中級突入。日常会話には困らないレベルに到達する人が多い。'
          : duration.maxMonths <= 6
          ? '中級から上級レベル到達。ビジネス英語も視野に入る。'
          : '上級レベル到達可能。発音・ネイティブ表現も自然に。',
    },
    {
      question: `${duration.label}はどんな人に向いている？`,
      answer: duration.recommendedFor.join('・') + 'の方に特におすすめです。',
    },
  ];
}
