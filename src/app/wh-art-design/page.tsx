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

const PAGE_PATH = '/wh-art-design';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'アート・デザイン留学完全ガイド｜主要校・ポートフォリオ・就職・PR',
  description: '海外アート・デザイン留学の主要校（ロンドンRCA・パーソンズ等）、ポートフォリオ作成、出願、卒業後の就職・キャリアまで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'アート 留学',
    'デザイン 留学',
    'ファッション 留学',
    'グラフィックデザイン 留学',
    '海外 美大',
    'クリエイティブ 留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-art-design', label: 'なぜ海外アート・デザイン留学か' },
  { id: 'top-schools', label: '世界トップアート・デザイン校10選' },
  { id: 'portfolio', label: 'ポートフォリオ作成の鉄則' },
  { id: 'application', label: '出願プロセス' },
  { id: 'cost', label: '費用シミュレーション' },
  { id: 'career-jobs', label: '卒業後のキャリア・職種' },
  { id: 'pr-route', label: 'クリエイティブ職のPR取得' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TOP_SCHOOLS = [
  {
    school: 'Royal College of Art（RCA、英ロンドン）',
    feature: '世界ランキングNo.1アート・デザイン大学院、6年連続',
    cost: '年£40,000-50,000',
  },
  {
    school: 'Parsons School of Design（米NY）',
    feature: 'ファッション・グラフィックの世界トップ校',
    cost: '年$60,000-80,000',
  },
  {
    school: 'Central Saint Martins（英ロンドン）',
    feature: 'ファッション・アートの聖地、卒業生世界的活躍',
    cost: '年£30,000-40,000',
  },
  {
    school: 'Pratt Institute（米NY）',
    feature: 'インテリア・建築・アート、ブルックリン文化',
    cost: '年$55,000-75,000',
  },
  {
    school: 'Rhode Island School of Design（RISD、米）',
    feature: '純粋アート＋デザインのトップ校',
    cost: '年$55,000-70,000',
  },
  {
    school: 'École des Beaux-Arts（仏パリ）',
    feature: '伝統的美術学校、本場フランスアート',
    cost: '年€500-3,000（公立）',
  },
  {
    school: 'Polimoda（伊フィレンツェ）',
    feature: 'ファッション・ラグジュアリーブランド就職強み',
    cost: '年€18,000-35,000',
  },
  {
    school: 'Domus Academy（伊ミラノ）',
    feature: 'デザイン・ファッション・ビジネス融合',
    cost: '年€25,000-35,000',
  },
  {
    school: 'OCAD University（加トロント）',
    feature: 'カナダ最大のアート大学、英語圏で学費中位',
    cost: '年CAD 30,000-40,000',
  },
  {
    school: 'RMIT University（豪メルボルン）',
    feature: 'デザイン・建築・ファッション、豪トップ',
    cost: '年AUD 35,000-50,000',
  },
];

const PORTFOLIO_RULES = [
  '10-20作品厳選、量より質',
  'コンセプト＋プロセス＋完成品の3点セット',
  '英文ステートメント必須、各作品500字程度',
  'プロセス写真・スケッチ・試作品も含める',
  'デジタル＋紙の両方準備（出願時はデジタル）',
  '個性・独自性を明確に表現',
  '応募校の傾向に合わせてカスタマイズ',
];

const APPLICATION_PROCESS = [
  { step: 1, title: 'ポートフォリオ作成（6-12ヶ月）', detail: '20-50点制作、10-20点厳選、プロセス含む' },
  { step: 2, title: '英語試験（IELTS/TOEFL）', detail: '学部6.0-6.5、院7.0+、出願9ヶ月前までに取得' },
  { step: 3, title: 'Personal Statement執筆', detail: '志望理由・アーティストヴィジョン・キャリア目標' },
  { step: 4, title: '推薦状（2-3通）', detail: 'アート教師・実務先メンター推奨' },
  { step: 5, title: '出願（11-2月締切）', detail: 'UCAS（英）、SlideRoom（米）等の専用システム' },
  { step: 6, title: 'インタビュー（一部校）', detail: 'ポートフォリオプレゼンテーション、ビデオ通話面接' },
];

const COST_SIMULATION = [
  { period: '修士1年（英RCA）', tuition: '£40,000-50,000', living: '£15,000-25,000', total: '約1,000-1,400万円' },
  { period: '学部4年（米Parsons）', tuition: '$240,000-320,000', living: '$120,000-200,000', total: '約5,400-7,800万円' },
  { period: '修士2年（伊Polimoda）', tuition: '€36,000-70,000', living: '€30,000-50,000', total: '約1,000-1,900万円' },
  { period: '修士1年（仏Beaux-Arts）', tuition: '€500-3,000', living: '€12,000-20,000', total: '約200-380万円' },
];

const CAREER_JOBS = [
  'グラフィックデザイナー：年収$50,000-100,000、フリーランス可',
  'UI/UXデザイナー：年収$70,000-150,000、Tech企業需要高',
  'ファッションデザイナー：年収$45,000-90,000、ブランド・自社立ち上げ',
  'インテリア・空間デザイナー：年収$50,000-100,000',
  '広告・ブランディング：エージェンシー就職、年収$50,000-120,000',
  'イラストレーター：フリーランス中心、年収幅広',
  'アーティスト：ギャラリー所属、年収不安定だが独自性◎',
];

const PR_ROUTES = [
  '英Graduate Visa：卒業後2年（修士は3年）就労可、Skilled Worker移行',
  '米OPT 1年（STEM 3年）→H-1B→Green Card',
  '加Express Entry：UI/UXデザイナーは点数高、PR取得しやすい',
  '豪Skilled Independent 189：グラフィックデザイナー等の指定職種',
  'EU Blue Card：年収€44,000以上で取得、欧州自由移動',
];

const FAQS = [
  {
    question: 'アート・デザイン留学は何歳まで？',
    answer:
      '学部は18-25歳、院は年齢制限なし。30-40代でキャリアチェンジでアート留学する人も増加中。社会人経験＋ビジネススキル＋アートで「アート×ビジネス」のユニーク人材として評価されることも。',
  },
  {
    question: '日本の美大卒でなくても入学可？',
    answer:
      '可能。多くの海外アート校は「ポートフォリオの質」が最重要、学歴の専攻は問わない。非美術系大学卒＋独学アートでもポートフォリオ次第で名門校合格例多。むしろ「他分野＋アート」の組み合わせを評価する傾向あり。',
  },
  {
    question: 'ポートフォリオは何点必要？',
    answer:
      '応募校により異なるが、10-20点が標準。RCA等トップ校は15-25点＋プロセス資料、米Parsons等は12-15点＋短編動画。「量より質」、各作品にコンセプト＋プロセス＋ステートメントを丁寧に。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      'IELTS 6.0-7.5（学部6.0-6.5、院7.0+）。アート系は理論・批評授業多、ディスカッション・プレゼン英語必須。実技中心と思いがちだが、現代アートは「言語化能力」が問われる。準備期間12-18ヶ月推奨。',
  },
  {
    question: '卒業後に食べていける？',
    answer:
      '職種選び次第。UI/UX・グラフィック・ブランディング等の商業デザインは安定収入＋高単価。純粋アート・イラストは収入不安定だが、SNS・NFT・グッズ展開で個人ブランド化可。「アート×テック」「アート×ビジネス」の組み合わせが現代の成功パターン。',
  },
];

export default async function WhArtDesignPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(アート|デザイン|美術|ファッション|art|design)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(アート|デザイン|美術|ファッション|art|design)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'アート・デザイン留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'アート・デザイン留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              アート・デザイン留学完全ガイド｜主要校・ポートフォリオ・就職・PR
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="海外アート・デザイン留学を検討する方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              アート・デザイン留学は、グラフィックデザイン・ファッション・建築・ファインアート等のクリエイティブキャリアを世界トップレベルで学べるルート。
              <br />
              この記事では世界トップ10校、ポートフォリオ作成、出願プロセス、卒業後のキャリア、PR取得まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '世界トップ校：RCA・Parsons・CSM・Pratt等',
              'ポートフォリオ10-20点が最重要、英語力＋',
              'UI/UX・グラフィック等の商業デザインはPR取得しやすい',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-art-design" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ海外アート・デザイン留学か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・世界トップレベルの教授陣＋施設＋アート理論</li>
              <li>・グローバルアートシーンへの参入</li>
              <li>・卒業生ネットワーク（業界トップに繋がる）</li>
              <li>・ロンドン・NY・パリ・ミラノ等の文化中心地で生活</li>
              <li>・卒業後就労ビザでアート関連職へ</li>
              <li>・「グローバルクリエイター」としてのキャリア</li>
            </ul>
          </section>

          {/* 主要校 */}
          <section id="top-schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">世界トップアート・デザイン校10選</h2>
            <div className="space-y-3">
              {TOP_SCHOOLS.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{s.school}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{s.feature}</p>
                  <p className="text-sm text-amber-700 font-bold">{s.cost}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ポートフォリオ */}
          <section id="portfolio" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ポートフォリオ作成の鉄則</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PORTFOLIO_RULES.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="海外大学・大学院進学全般も合わせて"
            description="アート以外の海外大学院進学、IELTS免除条件等も確認を。"
            primaryHref="/wh-overseas-university"
            primaryLabel="海外大学・大学院進学"
            secondaryHref="/english-test-waiver"
            secondaryLabel="IELTS/TOEFL免除条件"
          />

          {/* 出願 */}
          <section id="application" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">出願プロセス</h2>
            <div className="space-y-3">
              {APPLICATION_PROCESS.map((a) => (
                <div key={a.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {a.step}: {a.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{a.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用シミュレーション</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">プログラム</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">学費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">生活費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">合計</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_SIMULATION.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.period}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.tuition}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.living}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* キャリア */}
          <section id="career-jobs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">卒業後のキャリア・職種</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {CAREER_JOBS.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">🎨</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* PR */}
          <section id="pr-route" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">クリエイティブ職のPR取得</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PR_ROUTES.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">→</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「アート・デザイン・美術・ファッション」関連の言及を集計。
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
            ※ 学費・入学要件は2026年5月時点の情報です。最新情報は各校公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-overseas-university" className="text-primary-600 hover:underline">→ 海外大学・大学院進学</Link></li>
              <li><Link href="/english-test-waiver" className="text-primary-600 hover:underline">→ IELTS/TOEFL免除</Link></li>
              <li><Link href="/scholarship-wh" className="text-primary-600 hover:underline">→ ワーホリ奨学金</Link></li>
              <li><Link href="/wh-tech-engineer" className="text-primary-600 hover:underline">→ 海外ITエンジニア</Link></li>
              <li><Link href="/paris-livecost" className="text-primary-600 hover:underline">→ パリ生活費</Link></li>
              <li><Link href="/uk-london-cost" className="text-primary-600 hover:underline">→ ロンドン生活費</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
