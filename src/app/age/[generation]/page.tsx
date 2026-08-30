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
import { GENERATIONS, getGenerationBySlug, generationToSegmentMeta } from '@/lib/data/generations';
import { OCCUPATIONS } from '@/lib/data/occupations';
import { BUDGETS } from '@/lib/data/budgets';
import { getScenariosByKeys } from '@/lib/data/scenarios';
import { filterExperiencesBySegment, filterSchoolsBySegment } from '@/lib/segments/filter';
import { buildSegmentJsonLdBundle } from '@/lib/segments/jsonld-bundle';
import { estimateExperienceTotalJpy } from '@/lib/segments/cost-estimator';
import { SITE_URL } from '@/lib/utils/constants';

export const revalidate = 3600;

type Props = { params: { generation: string } };

export async function generateStaticParams() {
  return GENERATIONS.map((g) => ({ generation: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const gen = getGenerationBySlug(params.generation);
  if (!gen) return {};
  const path = `/age/${params.generation}`;

  if (gen.metaTitle && gen.metaDescription) {
    return generatePageMetadata({
      title: gen.metaTitle,
      description: gen.metaDescription,
      path,
      keywords: gen.targetKeywords,
    });
  }

  return generateSegmentMetadata({
    segmentLabel: gen.label,
    segmentType: '年代',
    path,
  });
}

const SHAKAIJIN_FAQS = [
  {
    question: '社会人がワーホリに行くのに適したタイミングはいつですか？',
    answer:
      '社会人歴3〜5年目、25〜28歳が最も多い世代です。仕事の引き継ぎ・転職市場での経験年数バランス・30歳のビザ年齢制限を逆算すると、25〜28歳での渡航がキャリア面でも一番リカバリーしやすいです。',
  },
  {
    question: '職歴があると帰国後の転職は有利になりますか？',
    answer:
      '日本での社会人経験3年以上があれば、帰国後の転職市場では「即戦力＋語学力」のポジションを狙えます。逆に未経験職種への転換は経験者枠との競合で不利になりやすいため、出発前にキャリアの方向性を決めておくことが重要です。',
  },
  {
    question: 'ワーホリ中も日本の社会保険（国民年金など）はどうすればいいですか？',
    answer:
      '退職後に「国民年金」「国民健康保険」への切替が必要です。海外居住期間中は国民年金を「任意加入」または「免除申請」可能。健康保険は海外旅行保険でカバーし、住民票を抜けば住民税も翌年度から免除されます。手続きは出発前に役所で完了させましょう。',
  },
  {
    question: '30代でもワーホリビザは取れますか？',
    answer:
      'オーストラリアは2024年以降35歳まで（一部条件付き）、カナダ・アイルランドは依然30歳までです。20代後半のうちに申請しておけば30歳到達後も渡航可能な国もあるため、迷っているうちに年齢制限を超えないよう注意が必要です。',
  },
  {
    question: '転職前と後、どちらのタイミングでワーホリへ行くべきですか？',
    answer:
      '転職前（退職→ワーホリ→帰国後転職）が王道です。理由は (1) 新しい職場でいきなり1年休むのは難しい (2) 帰国後に「ワーホリで身につけたスキル」を志望理由に組み込みやすい (3) 退職金や有給消化を出発資金に充てられる、の3点です。',
  },
];

export default async function AgePage({ params }: Props) {
  const gen = getGenerationBySlug(params.generation);
  if (!gen) notFound();

  const seg = generationToSegmentMeta(gen);
  const isShakaijin = params.generation === '20s-late';
  const path = `/age/${params.generation}`;
  const url = `${SITE_URL}${path}`;

  const [countriesData, experiencesData, schoolsData] = await Promise.all([
    getCountries({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getExperiences({ limit: 60, orders: '-publishedAt' }).catch(() => ({
      contents: [], totalCount: 0, offset: 0, limit: 0,
    })),
    getSchools({ limit: 80, depth: 2 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
  ]);

  const matchedByAge = experiencesData.contents.filter(
    (e) => e.ageAtDeparture && e.ageAtDeparture >= gen.minAge && e.ageAtDeparture <= gen.maxAge
  );
  let ageMatched;
  if (matchedByAge.length > 0) {
    const ageEstimates = new Map<string, number>();
    for (const exp of matchedByAge) {
      const total = estimateExperienceTotalJpy(exp);
      if (total != null) ageEstimates.set(exp.id, total);
    }
    ageMatched = {
      matched: matchedByAge.slice(0, 6),
      withEstimates: ageEstimates,
      fallbackTier: 0 as const,
      appliedHint: 'strict' as const,
    };
  } else {
    ageMatched = filterExperiencesBySegment(experiencesData.contents, seg, 6);
  }

  const filteredSchools = filterSchoolsBySegment(schoolsData.contents, seg, 6);

  const scenarios = getScenariosByKeys(gen.scenarioKeys);
  const defaultFaqs = [
    {
      question: `${gen.label}でもワーホリは間に合う？`,
      answer:
        gen.maxAge < 30
          ? `${gen.label}はワーホリ年齢制限内です。多くの国（30歳まで）で問題なくビザ取得できます。`
          : gen.maxAge < 36
          ? '30歳を超えると国により制限が出ます。アイルランド・カナダ・オーストラリア（2024年以降35歳まで延長）などは依然として申請可能です。'
          : 'ワーホリは原則30歳までですが、短期語学留学・観光ビザ留学・社会人留学プログラムなど代替手段が豊富にあります。',
    },
    {
      question: `${gen.label}におすすめの留学スタイルは？`,
      answer: gen.recommendedPath + ' が定番ルートです。',
    },
    {
      question: `${gen.label}で気をつけることは？`,
      answer:
        gen.minAge < 25
          ? 'まだ社会人経験が浅いため、ホームステイの方が生活面で安心です。語学学校のサポート体制も重視しましょう。'
          : gen.minAge < 30
          ? '貯金・キャリアブランクへの不安と向き合うことが重要。帰国後の転職戦略を事前に立てておきましょう。'
          : '健康面・家族との連絡・キャリアの方向性に加え、保険を厚めにしておくのがおすすめです。',
    },
  ];
  const faqs = isShakaijin ? SHAKAIJIN_FAQS : (gen.faqOverrides ?? defaultFaqs);

  const h1 = gen.h1Override ?? `${gen.label}のワーホリ・留学完全ガイド`;
  const heroLead = gen.heroLead ?? gen.description;

  const tocItems: { id: string; label: string }[] = [
    { id: 'overview', label: 'この年代でわかること' },
    ...(isShakaijin ? [{ id: 'four-things', label: '社会人ワーホリ前の4ポイント' }] : []),
    ...(scenarios.length > 0 ? [{ id: 'scenarios', label: '主要シナリオ' }] : []),
    ...(gen.showCostEstimator !== false ? [{ id: 'estimator', label: '費用かんたん試算' }] : []),
    ...(gen.showROICard ? [{ id: 'roi', label: '投資回収（ROI）' }] : []),
    ...(filteredSchools.matched.length > 0 ? [{ id: 'schools', label: 'おすすめ学校' }] : []),
    ...(gen.showFundingCard ? [{ id: 'funding', label: '資金計画' }] : []),
    ...(ageMatched.matched.length > 0 ? [{ id: 'experiences', label: '体験談' }] : []),
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
      { name: '年代から探す', url: '/age' },
      { name: gen.label, url: path },
    ],
    scenarios,
    schools: filteredSchools.matched,
    countries: countriesData.contents.filter((c) => c.programStatus === 'open').slice(0, 6),
    experiences: ageMatched.matched,
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
            { label: '年代から探す', href: '/age' },
            { label: isShakaijin ? '社会人のワーホリ' : `${gen.label}のワーホリ・留学` },
          ]}
        />

        <SegmentHero seg={seg} h1={h1} lead={heroLead} />

        <ArticleMetaBadge
          readingMinutes={isShakaijin ? 12 : Math.min(15, Math.max(5, scenarios.length * 2 + 4))}
          updatedAt="2026-06-04"
          targetAudience={gen.whoFor}
        />

        <ExchangeRateNotice className="mb-6" />

        {gen.keyTakeaways && gen.keyTakeaways.length > 0 && (
          <section id="overview">
            <KeyTakeaway items={gen.keyTakeaways} title={`${gen.label}で何ができるか`} />
          </section>
        )}

        <InPageTOC headings={tocItems} defaultOpen />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
            <p className="text-xs text-primary-700 mb-1">こんな方に</p>
            <p className="text-sm font-bold text-primary-900">{gen.whoFor}</p>
          </div>
          <div className="bg-accent-50 border border-accent-100 rounded-xl p-5">
            <p className="text-xs text-accent-700 mb-1">おすすめルート</p>
            <p className="text-sm font-bold text-accent-900">{gen.recommendedPath}</p>
          </div>
        </section>

        {isShakaijin && (
          <section id="four-things" className="mb-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">社会人がワーホリを選ぶ前に知っておきたい4つのこと</h2>
            <p className="text-sm text-gray-600">
              社会人ワーホリは学生留学と異なる準備が必要。退職判断・社会保険・キャリア戦略を出発前に整理しておくと、帰国後の転職活動がスムーズに進みます。
            </p>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-bold mb-2">① キャリアへの影響を「投資期間」に変える</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                ワーホリ単体は「キャリアブランク」と評価されがち。語学力・海外実務経験・専門スキルを伴うと「即戦力＋語学力」評価に変わります。
              </p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                <li>出発前に帰国後の希望職種を具体的に言語化</li>
                <li>現地インターン・ボランティア・スキル習得を計画</li>
                <li>語学スコアは出発前/帰国直後の2回受験で定量化</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-bold mb-2">② 退職タイミング：3〜4ヶ月前から逆算</h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mt-2">
                <p className="font-semibold mb-1">標準的な逆算スケジュール（オーストラリア例）</p>
                <ul className="space-y-0.5 text-xs">
                  <li>・出発6ヶ月前：上司に意思表示、ビザ申請開始</li>
                  <li>・出発4ヶ月前：退職届提出、引き継ぎ計画</li>
                  <li>・出発2ヶ月前：航空券・保険・初期滞在先確定</li>
                  <li>・出発1ヶ月前：住民票異動・年金/健康保険切替</li>
                  <li>・出発2週間前：銀行・カード・通信解約</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-bold mb-2">③ 社会保険・年金・税金の手続き</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-2">
                <div className="bg-sky-50 rounded-lg p-2.5">
                  <p className="font-semibold text-sky-900">国民年金</p>
                  <p className="text-sky-800">海外居住者は任意加入または免除申請可。将来の受給額に影響するため任意加入推奨。</p>
                </div>
                <div className="bg-sky-50 rounded-lg p-2.5">
                  <p className="font-semibold text-sky-900">国民健康保険</p>
                  <p className="text-sky-800">住民票を抜けば加入不要。海外旅行保険で代替。</p>
                </div>
                <div className="bg-sky-50 rounded-lg p-2.5">
                  <p className="font-semibold text-sky-900">住民税</p>
                  <p className="text-sky-800">1月1日時点で住民票なしなら翌年度免除。1月以前の出発がベター。</p>
                </div>
                <div className="bg-sky-50 rounded-lg p-2.5">
                  <p className="font-semibold text-sky-900">所得税</p>
                  <p className="text-sky-800">退職年の所得税は確定申告で還付されることが多い。</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-bold mb-2">④ 帰国後の転職活動：いつから何を準備するか</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                帰国3〜4ヶ月前から日本の転職エージェント（リクルート・doda・JAC Recruitment等）に登録、オンライン面談で求人動向を把握しておくのが定石。「帰国後3ヶ月で内定獲得」のスケジュールを出発前に描いておきましょう。
              </p>
              <Link href="/after-wh" className="inline-block mt-2 text-primary-600 hover:underline text-sm font-medium">
                → 帰国後の就活サポート完全ガイドを読む
              </Link>
            </div>
          </section>
        )}

        {scenarios.length > 0 && (
          <section id="scenarios" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">この年代に合う主要シナリオ</h2>
            <p className="text-sm text-gray-600 mb-4">年代特性・ビザ制限を踏まえた現実的なシナリオを比較できます。</p>
            <ScenarioTabs scenarios={scenarios} />
          </section>
        )}

        {gen.midCta && (
          <MidCTA
            title={gen.midCta.title}
            description={gen.midCta.description}
            primaryHref={gen.midCta.primaryHref}
            primaryLabel={gen.midCta.primaryLabel}
            secondaryHref={gen.midCta.secondaryHref}
            secondaryLabel={gen.midCta.secondaryLabel}
          />
        )}

        {gen.showCostEstimator !== false && countriesData.contents.length > 0 && (
          <section id="estimator" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用かんたん試算</h2>
            <CostEstimator countries={countriesData.contents} defaultMonths={gen.monthsAssumedForSchoolEstimate ?? 12} />
          </section>
        )}

        {gen.showROICard && scenarios.length > 0 && (
          <section id="roi" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">投資回収（ROI）の目安</h2>
            <ROICalloutCard scenarios={scenarios} />
          </section>
        )}

        {filteredSchools.matched.length > 0 && (
          <section id="schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{gen.label}におすすめの語学・専門学校</h2>
            <SchoolPriceList
              schools={filteredSchools.matched}
              estimates={filteredSchools.withEstimates}
              monthsAssumed={gen.monthsAssumedForSchoolEstimate ?? 6}
            />
          </section>
        )}

        {gen.showFundingCard && (
          <section id="funding" className="mb-12">
            <FundingOptionsCard notes={gen.fundingNotes} />
          </section>
        )}

        {ageMatched.matched.length > 0 && (
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {isShakaijin ? '社会人（25歳以上）の体験談' : `${gen.label}の体験談`}（{ageMatched.matched.length}件）
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ageMatched.matched.map((exp) => (
                <ExperienceWithCost key={exp.id} experience={exp} estimatedTotalJpy={ageMatched.withEstimates.get(exp.id)} />
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
            crossAxis="age"
            sections={[
              {
                title: '他の年代で探す',
                links: GENERATIONS.filter((g) => g.slug !== params.generation).map((g) => ({
                  label: `${g.label}のワーホリ・留学`,
                  href: `/age/${g.slug}`,
                })),
              },
              {
                title: '予算から探す',
                links: BUDGETS.slice(0, 6).map((b) => ({
                  label: `予算${b.label}`,
                  href: `/budget/${b.slug}`,
                })),
              },
              {
                title: '職業別で探す',
                links: OCCUPATIONS.slice(0, 6).map((o) => ({
                  label: `${o.label}のワーホリ・留学`,
                  href: `/jobs/${o.slug}`,
                })),
              },
            ]}
          />
        </section>
      </div>

      {gen.midCta && (
        <SegmentStickyCTA href={gen.midCta.primaryHref} label={gen.midCta.primaryLabel} subLabel={gen.label} />
      )}
    </>
  );
}
