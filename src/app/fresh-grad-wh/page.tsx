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
  title: '新卒でワーホリは就職に不利？3つの渡航パターンと帰国後就活戦略【2026年版】',
  description: '新卒でワーホリに行くと就活に不利？実は3つの渡航パターン（内定先入社後・卒業即出発・大学休学中）でそれぞれ戦略が違います。「新卒カード」を捨てる場合の対策と、帰国後の中途扱い就活のコツを解説。',
  path: '/fresh-grad-wh',
  keywords: [
    '新卒 ワーホリ 就職',
    '新卒 ワーホリ 不利',
    '新卒 ワーホリ 後悔',
    '大学卒業後 ワーホリ',
    'ワーホリ 内定 辞退',
    '大学休学 ワーホリ',
    '卒業 ワーホリ',
  ],
});

const TOC_HEADINGS = [
  { id: 'patterns', label: '3つの渡航パターン' },
  { id: 'pros-cons', label: '新卒ワーホリのメリットとデメリット' },
  { id: 'strategy', label: '帰国後の就活戦略（中途扱いの戦い方）' },
  { id: 'industries', label: '新卒ワーホリ経験者が評価される業界' },
  { id: 'faq', label: 'よくある質問' },
];

const PATTERNS = [
  {
    title: 'パターン1: 内定先に入社後、数年働いてからワーホリ',
    target: '安定志向・キャリア重視',
    pros: ['「新卒カード」を活用して大手企業に入れる', '社会人経験＋海外経験のダブルで強い', '帰国後の転職市場で評価される'],
    cons: ['ワーホリの年齢制限（30歳まで）が近づく', '一度入社した後の退職交渉が必要'],
  },
  {
    title: 'パターン2: 卒業後すぐワーホリ（新卒カード放棄）',
    target: '時間を最大化したい・自由派',
    pros: ['若いうちに長期海外滞在ができる', '時間・体力的に余裕あり', '人生のリセット期間として最適'],
    cons: ['新卒採用枠が使えない（帰国後は中途扱い）', '日本社会復帰時にハードル', '貯金がゼロからスタート'],
  },
  {
    title: 'パターン3: 大学休学中にワーホリ',
    target: '在学中に挑戦したい',
    pros: ['大学を卒業して新卒カードも維持できる', '休学期間として時間を確保', '英語力アップが就活アピールに'],
    cons: ['休学費用が発生する大学もある', '同期から1年遅れる', '休学手続きと帰国後の復学準備'],
  },
];

const STRATEGY_TIPS = [
  '「未経験職種×英語力」を武器に外資系・スタートアップを狙う',
  '中途採用エージェント（リクルート・doda・JAC等）に登録',
  'LinkedInプロフィールを英語で作成・発信',
  '帰国直前のTOEIC/IELTS再受験で最新スコアを準備',
  '志望業界のインターンシップに参加（中途扱いでも可）',
  '「ワーホリで身につけたスキル」を職務経歴書で具体的に書く（接客英語・現地でのチーム勤務など）',
];

const INDUSTRIES = [
  { name: '外資系IT・SaaS', reason: '英語必須、新卒同期文化が薄く中途採用が活発' },
  { name: 'ホテル・観光（インバウンド）', reason: '英語接客が即戦力評価。ワーホリでのカフェ・宿泊業経験が直接活きる' },
  { name: '英語スクール・留学エージェント', reason: 'ワーホリ体験そのものが商品知識' },
  { name: 'スタートアップ', reason: '新卒・中途の壁が薄い。多様なバックグラウンドを歓迎' },
  { name: '貿易・商社（一般職）', reason: '英語力＋積極性が評価される。新卒中途問わず採用' },
];

const FAQS = [
  {
    question: '新卒ワーホリは本当に就職に不利ですか？',
    answer:
      '伝統的な日本企業（新卒一括採用重視）では不利になりがちです。一方、外資系・スタートアップ・観光業など中途採用が活発な業界では「英語力＋海外経験＋若さ」がプラス評価。狙う業界次第で結果が大きく変わります。',
  },
  {
    question: '内定をもらった会社にワーホリ希望を伝えるべき？',
    answer:
      '入社後に1〜2年働いてから退職→ワーホリ、というルートが最も無難です。内定承諾後にワーホリで内定辞退すると、その企業との関係は切れます。入社後に退職を伝えるなら3〜4ヶ月前から準備を。',
  },
  {
    question: '大学休学のワーホリは何年生で行くのがベスト？',
    answer:
      '3年次後期〜4年次前期の1年間休学が定番。就活シーズン（4年次の春〜秋）と被ると不利になるので、復学後1年で就活する設計が安心です。早めに大学のキャリアセンターと相談を。',
  },
  {
    question: '帰国後の中途採用で「ワーホリ経験」はどう評価される？',
    answer:
      '評価する企業は「英語力＋実務経験＋海外慣れ」を魅力に感じます。逆に評価しない企業は「キャリアの空白」と見ます。応募時点で「ワーホリで身につけた具体スキル」を職務経歴書で言語化することが重要。',
  },
  {
    question: '新卒同期と1〜2年遅れることのデメリットは？',
    answer:
      '初任給・年次評価で1〜2年差がつく可能性はあります。ただし長期キャリアでは「海外経験＋英語」の方が市場価値が高くなる場合も多く、5年後・10年後で逆転するケースは少なくありません。',
  },
];

export default function FreshGradWhPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '新卒ワーホリと就活ガイド', url: '/fresh-grad-wh' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '新卒ワーホリと就活ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              新卒でワーホリは就職に不利？3つの渡航パターンと戦略
            </h1>
            <ArticleMetaBadge
              readingMinutes={8}
              updatedAt="2026年5月"
              targetAudience="新卒・大学生でワーホリを検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「新卒でワーホリに行ったら就職で不利になる？」
              <br />
              答えは「行き方と狙う業界次第」です。
              <br />
              この記事では、新卒ワーホリの3つの渡航パターン（入社後・卒業即・休学）と、それぞれの帰国後就活戦略を解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '新卒ワーホリの3パターン（入社後・卒業即・休学）と向いている人',
              '新卒カードを捨てた場合の帰国後「中途扱い」戦い方',
              'ワーホリ経験が評価される業界・職種5選',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* パターン */}
          <section id="patterns" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">3つの渡航パターン</h2>
            <div className="space-y-4">
              {PATTERNS.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg">{p.title}</h3>
                  <p className="text-xs text-primary-700 font-semibold mb-3">対象: {p.target}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-emerald-900 mb-1">メリット</p>
                      <ul className="text-xs text-emerald-900 space-y-1">
                        {p.pros.map((pro, j) => (
                          <li key={j}>・{pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-rose-900 mb-1">デメリット</p>
                      <ul className="text-xs text-rose-900 space-y-1">
                        {p.cons.map((con, j) => (
                          <li key={j}>・{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* メリデメ全体 */}
          <section id="pros-cons" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">新卒ワーホリのメリットとデメリット</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <h3 className="font-bold text-emerald-900 mb-3">⭕ メリット</h3>
                <ul className="text-sm text-emerald-900 space-y-2 list-disc pl-5">
                  <li>若いうちの長期海外滞在は人生最高の経験</li>
                  <li>英語力アップが転職市場で武器になる</li>
                  <li>時間・体力的に余裕がある</li>
                  <li>多様なバックグラウンドの友人ができる</li>
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                <h3 className="font-bold text-rose-900 mb-3">⚠️ デメリット</h3>
                <ul className="text-sm text-rose-900 space-y-2 list-disc pl-5">
                  <li>新卒一括採用の機会を失う</li>
                  <li>帰国後は「中途扱い」で経験不足扱い</li>
                  <li>同期から1〜2年遅れる感覚がある</li>
                  <li>貯金がゼロからスタート</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="自分に合う国を5問で診断"
            description="目的・期間・予算・治安・言語の希望から、9カ国の中から相性スコア付きでTOP3を提案。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/regret"
            secondaryLabel="後悔しないための教訓"
          />

          {/* 帰国後戦略 */}
          <section id="strategy" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">帰国後の就活戦略（中途扱いの戦い方）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              新卒カードを使わずに帰国すると、就職市場では「中途」扱いになります。下記6つを実践して「未経験職種＋英語力」の枠を狙いましょう。
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              {STRATEGY_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-primary-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 評価される業界 */}
          <section id="industries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">新卒ワーホリ経験者が評価される業界</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              「中途・未経験・英語力あり」というプロフィールを評価する業界を5つピックアップ。
            </p>
            <div className="space-y-3">
              {INDUSTRIES.map((ind) => (
                <div key={ind.name} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-1 text-base">{ind.name}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{ind.reason}</p>
                </div>
              ))}
            </div>
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
                <Link href="/age/20s-early" className="text-primary-600 hover:underline">
                  → 20代前半のワーホリ・留学ガイド
                </Link>
              </li>
              <li>
                <Link href="/after-wh" className="text-primary-600 hover:underline">
                  → 帰国後の就活完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/quit-job-wh" className="text-primary-600 hover:underline">
                  → 社会人ワーホリの退職と手続き
                </Link>
              </li>
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための教訓
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
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
