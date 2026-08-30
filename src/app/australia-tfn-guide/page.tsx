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

const PAGE_PATH = '/australia-tfn-guide';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーストラリアTFN取得完全ガイド｜申請手順・税率・ABNとの違い',
  description: 'オーストラリアで働くなら必須のTFN（Tax File Number）。申請手順、必要書類、所要日数、税率、ABNとの違い、申請後の使い方まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'オーストラリア TFN',
    'TFN 取得',
    'TFN 申請',
    'タックスファイルナンバー',
    'TFN ABN 違い',
    'オーストラリア 税金',
  ],
});

const TOC_HEADINGS = [
  { id: 'what-is-tfn', label: 'TFNとは？なぜ必須なのか' },
  { id: 'how-to-apply', label: 'TFN申請手順5ステップ' },
  { id: 'documents', label: '申請に必要な書類' },
  { id: 'tax-rate', label: 'TFNありなしの税率比較' },
  { id: 'tfn-vs-abn', label: 'TFNとABNの違い' },
  { id: 'after-apply', label: '申請後の流れ・受領まで' },
  { id: 'common-trouble', label: 'よくあるトラブルと対処法' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const APPLY_STEPS = [
  {
    step: 1,
    title: 'オーストラリア到着・住所確定',
    detail: 'TFNはオーストラリア国内からのみ申請可能。シェアハウス・ホステルでも住所があればOK',
  },
  {
    step: 2,
    title: 'ATO（オーストラリア国税庁）のサイトにアクセス',
    detail: 'www.ato.gov.au から「Apply for a TFN」ページへ。所要時間15〜20分',
  },
  {
    step: 3,
    title: 'オンラインフォーム入力',
    detail: 'パスポート番号、ビザ番号、オーストラリアの住所、英文氏名を入力',
  },
  {
    step: 4,
    title: '申請内容の確認・送信',
    detail: '入力ミスがないか再確認して送信。送信後にRecipt Numberが発行される',
  },
  {
    step: 5,
    title: '郵送でTFN受領（10〜28営業日）',
    detail: '登録住所に郵送で届く。シェアハウス転居予定なら住所変更に注意',
  },
];

const DOCUMENTS = [
  { item: 'パスポート', detail: '有効期限内のもの。ビザはeVisaで連動' },
  { item: 'オーストラリアでの住所', detail: 'ホステル・シェアハウスでも可。私書箱は不可' },
  { item: 'メールアドレス', detail: 'Gmail推奨。受領通知が届く' },
  { item: '電話番号（任意）', detail: 'オーストラリアSIMの番号があると便利' },
];

const TAX_RATE_DATA = [
  {
    case: 'TFNあり（居住者扱い）',
    rate: '年収AUD 18,200まで非課税。18,201〜45,000は19%',
    note: 'ワーホリ・学生ビザは「非居住者」扱いだが、TFN必須',
  },
  {
    case: 'TFNあり（ワーホリ・学生）',
    rate: '年収AUD 45,000まで一律15%。45,001〜120,000は32.5%',
    note: '2017年以降、ワーホリは「working holiday maker」枠で計算',
  },
  {
    case: 'TFNなし',
    rate: '一律47%（無条件源泉徴収）',
    note: '給与の約半分が天引きされる。絶対避けるべき',
  },
];

const TFN_VS_ABN = [
  {
    type: 'TFN（Tax File Number）',
    purpose: '個人の納税者番号。9桁の数字',
    who: '雇用されて働く人（給与所得者）',
    how: '雇用主に提示→源泉徴収される',
    cost: '無料',
  },
  {
    type: 'ABN（Australian Business Number）',
    purpose: '事業者番号。11桁の数字',
    who: '個人事業主・フリーランス・契約者',
    how: '請求書を発行→確定申告で納税',
    cost: '無料（オンライン申請）',
  },
];

const COMMON_TROUBLE = [
  '住所間違いでTFNが届かない → ATOに電話して再送依頼（132 861）',
  '雇用主にTFN提示し忘れて47%課税 → 確定申告で還付請求可能',
  '受領前に仕事スタート → 「TFN申請中」と伝えれば28日間の猶予あり',
  'TFNを紛失 → ATOで再発行依頼（無料、本人確認必要）',
  'TFN番号を他人に教える → 個人情報漏洩リスク大、絶対NG',
];

const FAQS = [
  {
    question: 'TFNは出発前に取得できる？',
    answer:
      'できません。TFNはオーストラリア到着後にのみ申請可能。住所もオーストラリア国内のものが必要です。到着後すぐ申請して10〜28営業日で受領するのが標準フロー。仕事を始める前にできるだけ早く申請しましょう。',
  },
  {
    question: 'TFNなしで働くとどうなる？',
    answer:
      '給与から一律47%が源泉徴収されます。例えば時給AUD 25で週40時間働くと、本来AUD 1,000のはずが約AUD 530しか手取りになりません。28日間の猶予内にTFNを提示しないと正規税率に切り替わらないため、必ず早めに取得を。',
  },
  {
    question: '確定申告（Tax Return）は必須？',
    answer:
      '年間収入があれば必須。毎年7月1日〜10月31日が申告期間。MyGovサイトから無料で申請可能。源泉徴収された税金が多すぎた場合は還付（Refund）が受けられます。ワーホリでも数百〜数千ドル戻ってくるケースが多い。',
  },
  {
    question: 'ABNも取った方がいい？',
    answer:
      '雇用契約（Employee）で働くならTFNのみでOK。バリスタ・ファーム・接客などはほぼ全てこちら。フリーランス・配達員（Uber Eats等）・個人請負で働く場合のみABNも必要。ABNワーカーは社会保障がなく、自分で税金管理する必要があるため要注意。',
  },
  {
    question: 'TFNとSuperannuation（年金）の関係は？',
    answer:
      '雇用主は給与の11%をSuper（年金口座）に積み立てる義務があります。TFNがないとSuperも非課税枠が適用されず無駄に減るため、TFN取得は給与＋年金の両面でメリット。帰国時はDASP申請で大半が払い戻し可能（税金引かれた残額）。',
  },
];

export default async function AustraliaTfnGuidePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ausExperiences = all.filter((e) => e.country?.id === 'australia');
  const mentions = countMentions(all, /(TFN|税金|タックス|tax|確定申告)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(TFN|税金|タックス|tax|確定申告)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーストラリアTFN取得ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーストラリアTFN取得ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーストラリアTFN取得完全ガイド｜申請手順・税率・ABNとの違い
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="オーストラリアで働く予定のワーホリ・留学生"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              オーストラリアで働く人は全員必須のTFN（Tax File Number＝納税者番号）。これがないと給与の47%が源泉徴収され、手取りが激減します。
              <br />
              この記事では申請手順5ステップ、必要書類、税率、ABNとの違いまで、ワーホリ・留学生目線で完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'TFNは到着後すぐ申請、10〜28営業日で郵送受領',
              'TFNなしだと給与の47%が源泉徴収されるため絶対必要',
              '雇用される人はTFN、フリーランスはABNも必要',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* TFNとは */}
          <section id="what-is-tfn" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">TFNとは？なぜ必須なのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              TFN（Tax File Number）はオーストラリア国税庁ATO（Australian Taxation Office）が発行する個人の納税者番号。日本のマイナンバーに相当する9桁の数字です。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-2"><strong>TFNが必要な場面:</strong></p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>・雇用契約時（バリスタ・ファーム・接客・全て）</li>
                <li>・銀行口座開設時（利息に税金がかからないように）</li>
                <li>・Superannuation（年金）口座開設時</li>
                <li>・確定申告（Tax Return）時</li>
                <li>・MyGovアカウント登録時</li>
              </ul>
            </div>
          </section>

          {/* 申請手順 */}
          <section id="how-to-apply" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">TFN申請手順5ステップ</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              申請はATO公式サイトから無料・オンラインで完結。所要時間は約15〜20分です。
            </p>
            <div className="space-y-3">
              {APPLY_STEPS.map((s) => (
                <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">
                    STEP {s.step}: {s.title}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="オーストラリアの仕事探しも合わせて"
            description="TFN取得後はいよいよ仕事探し。バリスタ・ファーム・接客の探し方を完全解説。"
            primaryHref="/australia-jobs"
            primaryLabel="オーストラリア仕事探し方"
            secondaryHref="/melbourne-barista"
            secondaryLabel="メルボルンでバリスタ"
          />

          {/* 必要書類 */}
          <section id="documents" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申請に必要な書類</h2>
            <div className="space-y-3">
              {DOCUMENTS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{d.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 税率比較 */}
          <section id="tax-rate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">TFNありなしの税率比較</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              TFNの有無で給与から引かれる税率が大きく変わります。
            </p>
            <div className="space-y-3">
              {TAX_RATE_DATA.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1">{t.case}</p>
                  <p className="text-sm text-primary-700 font-bold mb-2">{t.rate}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{t.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* TFN vs ABN */}
          <section id="tfn-vs-abn" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">TFNとABNの違い</h2>
            <div className="space-y-3">
              {TFN_VS_ABN.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{t.type}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                    <p><strong>用途:</strong> {t.purpose}</p>
                    <p><strong>対象者:</strong> {t.who}</p>
                    <p><strong>使い方:</strong> {t.how}</p>
                    <p><strong>費用:</strong> {t.cost}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 申請後 */}
          <section id="after-apply" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申請後の流れ・受領まで</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-700 font-bold shrink-0">1.</span>
                <span>申請完了後、Receipt Numberが画面表示される（スクショ推奨）</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-700 font-bold shrink-0">2.</span>
                <span>10〜28営業日でTFN番号が郵送で届く</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-700 font-bold shrink-0">3.</span>
                <span>受領前に仕事スタートする場合は雇用主に「TFN申請中」を伝える</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-700 font-bold shrink-0">4.</span>
                <span>受領後、雇用主にTFN Declaration Formで提出</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-700 font-bold shrink-0">5.</span>
                <span>銀行・Superファンドにも提出して源泉徴収を正規化</span>
              </li>
            </ul>
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
                税金・TFN関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 税率・申請手順は2026年5月時点の情報です。最新情報は必ずATO公式サイト（www.ato.gov.au）でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/australia-jobs" className="text-primary-600 hover:underline">→ オーストラリア仕事探し方</Link></li>
              <li><Link href="/melbourne-barista" className="text-primary-600 hover:underline">→ メルボルンでバリスタ</Link></li>
              <li><Link href="/sydney-sharehouse" className="text-primary-600 hover:underline">→ シドニーのシェアハウス</Link></li>
              <li><Link href="/tax-return" className="text-primary-600 hover:underline">→ ワーホリ確定申告</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金ガイド</Link></li>
              <li><Link href="/countries/australia" className="text-primary-600 hover:underline">→ オーストラリア国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
