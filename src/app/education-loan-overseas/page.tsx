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

const PATH = '/education-loan-overseas';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外留学の教育ローン比較｜日本政策金融公庫・銀行系の上限と返済【2026年版】',
  description:
    '海外留学に使える教育ローンを完全比較。日本政策金融公庫の教育一般貸付、JASSO、銀行系（オリコ・JACCS・三井住友信託）の上限・金利・条件・返済シミュレーションを一覧化。',
  path: PATH,
  keywords: [
    '海外留学 教育ローン',
    '留学 ローン',
    '日本政策金融公庫 教育ローン',
    'JASSO 第二種',
    'オリコ 教育ローン',
    '海外留学 借入',
  ],
});

const TOC = [
  { id: 'overview', label: '海外留学に使える教育ローンの全体像' },
  { id: 'jpc', label: '日本政策金融公庫「教育一般貸付」' },
  { id: 'jasso', label: 'JASSO（日本学生支援機構）' },
  { id: 'bank', label: '銀行系・信販系教育ローン' },
  { id: 'compare', label: '主要ローン比較表' },
  { id: 'simulation', label: '返済シミュレーション' },
  { id: 'risk', label: 'ローン借入時の注意点・リスク' },
  { id: 'faq', label: 'よくある質問' },
];

const LOANS = [
  { name: '日本政策金融公庫 教育一般貸付', limit: '450万円（海外条件次第で増額可）', rate: '固定2.4%程度', term: '最長18年', merit: '低金利・公的機関の安心感', demerit: '上限額が低め', target: '世帯年収制限あり' },
  { name: 'JASSO第二種（貸与・有利子）', limit: '月12-20万円', rate: '上限3%固定', term: '最長20年', merit: '海外大学院対応、学生時無利子', demerit: '在学中の保証人必要', target: '海外大学院・短期留学' },
  { name: 'JASSO海外大学院学位取得型', limit: '年250-300万円', rate: '無利子', term: '卒業後20年', merit: '無利子、給付に近い条件', demerit: '採用枠が少ない', target: '修士・博士・専門職' },
  { name: 'オリコ「学費サポートプラン」', limit: '500万円', rate: '3.5-6.0%', term: '最長10年', merit: '審査早い、無担保', demerit: '金利が高め', target: '社会人・親借入対応' },
  { name: 'JACCS教育ローン', limit: '500万円', rate: '4.5%-', term: '最長10年', merit: 'WEB完結', demerit: '金利が高め', target: '社会人' },
  { name: '三井住友信託銀行「教育ローン」', limit: '1,000万円', rate: '2.475-3.475%', term: '最長16年', merit: '高額・低金利', demerit: '審査が厳しい', target: '高所得世帯' },
  { name: 'りそな銀行「教育ローン」', limit: '3,000万円', rate: '3.475%', term: '最長10年', merit: '超高額対応', demerit: '担保が必要なケース', target: 'MBA・正規4年留学' },
  { name: 'ろうきん「教育ローン」', limit: '500-2,000万円', rate: '2.0-3.5%', term: '最長10年', merit: '組合員割引', demerit: '組合員資格が必要', target: '労組所属の社会人' },
];

const FAQS = [
  {
    question: '海外留学に教育ローンは使えるか？',
    answer:
      '日本政策金融公庫「教育一般貸付」、JASSO第二種、銀行系教育ローン、信販系（オリコ・JACCS）など、ほぼ全ての教育ローンが海外留学にも対応しています。条件・上限額・金利が異なるため、複数比較が必須です。',
  },
  {
    question: '上限額はいくらまで借りられる？',
    answer:
      '公的機関は450-1,000万円、銀行系は500-3,000万円、信販系は500万円程度が標準。MBA・米国正規4年留学など2,000万円超の費用が必要な場合は、複数機関の併用や奨学金・教育ローンの組み合わせが必要です。',
  },
  {
    question: '返済はいつから始まる？',
    answer:
      '公的機関・JASSOは卒業6ヶ月後から、銀行系は借入翌月からが一般的。在学中も金利は発生するため、卒業時の借入総額は元金より大きくなります。',
  },
  {
    question: '親が借りるべき？子供が借りるべき？',
    answer:
      '日本政策金融公庫・銀行系は親名義が標準（世帯年収で審査）、JASSOは学生本人名義。借入金額・親世代の年収・子供の卒業後想定年収から選択します。社会人留学は本人名義のオリコ・JACCSが多い。',
  },
  {
    question: '返済シミュレーションはどう作る？',
    answer:
      '借入総額・金利・返済期間から、月々返済額を算出します。例: 500万円・金利2.5%・10年返済なら月約47,000円。卒業3年後の想定年収から手取りを計算し、返済比率20%以下に収まるか確認してください。',
  },
];

export default function EducationLoanOverseasPage() {
  return (
    <>
      <JsonLd data={generateBreadcrumbJsonLd([{ name: 'ホーム', url: '/' }, { name: '海外留学の教育ローン比較', url: PATH }])} />
      <JsonLd data={generateFAQJsonLd(FAQS)} />
      <JsonLd
        data={generateArticleJsonLd({
          id: 'education-loan-overseas',
          createdAt: '2026-06-04',
          updatedAt: '2026-06-04',
          publishedAt: '2026-06-04',
          revisedAt: '2026-06-04',
          title: '海外留学の教育ローン比較',
          description: '海外留学に使える教育ローンを完全比較',
          body: '',
        })}
      />

      <div className="container-custom py-8 max-w-4xl">
        <Breadcrumb items={[{ label: '海外留学の教育ローン比較' }]} />

        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
            海外留学の教育ローン比較｜日本政策金融公庫・銀行系の上限と返済【2026年版】
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            海外留学に使える教育ローンを、日本政策金融公庫・JASSO・銀行系・信販系で完全比較。上限額・金利・返済期間・条件を一覧化し、返済シミュレーションと借入時の注意点も解説します。
          </p>
        </header>

        <ArticleMetaBadge readingMinutes={9} updatedAt="2026-06-04" targetAudience="留学・MBA志望者と保護者" />
        <ExchangeRateNotice className="mb-6" />

        <KeyTakeaway
          items={[
            '公的機関（日本政策金融公庫・JASSO）は低金利だが上限額が低い',
            '銀行系は1,000-3,000万円まで対応、金利は2.4-3.5%',
            '信販系（オリコ・JACCS）は審査が早く社会人向き',
            '返済比率は手取り収入の20%以下が安全圏',
            '奨学金・自己資金との3本立てが基本',
          ]}
          title="この記事でわかること"
        />

        <InPageTOC headings={TOC} defaultOpen />

        <section id="overview" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">海外留学に使える教育ローンの全体像</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            海外留学の費用は数百万円から数千万円までと幅広く、自己資金だけで賄うのは困難です。教育ローンは、給付奨学金・自己資金と並んで資金調達の3本柱になります。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            ローン選びの基本は「上限額・金利・返済期間」のバランス。低金利の公的機関を優先し、不足分を銀行系・信販系で補うのが標準パターンです。
          </p>
        </section>

        <section id="jpc" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">日本政策金融公庫「教育一般貸付」</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            国が運営する低金利の教育ローン。子1人あたり最大350万円（海外留学・大学院・自宅外通学等の特定条件で450万円）まで借入可能。金利は固定2.4%程度（2026年現在）、返済期間は最長18年。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            親名義での借入が標準で、世帯年収による制限あり（子1人で790万円程度が上限目安）。低金利・公的機関の安心感から、最初に検討すべきローンです。
          </p>
        </section>

        <section id="jasso" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">JASSO（日本学生支援機構）</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            JASSO第二種（貸与・有利子）は月12-20万円の貸与で、海外大学院にも対応。金利は固定で上限3%程度。学生本人名義のため、親の所得制限はなし。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            JASSO海外大学院学位取得型は無利子で年250-300万円の貸与。採用枠は少ないが、合格できれば最も有利な条件です。
          </p>
        </section>

        <section id="bank" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">銀行系・信販系教育ローン</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            銀行系は1,000-3,000万円の高額対応が可能で、MBA・米国正規4年留学などの大型費用にも対応。金利は2.4-3.5%程度。三井住友信託・りそな銀行・ろうきん（労働金庫）が主要選択肢です。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            信販系（オリコ・JACCS）は審査が早く、社会人留学者向け。金利は3.5-6.0%とやや高めですが、WEB完結で手続きが簡素。
          </p>
        </section>

        <section id="compare" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">主要ローン比較表</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left">ローン名</th>
                  <th className="border border-gray-200 px-2 py-2">上限</th>
                  <th className="border border-gray-200 px-2 py-2">金利</th>
                  <th className="border border-gray-200 px-2 py-2">期間</th>
                  <th className="border border-gray-200 px-2 py-2 text-left">メリット</th>
                  <th className="border border-gray-200 px-2 py-2 text-left">対象</th>
                </tr>
              </thead>
              <tbody>
                {LOANS.map((l) => (
                  <tr key={l.name}>
                    <td className="border border-gray-200 px-2 py-2 font-semibold text-xs">{l.name}</td>
                    <td className="border border-gray-200 px-2 py-2 text-xs">{l.limit}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{l.rate}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-xs">{l.term}</td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-gray-600">{l.merit}</td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-gray-600">{l.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <MidCTA
          title="あなたに最適な資金計画を無料で相談"
          description="借入総額・卒業後の想定年収・返済期間から、ローン併用パターンと月返済額を編集部がシミュレーションします。"
          primaryHref="/contact"
          primaryLabel="無料で相談する"
          secondaryHref="/scholarship-graduate-school"
          secondaryLabel="奨学金一覧を見る"
        />

        <section id="simulation" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">返済シミュレーション例</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2">借入額</th>
                  <th className="border border-gray-200 px-2 py-2">金利</th>
                  <th className="border border-gray-200 px-2 py-2">期間</th>
                  <th className="border border-gray-200 px-2 py-2">月返済額</th>
                  <th className="border border-gray-200 px-2 py-2">総返済額</th>
                  <th className="border border-gray-200 px-2 py-2">利息合計</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { borrow: '300万円', rate: '2.5%', term: '10年', monthly: '約28,300円', total: '約340万円', interest: '約40万円' },
                  { borrow: '500万円', rate: '2.5%', term: '10年', monthly: '約47,100円', total: '約565万円', interest: '約65万円' },
                  { borrow: '500万円', rate: '3.5%', term: '10年', monthly: '約49,500円', total: '約594万円', interest: '約94万円' },
                  { borrow: '1,000万円', rate: '2.5%', term: '15年', monthly: '約66,700円', total: '約1,200万円', interest: '約200万円' },
                  { borrow: '1,500万円', rate: '2.5%', term: '20年', monthly: '約79,500円', total: '約1,907万円', interest: '約407万円' },
                ].map((row) => (
                  <tr key={`${row.borrow}-${row.rate}-${row.term}`}>
                    <td className="border border-gray-200 px-2 py-2 text-center font-semibold">{row.borrow}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center">{row.rate}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center">{row.term}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-primary-700 font-semibold">{row.monthly}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center">{row.total}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-red-600">{row.interest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">※元利均等返済の概算。実際の金利・条件により変動します。</p>
        </section>

        <section id="risk" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">ローン借入時の注意点・リスク</h2>
          <ul className="space-y-2 text-sm text-gray-800">
            {[
              '返済比率は手取り収入の20%以下に抑えるのが安全圏（500万円借入・年収500万円なら月返済10万円が上限）',
              '為替変動±5%で総返済額が±10〜20万円動く可能性（円安リスク）',
              '在学中は元本据置でも利息は発生する。卒業時の借入総額は元金より増える',
              'MBA・大学院卒業後の想定年収を正確に把握する（特に文系修士は年収増が限定的）',
              'JASSO第二種を借りる場合、保証人/機関保証の選択で総コストが変わる',
              'ローン審査落ちのリスクを想定し、複数機関に同時申請しない',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0 mt-0.5">!</span>
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
            <li><Link href="/scholarship-graduate-school" className="text-primary-700 hover:underline">大学院留学の奨学金 完全ガイド →</Link></li>
            <li><Link href="/mba-cost-comparison" className="text-primary-700 hover:underline">MBA留学の費用比較 →</Link></li>
            <li><Link href="/us-private-vs-public-university" className="text-primary-700 hover:underline">米国大学 私立vs州立 →</Link></li>
            <li><Link href="/uk-postgraduate-cost" className="text-primary-700 hover:underline">英国大学院の総費用 →</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
