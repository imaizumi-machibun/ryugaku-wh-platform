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
import { OCCUPATIONS, getOccupationBySlug, occupationToSegmentMeta } from '@/lib/data/occupations';
import { GENERATIONS } from '@/lib/data/generations';
import { BUDGETS } from '@/lib/data/budgets';
import { getScenariosByKeys } from '@/lib/data/scenarios';
import { filterExperiencesBySegment, filterSchoolsBySegment } from '@/lib/segments/filter';
import { buildSegmentJsonLdBundle } from '@/lib/segments/jsonld-bundle';
import { SITE_URL } from '@/lib/utils/constants';

export const revalidate = 3600;

type Props = { params: { occupation: string } };

export async function generateStaticParams() {
  return OCCUPATIONS.map((o) => ({ occupation: o.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const occ = getOccupationBySlug(params.occupation);
  if (!occ) return {};
  const path = `/jobs/${params.occupation}`;

  if (occ.metaTitle && occ.metaDescription) {
    return generatePageMetadata({
      title: occ.metaTitle,
      description: occ.metaDescription,
      path,
      keywords: occ.targetKeywords,
    });
  }

  return generateSegmentMetadata({
    segmentLabel: occ.label,
    segmentType: '職業',
    path,
  });
}

export default async function JobPage({ params }: Props) {
  const occ = getOccupationBySlug(params.occupation);
  if (!occ) notFound();

  const seg = occupationToSegmentMeta(occ);
  const path = `/jobs/${params.occupation}`;
  const url = `${SITE_URL}${path}`;

  const [countriesData, experiencesData, schoolsData] = await Promise.all([
    getCountries({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getExperiences({
      filters: occ.recommendedCountries.map((c) => `country[equals]${c}`).join('[or]'),
      limit: 60,
    }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getSchools({ limit: 80, depth: 2 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
  ]);

  const recommendedCountries = countriesData.contents.filter((c) =>
    occ.recommendedCountries.includes(c.id)
  );

  const filteredExperiences = filterExperiencesBySegment(experiencesData.contents, seg, 6);
  const filteredSchools = filterSchoolsBySegment(schoolsData.contents, seg, 6);

  const scenarios = getScenariosByKeys(seg.scenarioKeys);

  const faqs = seg.faqOverrides ?? [
    {
      question: `${occ.label}としてワーホリ・海外就労できる国は？`,
      answer: `${occ.label}としてのキャリアパスでおすすめなのは、${recommendedCountries
        .map((c) => c.nameJp)
        .join('・')}などです。${occ.visaTips}`,
    },
    {
      question: `${occ.label}の海外での年収・時給は？`,
      answer: occ.salaryRange
        ? `${occ.label}の海外での収入目安は${occ.salaryRange}です。国・経験・資格・都市で大きく上下するため、求人情報サイトで最新の相場を確認しましょう。`
        : '国によって大きく異なります。求人サイト（Indeed、Seek、JobStreet等）で実際の募集を確認してみましょう。',
    },
    {
      question: `${occ.label}で海外に行くために必要な準備は？`,
      answer:
        '1) 国・ビザの選定、2) 英語力（IELTS等の試験対策）、3) 資格・実務経験の証明書（英文翻訳済）、4) ポートフォリオ/CV準備、5) 初期費用150〜200万円の確保。具体的なスケジュールは無料相談で個別に組み立てられます。',
    },
    {
      question: `${occ.label}でワーホリ後に永住権・スポンサービザは取れる？`,
      answer:
        '職種により道筋が異なります。オーストラリアのSkilled Migrant、カナダのExpress Entry等のスキルポイント制が主要ルート。看護師・エンジニア・介護士は特に有利。詳細は無料相談で個別に確認できます。',
    },
  ];

  const h1 = seg.h1Override ?? `${occ.label}のワーホリ・留学・海外キャリア完全ガイド`;
  const heroLead = seg.heroLead ?? occ.description;

  const tocItems: { id: string; label: string }[] = [
    { id: 'overview', label: 'この職業でわかること' },
    { id: 'visa', label: 'ビザ・年収の基本' },
    ...(scenarios.length > 0 ? [{ id: 'scenarios', label: '主要シナリオ' }] : []),
    ...(seg.showCostEstimator !== false ? [{ id: 'estimator', label: '費用かんたん試算' }] : []),
    ...(recommendedCountries.length > 0 ? [{ id: 'countries', label: 'おすすめの国' }] : []),
    ...(seg.showROICard ? [{ id: 'roi', label: '投資回収（ROI）' }] : []),
    ...(filteredSchools.matched.length > 0 ? [{ id: 'schools', label: 'おすすめ語学・専門学校' }] : []),
    ...(seg.showFundingCard ? [{ id: 'funding', label: '資金計画' }] : []),
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
      { name: '職業から探す', url: '/jobs' },
      { name: occ.label, url: path },
    ],
    scenarios,
    schools: filteredSchools.matched,
    countries: recommendedCountries,
    experiences: filteredExperiences.matched,
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
            { label: '職業から探す', href: '/jobs' },
            { label: `${occ.label}のワーホリ・留学` },
          ]}
        />

        <SegmentHero seg={seg} h1={h1} lead={heroLead} />

        <ArticleMetaBadge
          readingMinutes={Math.min(15, Math.max(5, scenarios.length * 2 + 4))}
          updatedAt="2026-06-05"
          targetAudience={occ.label}
        />

        <ExchangeRateNotice className="mb-6" />

        {seg.keyTakeaways && seg.keyTakeaways.length > 0 && (
          <section id="overview">
            <KeyTakeaway items={seg.keyTakeaways} title={`${occ.label}で何ができるか`} />
          </section>
        )}

        <InPageTOC headings={tocItems} defaultOpen />

        <section id="visa" className="bg-primary-50 border border-primary-100 rounded-xl p-5 mb-10">
          <h2 className="text-base font-bold text-primary-900 mb-2">ビザのポイント</h2>
          <p className="text-sm text-primary-900 leading-relaxed">{occ.visaTips}</p>
          {occ.salaryRange && (
            <p className="text-sm text-primary-900 mt-3">
              <span className="font-semibold">海外での収入目安：</span>
              {occ.salaryRange}
            </p>
          )}
        </section>

        {scenarios.length > 0 && (
          <section id="scenarios" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">この職業に合う主要シナリオ</h2>
            <p className="text-sm text-gray-600 mb-4">
              {occ.label}の方が取りうるキャリアパスを、シナリオ別の総額・期間・要件で比較できます。
            </p>
            <ScenarioTabs scenarios={scenarios} />
          </section>
        )}

        {seg.midCta && (
          <MidCTA
            title={seg.midCta.title}
            description={seg.midCta.description}
            primaryHref={seg.midCta.primaryHref}
            primaryLabel={seg.midCta.primaryLabel}
            secondaryHref={seg.midCta.secondaryHref}
            secondaryLabel={seg.midCta.secondaryLabel}
          />
        )}

        {seg.showCostEstimator !== false && countriesData.contents.length > 0 && (
          <section id="estimator" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用かんたん試算</h2>
            <CostEstimator
              countries={countriesData.contents}
              defaultCountrySlug={occ.recommendedCountries[0]}
              defaultMonths={seg.monthsAssumedForSchoolEstimate ?? 12}
            />
          </section>
        )}

        {recommendedCountries.length > 0 && (
          <section id="countries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">{occ.label}におすすめの国</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCountries.map((c) => (
                <Link
                  key={c.id}
                  href={`/countries/${c.id}`}
                  className="bg-white border border-gray-200 hover:border-primary-400 rounded-xl p-5 transition-colors block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{c.flagEmoji}</span>
                    <h3 className="font-bold">{c.nameJp}</h3>
                  </div>
                  {c.minimumWageLocal && (
                    <p className="text-xs text-gray-600">最低賃金: {c.minimumWageLocal}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {seg.showROICard && scenarios.length > 0 && (
          <section id="roi" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">投資回収（ROI）の目安</h2>
            <ROICalloutCard scenarios={scenarios} />
          </section>
        )}

        {filteredSchools.matched.length > 0 && (
          <section id="schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{occ.label}向けの語学・専門学校</h2>
            <SchoolPriceList
              schools={filteredSchools.matched}
              estimates={filteredSchools.withEstimates}
              monthsAssumed={seg.monthsAssumedForSchoolEstimate ?? 12}
            />
          </section>
        )}

        {seg.showFundingCard && (
          <section id="funding" className="mb-12">
            <FundingOptionsCard notes={seg.fundingNotes} />
          </section>
        )}

        {filteredExperiences.matched.length > 0 && (
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{occ.label}関連の体験談</h2>
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
          <SegmentRelatedLinks
            crossAxis="occupation"
            sections={[
              {
                title: '他の職業別ガイド',
                links: OCCUPATIONS.filter((o) => o.slug !== params.occupation)
                  .slice(0, 10)
                  .map((o) => ({
                    label: `${o.label}のワーホリ・留学`,
                    href: `/jobs/${o.slug}`,
                  })),
              },
              {
                title: '年代から探す',
                links: GENERATIONS.map((g) => ({
                  label: `${g.label}のワーホリ・留学`,
                  href: `/age/${g.slug}`,
                })),
              },
              {
                title: '予算・期間から探す',
                links: [
                  { label: '予算150〜200万円', href: '/budget/under-2m' },
                  { label: '予算200〜300万円', href: '/budget/under-3m' },
                  { label: '予算300〜500万円', href: '/budget/under-5m' },
                  { label: '期間1年間', href: '/duration/1year' },
                  { label: '期間2年以上', href: '/duration/2years' },
                ],
              },
            ]}
          />
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {BUDGETS.length > 0 && null}
        </section>
      </div>

      {seg.midCta && (
        <SegmentStickyCTA href={seg.midCta.primaryHref} label={seg.midCta.primaryLabel} subLabel={occ.label} />
      )}
    </>
  );
}
