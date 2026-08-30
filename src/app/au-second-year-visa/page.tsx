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

const PAGE_PATH = '/au-second-year-visa';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーストラリアWHセカンドビザ完全ガイド｜88日条件・対象職種・3rdへの道',
  description: 'オーストラリアWHセカンドビザ申請の88日条件、対象職種・地域、申請手順、Pay Slip取得、3rdビザまでの全ルートを完全解説。',
  path: PAGE_PATH,
  keywords: [
    'オーストラリア セカンドビザ',
    'WH セカンド',
    '88日 ファーム',
    'WHV 延長',
    'オーストラリア 2ndビザ',
    'WHV 3rdビザ',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: 'セカンドビザとは（最大3年滞在可能）' },
  { id: 'conditions', label: '88日条件の正確なルール' },
  { id: 'target-jobs', label: '対象職種5カテゴリ' },
  { id: 'target-areas', label: '対象地域（リモートエリア）' },
  { id: 'apply-steps', label: '申請手順5ステップ' },
  { id: 'documents', label: '必要書類・Pay Slip取得' },
  { id: 'third-visa', label: '3rdビザへのルート（合計3年）' },
  { id: 'common-trouble', label: 'よくあるトラブルと対処' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TARGET_JOBS = [
  {
    category: '①Specified Work（指定就労）',
    detail: '農業・畜産業・漁業・林業・鉱業・建設業のリモートエリア就労',
    examples: 'ファームピッキング、家畜世話、漁師、伐採、鉱山労働者',
  },
  {
    category: '②Tourism and Hospitality（観光・接客）',
    detail: '北部地域・コロナ後特例で対象拡大',
    examples: 'リゾート接客、ホテル清掃、レストランホール（北部地域）',
  },
  {
    category: '③Bushfire/Natural Disaster',
    detail: '自然災害復旧支援、対象期間限定',
    examples: '森林火災復旧、洪水被害復旧支援',
  },
  {
    category: '④Construction（建設業）',
    detail: '北部地域中心、需給次第で対象地域変動',
    examples: '建設現場労働者、足場、コンクリート、配管工',
  },
  {
    category: '⑤Health and Medical（医療）',
    detail: 'コロナ後特例で導入',
    examples: '看護師補助、医療施設清掃（資格者は別ビザもあり）',
  },
];

const TARGET_AREAS_NOTES = [
  'Postcode（郵便番号）で対象地域が指定されている',
  'シドニー・メルボルン市内中心部は対象外',
  '主要対象地域：QLD州・WA州・NT州・TAS州の大部分',
  'NSW州・VIC州・SA州は一部リモートエリアのみ',
  '対象地域はImmigration公式サイトで最新マップを必ず確認',
];

const APPLY_STEPS = [
  { step: 1, title: '88日間の対象就労を完了', detail: '同一雇用主3ヶ月以上連続 or 複数雇用主合計88日（フルタイム週6日）' },
  { step: 2, title: 'Pay Slipと雇用証明書を全部収集', detail: '各週のPay Slip、Form 1263（雇用主証明書）、銀行明細' },
  { step: 3, title: 'ImmiAccountから申請', detail: 'オンライン申請フォーム、AUD 685手数料' },
  { step: 4, title: '書類アップロード・本人確認', detail: 'パスポート・88日Specified Work証明書類一式' },
  { step: 5, title: 'ビザ発行（即日〜2週間）', detail: '通常は即日メール、最大2週間。発行後1年内に滞在開始' },
];

const DOCUMENTS = [
  { item: 'Pay Slip（給与明細）', detail: '88日分すべて、週単位で日付・雇用主・労働時間明記' },
  { item: 'Form 1263（雇用主証明書）', detail: '雇用主に依頼、就労期間・職種・地域・労働時間を記載' },
  { item: '銀行明細', detail: '給与振込履歴の確認用、Pay Slipと一致' },
  { item: 'パスポート（カラーコピー）', detail: '現在の写真ページ' },
  { item: '現在のビザ証明（VEVO等）', detail: 'ImmiAccountから出力可能' },
  { item: '健康保険証券（任意）', detail: '医療保険加入を証明' },
];

const COMMON_TROUBLE = [
  '対象地域外で働いて88日経過 → ビザ申請が無効、対象地域での再就労が必要',
  'Pay Slipが不揃い・改竄疑い → 銀行明細との突合で確認、必ず雇用主から正式に取得',
  '雇用主がForm 1263を渡したがらない → 退職時に必ず請求、トラブル時は移民局相談',
  '同一雇用主88日のはずが途中で解雇 → 残期間は別雇用主で補完可能',
  '時給がオーストラリア最低時給を下回る → 雇用主が無記録雇用、ビザ申請却下リスク',
];

const FAQS = [
  {
    question: 'セカンドビザはいつから申請できる？',
    answer:
      '88日間のSpecified Work完了後、1stビザの有効期限内に申請。理想は1stビザ期限の3-6ヶ月前に申請完了。申請時に1stビザがアクティブである必要があり、期限切れ後は申請不可。',
  },
  {
    question: '88日は連続じゃないとダメ？',
    answer:
      '連続不要。複数雇用主・複数地域で合計88日でOK。ただし「フルタイム週6日勤務」が基本、パートタイム週20時間は対象外。週3日勤務なら2倍の176日必要。',
  },
  {
    question: '対象職種・地域はどう確認する？',
    answer:
      'Immigration公式サイト（immi.homeaffairs.gov.au）の「Specified Work」ページで最新リストを確認。郵便番号別マップもあり、地域確認に便利。年に1〜2回更新されるため、就労開始前に必ず確認。',
  },
  {
    question: '違法雇用主に当たったら？',
    answer:
      'Fair Work Australiaに相談（無料・日本語対応あり）。違法雇用（最低時給以下・無記録）は搾取被害、Pay Slipなしでも証拠（銀行明細・写真等）で雇用関係を証明できればビザ申請に活用可能なケースも。',
  },
  {
    question: '3rdビザは取れる？',
    answer:
      '取れます。2ndビザ中にさらに6ヶ月Specified Workを完了すると3rdビザ申請可能。合計3年（1+1+1）の滞在が可能。ただし要件は2ndより厳しく、6ヶ月間の同一雇用主指定就労が標準。長期PR申請を視野に入れる人向け。',
  },
];

export default async function AuSecondYearVisaPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ausExperiences = all.filter((e) => e.country?.id === 'australia');
  const mentions = countMentions(all, /(セカンド|88日|ファーム|2ndビザ|延長)/);
  const sample = ausExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(セカンド|88日|ファーム|2ndビザ|延長|オーストラリア)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーストラリアWHセカンドビザ完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーストラリアWHセカンドビザ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーストラリアWHセカンドビザ完全ガイド｜88日条件・対象職種・3rdへの道
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="オーストラリアWHで滞在延長したい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              オーストラリアWHは「セカンドビザ」で最大2年、「3rdビザ」でさらに1年延長可能。条件は「指定地域・指定職種で88日間就労」が基本。
              <br />
              この記事では88日条件の正確なルール、対象職種・地域、申請手順、Pay Slip取得、3rdビザまでの全ルートを完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'セカンドビザでWH滞在最大2年、3rdビザで3年に延長可能',
              '対象地域＋対象職種で88日（フルタイム週6日）就労が条件',
              'Pay Slip＋Form 1263＋銀行明細の3点セットで申請',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 概要 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">セカンドビザとは（最大3年滞在可能）</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              オーストラリアWHビザ（Subclass 417）は1年限定ですが、特定の条件を満たせば「セカンドビザ」で追加1年、「3rdビザ」で更に1年、合計3年まで延長可能です。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・1stビザ：誰でも申請可、年齢18-30歳、1年間滞在</p>
              <p>・セカンドビザ：1stビザ中に88日Specified Work、追加1年</p>
              <p>・3rdビザ：2ndビザ中に6ヶ月Specified Work、更に1年</p>
              <p>・申請料：1st AUD 685、2nd AUD 685、3rd AUD 685</p>
              <p>・年齢制限は1st申請時のみ、2nd/3rd申請時は31歳超でもOK</p>
            </div>
          </section>

          {/* 88日条件 */}
          <section id="conditions" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">88日条件の正確なルール</h2>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 space-y-3 text-sm text-gray-800">
              <p className="leading-relaxed"><strong className="text-sky-800">基本ルール:</strong> 対象地域＋対象職種で88日間の就労</p>
              <ul className="space-y-2">
                <li>・フルタイム週6日勤務（最低7時間/日 × 6日）が標準カウント</li>
                <li>・パートタイム週20時間は対象外（フルタイム換算で計算）</li>
                <li>・連続88日 or 複数雇用主合計88日のいずれでもOK</li>
                <li>・同一雇用主3ヶ月以上の場合、3ヶ月勤務でも88日に達する</li>
                <li>・週末・祝日休みもカウント対象</li>
              </ul>
            </div>
          </section>

          {/* 対象職種 */}
          <section id="target-jobs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">対象職種5カテゴリ</h2>
            <div className="space-y-3">
              {TARGET_JOBS.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{j.category}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{j.detail}</p>
                  <p className="text-xs text-gray-500"><strong>具体職種:</strong> {j.examples}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 対象地域 */}
          <section id="target-areas" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">対象地域（リモートエリア）</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {TARGET_AREAS_NOTES.map((a, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">📍</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="ファームジョブ探し方も合わせて"
            description="セカンドビザ取得の王道ルート、ファームジョブの探し方を完全解説。"
            primaryHref="/australia-farm-job"
            primaryLabel="オーストラリアファームジョブ"
            secondaryHref="/australia-jobs"
            secondaryLabel="オーストラリア仕事探し方"
          />

          {/* 申請手順 */}
          <section id="apply-steps" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申請手順5ステップ</h2>
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
            <h2 className="text-xl sm:text-2xl font-bold mb-3">必要書類・Pay Slip取得</h2>
            <div className="space-y-3">
              {DOCUMENTS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{d.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3rdビザ */}
          <section id="third-visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">3rdビザへのルート（合計3年）</h2>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                セカンドビザ中にさらに条件を満たせば、3rdビザで追加1年（合計3年）滞在可能。長期PR申請を視野に入れる人向け。
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・2ndビザ中に「6ヶ月（180日）」の対象就労</li>
                <li>・同一雇用主・同一カテゴリ指定就労が標準</li>
                <li>・申請料 AUD 685、年齢制限なし</li>
                <li>・3rd取得後はPR申請ルート（学生→PRや雇用主スポンサー等）に進む人が多い</li>
              </ul>
            </div>
          </section>

          {/* よくあるトラブル */}
          <section id="common-trouble" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくあるトラブルと対処</h2>
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
                セカンド・88日・ファーム関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ ビザ要件・対象地域・対象職種は2026年5月時点の情報です。最新情報は Department of Home Affairs（immi.homeaffairs.gov.au）公式情報で必ずご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/australia-farm-job" className="text-primary-600 hover:underline">→ オーストラリアファームジョブ</Link></li>
              <li><Link href="/australia-jobs" className="text-primary-600 hover:underline">→ オーストラリア仕事探し方</Link></li>
              <li><Link href="/australia-tfn-guide" className="text-primary-600 hover:underline">→ TFN取得ガイド</Link></li>
              <li><Link href="/wh-labor-rights" className="text-primary-600 hover:underline">→ ワーホリ労働権利</Link></li>
              <li><Link href="/wh-pension-refund-australia" className="text-primary-600 hover:underline">→ 豪Super還付</Link></li>
              <li><Link href="/melbourne-barista" className="text-primary-600 hover:underline">→ メルボルンでバリスタ</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
