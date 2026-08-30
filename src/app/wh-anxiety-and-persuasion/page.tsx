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
  title: 'ワーホリの不安22選と親の説得方法｜出発前のもやもやを全部解消するガイド',
  description: 'ワーホリ前に抱えがちな22の不安と、それぞれの乗り越え方を解説。親に反対されたときの伝え方、説得材料、実渡航者の体験談データから「不安だったが杞憂だったこと」「実際に困ったこと」を分けて紹介。',
  path: '/wh-anxiety-and-persuasion',
  keywords: [
    'ワーホリ 不安',
    'ワーホリ 親 説得',
    'ワーホリ 怖い',
    'ワーホリ 反対 親',
    'ワーホリ 心配',
    'ワーホリ 行くのが怖い',
    'ワーホリ 初めて 不安',
  ],
});

const TOC_HEADINGS = [
  { id: 'anxieties', label: 'ワーホリ前の不安22選と乗り越え方' },
  { id: 'parent', label: '親に反対されたときの伝え方' },
  { id: 'real-vs-unfounded', label: '体験談データ：杞憂だったこと vs 実際に困ったこと' },
  { id: 'experiences', label: '実渡航者の声' },
  { id: 'faq', label: 'よくある質問' },
];

const ANXIETY_CATEGORIES = [
  {
    title: '言語面の不安（4つ）',
    items: [
      { worry: '英語が話せない', solution: '日系の仕事から始めて段階的にステップアップ。または3ヶ月フィリピン留学を挟む' },
      { worry: '現地の人と仲良くなれるか', solution: '語学学校・シェアハウス・職場の3拠点で自然に出会える' },
      { worry: '訛りが理解できるか', solution: '到着後1ヶ月で耳が慣れる人が多数。YouTubeで事前に各国の英語を聞いておく' },
      { worry: '電話や面接の英語が怖い', solution: '対面のウォークインで採用される率の方が高い。電話より顔を出した方が有利' },
    ],
  },
  {
    title: 'お金の不安（4つ）',
    items: [
      { worry: '貯金が足りないかも', solution: '最低100万円＋現地3ヶ月分の生活費で出発できる。詳しくは費用比較ガイドへ' },
      { worry: '現地で稼げるか不安', solution: 'オーストラリアの最低時給は約2,300円。週20〜30時間でも生活費は確保しやすい' },
      { worry: '帰国後に貯金がゼロ', solution: '帰国後3〜6ヶ月の生活費を別途確保しておけば安心' },
      { worry: '為替リスクが怖い', solution: 'Wiseで日本円を分割して両替すれば、為替変動の影響を平準化できる' },
    ],
  },
  {
    title: '安全・健康の不安（4つ）',
    items: [
      { worry: '治安が怖い', solution: 'カナダ・NZ・台湾など治安スコアの高い国を選ぶ。夜の一人歩きを避ける基本動作で大半は防げる' },
      { worry: '病気・ケガが心配', solution: '海外保険に加入すれば原則カバー。歯科や婦人科の対応有無を事前確認' },
      { worry: 'メンタルが心配', solution: '日本人カウンセラーのオンライン相談サービスを事前にブックマーク' },
      { worry: '事故にあったら', solution: '保険のロードサービス・救援費用がカバーされているか確認' },
    ],
  },
  {
    title: 'キャリアの不安（4つ）',
    items: [
      { worry: 'キャリアにブランクができる', solution: '帰国後のキャリアを「英語×現職スキル」で再定義すれば武器に変わる' },
      { worry: '帰国後に仕事が見つかるか', solution: '帰国3〜4ヶ月前から日本の転職エージェントとオンライン面談を開始' },
      { worry: '同期に遅れを取る', solution: '海外経験は1〜2年遅れではなく「異なる軸の経験」として評価される業界が多い' },
      { worry: '退職を伝えるのが怖い', solution: '3〜4ヶ月前の通告が標準。準備期間として理解されることが多い' },
    ],
  },
  {
    title: '生活面の不安（3つ）',
    items: [
      { worry: '住む場所が見つかるか', solution: '初月はホームステイか語学学校の寮、その後シェアハウスへ移るのが定番' },
      { worry: '食事が合わない', solution: '日本食材は大都市なら入手可。調味料の小瓶を1ヶ月分持参する人が多い' },
      { worry: '友達ができるか', solution: '語学学校で必ず友達はできる。日本人だけで固まらない意識を持つ' },
    ],
  },
  {
    title: '人間関係の不安（3つ）',
    items: [
      { worry: '親に反対されている', solution: '下記「親説得セクション」で具体的な伝え方を解説' },
      { worry: '恋人と離れるのが辛い', solution: '長距離恋愛で続いたカップル・別れたカップル両方の体験談あり。事前に話し合いを' },
      { worry: '友達との関係が変わるかも', solution: '本当に大事な友達なら帰国後も続く。新しい友達も増えるのがワーホリ' },
    ],
  },
];

const PARENT_PERSUASION_TIPS = [
  {
    parentConcern: '「キャリアが心配」',
    response: '帰国後の具体的な転職プラン（業界・目指す職種）を提示。「英語スコア+海外経験」が外資系や英語必須職で武器になる事例を見せる',
  },
  {
    parentConcern: '「お金が心配」',
    response: '出発資金と帰国後の生活費の予算表を見せる。「貯金100万円＋現地で月10万円稼げれば12ヶ月持つ」と具体数値で説明',
  },
  {
    parentConcern: '「治安が心配」',
    response: '渡航先の治安スコア（外務省渡航情報レベル）を提示。「カナダ・NZは日本より犯罪率が低い地域もある」など客観データを使う',
  },
  {
    parentConcern: '「健康が心配」',
    response: '海外保険のカバー範囲、現地の医療体制、緊急連絡先メモを見せて「準備済み」を示す',
  },
  {
    parentConcern: '「結婚・出産が遅れる」',
    response: '帰国後のライフプラン（30歳までに帰国＋転職＋結婚など）を明示。「人生の経験値を上げる時期」として位置づける',
  },
  {
    parentConcern: '「もう若くないのに」（30代）',
    response: '30代のワーホリは「キャリアブレイク後の再構築」として欧米では一般的。30代体験談を見せる',
  },
];

const FAQS = [
  {
    question: 'ワーホリ前の不安は普通のことですか？',
    answer:
      '当然です。誰でも不安になります。実際に渡航した方の多くが「出発前は不安MAXだったけど、行ってみたら大丈夫だった」と振り返ります。不安を「悪いもの」と捉えず、「事前準備のためのシグナル」として活用しましょう。',
  },
  {
    question: '親に絶対反対されています、どうすればいい？',
    answer:
      '親が反対する理由は「心配だから」と「自分の理解の外だから」の2つ。まず「心配する理由を全部書き出してもらう」ところから始めましょう。それぞれに具体的な対策（保険・予算・帰国後プラン）を示せば、納得してもらえる可能性が高まります。',
  },
  {
    question: '彼氏・彼女に反対されたらどうする？',
    answer:
      'ワーホリ期間中に長距離恋愛を続けるか、いったん区切りを付けるかは事前に話し合うべき大きなテーマ。「離れていても続くか」「帰国後どうしたいか」「どのくらいの頻度で連絡を取るか」を出発前に決めておきましょう。',
  },
  {
    question: '不安すぎて出発が近づくのが怖い',
    answer:
      '具体的な「やることリスト」を作って、1日1つずつ消していくと心が落ち着きます。住居予約・SIM準備・銀行口座開設・荷造りなど、To-Doに集中することで不安が軽減されます。',
  },
  {
    question: '出発直前にキャンセルしたくなったら？',
    answer:
      '本当にやりたくないなら無理しなくてOK。ただし「不安が原因のキャンセル」は後悔につながりがち。当サイトの体験談でも「行って良かった」が「行かなければよかった」を大きく上回ります。一度、信頼できる人に話してから決めるのがおすすめ。',
  },
];

export default async function WhAnxietyAndPersuasionPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  // 不安・心配関連の集計
  const anxietyMentions = countMentions(all, /(不安|心配|怖|迷|悩|ためら)/);
  const parentMentions = countMentions(all, /(親|家族|反対|説得|理解)/);

  const sample = anxietyMentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(不安|心配|怖|思って)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリの不安と親説得', url: '/wh-anxiety-and-persuasion' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリの不安と親説得' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリの不安22選と親の説得方法｜出発前のもやもや全部解消
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="ワーホリ出発前で不安・迷いがある方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「ワーホリ行きたい、でも本当に大丈夫？」
              <br />
              出発を決めた人の99%が、不安と向き合います。
              <br />
              この記事では、よくある22の不安それぞれに具体的な対策を、親に反対されたときの説得方法と合わせて解説。
              実際に渡航した77人の体験談から「杞憂だったこと」「実際に困ったこと」を分けて紹介します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '言語・お金・安全・キャリア・生活・人間関係の22の不安と乗り越え方',
              '親の心配タイプ別「具体的な説得材料」',
              '体験談から見る「行く前の不安」と「実際の困りごと」のギャップ',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 不安22選 */}
          <section id="anxieties" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ワーホリ前の不安22選と乗り越え方</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              ワーホリ志望者がよく抱える不安を6カテゴリ22項目に整理しました。それぞれに具体的な対策を1行で添えています。
            </p>
            <div className="space-y-6">
              {ANXIETY_CATEGORIES.map((cat) => (
                <div key={cat.title}>
                  <h3 className="font-bold text-base sm:text-lg mb-3 text-primary-700">{cat.title}</h3>
                  <div className="space-y-2">
                    {cat.items.map((item, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="font-bold text-sm text-rose-700 mb-1">😰 {item.worry}</p>
                        <p className="text-sm text-gray-700 leading-relaxed">💡 {item.solution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="ぴったりの国がわかれば、不安は大きく減ります"
            description="目的・期間・予算・治安の5問診断で、9カ国の中から相性スコア付きでTOP3を提案します。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/regret"
            secondaryLabel="後悔しないための教訓"
          />

          {/* 親説得 */}
          <section id="parent" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">親に反対されたときの伝え方</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              親が反対する理由は基本的に「心配だから」です。何を心配しているかを引き出し、それに対する具体的な対策を見せれば、納得してもらえる可能性が大きく上がります。
            </p>
            <div className="space-y-3">
              {PARENT_PERSUASION_TIPS.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="font-bold text-sm text-rose-700 mb-2">👨‍👩‍👧 親の心配: {t.parentConcern}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-emerald-700">💡 説得材料:</strong> {t.response}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-sky-50 border border-sky-100 rounded-xl p-5">
              <p className="text-sm text-sky-900 leading-relaxed">
                <strong>💡 説得のコツ</strong>: 親に「行くか行かないかの決断」を求めず、「行くことを前提に、何が心配かを一緒に解決していきたい」というスタンスで話すと、対立構図を避けられます。
              </p>
            </div>
          </section>

          {/* 杞憂 vs 実際に困ったこと */}
          <section id="real-vs-unfounded" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              体験談データ：杞憂だったこと vs 実際に困ったこと
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              当サイトの体験談から「不安」や「心配」「親」に関する言及があった件数を集計しました。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="text-sm text-gray-700 mb-2">
                  「不安・心配」言及
                </p>
                <p className="text-2xl font-bold text-primary-700 mb-1">
                  {anxietyMentions.containsCount}件 / {anxietyMentions.totalChecked}件
                </p>
                <p className="text-xs text-gray-500">
                  {anxietyMentions.percentage}% の体験談が、不安・心配について何かしら言及（参考値）
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="text-sm text-gray-700 mb-2">
                  「親・家族・反対」言及
                </p>
                <p className="text-2xl font-bold text-primary-700 mb-1">
                  {parentMentions.containsCount}件 / {parentMentions.totalChecked}件
                </p>
                <p className="text-xs text-gray-500">
                  {parentMentions.percentage}% の体験談が、家族・親について言及（参考値）
                </p>
              </div>
            </div>
          </section>

          {sample && quoteText && (
            <section id="experiences" className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">実渡航者の声</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                実際にワーホリへ行った方の、不安と向き合った体験談を引用します。
              </p>
              <QuoteFromExperience text={quoteText} experience={sample} truncated />
            </section>
          )}

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
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための7つの教訓
                </Link>
              </li>
              <li>
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語話せなくてもワーホリできる？
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
                <Link href="/age/20s-late" className="text-primary-600 hover:underline">
                  → 社会人ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合うワーホリ国
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
