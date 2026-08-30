import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { getExperiences } from '@/lib/microcms/experiences';
import { getDepartureMonthDistribution } from '@/lib/stats/experiences-cross';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ 出発時期おすすめ月｜北半球・南半球別の最適タイミング【2026年版】',
  description: 'ワーキングホリデーの出発はいつがベスト？北半球（カナダ・アイルランド）と南半球（オーストラリア・NZ）の季節差、月別メリットデメリット、就職しやすい時期を実渡航者の体験談データで解説。',
  path: '/departure-timing',
  keywords: [
    'ワーホリ 出発 時期',
    'ワーホリ 何月 出発',
    'ワーホリ 出発 おすすめ 時期',
    '1月 出発 ワーホリ',
    '夏 オーストラリア ワーホリ',
    'カナダ ワーホリ 冬',
    'ワーホリ 渡航 時期',
  ],
});

const TOC_HEADINGS = [
  { id: 'two-hemispheres', label: '北半球と南半球で「ベスト出発月」は逆になる' },
  { id: 'season-by-country', label: '主要国別おすすめ出発時期' },
  { id: 'monthly', label: '月別メリット・デメリット早見表' },
  { id: 'data', label: '体験談から見る実際の出発月分布' },
  { id: 'faq', label: 'よくある質問' },
];

const COUNTRY_TIMINGS = [
  {
    country: '🇦🇺 オーストラリア',
    bestMonths: '9〜11月（春〜夏前）',
    reason: '夏に向けて観光業の求人が増える時期。気候も穏やかで生活立ち上げに最適',
    avoidMonths: '5〜7月（南半球の冬、ファーム求人減）',
  },
  {
    country: '🇨🇦 カナダ',
    bestMonths: '3〜5月（春）',
    reason: '冬の厳しさを避けて、夏の観光シーズン就活に間に合う。語学学校の生徒も多い',
    avoidMonths: '11〜2月（厳冬で生活立ち上げが大変）',
  },
  {
    country: '🇳🇿 ニュージーランド',
    bestMonths: '9〜11月（春）',
    reason: '南半球で豪と同じパターン。フルーツピッキングシーズンの開始と重なる',
    avoidMonths: '5〜8月（冬季、観光業オフ）',
  },
  {
    country: '🇮🇪 アイルランド',
    bestMonths: '4〜6月（春〜初夏）',
    reason: '日照時間が長く気候が良い時期。学生向けの観光業求人も増える',
    avoidMonths: '11〜2月（暗くて寒く、メンタル負担大）',
  },
  {
    country: '🇬🇧 イギリス',
    bestMonths: '4〜6月（春〜初夏）',
    reason: 'アイルランドと同じ理由。クリスマス前後の繁忙期に向けた就活も可',
    avoidMonths: '12〜2月',
  },
  {
    country: '🇵🇭 フィリピン',
    bestMonths: '11〜2月（乾季）',
    reason: '雨期を避けると体調管理が楽。語学学校のターム開始と重なる',
    avoidMonths: '6〜10月（雨期、台風シーズン）',
  },
];

const MONTHLY_TIMINGS = [
  { month: 1, pros: ['年明けで気持ちのリセット', 'カナダ・北米の語学学校の冬学期スタート'], cons: ['日本では確定申告と重なる', 'カナダは厳寒'] },
  { month: 2, pros: ['桜の前に出発できる', '年度切替前で退職タイミングと合う'], cons: ['カナダ・欧州は寒さのピーク'] },
  { month: 3, pros: ['年度末退職と相性◎', 'カナダで春の到来直前に到着できる'], cons: ['航空券が高騰（卒業旅行シーズン）'] },
  { month: 4, pros: ['カナダ・欧州の春到来', '気候が安定して生活立ち上げが楽'], cons: ['南半球は秋に入る'] },
  { month: 5, pros: ['航空券が比較的安い', '気候が世界的に穏やか'], cons: ['南半球の冬入り'] },
  { month: 6, pros: ['北半球の夏に間に合う', '欧州の観光業ピーク前'], cons: ['日本の梅雨と重なり荷造りが大変'] },
  { month: 7, pros: ['北半球の真夏で気候良好', 'ファミリーリゾート求人多い'], cons: ['航空券が夏休み価格', '南半球は真冬'] },
  { month: 8, pros: ['夏休み利用の短期渡航と相性'], cons: ['お盆で航空券高騰', '南半球は寒さ続く'] },
  { month: 9, pros: ['南半球（豪・NZ）の春到来', 'シルバーウィーク利用可'], cons: ['北半球は秋深まり'] },
  { month: 10, pros: ['南半球はベストシーズン', '航空券が落ち着く'], cons: ['北半球は寒くなり始める'] },
  { month: 11, pros: ['南半球の夏直前で求人増', 'フィリピンの乾季開始'], cons: ['年末年始の航空券高騰前'] },
  { month: 12, pros: ['南半球はクリスマス＋夏休みで求人ピーク'], cons: ['航空券・宿が世界的に最高値', '北半球は厳寒'] },
];

const FAQS = [
  {
    question: '結局、何月に出発するのが一番おすすめ？',
    answer:
      '渡航先によって全く違います。オーストラリア・NZは9〜11月（南半球の春〜夏前）、カナダ・欧州は4〜6月（北半球の春〜初夏）がベスト。生活立ち上げのしやすさと求人の多さから、上記の時期が支持されています。',
  },
  {
    question: '航空券が一番安いのは何月？',
    answer:
      '日本発の航空券が安いのは5月・11月。ゴールデンウィーク後と年末年始前の閑散期です。逆に高いのは8月（お盆）と12月後半〜1月初旬（年末年始）。3〜4月の卒業旅行シーズンも高めです。',
  },
  {
    question: '冬に渡航すると本当に大変ですか？',
    answer:
      '北半球（カナダ・欧州）の冬出発は、生活の立ち上げが2倍大変です。日照時間が短く外出が億劫になりがちで、メンタルにも影響します。住居探しも雪の中で行うことになります。可能なら避けるのが無難。',
  },
  {
    question: '退職時期との兼ね合いはどう考えればいい？',
    answer:
      '日本企業の3月末退職は、北半球（カナダ・欧州）出発と相性が良いです。退職→ビザ申請→出発の3〜4ヶ月準備で、5〜7月渡航のスケジュールが組めます。南半球希望なら、9月末退職→11〜12月出発が定番。',
  },
  {
    question: '航空券はいつ買うべき？',
    answer:
      '出発の3〜4ヶ月前が最安値帯。6ヶ月以上前は割高、1ヶ月以内は急騰します。Skyscanner・Googleフライトで価格アラートを設定し、運賃が下がったタイミングで購入するのがコツです。',
  },
];

const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export default async function DepartureTimingPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const distribution = getDepartureMonthDistribution(experiencesData.contents);
  const maxCount = Math.max(...distribution.monthly.map((m) => m.count), 1);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ 出発時期おすすめ月', url: '/departure-timing' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ 出発時期おすすめ月' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリの出発時期はいつがベスト？北半球・南半球別の最適タイミング
            </h1>
            <ArticleMetaBadge
              readingMinutes={7}
              updatedAt="2026年5月"
              targetAudience="出発時期を決めかねている方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「ワーホリって、いつ出発すれば一番得？」
              <br />
              結論から言うと、北半球と南半球で「ベスト出発月」は真逆になります。
              <br />
              この記事では、主要国別のおすすめ時期、月別のメリット・デメリット、実際の渡航者がいつ出発しているかのデータをまとめました。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '北半球（カナダ・欧州）は4〜6月、南半球（豪・NZ）は9〜11月がベスト',
              '航空券が安いのは5月と11月、避けたいのは8月と12〜1月',
              '退職タイミングと渡航時期を逆算して決めるのがコツ',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 2半球の違い */}
          <section id="two-hemispheres" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">北半球と南半球で「ベスト出発月」は逆になる</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              地球の半分は北半球（日本・カナダ・欧州）、半分は南半球（豪・NZ）。
              出発月は「現地の春〜初夏」を選ぶのが鉄則です。
              新生活の立ち上げ・気候・観光業求人の3点が、春〜初夏に好条件になります。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-sky-900">🌸 北半球（カナダ・欧州）</h3>
                <p className="text-sm text-sky-900 mb-2">
                  <strong>ベスト出発: 4〜6月</strong>
                </p>
                <p className="text-xs text-sky-800">
                  日照時間が長く気候が穏やか。夏に向けて観光業の求人が増え、生活立ち上げもスムーズ。
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-amber-900">☀️ 南半球（オーストラリア・NZ）</h3>
                <p className="text-sm text-amber-900 mb-2">
                  <strong>ベスト出発: 9〜11月</strong>
                </p>
                <p className="text-xs text-amber-800">
                  現地の春〜夏前。ビーチリゾート・観光業の求人ピーク前で就職しやすい。
                </p>
              </div>
            </div>
          </section>

          {/* 国別タイミング */}
          <section id="season-by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要国別おすすめ出発時期</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              人気6カ国の最適タイミングと避けたい時期をまとめました。
            </p>
            <div className="space-y-3">
              {COUNTRY_TIMINGS.map((c) => (
                <div key={c.country} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-3 text-base sm:text-lg">{c.country}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="font-bold text-emerald-900 mb-1">⭕ ベスト時期</p>
                      <p className="text-emerald-900 font-semibold">{c.bestMonths}</p>
                      <p className="text-xs text-emerald-800 mt-1">{c.reason}</p>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-3">
                      <p className="font-bold text-rose-900 mb-1">⚠️ 避けたい時期</p>
                      <p className="text-rose-900 font-semibold">{c.avoidMonths}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="自分に合う国がまだ決まらない方へ"
            description="目的・期間・予算・治安の5問診断で、9カ国の中から相性スコア付きで提案します。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/compare/countries"
            secondaryLabel="国別比較ランキング"
          />

          {/* 月別早見表 */}
          <section id="monthly" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月別メリット・デメリット早見表</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              退職タイミングや航空券価格から「この月に出発できそう」と決めるとき、メリットと注意点をチェックしておきましょう。
            </p>
            <div className="space-y-2">
              {MONTHLY_TIMINGS.map((m) => (
                <details key={m.month} className="bg-white border border-gray-200 rounded-xl p-4 group">
                  <summary className="cursor-pointer list-none flex items-center justify-between">
                    <span className="font-bold text-base">{MONTH_LABELS[m.month - 1]}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-emerald-50 rounded p-3">
                      <p className="font-bold text-emerald-900 mb-1 text-xs">⭕ メリット</p>
                      <ul className="text-emerald-900 text-xs space-y-1">
                        {m.pros.map((p, i) => (
                          <li key={i}>・{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-rose-50 rounded p-3">
                      <p className="font-bold text-rose-900 mb-1 text-xs">⚠️ デメリット</p>
                      <ul className="text-rose-900 text-xs space-y-1">
                        {m.cons.map((c, i) => (
                          <li key={i}>・{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* 実際の出発月分布 */}
          <section id="data" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見る実際の出発月分布</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              当サイトに登録されている体験談 <strong>{distribution.total}件</strong> から、投稿時期（出発時期に近い）の月別分布を集計しました。
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-3">
              <div className="space-y-2">
                {distribution.monthly.map((m) => (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="w-8 text-xs text-gray-600 font-medium">{m.month}月</span>
                    <div className="flex-1 bg-white border border-gray-200 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${(m.count / maxCount) * 100}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="w-12 text-xs text-gray-700 text-right">{m.count}件</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              ※ 出発月の厳密なデータがないため、体験談の投稿月をプロキシ（代用指標）として表示しています。実際の出発月とは数ヶ月のズレがある可能性があります（参考値）。
            </p>
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

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/packing" className="text-primary-600 hover:underline">
                  → ワーホリ持ち物チェックリスト
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合う国
                </Link>
              </li>
              <li>
                <Link href="/age/20s-late" className="text-primary-600 hover:underline">
                  → 社会人ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための7つの教訓
                </Link>
              </li>
              <li>
                <Link href="/wise-payment-guide" className="text-primary-600 hover:underline">
                  → 送金・両替・クレカ完全ガイド
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
