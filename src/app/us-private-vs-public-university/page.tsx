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

const PATH = '/us-private-vs-public-university';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '米国大学 私立vs州立 学費・難易度・キャリア徹底比較【2026年版】',
  description:
    '米国大学正規留学で迷う私立vs州立を、学費（出身州外/留学生）・入学難易度・カリキュラム・卒業後キャリアで徹底比較。コミカレ→4年制編入のコスト圧縮ルートも解説。',
  path: PATH,
  keywords: [
    'アメリカ大学 私立 州立',
    'アメリカ正規留学 費用',
    '米国大学 学費',
    'アメリカ 大学 ランキング',
    'コミカレ 編入',
    'アイビーリーグ 学費',
  ],
});

const TOC = [
  { id: 'overview', label: '私立vs州立の基本構造' },
  { id: 'tuition', label: '学費比較（4年総額）' },
  { id: 'difficulty', label: '入学難易度・スコア要件' },
  { id: 'curriculum', label: 'カリキュラム・教育の質' },
  { id: 'community-college', label: 'コミカレ→4年制編入ルート' },
  { id: 'scholarship-difficulty', label: '奨学金獲得しやすさ' },
  { id: 'career', label: '卒業後キャリアと就職市場' },
  { id: 'recommendation', label: '結局どちらを選ぶべきか' },
  { id: 'faq', label: 'よくある質問' },
];

const UNIVERSITIES = [
  { name: 'Harvard / Stanford / Yale / Princeton', type: 'アイビーリーグ・トップ私立', tuition: '$80k-90k', living: '$25k-30k', total: '$420k-480k', acceptance: '3-7%' },
  { name: 'MIT / Caltech', type: 'トップ理系私立', tuition: '$85k', living: '$25k', total: '$440k', acceptance: '4-7%' },
  { name: 'NYU / USC / Duke', type: '上位私立', tuition: '$65k-75k', living: '$25-30k', total: '$360k-420k', acceptance: '8-20%' },
  { name: 'UC Berkeley / UCLA (out-of-state)', type: 'トップ州立', tuition: '$48k', living: '$22k', total: '$280k', acceptance: '10-15%' },
  { name: 'Michigan / UVA / Wisconsin (out-of-state)', type: '上位州立', tuition: '$50k-60k', living: '$18-22k', total: '$272-328k', acceptance: '15-30%' },
  { name: 'カリフォルニア州立大学（CSU）系', type: '中堅州立', tuition: '$20k-30k', living: '$18k', total: '$152-192k', acceptance: '30-60%' },
  { name: 'コミカレ（2年）+ 上位州立編入', type: 'コミカレルート', tuition: '$8k×2 + $50k×2', living: '$18k×4', total: '$188k', acceptance: '60-80%（コミカレ）' },
];

const FAQS = [
  {
    question: '米国大学正規4年の総額はいくら？',
    answer:
      '私立トップ校（アイビーリーグ等）で4年総額$420,000-$480,000（約6,500-7,500万円）、上位州立out-of-stateで$280,000-$330,000（約4,400-5,200万円）、コミカレ→4年制編入ルートで$188,000程度（約2,900万円）。',
  },
  {
    question: '日本の高校生は私立と州立どちらが入りやすい？',
    answer:
      '州立の方が入学難易度は低い傾向。UC系・Michigan・UVAなどの上位州立はSAT 1300-1450、GPA 3.7+程度。トップ私立はSAT 1500+、GPA 3.9+、課外活動・推薦状の質が決定的に重要です。',
  },
  {
    question: '奨学金は私立と州立どちらが取りやすい？',
    answer:
      '私立大学は学費が高い分、merit-based scholarship（成績優秀者向け）の予算規模が大きく、最大で学費全額免除も提示されます。州立はout-of-state留学生への奨学金は限定的で、コスト面の優位性が中心。',
  },
  {
    question: 'STEM学位のOPT 3年延長は私立・州立どちらでも適用される？',
    answer:
      '適用されます。STEM指定プログラム（科学・技術・工学・数学）を卒業すれば、私立・州立を問わず12ヶ月のOPT+24ヶ月の延長で最大3年の米国就労が可能。テック企業就職を目指すなら最重要要件です。',
  },
  {
    question: 'コミカレ→4年制編入は本当に費用が安い？',
    answer:
      'はい、最大で50%程度の費用圧縮が可能です。コミカレ2年で基礎科目を取得し、UC Berkeley・UCLA等の上位州立に編入すれば、4年制のフルコース費用の60-70%で同じ学位が取れます。ただし編入時のGPA 3.5+が必要。',
  },
];

export default function USPrivateVsPublicUniversityPage() {
  return (
    <>
      <JsonLd data={generateBreadcrumbJsonLd([{ name: 'ホーム', url: '/' }, { name: '米国大学 私立vs州立', url: PATH }])} />
      <JsonLd data={generateFAQJsonLd(FAQS)} />
      <JsonLd
        data={generateArticleJsonLd({
          id: 'us-private-vs-public-university',
          createdAt: '2026-06-04',
          updatedAt: '2026-06-04',
          publishedAt: '2026-06-04',
          revisedAt: '2026-06-04',
          title: '米国大学 私立vs州立 比較',
          description: '米国大学正規留学の私立vs州立を徹底比較',
          body: '',
        })}
      />

      <div className="container-custom py-8 max-w-4xl">
        <Breadcrumb items={[{ label: '米国大学 私立vs州立' }]} />

        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
            米国大学 私立vs州立 学費・難易度・キャリア徹底比較【2026年版】
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            米国大学正規留学で迷う「私立か州立か」を、学費（out-of-state留学生）・入学難易度・カリキュラム・卒業後キャリアで徹底比較。コミカレ→4年制編入ルートで費用を圧縮する方法も解説します。
          </p>
        </header>

        <ArticleMetaBadge readingMinutes={10} updatedAt="2026-06-04" targetAudience="米国正規留学志望者・保護者" />
        <ExchangeRateNotice className="mb-6" />

        <KeyTakeaway
          items={[
            '私立トップ校4年総額は$420k-480k（約6,500-7,500万円）',
            '上位州立out-of-stateは$280k-330k（約4,400-5,200万円）',
            'コミカレ→4年制編入で50%費用圧縮可能',
            '奨学金は私立の方が高額提示の可能性が高い',
            'STEM学位なら卒業後OPT 3年で米国就労可能',
          ]}
          title="この記事でわかること"
        />

        <InPageTOC headings={TOC} defaultOpen />

        <section id="overview" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">私立vs州立の基本構造</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            米国の大学は大きく「私立大学（Private University）」と「州立大学（Public State University）」に分かれます。私立はハーバード・スタンフォードなどのアイビーリーグ系を含み、運営は寄付金・学費中心。州立はカリフォルニア大学（UC）系・ミシガン大学などで、州民税で運営されます。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            日本人留学生にとっての大きな違いは「学費の差」と「奨学金の獲得しやすさ」。州立は州民向け学費（in-state）と州外・留学生向け学費（out-of-state）に分かれており、留学生は通常out-of-state料金（州民の2-3倍）を支払います。
          </p>
        </section>

        <section id="tuition" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">学費比較（4年総額）</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left">大学</th>
                  <th className="border border-gray-200 px-2 py-2">分類</th>
                  <th className="border border-gray-200 px-2 py-2">年間学費</th>
                  <th className="border border-gray-200 px-2 py-2">年間生活費</th>
                  <th className="border border-gray-200 px-2 py-2">4年総額</th>
                  <th className="border border-gray-200 px-2 py-2">合格率</th>
                </tr>
              </thead>
              <tbody>
                {UNIVERSITIES.map((u) => (
                  <tr key={u.name}>
                    <td className="border border-gray-200 px-2 py-2 font-semibold text-xs">{u.name}</td>
                    <td className="border border-gray-200 px-2 py-2 text-xs">{u.type}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{u.tuition}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{u.living}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs font-bold text-primary-700">{u.total}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{u.acceptance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">※USD換算（1USD=155円想定）、出身州外/留学生料金。為替変動±5%で総額±300-400万円変動。</p>
        </section>

        <section id="difficulty" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">入学難易度・スコア要件</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            トップ私立（アイビーリーグ等）はSAT 1500+、TOEFL 110+、GPA 3.9+が一般的ライン。課外活動の質、エッセイ、推薦状3通、面接など総合評価が決定要因です。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            上位州立（UC Berkeley/UCLA/Michigan等）はSAT 1350-1500、TOEFL 100+、GPA 3.7+程度。州立全般は学業成績重視で、私立ほどの課外活動の質を求めない傾向があります。
          </p>
        </section>

        <section id="curriculum" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">カリキュラム・教育の質</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            私立大学は少人数制クラス（教授1人あたり学生7-15人）が多く、リサーチ機会も豊富。アイビーリーグは大学院との連動性が高く、学部生でもトップ研究室に参加可能。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            州立大学（特に大規模校）は学生数が多く、低学年は大教室講義（200-500人）が中心。一方で施設・図書館・スポーツ予算は私立より充実しているケースもあり、コミュニティの活気は強い。
          </p>
        </section>

        <section id="community-college" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">コミカレ→4年制編入で費用を50%圧縮</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            米国独自の制度として、コミュニティカレッジ（2年制）で基礎科目を取得後、4年制大学の3年次に編入するルートがあります。コミカレ年間学費$8,000程度＋4年制2年で、4年制フルコースより総額を30-50%圧縮可能。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            カリフォルニアではTransfer Admission Guarantee（TAG）制度があり、コミカレでGPA 3.5+を維持すればUC系（UCLA/UCSD等）への編入が保証されます。ただしUCBerkeley/UCLAは編入も厳しめ（GPA 3.9+推奨）。
          </p>
        </section>

        <MidCTA
          title="米国大学正規留学の出願戦略を無料相談"
          description="高校GPA、英語スコア、希望分野から、現実的な出願校リストとスケジュールを編集部が個別に作成します。"
          primaryHref="/contact"
          primaryLabel="無料で相談する"
          secondaryHref="/budget/over-5m"
          secondaryLabel="500万円超の留学プランを見る"
        />

        <section id="scholarship-difficulty" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">奨学金獲得しやすさ</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            私立大学は学費が高い分、merit-based scholarship（成績優秀者向け）の予算規模が大きく、合格者の20-40%が何らかの学校奨学金を受給。トップ校でも需給ベースで100%カバーされる場合があります。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            州立大学は州民税で運営されているため、留学生向け奨学金は限定的。コスト自体が安いため、奨学金より「絶対費用の低さ」が魅力です。
          </p>
        </section>

        <section id="career" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">卒業後キャリアと就職市場</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            米国就職を目指す場合、STEM学位のOPT 3年延長は私立・州立を問わず適用されます。アイビーリーグ等のトップ私立は卒業生ネットワーク（OB会）が強く、ウォール街・シリコンバレー就職に有利。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            上位州立（UC Berkeley/Michigan等）もテック企業就職実績は高く、コストパフォーマンスでは私立を上回るとの評価も。日本帰国時の就職は、大学名より「英語力＋専門スキル＋OPT職務経験」が重視されます。
          </p>
        </section>

        <section id="recommendation" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">結局どちらを選ぶべきか</h2>
          <ul className="space-y-2 text-sm text-gray-800">
            {[
              '【私立トップ校】難関突破でき＋merit奨学金獲得できれば最強。挑戦の価値あり',
              '【上位州立out-of-state】コストと教育の質のバランス。多くの日本人留学生に推奨',
              '【コミカレ→4年制編入】費用を最大圧縮したい層、英語力に不安がある層に最適',
              '【中堅州立】学費は最安、テック企業就職など特定分野に強い大学は十分競争力あり',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary-600 font-bold shrink-0 mt-0.5">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
            <li><Link href="/countries/united-states" className="text-primary-700 hover:underline">米国の留学完全ガイド →</Link></li>
            <li><Link href="/scholarship-graduate-school" className="text-primary-700 hover:underline">大学院留学の奨学金 →</Link></li>
            <li><Link href="/education-loan-overseas" className="text-primary-700 hover:underline">海外留学の教育ローン比較 →</Link></li>
            <li><Link href="/mba-cost-comparison" className="text-primary-700 hover:underline">MBA留学の費用比較 →</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
