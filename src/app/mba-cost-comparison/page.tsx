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

const PATH = '/mba-cost-comparison';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'MBA留学の費用 国別徹底比較｜米/英/欧/アジアの総額と奨学金【2026年版】',
  description: 'MBA留学にかかる総費用を米国Top10、欧州1年制、英国、アジア（INSEAD/IMD/LBS/HBS等）で徹底比較。奨学金・教育ローン併用例、ROI、出願戦略まで一次情報ベースで解説。',
  path: PATH,
  keywords: [
    'MBA 留学 費用',
    'MBA 費用 比較',
    'MBA 学費 ランキング',
    '海外MBA 費用',
    '欧州MBA 費用',
    'INSEAD 費用',
    'MBA 奨学金',
  ],
});

const TOC = [
  { id: 'summary', label: 'MBA留学費用の全体像（早見表）' },
  { id: 'us-mba', label: '米国MBA（2年制）の費用' },
  { id: 'eu-mba', label: '欧州MBA（1年制）の費用' },
  { id: 'uk-mba', label: '英国MBAの費用' },
  { id: 'asia-mba', label: 'アジアMBA（シンガポール・香港）' },
  { id: 'scholarship', label: 'MBA向け奨学金・フェローシップ' },
  { id: 'loan', label: 'MBA向け教育ローン' },
  { id: 'roi', label: '卒業後年収とROI試算' },
  { id: 'faq', label: 'よくある質問' },
];

const SCHOOLS = [
  { name: 'Harvard Business School', country: '米国', years: 2, tuition: '約3,500万円', total: '約5,000万円', note: '学費$76k/年×2、生活費含む' },
  { name: 'Stanford GSB', country: '米国', years: 2, tuition: '約3,400万円', total: '約4,800万円', note: 'シリコンバレー圏で生活費高め' },
  { name: 'Wharton', country: '米国', years: 2, tuition: '約3,300万円', total: '約4,700万円', note: 'Penn大学院、フィラデルフィア' },
  { name: 'MIT Sloan', country: '米国', years: 2, tuition: '約3,200万円', total: '約4,600万円', note: 'STEM指定でOPT 3年' },
  { name: 'INSEAD', country: '仏/シンガポール', years: 1, tuition: '約1,400万円', total: '約2,200万円', note: '世界最大級の1年制MBA' },
  { name: 'IMD', country: 'スイス', years: 1, tuition: '約1,500万円', total: '約2,400万円', note: 'ローザンヌ、少人数制' },
  { name: 'IESE / IE', country: 'スペイン', years: '1.5-2', tuition: '約1,400-1,800万円', total: '約2,200-2,800万円', note: 'バルセロナ/マドリード' },
  { name: 'London Business School', country: '英国', years: '1.5-2', tuition: '約1,800万円', total: '約3,000万円', note: 'ロンドン生活費が高い' },
  { name: 'Oxford Saïd / Cambridge Judge', country: '英国', years: 1, tuition: '約1,200万円', total: '約1,800万円', note: '1年制、地方都市' },
  { name: 'NUS / NTU', country: 'シンガポール', years: '1-1.5', tuition: '約900万円', total: '約1,500万円', note: 'アジア最高位、英語' },
  { name: 'HKUST', country: '香港', years: 1, tuition: '約950万円', total: '約1,500万円', note: '英語、アジア進出向き' },
];

const SCHOLARSHIPS = [
  { name: 'Fulbright', region: '米国', type: '給付', amount: '学費全額+生活費', note: '年間日本枠約20名、競争率高' },
  { name: 'Chevening', region: '英国', type: '給付', amount: '学費全額+生活費', note: '1年制プログラム、帰国義務2年' },
  { name: '伊藤国際教育交流財団', region: '欧米', type: '給付', amount: '年200-300万円', note: '修士・博士・MBA対象' },
  { name: '船井情報科学振興財団', region: '欧米', type: '給付', amount: '年最大450万円', note: '理系中心だが経営学も対象' },
  { name: '経団連グローバル人材育成スカラシップ', region: '欧米', type: '給付', amount: '年250万円×2', note: '私費留学生対象' },
  { name: 'JASSO第二種', region: '全世界', type: '貸与', amount: '月12-20万円', note: '有利子、海外大学院対象' },
  { name: '学校独自Fellowship', region: '欧米', type: '給付', amount: '学費30-100%', note: '合格後にmerit-based提示' },
];

const FAQS = [
  {
    question: 'MBA留学に必要な総額はいくら？',
    answer:
      '米国Top10で2年総額3,500〜5,000万円、欧州1年制（INSEAD・IMD・LBS等）で1,500〜2,500万円。アジア系（NUS・HKUST）は900〜1,500万円。自己資金だけで賄うのは難しく、給付奨学金・教育ローン・配偶者収入の組み合わせが一般的です。',
  },
  {
    question: '日本人が獲得しやすい奨学金は？',
    answer:
      '給付型ではトビタテ留学JAPAN（学部・修士対象だがMBAも一部対象）、Fulbright（米国）、Chevening（英国）、伊藤国際教育交流財団、船井情報科学振興財団、経団連グローバル人材育成スカラシップなど。早めの応募と複数併願が必要です。',
  },
  {
    question: 'MBA出願に必要なスコアは？',
    answer:
      'TOEFL 100以上（Top10は105+推奨）、GMAT 700+（Top10は720+目安）、Executive MBAやEMBAなら職務経歴重視でGMAT免除コースも増加中。出願時期はラウンド1（9月）が合格率と奨学金に最も有利です。',
  },
  {
    question: '欧州1年制MBAと米国2年制、どちらが投資効果が高い？',
    answer:
      '欧州1年制は学費・機会費用の両面で米国の半分以下に抑えられ、ROIは早く出ます。米国2年制はネットワークと米国就職機会で長期的なリターンが大きい傾向。キャリア目標と現職給与により選択が分かれます。',
  },
  {
    question: 'MBA留学後の想定年収は？',
    answer:
      '米国Top MBA卒で外資系コンサル・投資銀行就職時、米国勤務で$150-200k（約2,300-3,000万円）、日本帰国時で1,200-1,800万円。事業会社では年収増は限定的でキャリアチェンジが主目的になります。',
  },
];

export default function MBACostComparisonPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'MBA留学の費用比較', url: PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />
      <JsonLd
        data={generateArticleJsonLd({
          id: 'mba-cost-comparison',
          createdAt: '2026-06-04',
          updatedAt: '2026-06-04',
          publishedAt: '2026-06-04',
          revisedAt: '2026-06-04',
          title: 'MBA留学の費用 国別徹底比較',
          description: 'MBA留学の総費用を米国・欧州・英国・アジアで徹底比較',
          body: '',
        })}
      />

      <div className="container-custom py-8 max-w-4xl">
        <Breadcrumb items={[{ label: 'MBA留学の費用比較' }]} />

        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
            MBA留学の費用 国別徹底比較｜米/英/欧/アジアの総額と奨学金【2026年版】
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            MBA留学にかかる総額は、米国Top10で3,500〜5,000万円、欧州1年制で1,500〜2,500万円、アジア系で900〜1,500万円と大きく異なります。本記事では主要スクールの学費・生活費・滞在期間を比較し、奨学金・教育ローン・ROIまで包括的に解説します。
          </p>
        </header>

        <ArticleMetaBadge readingMinutes={12} updatedAt="2026-06-04" targetAudience="社会人・MBA志望者" />
        <ExchangeRateNotice className="mb-6" />

        <KeyTakeaway
          items={[
            '米国Top10のMBA総額は3,500〜5,000万円（学費＋生活費＋機会費用は除く）',
            '欧州1年制MBA（INSEAD/IMD/LBS等）は米国の半分以下に抑えられる',
            'アジア系（NUS/HKUST）は900〜1,500万円とコスト最安',
            '奨学金は給付型（Fulbright/Chevening/伊藤財団等）と貸与型（JASSO）の併用が基本',
            'ROIは外資系コンサル・投資銀行転身なら3〜5年で回収可能',
          ]}
          title="この記事でわかること"
        />

        <InPageTOC headings={TOC} defaultOpen />

        <section id="summary" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">MBA留学費用の全体像（主要スクール早見表）</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left">スクール</th>
                  <th className="border border-gray-200 px-2 py-2">国</th>
                  <th className="border border-gray-200 px-2 py-2">期間</th>
                  <th className="border border-gray-200 px-2 py-2 text-right">学費</th>
                  <th className="border border-gray-200 px-2 py-2 text-right">総額目安</th>
                  <th className="border border-gray-200 px-2 py-2 text-left">備考</th>
                </tr>
              </thead>
              <tbody>
                {SCHOOLS.map((s) => (
                  <tr key={s.name} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-2 py-2 font-semibold">{s.name}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center">{s.country}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center">{s.years}年</td>
                    <td className="border border-gray-200 px-2 py-2 text-right text-gray-700">{s.tuition}</td>
                    <td className="border border-gray-200 px-2 py-2 text-right font-bold text-primary-700">
                      {s.total}
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-gray-600">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">※為替変動±5%で総額±100〜250万円動きます</p>
        </section>

        <section id="us-mba" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">米国MBA（2年制）の費用構造</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            米国Top10のMBAは2年制が標準で、学費だけで$150,000〜$160,000（約2,300〜2,500万円）。生活費はボストン・NY・カリフォルニアなど大都市圏で年$25,000〜$35,000（約400〜550万円）かかり、2年総額で3,500〜5,000万円になります。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            米国MBAの強みはSTEM指定プログラム（MIT・Stanford等）のOPT 3年延長による米国就職機会、卒業後の年収幅（$130k〜$200k+）、世界最大の卒業生ネットワーク。一方で機会費用（2年間の現職給与を失う）を含めると実質コストは2倍近くに膨らみます。
          </p>
        </section>

        <section id="eu-mba" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">欧州MBA（1年制）の費用構造</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            INSEAD（フランス・シンガポール）、IMD（スイス）、IESE/IE（スペイン）、SDA Bocconi（イタリア）など、欧州MBAは1年制が主流で、総額1,500〜2,500万円に収まります。1年で完結する分、機会費用も米国の半分。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            INSEADは世界最大級の1年制MBAで、フランス・シンガポール・アブダビの3拠点を移動できる柔軟性が魅力。IMDはローザンヌの少人数制で経営者育成に特化。米国Top10と比べてランキングは見劣りせず、コストパフォーマンスは非常に高いと評価されています。
          </p>
        </section>

        <section id="uk-mba" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">英国MBAの費用構造</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            London Business School（LBS）は1.5〜2年制で総額3,000万円程度、Oxford Saïd・Cambridge Judgeは1年制で1,800〜2,200万円。ロンドン勤務狙いなら立地的に有利ですが、ロンドンの生活費（月£1,800-2,500）が大きな負担になります。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            英国MBAは卒業後にGraduate Routeで2年就労できるため、現地就職を視野に入れたキャリアチェンジに適しています。Chevening奨学金（給付型）の対象でもあり、合格＋奨学金獲得で総額を大幅に圧縮可能です。
          </p>
        </section>

        <section id="asia-mba" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">アジアMBA（シンガポール・香港）の費用</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            NUS Business School（シンガポール）、NTU、HKUST（香港）、CEIBS（中国）など、アジア系MBAは英語授業＋アジア市場へのキャリア接続性で人気が高まっています。総額900〜1,500万円と欧米の半分以下で、日本からの渡航コストも低い。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            シンガポール・香港の卒業後就職市場は欧米Top校と比べると規模が小さいですが、アジア地域でのキャリア構築を目指す方にとっては費用対効果が最高です。EMBA（Executive MBA）プログラムなら週末通学型もあり、退職せずに取得できます。
          </p>
        </section>

        <MidCTA
          title="MBA留学プランを無料で個別相談"
          description="希望校・職歴・予算に応じて、出願戦略と資金計画を編集部が無料で作成します。"
          primaryHref="/contact"
          primaryLabel="無料で相談する"
          secondaryHref="/budget/over-5m"
          secondaryLabel="500万円超の留学プランを見る"
        />

        <section id="scholarship" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">MBA向け奨学金・フェローシップ一覧</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left">名称</th>
                  <th className="border border-gray-200 px-2 py-2">対象地域</th>
                  <th className="border border-gray-200 px-2 py-2">種別</th>
                  <th className="border border-gray-200 px-2 py-2">金額</th>
                  <th className="border border-gray-200 px-2 py-2 text-left">備考</th>
                </tr>
              </thead>
              <tbody>
                {SCHOLARSHIPS.map((s) => (
                  <tr key={s.name}>
                    <td className="border border-gray-200 px-2 py-2 font-semibold">{s.name}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center">{s.region}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center">{s.type}</td>
                    <td className="border border-gray-200 px-2 py-2 text-gray-700">{s.amount}</td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-gray-600">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="loan" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">MBA向け教育ローン</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            日本国内で利用できる主要な教育ローンは、日本政策金融公庫「教育一般貸付」（最大450万円・固定金利1〜2%台）、銀行系教育ローン（オリコ・三井住友信託・JACCS等、500〜1,000万円超）、JASSO第二種奨学金（貸与・有利子）の3つ。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            高額のMBA費用には複数組み合わせる必要があり、現職給与での返済シミュレーションを必ず作成してください。返済10年で月10〜15万円返済が標準で、卒業3年後の想定年収から逆算します。詳細は<Link href="/education-loan-overseas" className="text-primary-700 hover:underline">海外留学の教育ローン比較</Link>をご覧ください。
          </p>
        </section>

        <section id="roi" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">卒業後年収とROI試算</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            米国Top MBA卒の想定年収は、米国勤務で外資系コンサル（MBB）$150-200k（約2,300-3,000万円）、投資銀行$180-220k、テック企業のPM職$170-200k。日本帰国時はコンサル1,400-1,800万円、外資金融1,500-2,000万円が中央値です。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            投資回収（ROI）は、現職年収500万円→MBA後1,500万円の場合、差額1,000万円×3〜5年で総額3,000-5,000万円。米国Top10の総額と概ね均衡し、その後の高給期間が純利益となります。事業会社系のキャリアチェンジは年収増よりキャリアパス拡大が主目的です。
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
            <li>
              <Link href="/budget/over-5m" className="text-primary-700 hover:underline">
                予算500万円以上の留学プラン →
              </Link>
            </li>
            <li>
              <Link href="/scholarship-graduate-school" className="text-primary-700 hover:underline">
                大学院留学の奨学金 完全ガイド →
              </Link>
            </li>
            <li>
              <Link href="/education-loan-overseas" className="text-primary-700 hover:underline">
                海外留学の教育ローン比較 →
              </Link>
            </li>
            <li>
              <Link href="/us-private-vs-public-university" className="text-primary-700 hover:underline">
                米国大学 私立vs州立 比較 →
              </Link>
            </li>
            <li>
              <Link href="/uk-postgraduate-cost" className="text-primary-700 hover:underline">
                英国大学院（修士・博士）の総費用 →
              </Link>
            </li>
            <li>
              <Link href="/countries/united-states" className="text-primary-700 hover:underline">
                米国の留学完全ガイド →
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
