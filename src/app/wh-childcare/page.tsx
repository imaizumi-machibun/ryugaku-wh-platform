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

const PAGE_PATH = '/wh-childcare';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外チャイルドケア仕事完全ガイド｜Certificate取得・保育所就職・PR取得',
  description: '海外で保育士・チャイルドケアワーカーとして働く完全ガイド。Certificate III/Diploma取得、保育所就職、給与水準、PR取得直結ルートまで実例解説。',
  path: PAGE_PATH,
  keywords: [
    '海外 チャイルドケア',
    '海外 保育士',
    'Childcare オーストラリア',
    'Certificate III',
    '海外 保育所 仕事',
    'チャイルドケア PR',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-childcare', label: 'なぜチャイルドケアが人気か' },
  { id: 'certificates', label: 'Certificate III/Diploma取得' },
  { id: 'job-types', label: '職種・保育所の種類' },
  { id: 'salary', label: '給与水準・労働時間' },
  { id: 'pr-route', label: 'PR取得への直通ルート' },
  { id: 'how-to-find-job', label: '就職活動の進め方' },
  { id: 'preparation', label: '準備期間と費用' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const CERTIFICATES = [
  {
    cert: 'Certificate III in Early Childhood Education and Care',
    duration: '6-12ヶ月',
    cost: 'AUD 3,000-8,000',
    detail: '入門資格、Childcare Assistantとして就労可',
  },
  {
    cert: 'Diploma of Early Childhood Education and Care',
    duration: '12-24ヶ月',
    cost: 'AUD 12,000-20,000',
    detail: '上級資格、ECT（Early Childhood Teacher）への足がかり',
  },
  {
    cert: 'Bachelor of Early Childhood Education',
    duration: '3-4年',
    cost: 'AUD 30,000-90,000',
    detail: '大学卒業資格、Lead Educator・PR申請に最適',
  },
];

const JOB_TYPES = [
  { type: 'Long Day Care Centre', detail: '7-18時開所の標準的保育所、最も求人多' },
  { type: 'Family Day Care', detail: '個人宅で4-5人の少人数保育、家庭的雰囲気' },
  { type: 'OSHC（学童）', detail: '小学生対象の放課後・休暇保育、午前/午後シフト' },
  { type: 'Kindergarten/Preschool', detail: '3-5歳児の幼児教育、学校と連携' },
  { type: 'Nanny（住み込み）', detail: '個人家庭での子守、給与高めだが孤独' },
];

const SALARY_INFO = [
  { role: 'Childcare Assistant（Cert III）', salary: 'AUD 25-30/時', detail: '入門レベル、週5日勤務でAUD 1,000-1,200' },
  { role: 'Childcare Educator（Diploma）', salary: 'AUD 30-38/時', detail: '中級、Lead Educator候補' },
  { role: 'Early Childhood Teacher（学位）', salary: 'AUD 70,000-95,000/年', detail: '正規教員、PR取得最有利' },
  { role: 'Centre Manager', salary: 'AUD 80,000-110,000/年', detail: 'マネジメント、5-10年経験' },
];

const PR_ROUTES = [
  '①Skilled Independent 189（学位＋経験）：Early Childhood Teacherは職種リスト常連',
  '②Skilled Nominated 190（州指名）：QLD・WA・VICで需要高、PNP対象',
  '③Employer Sponsored 482→186：保育所スポンサーで4年勤務後にPR',
  '④Regional Skilled Visa 491：地方都市で勤務、5年でPR',
  '※豪は慢性的Childcare不足、雇用主スポンサー獲得しやすい職種',
];

const JOB_SEARCH = [
  'SEEK・Indeedで「Childcare」「Early Childhood」検索',
  'GoodStart Early Learning・KU Children\'s Services等の大手保育所チェーン応募',
  'Working with Children Check（WWCC）取得必須、無料で発行',
  '保育所見学＋ボランティアから始めるルートも',
  '英語面接対策（子供との関わり方の具体エピソード準備）',
  'Diploma卒業→保育所からの推薦で正規採用が王道',
];

const PREPARATION = [
  { phase: '渡航1.5-2年前', detail: 'IELTS 6.0+取得、英語学習継続' },
  { phase: '渡航1年前', detail: '専門学校（TAFE等）入学許可、学生ビザ取得' },
  { phase: '渡航時', detail: 'Certificate IIIまたはDiploma開始、WWCC取得' },
  { phase: '6ヶ月後', detail: 'パートタイムChildcare勤務、現場経験開始' },
  { phase: '卒業後', detail: 'フルタイム就職、PR申請に向けたキャリア構築' },
];

const FAQS = [
  {
    question: '日本の保育士資格は海外で通用する？',
    answer:
      '直接通用しない、Certificate III/Diplomaの取得必須。ただし日本の保育士経験は応募時の強みになる、推薦状＋経験詳細記載で差別化。経験者は学習スピード速、6-12ヶ月でCertificate III取得→即就職パターン多。',
  },
  {
    question: 'チャイルドケアからPR取得は本当に可能？',
    answer:
      '十分可能、特にEarly Childhood Teacher（学位）はPR取得しやすい職種。Certificate III/Diploma経由でも雇用主スポンサーでPR取得実例多。豪政府が積極的に保育士不足解消を進めており、向こう数年は需要安定。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      '日常会話レベル（IELTS 6.0+）から開始可。子供との会話はシンプル、現場で英語スキル急上昇。Diploma授業・職員ミーティング・保護者対応にはIELTS 7.0レベルが望ましい。英語＋日本人特有の繊細さ＋勤勉さで現場で重宝される。',
  },
  {
    question: '学費と労働時間のバランスは？',
    answer:
      '学生ビザは週20時間まで就労可、Certificate III学生で月収AUD 2,000-3,000は可能。Diploma中はパートタイムChildcare＋学費収益化のループで生活費賄える。卒業後は週40時間フルタイム勤務に切り替え。',
  },
  {
    question: 'チャイルドケア仕事のリアルは？',
    answer:
      '体力勝負＋責任重大。子供のお世話＋安全管理＋親対応＋書類業務で1日中動き回る。給与は他職種比中程度だが、子供との触れ合い・成長を見守る喜び大。「子供が好き」が大前提、合わない人は早期離職多。',
  },
];

export default async function WhChildcarePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(チャイルドケア|保育|子供|Certificate|childcare)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(チャイルドケア|保育|子供|Certificate|childcare)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外チャイルドケア仕事完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外チャイルドケア仕事完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外チャイルドケア仕事完全ガイド｜Certificate・保育所就職・PR取得
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="子供好き・保育経験者で海外キャリア目指す方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              海外チャイルドケア（保育）は、PR取得直結＋安定した需要＋やりがい大の職種。日本の保育士経験者は特に有利、Certificate III取得で1年以内に就職可能です。
              <br />
              この記事では資格取得、職種、給与、PR取得ルート、就職活動まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'Certificate III取得（6-12ヶ月）でChildcare Assistant就労可',
              '時給AUD 25-38、Early Childhood TeacherでPR最有利',
              '豪は慢性的保育士不足、雇用主スポンサー獲得しやすい',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-childcare" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜチャイルドケアが人気か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・豪・加・英・米で慢性的保育士不足、需要安定</li>
              <li>・PR取得直結ルート（Early Childhood Teacherは職業リスト常連）</li>
              <li>・日本の保育士経験は応募時の強み</li>
              <li>・子供との関わりは英語上達の最強環境</li>
              <li>・Certificate III取得1年以内で就職可</li>
              <li>・帰国後も外資系保育所・幼稚園で活躍</li>
            </ul>
          </section>

          {/* Certificate */}
          <section id="certificates" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Certificate III/Diploma取得</h2>
            <div className="space-y-3">
              {CERTIFICATES.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{c.cert}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>期間:</strong> {c.duration}</p>
                    <p><strong>費用:</strong> <span className="text-amber-700 font-bold">{c.cost}</span></p>
                    <p className="text-xs text-gray-500 mt-2">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 職種 */}
          <section id="job-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">職種・保育所の種類</h2>
            <div className="space-y-3">
              {JOB_TYPES.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{j.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{j.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 給与 */}
          <section id="salary" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">給与水準・労働時間</h2>
            <div className="space-y-3">
              {SALARY_INFO.map((s, i) => (
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
            title="オーペア・看護師等の専門職も合わせて"
            description="チャイルドケア以外の専門職海外キャリアも視野に。"
            primaryHref="/wh-au-pair"
            primaryLabel="オーペア完全ガイド"
            secondaryHref="/wh-nurse"
            secondaryLabel="海外で看護師"
          />

          {/* PRルート */}
          <section id="pr-route" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">PR取得への直通ルート</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PR_ROUTES.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🏠</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 就職活動 */}
          <section id="how-to-find-job" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">就職活動の進め方</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {JOB_SEARCH.map((j, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{j}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 準備期間 */}
          <section id="preparation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">準備期間と費用</h2>
            <div className="space-y-3">
              {PREPARATION.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{p.phase}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「チャイルドケア・保育・子供」関連の言及を集計。
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
            ※ 資格・給与・ビザ要件は2026年5月時点の情報です。最新情報はAustralian Childrens Education and Care Quality Authority公式情報、TAFE等の学校公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-au-pair" className="text-primary-600 hover:underline">→ オーペア完全ガイド</Link></li>
              <li><Link href="/wh-nurse" className="text-primary-600 hover:underline">→ 海外で看護師</Link></li>
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/au-second-year-visa" className="text-primary-600 hover:underline">→ 豪WHセカンドビザ</Link></li>
              <li><Link href="/wh-job-hunting-japan" className="text-primary-600 hover:underline">→ 帰国後就活</Link></li>
              <li><Link href="/30s-guide" className="text-primary-600 hover:underline">→ 30代からの留学</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
