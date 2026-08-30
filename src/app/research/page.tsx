import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ExperienceCard from '@/components/experience/ExperienceCard';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import QuoteFromExperience from '@/components/article/QuoteFromExperience';
import MidCTA from '@/components/article/MidCTA';
import StatCard from '@/components/research/StatCard';
import BarChart from '@/components/research/BarChart';
import RankingTable from '@/components/research/RankingTable';
import CitationBox from '@/components/research/CitationBox';
import { generatePageMetadata } from '@/lib/seo/metadata';
import {
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateDatasetJsonLd,
  generateItemListJsonLd,
} from '@/lib/seo/jsonld';
import { getExperiences } from '@/lib/microcms/experiences';
import {
  getReportSummary,
  getCountryRanking,
  getCostBreakdownStats,
  getRatingDistribution,
  getAgeBandStats,
  getGenderRatingAverage,
  getLanguageProgressStats,
  getDepartureMonthDistribution,
  countMentions,
  extractMatchingSentence,
} from '@/lib/stats/experiences-cross';
import type { Experience } from '@/lib/microcms/types';
import { SITE_NAME, SITE_URL } from '@/lib/utils/constants';

export const revalidate = 86400;

const PATH = '/research';
const PAGE_TITLE = 'ワーホリ・留学実態調査2026';
const FULL_URL = `${SITE_URL}${PATH}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ・留学実態調査2026｜経験者のリアルデータ（費用・語学・満足度）',
  description:
    '留学・ワーキングホリデー経験者へのアンケートと体験談をもとに、月間生活費の相場、語学力の伸び、満足度、年代別・男女別の傾向を集計した独自調査です。数値・グラフは出典明記で自由に引用いただけます。',
  path: PATH,
  keywords: [
    'ワーホリ 実態調査',
    'ワーホリ 費用 平均',
    '留学 費用 相場',
    'ワーホリ 満足度',
    'ワーホリ 語学 上達',
    'ワーホリ データ',
    '留学 統計',
  ],
});

const TOC_HEADINGS = [
  { id: 'summary', label: '調査サマリー' },
  { id: 'cost-by-country', label: '国別の月間生活費' },
  { id: 'rating-by-country', label: '国別の満足度' },
  { id: 'language-progress', label: '語学力はどれだけ伸びたか' },
  { id: 'by-age', label: '年代別の傾向' },
  { id: 'regret', label: '大変だったことランキング' },
  { id: 'satisfaction', label: '行ってよかったことランキング' },
  { id: 'methodology', label: '調査の方法' },
  { id: 'citation', label: '引用・転載について' },
  { id: 'faq', label: 'よくある質問' },
];

// 「デメリット」で挙がりやすいテーマ
const REGRET_KEYWORDS: { label: string; re: RegExp }[] = [
  { label: 'お金・費用のやりくり', re: /(お金|費用|貯金|金欠|予算|物価|高い|出費)/ },
  { label: '仕事・求人探し', re: /(仕事|求人|バイト|職|就活|シフト)/ },
  { label: '英語・語学の壁', re: /(英語|語学|言葉|話せ|通じ|聞き取)/ },
  { label: '住居・シェアハウス', re: /(家|部屋|シェア|住|家賃|ルームメイト|物件)/ },
  { label: '孤独・人間関係', re: /(孤独|寂し|友達|人間関係|ホームシック|メンタル)/ },
  { label: '治安・トラブル', re: /(治安|危な|盗|トラブル|詐欺|事件)/ },
];

// 「メリット」で挙がりやすいテーマ
const SATISFACTION_KEYWORDS: { label: string; re: RegExp }[] = [
  { label: '友達・出会い', re: /(友達|友人|出会|仲間|人脈|交流)/ },
  { label: '語学力の向上', re: /(英語|語学|話せる|上達|伸び|ペラペラ)/ },
  { label: '自己成長・自信', re: /(成長|自信|変わ|視野|価値観|度胸)/ },
  { label: '経験・楽しさ', re: /(楽し|最高|充実|経験|思い出|刺激)/ },
  { label: 'キャリア・将来', re: /(キャリア|就職|転職|将来|仕事に|帰国後)/ },
];

const FAQS = [
  {
    question: 'このデータはどうやって集めたのですか？',
    answer:
      '留学・ワーキングホリデーを実際に経験した方へのアンケート（クラウドソーシングで募集）と、当サイトに投稿された体験談をもとに集計しています。編集部が内容を確認・校正したうえで統計化しています。',
  },
  {
    question: '何人分のデータですか？',
    answer:
      '体験談として公開している渡航経験者のデータを集計しています。各統計には対象となった件数（n=◯件）を必ず併記しています。設問によって回答数が異なるため、分母は項目ごとにご確認ください。',
  },
  {
    question: 'データを引用・転載してもいいですか？',
    answer:
      'はい。出典（Study Work Hub）の明記とこのページへのリンクを添えていただければ、営利・非営利を問わず自由にご利用いただけます。報道・教育・研究目的での引用も歓迎します。ページ内「引用・転載について」のコードをそのままお使いいただけます。',
  },
  {
    question: '数字はどのくらい信頼できますか？',
    answer:
      '実際の渡航経験者の回答にもとづく一次データですが、サンプル数には限りがあります。サンプル数が極端に少ない国（n<3）はランキングから除外し、各数値に件数を明記することで、過度な一般化を避けています。',
  },
];

function pickQuote(
  ranking: { re: RegExp; samples: Experience[] }[],
  source: 'cons' | 'pros'
): { exp: Experience; quote: string } | null {
  for (const r of ranking) {
    for (const exp of r.samples) {
      const text =
        source === 'cons'
          ? exp.cons?.map((c) => c.text).join('。') ?? ''
          : exp.pros?.map((p) => p.text).join('。') ?? '';
      const quote = extractMatchingSentence(text, r.re, 10, 120) ?? extractMatchingSentence(exp.advice ?? '', r.re, 10, 120);
      if (quote) return { exp, quote };
    }
  }
  return null;
}

const man = (jpy: number | null | undefined): string =>
  jpy == null ? '—' : `${(Math.round(jpy / 1000) / 10).toFixed(1)}万円`;

export default async function ResearchPage() {
  const { contents } = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [] as Experience[],
    totalCount: 0,
    offset: 0,
    limit: 0,
  }));

  const summary = getReportSummary(contents);

  // 国別: 生活費が安い順 / 満足度が高い順（n>=3 ガード）
  const costRanking = getCountryRanking(contents, 'monthlyLivingAvg', { order: 'asc', minN: 3 });
  const ratingRanking = getCountryRanking(contents, 'ratingOverall', { order: 'desc', minN: 3 });

  const costBreakdown = getCostBreakdownStats(contents);
  const overallDist = getRatingDistribution(contents, 'overall');
  const ageBands = getAgeBandStats(contents);
  const gender = getGenderRatingAverage(contents);
  const progress = getLanguageProgressStats(contents);
  const improvedRate =
    progress.totalWithBoth > 0 ? Math.round((progress.improvedCount / progress.totalWithBoth) * 100) : 0;
  const departure = getDepartureMonthDistribution(contents);

  const regretRanking = REGRET_KEYWORDS.map((k) => ({
    label: k.label,
    re: k.re,
    ...countMentions(contents, k.re, { source: 'cons' }),
  })).sort((a, b) => b.containsCount - a.containsCount);
  const satisfactionRanking = SATISFACTION_KEYWORDS.map((k) => ({
    label: k.label,
    re: k.re,
    ...countMentions(contents, k.re, { source: 'pros' }),
  })).sort((a, b) => b.containsCount - a.containsCount);

  const regretQuote = pickQuote(regretRanking, 'cons');
  const satisfactionQuote = pickQuote(satisfactionRanking, 'pros');

  const sampleExperiences = contents.slice(0, 6);

  // KeyTakeaway（最も引用されやすい数字を冒頭に）
  const takeaways: string[] = [`渡航経験者${summary.totalCount}人の体験談を集計した独自調査`];
  if (summary.medianMonthlyLiving != null) {
    takeaways.push(`月間生活費の中央値は${man(summary.medianMonthlyLiving)}（n=${summary.monthlyLivingN}件）`);
  }
  if (summary.recommendN > 0) {
    takeaways.push(`${summary.recommendRate}%が「また行きたい・おすすめ」と回答（n=${summary.recommendN}件）`);
  } else {
    takeaways.push(`総合満足度の平均は★${summary.avgOverall}（n=${summary.avgOverallN}件）`);
  }

  const datasetJsonLd = generateDatasetJsonLd({
    name: `${PAGE_TITLE}｜留学・ワーキングホリデー経験者のリアルデータ`,
    description:
      '留学・ワーキングホリデー経験者へのアンケートと投稿体験談をもとに、月間生活費・家賃・食費・収入、総合満足度・治安・仕事の評価、渡航前後の語学レベル、年代・性別の傾向を集計した調査データ。',
    url: FULL_URL,
    temporalCoverage: '2026-03-20/2026-04-30',
    measurementTechnique: 'オンラインアンケート（クラウドソーシング）および投稿された渡航体験談の集計',
    variableMeasured: [
      '月間生活費（円）',
      '家賃（円）',
      '食費（円）',
      '月収（円）',
      '総合満足度（5段階）',
      '治安評価（5段階）',
      '仕事評価（5段階）',
      '渡航前後の語学レベル',
      '渡航時の年齢',
    ],
    keywords: ['ワーキングホリデー', '留学', '生活費', '語学学習', '満足度', '実態調査'],
    license: `${FULL_URL}#citation`,
    dateModified: '2026-06-17',
  });

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: PAGE_TITLE, url: PATH },
        ])}
      />
      <JsonLd data={datasetJsonLd} />
      <JsonLd data={generateFAQJsonLd(FAQS)} />
      {ratingRanking.length > 0 && (
        <JsonLd
          data={generateItemListJsonLd({
            name: '満足度の高い国ランキング（渡航経験者の総合評価）',
            items: ratingRanking.map((c) => ({ name: c.name, url: `/countries/${c.slug}` })),
          })}
        />
      )}

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: PAGE_TITLE }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリ・留学実態調査2026
              <span className="block text-lg sm:text-xl text-gray-600 mt-2">
                経験者{summary.totalCount}人のリアルデータ（費用・語学・満足度）
              </span>
            </h1>
            <ArticleMetaBadge
              readingMinutes={12}
              updatedAt="2026年6月"
              targetAudience="留学・ワーホリ検討者、メディア・教育関係者"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              留学・ワーキングホリデーを実際に経験した方へのアンケートと体験談をもとに、
              「実際いくらかかったのか」「語学はどれだけ伸びたのか」「満足度はどうだったか」を集計しました。
              すべての数値に件数（n）を添えています。データは出典の明記とリンクを条件に、どなたでも自由に引用いただけます。
            </p>
          </header>

          <KeyTakeaway items={takeaways} />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 調査サマリー */}
          <section id="summary" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">調査サマリー</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="集計した体験談" value={summary.totalCount} unit="人" color="sky" note="本調査の対象者数" />
              <StatCard
                label="月間生活費の中央値"
                value={summary.medianMonthlyLiving != null ? man(summary.medianMonthlyLiving) : '—'}
                color="emerald"
                note={`n=${summary.monthlyLivingN}件`}
              />
              <StatCard label="総合満足度の平均" value={`★${summary.avgOverall}`} color="amber" note={`n=${summary.avgOverallN}件`} />
              {summary.recommendN > 0 ? (
                <StatCard label="「また行きたい」割合" value={summary.recommendRate} unit="%" color="rose" note={`n=${summary.recommendN}件`} />
              ) : (
                <StatCard
                  label="平均滞在期間"
                  value={summary.avgDurationMonths != null ? summary.avgDurationMonths : '—'}
                  unit="ヶ月"
                  color="rose"
                  note={`n=${summary.durationN}件`}
                />
              )}
            </div>
          </section>

          {/* 国別の月間生活費 */}
          <section id="cost-by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別の月間生活費の相場</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              渡航経験者が回答した月間生活費の中央値を、国別に安い順で並べました。サンプル数が3件未満の国は除外しています。
            </p>
            {costRanking.length > 0 ? (
              <>
                <RankingTable
                  valueHeader="月間生活費（中央値）"
                  rows={costRanking.map((c, i) => ({
                    rank: i + 1,
                    label: c.name,
                    flag: c.flag,
                    value: man(c.monthlyLivingAvg),
                    count: c.count,
                    href: `/countries/${c.slug}`,
                  }))}
                />
                <div className="mt-6">
                  <h3 className="font-bold text-base mb-3">費用の内訳（全体の中央値）</h3>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr className="text-left">
                          <th className="px-4 py-3 font-semibold">項目</th>
                          <th className="px-4 py-3 font-semibold whitespace-nowrap">中央値</th>
                          <th className="px-4 py-3 font-semibold whitespace-nowrap">平均</th>
                          <th className="px-4 py-3 font-semibold whitespace-nowrap">件数</th>
                        </tr>
                      </thead>
                      <tbody>
                        {costBreakdown.map((b) => (
                          <tr key={b.key} className="border-t border-gray-100">
                            <td className="px-4 py-3 font-medium">{b.label}</td>
                            <td className="px-4 py-3 font-semibold whitespace-nowrap">{man(b.median)}</td>
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{man(b.avg)}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">n={b.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">集計可能なデータを準備中です。</p>
            )}
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="自分の予算に合う国を5問で診断"
            description="目的・期間・予算・治安の希望から、9カ国の中から相性スコアつきで提案します。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/budget"
            secondaryLabel="予算別の費用ガイドを見る"
          />

          {/* 国別の満足度 */}
          <section id="rating-by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別の総合満足度</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              渡航経験者の総合評価（5段階）の平均を、国別に高い順で並べました（n≧3の国）。
            </p>
            {ratingRanking.length > 0 ? (
              <RankingTable
                valueHeader="総合満足度（平均）"
                rows={ratingRanking.map((c, i) => ({
                  rank: i + 1,
                  label: c.name,
                  flag: c.flag,
                  value: `★${c.ratingOverall}`,
                  count: c.count,
                  href: `/countries/${c.slug}`,
                }))}
              />
            ) : (
              <p className="text-sm text-gray-500">集計可能なデータを準備中です。</p>
            )}

            {overallDist.total > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-base mb-3">総合満足度の分布（n={overallDist.total}件）</h3>
                <BarChart
                  color="amber"
                  items={overallDist.distribution
                    .slice()
                    .reverse()
                    .map((d) => ({
                      label: `★${d.star}`,
                      value: d.count,
                      valueLabel: `${d.count}件`,
                    }))}
                />
              </div>
            )}
          </section>

          {/* 語学力の伸び */}
          <section id="language-progress" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">語学力はどれだけ伸びたか</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              渡航前と帰国時の語学レベルを記入した方を対象に、レベルが上がった割合を集計しました。
            </p>
            {progress.totalWithBoth > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  label="渡航前よりレベルが上がった人"
                  value={`${progress.improvedCount}／${progress.totalWithBoth}`}
                  unit={`人（${improvedRate}%）`}
                  color="emerald"
                  note={`n=${progress.totalWithBoth}件（渡航前後の語学レベルを記入した方）`}
                />
                {progress.beginnerStartTotal > 0 && (
                  <StatCard
                    label="「初級」スタートで上達した人"
                    value={`${progress.beginnerStartImproved}／${progress.beginnerStartTotal}`}
                    unit="人"
                    color="sky"
                    note={`n=${progress.beginnerStartTotal}件（渡航前が初級だった方）`}
                  />
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">集計可能なデータを準備中です。</p>
            )}
          </section>

          {/* 年代別 */}
          <section id="by-age" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">年代別の傾向</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              渡航時の年齢を記入した方を年代別に分け、件数・平均満足度・生活費の中央値を集計しました。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">年代</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">件数</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">平均満足度</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">生活費（中央値）</th>
                  </tr>
                </thead>
                <tbody>
                  {ageBands.map((b) => (
                    <tr key={b.band} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium">{b.band}</td>
                      <td className="px-4 py-3 text-gray-500">{b.count > 0 ? `n=${b.count}` : '—'}</td>
                      <td className="px-4 py-3 font-semibold">{b.avgOverall != null ? `★${b.avgOverall}` : '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{man(b.medianMonthlyLiving)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">※件数が少ない年代は参考値です。</p>

            {(gender.female.count > 0 || gender.male.count > 0) && (
              <div className="mt-6">
                <h3 className="font-bold text-base mb-3">男女別の評価平均</h3>
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left">
                        <th className="px-4 py-3 font-semibold"></th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">総合</th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">治安</th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">仕事</th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">件数</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-100">
                        <td className="px-4 py-3 font-medium">女性</td>
                        <td className="px-4 py-3">★{gender.female.overall}</td>
                        <td className="px-4 py-3">★{gender.female.safety}</td>
                        <td className="px-4 py-3">★{gender.female.job}</td>
                        <td className="px-4 py-3 text-gray-500">n={gender.female.count}</td>
                      </tr>
                      <tr className="border-t border-gray-100">
                        <td className="px-4 py-3 font-medium">男性</td>
                        <td className="px-4 py-3">★{gender.male.overall}</td>
                        <td className="px-4 py-3">★{gender.male.safety}</td>
                        <td className="px-4 py-3">★{gender.male.job}</td>
                        <td className="px-4 py-3 text-gray-500">n={gender.male.count}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* 大変だったことランキング */}
          <section id="regret" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">「大変だった」ことランキング</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              体験談の「デメリット・大変だった点」で、どのテーマがどれくらい挙がったかを集計しました（n={summary.totalCount}件中の言及率）。
            </p>
            <BarChart
              color="primary"
              max={100}
              items={regretRanking.map((r) => ({
                label: r.label,
                value: r.percentage,
                valueLabel: `${r.percentage}%（${r.containsCount}件）`,
              }))}
            />
            {regretQuote && (
              <QuoteFromExperience text={regretQuote.quote} experience={regretQuote.exp} truncated />
            )}
          </section>

          {/* 行ってよかったことランキング */}
          <section id="satisfaction" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">「行ってよかった」ことランキング</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              体験談の「メリット・良かった点」で挙がったテーマの言及率です（n={summary.totalCount}件中）。
            </p>
            <BarChart
              color="emerald"
              max={100}
              items={satisfactionRanking.map((r) => ({
                label: r.label,
                value: r.percentage,
                valueLabel: `${r.percentage}%（${r.containsCount}件）`,
              }))}
            />
            {satisfactionQuote && (
              <QuoteFromExperience text={satisfactionQuote.quote} experience={satisfactionQuote.exp} truncated />
            )}
          </section>

          {/* 出発時期 */}
          {departure.total > 0 && (
            <section id="departure" className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談の投稿が多い時期</h2>
              <BarChart
                color="sky"
                items={departure.monthly.map((m) => ({
                  label: `${m.month}月`,
                  value: m.count,
                  valueLabel: `${m.count}件`,
                }))}
              />
              <p className="text-xs text-gray-500 mt-2">
                ※出発月の正確な記録がないため、体験談の投稿時期をもとにした参考値です。
              </p>
            </section>
          )}

          {/* 体験談 */}
          {sampleExperiences.length > 0 && (
            <section id="experiences" className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">調査のもとになった体験談</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                本調査は、こうした一人ひとりの体験談の集まりです。個別の声もぜひお読みください。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
              <p className="mt-4 text-sm">
                <Link href="/experiences" className="text-primary-600 hover:underline">
                  → 全{summary.totalCount}件の体験談を読む
                </Link>
              </p>
            </section>
          )}

          {/* 調査の方法 */}
          <section id="methodology" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">調査の方法</h2>
            <ul className="space-y-2 text-sm text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold shrink-0 mt-0.5">▸</span>
                <span>対象: 留学・ワーキングホリデーの渡航経験者</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold shrink-0 mt-0.5">▸</span>
                <span>方法: クラウドソーシングでのアンケート募集、および当サイトへの体験談投稿</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold shrink-0 mt-0.5">▸</span>
                <span>集計: 編集部が回答内容を確認・校正のうえ統計化（個人が特定される情報は掲載しません）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold shrink-0 mt-0.5">▸</span>
                <span>注意: 設問により回答数が異なるため、各数値に件数（n）を併記。n&lt;3の国はランキングから除外</span>
              </li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mt-4">
              調査の実施概要は{' '}
              <Link href="/survey" className="text-primary-700 hover:underline">
                アンケート調査について
              </Link>
              、運営体制は{' '}
              <Link href="/about" className="text-primary-700 hover:underline">
                運営者情報
              </Link>{' '}
              をご覧ください。
            </p>
          </section>

          {/* 引用・転載について */}
          <div id="citation" className="mb-12">
            <CitationBox pageTitle={PAGE_TITLE} pageUrl={FULL_URL} siteName={SITE_NAME} />
          </div>

          {/* FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">よくある質問</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <details key={i} className="bg-gray-50 rounded-lg p-4 group">
                  <summary className="font-medium cursor-pointer list-none flex items-center justify-between gap-3">
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* 関連リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/experiences" className="text-primary-600 hover:underline">
                  → 全{summary.totalCount}件の体験談を読む
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → 予算別の費用ガイド
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合うワーホリ国
                </Link>
              </li>
              <li>
                <Link href="/compare/countries" className="text-primary-600 hover:underline">
                  → 人気9カ国の費用・治安・稼ぎやすさ比較
                </Link>
              </li>
              <li>
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語が話せなくてもワーホリできる
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-600 hover:underline">
                  → 運営者情報・調査の方針
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
