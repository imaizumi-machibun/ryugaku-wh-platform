import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import MidCTA from '@/components/article/MidCTA';
import SegmentAuthorBox from '@/components/segment/SegmentAuthorBox';
import ExchangeRateNotice from '@/components/segment/ExchangeRateNotice';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateArticleJsonLd } from '@/lib/seo/jsonld';

const PATH = '/uk-postgraduate-cost';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '英国大学院（修士・博士）の総費用｜大学ランク別の最新相場【2026年版】',
  description:
    '英国大学院（修士1年・博士3年）の総費用を、Russell Group・LBS・Oxbridge・地方大学などランク別に解説。学費・ロンドン生活費・IHS・ビザ・必要英語スコアを完全網羅。',
  path: PATH,
  keywords: [
    'イギリス 大学院 費用',
    '英国 修士 費用',
    'UK 大学院 学費',
    'Oxbridge 学費',
    'LSE 学費',
    'IHS 留学',
    'イギリス 大学院 奨学金',
  ],
});

const TOC = [
  { id: 'overview', label: '英国大学院の特徴と費用構造' },
  { id: 'tuition', label: '主要大学院の学費（修士1年）' },
  { id: 'living', label: 'ロンドン vs 地方都市の生活費' },
  { id: 'visa', label: 'Student visa とIHS（医療保険）' },
  { id: 'english', label: '必要英語スコアと条件付き合格' },
  { id: 'scholarship', label: '英国大学院向け奨学金' },
  { id: 'career', label: 'Graduate Route（卒業後2年就労）' },
  { id: 'faq', label: 'よくある質問' },
];

const SCHOOLS = [
  { name: 'Oxford / Cambridge', type: 'Oxbridge', tuition: '£28k-40k', living: '£14k-16k', total: '£42k-56k', totalJpy: '700-940万円', note: '専攻により学費差大' },
  { name: 'LSE / Imperial College / UCL', type: '上位ロンドン', tuition: '£28k-40k', living: '£18k-24k', total: '£46k-64k', totalJpy: '760-1,070万円', note: 'ロンドン生活費が高い' },
  { name: 'Edinburgh / Manchester / Bristol', type: 'Russell Group', tuition: '£22k-32k', living: '£12k-15k', total: '£34k-47k', totalJpy: '570-790万円', note: '地方都市で生活費圧縮' },
  { name: 'King\'s College London', type: '上位ロンドン', tuition: '£25k-35k', living: '£18k-22k', total: '£43k-57k', totalJpy: '720-950万円', note: '専攻幅広い' },
  { name: 'Warwick / Durham / Sheffield', type: 'Russell Group', tuition: '£23k-32k', living: '£11k-14k', total: '£34k-46k', totalJpy: '570-770万円', note: 'コスパ良好' },
  { name: 'LBS（London Business School）', type: 'MBA・ビジネス', tuition: '£100k+', living: '£25k+', total: '£125k+', totalJpy: '2,100万円+', note: '世界トップMBA' },
  { name: '地方公立大学（Sussex/Leeds等）', type: '中堅', tuition: '£18k-25k', living: '£10k-13k', total: '£28k-38k', totalJpy: '470-630万円', note: '修士1年完結で最安' },
];

const FAQS = [
  {
    question: '英国大学院（修士1年）の総費用はいくら？',
    answer:
      '学費£20,000〜35,000（約400-700万円）、ロンドン生活費£18,000-24,000、地方都市£11,000-15,000、IHS£776/年、IELTSやUCAS出願費を加えると、ロンドンで700-850万円、地方都市で500-650万円が中央値です。',
  },
  {
    question: 'ロンドンと地方都市、どちらを選ぶべき？',
    answer:
      'ロンドンは生活費が地方の1.5-2倍ですが、就職機会・国際性は最高。地方都市はマンチェスター・エディンバラ・ブリストルなどが学術評価高く、生活費を年£70-100万円圧縮できます。コスト重視なら地方、キャリア重視ならロンドンです。',
  },
  {
    question: '英国大学院に必要な英語スコアは？',
    answer:
      'IELTS 6.5-7.5（law/journalismは7.5+）が標準。スコア未達の場合、Conditional Offer（条件付き合格）+Pre-sessional English（語学コース）の組み合わせで対応可能。Pre-sessionalは6-12週£3,000-6,000程度です。',
  },
  {
    question: 'Graduate Routeとは何？',
    answer:
      '英国大学院卒業後、無条件で2年間の就労ビザ（PhD取得者は3年）が取得できる制度。スポンサー企業不要で、就職活動・転職が自由。修士1年＋就労2年で英国経験を最大化できる強力な制度です。',
  },
  {
    question: '英国大学院の奨学金で取りやすいものは？',
    answer:
      'Chevening（給付・帰国義務2年）、JASSO第二種（貸与）、伊藤国際教育交流財団、大学独自のmerit-based scholarshipが主要選択肢。Cheveningは職務経験必須で社会人向け、Fulbrightは英国対象外なので注意。',
  },
];

export default function UKPostgraduateCostPage() {
  return (
    <>
      <JsonLd data={generateBreadcrumbJsonLd([{ name: 'ホーム', url: '/' }, { name: '英国大学院の総費用', url: PATH }])} />
      <JsonLd data={generateFAQJsonLd(FAQS)} />
      <JsonLd
        data={generateArticleJsonLd({
          id: 'uk-postgraduate-cost',
          createdAt: '2026-06-04',
          updatedAt: '2026-06-04',
          publishedAt: '2026-06-04',
          revisedAt: '2026-06-04',
          title: '英国大学院（修士・博士）の総費用',
          description: '英国大学院の総費用をランク別に解説',
          body: '',
        })}
      />

      <div className="container-custom py-8 max-w-4xl">
        <Breadcrumb items={[{ label: '英国大学院の総費用' }]} />

        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
            英国大学院（修士・博士）の総費用｜大学ランク別の最新相場【2026年版】
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            英国大学院（修士1年・博士3年）の総費用を、Oxbridge・Russell Group・地方大学などランク別に解説。学費・ロンドン生活費・IHS（医療保険）・Student visa・必要英語スコア・Graduate Routeまで完全網羅します。
          </p>
        </header>

        <ArticleMetaBadge readingMinutes={9} updatedAt="2026-06-04" targetAudience="英国大学院志望者" />
        <ExchangeRateNotice className="mb-6" />

        <KeyTakeaway
          items={[
            '修士1年の総額はロンドンで700-850万円、地方で500-650万円',
            'OxbridgeでもMBA以外は£40k以下に収まる場合が多い',
            'IHS（医療保険）£776/年は必須',
            'Graduate Routeで卒業後2年無条件就労可能',
            'Chevening＋大学独自奨学金で総額大幅圧縮の可能性',
          ]}
          title="この記事でわかること"
        />

        <InPageTOC headings={TOC} defaultOpen />

        <section id="overview" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">英国大学院の特徴と費用構造</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            英国大学院の最大の特徴は「修士1年制」が標準であること。米国の2年制と比べて学費・生活費ともに半分程度に抑えられ、機会費用（現職給与を失う期間）も最小化できます。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            費用は学費（年£18k-100k）、生活費（年£10k-24k）、IHS（医療保険年£776）、Student visa（£490）、IELTSやUCAS出願費（£200-500）が中心。為替が円安に振れているため、円建ての総額は数年前から増加傾向です。
          </p>
        </section>

        <section id="tuition" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">主要大学院の学費（修士1年・概算）</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left">大学</th>
                  <th className="border border-gray-200 px-2 py-2">分類</th>
                  <th className="border border-gray-200 px-2 py-2">学費</th>
                  <th className="border border-gray-200 px-2 py-2">生活費</th>
                  <th className="border border-gray-200 px-2 py-2">総額(£)</th>
                  <th className="border border-gray-200 px-2 py-2">総額(円)</th>
                </tr>
              </thead>
              <tbody>
                {SCHOOLS.map((s) => (
                  <tr key={s.name}>
                    <td className="border border-gray-200 px-2 py-2 font-semibold text-xs">{s.name}</td>
                    <td className="border border-gray-200 px-2 py-2 text-xs">{s.type}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{s.tuition}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{s.living}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{s.total}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs font-bold text-primary-700">{s.totalJpy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">※1£=190円換算（為替により±5%変動）</p>
        </section>

        <section id="living" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">ロンドン vs 地方都市の生活費</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            ロンドンの生活費は月£1,500-2,000（家賃£800-1,200、食費£250-400、交通£140、その他£200-300）。年間£18,000-24,000（約340-460万円）。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            地方都市（マンチェスター・エディンバラ・ブリストル等）は月£900-1,200で、年間£11,000-15,000（約210-285万円）。ロンドンと比べ年100-200万円圧縮可能で、学術評価が高い大学も多いため、コスト重視ならおすすめです。
          </p>
        </section>

        <section id="visa" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Student visa と IHS（医療保険）</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            英国Student visaの申請費は£490（約93,000円）。あわせて医療保険IHS（Immigration Health Surcharge）£776/年が必須で、修士1年なら一括約£780（148,000円）。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            資金証明は「学費残額＋ロンドン圏£1,483×9ヶ月（地方£1,136×9ヶ月）」を最低28日間銀行口座に保持する必要あり。修士1年なら約£25,000（475万円）の残高証明が標準です。
          </p>
        </section>

        <section id="english" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">必要英語スコアと条件付き合格</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            英国大学院はIELTS 6.5-7.5が標準（Oxbridgeは7.5+）、law/journalism/MBAは7.5+が一般的。TOEFLも受け付けますがIELTSが主流。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            スコア未達の場合、Conditional Offer（条件付き合格）+Pre-sessional English（語学コース）の組み合わせで対応可能。Pre-sessionalは6-12週£3,000-6,000で、終了時に学士本科入学の最終要件をクリアする仕組みです。
          </p>
        </section>

        <MidCTA
          title="英国大学院の出願戦略を無料で相談"
          description="希望分野・職務経歴・英語スコアから、現実的な出願校リストと奨学金併願プランを編集部がご提案します。"
          primaryHref="/contact"
          primaryLabel="無料で相談する"
          secondaryHref="/budget/over-5m"
          secondaryLabel="500万円超の留学プランを見る"
        />

        <section id="scholarship" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">英国大学院向け奨学金</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            主要な奨学金は: Chevening（給付・学費全額+生活費£18k、職務経験必須、帰国義務2年）、JASSO第二種（貸与・有利子）、伊藤国際教育交流財団（給付・年200-300万円）、大学独自のmerit-based scholarship。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Chevening採用率は約5%と低いですが、合格すれば総額をほぼゼロに圧縮可能。大学独自のmerit-basedは合格時に自動的に提示されることも多く、応募時には学校別の奨学金情報を確認しておきましょう。
          </p>
        </section>

        <section id="career" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Graduate Route（卒業後2年就労）の活用</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            英国Graduate Routeは、修士・博士卒業者に無条件で2年（PhD取得者は3年）の就労ビザを与える制度。スポンサー企業不要で、就職活動・転職が自由に行えます。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            修士1年＋Graduate Route 2年で、計3年の英国経験を積めるため、ROI（投資回収）が組みやすい構造。卒業後Skilled Worker visa（要スポンサー）に切り替えれば長期滞在も可能です。
          </p>
        </section>

        <section id="faq" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">よくある質問</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer list-none px-4 py-3 bg-white hover:bg-gray-50 flex items-start gap-3">
                  <span className="text-primary-600 font-bold shrink-0 mt-0.5">Q.</span>
                  <span className="font-semibold text-sm text-gray-900 flex-1">{faq.question}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-800 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <SegmentAuthorBox />

        <section className="mt-10">
          <h2 className="text-xl font-bold mb-3">関連リンク</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <li><Link href="/budget/over-5m" className="text-primary-700 hover:underline">予算500万円以上の留学プラン →</Link></li>
            <li><Link href="/budget/under-5m" className="text-primary-700 hover:underline">予算300〜500万円の留学プラン →</Link></li>
            <li><Link href="/countries/united-kingdom" className="text-primary-700 hover:underline">英国の留学完全ガイド →</Link></li>
            <li><Link href="/london-livecost" className="text-primary-700 hover:underline">ロンドン生活費の実態 →</Link></li>
            <li><Link href="/scholarship-graduate-school" className="text-primary-700 hover:underline">大学院留学の奨学金 →</Link></li>
            <li><Link href="/mba-cost-comparison" className="text-primary-700 hover:underline">MBA留学の費用比較 →</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
