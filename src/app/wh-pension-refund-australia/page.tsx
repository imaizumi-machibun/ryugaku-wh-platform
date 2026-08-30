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

const PAGE_PATH = '/wh-pension-refund-australia';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーストラリア年金（Super）還付申請DASP完全ガイド｜帰国後の手続き・税率・必要書類',
  description: 'オーストラリアで働いた給与の11%が積み立てられる年金（Superannuation）。帰国後にDASP申請で約65%を取り戻せます。申請手順、税率、必要書類、よくあるトラブルを完全解説。',
  path: PAGE_PATH,
  keywords: [
    'オーストラリア 年金 還付',
    'Super 還付',
    'DASP 申請',
    'スーパーアニュエーション 還付',
    'ワーホリ 年金 返還',
    'オーストラリア 帰国 手続き',
  ],
});

const TOC_HEADINGS = [
  { id: 'what-is-super', label: 'Superannuationとは？なぜ還付されるのか' },
  { id: 'tax-rate', label: '還付税率は65%（残り35%は税金）' },
  { id: 'when-can-apply', label: '申請できるタイミング' },
  { id: 'apply-steps', label: 'DASP申請手順5ステップ' },
  { id: 'documents', label: '必要書類リスト' },
  { id: 'how-much', label: '実際の還付額シミュレーション' },
  { id: 'common-trouble', label: 'よくあるトラブルと対処法' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const APPLY_STEPS = [
  {
    step: 1,
    title: 'オーストラリア出国＋ビザ失効を確認',
    detail: 'DASP申請にはビザの失効が必要。ワーホリビザ満了 or 自主放棄（DepartureからのVisa Cancellation申請）',
  },
  {
    step: 2,
    title: 'ATOのDASPオンラインフォームにアクセス',
    detail: 'www.ato.gov.au/dasp。日本からでもオンライン申請可能。所要時間20〜30分',
  },
  {
    step: 3,
    title: 'TFN・パスポート・Super口座情報を入力',
    detail: 'TFN、パスポート番号、複数のSuper口座がある場合は全て入力',
  },
  {
    step: 4,
    title: 'Super運営会社の確認・送金処理',
    detail: '通常28日〜3ヶ月。Super会社により処理速度差大',
  },
  {
    step: 5,
    title: '日本の銀行口座に受領（豪ドル → 円換算）',
    detail: 'Wise受取推奨。為替手数料を最小化できる',
  },
];

const DOCUMENTS = [
  { item: 'TFN（Tax File Number）', detail: '取得していない場合は還付申請ができない' },
  { item: 'パスポート（コピー）', detail: '帰国時のパスポート。期限切れでもOK' },
  { item: 'Super口座番号（USI）', detail: '雇用主から発行されるPay Slipに記載' },
  { item: 'オーストラリア国内銀行口座', detail: '日本の銀行口座でも可能だが豪口座推奨' },
  { item: 'ビザ番号・失効確認証明', detail: 'IMMI Online等で出力可能' },
];

const REFUND_SIMULATIONS = [
  { earnings: 'AUD 30,000 / 6ヶ月', super: 'AUD 3,300', refund: '約AUD 2,145', jpy: '約21万円' },
  { earnings: 'AUD 50,000 / 1年', super: 'AUD 5,500', refund: '約AUD 3,575', jpy: '約36万円' },
  { earnings: 'AUD 70,000 / 1年', super: 'AUD 7,700', refund: '約AUD 5,005', jpy: '約50万円' },
  { earnings: 'AUD 100,000 / 2年', super: 'AUD 11,000', refund: '約AUD 7,150', jpy: '約71万円' },
];

const COMMON_TROUBLE = [
  'Super口座を複数持っていて全部把握できない → MyGovログインで一括確認可能',
  'TFNがない → 還付申請不可、現地滞在中に取得必須',
  '6ヶ月以内に申請しないと税率が65%に上がる（DASPで失う額大）',
  '受領銀行口座が間違っていて送金失敗 → ATOに再依頼必要、数ヶ月遅延',
  'Super運営会社の処理遅延 → 3ヶ月経っても来ない場合は会社に直接問い合わせ',
];

const FAQS = [
  {
    question: '還付額はいくらくらい？',
    answer:
      '積立額の約65%が手元に戻ります。例えば1年間オーストラリアで働きSuperが5,500豪ドル積立されていた場合、約3,575豪ドル（約36万円）が還付されます。残り35%は税金として源泉徴収。給与の11%が雇用主からSuper積立されているので、帰国前に必ず申請を。',
  },
  {
    question: 'いつ申請できる？',
    answer:
      'オーストラリアを永久に離れ、ビザが失効してから申請可能。WHV満了で自動失効、もしくは自主放棄申請（IMMI Online）でビザを早期キャンセル後、即申請可能。失効から6ヶ月以内が標準税率（35%）、6ヶ月超過すると65%課税に上がるため早めの申請を。',
  },
  {
    question: '日本帰国後でも申請できる？',
    answer:
      '可能です。むしろ多くの人は帰国後に日本からオンラインでDASP申請しています。ATO（オーストラリア税務署）の公式サイトから24時間アクセス可能、すべて英語ですが定型フォームなのでGoogle翻訳で十分対応できます。',
  },
  {
    question: '受領した還付金は日本で課税される？',
    answer:
      '日本の所得税法上「一時所得」扱い。年50万円の特別控除があるため、多くのケースで非課税。控除後の金額×1/2が課税対象。確定申告（雑所得 or 一時所得）で対応します。心配なら税理士に相談を。',
  },
  {
    question: 'Super口座が複数あるけど一括で還付できる？',
    answer:
      'はい。複数の雇用主で働いた場合、複数のSuper口座ができていることが多い。DASP申請時に全ての口座番号を入力すれば、一括で還付処理されます。MyGovアカウントにログインして「Super」タブで全口座を一覧確認可能。',
  },
];

export default async function WhPensionRefundAustraliaPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ausExperiences = all.filter((e) => e.country?.id === 'australia');
  const mentions = countMentions(all, /(年金|Super|スーパー|DASP|還付)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(年金|Super|スーパー|DASP|還付|税)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーストラリア年金還付DASP完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーストラリア年金還付DASP完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーストラリア年金（Super）還付申請DASP完全ガイド
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="オーストラリアWH/学生で帰国予定の方／帰国済みでまだ申請していない方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              オーストラリアで働いていた給与の11%は強制的に年金（Superannuation、通称Super）口座に積立されています。これは日本帰国後にDASP（Departing Australia Superannuation Payment）申請で約65%を取り戻すことが可能です。
              <br />
              意外と知らない人が多く、申請しないまま放置すると数十万円を失います。この記事で完全網羅。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'DASP申請で積立額の約65%を取り戻せる（残り35%は税金）',
              '1年間働いた人で約30〜50万円の還付が一般的',
              'TFNなしだと申請不可。ビザ失効後6ヶ月以内が好条件',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* Super とは */}
          <section id="what-is-super" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Superannuationとは？なぜ還付されるのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              Superannuation（通称Super）はオーストラリアの強制年金制度。雇用主は給与の11%（2026年現在）をSuper口座に積立する義務があります。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・通常は退職時（60歳以降）に受給開始</p>
              <p>・ただし「永住権を持たない外国人」は出国時に DASP として一括還付申請が可能</p>
              <p>・ワーホリ・学生ビザ・その他一時滞在ビザ保持者が対象</p>
              <p>・約65%が手元に戻る（残り35%は出国時税金で徴収）</p>
            </div>
          </section>

          {/* 税率 */}
          <section id="tax-rate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">還付税率は65%（残り35%は税金）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              DASP税率は「Working Holiday Maker」区分により決められています。
            </p>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-1 text-primary-700">標準DASP税率（ワーホリ含む）</p>
                <p className="text-2xl text-rose-600 font-bold mb-1">35%</p>
                <p className="text-xs text-gray-600 leading-relaxed">手取り還付額は積立額の65%。例：5,500豪ドル積立→3,575豪ドル還付</p>
              </div>
              <div className="bg-white border border-rose-200 rounded-xl p-4">
                <p className="font-bold text-base mb-1 text-rose-700">未請求から6ヶ月経過した場合</p>
                <p className="text-2xl text-rose-600 font-bold mb-1">65%</p>
                <p className="text-xs text-gray-600 leading-relaxed">税率が大幅アップ。手取り35%まで減るため、早期申請推奨</p>
              </div>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="TFN取得もまだの方は先に確認を"
            description="DASP申請にはTFN必須。取得方法・税率・ABNとの違いはこちら。"
            primaryHref="/australia-tfn-guide"
            primaryLabel="オーストラリアTFN完全ガイド"
            secondaryHref="/tax-return"
            secondaryLabel="確定申告ガイド"
          />

          {/* 申請タイミング */}
          <section id="when-can-apply" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申請できるタイミング</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <li className="leading-relaxed">✓ オーストラリアを永久に離れ、ビザが失効した後</li>
              <li className="leading-relaxed">✓ ビザ失効から早ければ早いほどよい（6ヶ月以内が標準税率）</li>
              <li className="leading-relaxed">✓ ビザ自主放棄（IMMI Online）でも可能、出国翌日から申請可</li>
              <li className="leading-relaxed">✓ 日本帰国後でも、オーストラリア国内でも申請可能</li>
              <li className="leading-relaxed">✓ 複数のSuper口座あっても一括申請OK</li>
            </ul>
          </section>

          {/* 申請手順 */}
          <section id="apply-steps" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">DASP申請手順5ステップ</h2>
            <div className="space-y-3">
              {APPLY_STEPS.map((s) => (
                <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {s.step}: {s.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 必要書類 */}
          <section id="documents" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">必要書類リスト</h2>
            <div className="space-y-3">
              {DOCUMENTS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{d.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* シミュレーション */}
          <section id="how-much" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">実際の還付額シミュレーション</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              年収別の積立額・還付額・円換算（1豪ドル=100円換算）。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">年収・期間</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Super積立</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">DASP還付</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">円換算</th>
                  </tr>
                </thead>
                <tbody>
                  {REFUND_SIMULATIONS.map((r, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{r.earnings}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.super}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.refund}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{r.jpy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* トラブル */}
          <section id="common-trouble" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくあるトラブルと対処法</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {COMMON_TROUBLE.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
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
                オーストラリア渡航者の体験談 <strong>n={ausExperiences.length}件</strong>。
                年金・Super関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 税率・申請手順は2026年5月時点の情報です。最新情報はATO公式（www.ato.gov.au/dasp）でご確認ください。日本国内での課税扱いは税理士・税務署に個別ご相談ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/australia-tfn-guide" className="text-primary-600 hover:underline">→ オーストラリアTFN完全ガイド</Link></li>
              <li><Link href="/tax-return" className="text-primary-600 hover:underline">→ ワーホリ確定申告</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金・クレカ</Link></li>
              <li><Link href="/after-wh" className="text-primary-600 hover:underline">→ ワーホリ後の進路</Link></li>
              <li><Link href="/australia-jobs" className="text-primary-600 hover:underline">→ オーストラリア仕事探し方</Link></li>
              <li><Link href="/countries/australia" className="text-primary-600 hover:underline">→ オーストラリア国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
