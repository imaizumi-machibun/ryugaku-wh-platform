import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import QuoteFromExperience from '@/components/article/QuoteFromExperience';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { getExperiences } from '@/lib/microcms/experiences';
import { countMentions, extractMatchingSentence } from '@/lib/stats/experiences-cross';
import { isPublished } from '@/lib/publish/schedule';

const PAGE_PATH = '/wh-overseas-university';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外大学・大学院進学完全ガイド｜出願・英語要件・費用・奨学金',
  description: '海外大学・大学院進学の出願プロセス、英語要件、費用シミュレーション、奨学金、進学後のキャリア・PRルートまで完全解説。学部・MBA・修士・博士全網羅。',
  path: PAGE_PATH,
  keywords: [
    '海外 大学 進学',
    '海外 大学院 留学',
    '海外 MBA',
    '海外 修士',
    '海外 学位',
    '大学院 留学 費用',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-overseas', label: 'なぜ海外大学・大学院進学か' },
  { id: 'degree-types', label: '学位の種類と特徴' },
  { id: 'top-countries', label: '主要国・大学ランキング' },
  { id: 'english-requirements', label: '英語要件（IELTS/TOEFL/GMAT/GRE）' },
  { id: 'cost', label: '費用シミュレーション' },
  { id: 'scholarship', label: '奨学金の探し方' },
  { id: 'application', label: '出願プロセス（12ヶ月計画）' },
  { id: 'after-graduation', label: '卒業後のキャリア・PR' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const DEGREE_TYPES = [
  {
    type: 'Bachelor（学部、3-4年）',
    cost: '年300-800万円',
    detail: '大学新卒・社会人やり直しに、学位＋英語＋専門スキル',
  },
  {
    type: 'Master（修士、1-2年）',
    cost: '年300-700万円',
    detail: '専門深耕＋キャリア転換、社会人留学の王道',
  },
  {
    type: 'MBA（経営学修士、1-2年）',
    cost: '年500-1,500万円',
    detail: '経営者・コンサル志望、年収UP直結',
  },
  {
    type: 'PhD（博士、3-5年）',
    cost: '年100-500万円（奨学金あり）',
    detail: '研究者・大学教員志望、奨学金充実',
  },
];

const TOP_COUNTRIES = [
  {
    country: 'アメリカ',
    feature: 'ハーバード・スタンフォード等世界トップ大学多、F-1ビザ・OPT 1年',
    cost: '年500-1,500万円（私立は最高）',
  },
  {
    country: 'イギリス',
    feature: 'オックス・ケンブリッジ・LSE、修士1年で完結',
    cost: '年400-1,000万円',
  },
  {
    country: 'オーストラリア',
    feature: '8大学（Group of Eight）、移民・PRに有利',
    cost: '年400-800万円',
  },
  {
    country: 'カナダ',
    feature: 'トロント大・ブリティッシュコロンビア大、PGWP（卒業後就労3年）',
    cost: '年300-700万円',
  },
  {
    country: 'ドイツ',
    feature: 'TU München等、学費無料 or 低額（公立）',
    cost: '年100-300万円（生活費中心）',
  },
  {
    country: 'シンガポール',
    feature: 'NUS・NTU等アジアトップ、英語教育＋アジア戦略',
    cost: '年300-600万円',
  },
];

const ENGLISH_REQUIREMENTS = [
  { test: 'IELTS Academic', score: '6.5-7.5（学部）、7.0-7.5（院）', detail: '世界標準、最も認知度高' },
  { test: 'TOEFL iBT', score: '80-100（学部）、95-110（院）', detail: '北米中心、コンピューターベース' },
  { test: 'GMAT', score: '550-750+', detail: 'MBA必須、論理・数学・英語' },
  { test: 'GRE', score: 'Quant 160+、Verbal 155+', detail: '院出願（理系・社会科学）、トップ校は高スコア必須' },
  { test: 'Duolingo English Test', score: '110-130', detail: 'コロナ後に受入校急増、自宅受験可' },
];

const COST_SIMULATION = [
  { period: '修士1年（英）', tuition: '£25,000-45,000', living: '£12,000-20,000', total: '約700-1,200万円' },
  { period: 'MBA 1年（仏）', tuition: '€60,000-90,000', living: '€15,000-25,000', total: '約1,200-1,800万円' },
  { period: '修士2年（米）', tuition: '$60,000-130,000', living: '$30,000-50,000', total: '約1,300-2,700万円' },
  { period: '修士1年（独）', tuition: '€0-3,000', living: '€10,000-15,000', total: '約150-300万円' },
];

const SCHOLARSHIPS = [
  '日本政府系：JASSO海外留学支援、文部科学省国費留学',
  '渡航先政府系：Fulbright（米）、Chevening（英）、Endeavour（豪）',
  '民間財団：トヨタ財団、伊藤国際教育交流財団、平和中島財団',
  '大学独自奨学金：トップ大学のFull Tuition Scholarship、TA/RA',
  '企業派遣：勤務先からのスポンサー（MBA中心）',
  '銀行・海外留学ローン：日本政策金融公庫、楽天Bank等',
];

const APPLICATION_TIMELINE = [
  { period: '出発15-18ヶ月前', activity: '出願校リスト作成、英語試験対策開始' },
  { period: '出発12ヶ月前', activity: 'IELTS/TOEFL受験、推薦状依頼' },
  { period: '出発9-10ヶ月前', activity: 'Essay/Personal Statement執筆、出願準備' },
  { period: '出発6-9ヶ月前', activity: '出願締切（11-1月が多）、結果待ち' },
  { period: '出発3-6ヶ月前', activity: '合格通知、奨学金応募、ビザ申請' },
  { period: '出発1-2ヶ月前', activity: '航空券・住居・保険手配、渡航準備' },
];

const AFTER_GRAD = [
  '米：OPT 1年（STEMは3年）＋H-1B抽選でGreen Card申請',
  '英：Graduate Visa（卒業後2年、修士は3年）就労可、Skilled Workerに移行',
  '豪：Subclass 485（卒業後2-4年就労）→雇用主スポンサーでPR',
  '加：PGWP（卒業後最大3年就労）→Express EntryでPR',
  '独：Job Seeker Visa（6ヶ月）→Blue CardでEU移動可',
  '帰国：外資系・グローバル企業で年収UP転職、起業',
];

const FAQS = [
  {
    question: 'いきなり大学院から海外留学できる？',
    answer:
      'できます。日本の大学卒業＋IELTS/TOEFL＋Personal Statementで海外大学院に直接出願可。修士1年（英・豪）or 2年（米・加）で学位取得＋海外就労経験＋ネットワーク構築。30代社会人のキャリアチェンジ手段としても人気。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      '学部はIELTS 6.5-7.5、院は7.0-7.5、トップMBAは7.5+。GMAT 650+（MBA）、GRE 320+（院理系）等の標準試験も必要。準備期間は通常12-18ヶ月、毎日2-3時間の集中学習が現実的。',
  },
  {
    question: '費用は最低どれくらい必要？',
    answer:
      'ドイツ等の学費無料国なら150-300万円（生活費中心）。英国修士1年で700-1,200万円、米国2年で1,300-2,700万円。奨学金活用＋アルバイト＋ローンで実現可能、JASSO等の日本政府系奨学金は年100-200万円返済不要のもある。',
  },
  {
    question: '社会人で行くべき？',
    answer:
      'キャリアチェンジ・グローバルキャリア構築には強力な選択肢。MBA・修士の社会人留学はキャリアアップ・年収UP事例多。ただし会社退職・1-2年のブランクをどう活かすか、明確な目標設定が成功の鍵。',
  },
  {
    question: '卒業後の就労ビザは？',
    answer:
      '主要国全てに「卒業後就労ビザ」あり。米OPT 1-3年、英Graduate Visa 2-3年、豪Subclass 485 2-4年、加PGWP 1-3年。在学中に現地就職活動→卒業後ビザで就労→PR申請の流れが王道です。',
  },
];

export default async function WhOverseasUniversityPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(大学|大学院|学位|MBA|修士|博士)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(大学|大学院|学位|MBA|修士|博士)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外大学・大学院進学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外大学・大学院進学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外大学・大学院進学完全ガイド｜出願・英語要件・費用・奨学金
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="海外大学・大学院進学を検討する方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              海外大学・大学院進学は、学位＋英語＋専門スキル＋海外就労経験＋PRルートを一気に手に入れる最強の選択肢。費用は高いが、年収UP・キャリアチェンジ・グローバル人材化の効果は絶大です。
              <br />
              この記事では学位種類、主要国、英語要件、費用、奨学金、出願プロセス、卒業後キャリアまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '修士1-2年で学位＋英語＋海外就労経験を一気に獲得',
              '費用は700-2,700万円、奨学金活用で半減可能',
              '卒業後就労ビザでPR取得ルートが王道',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-overseas" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ海外大学・大学院進学か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・学位＋英語＋専門スキル＋海外就労経験を一括取得</li>
              <li>・卒業後就労ビザ（OPT/Graduate Visa/PGWP）でPRルート確立</li>
              <li>・グローバル企業・外資系での年収大幅UP</li>
              <li>・国際的人脈構築（同窓ネットワーク）</li>
              <li>・キャリアチェンジ（30代社会人のやり直し）</li>
              <li>・トップ大学の卒業生としての一生の財産</li>
            </ul>
          </section>

          {/* 学位種類 */}
          <section id="degree-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">学位の種類と特徴</h2>
            <div className="space-y-3">
              {DEGREE_TYPES.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{d.type}</p>
                    <p className="text-sm font-bold text-amber-700">{d.cost}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 主要国 */}
          <section id="top-countries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要国・大学ランキング</h2>
            <div className="space-y-3">
              {TOP_COUNTRIES.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{c.country}</p>
                    <p className="text-sm font-bold text-amber-700">{c.cost}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 英語 */}
          <section id="english-requirements" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語要件（IELTS/TOEFL/GMAT/GRE）</h2>
            <div className="space-y-3">
              {ENGLISH_REQUIREMENTS.map((e, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-sm text-primary-700">{e.test}</p>
                    <p className="text-sm font-bold text-amber-700">{e.score}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{e.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="IELTS/TOEFL免除条件も合わせて"
            description="代替試験の活用、英語ゼロからの留学準備等も視野に。"
            primaryHref="/english-test-waiver"
            primaryLabel="IELTS/TOEFL免除条件"
            secondaryHref="/no-english"
            secondaryLabel="英語ゼロでも留学"
          />

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用シミュレーション</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">プログラム</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">学費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">生活費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">合計</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_SIMULATION.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.period}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.tuition}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.living}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 奨学金 */}
          <section id="scholarship" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">奨学金の探し方</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SCHOLARSHIPS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🎓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 出願 */}
          <section id="application" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">出願プロセス（12ヶ月計画）</h2>
            <div className="space-y-3">
              {APPLICATION_TIMELINE.map((a, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{a.period}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{a.activity}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 卒業後 */}
          <section id="after-graduation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">卒業後のキャリア・PR</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {AFTER_GRAD.map((a, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">→</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「大学・大学院・MBA・修士」関連の言及を集計。
                該当言及は <strong className="text-primary-700">{mentions.containsCount}件</strong>。
              </p>
              <p className="text-xs text-gray-500">
                ※ サンプル数が少ない場合は参考値として捉えてください。
              </p>
            </div>
            {sample && quoteText && (
              <QuoteFromExperience text={quoteText} experience={sample} truncated />
            )}
          </section>

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

          {/* 免責 */}
          <div className="mb-8 text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-4">
            ※ 学費・英語要件・ビザは2026年5月時点の情報です。最新情報は各大学公式情報、各国移民局、奨学金団体の公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/english-test-waiver" className="text-primary-600 hover:underline">→ IELTS/TOEFL免除条件</Link></li>
              <li><Link href="/scholarship-wh" className="text-primary-600 hover:underline">→ ワーホリ奨学金</Link></li>
              <li><Link href="/wh-tech-engineer" className="text-primary-600 hover:underline">→ 海外IT エンジニア</Link></li>
              <li><Link href="/wh-nurse" className="text-primary-600 hover:underline">→ 海外で看護師</Link></li>
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/30s-guide" className="text-primary-600 hover:underline">→ 30代からの留学</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
