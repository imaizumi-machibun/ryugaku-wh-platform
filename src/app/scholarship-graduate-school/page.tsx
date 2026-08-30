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

const PATH = '/scholarship-graduate-school';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '大学院留学の奨学金 完全ガイド｜給付型・貸与型の選び方と併願戦略【2026年版】',
  description:
    '大学院留学に使える奨学金を給付型・貸与型に分けて完全網羅。Fulbright、Chevening、DAAD、トビタテ、JASSO、伊藤財団等の応募要件・金額・採用率・併願戦略を一覧化。',
  path: PATH,
  keywords: [
    '大学院留学 奨学金',
    '海外大学院 奨学金',
    '修士 奨学金',
    'Fulbright 日本',
    'Chevening',
    'トビタテ 大学院',
    '伊藤国際 奨学金',
  ],
});

const TOC = [
  { id: 'overview', label: '大学院留学奨学金の全体像' },
  { id: 'grant-type', label: '給付型奨学金（返済不要）' },
  { id: 'loan-type', label: '貸与型奨学金（要返済）' },
  { id: 'school-fellowship', label: '学校独自のFellowship' },
  { id: 'company-scholarship', label: '企業派遣・研究機関助成' },
  { id: 'application-strategy', label: '併願戦略と応募スケジュール' },
  { id: 'reality', label: '採用される人の特徴' },
  { id: 'faq', label: 'よくある質問' },
];

const GRANT_SCHOLARSHIPS = [
  { name: 'Fulbright（フルブライト）', target: '米国大学院', amount: '学費全額+生活費', deadline: '5-6月', selectionRate: '約10%', note: '研究計画書・面接重視。年間日本枠約20名' },
  { name: 'Chevening（チーブニング）', target: '英国修士1年', amount: '学費全額+生活費約£18,000', deadline: '11月', selectionRate: '約5%', note: '帰国義務2年、職務経験必須' },
  { name: 'DAAD', target: 'ドイツ', amount: '月€934+学費等', deadline: '研究分野別', selectionRate: '15-20%', note: 'ドイツ語要件あり' },
  { name: 'トビタテ留学JAPAN', target: '全世界', amount: '月12-20万円+渡航費', deadline: '年2回', selectionRate: '約30%', note: '学部・修士・博士、企業派遣型あり' },
  { name: '伊藤国際教育交流財団', target: '欧米大学院', amount: '年200-300万円', deadline: '11-12月', selectionRate: '約10%', note: '修士・博士・MBA対象' },
  { name: '船井情報科学振興財団', target: '欧米', amount: '年最大450万円', deadline: '8月', selectionRate: '約15%', note: '理系中心、人文系も一部' },
  { name: '経団連グローバル人材育成スカラシップ', target: '欧米大学院', amount: '年250万円×2年', deadline: '10月', selectionRate: '約20%', note: '私費留学生対象' },
  { name: 'ロータリー財団（グローバル奨学金）', target: '海外大学院', amount: '$30,000-$60,000', deadline: '地区により異なる', selectionRate: '高い', note: '地区ロータリーの推薦が必要' },
  { name: '中島記念国際交流財団', target: '欧米大学院', amount: '年200-300万円', deadline: '2月', selectionRate: '5-10%', note: 'バイオ・電子工学・経営学' },
];

const LOAN_SCHOLARSHIPS = [
  { name: 'JASSO第二種（貸与・有利子）', target: '全世界', amount: '月12-20万円', rate: '上限3%固定', note: '海外大学院対応、最も使われる選択肢' },
  { name: 'JASSO海外大学院学位取得型', target: '欧米大学院', amount: '年250-300万円', rate: '無利子', note: '修士・博士・専門職コース対象' },
  { name: '国の教育ローン（日本政策金融公庫）', target: '全世界', amount: '最大450万円', rate: '固定2.4%程度', note: '海外留学は条件次第で増額可' },
];

const FAQS = [
  {
    question: '大学院留学奨学金の応募はいつから始める？',
    answer: '出願の1年〜1年半前から準備を始めるのが標準です。Fulbrightは出願年の5-6月、Cheveningは11月締切。複数併願が基本なので、応募スケジュールを年間カレンダーで管理してください。',
  },
  {
    question: '英語スコアはどれくらい必要？',
    answer: '給付型の多くはTOEFL 100以上 or IELTS 7.0以上を求めます。Fulbright・Cheveningは英語要件に加えて、研究計画書・推薦状・面接の質が選考の中心です。',
  },
  {
    question: '社会人でも応募できる奨学金は？',
    answer: 'Chevening（職務経験2-3年必須）、トビタテ留学JAPAN（社会人コースあり）、伊藤国際教育交流財団、ロータリー財団、企業派遣（自社推薦）など。社会人専用枠を持つ財団も増加中です。',
  },
  {
    question: '給付型と貸与型はどう組み合わせるのが理想？',
    answer: '給付型を最優先で複数併願し、不足分をJASSO第二種貸与・教育ローンで補うのが標準パターン。Fulbright・Cheveningなど大型給付が取れれば、自己資金とローンを最小化できます。',
  },
  {
    question: '採用率を上げるコツは？',
    answer: '①出願校・専攻・キャリア目標を明確化、②研究計画書を1ヶ月以上かけて練る、③推薦状を「協力的＋実績ある推薦者」から取得、④面接は模擬練習を5回以上、⑤複数併願で機会を最大化。',
  },
];

export default function ScholarshipGraduateSchoolPage() {
  return (
    <>
      <JsonLd data={generateBreadcrumbJsonLd([{ name: 'ホーム', url: '/' }, { name: '大学院留学の奨学金', url: PATH }])} />
      <JsonLd data={generateFAQJsonLd(FAQS)} />
      <JsonLd
        data={generateArticleJsonLd({
          id: 'scholarship-graduate-school',
          createdAt: '2026-06-04',
          updatedAt: '2026-06-04',
          publishedAt: '2026-06-04',
          revisedAt: '2026-06-04',
          title: '大学院留学の奨学金 完全ガイド',
          description: '大学院留学に使える奨学金を給付型・貸与型に分けて完全網羅',
          body: '',
        })}
      />

      <div className="container-custom py-8 max-w-4xl">
        <Breadcrumb items={[{ label: '大学院留学の奨学金' }]} />

        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
            大学院留学の奨学金 完全ガイド｜給付型・貸与型の選び方と併願戦略【2026年版】
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            海外大学院留学に使える奨学金を、給付型（返済不要）と貸与型（要返済）に分けて完全網羅。Fulbright・Chevening・DAAD・トビタテ・伊藤国際教育交流財団等の応募要件・採用率・金額を一覧化し、併願戦略まで解説します。
          </p>
        </header>

        <ArticleMetaBadge readingMinutes={11} updatedAt="2026-06-04" targetAudience="大学院留学志望者・MBA志望者" />
        <ExchangeRateNotice className="mb-6" />

        <KeyTakeaway
          items={[
            '給付型奨学金は応募〜採用まで1年〜1年半かかる',
            '主要9つの給付型奨学金の併願戦略を整理',
            'JASSO第二種貸与＋教育ローンが資金計画の中核',
            '企業派遣・研究機関助成も視野に入れる',
            '採用率を上げる5つのコツ',
          ]}
          title="この記事でわかること"
        />

        <InPageTOC headings={TOC} defaultOpen />

        <section id="overview" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">大学院留学奨学金の全体像</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            海外大学院の総費用は欧州1年制で500〜2,500万円、米国2年制で1,500〜5,000万円。自己資金だけで賄うのは困難で、給付型奨学金（返済不要）と貸与型奨学金（要返済）を組み合わせるのが標準です。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            給付型は応募から採用まで1年〜1年半かかり、出願校決定の前から準備が必要。複数併願が基本で、Fulbright（米国）・Chevening（英国）・DAAD（独）など主要なものを併願しつつ、財団系・企業派遣も検討します。
          </p>
        </section>

        <section id="grant-type" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">給付型奨学金（返済不要）— 主要9つ</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left">名称</th>
                  <th className="border border-gray-200 px-2 py-2">対象</th>
                  <th className="border border-gray-200 px-2 py-2">金額</th>
                  <th className="border border-gray-200 px-2 py-2">締切</th>
                  <th className="border border-gray-200 px-2 py-2">採用率</th>
                  <th className="border border-gray-200 px-2 py-2 text-left">備考</th>
                </tr>
              </thead>
              <tbody>
                {GRANT_SCHOLARSHIPS.map((s) => (
                  <tr key={s.name}>
                    <td className="border border-gray-200 px-2 py-2 font-semibold">{s.name}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{s.target}</td>
                    <td className="border border-gray-200 px-2 py-2 text-xs">{s.amount}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{s.deadline}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{s.selectionRate}</td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-gray-600">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="loan-type" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">貸与型奨学金（要返済）</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left">名称</th>
                  <th className="border border-gray-200 px-2 py-2">対象</th>
                  <th className="border border-gray-200 px-2 py-2">金額</th>
                  <th className="border border-gray-200 px-2 py-2">金利</th>
                  <th className="border border-gray-200 px-2 py-2 text-left">備考</th>
                </tr>
              </thead>
              <tbody>
                {LOAN_SCHOLARSHIPS.map((s) => (
                  <tr key={s.name}>
                    <td className="border border-gray-200 px-2 py-2 font-semibold">{s.name}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{s.target}</td>
                    <td className="border border-gray-200 px-2 py-2 text-xs">{s.amount}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{s.rate}</td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-gray-600">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <MidCTA
          title="奨学金併願プランを無料で個別相談"
          description="希望国・専攻・キャリア目標から、最適な併願組み合わせと応募タイミングを編集部がご提案します。"
          primaryHref="/contact"
          primaryLabel="無料で相談する"
          secondaryHref="/budget/over-5m"
          secondaryLabel="500万円超の留学プランを見る"
        />

        <section id="school-fellowship" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">学校独自のFellowship・Scholarship</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            米英の大学院は、合格者にmerit-based scholarshipを提示することが一般的。学費の30〜100%を給付する場合もあります。出願時に「Need-based」or「Merit-based」のどちらに応募するかを選び、エッセイで強くアピールします。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            合格後に提示された奨学金額が低い場合、他校の高額オファーを引き合いに「交渉」も可能（特に米国大学院）。第一志望校に複数の奨学金オファーを持ち込むことで、Fellowship増額を引き出すケースがあります。
          </p>
        </section>

        <section id="company-scholarship" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">企業派遣・研究機関助成</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            勤務先企業の海外留学派遣制度（社費留学）が利用できれば、給与全額支給＋学費補助で総額負担はほぼゼロ。一方で2〜3年の帰国後勤務義務がついてくるのが一般的です。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            研究機関では、文部科学省「特別研究員（DC/PD）」、JSPS海外特別研究員、理研・産総研の若手研究員枠など、研究職を目指す方向けの助成も存在します。
          </p>
        </section>

        <section id="application-strategy" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">併願戦略と応募スケジュール（出願2年前から）</h2>
          <ul className="space-y-2 text-sm text-gray-800">
            {[
              '出願2年前: 出願校・専攻・キャリア目標の明確化、TOEFL/GRE対策開始',
              '出願1年6ヶ月前: 推薦者3名選定、研究計画書ドラフト作成、奨学金一覧整理',
              '出願1年前: トビタテ・伊藤財団・船井財団に応募開始',
              '出願10ヶ月前: 校内応募締切（JASSO・大学独自）、Fulbright応募',
              '出願8ヶ月前: Chevening応募（11月締切）、DAAD応募',
              '出願6ヶ月前: 大学院本願出願、学校独自Fellowship応募',
              '出願3-4ヶ月前: 合格通知、奨学金結果通知、必要なら追加応募',
              '出願2-1ヶ月前: 教育ローン申請、ビザ申請、渡航準備',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary-600 font-bold shrink-0 mt-0.5">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="reality" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">採用される人の特徴</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            給付型奨学金（採用率5-20%）の選考を通る人には共通点があります。①明確なキャリアビジョン、②研究計画書の論理性、③推薦者の質、④英語スコアの上位ライン、⑤面接でのストーリーテリング能力。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            特に「なぜその国・大学・専攻でなければならないか」「卒業後どう社会に還元するか」の2点を、説得力のあるストーリーで語れることが重要です。模擬面接は最低5回以上行ってください。
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
            <li><Link href="/mba-cost-comparison" className="text-primary-700 hover:underline">MBA留学の費用比較 →</Link></li>
            <li><Link href="/education-loan-overseas" className="text-primary-700 hover:underline">海外留学の教育ローン比較 →</Link></li>
            <li><Link href="/us-private-vs-public-university" className="text-primary-700 hover:underline">米国大学 私立vs州立 →</Link></li>
            <li><Link href="/uk-postgraduate-cost" className="text-primary-700 hover:underline">英国大学院の総費用 →</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
