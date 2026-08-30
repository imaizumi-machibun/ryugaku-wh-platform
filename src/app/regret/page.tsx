import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ExperienceCard from '@/components/experience/ExperienceCard';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import QuoteFromExperience from '@/components/article/QuoteFromExperience';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { getExperiences } from '@/lib/microcms/experiences';
import type { Experience } from '@/lib/microcms/types';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリで後悔した7パターンと、出発前にできる対策【体験談付き】',
  description: '実際にワーキングホリデーへ行った渡航者の声から、「後悔した」「失敗した」と感じた7つのパターンを抜粋。貯金不足・英語不足・国選びミスなど、出発前に知っておきたい教訓と回避策を体験談ベースでまとめました。',
  path: '/regret',
  keywords: [
    'ワーホリ 後悔',
    'ワーホリ 失敗',
    'ワーホリ やめとけ',
    'ワーホリ 後悔 した',
    'ワーホリ 行って良かった',
    'ワーホリ 失敗しないため',
    'ワーホリ 教訓',
  ],
});

const TOC_HEADINGS = [
  { id: 'patterns', label: 'ワーホリ経験者が「後悔した」7つのパターン' },
  { id: 'checklist', label: '後悔しないための「出発前チェックリスト」' },
  { id: 'experiences', label: '実体験から学ぶ：渡航者のリアルな声' },
  { id: 'faq', label: 'よくある質問' },
];

const REGRET_PATTERNS = [
  {
    id: 'pattern-1',
    title: '① 貯金が足りず途中で帰国',
    description: '「現地で稼げばなんとかなる」と思って出発。でも語学学校に通う期間中は働ける時間が限られ、想像より早くお金が尽きてしまうパターンです。',
    countermeasure: '初期費用と、現地での3〜6ヶ月分の生活費を必ず準備しておきましょう。最初の3ヶ月は「無職」として計算するのが安全です。',
    relatedLink: { href: '/budget', label: '国別の総費用を一覧で確認する' },
  },
  {
    id: 'pattern-2',
    title: '② 英語が話せず、仕事の選択肢が限られた',
    description: '「現地に行けばなんとかなる」と思って出発したものの、英語が話せないと日系の仕事やキッチンハンドに選択肢が限られ、結局英語も伸びにくいパターンです。',
    countermeasure: '出発前にTOEIC 600点くらいまで上げておくか、3ヶ月だけフィリピン留学で英語の基礎を作ってからワーホリに進む「2ステップ作戦」が定番です。',
    relatedLink: { href: '/no-english', label: '英語ゼロから始めるワーホリ準備ガイド' },
  },
  {
    id: 'pattern-3',
    title: '③ 国・都市選びを直感で決めて自分に合わなかった',
    description: '「友達がオーストラリアに行ったから」「なんとなくカナダ」と直感で決めて、現地の気候・物価・コミュニティが合わずに後悔。',
    countermeasure: '目的（英語・キャリア・節約・文化体験）と予算・期間で論理的に絞り込むのがコツ。診断ツールで客観的に候補を出してから決めましょう。',
    relatedLink: { href: '/matching', label: '5問の診断でぴったりの国を探す' },
  },
  {
    id: 'pattern-4',
    title: '④ 出発前の手続きを後回しにしてトラブル',
    description: '住民票・年金・健康保険・税金の手続きを後回しにしてしまい、帰国後に追加で税金を払うことになったり、年金を未納で困ったパターンです。',
    countermeasure: '出発1ヶ月前には役所で「海外転出届」を出しておきましょう。国民年金は任意で払い続けるか免除申請、健康保険は脱退の手続きが必要です。',
    relatedLink: { href: '/age/20s-late', label: '社会人ワーホリの退職・社保手続きガイド' },
  },
  {
    id: 'pattern-5',
    title: '⑤ 持ち物・準備で「これがあれば」と後悔',
    description: '常備薬・日本食の調味料・電化製品の変換プラグなど、現地で買えない（あるいは高すぎる）ものを持参せず後悔。逆に荷物が多すぎて移動が大変なケースも。',
    countermeasure: 'カテゴリ別のチェックリストで「日本でしか手に入らないもの」を優先して選びましょう。現地で買えるものは現地で買えばOKです。',
    relatedLink: { href: '/packing', label: '国別チェックリストで持ち物を確認' },
  },
  {
    id: 'pattern-6',
    title: '⑥ ホームシックや孤独感で早期帰国',
    description: '想像以上に孤独や文化ショックがきつく、最初の3ヶ月で帰国。「もう少し続ければよかった」と帰国後に後悔するパターンです。',
    countermeasure: '日本人コミュニティやSNSグループ、現地の友達を意識的に作りましょう。「3ヶ月の壁」を知っておくだけでも乗り越えやすくなります。',
    relatedLink: { href: '/guide/safety-mental', label: 'ホームシック・メンタル対策ガイド' },
  },
  {
    id: 'pattern-7',
    title: '⑦ 帰国後の就活で「ブランク」扱いされた',
    description: 'ワーホリ＝休暇と評価され、採用で不利になったケース。英語の最新スコアを持っていなくて「英語力を証明できなかった」という後悔も多いです。',
    countermeasure: '出発前に「帰国後どんな仕事をしたいか」を仮で決めておきましょう。現地でそのスキルを少しでも積み、帰国直前にTOEIC/IELTSを再受験しておくと武器になります。',
    relatedLink: { href: '/after-wh', label: '帰国後の就活完全ガイド' },
  },
];

const FAQS = [
  {
    question: 'ワーホリは本当に後悔することが多いですか？',
    answer:
      '実は「行って後悔した」より「行かなくて後悔した」という声の方が圧倒的に多いです。後悔している人の大半は「準備不足」「目的が曖昧」だったケース。この記事の7パターンを事前に潰しておけば、ほとんどの後悔は回避できます。',
  },
  {
    question: '「ワーホリはやめとけ」と言われる理由は？',
    answer:
      'よく言われるのは「キャリアにブランクができる」「貯金が減るだけ」「英語が話せるようにならない」の3つ。でもこれらは全部「目的を持たず・準備せず・期間を考えず行った場合」のリスクで、戦略的に進めれば武器に変えられます。',
  },
  {
    question: '何歳までにワーホリへ行くのがベスト？',
    answer:
      'ビザの年齢上限は多くの国で30歳まで（一部は35歳まで）。キャリア面でのベストは25〜28歳です。社会人経験、年齢的余裕、帰国後のリカバリー期間のバランスが取れます。30代以降は「短期語学留学＋海外就職活動」の組み合わせが現実的。',
  },
  {
    question: 'ワーホリで失敗しないために最も大事なことは？',
    answer:
      '「目的を1つに絞ること」が一番大事です。英語上達、海外就労経験、節約しながら世界を見る、文化体験——どれを最優先にするかで、選ぶ国・期間・予算が全部変わります。複数を欲張ると、全部が中途半端になりがち。',
  },
  {
    question: '帰国してから「行かなければよかった」と思うことはある？',
    answer:
      '帰国直後は「日本社会への再適応」や「貯金の減少」で一時的に後悔する人もいます。でも3〜6ヶ月経つと「行って良かった」に変わるケースがほとんど。帰国後の就活を出発前から設計しておけば、後悔ループには陥りません。',
  },
];

// 後悔・失敗に言及している体験談から短いコメントを抽出
function extractRegretQuote(exp: Experience): string | null {
  const advice = exp.advice ?? '';
  const conss = exp.cons?.map((c) => c.text).join(' ') ?? '';
  const source = `${advice} ${conss}`;
  // 「もっと〜」「〜べきだった」「〜できなかった」「後悔」「失敗」を含む文を切り出す
  const sentences = source.split(/[。．！!?？]/);
  for (const s of sentences) {
    const trimmed = s.trim();
    if (
      trimmed.length > 15 &&
      trimmed.length < 120 &&
      /(もっと|べきだった|できなかった|後悔|失敗|大変|しんどい|足りな|不足|苦労)/.test(trimmed)
    ) {
      return trimmed + '。';
    }
  }
  return null;
}

export default async function RegretPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));

  // 後悔・反省言及がある体験談を抽出（quoteも一緒に取得）
  const quotedExperiences = experiencesData.contents
    .map((e) => ({ exp: e, quote: extractRegretQuote(e) }))
    .filter((x): x is { exp: Experience; quote: string } => x.quote !== null)
    .slice(0, 6);

  const regretExperiences = quotedExperiences.map((x) => x.exp);
  // 7パターンと体験談を順番に組み合わせる（足りない分はループ）
  const patternQuotes = REGRET_PATTERNS.map((_, i) => quotedExperiences[i] ?? null);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリで後悔したこと', url: '/regret' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリで後悔したこと' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリで後悔した7パターンと、出発前にできる対策
            </h1>
            <ArticleMetaBadge
              readingMinutes={8}
              updatedAt="2026年5月"
              targetAudience="ワーホリ検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「ワーホリに行きたいけど、後悔したくない」「失敗パターンを知っておきたい」
              <br />
              そう思って調べていませんか？多くの人が同じ不安を抱えています。
              <br />
              でも結論から言うと、後悔の大半は「出発前の準備」で防げます。
              この記事では、77件の体験談から実際に「後悔した」と語られた7つのパターンと、それを防ぐ具体的な対策をまとめました。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'ワーホリ経験者が後悔した7パターン（貯金不足・英語・国選び・手続き・持ち物・孤独・帰国後）',
              '出発前に1日でできる「後悔しないチェックリスト」8項目',
              '体験談77件から抽出した「実際の失敗例」と回避策',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 7パターン */}
          <section id="patterns" className="mb-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">ワーホリ経験者が「後悔した」7つのパターン</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              ここから紹介する7つは、複数の体験談に共通して出てきた「後悔ポイント」です。1つずつ、原因と対策をセットで確認していきましょう。
            </p>

            {REGRET_PATTERNS.map((p, i) => {
              const quote = patternQuotes[i];
              return (
                <article
                  key={p.id}
                  id={p.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6"
                >
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-rose-700">{p.title}</h3>
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
                    {p.description}
                  </p>

                  <div className="bg-emerald-50 border-l-4 border-emerald-400 px-4 py-3 mb-4 rounded-r">
                    <p className="text-xs font-bold text-emerald-900 mb-1">対策</p>
                    <p className="text-sm text-emerald-900 leading-relaxed">{p.countermeasure}</p>
                  </div>

                  {quote && (
                    <QuoteFromExperience text={quote.quote} experience={quote.exp} truncated />
                  )}

                  <Link
                    href={p.relatedLink.href}
                    className="inline-flex items-center text-sm text-primary-600 hover:underline font-medium"
                  >
                    → {p.relatedLink.label}
                  </Link>
                </article>
              );
            })}
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="ぴったりの国がまだ決まっていない方へ"
            description="5問の診断で、人気9カ国の中からあなたに合うワーホリ先を1分で見つけられます。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる（1分）"
            secondaryHref="/compare/countries"
            secondaryLabel="国を一覧で比較する"
          />

          {/* チェックリスト */}
          <section id="checklist" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">後悔しないための「出発前チェックリスト」</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              出発1ヶ月前までに、以下8項目を確認しましょう。すべてに「☑」がつけば、後悔リスクは大きく下がります。
            </p>
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 sm:p-6">
              <ul className="space-y-3 text-sm sm:text-base text-gray-800">
                {[
                  'ワーホリの目的を1つに絞った（英語／キャリア／節約／文化体験）',
                  '初期費用＋現地3〜6ヶ月分の生活費（合計100〜150万円）を準備した',
                  '出発前にTOEIC/IELTSを受験して、出発時点のスコアを記録した',
                  '住民票・年金・健康保険・税金の手続きを役所で完了した',
                  'カテゴリ別の持ち物チェックリストで、荷物を最終確認した',
                  '到着初日〜1週間のプラン（宿・SIM・銀行口座）を決めた',
                  '帰国後にやりたい職種・キャリアを仮で決めた',
                  '海外保険・クレジットカード2枚・緊急連絡先メモを準備した',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary-600 font-bold shrink-0 mt-0.5" aria-hidden="true">
                      ☐
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 体験談 */}
          {regretExperiences.length > 0 && (
            <section id="experiences" className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                実体験から学ぶ：渡航者のリアルな声
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                体験談77件のうち、「後悔」「もっと〜すべきだった」などの言及がある体験談を抽出しました。実際の声を読むと、対策の重要性がより深く理解できます。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regretExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
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
            <h2 className="text-base sm:text-lg font-bold mb-3">後悔しないために合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合うワーホリ国
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/packing" className="text-primary-600 hover:underline">
                  → ワーホリ持ち物チェックリスト
                </Link>
              </li>
              <li>
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語話せなくてもワーホリできる？
                </Link>
              </li>
              <li>
                <Link href="/women" className="text-primary-600 hover:underline">
                  → 女性一人ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/after-wh" className="text-primary-600 hover:underline">
                  → 帰国後就活の完全ガイド
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
