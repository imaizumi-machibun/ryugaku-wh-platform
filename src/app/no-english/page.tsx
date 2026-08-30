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
import ServiceHubLink from '@/components/affiliate/ServiceHubLink';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { getExperiences } from '@/lib/microcms/experiences';
import { getLanguageProgressStats, extractMatchingSentence } from '@/lib/stats/experiences-cross';
import type { Experience } from '@/lib/microcms/types';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '英語が話せなくてもワーホリできる｜国・仕事・準備の5ステップ',
  description: '英語ゼロでもワーホリは行けます。フィリピン留学を組み合わせる2ステップ戦略、英語が話せなくても就ける仕事、出発前にやるべき5ステップ準備を実体験ベースで解説。さらに渡航後に英語が上達する人としない人の違いも、体験談データから分析しました。',
  path: '/no-english',
  keywords: [
    '英語 話せない ワーホリ',
    'ワーホリ 英語 できない',
    'ワーホリ 英語 不要',
    'ワーホリ 英語 どのくらい',
    '英語 ゼロ 留学',
    'ワーホリ 初心者',
    'フィリピン 留学 英語ゼロ',
    '英語 上達 ワーホリ',
  ],
});

const TOC_HEADINGS = [
  { id: 'countries', label: '英語ゼロでも始めやすい国TOP5' },
  { id: 'jobs', label: '英語が話せなくても就ける仕事' },
  { id: 'preparation', label: '英語ゼロから始める5ステップ準備法' },
  { id: 'who-improves', label: '英語が伸びる人・伸び悩む人の違い' },
  { id: 'experiences', label: '英語初級から渡航した方の体験談' },
  { id: 'faq', label: 'よくある質問' },
];

const NO_ENGLISH_COUNTRIES = [
  {
    slug: 'philippines',
    flag: '🇵🇭',
    name: 'フィリピン',
    reason: 'マンツーマン語学学校が主流。英語ゼロから3ヶ月で日常会話レベルまで到達した事例が多数あります。',
    cost: '月15万円〜',
    learnPace: '集中して英語を伸ばすなら最有力',
  },
  {
    slug: 'taiwan',
    flag: '🇹🇼',
    name: '台湾',
    reason: '日本語が通じやすく、漢字文化圏で生活ストレスが少ないです。英語よりも中国語を学ぶ環境として選ぶ人が増えています。',
    cost: '月15〜20万円',
    learnPace: '英語より中国語を伸ばしたい人向け',
  },
  {
    slug: 'south-korea',
    flag: '🇰🇷',
    name: '韓国',
    reason: '日本人観光客に慣れたお店が多く、日本語表記もよく見かけます。韓国語学習が中心になります。',
    cost: '月18〜25万円',
    learnPace: '英語より韓国語を伸ばしたい人向け',
  },
  {
    slug: 'malta',
    flag: '🇲🇹',
    name: 'マルタ',
    reason: '英語圏のリゾート国。日本人が少ないので、必然的に英語漬けになれます。語学学校も充実。',
    cost: '月18〜25万円',
    learnPace: '英語環境にどっぷり浸かりたい人向け',
  },
  {
    slug: 'australia',
    flag: '🇦🇺',
    name: 'オーストラリア',
    reason: '日本人コミュニティや日系の求人が大きく、英語ゼロでも生活を始められます。語学学校に通う人も多いです。',
    cost: '月25〜35万円',
    learnPace: '生活しながら段階的に伸ばしたい人向け',
  },
];

const NO_ENGLISH_JOBS = [
  { job: '日系レストラン・寿司屋', detail: '日本人のオーナーや日本語環境。チップで時給以上に稼げる場合も。', english: '初級' },
  { job: 'キッチンハンド（皿洗い）', detail: '英会話ほぼ不要。求人が多く、未経験OK。', english: 'ゼロでも可' },
  { job: '清掃・ハウスキーピング', detail: 'ホテルや住居の清掃。指示を理解する英語だけでOK。', english: '初級' },
  { job: 'ファーム（農作業）', detail: 'オーストラリアのフルーツピッキングなど。日本人が多くて英語不要。', english: 'ゼロでも可' },
  { job: '日本食材店・日系スーパー', detail: '接客は日本語、店内英語のみ。日本人マネージャーが多いです。', english: '初級' },
  { job: '日本人観光客向けツアー', detail: '英語より日本語ガイドが歓迎されることも。', english: '中級（部分英語）' },
];

const PREPARATION_STEPS = [
  {
    step: 'Step 1：出発3ヶ月前',
    title: '中学英語の文法と基礎単語を復習',
    detail: '英会話本を1冊（中学英語レベル）終わらせましょう。発音はYouTubeで「英語 発音 基礎」と検索して動画を見るだけでもOK。',
  },
  {
    step: 'Step 2：出発2ヶ月前',
    title: 'オンライン英会話で「話す」体験を積む',
    detail: 'DMM英会話やネイティブキャンプなどで、週3回25分。「Hello」だけでも口に出す経験が、現地でめちゃくちゃ効きます。',
  },
  {
    step: 'Step 3：出発1ヶ月前',
    title: '生活フレーズを集中で暗記',
    detail: '空港・カフェ・買い物・道案内・自己紹介などのフレーズを30個丸暗記。スマホの翻訳アプリ（DeepLなど）も準備しましょう。',
  },
  {
    step: 'Step 4：到着〜1ヶ月',
    title: 'フィリピン留学か、マンツーマン語学学校で英語漬け',
    detail: '英語ゼロから始める方は、最初の1〜3ヶ月をフィリピン語学留学に充てる「2ステップ作戦」が定番。確実に英語力を上げてから本番のワーホリ国に進みます。',
  },
  {
    step: 'Step 5：3ヶ月以降',
    title: '日常会話レベルになったら現地で仕事探し',
    detail: 'Resume作成→ウォークイン（飛び込み応募）→面接の流れ。日系やキッチンハンドから始めて、英語力が上がるごとに職種をステップアップしていきます。',
  },
];

const IMPROVE_HABITS = [
  {
    title: '間違いを恐れず、自分から話す',
    detail: '伸びる人は「通じればOK」と割り切って、つたなくても自分から話しかけます。発話量が多いほど、耳も口も早く慣れていきます。',
  },
  {
    title: '日本人だけで固まりすぎない',
    detail: '同じ日本人の友達は心の支えになりますが、そこに依存すると英語を使う場面が減ります。意識して現地の人・多国籍の友達と過ごす時間を作っています。',
  },
  {
    title: '最初の数ヶ月を「学ぶ期間」と決める',
    detail: '伸びる人ほど、渡航後すぐ働くのではなく、語学学校やフィリピン留学で土台を作る期間を先に確保しています。基礎ができてから仕事に移ると伸びが続きます。',
  },
];

const STUCK_PATTERNS = [
  {
    title: '日本人コミュニティに居心地よく依存する',
    detail: '日本語だけで生活が完結してしまうと、英語に触れる時間がほぼゼロに。気づけば数ヶ月、英語力がほとんど変わらない、という声が目立ちます。',
  },
  {
    title: '受け身で「環境任せ」にする',
    detail: '「現地に行けば自然に話せる」は半分だけ本当。自分から学ぶ・話す行動がないと、環境があっても伸びません。インプットだけで満足してしまうのも要注意。',
  },
  {
    title: '仕事だけで英語が伸びると過信する',
    detail: 'キッチンハンドや清掃など英語をあまり使わない仕事だと、働くほど忙しくなり勉強時間が消えます。仕事＝英語学習にはならない点に注意が必要です。',
  },
];

const FAQS = [
  {
    question: '本当に英語ゼロでもワーホリに行けますか？',
    answer:
      '行けます。ワーホリビザの申請に英語スコアの提出は不要です（一部の国を除く）。ただし「現地で何もできない」状態を避けるため、中学英語レベルの基礎＋生活フレーズ30個ほどの最低準備は強くおすすめします。フィリピン留学を最初の3ヶ月に組み込めば、ゼロからでも日常会話まで到達できます。',
  },
  {
    question: '出発までに最低限どれくらいの英語力が必要？',
    answer:
      '目安はTOEIC 400点（中学英語レベル）。これがあれば空港・買い物・道案内など最低限の生活ができます。仕事探しまで考えるならTOEIC 600点（高校英語＋日常英会話）が安心ライン。日系やキッチンハンドであればTOEIC 400でも採用される例があります。',
  },
  {
    question: 'フィリピン留学はワーホリ前にどれくらいの期間がおすすめ？',
    answer:
      '一般的には3ヶ月。英語ゼロから日常会話まで到達するのに必要な期間です。費用は3ヶ月で50〜70万円ほど。ワーホリ国（オーストラリア・カナダなど）に渡る前にフィリピンで英語の基礎を作る「2ステップ作戦」が、英語が苦手な人の成功パターンとして定着しています。',
  },
  {
    question: '英語が話せないままワーホリに行くと失敗しますか？',
    answer:
      '「失敗」というより「英語の成長が遅くなる」「就ける仕事が限られる」「現地の友達ができにくい」というデメリットがあります。それでも「現地に飛び込まないと話せるようにならない」と考えるなら、最初の3ヶ月を語学学校に通う前提で渡航すれば、十分にリカバリーできます。',
  },
  {
    question: '英語が話せないと現地でいじめられたり差別されたりする？',
    answer:
      '日常生活で露骨な差別を受けるケースは少数派です。「英語が話せない＝コミュニケーションが取りにくい」と感じる相手はいるかもしれませんが、こちらが努力する姿勢を見せれば、多くの人は親切に対応してくれます。むしろ「謙虚に学ぶ姿勢」が現地で好印象を得られる場面のほうが多いです。',
  },
];

function extractBeginnerAdvice(exp: Experience): string | null {
  const advice = exp.advice ?? '';
  const sentences = advice.split(/[。．！!?？]/);
  for (const s of sentences) {
    const trimmed = s.trim();
    if (trimmed.length > 20 && trimmed.length < 120 && /(英語|話|聞|読|書|語学|TOEIC|IELTS|フィリピン)/.test(trimmed)) {
      return trimmed + '。';
    }
  }
  // 英語に言及がなくても、初級者の一般的なアドバイスを返す
  for (const s of sentences) {
    const trimmed = s.trim();
    if (trimmed.length > 20 && trimmed.length < 120) {
      return trimmed + '。';
    }
  }
  return null;
}

export default async function NoEnglishPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));

  // 渡航前英語レベルが初級以下の体験談を抽出
  const beginnerAll = experiencesData.contents.filter(
    (e) => e.languageBefore === 'beginner' || e.languageBefore === 'elementary'
  );
  const beginnerExperiences = beginnerAll.slice(0, 6);

  // beginnerからアドバイス引用を最大2件取得
  const beginnerQuotes = beginnerAll
    .map((e) => ({ exp: e, quote: extractBeginnerAdvice(e) }))
    .filter((x): x is { exp: Experience; quote: string } => x.quote !== null)
    .slice(0, 2);

  // 渡航前後の英語上達率（before → after のクロス集計）
  const progress = getLanguageProgressStats(experiencesData.contents);
  const improvedRate =
    progress.totalWithBoth > 0
      ? Math.round((progress.improvedCount / progress.totalWithBoth) * 100)
      : 0;

  // 渡航後に英語レベルが上がった人から、上達に関する一文を引用
  const LANG_ORDER: Record<string, number> = {
    beginner: 1, elementary: 2, intermediate: 3, 'upper-intermediate': 4, advanced: 5,
  };
  const improvedQuote = (() => {
    for (const e of experiencesData.contents) {
      const before = e.languageBefore ? LANG_ORDER[e.languageBefore] ?? 0 : 0;
      const after = e.languageAfter ? LANG_ORDER[e.languageAfter] ?? 0 : 0;
      if (!before || !after || after <= before) continue;
      const quote = extractMatchingSentence(e.advice ?? '', /(話せる|伸び|上達|慣れ|聞き取|通じ)/);
      if (quote) return { exp: e, quote };
    }
    return null;
  })();

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '英語話せなくてもワーホリ', url: '/no-english' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '英語話せなくてもワーホリ' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              英語が話せなくてもワーホリできる｜国・仕事・準備の5ステップ
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="英語に自信がないワーホリ志望の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「英語が話せないけど、ワーホリに行ってみたい」
              <br />
              そう悩んでいる方は多いです。でも結論から言うと、英語ゼロでも渡航できます。
              <br />
              この記事では、英語なしで始められる国・仕事・準備の進め方を、実体験ベースでまとめました。
              フィリピン留学を組み合わせる「2ステップ作戦」も含めて、不安をひとつずつ解消していきます。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '英語ゼロでも始められる国TOP5（フィリピン・台湾・マルタなど）',
              '英語不要で就ける仕事と、必要な英語レベルの目安',
              '出発3ヶ月前から始める5ステップ準備法',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 英語ゼロでも始めやすい国 */}
          <section id="countries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語ゼロでも始めやすい国TOP5</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              英語学習の取り組みやすさ・日本人コミュニティの規模・生活サポートの観点で選びました。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NO_ENGLISH_COUNTRIES.map((c, i) => (
                <div key={c.slug} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-2xl" aria-hidden="true">{c.flag}</span>
                    <Link
                      href={`/countries/${c.slug}`}
                      className="text-base sm:text-lg font-bold text-primary-700 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed mb-3">{c.reason}</p>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>💰 {c.cost}</span>
                    <span>📈 {c.learnPace}</span>
                  </div>
                </div>
              ))}
            </div>
            {beginnerQuotes[0] && (
              <QuoteFromExperience
                text={beginnerQuotes[0].quote}
                experience={beginnerQuotes[0].exp}
                truncated
              />
            )}
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="自分にぴったりの国を5問で診断"
            description="目的・期間・予算・治安の希望から、9カ国の中から相性スコアつきで提案します。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/countries/philippines"
            secondaryLabel="フィリピン留学を詳しく見る"
          />

          {/* 英語不要で就ける仕事 */}
          <section id="jobs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語が話せなくても就ける仕事</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ワーホリ初期、特に渡航1〜3ヶ月の英語力でも応募できる職種を整理しました。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">職種</th>
                    <th className="px-4 py-3 font-semibold">特徴</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">必要英語レベル</th>
                  </tr>
                </thead>
                <tbody>
                  {NO_ENGLISH_JOBS.map((j, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium">{j.job}</td>
                      <td className="px-4 py-3 text-gray-700">{j.detail}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-amber-50 text-amber-800 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                          {j.english}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {beginnerQuotes[1] && (
              <QuoteFromExperience
                text={beginnerQuotes[1].quote}
                experience={beginnerQuotes[1].exp}
                truncated
              />
            )}
          </section>

          {/* 5ステップ準備法 */}
          <section id="preparation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語ゼロから始める5ステップ準備法</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              出発3ヶ月前から段階的に進めるロードマップです。
            </p>
            <ol className="space-y-3">
              {PREPARATION_STEPS.map((s, i) => (
                <li
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4"
                >
                  <div className="sm:w-40 shrink-0">
                    <span className="inline-block text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded">
                      {s.step}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1 text-base sm:text-lg">{s.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <ServiceHubLink
            intent="english-online"
            title="出発前に使えるオンライン英会話を確認"
            description="5ステップ準備法で紹介した『話す練習』の選択肢を、編集記事とは分けた広告ページで確認できます。"
          />

          {/* 英語が伸びる人・伸び悩む人の違い */}
          <section id="who-improves" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語ゼロから上達する人としない人の違い</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-6">
              同じ「英語ゼロスタート」でも、帰国時の英語力には大きな差がつきます。その差は才能ではなく、現地での過ごし方の違いです。当サイトの体験談データと、実際の声から見えた傾向をまとめました。
            </p>

            {progress.totalWithBoth > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                  <p className="text-xs font-semibold text-emerald-900 mb-1">渡航前後で英語レベルが上がった人</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {progress.improvedCount}／{progress.totalWithBoth}人
                    <span className="text-base ml-1">（{improvedRate}%）</span>
                  </p>
                  <p className="text-xs text-emerald-800 mt-2">
                    n={progress.totalWithBoth}件（渡航前後の英語レベルを記入した体験談から集計）
                  </p>
                </div>
                {progress.beginnerStartTotal > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                    <p className="text-xs font-semibold text-amber-900 mb-1">「初級」スタートで上のレベルに到達</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {progress.beginnerStartImproved}／{progress.beginnerStartTotal}人
                    </p>
                    <p className="text-xs text-amber-800 mt-2">
                      n={progress.beginnerStartTotal}件（渡航前が「初級」だった人のうち、帰国時に上達した割合）
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <h3 className="font-bold text-base sm:text-lg text-emerald-900 mb-3">伸びる人の3つの習慣</h3>
                <ul className="space-y-3">
                  {IMPROVE_HABITS.map((h, i) => (
                    <li key={i}>
                      <p className="text-sm font-semibold text-emerald-900 mb-1">○ {h.title}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{h.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                <h3 className="font-bold text-base sm:text-lg text-rose-900 mb-3">伸び悩む人の3つのパターン</h3>
                <ul className="space-y-3">
                  {STUCK_PATTERNS.map((p, i) => (
                    <li key={i}>
                      <p className="text-sm font-semibold text-rose-900 mb-1">× {p.title}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{p.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {improvedQuote && (
              <QuoteFromExperience text={improvedQuote.quote} experience={improvedQuote.exp} truncated />
            )}
          </section>

          {/* 体験談 */}
          {beginnerExperiences.length > 0 && (
            <section id="experiences" className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                英語初級から渡航した方の体験談（{beginnerExperiences.length}件）
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                出発時の英語レベルが「初級」以下だった渡航者の体験談を抽出しました。自分と近いレベルの方の声を参考にしてください。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beginnerExperiences.map((exp) => (
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
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/countries/philippines" className="text-primary-600 hover:underline">
                  → フィリピン留学・ワーホリ完全ガイド
                </Link>
              </li>
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
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための7つの教訓
                </Link>
              </li>
              <li>
                <Link href="/language-school-ranking" className="text-primary-600 hover:underline">
                  → 語学学校ランキング：選ぶ7つの基準
                </Link>
              </li>
              <li>
                <Link href="/guide/work" className="text-primary-600 hover:underline">
                  → ワーホリ完全ガイド：仕事のフェーズ
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="text-primary-600 hover:underline">
                  → 全77件の体験談を読む
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
