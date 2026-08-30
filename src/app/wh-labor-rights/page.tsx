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
  title: 'ワーホリで労働権利を侵害されたら？賃金未払い・最低賃金違反の対処法',
  description: 'ワーホリ中の賃金未払い・最低賃金違反・不当解雇に遭遇したときの対処法を解説。各国の労働相談窓口、フェアワーク（豪）・労働基準局（加）への連絡方法、被害を防ぐ予防策まで。',
  path: '/wh-labor-rights',
  keywords: [
    'ワーホリ 労働 権利 侵害',
    'ワーホリ ブラック バイト',
    'ワーホリ 給料 未払い',
    'ワーホリ 最低賃金 下回る',
    'ワーホリ 不当解雇',
    'オーストラリア フェアワーク',
  ],
});

const TOC_HEADINGS = [
  { id: 'common-issues', label: 'よくある労働権利侵害5パターン' },
  { id: 'check-points', label: '雇用前に確認すべき5項目' },
  { id: 'consultation', label: '国別の労働相談窓口' },
  { id: 'evidence', label: '証拠を残すための5つの行動' },
  { id: 'unpaid-action', label: '未払い賃金の請求手順' },
  { id: 'faq', label: 'よくある質問' },
];

const COMMON_ISSUES = [
  {
    title: '① 最低賃金以下の支払い',
    detail: 'オーストラリアの最低時給AUD24.10だが、現金支給で「時給15ドル」など違法な労働条件を提示する雇用主が存在。日系・キッチンハンドで頻発。',
  },
  {
    title: '② 賃金未払い・支払い遅延',
    detail: '「来週払う」と言われ続けて未払いのまま雇用主が消えるケース。日系の小規模店舗で要注意。',
  },
  {
    title: '③ Tax File Number（TFN）なしの違法雇用',
    detail: 'TFNを取得していないと税率45%。雇用主が「TFN不要」と言う場合、税務処理がされていない違法雇用の可能性。',
  },
  {
    title: '④ 残業代・休日手当の未支給',
    detail: '法定の残業代・休日手当が支払われない。「fair work pay rate」で正規の時給を必ず確認。',
  },
  {
    title: '⑤ 不当解雇',
    detail: '理由なき即日解雇・予告なしの解雇は違法。書面での解雇通告を要求し、対処を。',
  },
];

const CHECK_POINTS = [
  '雇用契約書の有無（Employment Agreement）',
  'TFN提出を求められるか（必須）',
  'Pay slip（給与明細）が毎週発行されるか',
  '時給が法定最低賃金以上か',
  'Super（年金 / 豪）・CPP（年金 / 加）が積み立てられるか',
];

const COUNTRY_RESOURCES = [
  {
    country: '🇦🇺 オーストラリア',
    org: 'Fair Work Ombudsman',
    detail: 'fairwork.gov.au。賃金・労働条件の相談を無料で受付。日本語対応もあり。',
  },
  {
    country: '🇨🇦 カナダ',
    org: 'Employment Standards (州別)',
    detail: '州ごとに労働基準局あり（オンタリオ州はMinistry of Labour）。賃金・解雇の相談を受付。',
  },
  {
    country: '🇳🇿 ニュージーランド',
    org: 'Employment New Zealand',
    detail: 'employment.govt.nz。労働基準違反の相談・通報を受付。',
  },
  {
    country: '🇮🇪 アイルランド',
    org: 'Workplace Relations Commission',
    detail: 'workplacerelations.ie。賃金未払い・解雇の相談窓口。',
  },
  {
    country: '🇬🇧 イギリス',
    org: 'ACAS (Advisory, Conciliation and Arbitration Service)',
    detail: 'acas.org.uk。労働問題の無料相談・仲裁サービス。',
  },
];

const EVIDENCE_STEPS = [
  'Pay slip（給与明細）を毎週受け取り、写真でも保存',
  'シフト表・勤務時間を自分でメモ・写真保存',
  '雇用契約書・口約束の録音・メッセージのスクリーンショット',
  '時給・残業時間を週単位で計算・記録',
  'TFN・銀行振込履歴・税務関連書類を全て保管',
];

const FAQS = [
  {
    question: '時給が最低賃金以下でも我慢するべき？',
    answer:
      '我慢する必要なし。最低賃金違反は明確な違法行為。各国の労働相談窓口に通報すれば、雇用主への調査・是正勧告が入ります。匿名通報も可能な国が多い。',
  },
  {
    question: '雇用主に直接抗議するのは怖い、どうすれば？',
    answer:
      'まず労働相談窓口に相談。窓口経由で雇用主への通知・調査が入るので、自分で直接対峙する必要はありません。Fair Work（豪）は調査結果を雇用主側に共有する形で対応してくれます。',
  },
  {
    question: '英語で相談するのが難しい、日本語でできる？',
    answer:
      'オーストラリアのFair Workには日本語電話通訳サービスあり（無料）。Translatorを電話相談時に依頼可能。または在外公館（大使館）の日本語スタッフに状況を説明してアドバイスを受けることも。',
  },
  {
    question: '未払い賃金の請求は時効がある？',
    answer:
      '国により異なります。オーストラリアは原則6年、カナダは州により2〜6年、イギリスは6年。早めに行動するのが鉄則。',
  },
  {
    question: '雇用主が日本人でも違法は違法？',
    answer:
      'そうです。日本人雇用主による日系店でも、現地の労働法は適用されます。「日本人だから許される」という言い訳は通用しません。',
  },
];

export default function WhLaborRightsPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリの労働権利侵害対処法', url: '/wh-labor-rights' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリの労働権利侵害対処法' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリで労働権利を侵害されたら？賃金未払い・最低賃金違反の対処法
            </h1>
            <ArticleMetaBadge
              readingMinutes={7}
              updatedAt="2026年5月"
              targetAudience="ワーホリ中・労働トラブルが心配な方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリ中、最低賃金以下の支払い・賃金未払い・不当解雇に遭遇するケースは残念ながら一定数あります。
              <br />
              「我慢する」のではなく、正しい対処法を知って自分の権利を守りましょう。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'よくある労働権利侵害5パターンと予防策',
              '主要5カ国の労働相談窓口（無料・日本語対応も）',
              '未払い賃金の請求手順と必要な証拠',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* よくあるパターン */}
          <section id="common-issues" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくある労働権利侵害5パターン</h2>
            <div className="space-y-3">
              {COMMON_ISSUES.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base text-rose-700">{c.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 雇用前チェック */}
          <section id="check-points" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">雇用前に確認すべき5項目</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              トラブルの大半は雇用前に防げます。下記5項目を必ず確認しましょう。
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {CHECK_POINTS.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="オーストラリアの仕事の探し方と注意点"
            description="ワーホリ最大の渡航国の労働実態をまとめたガイドもどうぞ。"
            primaryHref="/australia-jobs"
            primaryLabel="オーストラリア仕事探し方"
            secondaryHref="/no-english"
            secondaryLabel="英語ゼロでも始められる仕事"
          />

          {/* 相談窓口 */}
          <section id="consultation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別の労働相談窓口</h2>
            <div className="space-y-3">
              {COUNTRY_RESOURCES.map((c) => (
                <div key={c.country} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-1 text-base">{c.country} {c.org}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 証拠 */}
          <section id="evidence" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">証拠を残すための5つの行動</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              「証拠がない」と泣き寝入りしないために、雇用開始日から下記を実践しましょう。
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {EVIDENCE_STEPS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 未払い請求 */}
          <section id="unpaid-action" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">未払い賃金の請求手順</h2>
            <ol className="space-y-3">
              {[
                { title: 'Step 1: 雇用主に書面で支払い要求', detail: 'メール・SMSで記録を残しつつ請求。「いつまでに支払うか」を明記。' },
                { title: 'Step 2: 払われない場合は労働相談窓口に通報', detail: 'Fair Work（豪）など各国の窓口にオンラインで通報。' },
                { title: 'Step 3: 窓口が調査を実施', detail: '雇用主への調査・是正勧告が入る。匿名通報の場合も多い。' },
                { title: 'Step 4: 必要に応じて労働裁判所へ', detail: '解決しない場合は労働裁判所への申立て。弁護士サポートも検討。' },
              ].map((s, i) => (
                <li key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-1 text-base">{s.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </li>
              ))}
            </ol>
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
            ※ 本記事は2026年5月時点の一般情報です。具体的なケースは各国の労働相談窓口・弁護士へご相談ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/australia-jobs" className="text-primary-600 hover:underline">
                  → オーストラリア仕事探し方
                </Link>
              </li>
              <li>
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語話せなくてもワーホリ
                </Link>
              </li>
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための教訓
                </Link>
              </li>
              <li>
                <Link href="/tax-return" className="text-primary-600 hover:underline">
                  → ワーホリの確定申告ガイド
                </Link>
              </li>
              <li>
                <Link href="/wh-mental-health" className="text-primary-600 hover:underline">
                  → ワーホリのメンタルヘルス
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合う国
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
