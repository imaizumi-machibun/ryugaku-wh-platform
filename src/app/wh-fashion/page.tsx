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

const PAGE_PATH = '/wh-fashion';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ファッション留学完全ガイド｜パリ・ミラノ・NY・ロンドンの名門校',
  description: 'ファッション留学の完全ガイド。パリ・ミラノ・NY・ロンドンの名門校、デザイン・ビジネス・スタイリング等の職種、ポートフォリオ、就職・ブランドキャリアまで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'ファッション留学',
    'パリ ファッション',
    'ミラノ ファッション学校',
    'ファッションデザイナー 海外',
    'ファッションビジネス 留学',
    'スタイリスト 留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-fashion', label: 'なぜ海外ファッション留学か' },
  { id: 'top-schools', label: '世界4大ファッション都市の名門校' },
  { id: 'majors', label: '専攻・職種別の選択肢' },
  { id: 'portfolio', label: 'ポートフォリオ作成の鉄則' },
  { id: 'cost', label: '費用シミュレーション' },
  { id: 'career', label: '卒業後のキャリア・ブランド就職' },
  { id: 'tips', label: '成功する5つのコツ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TOP_SCHOOLS = [
  {
    city: 'パリ',
    schools: 'ESMOD、Institut Français de la Mode、Studio Berçot',
    feature: 'オートクチュールの本場、ラグジュアリーブランド就職',
    cost: '年€12,000-30,000',
  },
  {
    city: 'ミラノ',
    schools: 'Istituto Marangoni、Polimoda、NABA',
    feature: 'メイド・イン・イタリー、職人技＋ビジネス',
    cost: '年€18,000-35,000',
  },
  {
    city: 'ニューヨーク',
    schools: 'Parsons、FIT、Pratt Institute',
    feature: 'アメリカンファッション、ビジネス＋デザイン',
    cost: '年$50,000-75,000',
  },
  {
    city: 'ロンドン',
    schools: 'Central Saint Martins、London College of Fashion',
    feature: '前衛的・クリエイティブ、世界的デザイナー輩出',
    cost: '年£25,000-40,000',
  },
];

const MAJORS = [
  { major: 'ファッションデザイン', detail: '服のデザイン・パターン・縫製、ブランド設立も' },
  { major: 'ファッションビジネス', detail: 'マーケティング・MD・バイイング・ブランド戦略' },
  { major: 'スタイリング', detail: '雑誌・広告・セレブのスタイリング' },
  { major: 'テキスタイルデザイン', detail: '生地・素材・パターンデザイン' },
  { major: 'ファッションジャーナリズム', detail: 'ファッション雑誌・編集・PR' },
  { major: 'アクセサリー・シューズデザイン', detail: 'バッグ・靴・ジュエリー専門' },
];

const PORTFOLIO_RULES = [
  'デザイン画・スケッチ・完成作品の3点セット',
  'コンセプト＋制作プロセスを明確に',
  '15-25点厳選、トレンド感＋独自性',
  '英文（or 仏・伊語）ステートメント必須',
  'デジタルポートフォリオ＋実物の両方',
  'ファッションショー・撮影作品があれば加点',
  '応募校の傾向に合わせてカスタマイズ',
];

const COST_SIMULATION = [
  { program: 'パリESMOD 3年', tuition: '€36,000-50,000', living: '€36,000-54,000', total: '約1,200-1,700万円' },
  { program: 'ミラノMarangoni 3年', tuition: '€54,000-70,000', living: '€36,000-54,000', total: '約1,500-2,000万円' },
  { program: 'NY Parsons 4年', tuition: '$240,000-300,000', living: '$120,000-200,000', total: '約5,400-7,800万円' },
  { program: '英CSM 3年', tuition: '£75,000-90,000', living: '£45,000-60,000', total: '約2,400-2,900万円' },
];

const CAREER = [
  'ファッションデザイナー（ブランド・自社）',
  'パタンナー・縫製技術者',
  'ファッションバイヤー・MD',
  'スタイリスト（雑誌・広告・セレブ）',
  'ブランドPR・マーケティング',
  'ファッションジャーナリスト・編集者',
  '自分のブランド立ち上げ・起業',
];

const TIPS = [
  '出発前に基本的なデザイン・縫製スキル習得',
  'ポートフォリオの質を最大限高める',
  '英語＋（仏・伊）の語学準備',
  'ファッション都市のインターン・人脈構築',
  'SNS（Instagram）で作品発信、ブランディング',
];

const FAQS = [
  {
    question: 'ファッション未経験でも留学できる？',
    answer:
      '可能。多くのファッション校は基礎コースから始められ、未経験者向けカリキュラムあり。ただしポートフォリオ（デザイン画・作品）の提出が必要な校が多いため、出発前に独学＋スクールで基礎制作スキルを身につけておくと有利。',
  },
  {
    question: 'パリ・ミラノ・NY・ロンドン、どこ？',
    answer:
      'パリ：オートクチュール・ラグジュアリー、ミラノ：メイド・イン・イタリー職人技、NY：ビジネス＋アメリカンファッション、ロンドン：前衛的・クリエイティブ。志向するファッション分野と都市の特性で選択。複数都市を経験するデザイナーも多い。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      'IELTS 6.0-6.5が目安。パリ・ミラノは仏語・伊語コースもあるが、英語コースが主流。実技中心だが、コンセプト発表・批評・ビジネス授業で英語必須。「ファッション＋言語＋ビジネス」の総合力が問われる。',
  },
  {
    question: 'ブランド就職は可能？',
    answer:
      '名門校卒業生はラグジュアリーブランド（LVMH、Kering系等）への就職実績多。在学中のインターン＋卒業作品＋人脈が鍵。新卒は競争激しいが、デザイン・パターン・ビジネス・PR等の幅広い職種で世界中のブランドへの道あり。',
  },
  {
    question: '卒業後に食べていける？',
    answer:
      'デザイナーは競争激しいが、パタンナー・バイヤー・PR・スタイリスト等の専門職は安定需要。「ファッション＋ビジネス」「ファッション＋デジタル（EC・SNS）」の組み合わせが現代の成功パターン。自ブランド立ち上げ＋SNS発信で個人ブランド化する道も。',
  },
];

export default async function WhFashionPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(ファッション|デザイン|fashion|アパレル|スタイリスト)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(ファッション|デザイン|fashion|アパレル|スタイリスト)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ファッション留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ファッション留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ファッション留学完全ガイド｜パリ・ミラノ・NY・ロンドンの名門校
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="ファッション業界でグローバルキャリアを目指す方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ファッション留学は、世界4大ファッション都市（パリ・ミラノ・NY・ロンドン）で本場のデザイン・ビジネスを学び、グローバルブランドへの就職を狙える選択肢。
              <br />
              この記事では名門校、専攻・職種、ポートフォリオ、費用、卒業後キャリアまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '世界4大都市：パリ・ミラノ・NY・ロンドンが本場',
              'デザイン・ビジネス・スタイリング等の多様な専攻',
              'ポートフォリオの質が合否を分ける',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-fashion" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ海外ファッション留学か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・世界4大ファッション都市での本場の学び</li>
              <li>・ラグジュアリーブランドへの就職実績</li>
              <li>・グローバルファッション人脈の構築</li>
              <li>・最新トレンド・技術の習得</li>
              <li>・在学中のインターン・コレクション参加</li>
              <li>・自分のブランド立ち上げの基盤</li>
            </ul>
          </section>

          {/* 主要校 */}
          <section id="top-schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">世界4大ファッション都市の名門校</h2>
            <div className="space-y-3">
              {TOP_SCHOOLS.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{s.city}</p>
                    <p className="text-sm font-bold text-amber-700">{s.cost}</p>
                  </div>
                  <p className="text-sm text-gray-800 mb-1"><strong>主な学校:</strong> {s.schools}</p>
                  <p className="text-xs text-gray-500">{s.feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 専攻 */}
          <section id="majors" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">専攻・職種別の選択肢</h2>
            <div className="space-y-3">
              {MAJORS.map((m, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{m.major}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{m.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ポートフォリオ */}
          <section id="portfolio" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ポートフォリオ作成の鉄則</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PORTFOLIO_RULES.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="アート・大学進学など他専門留学も合わせて"
            description="ファッション以外のクリエイティブ留学、海外大学進学全般も視野に。"
            primaryHref="/wh-art-design"
            primaryLabel="アート・デザイン留学"
            secondaryHref="/paris-livecost"
            secondaryLabel="パリ生活費"
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
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.program}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.tuition}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.living}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* キャリア */}
          <section id="career" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">卒業後のキャリア・ブランド就職</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {CAREER.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">👗</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* コツ */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">成功する5つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「ファッション・デザイン・アパレル」関連の言及を集計。
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
            ※ 学費・入学要件は2026年5月時点の情報です。最新情報は各校公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-art-design" className="text-primary-600 hover:underline">→ アート・デザイン留学</Link></li>
              <li><Link href="/wh-music" className="text-primary-600 hover:underline">→ 音楽留学</Link></li>
              <li><Link href="/wh-overseas-university" className="text-primary-600 hover:underline">→ 海外大学・大学院進学</Link></li>
              <li><Link href="/paris-livecost" className="text-primary-600 hover:underline">→ パリ生活費</Link></li>
              <li><Link href="/uk-london-cost" className="text-primary-600 hover:underline">→ ロンドン生活費</Link></li>
              <li><Link href="/scholarship-wh" className="text-primary-600 hover:underline">→ ワーホリ奨学金</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
