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
  title: 'ワーホリ住居比較｜ホームステイ vs シェアハウス vs 寮の徹底比較',
  description: 'ワーホリの住居選びで迷ったら。ホームステイ・シェアハウス・学生寮の3タイプの費用・自由度・英語環境・防犯面を実渡航者の体験談データで徹底比較。タイプ別の向いている人も解説します。',
  path: '/housing-comparison',
  keywords: [
    'ワーホリ ホームステイ シェアハウス 比較',
    'ワーホリ 住居 選び方',
    'ワーホリ 寮 ホームステイ',
    'ワーホリ 住居 おすすめ',
    'ホームステイ シェアハウス どっち',
    '語学学校 寮 費用',
    'ワーホリ 滞在先',
  ],
});

const TOC_HEADINGS = [
  { id: 'three-types', label: '3つの住居タイプの基本' },
  { id: 'detail-comparison', label: '8項目で徹底比較' },
  { id: 'whom-for', label: 'タイプ別「あなたに合う住居」' },
  { id: 'phase-strategy', label: '滞在時期に応じた住み替え戦略' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const HOUSING_TYPES = [
  {
    emoji: '🏠',
    title: 'ホームステイ',
    summary: '現地の家族の家に住み、食事も提供される。語学学校が斡旋することが多い。',
    cost: '月13〜18万円（食事込み）',
    pros: ['現地家族の英語に毎日触れられる', '食事と洗濯が提供されるので生活立ち上げが楽', '困ったときに家族が助けてくれる'],
    cons: ['門限・食事時間など家族のルールに従う', 'プライバシーが限られる', '家族との相性ガチャがある'],
  },
  {
    emoji: '🏘️',
    title: 'シェアハウス',
    summary: '複数の住人と共有する一軒家・アパート。各自個室＋共用キッチンが基本。',
    cost: '月8〜15万円（光熱費別）',
    pros: ['自由度が高く生活リズムも自由', '世界中のルームメイトと交流できる', '英語環境を自分で選べる（日本人比率調整可）'],
    cons: ['食事・洗濯は自分で', '住人ガチャ（うるさい人・不潔な人）リスク', '物件探しの労力'],
  },
  {
    emoji: '🏫',
    title: '学生寮（語学学校付帯）',
    summary: '語学学校が運営する寮。同じ学校の生徒が集まる安心感あり。',
    cost: '月15〜22万円（食事別）',
    pros: ['学校までの通学が近い', '生徒同士のコミュニティができやすい', '管理人がいて防犯面が安心'],
    cons: ['食事は自分で', '料金が高めの傾向', '学校独自のルールあり'],
  },
];

const COMPARISON_TABLE = [
  { item: '月額費用', homestay: '13〜18万円（食事込）', share: '8〜15万円（食事別）', dorm: '15〜22万円（食事別）' },
  { item: '食事', homestay: '朝夕付きが多い', share: '自炊', dorm: '自炊（共用キッチン）' },
  { item: '英語環境', homestay: '◎ 家族との会話あり', share: '○ 住人次第で日本人比率調整可', dorm: '○ 生徒同士の英会話' },
  { item: '自由度', homestay: '△ 門限・ルールあり', share: '◎ 完全自由', dorm: '○ 学校のルールあり' },
  { item: 'プライバシー', homestay: '△ 個室はあるが家族と共有', share: '○ 個室＋共用', dorm: '○ 個室または2人部屋' },
  { item: '通学・交通', homestay: '△ 郊外が多く通学時間長い', share: '○ 自分で選べる', dorm: '◎ 学校最寄り' },
  { item: '防犯', homestay: '○ 家族がいて安心', share: '△ 住人による', dorm: '◎ 管理人あり' },
  { item: '生活立ち上げ', homestay: '◎ 楽（食事・洗濯付）', share: '× 自分で全部', dorm: '○ 食事以外は楽' },
];

const WHOM_FOR = [
  {
    type: '🏠 ホームステイが向いている人',
    items: [
      '初海外で生活立ち上げの不安を最小化したい',
      '英語環境にしっかり浸かりたい（家族と毎日会話）',
      '食事・洗濯・掃除を自分でやる時間を節約したい',
      '門限・ルールがある方が安心できる',
    ],
  },
  {
    type: '🏘️ シェアハウスが向いている人',
    items: [
      '費用を抑えたい',
      '自由なリズムで生活したい',
      '世界中の人と交流したい',
      '料理が好き or 自炊で節約したい',
    ],
  },
  {
    type: '🏫 学生寮が向いている人',
    items: [
      '通学時間を最小化したい',
      '同じ学校の友達を作りたい',
      '防犯面を最優先で考えたい',
      '学校から各種サポートを受けたい',
    ],
  },
];

const PHASE_STRATEGY = [
  {
    phase: '到着〜1ヶ月',
    recommend: 'ホームステイ or 学校寮',
    reason: '生活立ち上げが楽。現地の生活リズムに慣れる時期として最適。',
  },
  {
    phase: '2〜3ヶ月',
    recommend: 'シェアハウスへ移行',
    reason: '生活に慣れたら自由度の高いシェアハウスへ。費用も抑えられる。',
  },
  {
    phase: '4ヶ月以降',
    recommend: 'シェアハウス継続 or 1人暮らし',
    reason: '長期滞在なら、より自分好みの住居（女性専用シェア・1人暮らしなど）へ。',
  },
];

const FAQS = [
  {
    question: 'ホームステイは何ヶ月くらいするのがおすすめ？',
    answer:
      '一般的には1〜2ヶ月。最初の生活立ち上げの時期に最適です。それ以上長く続けると「家族の食事に飽きる」「自由度の低さがストレス」になりがち。語学学校の入学パックでは4週間〜8週間のホームステイが多く設定されています。',
  },
  {
    question: 'シェアハウスはどう探す？',
    answer:
      '主要サイトはGumtree（オーストラリア・イギリス）、Kijiji（カナダ）、TradeMe（NZ）。日本人向けには日豪プレス・JAMS.TV（豪）、e-Mapleなど。Facebook グループも活発です。内見は必ず実施し、複数物件を比較してから決めましょう。',
  },
  {
    question: '寮とホームステイの料金差はどれくらい？',
    answer:
      '寮の方が月3〜5万円高くなることが多いです（食事の有無もあるため一概には言えませんが）。語学学校パッケージで「ホームステイ込み」と「寮込み」を比較するのがおすすめ。学校によっては寮よりホームステイの方が安いケースもあります。',
  },
  {
    question: 'シェアハウスでルームメイトとトラブルになったら？',
    answer:
      '初期費用（ボンド/デポジット）を払っている場合、最低1〜2ヶ月の滞在が前提のことが多いです。トラブルの場合は家主に相談し、必要なら家主の許可を得て退去・別物件への引っ越しを。1物件目で長居しすぎない（3ヶ月単位で見直す）のがコツ。',
  },
  {
    question: '女性一人なら、どの住居が安全？',
    answer:
      '優先順位は (1) 女性専用シェアハウス、(2) ホームステイ、(3) 寮、(4) 共有シェアハウス。最初の1〜2ヶ月はホームステイ or 寮で生活基盤を作ってから、女性専用シェアハウスへ移るパターンが多くの女性渡航者から支持されています。',
  },
];

export default async function HousingComparisonPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  // 住居関連の言及をカウント
  const mentions = countMentions(all, /(ホームステイ|シェアハウス|シェア|寮|住居|住まい|引っ越し|内見)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''} ${sample.cons?.map((c) => c.text).join(' ') ?? ''}`,
        /(ホームステイ|シェアハウス|シェア|寮|住居|住まい)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ住居比較', url: '/housing-comparison' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ住居比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリ住居比較｜ホームステイ vs シェアハウス vs 寮 徹底解説
            </h1>
            <ArticleMetaBadge
              readingMinutes={8}
              updatedAt="2026年5月"
              targetAudience="住居タイプを決めかねている方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリの住居は「ホームステイ」「シェアハウス」「学生寮」の3タイプが主流。
              <br />
              費用・自由度・英語環境・防犯面で全部が違うので、自分の優先順位で選ぶ必要があります。
              <br />
              この記事では、3タイプの特徴を8項目で比較し、タイプ別「向いている人」と「滞在時期に応じた住み替え戦略」までまとめました。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '3タイプ（ホームステイ・シェアハウス・寮）の費用・自由度・英語環境の違い',
              '8項目の比較表で一目でわかる長所と短所',
              '到着初期〜長期滞在で住み替える「フェーズ別戦略」',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 3タイプ */}
          <section id="three-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">3つの住居タイプの基本</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              ワーホリで選べる住居は基本的に3パターン。それぞれの特徴を理解しましょう。
            </p>
            <div className="space-y-4">
              {HOUSING_TYPES.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg flex items-center gap-2">
                    <span aria-hidden="true">{h.emoji}</span>
                    {h.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{h.summary}</p>
                  <p className="text-xs text-primary-700 font-semibold mb-3">費用目安: {h.cost}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-emerald-900 mb-1">メリット</p>
                      <ul className="text-xs text-emerald-900 space-y-1">
                        {h.pros.map((p, j) => (
                          <li key={j}>・{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-rose-900 mb-1">注意点</p>
                      <ul className="text-xs text-rose-900 space-y-1">
                        {h.cons.map((c, j) => (
                          <li key={j}>・{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 比較表 */}
          <section id="detail-comparison" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">8項目で徹底比較</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              「ここを優先したい」を見つけて、自分に合う住居タイプを判定しましょう。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">項目</th>
                    <th className="px-3 py-3 font-semibold text-center whitespace-nowrap">🏠 ホームステイ</th>
                    <th className="px-3 py-3 font-semibold text-center whitespace-nowrap">🏘️ シェアハウス</th>
                    <th className="px-3 py-3 font-semibold text-center whitespace-nowrap">🏫 寮</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium whitespace-nowrap">{row.item}</td>
                      <td className="px-3 py-3 text-center text-xs">{row.homestay}</td>
                      <td className="px-3 py-3 text-center text-xs">{row.share}</td>
                      <td className="px-3 py-3 text-center text-xs">{row.dorm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="どの国に行くかが決まれば、住居も決めやすくなります"
            description="5問の診断で、9カ国の中からあなたに合う国を提案します。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/compare/countries"
            secondaryLabel="国別比較ランキング"
          />

          {/* タイプ別向き */}
          <section id="whom-for" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">タイプ別「あなたに合う住居」</h2>
            <div className="space-y-4">
              {WHOM_FOR.map((w) => (
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

          {/* フェーズ別戦略 */}
          <section id="phase-strategy" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">滞在時期に応じた住み替え戦略</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              1つの住居にずっといる必要はありません。時期に応じて住み替えるのが、コストと体験の両方を最適化するコツ。
            </p>
            <ol className="space-y-3">
              {PHASE_STRATEGY.map((p, i) => (
                <li key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-32 shrink-0">
                    <span className="inline-block text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded">
                      {p.phase}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1 text-base sm:text-lg">{p.recommend}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{p.reason}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              体験談77件から住居に関する言及があった件数を集計しました。
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{mentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {mentions.containsCount}件</strong>
                （{mentions.percentage}%）が住居について言及していました。
              </p>
              <p className="text-xs text-gray-500">
                ※ advice/pros/cons から「ホームステイ/シェアハウス/シェア/寮/住居/住まい/引っ越し/内見」のいずれかを含む体験談（参考値）。
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
                <Link href="/packing" className="text-primary-600 hover:underline">
                  → ワーホリ持ち物チェックリスト
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/women" className="text-primary-600 hover:underline">
                  → 女性一人ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/wise-payment-guide" className="text-primary-600 hover:underline">
                  → Wise・クレカ・両替の完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための7つの教訓
                </Link>
              </li>
              <li>
                <Link href="/guide/housing" className="text-primary-600 hover:underline">
                  → ワーホリガイド：住居フェーズ
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
