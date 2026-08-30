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

const PAGE_PATH = '/wh-bilingual-job';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'バイリンガル海外仕事完全ガイド｜日英活用・通訳・観光・カスタマーサポート',
  description: '日英バイリンガルとして海外で働く完全ガイド。観光・通訳・カスタマーサポート・営業職など、日本語スキルを活かせる仕事、給与水準、応募方法を完全解説。',
  path: PAGE_PATH,
  keywords: [
    '海外 バイリンガル 仕事',
    '海外 通訳 仕事',
    '海外 観光 仕事',
    '日英バイリンガル',
    '海外 日本語講師',
    'ワーホリ 日本語活用',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-bilingual', label: 'なぜ日英バイリンガル職が高単価か' },
  { id: 'top-jobs', label: '主要職種10選' },
  { id: 'salary', label: '職種別給与水準' },
  { id: 'where-to-find', label: '求人の探し方' },
  { id: 'application-tips', label: '応募・面接のコツ' },
  { id: 'skill-building', label: '差別化スキル6つ' },
  { id: 'career-path', label: 'キャリアパス・PR取得' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TOP_JOBS = [
  { job: '①通訳・翻訳', salary: '$30-80/時', detail: 'ビジネス・観光・医療現場、フリーランス or 派遣' },
  { job: '②観光ガイド・コンシェルジュ', salary: '$25-45/時', detail: 'ホテル・観光会社、訪日客対応' },
  { job: '③日系企業現地法人', salary: '年$50,000-100,000', detail: '商社・メーカー・金融、駐在員サポート' },
  { job: '④カスタマーサポート（日英）', salary: '$20-35/時', detail: 'Tech企業・EC企業、リモート可' },
  { job: '⑤日本食レストラン マネージャー', salary: '年$45,000-75,000', detail: 'スタッフ管理＋顧客対応' },
  { job: '⑥日系不動産・留学エージェント', salary: '$25-40/時＋歩合', detail: '日本人客対応、コミッション制多' },
  { job: '⑦オンライン日本語講師', salary: '$15-30/時', detail: 'italki・Preply、副業も可' },
  { job: '⑧日本企業海外取引営業', salary: '年$50,000-90,000', detail: '日本商品の海外販売、貿易' },
  { job: '⑨イベント・通訳コーディネーター', salary: '$30-60/時', detail: '展示会・スポーツイベント' },
  { job: '⑩日本文化体験（料理・茶道・武道）', salary: '$30-60/時', detail: 'カルチャースクール、独立可' },
];

const SALARY_DETAIL = [
  { role: '通訳（同時）', salary: '$80-200/時', detail: 'ハイレベル、医療・法務は更に高額' },
  { role: '翻訳（IT・医療）', salary: '$30-100/時', detail: 'フリーランス、専門分野で高単価' },
  { role: '日系企業正社員', salary: '年$60,000-100,000', detail: '商社・メーカー・金融、福利厚生◎' },
  { role: 'カスタマーサポート', salary: '$20-35/時', detail: 'リモート可、Tech企業中心' },
  { role: '観光ガイド', salary: '$25-45/時＋チップ', detail: 'シーズナル変動大' },
  { role: '日本語講師（オンライン）', salary: '$15-30/時', detail: '独立可、生徒数で収入変動' },
];

const WHERE_TO_FIND = [
  'LinkedIn：日英バイリンガル求人多、現地リクルーター経由',
  'JpCanada/JAMS.tv：日系コミュニティ求人サイト',
  '日系新聞・タウン誌（トロント・LA・シドニー等の日系コミュニティ）',
  'インハウス求人：商社・メーカー・金融の現地法人公式サイト',
  '通訳・翻訳エージェント登録（Lionbridge、Translated等）',
  'Fiverr・Upwork：フリーランス通訳・翻訳・カスタマーサポート',
];

const APPLICATION_TIPS = [
  '英文Resume＋日本語版両方準備、日英スキルアピール',
  'ポートフォリオ・実績の数値化（処理件数・売上貢献等）',
  'TOEIC 800+ or IELTS 7.0+のスコア提示',
  '面接：英語＋日本語両方の質問対応準備',
  '志望動機：「日英バイリンガル＋〇〇分野」の組み合わせ',
  '日本企業の海外進出ストーリーを知っておく（商社・トヨタ等）',
];

const SKILL_BUILDING = [
  '専門分野の英語：IT・医療・金融・法務等の業界用語',
  '通訳訓練：シャドーイング・サマライジング',
  'Excel/PowerPoint等のビジネスツール',
  'プレゼンテーション英語',
  'CRMツール（Salesforce等）',
  '日本文化のグローバル発信スキル（SNS運用等）',
];

const CAREER_PATH = [
  'WHV/学生ビザ→現地日系企業で経験積む→雇用主スポンサーで就労ビザ→PR申請',
  '通訳・翻訳フリーランス→専門特化→年収UP→独立',
  '日本食レストランホール→マネージャー→独立してオーナーに',
  'カスタマーサポート→社内英語スピーカー→マーケティング・営業部門へ昇格',
  '日本企業の現地法人→駐在員→海外マネジメントキャリア',
];

const FAQS = [
  {
    question: '日本語スキルだけで海外で稼げる？',
    answer:
      '稼げる。日本語スキル単体での仕事は限定的だが、「日本語＋英語＋専門スキル」の組み合わせで高単価職に就ける。商社・金融・IT・観光業の日本人マーケット向け担当は特に需要高。日本語講師は副業として安定収入源にも。',
  },
  {
    question: 'TOEIC何点くらい必要？',
    answer:
      '通訳・翻訳：TOEIC 900+、IELTS 7.5+。営業・カスタマーサポート：TOEIC 800+。観光ガイド：TOEIC 700+。日本食レストラン：TOEIC 500+でもOK。職種により大きく異なり、英語力UP=年収UPの相関明確。',
  },
  {
    question: 'リモートワーク可？',
    answer:
      'カスタマーサポート・通訳・翻訳・オンライン日本語講師等はリモート可。日本クライアント向けの業務は時差調整必要だが、海外居住＋日本円稼ぐパターンも実現可能。物価安国（東南アジア等）に住みながら日本円稼ぐノマド戦略。',
  },
  {
    question: '日本企業現地法人と現地企業、どっち？',
    answer:
      '日本企業現地法人：日本人多・福利厚生◎・駐在員ルートあり。現地企業：英語環境◎・スキル幅広・グローバルキャリア。長期キャリア視野なら現地企業、安定＋日本人ネットワーク重視なら日系。',
  },
  {
    question: 'PR取得につながる？',
    answer:
      '職種次第。専門スキル（通訳・翻訳・特定業界の営業等）は雇用主スポンサーを得やすい。観光ガイド・カスタマーサポートは比較的容易、専門通訳・特定業界は更に有利。「日英バイリンガル＋希少スキル」の組み合わせがPR取得の鍵。',
  },
];

export default async function WhBilingualJobPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(バイリンガル|通訳|翻訳|日系|日本人向け|カスタマーサポート)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(バイリンガル|通訳|翻訳|日系|日本人向け|カスタマーサポート)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'バイリンガル海外仕事完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'バイリンガル海外仕事完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              バイリンガル海外仕事完全ガイド｜日英活用・通訳・観光・サポート
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="日本語スキルを海外で活かしたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              日本語と英語の両方が話せる「バイリンガル」は、海外で希少価値の高い人材。通訳・観光・日系企業・カスタマーサポート等、英語のみの現地人より高単価の仕事に就けます。
              <br />
              この記事では主要職種10選、給与水準、応募方法、差別化スキルまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '日英バイリンガルは英語のみ職より20-50%高単価',
              '通訳・翻訳・日系企業・カスタマーサポートが定番',
              '「日英＋専門スキル」の組み合わせが鍵',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-bilingual" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ日英バイリンガル職が高単価か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・日本企業の海外進出継続、日本語人材の需要安定</li>
              <li>・訪日観光客増加で通訳・観光ガイド需要拡大</li>
              <li>・日本商品・サービスのグローバル展開（アニメ・食品等）</li>
              <li>・米・加・豪の日本食ブーム、日本食関連ビジネス拡大</li>
              <li>・日英バイリンガル人材は供給不足、希少価値高</li>
              <li>・英語のみ職より平均20-50%高単価</li>
            </ul>
          </section>

          {/* 職種 */}
          <section id="top-jobs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要職種10選</h2>
            <div className="space-y-3">
              {TOP_JOBS.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{j.job}</p>
                    <p className="text-sm font-bold text-amber-700">{j.salary}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{j.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 給与 */}
          <section id="salary" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">職種別給与水準</h2>
            <div className="space-y-3">
              {SALARY_DETAIL.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{s.role}</p>
                    <p className="text-sm font-bold text-amber-700">{s.salary}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="日本食レストラン・帰国後就活も合わせて"
            description="日本人スキルを活かす他の選択肢、帰国後のキャリアも視野に。"
            primaryHref="/wh-japanese-restaurant"
            primaryLabel="日本食レストラン勤務"
            secondaryHref="/wh-job-hunting-japan"
            secondaryLabel="帰国後就活"
          />

          {/* 求人 */}
          <section id="where-to-find" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">求人の探し方</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {WHERE_TO_FIND.map((w, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">🔍</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 応募 */}
          <section id="application-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募・面接のコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {APPLICATION_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* スキル */}
          <section id="skill-building" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">差別化スキル6つ</h2>
            <div className="space-y-3">
              {SKILL_BUILDING.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{i + 1}. {s}</p>
                </div>
              ))}
            </div>
          </section>

          {/* キャリアパス */}
          <section id="career-path" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">キャリアパス・PR取得</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {CAREER_PATH.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">→</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「バイリンガル・通訳・翻訳・日系」関連の言及を集計。
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
            ※ 給与は2026年5月時点の参考値です。職種・経験・地域により大きく変動します。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-japanese-restaurant" className="text-primary-600 hover:underline">→ 日本食レストラン勤務</Link></li>
              <li><Link href="/wh-job-hunting-japan" className="text-primary-600 hover:underline">→ 帰国後就活</Link></li>
              <li><Link href="/english-resume-guide" className="text-primary-600 hover:underline">→ 英文レジュメ書き方</Link></li>
              <li><Link href="/wh-tech-engineer" className="text-primary-600 hover:underline">→ 海外ITエンジニア</Link></li>
              <li><Link href="/wh-online-business" className="text-primary-600 hover:underline">→ 海外オンラインビジネス</Link></li>
              <li><Link href="/wh-internship" className="text-primary-600 hover:underline">→ 海外インターンシップ</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
