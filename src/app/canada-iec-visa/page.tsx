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
  title: 'カナダ ワーホリ IEC ビザ申請完全ガイド｜抽選・必要書類・スケジュール',
  description: 'カナダのワーホリビザ「IEC（International Experience Canada）」の申請手順、抽選の仕組み、必要書類、費用、応募から渡航までのスケジュールを実例ベースで解説。落選しないためのコツも。',
  path: '/canada-iec-visa',
  keywords: [
    'カナダ IEC ビザ',
    'カナダ ワーホリ ビザ',
    'カナダ ワーホリ 申請',
    'IEC 抽選',
    'カナダ ワーホリ 必要書類',
    'カナダ ビザ 申請 手順',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: 'IECとは？カテゴリ別の違い' },
  { id: 'lottery', label: '抽選の仕組みとタイミング' },
  { id: 'documents', label: '必要書類と費用' },
  { id: 'steps', label: '申請から渡航までの8ステップ' },
  { id: 'tips', label: '抽選確率を上げるコツ' },
  { id: 'faq', label: 'よくある質問' },
];

const STEPS = [
  { num: 1, title: 'IRCC（カナダ移民局）のオンラインアカウント作成', detail: 'IRCCのサイトで GCKey または Sign-In Partner からアカウントを作成。' },
  { num: 2, title: 'プールに登録（Express of Interest 提出）', detail: 'WHC（ワーキングホリデー）カテゴリのプールに登録。抽選対象になります。' },
  { num: 3, title: '抽選結果を待つ（Invitation to Apply 受領）', detail: 'プール登録者から定期的に抽選があり、当選するとITAが送られます。' },
  { num: 4, title: 'ITA受領後10日以内に申請開始', detail: '当選通知から10日以内に正式申請をスタート。20日以内に完了が必要。' },
  { num: 5, title: '書類アップロード・申請料支払い', detail: 'パスポート・写真・履歴書・残高証明など。申請料CAD 172＋オープンワーク料CAD 100。' },
  { num: 6, title: 'バイオメトリクス（生体認証）登録', detail: '指紋・写真の登録。日本では東京・大阪のVAC（ビザ申請センター）で実施。' },
  { num: 7, title: 'POE Letter（渡航許可書）の受領', detail: '審査通過後、Port of Entry Letterが届く。1年間有効、入国時に空港でWork Permitに切替。' },
  { num: 8, title: '渡航＋空港でWork Permit受領', detail: '入国時に必ずImmigration Officerに「Working Holiday」を申告し、Work Permitを発行してもらう。' },
];

const TIPS = [
  '抽選は不定期に複数回（年8〜15回程度）あるので、プール登録は早めに',
  'プールに登録したら通知メールを必ず受信できるよう確認',
  '当選後10日以内のアクション必須なので、書類事前準備が鍵',
  '残高証明は CAD 2,500（約27万円）以上が条件',
  '英文残高証明・パスポート・写真・履歴書は早めに準備',
  'バイオメトリクス予約は混雑するため早めに',
];

const FAQS = [
  {
    question: 'IECの抽選はどのくらいの確率で当たりますか？',
    answer:
      '年度・国により変動しますが、日本人の場合は2024年実績で50〜70%程度。早期にプール登録するほど抽選機会が増えるので、年度開始（毎年1月頃）直後の登録がおすすめ。',
  },
  {
    question: '抽選に外れたらもう申請できない？',
    answer:
      '同じ年度内に複数回抽選があるので、外れても次の抽選を待つことが可能。プール登録は最大1年間有効。年度をまたぐ場合は再登録が必要。',
  },
  {
    question: '日本でバイオメトリクスはどこで受けられる？',
    answer:
      'VFS Global（ビザ申請センター）の東京（東京VAC）・大阪（大阪VAC）で受付。費用 CAD 85（約9,200円）。事前予約必須。',
  },
  {
    question: 'カナダIECビザの有効期間は？',
    answer:
      'POE Letter（渡航許可書）は発行から12ヶ月以内に入国必要。入国後発行されるWork Permitで最大24ヶ月滞在可能。延長は原則不可。',
  },
  {
    question: '英語力の証明は必要？',
    answer:
      'カナダIECは英語スコアの提出は不要。ただし入国時のImmigration Officerとの英会話で、最低限の意思疎通ができるレベルが必要。',
  },
];

export default function CanadaIecVisaPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'カナダ ワーホリ IEC ビザ申請', url: '/canada-iec-visa' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'カナダ ワーホリ IEC ビザ申請' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              カナダ ワーホリ IEC ビザ申請完全ガイド｜抽選・必要書類・スケジュール
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="カナダワーホリ志望の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              カナダのワーホリビザは「IEC（International Experience Canada）」と呼ばれる抽選制です。
              <br />
              オーストラリアと違って即発行ではなく、プール登録→抽選→当選後申請、という独特の流れ。
              <br />
              この記事では、申請から渡航までの全8ステップと、抽選確率を上げるコツを解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'IECビザの仕組みと WHC・YP・IC の3カテゴリの違い',
              '抽選の確率を上げるための4つのコツ',
              '申請開始〜渡航までの全8ステップとスケジュール',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 概要 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">IECとは？カテゴリ別の違い</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              IEC（International Experience Canada）はカナダ政府が提供する若者向け国際交流プログラム。3つのカテゴリがあります。
            </p>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">Working Holiday（WHC）</h3>
                <p className="text-sm text-gray-700">最も人気のカテゴリ。Open Work Permitで職種制限なく就労可能。日本人は18〜30歳が対象。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">Young Professionals（YP）</h3>
                <p className="text-sm text-gray-700">カナダの雇用主から内定をもらってから申請。Closed Work Permit（雇用主指定）。キャリア重視向け。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">International Co-op（IC）</h3>
                <p className="text-sm text-gray-700">大学のインターンシップ・実習目的。学生向けで在学証明が必要。</p>
              </div>
            </div>
          </section>

          {/* 抽選の仕組み */}
          <section id="lottery" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">抽選の仕組みとタイミング</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              IECは「プール登録」→「不定期な抽選」→「当選者のみ正式申請」という流れ。年度初め（毎年1月頃）に枠が開放され、その後年8〜15回程度の抽選が行われます。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>💡 ポイント</strong>: プールに登録した順ではなく、ランダム抽選です。早期登録のメリットは「抽選機会が増える」こと。年度初めにプール登録するのが最も有利。
              </p>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="カナダ以外の国も検討したい方へ"
            description="5問の診断で9カ国の中からあなたに合う国を提案。カナダとオーストラリアで迷っている方にも。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/compare/countries"
            secondaryLabel="国別比較ランキング"
          />

          {/* 必要書類 */}
          <section id="documents" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">必要書類と費用</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・パスポート（残存期間1年以上）</li>
              <li>・パスポートサイズの証明写真（規定サイズ）</li>
              <li>・英文残高証明書（CAD 2,500以上 / 約27万円）</li>
              <li>・英文履歴書（CV / Resume）</li>
              <li>・海外旅行保険（滞在期間全カバー）</li>
              <li>・申請料 CAD 172（約19,000円）</li>
              <li>・オープンワーク料 CAD 100（約11,000円）</li>
              <li>・バイオメトリクス費用 CAD 85（約9,200円）</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              ※ 費用は2026年5月時点。最新情報は <Link href="https://www.canada.ca/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">IRCC公式サイト</Link> で確認してください。
            </p>
          </section>

          {/* ステップ */}
          <section id="steps" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申請から渡航までの8ステップ</h2>
            <ol className="space-y-3">
              {STEPS.map((s) => (
                <li key={s.num} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                  <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold">
                    {s.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1 text-base">{s.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* コツ */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">抽選確率を上げるコツ</h2>
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
            ※ 本記事は2026年5月時点の情報です。最新情報は必ずIRCC公式サイトでご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/countries/canada" className="text-primary-600 hover:underline">
                  → カナダ ワーホリ・留学完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/agent-comparison" className="text-primary-600 hover:underline">
                  → エージェント vs 自力比較
                </Link>
              </li>
              <li>
                <Link href="/departure-timing" className="text-primary-600 hover:underline">
                  → 出発時期おすすめ月
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">
                  → ワーホリの不安と親の説得
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
