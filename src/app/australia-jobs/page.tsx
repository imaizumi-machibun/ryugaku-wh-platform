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
import { extractAnySentence } from '@/lib/stats/experiences-cross';
import { formatJPY } from '@/lib/utils/format';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーストラリア ワーホリの仕事の探し方｜求人サイト・職種別・採用されるコツ【2026年版】',
  description: 'オーストラリアのワーホリで仕事を見つける完全ガイド。Seek・Indeed・Gumtreeなど求人サイトの使い方、ホスピタリティ・ファーム・日系の職種別ポイント、ウォークインのコツまで実渡航者の体験談ベースで解説。',
  path: '/australia-jobs',
  keywords: [
    'オーストラリア ワーホリ 仕事',
    'オーストラリア ワーホリ 仕事 探し方',
    'シドニー バイト 探し方',
    'オーストラリア 求人 ワーホリ',
    'オーストラリア 日本人 仕事',
    'メルボルン カフェ バイト',
    'オーストラリア ファームジョブ',
  ],
});

const TOC_HEADINGS = [
  { id: 'job-categories', label: 'オーストラリアで多い職種5カテゴリ' },
  { id: 'job-sites', label: '求人サイト・コミュニティ一覧' },
  { id: 'resume', label: 'オーストラリア式Resumeの作り方' },
  { id: 'walk-in', label: 'ウォークイン（飛び込み応募）の進め方' },
  { id: 'stats', label: 'オーストラリア渡航者のデータ' },
  { id: 'faq', label: 'よくある質問' },
];

const JOB_CATEGORIES = [
  {
    emoji: '☕',
    title: 'ホスピタリティ（カフェ・レストラン・バー）',
    detail: 'ワーホリで最も求人が多いカテゴリ。バリスタ・サーバー・キッチンハンドが定番。チップ文化はないが時給が高い（最低時給AUD24.10）。',
    english: '初級〜中級（接客は中級以上が有利）',
    salary: '時給 AUD24〜30',
  },
  {
    emoji: '🌾',
    title: 'ファーム（フルーツピッキング・農作業）',
    detail: 'セカンドビザ（2年目延長）申請の必須条件「指定地域88日就労」を満たす定番ルート。クイーンズランド・タスマニア・ビクトリア州が人気。',
    english: 'ゼロでも可',
    salary: '時給 AUD24〜（出来高制も）',
  },
  {
    emoji: '🛒',
    title: '小売・販売',
    detail: 'スーパー（Coles・Woolworths）、衣料品店、観光地のお土産店など。日本人観光客対応の店舗は日本語スキルも武器に。',
    english: '初級〜中級',
    salary: '時給 AUD24〜26',
  },
  {
    emoji: '🍱',
    title: '日系（寿司屋・ラーメン店・日本食材店）',
    detail: '日本人オーナーや日本語環境で英語ゼロでも始めやすい。日本語求人サイト（日豪プレス・JAMS.TV）で見つけやすい。',
    english: '初級OK（日本語のみで可の求人も）',
    salary: '時給 AUD23〜25',
  },
  {
    emoji: '💼',
    title: 'スキル系（IT・デザイン・日本語教師）',
    detail: '専門スキルがあれば時給AUD30〜45も可能。リモートワーク継続もできる。LinkedIn・現地のJob Boardで見つける。',
    english: '中級以上推奨',
    salary: '時給 AUD30〜45',
  },
];

const JOB_SITES = [
  { name: 'Seek', url: 'seek.com.au', detail: 'オーストラリア最大の求人サイト。正社員からカジュアルまで。', tag: '英語' },
  { name: 'Indeed Australia', url: 'au.indeed.com', detail: '世界最大手の求人検索エンジン。検索性◎', tag: '英語' },
  { name: 'Gumtree', url: 'gumtree.com.au', detail: 'クラシファイド広告。カジュアルな仕事が多く、ワーホリ向け', tag: '英語' },
  { name: 'Jora', url: 'jora.com', detail: '複数の求人サイトを横断検索できるアグリゲーター', tag: '英語' },
  { name: 'Harvest Trail', url: 'harvesttrail.gov.au', detail: 'ファームワーク専門の政府公式サイト', tag: '英語・公式' },
  { name: '日豪プレス', url: 'nichigopress.jp', detail: '日本語の求人情報。日系企業の求人多数', tag: '日本語' },
  { name: 'JAMS.TV', url: 'jams.tv', detail: '日系求人が充実。シドニー・メルボルン中心', tag: '日本語' },
  { name: 'Cheers!', url: 'cheers.com.au', detail: '日本語のワーホリ向け情報サイト・求人あり', tag: '日本語' },
];

const RESUME_TIPS = [
  '1〜2ページに収める（日本式の長文職歴は不要）',
  'A4横ではなくA4縦で作成',
  '写真は載せない（オーストラリアでは差別防止のため不要）',
  '生年月日・性別・既婚未婚は記載しない',
  '英語名（First name）はパスポート表記に合わせる',
  '電話番号はオーストラリアの番号を取得後に記載（+61）',
  '住所は街と州名（例：Bondi Junction, NSW）まででOK',
  'Skills セクションに「Japanese (native)」「English (intermediate)」など明記',
  'References は「Available on request」とだけ書くのが慣例',
];

const WALK_IN_STEPS = [
  {
    step: 'Step 1',
    title: 'エリアと業種を決める',
    detail: 'カフェ激戦区（メルボルンのフィッツロイ、シドニーのサリーヒルズ等）を選ぶと求人率が上がる。',
  },
  {
    step: 'Step 2',
    title: 'Resumeを20〜30部印刷',
    detail: 'カフェのピーク時（11〜14時、17〜19時）を避けて、14〜17時の落ち着いた時間帯に訪問。',
  },
  {
    step: 'Step 3',
    title: '入店して笑顔で挨拶',
    detail: '「Hi, are you hiring? I would like to drop my CV」が定番フレーズ。マネージャー不在でも置いてくる。',
  },
  {
    step: 'Step 4',
    title: 'その場で簡単な面接になることも',
    detail: '「When can you start?」「Do you have a barista experience?」など即答できるよう準備。即日トライアル採用も多い。',
  },
  {
    step: 'Step 5',
    title: 'フォローアップ',
    detail: '2〜3日後に「Just checking in if you remember my CV」とメールやIGダイレクトで連絡。粘り強さが採用率を上げる。',
  },
];

const FAQS = [
  {
    question: '英語が話せなくてもオーストラリアで仕事は見つかりますか？',
    answer:
      '日系（寿司屋・ラーメン店・日本食材店）・キッチンハンド・ファームなど、英語ゼロから始められる職種があります。ただし時給は若干低めです。3〜6ヶ月で英語力を上げて、より時給の高いカフェ・レストランへステップアップするのが定番ルート。',
  },
  {
    question: '仕事は何ヶ月で見つかりますか？',
    answer:
      '都市・職種・タイミングで大きく変わります。シドニー・メルボルンのカフェなら2〜4週間、ファームなら1〜2週間。冬季や年末年始のローシーズンは時間がかかる傾向です。Resume持ち歩き＋ウォークインを並行すると採用までの期間が短縮されます。',
  },
  {
    question: 'セカンドビザ（2年目）申請のために必要な条件は？',
    answer:
      '指定地域での「Specified Work（指定業種就労）」を88日以上行うこと。ファームワークが定番ですが、漁業・建設・観光業など対象は広がっています。Harvest Trail（政府公式サイト）で対象地域を確認できます。',
  },
  {
    question: 'タックスファイルナンバー（TFN）はいつ取得すべき？',
    answer:
      '入国後すぐ。オーストラリアのATO（税務署）公式サイトからオンライン申請可能。住所が確定してから申請するのが推奨されますが、Backpacker Hostelの住所でも申請できます。TFNなしで働くと税率45%が引かれるので、出来るだけ早く取得しましょう。',
  },
  {
    question: '日本人スタッフがいる職場はどう探す？',
    answer:
      '日豪プレスやJAMS.TVなどの日本語求人サイトに登録すると、日系企業の求人が見つかります。シドニーのチャイナタウン・ヘイマーケット、メルボルンのCBD周辺に日系飲食店が集中。Facebook グループ「オーストラリア・ワーホリ情報交換」も求人情報が流れます。',
  },
];

export default async function AustraliaJobsPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const auExperiences = experiencesData.contents.filter((e) => e.country?.id === 'australia');

  // 体験談から仕事関連の引用を抽出
  const jobQuoteSample = auExperiences.find((e) => {
    const text = `${e.advice ?? ''} ${e.pros?.map((p) => p.text).join(' ') ?? ''}`;
    return /(仕事|バイト|カフェ|ファーム|寿司|キッチン|採用|面接|時給)/.test(text);
  });
  const jobQuote = jobQuoteSample
    ? extractAnySentence(
        `${jobQuoteSample.advice ?? ''} ${jobQuoteSample.pros?.map((p) => p.text).join(' ') ?? ''}`
      )
    : null;

  // 平均生活費
  const livingValues = auExperiences
    .map((e) => e.monthlyLivingJpy)
    .filter((v): v is number => v != null);
  const avgLiving =
    livingValues.length > 0
      ? Math.round(livingValues.reduce((s, v) => s + v, 0) / livingValues.length)
      : null;

  // 平均仕事評価
  const jobRatings = auExperiences
    .map((e) => e.ratingJob)
    .filter((v): v is number => v != null);
  const avgJobRating =
    jobRatings.length > 0
      ? Math.round((jobRatings.reduce((s, v) => s + v, 0) / jobRatings.length) * 10) / 10
      : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーストラリア ワーホリの仕事の探し方', url: '/australia-jobs' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーストラリア ワーホリの仕事の探し方' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーストラリア ワーホリの仕事の探し方｜求人サイト・職種別・採用のコツ
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="オーストラリアでワーホリ予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「オーストラリアで仕事って、すぐ見つかるの？」
              <br />
              ワーホリ最大の渡航国・オーストラリアで仕事を見つける方法を、求人サイト・職種別の特徴・Resumeの書き方・ウォークインのコツまで一気にまとめました。
              実際に渡航した方の体験談データも使って、リアルな仕事獲得までの流れをお伝えします。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'オーストラリアで多い5職種の特徴・時給目安・必要な英語レベル',
              '英語サイト（Seek/Indeed/Gumtree）と日本語サイト（日豪プレス/JAMS.TV）の使い分け',
              'ウォークイン（飛び込み応募）で採用率を上げる5ステップ',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 職種カテゴリ */}
          <section id="job-categories" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">オーストラリアで多い職種5カテゴリ</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              ワーホリで就ける仕事は多岐にわたります。自分の英語レベルと希望時給で、どのカテゴリから始めるか決めましょう。
            </p>
            <div className="space-y-3">
              {JOB_CATEGORIES.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg flex items-center gap-2">
                    <span aria-hidden="true">{c.emoji}</span>
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{c.detail}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-amber-50 text-amber-800 font-semibold px-2 py-1 rounded">
                      英語: {c.english}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-1 rounded">
                      {c.salary}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="オーストラリアの渡航前に確認したいこと"
            description="費用・治安・他国との比較もまとめて確認しておきましょう。"
            primaryHref="/countries/australia"
            primaryLabel="オーストラリアの国別ページを見る"
            secondaryHref="/compare/countries"
            secondaryLabel="他の国と比較する"
          />

          {/* 求人サイト */}
          <section id="job-sites" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">求人サイト・コミュニティ一覧</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              英語サイトは選択肢が多く、日本語サイトは初期立ち上げの強い味方です。両方並行で登録しておきましょう。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">サイト名</th>
                    <th className="px-4 py-3 font-semibold">URL</th>
                    <th className="px-4 py-3 font-semibold">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {JOB_SITES.map((s) => (
                    <tr key={s.url} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium">
                        {s.name}
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${s.tag.includes('日本語') ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700'}`}>
                          {s.tag}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{s.url}</td>
                      <td className="px-4 py-3 text-gray-700">{s.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Resume */}
          <section id="resume" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">オーストラリア式Resumeの作り方</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              オーストラリアのResume（英文履歴書）は日本の履歴書とまったく違います。下記9項目を守れば「現地慣習を理解している」と評価されます。
            </p>
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
              <ul className="space-y-2 text-sm sm:text-base text-gray-800">
                {RESUME_TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary-600 font-bold shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ウォークイン */}
          <section id="walk-in" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ウォークイン（飛び込み応募）の進め方</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              カフェ・レストランの仕事は、ネット応募よりウォークインの方が採用率が高い傾向。5ステップで進めましょう。
            </p>
            <ol className="space-y-3">
              {WALK_IN_STEPS.map((s, i) => (
                <li
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4"
                >
                  <div className="sm:w-24 shrink-0">
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

          {/* 体験談データ */}
          <section id="stats" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">オーストラリア渡航者のデータ</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              当サイトに登録されている体験談から、オーストラリア渡航者の実情をまとめました。
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <ul className="space-y-2 text-sm text-gray-800">
                <li>
                  オーストラリアの体験談件数: <strong className="text-primary-700">n={auExperiences.length}件</strong>
                </li>
                {avgLiving && (
                  <li>
                    月平均生活費: <strong className="text-primary-700">{formatJPY(avgLiving)}</strong>
                    <span className="text-xs text-gray-500 ml-2">（{livingValues.length}件の体験談平均）</span>
                  </li>
                )}
                {avgJobRating && (
                  <li>
                    仕事の満足度（5点満点）: <strong className="text-primary-700">{avgJobRating}</strong>
                    <span className="text-xs text-gray-500 ml-2">（{jobRatings.length}件の体験談平均）</span>
                  </li>
                )}
              </ul>
            </div>
            {jobQuoteSample && jobQuote && (
              <QuoteFromExperience text={jobQuote} experience={jobQuoteSample} truncated />
            )}
            {auExperiences.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-700 mb-4">オーストラリア渡航者の体験談一覧（最新6件）</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {auExperiences.slice(0, 6).map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                  ))}
                </div>
              </div>
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
                <Link href="/countries/australia" className="text-primary-600 hover:underline">
                  → オーストラリア ワーホリ完全ガイド
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
                <Link href="/tax-return" className="text-primary-600 hover:underline">
                  → ワーホリの確定申告ガイド
                </Link>
              </li>
              <li>
                <Link href="/guide/work" className="text-primary-600 hover:underline">
                  → ワーホリ完全ガイド：仕事のフェーズ
                </Link>
              </li>
              <li>
                <Link href="/experiences?country=australia" className="text-primary-600 hover:underline">
                  → オーストラリアの体験談一覧
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
