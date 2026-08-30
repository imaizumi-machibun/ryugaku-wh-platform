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

const PAGE_PATH = '/wh-tech-engineer';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外でITエンジニアとして働く完全ガイド｜ビザ・年収・都市選び',
  description: 'WH/学生ビザ/H-1B/スポンサー経由で海外IT就職する完全ガイド。シリコンバレー/ロンドン/トロント/ベルリン等の年収・物価・キャリアパス・PR取得ルートを完全解説。',
  path: PAGE_PATH,
  keywords: [
    '海外 エンジニア 転職',
    'シリコンバレー 就職',
    '海外 IT エンジニア',
    'H-1B ビザ',
    'カナダ IT エンジニア',
    '海外 プログラマー',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-overseas', label: 'なぜ海外でITエンジニアか' },
  { id: 'visa-routes', label: 'ビザ取得5ルート' },
  { id: 'top-cities', label: '都市別年収・物価比較' },
  { id: 'skills-required', label: '必要なスキル・英語力' },
  { id: 'career-path', label: 'WH/学生からPRまでのキャリアパス' },
  { id: 'job-search', label: '応募・面接の進め方' },
  { id: 'pros-cons', label: 'メリット・デメリット' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const VISA_ROUTES = [
  {
    route: '①WHV→現地就職→雇用主スポンサー',
    detail: 'WHVで現地入り→IT求人応募→雇用主のスポンサーで就労ビザ切替',
    country: '豪・加・英・独・愛',
    difficulty: '★★★',
  },
  {
    route: '②学生ビザ→新卒採用→PR',
    detail: '現地大学・専門学校進学→Graduate Visa→就職→PR申請',
    country: '英（Graduate Visa）・加（PGWP）・豪（Subclass 485）',
    difficulty: '★★★★',
  },
  {
    route: '③H-1B（米国専用）',
    detail: '米国雇用主スポンサー＋抽選当選必須、年85,000枠',
    country: '米国のみ',
    difficulty: '★★★★★',
  },
  {
    route: '④Express Entry（カナダ）',
    detail: 'CRS点数制、IT職は加点高、職歴3年以上で有利',
    country: 'カナダ',
    difficulty: '★★★★',
  },
  {
    route: '⑤Blue Card（EU）',
    detail: '年収€44,000以上＋大卒で取得可、欧州自由移動',
    country: '独・仏・蘭等のEU',
    difficulty: '★★★',
  },
];

const TOP_CITIES = [
  {
    city: 'シリコンバレー（米国）',
    salary: '年収$130,000-300,000+',
    cost: '家賃$2,500-4,000/月',
    feature: '世界最高峰のテック中心地、H-1B競争激',
  },
  {
    city: 'シアトル（米国）',
    salary: '年収$110,000-250,000',
    cost: '家賃$2,000-3,000/月',
    feature: 'MS/Amazon本拠地、シリコンバレーよりやや安',
  },
  {
    city: 'トロント（カナダ）',
    salary: '年収CAD 80,000-150,000',
    cost: '家賃CAD 1,800-3,000/月',
    feature: 'GAFAも展開、PR取得しやすい',
  },
  {
    city: 'ロンドン（英）',
    salary: '年収£60,000-120,000',
    cost: '家賃£1,500-2,500/月',
    feature: '欧州最大テックHub、Fintech強み',
  },
  {
    city: 'ベルリン（独）',
    salary: '年収€60,000-100,000',
    cost: '家賃€800-1,500/月',
    feature: 'スタートアップ天国、コスパ最強',
  },
  {
    city: 'シドニー（豪）',
    salary: '年収AUD 100,000-180,000',
    cost: '家賃AUD 2,500-4,000/月',
    feature: 'Atlassian本社、WHV経由でアクセス可',
  },
];

const REQUIRED_SKILLS = [
  '主要言語スキル：JavaScript/TypeScript、Python、Go、Rust等の現代スタック',
  'フレームワーク：React/Next.js、Django/FastAPI、Spring Boot等',
  'クラウド：AWS/Azure/GCPの実務経験',
  'Git・CI/CD・Docker・Kubernetes等のDevOps',
  '英語：TOEIC 800+、ビジネス英語で議論・コードレビュー可',
  'システム設計力（大規模アプリ・分散システム）',
  'コミュニケーション：英語でのドキュメント・プレゼン能力',
];

const CAREER_PATH = [
  { step: 1, title: 'WHV/学生ビザで現地入り', detail: 'WHVは即仕事可、学生はインターン→新卒採用ルート' },
  { step: 2, title: '現地IT企業のインターン or 契約社員', detail: '実務経験＋ネットワーク構築、ローカル英語ビジネス習慣' },
  { step: 3, title: 'フルタイム正社員オファー獲得', detail: '雇用主スポンサーでビザ切替、年収交渉' },
  { step: 4, title: '2-4年勤務→PR申請', detail: '加（Express Entry）・豪（189/190）・英（5年）等' },
  { step: 5, title: 'PR取得→キャリア継続 or 他国へ', detail: 'GAFA・スタートアップでキャリア確立、リモートで多国展開も' },
];

const JOB_SEARCH = [
  'LinkedInプロフィール完成（英語、ポートフォリオリンク必須）',
  'GitHub・個人ブログでアウトプット蓄積',
  'AngelList（スタートアップ）・LinkedIn・Indeed・Hired等で応募',
  'リクルーター経由のオファーも積極活用',
  '面接：HR電話→技術面接（Coding/System Design）→Cultural fit',
  '英語面接対策（LeetCodeで毎日プログラミング英語問題）',
];

const PROS = [
  '日本の3-5倍の年収（米国・豪）',
  '英語＋IT＋多文化のグローバル人材に',
  'リモートワーク文化が日本より発達',
  '世界的なテック企業（GAFA・スタートアップ）でキャリア',
  'PR取得でグローバル生活の選択肢',
];

const CONS = [
  '物価高（特に米・英・豪）、年収高でも生活費圧迫',
  '雇用市場の競争激しく、解雇リスクあり',
  'ビザ・PR取得まで2-5年の長期戦',
  '日本のキャリア・年金が一旦リセット',
  '家族・友人と離れる、文化的孤独感',
];

const FAQS = [
  {
    question: 'WHVから雇用主スポンサーは現実的？',
    answer:
      '可能、ただし職種・スキル次第。IT エンジニアは需要高、特に豪・加・独で雇用主スポンサーを得やすい。WHV中の1-2年でローカル経験＋英語ビジネス力＋ネットワーク構築が必須。「現職場で正社員昇格→スポンサー」が定番ルート。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      'TOEIC 800+、IELTS 7.0+が目安。職務面接、コードレビュー、設計議論、ドキュメント執筆が英語で必要。「英語で技術を語れる」レベルが基準。最初はキャッチアップ大変だが、3-6ヶ月でビジネス英語に慣れる人多。',
  },
  {
    question: '年収はどれくらい上がる？',
    answer:
      'シリコンバレーで$130-300k（日本の3-5倍）、トロント CAD 80-150k（日本の2-3倍）、ベルリン€60-100k（日本の1.5-2倍）。ただし物価高で生活費も上がるため、可処分所得は1.5-2倍程度が現実的。GAFA・トップスタートアップなら更に上。',
  },
  {
    question: 'シリコンバレーvsトロントvsロンドン、どこ？',
    answer:
      '年収最高はシリコンバレー、ただしH-1B抽選で運要素大。トロントはExpress EntryでPRしやすく、安定キャリア向き。ロンドンは欧州拠点としてのキャリア＋多文化。ベルリンはコスパ＋スタートアップ。自分の優先順位（年収/PR/文化）で選択。',
  },
  {
    question: '日本のIT経験は通用する？',
    answer:
      'スキル次第。Java/SI出身は新興スタックへのキャッチアップ必要、ReactやAWS等の現代スタック経験者は即戦力。日本の「品質重視・受託開発」文化と海外の「スピード重視・プロダクト開発」文化のギャップに最初戸惑うが、3-6ヶ月で適応可。',
  },
];

export default async function WhTechEngineerPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(エンジニア|プログラマー|IT|テック|engineer|developer)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(エンジニア|プログラマー|IT|テック|engineer)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外でITエンジニアとして働く完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外でITエンジニアとして働く完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外でITエンジニアとして働く完全ガイド｜ビザ・年収・都市選び
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="海外ITキャリア・PR取得目指すエンジニア"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              日本のITエンジニアが海外でキャリアを築くチャンスが急速に拡大中。年収日本の3-5倍、グローバル経験、PRルートとメリット多。
              <br />
              この記事ではビザ5ルート、都市別年収、必要スキル、WHV/学生からPRまでのキャリアパス、応募方法まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'ビザはWHV→雇用主スポンサー・Express Entry・H-1Bの5ルート',
              '年収はシリコンバレー$130-300k、トロントCAD 80-150k',
              'WHV/学生→ローカル経験→PR取得が王道の長期キャリア戦略',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ海外 */}
          <section id="why-overseas" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ海外でITエンジニアか</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・年収日本の3-5倍（シリコンバレー）、2-3倍（トロント・ロンドン）</li>
              <li>・最先端技術スタック＋大規模プロダクト経験</li>
              <li>・GAFA・トップスタートアップでのキャリア</li>
              <li>・リモートワーク文化が日本より発達</li>
              <li>・PR取得でグローバルキャリア基盤構築</li>
              <li>・日本に戻っても外資・上場企業で高評価</li>
            </ul>
          </section>

          {/* ビザ5ルート */}
          <section id="visa-routes" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザ取得5ルート</h2>
            <div className="space-y-3">
              {VISA_ROUTES.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{v.route}</p>
                    <p className="text-sm font-bold text-amber-700">{v.difficulty}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-1">{v.detail}</p>
                  <p className="text-xs text-gray-500"><strong>対応国:</strong> {v.country}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 都市別 */}
          <section id="top-cities" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">都市別年収・物価比較</h2>
            <div className="space-y-3">
              {TOP_CITIES.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{c.city}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>年収:</strong> <span className="text-emerald-700">{c.salary}</span></p>
                    <p><strong>家賃:</strong> {c.cost}</p>
                    <p className="text-xs text-gray-500 mt-2">{c.feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="エンジニアWHの詳細も合わせて"
            description="WHV経由のリモートワーク・現地転職、エンジニア特化情報を網羅。"
            primaryHref="/engineer-wh"
            primaryLabel="エンジニアワーホリ"
            secondaryHref="/wh-job-hunting-japan"
            secondaryLabel="帰国後就活"
          />

          {/* 必要スキル */}
          <section id="skills-required" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">必要なスキル・英語力</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {REQUIRED_SKILLS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">💻</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* キャリアパス */}
          <section id="career-path" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">WH/学生からPRまでのキャリアパス</h2>
            <div className="space-y-3">
              {CAREER_PATH.map((c) => (
                <div key={c.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {c.step}: {c.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 応募 */}
          <section id="job-search" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募・面接の進め方</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {JOB_SEARCH.map((j, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{j}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* メリデメ */}
          <section id="pros-cons" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">メリット・デメリット</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-emerald-800">✓ メリット</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {PROS.map((p, i) => (
                    <li key={i} className="leading-relaxed">・{p}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-rose-800">✗ デメリット</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {CONS.map((c, i) => (
                    <li key={i} className="leading-relaxed">・{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「エンジニア・IT・テック」関連の言及を集計。
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
            ※ 年収・物価は2026年5月時点の参考値です。職種・経験・企業規模・為替により大きく変動します。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/engineer-wh" className="text-primary-600 hover:underline">→ エンジニアワーホリ</Link></li>
              <li><Link href="/wh-job-hunting-japan" className="text-primary-600 hover:underline">→ 帰国後就活</Link></li>
              <li><Link href="/wh-internship" className="text-primary-600 hover:underline">→ 海外インターンシップ</Link></li>
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/us-language-school" className="text-primary-600 hover:underline">→ アメリカ語学留学</Link></li>
              <li><Link href="/english-resume-guide" className="text-primary-600 hover:underline">→ 英文レジュメ</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
