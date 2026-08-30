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

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーストラリア ファームジョブ完全ガイド｜セカンドビザ対応・主要地域・収穫シーズン',
  description: 'オーストラリアのファームジョブ（農作業）でセカンドビザ取得を目指す方へ。88日就労条件、主要地域、収穫シーズンカレンダー、求人サイト、収入目安、実態を完全解説。',
  path: '/australia-farm-job',
  keywords: [
    'オーストラリア ファームジョブ',
    'セカンドワーホリ 農業',
    'ファームジョブ 88日',
    'オーストラリア フルーツピッキング',
    'セカンドビザ 条件',
    'オーストラリア 農業 求人',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: 'ファームジョブとは？セカンドビザの仕組み' },
  { id: 'regions', label: '主要地域と収穫シーズンカレンダー' },
  { id: 'job-types', label: '仕事内容と1日のスケジュール' },
  { id: 'income', label: '収入目安と支払い形態' },
  { id: 'find-job', label: '求人の探し方' },
  { id: 'tips', label: 'ファームジョブを成功させる7つのコツ' },
  { id: 'faq', label: 'よくある質問' },
];

const SEASONS = [
  { region: 'クイーンズランド州（Bundaberg/Cairns）', months: '通年（特に5〜11月）', crops: 'バナナ・マンゴー・トマト' },
  { region: 'ビクトリア州（Mildura/Shepparton）', months: '11〜4月', crops: 'ぶどう・オレンジ・桃' },
  { region: '西オーストラリア州（Margaret River）', months: '12〜4月', crops: 'ぶどう・ベリー' },
  { region: 'タスマニア州（Hobart周辺）', months: '11〜4月', crops: 'チェリー・りんご・ベリー' },
  { region: 'NSW州（Griffith）', months: '通年', crops: 'みかん・ぶどう・玉ねぎ' },
];

const TIPS = [
  '指定地域（postcode指定）で働いていることを必ず確認',
  'Pay slip（給与明細）・Tax File Number（TFN）の記録を残す',
  '88日達成日を計算してビザ申請に間に合わせる',
  '雇用主に「Form 1263」（セカンドビザ申請用）を発行してもらう',
  '時給制 vs 出来高制：自信があれば出来高制、初心者は時給制',
  'ファームステイ（住み込み）で住居費を抑える',
  '体力的にきついので、出発前から軽い運動で体力作り',
];

const FAQS = [
  {
    question: 'セカンドビザの88日条件とは？',
    answer:
      'オーストラリアの指定地域（人口少ない郊外）で「Specified Work」を88日以上行うこと。ファームワーク（農業）が最も一般的ですが、漁業・建設業・観光業も対象。「Form 1263」を雇用主に書いてもらう必要があります。',
  },
  {
    question: 'サードビザもありますか？',
    answer:
      'はい。セカンドビザ取得後にさらに179日（約6ヶ月）の指定地域就労で、サードビザ（3年目）申請可能。合計3年間オーストラリアに滞在できます。',
  },
  {
    question: 'ファームジョブはきつい？',
    answer:
      '体力的にきつい仕事は事実。10時間労働も珍しくなく、屋外で日焼け・虫刺されも。一方、出来高制で稼げる人は週AUD 1,500〜2,000（約16〜22万円）も可能。88日達成のための「お試し体験」として捉える人が多数。',
  },
  {
    question: 'ファームジョブで何が稼げる？',
    answer:
      '時給制ならAUD 24.10〜27（約2,600〜2,900円）、出来高制ならAUD 1,200〜2,000/週（約13〜22万円）が目安。経験・作物・地域による差大。',
  },
  {
    question: '英語ゼロでもファームジョブはできる？',
    answer:
      '可能です。日本人が多い職場も多く、英語ほぼ不要。むしろ韓国人・台湾人・ヨーロッパ系との交流で英語を伸ばせる場面も。88日達成を最優先するなら、日本人多めの安定したファームを選ぶのも戦略。',
  },
];

export default function AustraliaFarmJobPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーストラリア ファームジョブ完全ガイド', url: '/australia-farm-job' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーストラリア ファームジョブ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーストラリア ファームジョブ完全ガイド｜セカンドビザ取得への近道
            </h1>
            <ArticleMetaBadge
              readingMinutes={8}
              updatedAt="2026年5月"
              targetAudience="豪州ワーホリ・セカンドビザ志望の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              オーストラリアのファームジョブは、セカンドビザ（2年目）取得のための定番ルート。
              <br />
              この記事では、88日就労条件の詳細、主要地域と収穫シーズン、収入目安、求人の探し方まで実例ベースで解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'セカンドビザの88日就労条件と「指定地域」の確認方法',
              '州別の収穫シーズンカレンダーと作物',
              '時給制 vs 出来高制の収入差と実態',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 概要 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ファームジョブとは？セカンドビザの仕組み</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              ファームジョブとは、オーストラリアの農場（フルーツ農園・野菜畑など）で行う収穫・梱包作業のこと。
              ワーキングホリデー1年目の方が、2年目のセカンドビザを取得するための「指定業務」として、最も人気の選択肢です。
            </p>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
              <p className="text-sm text-sky-900 leading-relaxed">
                <strong>💡 セカンドビザの条件</strong>: 指定地域（人口少ない郊外）で88日以上の「Specified Work」就労。これを達成すると、現在のビザ満了後に2年目のワーホリビザを申請可能。
              </p>
            </div>
          </section>

          {/* 主要地域 */}
          <section id="regions" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要地域と収穫シーズンカレンダー</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              州・地域で収穫時期と作物が大きく違います。出発予定時期に合わせて行先を選びましょう。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">地域</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">シーズン</th>
                    <th className="px-4 py-3 font-semibold">主な作物</th>
                  </tr>
                </thead>
                <tbody>
                  {SEASONS.map((s, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium">{s.region}</td>
                      <td className="px-4 py-3 text-gray-700">{s.months}</td>
                      <td className="px-4 py-3 text-gray-700">{s.crops}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="オーストラリアの仕事探し総合情報"
            description="ファーム以外の仕事も視野に入れたい方は、オーストラリアの仕事探し方完全ガイドへ。"
            primaryHref="/australia-jobs"
            primaryLabel="オーストラリア仕事探し方"
            secondaryHref="/countries/australia"
            secondaryLabel="オーストラリア国別ガイド"
          />

          {/* 仕事内容 */}
          <section id="job-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">仕事内容と1日のスケジュール</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              典型的なファームジョブは「収穫（ピッキング）」「梱包（パッキング）」「選別」の3種類。1日の流れの例を紹介します。
            </p>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {[
                { time: '05:00', activity: '起床・朝食' },
                { time: '06:00', activity: 'ファーム到着・準備' },
                { time: '06:30〜12:00', activity: '収穫作業（休憩30分含む）' },
                { time: '12:00〜13:00', activity: 'ランチ休憩' },
                { time: '13:00〜16:00', activity: '午後の収穫 or 梱包作業' },
                { time: '16:00〜17:00', activity: '片付け・帰宅' },
                { time: '18:00以降', activity: '夕食・自由時間' },
              ].map((s) => (
                <div key={s.time} className="flex items-start gap-4 p-4">
                  <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded whitespace-nowrap shrink-0">
                    {s.time}
                  </span>
                  <p className="text-sm text-gray-800">{s.activity}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 収入 */}
          <section id="income" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">収入目安と支払い形態</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-base">時給制（Hourly Rate）</h3>
                <p className="text-2xl font-bold text-primary-700 mb-2">AUD 24.10〜27</p>
                <p className="text-sm text-gray-700">最低賃金保証。週収はAUD 800〜1,200程度。初心者・安定派向け。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-base">出来高制（Piece Rate）</h3>
                <p className="text-2xl font-bold text-primary-700 mb-2">AUD 1,200〜2,000/週</p>
                <p className="text-sm text-gray-700">収穫量に応じた報酬。慣れれば高収入だが、初心者は時給制より低くなる場合あり。</p>
              </div>
            </div>
          </section>

          {/* 求人 */}
          <section id="find-job" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">求人の探し方</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・<strong>Harvest Trail</strong>（harvesttrail.gov.au）— 政府公式のファーム求人</li>
              <li>・<strong>Gumtree</strong>（gumtree.com.au）— ファーム・住み込みの求人多数</li>
              <li>・<strong>Backpacker Job Board</strong>（backpackerjobboard.com.au）— ワーホリ向け専門</li>
              <li>・<strong>日豪プレス・JAMS.TV</strong> — 日本語のファーム情報</li>
              <li>・<strong>現地のホステル掲示板</strong> — オーナーが地元ファームの斡旋している場合多数</li>
            </ul>
          </section>

          {/* コツ */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ファームジョブを成功させる7つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
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

          <p className="text-xs text-gray-500 mb-8">
            ※ 本記事は2026年5月時点の情報です。最新のビザ条件は<Link href="https://immi.homeaffairs.gov.au/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">オーストラリア移民局公式サイト</Link>でご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/australia-jobs" className="text-primary-600 hover:underline">
                  → オーストラリア仕事探し方ガイド
                </Link>
              </li>
              <li>
                <Link href="/countries/australia" className="text-primary-600 hover:underline">
                  → オーストラリア国別完全ガイド
                </Link>
              </li>
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
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語話せなくてもワーホリできる？
                </Link>
              </li>
              <li>
                <Link href="/wise-payment-guide" className="text-primary-600 hover:underline">
                  → 送金・両替・クレカガイド
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
