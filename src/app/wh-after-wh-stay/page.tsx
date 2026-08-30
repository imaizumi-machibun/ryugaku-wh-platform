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

const PAGE_PATH = '/wh-after-wh-stay';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ後の滞在延長ビザ完全ガイド｜学生・就労・PR｜各国の選択肢',
  description: 'ワーホリ終了後の滞在延長5ルート（学生ビザ・就労ビザ・スポンサー・PR・パートナー）を完全解説。豪・加・英・NZ・独の各国別選択肢、申請手順、費用、成功のコツ。',
  path: PAGE_PATH,
  keywords: [
    'ワーホリ 延長',
    'ワーホリ 後 ビザ',
    'WH後 滞在',
    '学生ビザ 切替',
    'ワーホリ 就労ビザ',
    'ワーホリ 終了 残りたい',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '滞在延長の5つの選択肢' },
  { id: 'student-visa', label: '①学生ビザに切替' },
  { id: 'work-visa', label: '②就労ビザ（雇用主スポンサー）' },
  { id: 'partner-visa', label: '③パートナービザ' },
  { id: 'second-3rd-visa', label: '④セカンド・3rdワーホリ（豪のみ）' },
  { id: 'pr-route', label: '⑤PR（永住権）申請' },
  { id: 'by-country', label: '国別の選択肢比較' },
  { id: 'timing', label: '切替タイミングと注意点' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const OPTIONS_OVERVIEW = [
  {
    option: '①学生ビザに切替',
    duration: '6ヶ月-数年（コース次第）',
    difficulty: '★★（低）',
    detail: '語学学校・専門学校・大学に入学申請、最も簡単',
  },
  {
    option: '②就労ビザ',
    duration: '2-4年',
    difficulty: '★★★★（高）',
    detail: '雇用主のスポンサー必要、職種限定',
  },
  {
    option: '③パートナービザ',
    duration: '2-3年→PR',
    difficulty: '★★（やや低）',
    detail: '現地国民・PR保持者と結婚 or 事実婚',
  },
  {
    option: '④セカンド・3rdワーホリ',
    duration: '+1〜2年',
    difficulty: '★★★（中）',
    detail: '豪のみ可能、対象就労88日条件',
  },
  {
    option: '⑤PR申請',
    duration: '2-5年',
    difficulty: '★★★★★（最高）',
    detail: '点数制・職種限定、長期計画必要',
  },
];

const STUDENT_VISA_BY_COUNTRY = [
  { country: '豪', visa: 'Student Visa (Subclass 500)', detail: '学校入学許可＋健康保険＋資金証明、就労週20時間可' },
  { country: '加', visa: 'Study Permit', detail: 'DLI認定校入学許可＋資金証明、就労週20時間可' },
  { country: '英', visa: 'Student Visa', detail: 'CAS発行＋IHS必須、就労週20時間可' },
  { country: 'NZ', visa: 'Fee Paying Student Visa', detail: '6ヶ月超で就労可（12ヶ月超学校）' },
  { country: '独', visa: 'Studentenvisum', detail: '大学入学許可＋資金証明（月€1,000）' },
];

const WORK_VISA_PATHS = [
  {
    path: '豪 → TSS 482 → ENS 186',
    detail: '4年勤務後にPR申請、職種限定（看護・IT・シェフ等）',
    requirement: 'IELTS 5.0+、職歴2年+、英語要件年々厳格化',
  },
  {
    path: '加 → LMIA → PNP → PR',
    detail: '雇用主LMIA取得→州指名PNP申請→PR、3-5年',
    requirement: 'CRS点数積み上げ、英語IELTS 6+',
  },
  {
    path: '英 → Skilled Worker Visa',
    detail: '雇用主スポンサー＋年収£26,200以上、5年でPR',
    requirement: '指定職種＋英語要件＋健康診断',
  },
];

const PARTNER_VISA_KEY = [
  '現地国籍 or PR保持者と「正規結婚」or「12ヶ月以上の事実婚」が必須',
  '関係性の証明：共同生活・共通の経済・社会的承認',
  '審査期間：申請から発給まで1-3年',
  '申請料：豪AUD 9,365、加CAD 1,365、英£1,538 等',
  '一時ビザ→PRビザの2段階発給が一般的',
  '結婚詐欺対策で審査厳格、十分な書類準備必要',
];

const BY_COUNTRY_COMPARE = [
  {
    country: 'オーストラリア',
    options: '学生・就労・パートナー・セカンド/3rdワーホリ・PR',
    feature: '選択肢最多、ワーホリ→学生→就労→PRの王道ルート確立',
  },
  {
    country: 'カナダ',
    options: '学生・就労（LMIA）・パートナー・PR（Express Entry/PNP）',
    feature: 'Express Entry経由のPRが速い、IECの2nd participation可能性',
  },
  {
    country: 'イギリス',
    options: '学生・Skilled Worker・パートナー・Graduate Visa',
    feature: 'YMS→Student→Graduate→Skilledのルート、職種限定',
  },
  {
    country: 'ニュージーランド',
    options: '学生・Essential Skills Work Visa・パートナー・PR',
    feature: 'WHV延長3ヶ月、Specified Workで条件付き延長可',
  },
  {
    country: 'ドイツ',
    options: '学生・Job Seeker Visa・Blue Card・パートナー',
    feature: 'Job Seeker Visa（6ヶ月）で就活可、EU内移動も',
  },
];

const TIMING_NOTES = [
  'WHV終了の3-6ヶ月前から次ビザ準備開始',
  'WHV有効期限内に次ビザ申請開始（Bridging Visa）',
  '学生ビザは学校入学許可（CoE/DLI）取得が起点、6-8週間前準備',
  '就労ビザは雇用主との交渉が長期、6ヶ月-1年の準備',
  'パートナービザは関係性証明書類12ヶ月以上の蓄積必要',
  '帰国＋再申請も可能だが、現地滞在から申請する方が成功率高',
];

const FAQS = [
  {
    question: 'ワーホリ後すぐ次ビザ取れる？',
    answer:
      'WHV有効期限内に次ビザ申請すれば、Bridging Visa（豪）等で滞在継続可。学生ビザは学校入学許可が降りれば1-2ヶ月で切替可。就労ビザは雇用主スポンサー獲得＋申請から発給まで6-12ヶ月、長期計画必要。',
  },
  {
    question: '最も簡単に延長できるのは？',
    answer:
      '学生ビザ。語学学校なら入学許可も柔軟、申請から1-2ヶ月で発給。職業系・大学進学はより本格的だが、学費が高くなる（豪・加・英で年200-500万円）。豪のみセカンド・3rdワーホリの選択肢もあり。',
  },
  {
    question: '雇用主スポンサーは現実的？',
    answer:
      '職種次第。看護師・ITエンジニア・シェフ・教師等の指定職種は実現可能性高。観光業・カジュアル接客は限定的。「現在の職場でセクションマネージャーまで上り、PR申請を支援してもらう」のが定番ルート。WHV中から長期キャリア構築を意識。',
  },
  {
    question: 'PR取得まで何年かかる？',
    answer:
      '国・ルートによりますが、最短2年（カナダExpress Entry）、一般的に4-5年（豪雇用主スポンサー）、最長10年（特殊ケース）。長期計画＋英語要件（IELTS 6-7）＋職種選定＋年齢管理（45歳未満必須）の組み合わせ。',
  },
  {
    question: '帰国してから再申請するべき？',
    answer:
      '現地滞在から申請の方が成功率高い。①雇用主・学校との繋がり活かせる、②面接・書類準備しやすい、③不備時の対応スムーズ。ただし健康診断・身元証明等で日本一時帰国必要なケースあり。完全帰国前提なら、十分準備して帰国後再申請も可。',
  },
];

export default async function WhAfterWhStayPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(学生ビザ|就労ビザ|延長|スポンサー|PR|残留)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(学生ビザ|就労ビザ|延長|スポンサー|PR|残留)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ後の滞在延長ビザ完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ後の滞在延長ビザ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリ後の滞在延長ビザ完全ガイド｜学生・就労・PR｜各国の選択肢
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ワーホリ終了が近く滞在延長を考えている方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「ワーホリ1年だけじゃ足りない」「もっと住みたい」と感じたら、滞在延長のビザ切替が必要。学生・就労・パートナー・セカンドWHV・PR等、5つの選択肢があります。
              <br />
              この記事では各ビザの特徴、国別の選択肢、切替タイミング、成功のコツを完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '5つの延長ルート：学生・就労・パートナー・セカンド・PR',
              '最も簡単は学生ビザ、最も困難は雇用主スポンサー',
              'WHV終了3-6ヶ月前から次ビザ準備開始',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 概要 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">滞在延長の5つの選択肢</h2>
            <div className="space-y-3">
              {OPTIONS_OVERVIEW.map((o, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{o.option}</p>
                    <p className="text-sm font-bold text-amber-700">{o.difficulty}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">期間: {o.duration}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{o.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 学生ビザ */}
          <section id="student-visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">①学生ビザに切替</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              最も実現性高いルート。語学学校・専門学校・大学に入学申請→ビザ切替。
            </p>
            <div className="space-y-3">
              {STUDENT_VISA_BY_COUNTRY.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{s.country}</p>
                  <p className="text-sm text-gray-800 mb-1"><strong>ビザ:</strong> {s.visa}</p>
                  <p className="text-xs text-gray-600">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 就労ビザ */}
          <section id="work-visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">②就労ビザ（雇用主スポンサー）</h2>
            <div className="space-y-3">
              {WORK_VISA_PATHS.map((w, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{w.path}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{w.detail}</p>
                  <p className="text-xs text-gray-500"><strong>要件:</strong> {w.requirement}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="豪PR取得ルートの詳細も合わせて"
            description="ワーホリ→学生→雇用主スポンサー→PRの完全マップ。"
            primaryHref="/au-pr-route"
            primaryLabel="豪PR取得5ルート"
            secondaryHref="/au-second-year-visa"
            secondaryLabel="豪WHセカンドビザ"
          />

          {/* パートナー */}
          <section id="partner-visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">③パートナービザ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {PARTNER_VISA_KEY.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">💑</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* セカンドWHV */}
          <section id="second-3rd-visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">④セカンド・3rdワーホリ（豪のみ）</h2>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・豪WHのみ、セカンド+1年、3rd+1年で最大3年滞在可</p>
              <p>・条件：対象地域＋対象職種で88日（フルタイム週6日）就労</p>
              <p>・3rd申請：2nd中に6ヶ月Specified Work追加</p>
              <p>・他国（加・英・NZ等）はセカンドWHV制度なし</p>
              <p>・詳細は「豪WHセカンドビザ完全ガイド」参照</p>
            </div>
          </section>

          {/* PR */}
          <section id="pr-route" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">⑤PR（永住権）申請</h2>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・ワーホリから直接のPR申請ルートはない</p>
              <p>・通常：WHV→学生 or 就労→数年勤務→PR申請の多段階ルート</p>
              <p>・豪：4-5年、加：2-4年、英：5年、NZ：3-5年が一般的</p>
              <p>・年齢制限：申請時45歳未満、若いほど点数有利</p>
              <p>・英語要件：IELTS 6-7+必須</p>
              <p>・詳細は「豪PR取得5ルート」「カナダExpress Entry」等参照</p>
            </div>
          </section>

          {/* 国別 */}
          <section id="by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別の選択肢比較</h2>
            <div className="space-y-3">
              {BY_COUNTRY_COMPARE.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{c.country}</p>
                  <p className="text-sm text-gray-800 mb-1"><strong>選択肢:</strong> {c.options}</p>
                  <p className="text-xs text-gray-500">{c.feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* タイミング */}
          <section id="timing" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">切替タイミングと注意点</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {TIMING_NOTES.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「学生ビザ・就労ビザ・延長・PR」関連の言及を集計。
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
            ※ ビザ要件・申請料・所要期間は2026年5月時点の情報です。最新情報は各国移民局公式情報＋MARA・RCIC等の登録移民弁護士へのご相談を推奨します。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/au-second-year-visa" className="text-primary-600 hover:underline">→ 豪WHセカンドビザ</Link></li>
              <li><Link href="/after-wh" className="text-primary-600 hover:underline">→ ワーホリ後の進路</Link></li>
              <li><Link href="/wh-job-hunting-japan" className="text-primary-600 hover:underline">→ 帰国後就活完全ガイド</Link></li>
              <li><Link href="/wh-after-30" className="text-primary-600 hover:underline">→ 30歳ギリギリWH</Link></li>
              <li><Link href="/wh-credit-history" className="text-primary-600 hover:underline">→ 海外クレヒス構築</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
