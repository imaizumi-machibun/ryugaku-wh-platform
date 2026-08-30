import type { Metadata } from 'next';
import Link from 'next/link';
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

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ・留学エージェントは必要？無料vs有料vs自力の比較【中立解説】',
  description: '「ワーホリエージェントは使うべき？」中立メディアとして、無料エージェント・有料エージェント・自力手配の3つを正直に比較。それぞれのメリット・落とし穴、向いている人、注意点を実渡航者の体験談ベースで解説します。',
  path: '/agent-comparison',
  keywords: [
    'ワーホリ エージェント 必要',
    'ワーホリ エージェント 無料',
    'ワーホリ エージェント 有料',
    'ワーホリ エージェント おすすめ',
    'ワーホリ 自分で 手配',
    'ワーホリ エージェント 比較',
    'ワーホリ エージェント デメリット',
  ],
});

const TOC_HEADINGS = [
  { id: 'three-options', label: '3つの選択肢：無料・有料・自力' },
  { id: 'free-agent', label: '無料エージェントの仕組みと注意点' },
  { id: 'paid-agent', label: '有料エージェントの仕組みと注意点' },
  { id: 'self-arrange', label: '自力手配の進め方' },
  { id: 'decision-matrix', label: '結局、自分はどれを選ぶべき？' },
  { id: 'experiences', label: '実渡航者の体験談' },
  { id: 'faq', label: 'よくある質問' },
];

const COMPARISON_TABLE = [
  { item: '費用', free: '0円', paid: '10〜30万円', self: '0円' },
  { item: '時間効率', free: '◎', paid: '◎', self: '△' },
  { item: '英語サポート', free: '○', paid: '◎', self: '×' },
  { item: '提案の中立性', free: '△（提携校への誘導あり）', paid: '○', self: '◎' },
  { item: 'カウンセリング深度', free: '△', paid: '◎', self: '×' },
  { item: '現地サポート', free: '○（提携校経由）', paid: '◎', self: '×' },
  { item: '緊急時対応', free: '△', paid: '◎', self: '×' },
  { item: '自由度', free: '△', paid: '○', self: '◎' },
];

const FREE_AGENT_NOTES = [
  '提携している語学学校を紹介することで、学校から手数料を得るビジネスモデル',
  '提携していない学校は案内されないので、選択肢が狭まる可能性',
  'カウンセリングは無料だが、自社主催のセミナー・イベントへの誘導もあり',
  '英語の手続き（学校申し込み・ビザ・保険）を代行してくれる',
  '帰国後のキャリア相談まで対応する会社もある',
];

const PAID_AGENT_NOTES = [
  '中立的に複数の学校を比較・提案してくれることが期待できる',
  '担当者が1人つき、出発前〜帰国後まで一貫サポート',
  '英語が苦手な方・初海外の方の安心料として有効',
  '料金体系は会社ごとに大きく異なる（10〜30万円が目安）',
  '対応の質はエージェントの担当者次第なので、複数社で面談を比較推奨',
];

const SELF_ARRANGE_STEPS = [
  '渡航国の決定（当サイトの診断ツールや国比較が参考）',
  '語学学校の決定（公式サイト or DBサイトから直接予約）',
  'ビザの申請（各国大使館の公式サイトから）',
  '航空券の予約（Skyscanner・Googleフライト）',
  '海外保険の加入（保険会社の公式サイト or 比較サイト）',
  '初期滞在先（ホームステイ・ホステル）の予約',
  '銀行口座開設・SIM契約は現地到着後',
];

const WHO_FOR = [
  {
    type: '🆓 無料エージェントが向いている人',
    items: [
      '英語の手続きに自信がない初心者',
      '時間をかけずに進めたい忙しい社会人',
      'カウンセリングを受けて方向性を決めたい',
      '相談料を払うのは抵抗があるが、サポートは欲しい',
    ],
  },
  {
    type: '💼 有料エージェントが向いている人',
    items: [
      '初海外で何もわからない状態',
      '英語が話せず、現地での緊急時対応に不安',
      '中立的な提案を受けたい',
      '帰国後のキャリアも一貫サポートしてほしい',
    ],
  },
  {
    type: '🛠️ 自力手配が向いている人',
    items: [
      '情報収集が好きで、自分で調べるのが苦じゃない',
      '英語の手続きにある程度自信がある',
      '完全に自由度の高い選択をしたい',
      '費用を1円でも抑えたい',
    ],
  },
];

const FAQS = [
  {
    question: '結局、エージェントは使うべきですか？',
    answer:
      '「英語に不安がある」「初海外」「忙しくて時間がない」のいずれかに該当するなら、エージェントを使う価値があります。逆に「情報収集が好き」「英語にある程度自信がある」なら、自力手配で十分です。3社程度のエージェントと面談してから、自力との比較で決めるのがおすすめ。',
  },
  {
    question: '無料エージェントは本当に無料ですか？',
    answer:
      '相談・手配の費用は無料です。エージェントは語学学校から手数料を受け取るビジネスモデル。ただし「提携校しか紹介されない」「学校料金は自分で公式予約するより同額か若干高い場合がある」などの注意点があります。',
  },
  {
    question: '有料エージェントの料金は何に対して払うのですか？',
    answer:
      'カウンセリング・複数校比較提案・出発準備サポート・現地サポート・帰国後支援などの「サービス料」です。会社により10〜30万円。明確な内訳説明がない会社は避けるのが無難。',
  },
  {
    question: 'エージェントを使わずに行った人はどのくらいいる？',
    answer:
      '当サイト体験談からも、自力で全手配した方は一定数います。特に2回目以降のワーホリや、英語にある程度自信がある方は自力派が増えます。Web情報が充実した現代では、自力でも十分可能。',
  },
  {
    question: 'エージェント選びで失敗しないコツは？',
    answer:
      '(1) 最低3社と無料カウンセリングを受ける、(2) 提携校だけでなく「自分で選んだ学校でも対応可能か」を質問、(3) 帰国後のサポートが具体的にどこまで含まれるか確認、(4) 強引な営業がないか観察、の4点が決定打になります。',
  },
];

export default async function AgentComparisonPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  // エージェント関連の言及をカウント
  const agentMentions = countMentions(all, /(エージェント|留学会社|斡旋|手配|自分で)/);
  const sample = agentMentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(エージェント|留学会社|斡旋|手配|自分で|自力)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリエージェント比較', url: '/agent-comparison' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリエージェント比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリ・留学エージェントは必要？無料 vs 有料 vs 自力の徹底比較
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="エージェントを使うべきか迷っている方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「ワーホリエージェントって、結局使った方がいいの？」
              <br />
              この質問への答えは、エージェント側もそうでない側もポジショントーク（自分の立場を有利にする発言）になりがちです。
              <br />
              この記事では、Study Work Hubが<strong>どの会社とも提携していない中立的なメディア</strong>として、無料・有料・自力の3つを正直に比較します。
            </p>
            <p className="text-xs text-gray-500 mt-3">
              ※ 本記事に特定エージェントへの推薦・アフィリエイトは含まれません。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '無料・有料・自力の3つそれぞれのメリット・落とし穴',
              '8項目の比較表で一目で違いがわかる',
              'タイプ別「あなたはどれを選ぶべき」判定',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 3つの選択肢 */}
          <section id="three-options" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">3つの選択肢：無料・有料・自力</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              ワーホリ・留学の手配方法は、大きく分けて3つ。それぞれビジネスモデルと提供価値が違います。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">比較項目</th>
                    <th className="px-3 py-3 font-semibold text-center whitespace-nowrap">無料エージェント</th>
                    <th className="px-3 py-3 font-semibold text-center whitespace-nowrap">有料エージェント</th>
                    <th className="px-3 py-3 font-semibold text-center whitespace-nowrap">自力手配</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium">{row.item}</td>
                      <td className="px-3 py-3 text-center">{row.free}</td>
                      <td className="px-3 py-3 text-center">{row.paid}</td>
                      <td className="px-3 py-3 text-center">{row.self}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 無料エージェント */}
          <section id="free-agent" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">無料エージェントの仕組みと注意点</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              無料エージェントは、語学学校から手数料を受け取るビジネスモデルです。そのため利用者は無料で相談・手配サポートを受けられます。一方、いくつかの注意点もあります。
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">押さえるべき5つのポイント</p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-800">
                {FREE_AGENT_NOTES.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 bg-primary-400 rounded-full shrink-0" aria-hidden="true" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 有料エージェント */}
          <section id="paid-agent" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">有料エージェントの仕組みと注意点</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              有料エージェントは、利用者から直接料金を受け取るため、提携校に縛られず中立的な提案が期待できます。料金体系は会社により10〜30万円。
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">押さえるべき5つのポイント</p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-800">
                {PAID_AGENT_NOTES.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 bg-primary-400 rounded-full shrink-0" aria-hidden="true" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="どの国に行くか、まず決めたい方へ"
            description="国選びがエージェント選びより先。5問の診断で、9カ国の中から相性スコアでTOP3を提案します。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/compare/countries"
            secondaryLabel="国別比較ランキング"
          />

          {/* 自力手配 */}
          <section id="self-arrange" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">自力手配の進め方</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              情報収集が好きな方・英語に自信がある方は、自力手配でも十分可能です。Web情報が充実した現代では、エージェントを使わない選択も合理的になってきています。
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">自力手配の7ステップ</p>
              <ol className="space-y-2 text-sm sm:text-base text-gray-800">
                {SELF_ARRANGE_STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 leading-relaxed">
                    <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 当サイトでは国選び（/matching）、費用比較（/budget）、持ち物（/packing）、ビザ・税金（/tax-return）などの情報をすべて無料公開しています。自力派の方の参考にお使いください。
            </p>
          </section>

          {/* タイプ別判定 */}
          <section id="decision-matrix" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">結局、自分はどれを選ぶべき？</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              タイプ別の判定軸をご紹介します。複数該当する場合は「最も大事な軸」で判断しましょう。
            </p>
            <div className="space-y-4">
              {WHO_FOR.map((w) => (
                <div key={w.type} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-3 text-base sm:text-lg">{w.type}</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {w.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-primary-600 font-bold shrink-0" aria-hidden="true">✓</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">実渡航者の体験談</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              当サイトの体験談から、エージェント・手配方法に関する言及を集計しました。
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{agentMentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {agentMentions.containsCount}件</strong>
                （{agentMentions.percentage}%）が「エージェント」「自分で手配」などについて言及していました。
              </p>
              <p className="text-xs text-gray-500">
                ※ advice/pros/cons から「エージェント/留学会社/斡旋/手配/自分で」のいずれかを含む体験談を抽出（参考値）。
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

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合うワーホリ国
                </Link>
              </li>
              <li>
                <Link href="/compare/countries" className="text-primary-600 hover:underline">
                  → 国別比較ランキング
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/wise-payment-guide" className="text-primary-600 hover:underline">
                  → Wise・クレカ・両替の完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/tax-return" className="text-primary-600 hover:underline">
                  → ワーホリの確定申告ガイド
                </Link>
              </li>
              <li>
                <Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">
                  → ワーホリの不安と親の説得
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
