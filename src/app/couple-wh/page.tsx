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
  title: 'カップル・夫婦でワーホリ｜メリット・落とし穴・成功させる7つのコツ',
  description: 'カップル・夫婦で一緒にワーキングホリデーへ行くメリット（貯金分担・相互サポート）と、よくある失敗パターン（喧嘩・別れ・自由度低下）。出発前に話し合うべきこと、成功させる7つのコツを解説。',
  path: '/couple-wh',
  keywords: [
    'カップル ワーホリ',
    '夫婦 ワーホリ',
    'カップル ワーホリ 別れる',
    'ワーホリ 彼氏 彼女 一緒',
    '二人でワーホリ',
    'カップル 留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'pros-cons', label: 'カップルワーホリのメリット・デメリット' },
  { id: 'failure-patterns', label: 'よくある失敗パターン3選' },
  { id: 'visa', label: 'ビザ申請の3パターン' },
  { id: 'pre-talk', label: '出発前に話し合うべき7つのこと' },
  { id: 'tips', label: '成功させる7つのコツ' },
  { id: 'faq', label: 'よくある質問' },
];

const PROS_CONS = {
  pros: [
    '家賃・光熱費を半分にできる（カップル向けスタジオで月15〜25万円）',
    '貯金を共同で管理して効率化できる',
    'メンタル面で支え合える（ホームシック軽減）',
    '英語学習を相互サポートできる',
    '帰国後も思い出を共有できる',
    '永住権ルートで配偶者ビザ申請に進める可能性',
  ],
  cons: [
    '日本人2人で固まり英語が伸びない罠',
    '価値観の違いで現地で大喧嘩',
    '自由度が落ちる（一人なら出会えた友達を逃す）',
    'どちらかが帰りたいと言い出すリスク',
    '別れた場合、住居・お金の精算が大変',
    'パートナーに依存して挑戦しない可能性',
  ],
};

const FAILURE_PATTERNS = [
  {
    title: '① 日本人カップルだけで固まり英語ゼロ',
    detail: '二人とも同じ語学学校・同じシェアハウス・同じ職場になると、結局日本語生活になりがち。英語が伸びない最大要因。',
  },
  {
    title: '② 価値観の違いで大喧嘩、最悪別れ',
    detail: '異国の地で生活すると、お金・食事・友達関係などで普段見えなかった価値観の違いが露呈。喧嘩→別れに発展するケースは少なくない。',
  },
  {
    title: '③ 一方が依存気味になり成長機会を失う',
    detail: '英語ができる方に頼り切る、社交的な方に依存する、などで一方が成長機会を失う。「来なきゃよかった」感覚に。',
  },
];

const VISA_PATTERNS = [
  {
    title: 'パターンA: 二人とも同時にワーホリビザ申請',
    detail: '最も一般的。同じ国・同じ時期に出発。お互い独立した立場で滞在。',
  },
  {
    title: 'パターンB: 一方がワーホリ・他方が同行家族ビザ',
    detail: 'カナダなど一部の国では、ワーホリビザ保有者の同行家族向けビザがあり。配偶者・パートナーが同行可能。',
  },
  {
    title: 'パターンC: 一方が学生ビザ・他方が同行配偶者ビザ',
    detail: '長期で安定した滞在を希望する場合。一方が語学学校・大学院へ通い、もう一方が同行家族として就労。',
  },
];

const PRE_TALK_ITEMS = [
  '滞在期間と帰国時期（同じ？別々？）',
  '生活費の分担方法（折半？収入比？）',
  '住居（カップル専用？シェアハウス別？）',
  '英語学習の方針（同じ学校？別の学校？）',
  '別行動の頻度（週何回までOK？）',
  '別れた場合の住居・お金の精算ルール',
  '帰国後の関係性（結婚？継続？区切り？）',
];

const SUCCESS_TIPS = [
  '異なる語学学校 or クラスを選んで英語環境を分ける',
  '友達は別々に作る意識を持つ',
  '週に1〜2日は別行動の日を作る',
  '生活費は厳密に折半 or 透明な共有口座管理',
  '喧嘩したら24時間冷却期間ルールを設定',
  '日本人コミュニティに「2人セット」で行きすぎない',
  '帰国後のキャリア計画も2人で具体化',
];

const FAQS = [
  {
    question: 'カップルでワーホリは別れやすいって本当？',
    answer:
      '事実、別れるカップルもいます。理由は「環境変化への耐性ストレス」「価値観の違いの露呈」「自由度の制限」など。一方、絆が深まるカップルも多数。事前の話し合いと共有ルールが成否を分けます。',
  },
  {
    question: '結婚していないカップルでも同居できる？',
    answer:
      '可能です。多くの国では同居に法的制約なし。シェアハウスのカップル部屋・スタジオ物件など、選択肢豊富。婚姻関係を証明する必要はありません。',
  },
  {
    question: 'カップル向けの住居はどうやって探す？',
    answer:
      'Gumtreeなどのシェアハウスサイトで「Couple」「Couple room」と検索。または独立スタジオ・1ベッドルームアパートを探す。家賃は1人暮らしの1.5倍くらいが目安。',
  },
  {
    question: 'カップルワーホリでの結婚って実際ある？',
    answer:
      '帰国後に結婚するカップルは多数。共同生活で互いの価値観・経済観・将来観が見え、結婚判断につながりやすい。逆にミスマッチが見えて別れるケースも。「結婚前のリハーサル期間」として活用する方も。',
  },
  {
    question: '別れた場合、ビザはどうなる？',
    answer:
      'ワーホリビザは個人ごとに発行されているので、別れても各自の滞在は継続可能。同行家族ビザの場合は元配偶者の滞在資格と紐づくため、独立ビザへの切り替え or 帰国の判断が必要。',
  },
];

export default function CoupleWhPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'カップル・夫婦のワーホリガイド', url: '/couple-wh' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'カップル・夫婦のワーホリガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              カップル・夫婦でワーホリ｜メリット・落とし穴・成功させる7つのコツ
            </h1>
            <ArticleMetaBadge
              readingMinutes={7}
              updatedAt="2026年5月"
              targetAudience="カップル・夫婦で渡航検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              カップル・夫婦で一緒にワーホリは、メリットも大きいが落とし穴もあります。
              <br />
              この記事では、よくある失敗パターン、ビザ申請の3パターン、出発前の話し合い項目、成功させる7つのコツを解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'カップルワーホリのメリット（貯金分担・相互サポート）と落とし穴',
              'よくある失敗パターン3選と回避策',
              '出発前に必ず話し合うべき7項目',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* メリット・デメリット */}
          <section id="pros-cons" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">カップルワーホリのメリット・デメリット</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <h3 className="font-bold text-emerald-900 mb-3">⭕ メリット</h3>
                <ul className="text-sm text-emerald-900 space-y-2 list-disc pl-5">
                  {PROS_CONS.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                <h3 className="font-bold text-rose-900 mb-3">⚠️ デメリット</h3>
                <ul className="text-sm text-rose-900 space-y-2 list-disc pl-5">
                  {PROS_CONS.cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 失敗パターン */}
          <section id="failure-patterns" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくある失敗パターン3選</h2>
            <div className="space-y-3">
              {FAILURE_PATTERNS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base text-rose-700">{f.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{f.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="2人に合う国を5問で診断"
            description="目的・期間・予算・治安の希望から、9カ国の中から相性スコアでTOP3を提案。2人で別々に診断して結果を比較するのも◎。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/compare/countries"
            secondaryLabel="国別比較ランキング"
          />

          {/* ビザ */}
          <section id="visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザ申請の3パターン</h2>
            <div className="space-y-3">
              {VISA_PATTERNS.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base text-primary-700">{v.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{v.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 出発前に話し合うべき */}
          <section id="pre-talk" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">出発前に話し合うべき7つのこと</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {PRE_TALK_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 成功させるコツ */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">成功させる7つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SUCCESS_TIPS.map((t, i) => (
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

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/family-study" className="text-primary-600 hover:underline">
                  → 親子留学完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/housing-comparison" className="text-primary-600 hover:underline">
                  → 住居タイプ比較
                </Link>
              </li>
              <li>
                <Link href="/wh-connections" className="text-primary-600 hover:underline">
                  → ワーホリでの出会い・人間関係
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/30s-guide" className="text-primary-600 hover:underline">
                  → 30代ワーホリ完全ガイド
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
