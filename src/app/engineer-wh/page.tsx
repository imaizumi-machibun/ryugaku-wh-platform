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
  title: 'エンジニアのワーホリ｜リモートワーク継続と海外IT就職の3戦略',
  description: 'ITエンジニア・デザイナーがワーホリで「リモートワーク継続」「現地IT企業就職」「フリーランス」の3戦略を選ぶための実践ガイド。タイムゾーン対策、契約形態、税務、おすすめ国まで解説。',
  path: '/engineer-wh',
  keywords: [
    'エンジニア ワーホリ リモート',
    'ITエンジニア 海外 働く',
    'ワーホリ リモートワーク',
    'エンジニア 海外 就職',
    'プログラマー ワーホリ',
    'ノマド エンジニア',
  ],
});

const TOC_HEADINGS = [
  { id: 'three-strategies', label: 'IT職種のワーホリ3戦略' },
  { id: 'remote-tips', label: 'リモートワーク継続の実践Tips' },
  { id: 'local-job', label: '現地IT就職を狙うなら' },
  { id: 'best-countries', label: 'エンジニアにおすすめの国' },
  { id: 'tax-legal', label: '税務・契約形態の注意点' },
  { id: 'faq', label: 'よくある質問' },
];

const STRATEGIES = [
  {
    title: '戦略1: 日本企業のリモートワーク継続',
    summary: '在籍企業との合意の上、海外からリモートワーク。給与は日本円で安定収入。',
    pros: ['安定収入が継続', '帰国後のキャリアが途切れない', '社会保険継続'],
    cons: ['時差対応が必要', '会社の規定に縛られる', '住民票・税務処理が複雑'],
  },
  {
    title: '戦略2: 海外フリーランスとして案件獲得',
    summary: '日本のクライアント + 海外案件を並行。Upwork・LinkedInで案件獲得。',
    pros: ['完全自由な働き方', '海外案件で時給アップ', '英語力次第で世界市場'],
    cons: ['案件獲得の不安定性', '自己管理力が必須', '社会保険・年金は自己対応'],
  },
  {
    title: '戦略3: 現地IT企業に就職',
    summary: 'ワーホリ中に現地企業に就職してキャリアを積む。ビザ切替で長期滞在も。',
    pros: ['海外実務経験が積める', '永住権ルートが見える', '英語スキルが急上昇'],
    cons: ['採用ハードルが高い', '英語面接の壁', 'ビザ切替の手続き'],
  },
];

const REMOTE_TIPS = [
  '時差を逆手にとる：日本の翌朝MTGに合わせた働き方を提案',
  '高速インターネット環境（光回線・テザリング予備）を確保',
  'コワーキングスペースで集中環境を作る（月100〜300豪ドル）',
  'Slack・Notion・Zoomの英語UIに慣れておく',
  '日本の銀行口座は維持（給与振込先として）',
  '住民票を抜くと社会保険の継続が複雑化。会社と相談',
];

const LOCAL_JOB_TIPS = [
  '英語のテクニカルスクリーニング（コーディングテスト）対策',
  'LinkedInプロフィールを英語で整備、Open to Work設定',
  '現地のテックMeetupに参加してネットワーク作り',
  '日本企業の海外子会社（オーストラリアの日系IT等）から狙う',
  'スタートアップは新卒・中途の壁が薄く、ワーホリビザでも採用される',
  '雇用ビザ（ワーホリ→457/482ビザ等）への切替を視野に',
];

const BEST_COUNTRIES = [
  {
    name: '🇦🇺 オーストラリア',
    reason: 'IT求人多数（シドニー・メルボルン）、最低時給高い、英語環境',
    salary: 'シニアエンジニア年収 AUD120,000〜160,000',
  },
  {
    name: '🇨🇦 カナダ',
    reason: 'トロント・バンクーバー・モントリオールにIT企業集中、技術者ビザ取りやすい',
    salary: 'シニアエンジニア年収 CAD90,000〜140,000',
  },
  {
    name: '🇮🇪 アイルランド',
    reason: 'Google・Facebook・LinkedIn欧州本社集積、英語圏で税制有利',
    salary: 'シニアエンジニア年収 €60,000〜100,000',
  },
  {
    name: '🇩🇪 ドイツ',
    reason: 'Berlinはスタートアップ天国、Blue Cardで永住権も視野',
    salary: 'シニアエンジニア年収 €60,000〜90,000',
  },
];

const FAQS = [
  {
    question: '日本企業のリモートワークは海外からでも可能ですか？',
    answer:
      '会社の規定次第。「居住国・税務上の取り扱い」が会社の規程に合致するか事前確認が必須。最近はリモートワーク容認企業が増えていますが、海外居住については別途承認が必要なケースが多いです。',
  },
  {
    question: 'タイムゾーンが違うと仕事が成立しますか？',
    answer:
      'オーストラリア・NZは日本と時差1〜2時間で、ほぼ同じ時間帯で勤務可能。欧米は時差8〜16時間で、深夜・早朝MTGが必要になる場合あり。非同期コミュニケーション中心のチームなら問題ない場合も多いです。',
  },
  {
    question: '現地のIT企業はワーホリビザでも採用してくれますか？',
    answer:
      'スタートアップやデベロップメントエージェンシーは採用に前向き。ワーホリビザの期間内（最大12〜24ヶ月）で雇用後、雇用ビザ（457/482等）へ切り替えるパターンが定番。永住権につながるルートも。',
  },
  {
    question: 'フリーランスとして日本のクライアントワークを続けるのは合法？',
    answer:
      '住民票を抜いて非居住者となった場合、原則として日本での所得申告は不要（所得が日本国内源泉でない場合）。ただし租税条約と居住者判定により異なるため、税理士に確認推奨。',
  },
  {
    question: 'ワーホリ後にエンジニアとして転職するのは有利？',
    answer:
      '「英語＋海外実務経験」を持つITエンジニアは外資系・グローバル企業で高評価。LinkedIn経由でのスカウトも増えます。日本企業でも「グローバル案件」を担当できる人材として評価される傾向。',
  },
];

export default function EngineerWhPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'エンジニアのワーホリ戦略', url: '/engineer-wh' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'エンジニアのワーホリ戦略' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              エンジニアのワーホリ｜リモートワーク継続と海外IT就職の3戦略
            </h1>
            <ArticleMetaBadge
              readingMinutes={8}
              updatedAt="2026年5月"
              targetAudience="ITエンジニア・デザイナーでワーホリを検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ITエンジニアのワーホリは、他の職種と全く違うキャリア戦略が組めます。
              <br />
              「リモートワーク継続」「海外フリーランス」「現地IT企業就職」の3つの選択肢それぞれに、独特の準備と注意点があります。
              <br />
              この記事では、それぞれの戦略の実践Tipsと、エンジニアにおすすめの国まで解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'IT職種のワーホリ3戦略（リモート継続・フリーランス・現地就職）',
              'リモートワーク継続の実践Tips（時差・契約・税務）',
              'エンジニアにおすすめの4カ国と年収目安',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 3戦略 */}
          <section id="three-strategies" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">IT職種のワーホリ3戦略</h2>
            <div className="space-y-4">
              {STRATEGIES.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg">{s.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.summary}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-emerald-900 mb-1">メリット</p>
                      <ul className="text-xs text-emerald-900 space-y-1">
                        {s.pros.map((p, j) => (
                          <li key={j}>・{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-rose-900 mb-1">注意点</p>
                      <ul className="text-xs text-rose-900 space-y-1">
                        {s.cons.map((c, j) => (
                          <li key={j}>・{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="自分にぴったりの国を5問で診断"
            description="ITエンジニアの場合は時差・英語・税制の3軸で選ぶのがコツ。9カ国の中から相性スコアでTOP3を提案します。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/compare/countries"
            secondaryLabel="国別比較ランキング"
          />

          {/* リモートワーク継続 */}
          <section id="remote-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">リモートワーク継続の実践Tips</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              {REMOTE_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-primary-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 現地就職 */}
          <section id="local-job" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">現地IT就職を狙うなら</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              {LOCAL_JOB_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-primary-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* おすすめ国 */}
          <section id="best-countries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">エンジニアにおすすめの国</h2>
            <div className="space-y-3">
              {BEST_COUNTRIES.map((c) => (
                <div key={c.name} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base">{c.name}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{c.reason}</p>
                  <p className="text-xs text-primary-700 font-semibold">💰 {c.salary}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 税務 */}
          <section id="tax-legal" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">税務・契約形態の注意点</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              IT職種特有の注意点として、以下3つは必ずチェック。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              <li>・住民票を抜くと社会保険継続が困難。会社のリモート規程と税理士確認</li>
              <li>・フリーランスの場合、現地での所得税申告義務（タックスリターン）が発生する場合あり</li>
              <li>・日本国内源泉所得（日本クライアントからの報酬）は非居住者でも申告が必要なケースあり</li>
              <li>・国際租税条約（オーストラリア・カナダ等と日本）の二重課税回避適用</li>
              <li>・現地での消費税（GST/VAT）登録が必要な売上ラインがある</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              ※ 詳しくは <Link href="/tax-return" className="text-primary-600 hover:underline">ワーホリの確定申告ガイド</Link> もご覧ください。
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

          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            ※ 本記事は2026年5月時点の一般情報です。税務・労務の詳細は国際税務に詳しい税理士・社会保険労務士へご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/jobs/engineer" className="text-primary-600 hover:underline">
                  → エンジニアの海外キャリアガイド
                </Link>
              </li>
              <li>
                <Link href="/tax-return" className="text-primary-600 hover:underline">
                  → ワーホリの確定申告ガイド
                </Link>
              </li>
              <li>
                <Link href="/quit-job-wh" className="text-primary-600 hover:underline">
                  → 社会人ワーホリの退職と手続き
                </Link>
              </li>
              <li>
                <Link href="/after-wh" className="text-primary-600 hover:underline">
                  → 帰国後就活ガイド
                </Link>
              </li>
              <li>
                <Link href="/wise-payment-guide" className="text-primary-600 hover:underline">
                  → Wise・クレカ・両替ガイド
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
