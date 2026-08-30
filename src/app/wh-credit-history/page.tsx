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

const PAGE_PATH = '/wh-credit-history';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外クレジットヒストリー構築完全ガイド｜PR申請・住宅ローン・現地クレカ',
  description: '長期海外滞在・PR申請を目指すなら現地クレジットヒストリーが必須。現地クレカ作成戦略、スコア管理、構築までの最短ルート、よくある失敗を完全解説。',
  path: PAGE_PATH,
  keywords: [
    '海外 クレジットスコア',
    'カナダ クレジット スコア',
    '海外 クレジットカード 作る',
    'クレヒス 構築 海外',
    'PR 申請 クレヒス',
    '海外 ローン',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-needed', label: 'なぜ海外クレヒスが必要か' },
  { id: 'scoring-systems', label: '国別スコアリングシステム' },
  { id: 'how-to-build', label: 'クレヒス構築5ステップ' },
  { id: 'how-to-get-card', label: '初心者でも作れるクレカ' },
  { id: 'spending-rules', label: 'スコアUPのための支払いルール' },
  { id: 'common-mistakes', label: 'よくある失敗と対処' },
  { id: 'timeline', label: '構築までの一般的な期間' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const SCORING_SYSTEMS = [
  {
    country: 'カナダ',
    system: 'Equifax / TransUnion（300-900スコア）',
    detail: '650以上で良好、750以上で優良',
    needed: 'PR申請後の住宅ローン・大口クレカに必要',
  },
  {
    country: 'オーストラリア',
    system: 'Equifax / Illion / Experian（0-1200）',
    detail: '622以上で平均的、834以上で優秀',
    needed: 'PR後の住宅・車ローン・大手クレカに必要',
  },
  {
    country: 'アメリカ',
    system: 'FICO Score（300-850）',
    detail: '670以上で良好、740以上で優秀',
    needed: '住宅ローン・賃貸契約・大手クレカ・携帯契約',
  },
  {
    country: 'イギリス',
    system: 'Experian / Equifax / TransUnion（独自スコア）',
    detail: 'Experian 881以上で良好',
    needed: '住宅ローン・大手クレカ・賃貸契約に必要',
  },
];

const BUILD_STEPS = [
  { step: 1, title: 'SIN/TFN/IRD取得（基盤）', detail: 'まず納税者番号取得、これがないとクレジット申請できない' },
  { step: 2, title: '現地銀行口座開設', detail: '主要銀行で口座開設、即発行のデビットカード使用開始' },
  { step: 3, title: 'Secured Credit Card（担保付）取得', detail: '初心者向け、デポジット$200-500で発行、6ヶ月でアンセキュア化' },
  { step: 4, title: '低限度額の標準クレカ取得', detail: '6-12ヶ月後、銀行系の標準クレカに申請（限度額CAD/AUD 500-1,000）' },
  { step: 5, title: '長期使用＋全額完済維持', detail: '毎月の利用＋全額完済、12-24ヶ月で良好スコアに' },
];

const STARTER_CARDS_CANADA = [
  { card: 'RBC Visa Classic Low Rate', detail: '初心者向け、銀行口座とセット申請、年会費CAD 20' },
  { card: 'TD Cash Back Visa', detail: 'TD銀行口座保持者向け、年会費無料コース有り' },
  { card: 'Capital One Secured Mastercard', detail: '担保付、CAD 75デポジット、信用なくても申請可' },
  { card: 'Home Trust Secured Visa', detail: '担保付、信用構築のスタンダード、年会費CAD 59' },
];

const STARTER_CARDS_AUSTRALIA = [
  { card: 'CommBank Awards Credit Card', detail: '銀行口座保持者向け、限度額AUD 1,000-2,000' },
  { card: 'ANZ First Credit Card', detail: '若年層・学生向け、年会費低め' },
  { card: 'Coles No Annual Fee Mastercard', detail: '年会費無料、限度額AUD 1,500-3,000' },
  { card: 'Westpac Low Rate Card', detail: '銀行口座保持者向け、初心者対象' },
];

const SPENDING_RULES = [
  '毎月の利用額は限度額の30%以下に抑える（重要）',
  '必ず全額完済、リボ払いNG',
  '支払い遅延ゼロ、自動引落設定',
  '複数カード申請を短期間で避ける（スコア低下）',
  'クレジットレポート定期確認（年1回無料）',
  '利用するカードを6ヶ月以上保有',
  'カード解約は信用記録に影響、慎重に',
];

const COMMON_MISTAKES = [
  '到着即時に大手クレカ申請→却下→スコア低下',
  '複数カード短期間申請→Hard Inquiry多発でスコア低下',
  '限度額の80%以上使用→スコア大幅低下',
  '1ヶ月でも支払い遅延→7年間記録残る',
  '帰国後カード解約忘れ→年会費請求＋信用記録悪化',
  '小切手・電気水道料金の未払い→クレヒスに反映',
];

const TIMELINE = [
  { period: '0-3ヶ月', activity: 'SIN/TFN取得→銀行口座開設→Secured Card申請', score: '記録なし' },
  { period: '3-6ヶ月', activity: 'Secured Card使用＋完済維持', score: '初期スコア構築（500-600）' },
  { period: '6-12ヶ月', activity: '標準クレカに申請＋複数カード使用開始', score: '600-650（標準レベル）' },
  { period: '12-24ヶ月', activity: '長期利用＋多様な信用取引', score: '650-720（良好レベル）' },
  { period: '24ヶ月以降', activity: '住宅・車ローン申請可能なスコアに', score: '720+（優秀レベル）' },
];

const FAQS = [
  {
    question: 'ワーホリ1年だけでも構築すべき？',
    answer:
      'PR目標 or 再渡航予定なら構築すべき。1年ではスコア構築初期段階（500-600）止まりだが、ゼロからのスタートよりは遥かに有利。将来のPR申請・賃貸契約・大手クレカ取得が大幅に楽になります。短期滞在のみで再渡航予定なしなら、構築不要。',
  },
  {
    question: '日本のクレヒスは海外で使える？',
    answer:
      '使えません。クレジットスコアは国別に管理されており、日本→海外への持ち越し不可。海外渡航時はクレヒスゼロからのスタート。例外として、HSBC等のグローバル銀行で「海外連携クレジット」を作る方法は一部あり。',
  },
  {
    question: 'Secured Credit Cardって何？',
    answer:
      '担保（デポジット）を入れることで発行されるクレカ。例：CAD 500デポジット→限度額CAD 500のカード発行。信用がなくても申請可、6-12ヶ月の利用実績作りに使われます。アンセキュア化（デポジット返却＋通常カード化）も可能。',
  },
  {
    question: 'スコア何点あればPR申請に有利？',
    answer:
      'PR申請自体にスコアは直接関係ありませんが、PR取得後の住宅ローン・賃貸契約で必要。カナダで650以上、豪で622以上が「平均的」、住宅ローンには750以上が望ましい。長期滞在予定なら、ワーホリ中から計画的に構築を。',
  },
  {
    question: '帰国後はどうする？',
    answer:
      'カード解約しないで休眠状態に。年会費無料カードは数年放置でもOK、信用記録は維持される。再渡航時にすぐ大手クレカ申請可。年会費発生カードは解約OKだが、メインカードのみ残すと再渡航時にスムーズ。',
  },
];

export default async function WhCreditHistoryPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(クレジット|クレカ|信用|ローン|PR|住宅)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(クレジット|クレカ|信用|ローン|PR|住宅)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外クレジットヒストリー構築完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外クレジットヒストリー構築完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外クレジットヒストリー構築完全ガイド｜PR申請・住宅ローン・現地クレカ
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="長期海外滞在・PR申請目指す方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              海外で長期滞在・PR申請・住宅ローンを目指すなら、現地クレジットヒストリー（信用記録）の構築が不可欠。日本のクレヒスは海外で使えず、ゼロからのスタートになります。
              <br />
              この記事では国別スコアシステム、構築5ステップ、初心者向けクレカ、支払いルール、よくある失敗まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '日本のクレヒスは海外で使えない、ゼロからの構築必須',
              'Secured Credit Card→標準クレカ→長期使用の3段階',
              '良好スコア（650+）まで12-24ヶ月、計画的構築を',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ必要 */}
          <section id="why-needed" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ海外クレヒスが必要か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・PR取得後の住宅ローン申請（基本650+必須）</li>
              <li>・賃貸物件契約（米・豪で特に厳格）</li>
              <li>・大手クレジットカード申請</li>
              <li>・携帯電話契約（デポジット回避）</li>
              <li>・自動車ローン申請</li>
              <li>・公共料金・電気水道契約のデポジット回避</li>
            </ul>
          </section>

          {/* 国別スコア */}
          <section id="scoring-systems" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別スコアリングシステム</h2>
            <div className="space-y-3">
              {SCORING_SYSTEMS.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{s.country}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>スコアシステム:</strong> {s.system}</p>
                    <p><strong>レンジ:</strong> {s.detail}</p>
                    <p className="text-xs text-gray-500"><strong>必要シーン:</strong> {s.needed}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 構築5ステップ */}
          <section id="how-to-build" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">クレヒス構築5ステップ</h2>
            <div className="space-y-3">
              {BUILD_STEPS.map((s) => (
                <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {s.step}: {s.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="現地銀行口座開設も合わせて"
            description="クレヒス構築の前提となる現地銀行口座開設の詳細ガイド。"
            primaryHref="/banking-overseas"
            primaryLabel="海外銀行口座開設"
            secondaryHref="/au-pr-route"
            secondaryLabel="豪PR取得ルート"
          />

          {/* 初心者クレカ */}
          <section id="how-to-get-card" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">初心者でも作れるクレカ</h2>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-base mb-2 text-primary-700">🇨🇦 カナダ</p>
                <div className="space-y-2">
                  {STARTER_CARDS_CANADA.map((c, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-3">
                      <p className="font-bold text-sm mb-1">{c.card}</p>
                      <p className="text-xs text-gray-600">{c.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-bold text-base mb-2 text-primary-700">🇦🇺 オーストラリア</p>
                <div className="space-y-2">
                  {STARTER_CARDS_AUSTRALIA.map((c, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-3">
                      <p className="font-bold text-sm mb-1">{c.card}</p>
                      <p className="text-xs text-gray-600">{c.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 支払いルール */}
          <section id="spending-rules" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">スコアUPのための支払いルール</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SPENDING_RULES.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 失敗 */}
          <section id="common-mistakes" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくある失敗と対処</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {COMMON_MISTAKES.map((m, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* タイムライン */}
          <section id="timeline" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">構築までの一般的な期間</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">期間</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">活動</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">スコア目安</th>
                  </tr>
                </thead>
                <tbody>
                  {TIMELINE.map((t, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{t.period}</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">{t.activity}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700">{t.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「クレジット・クレカ・信用・ローン」関連の言及を集計。
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
            ※ クレジットカード情報・条件は2026年5月時点の情報です。最新情報は各銀行・クレカ会社公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/banking-overseas" className="text-primary-600 hover:underline">→ 海外銀行口座開設</Link></li>
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/canada-tax-return" className="text-primary-600 hover:underline">→ カナダTax Return</Link></li>
              <li><Link href="/australia-tfn-guide" className="text-primary-600 hover:underline">→ 豪TFN取得</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金・クレカ</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
