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

const PAGE_PATH = '/nz-language-school';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ニュージーランド語学留学完全ガイド｜Student Visa・主要校・費用・都市別特徴',
  description: 'NZ語学留学のStudent Visa取得、主要語学学校5校、費用、Auckland/Wellington/Christchurch/Queenstownの都市別特徴、英語学習＋自然体験の魅力を完全解説。',
  path: PAGE_PATH,
  keywords: [
    'ニュージーランド 語学留学',
    'NZ 留学 費用',
    'オークランド 留学',
    'NZ 語学学校',
    'NZ Student Visa',
    'ニュージーランド 短期留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-nz', label: 'なぜNZ語学留学なのか' },
  { id: 'visa-types', label: 'Student Visa の種類' },
  { id: 'top-schools', label: '主要語学学校5校' },
  { id: 'cost', label: '費用シミュレーション' },
  { id: 'by-city', label: '都市別の特徴・選び方' },
  { id: 'work-rule', label: '就労ルール・アルバイト' },
  { id: 'nature', label: '自然体験・アクティビティ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const VISA_TYPES = [
  {
    type: '観光ビザ（NZeTA）',
    duration: '3ヶ月以内',
    work: '不可',
    detail: '日本人はNZeTA（電子渡航認可）NZD 17で3ヶ月まで滞在可、語学学校通学OK',
  },
  {
    type: 'Fee Paying Student Visa（長期）',
    duration: '3ヶ月超〜',
    work: '週20時間まで就労可（12ヶ月超で）',
    detail: '学校入学許可＋資金証明（月NZD 1,250）必要、申請料NZD 375',
  },
  {
    type: 'Working Holiday Visa',
    duration: '12ヶ月',
    work: '週40時間就労可',
    detail: '6ヶ月までの語学学校通学可、ビザ取得しやすい',
  },
];

const TOP_SCHOOLS = [
  {
    name: 'Languages International（オークランド）',
    feature: '老舗・伝統校、レベル分け細かい、IELTS対策強み',
    cost: '4週間NZD 1,800-2,400',
  },
  {
    name: 'Kaplan International（オークランド・クライストチャーチ）',
    feature: '世界的チェーン、多国籍、施設充実',
    cost: '4週間NZD 1,700-2,300',
  },
  {
    name: 'ABC College of English（ワイカト・オークランド）',
    feature: '少人数アットホーム、家庭的雰囲気',
    cost: '4週間NZD 1,500-2,000',
  },
  {
    name: 'Tasman International Academies',
    feature: '中規模、ビジネス英語・IELTS強み',
    cost: '4週間NZD 1,600-2,100',
  },
  {
    name: 'Edenz Colleges（オークランド）',
    feature: 'Cambridge英検・IELTS試験会場併設',
    cost: '4週間NZD 1,600-2,200',
  },
];

const COST_SIMULATION = [
  { period: '1ヶ月', tuition: 'NZD 1,500-2,400', living: 'NZD 1,500-2,200', total: '約30〜45万円' },
  { period: '3ヶ月', tuition: 'NZD 4,000-6,500', living: 'NZD 4,500-6,600', total: '約85〜130万円' },
  { period: '6ヶ月', tuition: 'NZD 7,500-12,000', living: 'NZD 9,000-13,200', total: '約160〜250万円' },
  { period: '1年', tuition: 'NZD 14,000-22,000', living: 'NZD 18,000-26,400', total: '約320〜480万円' },
];

const BY_CITY = [
  {
    city: 'オークランド',
    feature: 'NZ最大都市、ビーチ近、多国籍、家賃やや高',
    forWho: '都会派・多文化体験重視・観光地アクセス',
  },
  {
    city: 'ウェリントン',
    feature: '首都、文化・カフェ・若者多、コンパクト',
    forWho: 'アート・音楽・カフェ好き、知的雰囲気',
  },
  {
    city: 'クライストチャーチ',
    feature: '南島最大都市、伝統的、家賃安い、自然近',
    forWho: 'コスパ重視・落ち着いた生活・自然好き',
  },
  {
    city: 'クイーンズタウン',
    feature: '世界的観光地、アクティビティ天国、家賃高',
    forWho: 'スノーボード・トレッキング好き、観光業就労希望',
  },
  {
    city: 'ハミルトン',
    feature: '中規模都市、コスパ良、日本人少',
    forWho: '英語に没頭したい、コスパ重視',
  },
];

const WORK_RULES = [
  '観光ビザ（NZeTA）：就労不可、純粋な語学学習のみ',
  '長期Student Visa（12ヶ月超）：週20時間まで就労可、休暇中フルタイム',
  'Working Holiday Visa：週40時間就労可（観光業強い）',
  '最低時給：NZD 23.15/時間（2024年4月〜）、世界トップクラス',
  'IRD番号取得必須（オンライン申請、無料）',
  '日本人向け仕事：オークランドの日本食レストラン、観光ガイド多',
];

const NATURE_ACTIVITIES = [
  'バンジージャンプ発祥地クイーンズタウン',
  'ミルフォードサウンド・トレッキング（世界遺産）',
  'スカイダイビング・パラグライディング',
  'ロード・オブ・ザ・リング ロケ地巡り',
  'スキー・スノーボード（南島）',
  'カイコウラでホエールウォッチング',
  'ロトルア温泉・マオリ文化体験',
  '北島・南島のロードトリップ',
];

const FAQS = [
  {
    question: 'NZ語学留学の総額は？',
    answer:
      '1ヶ月30〜45万円、3ヶ月85〜130万円、半年160〜250万円、1年320〜480万円が目安。豪より約20%安く、英米より約半額。地方都市（ハミルトン等）は更に安く済みます。',
  },
  {
    question: '3ヶ月以内ならビザ不要？',
    answer:
      '正確にはNZeTA（電子渡航認可）NZD 17が必要、ただし数分でオンライン取得可。3ヶ月以内なら観光ビザ扱いで語学学校通学OK（就労不可）。3ヶ月超ならFee Paying Student Visa or Working Holiday Visaが必要。',
  },
  {
    question: 'NZ英語は本場の英語？訛りは強い？',
    answer:
      '基本イギリス英語の流れを引き継ぐが、独特の母音（「i」が「u」のように）。学校講師は標準英語、生徒同士はインターナショナル英語。慣れれば豪英語よりは聞きやすい傾向。卒業後はIELTS・TOEIC等でも十分通用するレベルに。',
  },
  {
    question: 'NZでアルバイトしたい',
    answer:
      'Working Holiday Visaが最強。週40時間就労可、最低時給NZD 23.15（約2,400円）と高く稼ぎやすい。学生ビザは長期（12ヶ月超）でないと就労不可。オークランドの日本食レストラン、観光地のホテル等が定番。',
  },
  {
    question: 'オーストラリアと比べてどう？',
    answer:
      'NZの方が物価安・治安良・自然豊か、ただし都市の規模・仕事数は豪が上。「英語＋自然体験＋ゆったり生活」ならNZ、「英語＋稼ぎ＋都会生活」なら豪。NZ→豪のステップアップルートも人気。',
  },
];

export default async function NzLanguageSchoolPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const nzExperiences = all.filter((e) => e.country?.id === 'new-zealand');
  const mentions = countMentions(all, /(ニュージーランド|NZ|オークランド|Auckland|Wellington)/i);
  const sample = nzExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(ニュージーランド|NZ|オークランド|Auckland|語学)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ニュージーランド語学留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ニュージーランド語学留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ニュージーランド語学留学完全ガイド｜Visa・主要校・費用・都市別特徴
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="NZ語学留学を検討する方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              世界遺産級の自然＋治安世界トップクラス＋豪より安い物価＋親日的なニュージーランド。「英語＋大自然」を満喫したい人に最適な留学先です。
              <br />
              この記事ではビザ取得、主要語学学校5校、費用、都市別特徴、就労ルール、自然体験まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '1年総額320〜480万円、豪より20%安、英米より半額',
              '3ヶ月以内ならNZeTA（NZD 17）のみで通学OK',
              '世界遺産級の自然＋治安世界トップクラス',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜNZ */}
          <section id="why-nz" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜNZ語学留学なのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              NZは「英語＋大自然＋安全＋親日」の四拍子揃った隠れた留学先。豪・加と比べて物価安、治安は世界トップクラス、ロード・オブ・ザ・リングの世界観そのままの自然体験。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・豪・加より物価約20%安</li>
              <li>・治安世界ランキング上位（人口500万人の安全国家）</li>
              <li>・親日的、日本人留学生比較的少なめ</li>
              <li>・世界遺産級の自然（フィヨルド・氷河・温泉）</li>
              <li>・アウトドアアクティビティ天国</li>
              <li>・3ヶ月以内ならNZeTAのみで気軽に短期留学可</li>
            </ul>
          </section>

          {/* ビザ */}
          <section id="visa-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Student Visa の種類</h2>
            <div className="space-y-3">
              {VISA_TYPES.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{v.type}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-700 mb-2">
                    <p><strong>期間:</strong> {v.duration}</p>
                    <p><strong>就労:</strong> {v.work}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{v.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 主要校 */}
          <section id="top-schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要語学学校5校</h2>
            <div className="space-y-3">
              {TOP_SCHOOLS.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{s.name}</p>
                    <p className="text-sm font-bold text-amber-700">{s.cost}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他の英語圏留学先と比較"
            description="豪・加・マルタ等のコスパ留学先も合わせて検討を。"
            primaryHref="/malta-study"
            primaryLabel="マルタ留学完全ガイド"
            secondaryHref="/cebu-study-real-cost"
            secondaryLabel="セブ留学リアルコスト"
          />

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用シミュレーション</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">期間</th>
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

          {/* 都市 */}
          <section id="by-city" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">都市別の特徴・選び方</h2>
            <div className="space-y-3">
              {BY_CITY.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{c.city}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2"><strong>特徴:</strong> {c.feature}</p>
                  <p className="text-xs text-gray-500"><strong>こんな人向き:</strong> {c.forWho}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 就労 */}
          <section id="work-rule" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">就労ルール・アルバイト</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {WORK_RULES.map((w, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">💼</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 自然 */}
          <section id="nature" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">自然体験・アクティビティ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {NATURE_ACTIVITIES.map((a, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🏔️</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                NZ渡航者の体験談 <strong>n={nzExperiences.length}件</strong>。
                NZ語学留学関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ ビザ・費用は2026年5月時点の情報です。最新情報は NZ Immigration（immigration.govt.nz）公式情報、各学校公式サイトでご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/malta-study" className="text-primary-600 hover:underline">→ マルタ留学完全ガイド</Link></li>
              <li><Link href="/vancouver-language-school" className="text-primary-600 hover:underline">→ バンクーバー語学学校</Link></li>
              <li><Link href="/cebu-study-real-cost" className="text-primary-600 hover:underline">→ セブ留学リアルコスト</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
              <li><Link href="/au-vs-canada" className="text-primary-600 hover:underline">→ 豪vsカナダ比較</Link></li>
              <li><Link href="/countries/new-zealand" className="text-primary-600 hover:underline">→ NZ国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
