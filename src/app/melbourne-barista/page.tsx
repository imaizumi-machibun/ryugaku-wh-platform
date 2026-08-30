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

const PAGE_PATH = '/melbourne-barista';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'メルボルンでバリスタになる方法｜資格・求人・採用されるコツ完全ガイド',
  description: 'メルボルンは世界のカフェ文化の中心地。バリスタになる方法、必要な資格（バリスタコース・RSA）、求人の探し方、ウォークインのコツ、給与水準まで実例ベースで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'メルボルン バリスタ',
    'メルボルン カフェ 仕事',
    'メルボルン バリスタ 求人',
    'バリスタ オーストラリア',
    'メルボルン カフェ バイト',
    'バリスタ コース メルボルン',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-melbourne', label: 'なぜメルボルンがバリスタの聖地なのか' },
  { id: 'qualifications', label: '必要な資格とバリスタコース' },
  { id: 'find-job', label: '求人の探し方5選' },
  { id: 'walk-in', label: 'ウォークインで採用される7つのコツ' },
  { id: 'salary', label: '給与・労働条件の実態' },
  { id: 'best-areas', label: 'カフェ激戦区の主要エリア' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const BARISTA_COURSES = [
  {
    name: 'Coffee School Melbourne',
    duration: '1日〜3日',
    cost: 'AUD 195〜450',
    feature: '英語＋日本語サポート。短期集中。修了証で就活有利',
  },
  {
    name: 'William Angliss Institute',
    duration: '3〜6ヶ月',
    cost: 'AUD 800〜3,000',
    feature: '政府認定校。長期で本格的に学びたい人向け',
  },
  {
    name: 'Lavazza Coffee Academy',
    duration: '1〜2日',
    cost: 'AUD 250〜500',
    feature: '世界的ブランド主催。エスプレッソ理論まで深く学べる',
  },
];

const JOB_SITES = [
  { name: 'Seek', detail: 'オーストラリア最大求人サイト。「Barista」検索で数百件' },
  { name: 'Indeed Australia', detail: 'グローバル大手。フルタイム・カジュアル両方' },
  { name: 'Gumtree', detail: 'カジュアル求人多数。即日採用も' },
  { name: 'Hospo Jobs', detail: '飲食専門求人サイト。バリスタ求人が豊富' },
  { name: 'Cafe direct walk-in', detail: '実は最も効果的。Resume持参で直接訪問' },
];

const WALK_IN_TIPS = [
  'Resumeはバリスタ経験を冒頭に記載（日本のカフェ・スタバ経験も活かせる）',
  'カフェのピーク時（11〜14時、17〜19時）を避けて14〜17時に訪問',
  '「Hi, I am looking for a barista position. May I leave my CV?」が定番フレーズ',
  'マネージャーがいない場合は名刺サイズのメモに連絡先を添えて置いていく',
  '同じ通りのカフェを5〜10軒回る（1日で20軒可能）',
  'バリスタ資格証明書（コピー）をResumeに添付',
  '断られても「Could you recommend a cafe that\'s hiring?」と聞く',
];

const SALARY_INFO = [
  { type: 'カジュアル（Casual）', rate: '時給AUD 28〜34', detail: '週末・祝日は1.25〜2.0倍。最も一般的な雇用形態' },
  { type: 'パートタイム', rate: '時給AUD 25〜30', detail: '週20〜38時間。有給休暇あり' },
  { type: 'フルタイム', rate: '年収AUD 55,000〜70,000', detail: '正社員待遇。Super（年金）・有給あり' },
  { type: 'ヘッドバリスタ', rate: '時給AUD 32〜40 or 年収AUD 65,000〜85,000', detail: 'マネジメント経験必要' },
];

const AREAS = [
  { area: 'Fitzroy / Collingwood', detail: 'ヒップスター系・スペシャルティコーヒー激戦区。トレンド最先端' },
  { area: 'Carlton', detail: 'イタリア系カフェ多数。エスプレッソ文化の源流' },
  { area: 'St Kilda', detail: 'ビーチサイド・観光地系。週末忙しい' },
  { area: 'CBD（中心地）', detail: 'ビジネスマン向け。平日朝のラッシュが激しい' },
  { area: 'Brunswick', detail: '若者・学生街。カジュアルな雰囲気' },
];

const FAQS = [
  {
    question: 'メルボルンのバリスタは日本人未経験でも採用される？',
    answer:
      '採用されます。ただし条件は「バリスタコース修了（1〜3日）＋日本のスタバ等経験＋英会話レベル中級」が標準。完全未経験＆英語ゼロは厳しいので、最低でもコース修了は推奨。日本のスタバ・ドトール経験は強くアピールできます。',
  },
  {
    question: 'バリスタコースは行く前に取った方がいい？',
    answer:
      '現地で取るのがおすすめ。日本で取った資格は通用しないため、メルボルン現地のCoffee Schoolで1〜3日のコースを受けると修了証＋現地マシン操作＋ネットワーキングが手に入ります。費用AUD 195〜450、すぐ就活に活かせます。',
  },
  {
    question: '時給はいくらくらい？',
    answer:
      'カジュアル雇用で時給AUD 28〜34（約3,000〜3,600円）。週末・祝日は1.25〜2.0倍。フルタイム正社員なら年収AUD 55,000〜70,000（550〜700万円）。チップ文化は弱いがTip Jarが置かれている店も。',
  },
  {
    question: 'ウォークインで何軒回ればいい？',
    answer:
      '1日10〜20軒、3〜4日で50〜80軒は回るのが目安。Fitzroy・Collingwood・Carltonなどカフェ密集エリアを連続で回ると効率的。多くは「今は募集してない」と言われますが、その中で2〜3軒から面接の機会があれば成功です。',
  },
  {
    question: 'メルボルンとシドニー、バリスタどちらが多い？',
    answer:
      'メルボルン。世界トップクラスのカフェ密度。コーヒー文化の中心地と言われ、求人数・スキルアップ機会ともにシドニーを上回ります。「メルボルンでバリスタ経験」は世界中のカフェで評価される肩書きです。',
  },
];

export default async function MelbourneBaristaPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const melbExperiences = all.filter((e) =>
    e.country?.id === 'australia' && /メルボルン|Melbourne/i.test(e.cityPrimary ?? '')
  );

  const mentions = countMentions(all, /(バリスタ|カフェ|コーヒー|barista|cafe|coffee)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(バリスタ|カフェ|コーヒー|barista|cafe|coffee)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'メルボルンでバリスタになる方法', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'メルボルンでバリスタになる方法' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              メルボルンでバリスタになる方法｜資格・求人・採用されるコツ
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="メルボルンでバリスタ職を目指す方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              メルボルンは「世界のカフェ文化の聖地」と呼ばれる都市。バリスタの仕事は数千件あり、ワーホリ・留学生の人気職種です。
              <br />
              この記事では、必要な資格、求人の探し方、ウォークインで採用されるコツ、給与水準、カフェ激戦区エリアまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'メルボルンはバリスタ職の聖地、求人数が世界トップクラス',
              'バリスタコース1〜3日（AUD 195〜450）で就活有利に',
              '時給AUD 28〜34、週末は1.25〜2倍、ウォークインが最強',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜメルボルン */}
          <section id="why-melbourne" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜメルボルンがバリスタの聖地なのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              メルボルンは1950年代のイタリア移民によるエスプレッソ文化伝来から始まり、現在は世界でも有数のスペシャルティコーヒー激戦区。「メルボルンでバリスタ経験」は世界中のカフェで通用するブランドになっています。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・市内のカフェ密度は世界トップクラス（人口1人あたりカフェ数で世界5位）</li>
              <li>・「Third Wave Coffee」のトレンド発祥地のひとつ</li>
              <li>・バリスタ職の求人が常時数千件</li>
              <li>・時給水準が高く（AUD 28〜34）、生活費を補填しやすい</li>
              <li>・スキルアップの機会が豊富（ラテアート大会、カッピングイベント等）</li>
            </ul>
          </section>

          {/* 資格 */}
          <section id="qualifications" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">必要な資格とバリスタコース</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              法的に必須の資格はありませんが、未経験者は<strong>バリスタコース修了</strong>と<strong>RSA（責任あるアルコール提供）</strong>を取得しておくと採用率が大きく上がります。
            </p>
            <div className="space-y-3 mb-4">
              {BARISTA_COURSES.map((c) => (
                <div key={c.name} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <h3 className="font-bold text-base">{c.name}</h3>
                    <span className="text-sm font-bold text-primary-700">{c.cost}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">期間: {c.duration}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.feature}</p>
                </div>
              ))}
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
              <p className="text-sm text-sky-900 leading-relaxed">
                <strong>💡 RSA（Responsible Service of Alcohol）</strong>：アルコールを提供するカフェ・レストラン勤務に必須。オンラインで取得可（AUD 30〜50、1〜2時間）。州ごとに発行されるためビクトリア州版を取得。
              </p>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="オーストラリアの仕事探し全体像も合わせて"
            description="バリスタ以外の選択肢も含めて把握しておきましょう。"
            primaryHref="/australia-jobs"
            primaryLabel="オーストラリア仕事探し方"
            secondaryHref="/english-resume-guide"
            secondaryLabel="英文レジュメ書き方"
          />

          {/* 求人 */}
          <section id="find-job" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">求人の探し方5選</h2>
            <div className="space-y-3">
              {JOB_SITES.map((s) => (
                <div key={s.name} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{s.name}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ウォークイン */}
          <section id="walk-in" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ウォークインで採用される7つのコツ</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              メルボルンのバリスタ求人は、ネット応募よりウォークイン（直接訪問）の方が採用率が圧倒的に高い傾向。下記7つを実践しましょう。
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {WALK_IN_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 給与 */}
          <section id="salary" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">給与・労働条件の実態</h2>
            <div className="space-y-3">
              {SALARY_INFO.map((s) => (
                <div key={s.type} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <h3 className="font-bold text-base">{s.type}</h3>
                    <span className="text-sm font-bold text-primary-700">{s.rate}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* エリア */}
          <section id="best-areas" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">カフェ激戦区の主要エリア</h2>
            <div className="space-y-3">
              {AREAS.map((a) => (
                <div key={a.area} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1">{a.area}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{a.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                メルボルン渡航者の体験談 <strong>n={melbExperiences.length}件</strong>。
                バリスタ・カフェ関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/australia-jobs" className="text-primary-600 hover:underline">→ オーストラリア仕事探し方</Link></li>
              <li><Link href="/sydney-sharehouse" className="text-primary-600 hover:underline">→ シドニーのシェアハウス</Link></li>
              <li><Link href="/countries/australia" className="text-primary-600 hover:underline">→ オーストラリア国別ガイド</Link></li>
              <li><Link href="/english-resume-guide" className="text-primary-600 hover:underline">→ 英文レジュメ書き方</Link></li>
              <li><Link href="/australia-farm-job" className="text-primary-600 hover:underline">→ ファームジョブ完全ガイド</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
