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
  title: '女性一人でもワーホリは安全に行ける｜国選び・防犯対策・持ち物【体験談付き】',
  description: '「女性一人でワーホリは危険？」その不安に、実際に渡航した女性渡航者の声で答えます。治安の良いおすすめ国TOP5、住居・夜の外出・お金管理など4つの観点での防犯対策、女性ならではの持ち物リストを実体験ベースで解説。',
  path: '/women',
  keywords: [
    '女性 ワーホリ 一人',
    'ワーホリ 女性 一人',
    'ワーホリ 女性 危険',
    'ワーホリ 女性 おすすめ 国',
    '一人 ワーホリ 女',
    'ワーホリ 女性 持ち物',
    'ワーホリ 女性 安全',
  ],
});

const TOC_HEADINGS = [
  { id: 'safety-ranking', label: '女性渡航者の声から見る「安心して滞在できる国」TOP5' },
  { id: 'safety-tips', label: '女性ならではの防犯対策4つの観点' },
  { id: 'experiences', label: '女性渡航者の体験談' },
  { id: 'community', label: '女性のコミュニティ・出会い' },
  { id: 'faq', label: 'よくある質問' },
];

const SAFETY_TIPS = [
  {
    title: '住居選びの3つの鉄則',
    items: [
      '最初の1〜2ヶ月は語学学校の提携ホームステイか学生寮を選ぶ（防犯と生活の立ち上げが両方できる）',
      'シェアハウスに移るときは「女性専用」または「家主が女性」の物件を優先',
      '内見せずに契約しない（家賃前払いの詐欺被害は女性に集中しがち）',
    ],
  },
  {
    title: '夜の外出と移動',
    items: [
      '日没後の一人歩きはできるだけ避け、UberやタクシーをデフォルトにしてOK',
      '帰り際は友達や同僚に「今から帰る」とメッセージを送る習慣をつける',
      'ヘッドフォンは周りの音が聞こえなくなるので、片耳または音量は小さめに',
      'バーで知り合った相手についていかない（特に酔っているとき）',
    ],
  },
  {
    title: '貴重品とお金の管理',
    items: [
      'ショルダーバッグは斜めがけ＋前持ち。スリ対策に基本動作として身につける',
      'スマホは胸ポケットや内ポケットに。テラス席ではテーブルに置かない',
      'パスポートの原本は家に置き、外出時はコピーだけ持ち歩く',
      'デビットカード（Wise等）と現金を別の場所に分けて保管',
    ],
  },
  {
    title: '医療・健康・心の安全',
    items: [
      '海外旅行保険は「婦人科」「メンタルヘルス」がカバーされているか必ず確認',
      '生理用品は最初の1ヶ月分を日本から持参（現地のものが合わないときの保険）',
      '婦人科で使う英語の単語を事前にメモ（婦人科 = gynecology、生理 = period）',
      '日本人カウンセラーがいるオンライン相談サービスをブックマーク',
    ],
  },
];

const FAQS = [
  {
    question: '女性一人でワーホリは危険ですか？',
    answer:
      'リスクはゼロではないですが、過剰に怖がる必要はありません。実は女性の渡航者は男性より多いです。特に治安の良い国（カナダ・ニュージーランド・アイルランド・台湾など）では、女性の一人渡航が多数派になっています。この記事の防犯対策を実践すれば、リスクは大きく下げられます。',
  },
  {
    question: '女性に人気・おすすめのワーホリ国はどこ？',
    answer:
      'カナダ（治安・多様性）、ニュージーランド（自然・コミュニティ）、アイルランド（治安・英語）、オーストラリア（求人・気候）、台湾・韓国（日本から近く文化が似てる）が女性渡航者からの人気上位。治安を最優先するならカナダ・ニュージーランドが特に評価が高いです。',
  },
  {
    question: '現地での出会い・恋愛はどうなりがち？',
    answer:
      '語学学校・シェアハウス・職場での自然な出会いが多く、現地パートナーと付き合うケースもよくあります。一方で「ワーホリ恋愛は短期で終わりやすい」という声も。出会いはあくまで結果として捉えて、最初から恋愛目的にすると目標がブレやすいです。',
  },
  {
    question: '女性ならではの持ち物は何ですか？',
    answer:
      '生理用品（最初の1ヶ月分）、日本のスキンケア用品、化粧品、防犯ブザー、ヘアアイロン用の変圧器、ストッキング・パンプス（フォーマル用）、薄手のストール（教会・寺院訪問用）などが定番です。詳しくは「ワーホリ持ち物チェックリスト」も参考にしてください。',
  },
  {
    question: '帰国後のキャリアに、女性ならではのハンデはある？',
    answer:
      '結婚・出産のタイミングを気にする企業もあるので、復職や転職のときに質問されることはあります。「30歳前にワーホリ→帰国後すぐ転職」のスケジュールが王道。詳しくは「社会人ワーホリ完全ガイド」「帰国後就活ガイド」をチェックしてください。',
  },
];

function extractAdviceQuote(exp: Experience): string | null {
  const advice = exp.advice ?? '';
  const sentences = advice.split(/[。．！!?？]/);
  for (const s of sentences) {
    const trimmed = s.trim();
    if (trimmed.length > 20 && trimmed.length < 110) {
      return trimmed + '。';
    }
  }
  return null;
}

export default async function WomenPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));

  // 女性体験談を抽出
  const womenAll = experiencesData.contents.filter((e) => e.gender === 'female');
  const womenExperiences = womenAll.slice(0, 9);

  // 女性体験談からアドバイス引用を最大3件取得
  const womenQuotes = womenAll
    .map((e) => ({ exp: e, quote: extractAdviceQuote(e) }))
    .filter((x): x is { exp: Experience; quote: string } => x.quote !== null)
    .slice(0, 3);

  // 国別の女性体験談から治安スコア平均をランキング
  const safetyByCountry = new Map<string, { name: string; flag?: string; ratings: number[] }>();
  for (const exp of womenAll) {
    if (!exp.country?.id || exp.ratingSafety == null) continue;
    const entry = safetyByCountry.get(exp.country.id) ?? {
      name: exp.country.nameJp,
      flag: exp.country.flagEmoji,
      ratings: [],
    };
    entry.ratings.push(exp.ratingSafety);
    safetyByCountry.set(exp.country.id, entry);
  }

  const safetyRanking = Array.from(safetyByCountry.entries())
    .filter(([, v]) => v.ratings.length >= 1)
    .map(([slug, v]) => ({
      slug,
      name: v.name,
      flag: v.flag,
      avg: Math.round((v.ratings.reduce((s: number, n: number) => s + n, 0) / v.ratings.length) * 10) / 10,
      count: v.ratings.length,
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '女性一人ワーホリ', url: '/women' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '女性一人ワーホリ' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              女性一人でもワーホリは安全に行ける｜国選び・防犯対策・持ち物
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="女性でワーホリを検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「女性一人でワーホリって、危なくない？」「親に反対されそう…」
              <br />
              そう思って一歩を踏み出せずにいませんか？多くの女性が同じ不安を抱えています。
              <br />
              でも実は、ワーホリ渡航者は女性のほうが多数派。
              実際に渡航した女性の声から、安心して滞在できる国・防犯対策・持ち物までを具体的にまとめました。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '女性渡航者の評価から見た「治安が良い」TOP5の国',
              '住居・夜の外出・お金・健康の4観点での具体的な防犯対策',
              '実際に一人で渡航した女性の体験談と、そこから学べる教訓',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 治安ランキング */}
          {safetyRanking.length > 0 && (
            <section id="safety-ranking" className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                女性渡航者の声から見る「安心して滞在できる国」TOP5
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                女性渡航者の治安評価（5段階）の平均値が高い順にランキングしました。実際に滞在した方の声がベースなので、地球の歩き方より現場感のあるデータです。
              </p>
              <ol className="space-y-3">
                {safetyRanking.map((r, i) => (
                  <li
                    key={r.slug}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xl" aria-hidden="true">{r.flag}</span>
                        <Link
                          href={`/countries/${r.slug}`}
                          className="text-base sm:text-lg font-bold text-primary-700 hover:underline"
                        >
                          {r.name}
                        </Link>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        治安スコア <strong>{r.avg}</strong> / 5
                        <span className="ml-2 text-gray-500">（女性{r.count}名の評価平均）</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 中段CTA */}
          <MidCTA
            title="まだ国が決まっていない方へ"
            description="5問の診断で、9カ国の中からあなたに合う渡航先を1分で見つけられます。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/compare/countries"
            secondaryLabel="国別比較を見る"
          />

          {/* 防犯対策 */}
          <section id="safety-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">女性ならではの防犯対策4つの観点</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              「住居」「夜の外出」「お金」「健康」の4つを押さえれば、ほとんどのトラブルは事前に防げます。1つずつ確認しましょう。
            </p>
            <div className="space-y-4">
              {SAFETY_TIPS.map((tip, idx) => (
                <div key={tip.title} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-3 text-rose-700 text-base sm:text-lg">{tip.title}</h3>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-800">
                    {tip.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="mt-1.5 inline-block w-1.5 h-1.5 bg-rose-400 rounded-full shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {womenQuotes[idx] && (
                    <QuoteFromExperience
                      text={womenQuotes[idx].quote}
                      experience={womenQuotes[idx].exp}
                      truncated
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 女性体験談 */}
          {womenExperiences.length > 0 && (
            <section id="experiences" className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                女性渡航者の体験談（{womenExperiences.length}件）
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                実際にワーホリへ行った女性の体験談を抽出しました。年代・国・期間ごとのリアルな声を、自分と近いケースで比べてみてください。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {womenExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            </section>
          )}

          {/* 出会い・コミュニティ */}
          <section
            id="community"
            className="mb-12 bg-primary-50 border border-primary-100 rounded-xl p-5 sm:p-6"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-3 text-primary-900">
              女性のコミュニティ・出会い
            </h2>
            <p className="text-sm text-primary-900 leading-relaxed mb-3">
              女性同士のコミュニティは、ワーホリ初期の孤独感や情報不足を解消する強い味方です。語学学校・シェアハウス・職場以外の交流先として、以下を活用する女性が多くいます。
            </p>
            <ul className="text-sm text-primary-900 space-y-2 list-disc pl-5">
              <li>女性渡航者のFacebook・Instagramコミュニティ（国別・都市別）</li>
              <li>女性専用シェアハウス（家賃はやや高めだけど防犯◎）</li>
              <li>ヨガ・フィットネススタジオ（言語の壁を越えやすい）</li>
              <li>日本人女性会・コミュニティイベント</li>
              <li>恋愛・パートナー探しは「結果として出会う」ものと割り切る</li>
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
            <h2 className="text-base sm:text-lg font-bold mb-3">女性ワーホリで合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/packing" className="text-primary-600 hover:underline">
                  → ワーホリ持ち物チェックリスト（女性必需品も）
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合うワーホリ国
                </Link>
              </li>
              <li>
                <Link href="/compare/countries" className="text-primary-600 hover:underline">
                  → 国別 治安・費用ランキング
                </Link>
              </li>
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための7つの教訓
                </Link>
              </li>
              <li>
                <Link href="/age/20s-late" className="text-primary-600 hover:underline">
                  → 社会人ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/30s-guide" className="text-primary-600 hover:underline">
                  → 30代ワーホリ完全ガイド
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
