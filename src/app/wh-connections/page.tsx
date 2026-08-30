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
  title: 'ワーホリでの出会い・人間関係のリアル｜友達作り・恋愛・コミュニティ',
  description: 'ワーホリで友達はできる？恋愛はある？日本人ばかりにならないコツは？実渡航者の体験談データをもとに、ワーホリ中の出会い・人間関係・コミュニティへの参加方法を解説します。',
  path: '/wh-connections',
  keywords: [
    'ワーホリ 出会い',
    'ワーホリ 恋愛',
    'ワーホリ 友達 作り方',
    'ワーホリ 日本人 ばかり',
    'ワーホリ 人間関係',
    'ワーホリ コミュニティ',
    'ワーホリ 彼氏 彼女',
  ],
});

const TOC_HEADINGS = [
  { id: 'who-meets', label: 'ワーホリで出会える人' },
  { id: 'where-to-meet', label: '出会いの場5選' },
  { id: 'avoid-japanese', label: '日本人ばかりにならない3つのコツ' },
  { id: 'romance', label: '恋愛・パートナーシップのリアル' },
  { id: 'experiences', label: '体験談から見る出会いの実態' },
  { id: 'faq', label: 'よくある質問' },
];

const MEET_PLACES = [
  {
    place: '🏫 語学学校',
    detail: 'クラスメイトは世界各国から。最初の友達作りの定番。授業外でのカフェ・観光のお誘いも自然に発生。',
  },
  {
    place: '🏠 シェアハウス',
    detail: 'ルームメイトとの距離が近い。共用キッチン・リビングで毎日会話できる環境。',
  },
  {
    place: '💼 職場（カフェ・レストラン）',
    detail: '同僚と業務後の飲み会で仲良くなれる。現地ネイティブとの関係構築に最適。',
  },
  {
    place: '🎯 Meetup・趣味コミュニティ',
    detail: 'スポーツ・言語交換・ハイキング・読書会など、共通の趣味で集まるグループ。Meetup.comが定番。',
  },
  {
    place: '⛪ ボランティア・教会',
    detail: '地域コミュニティへの参加。利害関係のない人間関係が築ける。英語環境としても優秀。',
  },
];

const AVOID_TIPS = [
  {
    title: '住居選びで意識する',
    detail: '日本人比率が高いシェアハウスを避ける。「インターナショナル」を謳う物件、または家主が現地人の物件を選ぶ。',
  },
  {
    title: '日本人コミュニティとの距離を意識する',
    detail: '完全に避ける必要はない（情報源として有益）が、メインの交流相手を日本人にしない。週1〜2回までと自分でルール化。',
  },
  {
    title: '英語環境の選択を意識する',
    detail: '語学学校選びでは「日本人比率10%以下」を条件に。職場も日系より英語環境を優先。',
  },
];

const ROMANCE_REALITY = [
  '現地パートナーとの出会いは、語学学校・シェアハウス・職場・アプリの4経路が中心',
  '日本人ワーホリ同士でカップルになるパターンも多い',
  '短期間の関係になりがち（ワーホリ自体が時間制限あるため）',
  '帰国後に長距離恋愛になり、別れる or 結婚に進むの両極端',
  'Tinder・Bumbleなどのアプリは現地で活発に利用される',
  '恋愛目的で渡航すると目標がブレやすい。「結果として出会う」スタンスがおすすめ',
];

const FAQS = [
  {
    question: 'ワーホリで友達はすぐできますか？',
    answer:
      '語学学校に通う場合、最初の1週間で複数の友達ができることがほとんどです。シェアハウスや職場でも自然に交流できます。「友達ができない」と感じる場合は、住居や学校の選び方を見直す or Meetupに参加してみましょう。',
  },
  {
    question: 'ワーホリ中に恋愛するのはありですか？',
    answer:
      'もちろんあり。実際にワーホリ中に現地パートナーや他国出身者とお付き合いするケースは多いです。ただし、恋愛目的で渡航するとワーホリ本来の目標（英語・キャリア）がブレやすい点に注意。「結果として出会う」スタンスがおすすめ。',
  },
  {
    question: '日本人ばかりになってしまったらどうする？',
    answer:
      '住居を変える、職場を変える、語学学校のクラスを変える、Meetupに参加するなど、環境を意識的に変えることが必要。自分の意志一つで変えられます。「3ヶ月リセット」と決めて住居・職場を切り替える人も多いです。',
  },
  {
    question: '長距離恋愛になった場合、続きやすい？',
    answer:
      '事前の合意と頻繁な連絡があれば続くケースは多いです。一方、ワーホリ中の新しい刺激と日本での日常生活の温度差で別れることも。出発前に「連絡頻度」「再会のタイミング」「結婚の意思」を話し合っておくと、関係が安定しやすいです。',
  },
  {
    question: 'ワーホリ中に結婚した人はいますか？',
    answer:
      'います。現地パートナーと結婚して永住権ルートに進む方、ワーホリで出会った日本人と帰国後結婚する方、両方のパターンがあります。ただし「結婚目的のワーホリ」は推奨されません。あくまで結果として。',
  },
];

export default async function WhConnectionsPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(友達|出会|恋人|彼氏|彼女|パートナー|人間関係|コミュニティ|現地の人)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(友達|出会|恋人|彼氏|彼女|パートナー|人間関係|コミュニティ|現地の人)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリでの出会い・人間関係', url: '/wh-connections' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリでの出会い・人間関係' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリでの出会い・人間関係のリアル｜友達作り・恋愛・コミュニティ
            </h1>
            <ArticleMetaBadge
              readingMinutes={8}
              updatedAt="2026年5月"
              targetAudience="ワーホリでの人間関係が気になる方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「ワーホリで友達はできる？」「日本人ばかりにならない？」「恋愛もある？」
              <br />
              ワーホリでの出会い・人間関係について、実渡航者の体験談データをもとに、リアルな実態と上手な人間関係の作り方を解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'ワーホリで出会える人の種類（クラスメイト・ルームメイト・職場・コミュニティ）',
              '日本人ばかりにならない3つのコツ',
              '恋愛・パートナーシップのリアル6選',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 出会える人 */}
          <section id="who-meets" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ワーホリで出会える人</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              ワーホリで出会う人の種類は大きく分けて4タイプ。
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>世界各国のワーホリ仲間</strong>：韓国・台湾・ヨーロッパ系が多数。語学学校・シェアハウス・職場で自然に交流。</li>
                <li><strong>現地ネイティブ</strong>：職場・趣味コミュニティ・パートナー経由で出会える。ワーホリ初期は接点が限られるので、意識的にコミュニティ参加が必要。</li>
                <li><strong>日本人ワーホリ仲間</strong>：情報源として有益。ただしメインの交流相手にしないバランスが大事。</li>
                <li><strong>日本人駐在員・現地で働く日本人</strong>：仕事・キャリア面でのアドバイザーになる。LinkedIn経由で繋がるパターンも。</li>
              </ul>
            </div>
          </section>

          {/* 出会いの場 */}
          <section id="where-to-meet" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">出会いの場5選</h2>
            <div className="space-y-3">
              {MEET_PLACES.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-1 text-base">{p.place}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="女性一人ワーホリの安全対策と国選び"
            description="女性渡航者向けの安心ガイドもあわせてどうぞ。"
            primaryHref="/women"
            primaryLabel="女性一人ワーホリ完全ガイド"
            secondaryHref="/matching"
            secondaryLabel="国診断をはじめる"
          />

          {/* 日本人ばかりを避ける */}
          <section id="avoid-japanese" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">日本人ばかりにならない3つのコツ</h2>
            <div className="space-y-3">
              {AVOID_TIPS.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base">{i + 1}. {t.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{t.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 恋愛 */}
          <section id="romance" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">恋愛・パートナーシップのリアル</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ワーホリの恋愛事情について、知っておきたい6つのポイントです。
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-100 rounded-xl p-5">
              {ROMANCE_REALITY.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0 mt-0.5">♡</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見る出会いの実態</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{mentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {mentions.containsCount}件</strong>
                （{mentions.percentage}%）が「友達・出会い・人間関係」について言及していました。
              </p>
              <p className="text-xs text-gray-500">
                ※ advice/pros/cons から関連キーワードを含む体験談を抽出（参考値）。
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
                <Link href="/women" className="text-primary-600 hover:underline">
                  → 女性一人ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/housing-comparison" className="text-primary-600 hover:underline">
                  → 住居タイプ比較
                </Link>
              </li>
              <li>
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語話せなくてもワーホリ
                </Link>
              </li>
              <li>
                <Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">
                  → ワーホリの不安と親説得
                </Link>
              </li>
              <li>
                <Link href="/couple-wh" className="text-primary-600 hover:underline">
                  → カップル・夫婦でワーホリ
                </Link>
              </li>
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための教訓
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
