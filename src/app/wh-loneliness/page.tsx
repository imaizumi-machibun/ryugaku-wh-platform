import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
import { isPublished } from '@/lib/publish/schedule';

const PAGE_PATH = '/wh-loneliness';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ・留学の孤独・寂しさ対策完全ガイド｜発生タイミング・症状・コミュニティ',
  description: 'ワーホリ・留学中に必ず襲ってくる孤独・寂しさ。発生タイミング、症状、対処法、現地コミュニティ参加、日本人ネットワーク活用、メンタルヘルス維持術まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'ワーホリ 寂しい',
    'ワーホリ 孤独',
    '留学 寂しい',
    'ワーホリ 友達できない',
    '海外 一人 寂しい',
    'ワーホリ ホームシック',
  ],
});

const TOC_HEADINGS = [
  { id: 'reality', label: '孤独感はほぼ全員が経験する' },
  { id: 'timing', label: '寂しさが襲ってくる4つのタイミング' },
  { id: 'symptoms', label: 'よくある症状チェックリスト' },
  { id: 'remedy-1-community', label: '対処法①現地コミュニティに参加' },
  { id: 'remedy-2-japanese', label: '対処法②日本人ネットワーク活用' },
  { id: 'remedy-3-routine', label: '対処法③日常ルーティン作り' },
  { id: 'remedy-4-mental', label: '対処法④メンタルヘルス維持術' },
  { id: 'when-to-seek-help', label: '専門家に相談すべきサイン' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TIMING_PATTERNS = [
  {
    timing: '①渡航1-2週間目',
    detail: '「ハネムーン期」終了直後、生活困難＋言語の壁＋家族から離れた寂しさ',
    why: '興奮が冷めて現実認識、生活リズム未確立',
  },
  {
    timing: '②渡航1-3ヶ月目',
    detail: '「カルチャーショック期」、英語伸び悩み＋友達作り難航＋自己嫌悪',
    why: '期待と現実のギャップ、長期滞在の不安が表面化',
  },
  {
    timing: '③渡航6ヶ月目前後',
    detail: '「中だるみ期」、慣れたものの飽き＋将来不安＋日本のニュースで疎外感',
    why: '達成感ピーク後の停滞、将来選択への悩み',
  },
  {
    timing: '④帰国前2-3ヶ月',
    detail: '「お別れ期」、現地友人との別れ＋帰国後の不安＋日本社会への再適応',
    why: '楽しさ最高潮＋終了の喪失感の混在',
  },
];

const SYMPTOMS = [
  '夜寝つけない、または夜中によく目覚める',
  '食欲不振 or 過食、3kg以上の体重変動',
  'SNSで日本の友人投稿を見て泣きそうになる',
  '部屋から出るのが億劫、ホステル・自室に長時間こもる',
  '英語を話すのが怖くなる、シャイモードに',
  '日本食ばかり欲しい、現地食に飽きる',
  '「日本帰りたい」「もう無理かも」が頭をよぎる',
  'シャワー・歯磨き等の基本生活が疎かに',
];

const COMMUNITY_TIPS = [
  'Meetup.com で趣味別グループ参加（ハイキング・ヨガ・読書会等）',
  'Internations.org で多国籍コミュニティイベント',
  'Couchsurfing で現地ローカルとの交流（出会いも安全に）',
  'Conversation Exchange / Tandem で言語交換',
  'Volunteer活動（環境・動物・コミュニティ）',
  'スポーツクラブ・ジム参加で習慣化＋人脈',
  '教会・寺の英語コミュニティ（宗教関係なく歓迎）',
];

const JAPANESE_NETWORK = [
  'JET Programme卒業生・現役のFacebook groups',
  '在外日本人会のSNS・LINEグループ（都市別）',
  '日本食レストラン・日本食材店のスタッフ',
  '日本人向けカフェ・コミュニティスペース',
  '同じワーホリ団体・エージェント経由の留学生',
  'Twitter/Xでの「#ワーホリ豪」等タグ検索',
  '帰国者OB会（オンラインで参加可）',
];

const ROUTINE_TIPS = [
  '朝の決まった時間に起きる（生活リズム維持）',
  '週3-4回の運動習慣（ジム・ジョギング・ヨガ）',
  '料理を週末まとめて作るルーティン',
  '日記・ジャーナル毎日5分書く（感情整理）',
  '日本のドラマ・YouTube視聴は1日1時間まで',
  '日本との連絡は週2-3回（毎日だと依存）',
  '新しい趣味を1つ作る（写真・絵・楽器等）',
];

const MENTAL_TIPS = [
  '感情を抑えこまない、泣くべき時は泣く',
  '日本のカウンセラー・オンラインセラピー活用',
  '海外保険のメンタルヘルス補償使用',
  '日本の家族に「大変」と素直に話す',
  '日本帰国の選択肢を心の中に残しておく（安心感）',
  '完璧主義を捨てる「半人前でいい」',
  '小さな成功体験を意識して積む',
];

const PROFESSIONAL_SIGNS = [
  '2週間以上眠れない・食べられない',
  '生きる意味を考えてしまう、希死念慮',
  '自傷行為の衝動',
  'パニック発作（呼吸困難・動悸）が頻発',
  '人と会うのが怖くて1週間以上引きこもり',
  '感情のコントロールができない、ささいなことで号泣',
];

const FAQS = [
  {
    question: 'ワーホリで寂しくなるのはみんな経験する？',
    answer:
      'ほぼ100%。ハネムーン期が終わる渡航1-2週間目、カルチャーショック期の1-3ヶ月目に必ず襲ってきます。「自分だけ」と思いがちですが、世界中のワーホリ生が同じ経験をしています。SNSの「楽しそう」投稿の裏側で、皆寂しさと戦っています。',
  },
  {
    question: '友達ができない、どうしたら？',
    answer:
      '①シェアハウスで積極的に会話、②Meetup等で同じ趣味の人と接触、③Conversation Exchangeで言語交換相手と定期的に会う、④ジム・スポーツクラブで顔見知りを増やす、⑤バイト先で同僚との繋がり強化。1ヶ月で1人友達できれば順調、3ヶ月で5人になれば成功。',
  },
  {
    question: '日本に一時帰国した方がいい？',
    answer:
      '気軽に帰っていい。1-2週間の一時帰国でリフレッシュ→ワーホリに戻る人多い。航空券5-10万円の出費で精神的安定が買えるなら、十分価値あり。「途中で帰ったら負け」という思い込みは捨てよう。',
  },
  {
    question: '日本の家族と毎日連絡すべき？',
    answer:
      '逆効果のことも。毎日連絡だと日本への依存度UP、現地生活から目を背けがちに。週2-3回程度がベスト。一方で、本当に辛い時は遠慮なく連絡を。バランスが大切です。',
  },
  {
    question: 'カウンセラーに相談すべき症状は？',
    answer:
      '①2週間以上眠れない・食べられない、②希死念慮、③パニック発作頻発、④引きこもり1週間以上、⑤感情コントロール不能、のいずれか1つでも該当すれば即相談。海外保険のメンタルヘルス補償＋オンラインカウンセリング（日本語）が最も使いやすい。',
  },
];

export default async function WhLonelinessPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(寂しい|孤独|ホームシック|友達|友人|コミュニティ)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.cons?.map((c) => c.text).join(' ') ?? ''}`,
        /(寂しい|孤独|ホームシック|友達|友人|コミュニティ)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ・留学の孤独・寂しさ対策完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ・留学の孤独・寂しさ対策' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリ・留学の孤独・寂しさ対策完全ガイド
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ワーホリ・留学中で寂しさを感じている方／予防策を知りたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「海外なら楽しいだけ」は幻想。実はほぼ全てのワーホリ生・留学生が孤独感に襲われます。原因は環境変化・言葉の壁・人間関係のリセットなど複合的。
              <br />
              この記事では発生タイミング、症状、4つの対処法、専門家に相談すべきサインまで実体験ベースで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '孤独感はほぼ全員が経験、自分だけと思わない',
              '対処法はコミュニティ参加＋日本人ネットワーク＋日常ルーティン',
              '2週間以上の不眠・希死念慮等は即専門家相談',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* リアル */}
          <section id="reality" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">孤独感はほぼ全員が経験する</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              SNSの「楽しそう」投稿の裏側で、世界中のワーホリ生が孤独と戦っています。「自分だけ寂しい」と思うのは大きな誤解です。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed">
                海外生活の孤独感は、一時的な感情ではなく「環境変化＋人間関係リセット＋言語の壁」が組み合わさった<strong>正常な心理反応</strong>。
                適切に向き合えば、必ず乗り越えられます。むしろ孤独を経験することで、自分自身と深く向き合う成長機会にもなります。
              </p>
            </div>
          </section>

          {/* タイミング */}
          <section id="timing" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">寂しさが襲ってくる4つのタイミング</h2>
            <div className="space-y-3">
              {TIMING_PATTERNS.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{t.timing}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{t.detail}</p>
                  <p className="text-xs text-gray-500"><strong>なぜ:</strong> {t.why}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 症状 */}
          <section id="symptoms" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくある症状チェックリスト</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              3つ以上当てはまったら要注意。早めに対処法を実行しましょう。
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {SYMPTOMS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">☐</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 対処法1 */}
          <section id="remedy-1-community" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">対処法①現地コミュニティに参加</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {COMMUNITY_TIPS.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">👥</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="ワーホリのメンタルヘルスも合わせて"
            description="ホームシック・帰国後うつ・カウンセリング活用まで深掘りした内容も。"
            primaryHref="/wh-mental-health"
            primaryLabel="ワーホリのメンタルヘルス"
            secondaryHref="/wh-connections"
            secondaryLabel="ワーホリでの出会い"
          />

          {/* 対処法2 */}
          <section id="remedy-2-japanese" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">対処法②日本人ネットワーク活用</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {JAPANESE_NETWORK.map((j, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">🗾</span>
                  <span>{j}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 対処法3 */}
          <section id="remedy-3-routine" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">対処法③日常ルーティン作り</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {ROUTINE_TIPS.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">⏰</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 対処法4 */}
          <section id="remedy-4-mental" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">対処法④メンタルヘルス維持術</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {MENTAL_TIPS.map((m, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">💚</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 専門家相談 */}
          <section id="when-to-seek-help" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">専門家に相談すべきサイン</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              下記いずれか1つでも該当したら、即カウンセラー・医師に相談を。一人で抱え込まない。
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {PROFESSIONAL_SIGNS.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">🚨</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-gray-800 leading-relaxed">
              <strong className="text-sky-800">日本語対応カウンセラー:</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>・cotree（オンラインカウンセリング、日本語）</li>
                <li>・在外日本大使館の女性相談ダイヤル</li>
                <li>・「在外邦人メンタルヘルスサポート」（無料）</li>
                <li>・海外保険のメンタルヘルス補償</li>
              </ul>
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「寂しい・孤独・ホームシック・友達」関連の言及を集計。
                該当言及は <strong className="text-primary-700">{mentions.containsCount}件</strong>。
              </p>
              <p className="text-xs text-gray-500">
                ※ サンプル数が少ない場合は参考値として捉えてください。
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

          {/* 免責 */}
          <div className="mb-8 text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-4">
            ※ 本記事はメンタルヘルスに関する一般情報です。深刻な症状の場合は医師・心理カウンセラーにご相談ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-mental-health" className="text-primary-600 hover:underline">→ ワーホリのメンタルヘルス</Link></li>
              <li><Link href="/wh-connections" className="text-primary-600 hover:underline">→ ワーホリでの出会い</Link></li>
              <li><Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">→ 不安解消ガイド</Link></li>
              <li><Link href="/housing-comparison" className="text-primary-600 hover:underline">→ 住居タイプ比較</Link></li>
              <li><Link href="/regret" className="text-primary-600 hover:underline">→ ワーホリ後悔しないために</Link></li>
              <li><Link href="/wh-female-safety" className="text-primary-600 hover:underline">→ 女性ワーホリ安全</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
