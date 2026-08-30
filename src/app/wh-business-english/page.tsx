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

const PAGE_PATH = '/wh-business-english';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ビジネス英語留学完全ガイド｜社会人向け・コース内容・TOEIC対策',
  description: '社会人向けビジネス英語留学の完全ガイド。コース内容、おすすめ国・学校、TOEIC/IELTS対策、費用、キャリア活用、転職への影響まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'ビジネス英語 留学',
    '社会人 英語留学',
    'ビジネス英語 学校',
    'TOEIC 留学',
    'ビジネス英会話 海外',
    '社会人 短期 英語留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-business-english', label: 'なぜビジネス英語留学か' },
  { id: 'course-content', label: 'コース内容・カリキュラム' },
  { id: 'top-destinations', label: 'おすすめ国・学校' },
  { id: 'duration', label: '期間別の到達レベル' },
  { id: 'cost', label: '費用シミュレーション' },
  { id: 'test-prep', label: 'TOEIC/IELTS対策との両立' },
  { id: 'career-use', label: 'キャリア・転職への活用' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COURSE_CONTENT = [
  'ビジネスメール・レポート作成',
  '電話・ビデオ会議での英語対応',
  'プレゼンテーション・スピーチ',
  '交渉・ディスカッション・会議進行',
  '業界別英語（IT・金融・医療・マーケティング等）',
  'ビジネスマナー・異文化コミュニケーション',
  'TOEIC/IELTSスコアアップ（併修可）',
];

const TOP_DESTINATIONS = [
  {
    place: 'フィリピン（セブ・マニラ）',
    feature: 'マンツーマン中心、ビジネス特化校多、短期集中＋最安',
    cost: '1ヶ月20-35万円',
  },
  {
    place: 'マルタ',
    feature: '欧州ビジネス環境、Executive向けコース、治安◎',
    cost: '1ヶ月25-40万円',
  },
  {
    place: 'カナダ（バンクーバー・トロント）',
    feature: 'ビジネス英語＋Co-op、北米ビジネス文化',
    cost: '1ヶ月35-50万円',
  },
  {
    place: 'イギリス（ロンドン）',
    feature: '本場のビジネス英語、金融・国際ビジネスの中心',
    cost: '1ヶ月50-80万円',
  },
  {
    place: 'オーストラリア（シドニー）',
    feature: 'ビジネス英語＋有給インターン併設校',
    cost: '1ヶ月35-50万円',
  },
];

const DURATION_LEVELS = [
  { duration: '2-4週間', level: 'ビジネス英語の基礎、メール・電話対応の自信' },
  { duration: '1-3ヶ月', level: '会議参加・プレゼン対応、TOEIC 100-150点UP' },
  { duration: '3-6ヶ月', level: 'ビジネス交渉・ディスカッション、TOEIC 200点UP' },
  { duration: '6-12ヶ月', level: 'ネイティブとビジネス対等、海外就職レベル' },
];

const COST_SIMULATION = [
  { period: 'セブ 1ヶ月', tuition: '20-30万円', living: '寮込み', total: '約20-35万円' },
  { period: 'マルタ 1ヶ月', tuition: '12-20万円', living: '13-20万円', total: '約25-40万円' },
  { period: 'カナダ 3ヶ月', tuition: '50-80万円', living: '60-90万円', total: '約110-170万円' },
  { period: 'ロンドン 1ヶ月', tuition: '25-40万円', living: '25-40万円', total: '約50-80万円' },
];

const CAREER_USE = [
  'TOEIC/IELTSスコアUPで昇進・昇給',
  '外資系・グローバル企業への転職',
  '海外駐在員候補としてアピール',
  '社内英語公用化への対応力',
  '海外取引・グローバルプロジェクト参画',
  'MBA・大学院進学への足がかり',
  '起業・フリーランスでの海外取引',
];

const FAQS = [
  {
    question: '社会人で短期ビジネス英語留学する人は多い？',
    answer:
      '増加中。有給休暇＋GW＋夏休みを組み合わせた1-4週間の短期ビジネス英語留学が人気。フィリピン・マルタのマンツーマン集中コースなら、短期間でも明確な成果を実感できる。転職・昇進前のスキルアップ手段として活用されています。',
  },
  {
    question: '一般英語とビジネス英語、どっち学ぶ？',
    answer:
      '目的次第。日常会話が不安なら一般英語、仕事で使う英語を強化したいならビジネス英語。多くの校は「午前一般英語＋午後ビジネス英語」のハイブリッドコースあり。TOEIC 600以上ならビジネス英語特化が効率的。',
  },
  {
    question: 'TOEICスコアは上がる？',
    answer:
      '上がります。1ヶ月で100-150点、3ヶ月で200点UPが目安。多くのビジネス英語校はTOEIC/IELTS対策コースを併設、ビジネス英語＋試験対策の両立可。「ビジネス英語＋具体スコア」の組み合わせが転職・昇進で武器に。',
  },
  {
    question: 'どの国がおすすめ？',
    answer:
      'コスパ＋短期集中ならフィリピン（セブ）、欧州ビジネス環境＋治安ならマルタ、北米ビジネス＋Co-opならカナダ、本場の金融・国際ビジネスならロンドン。社会人の短期なら、フィリピン・マルタが費用対効果◎。',
  },
  {
    question: '帰国後どう活かす？',
    answer:
      'TOEIC/IELTSスコア取得→昇進・昇給交渉、外資系転職、社内英語公用化対応、海外駐在候補アピール。「ビジネス英語留学＋具体的成果（スコア・スキル）」をセットで示すことで、キャリアアップ・年収UPに直結。',
  },
];

export default async function WhBusinessEnglishPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(ビジネス英語|社会人|TOEIC|英語力|キャリアアップ)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(ビジネス英語|社会人|TOEIC|英語力|キャリアアップ)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ビジネス英語留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ビジネス英語留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ビジネス英語留学完全ガイド｜社会人向け・コース内容・TOEIC対策
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="仕事で使う英語を強化したい社会人"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ビジネス英語留学は、メール・会議・プレゼン・交渉等の仕事で使う英語を集中的に強化できる社会人向けの選択肢。短期集中で転職・昇進・海外駐在への武器に。
              <br />
              この記事ではコース内容、おすすめ国、期間別到達レベル、費用、TOEIC対策、キャリア活用まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'メール・会議・プレゼン・交渉等の実務英語を集中強化',
              '1ヶ月でTOEIC 100-150点UP、社会人の短期留学に最適',
              'コスパ＋短期ならフィリピン・マルタが効率的',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-business-english" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜビジネス英語留学か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・仕事で即使えるビジネス英語を集中強化</li>
              <li>・TOEIC/IELTSスコアUPで昇進・転職に直結</li>
              <li>・短期集中（1-4週間）で社会人も挑戦しやすい</li>
              <li>・外資系・グローバル企業への転職準備</li>
              <li>・海外駐在員候補としてのアピール材料</li>
              <li>・グローバルビジネスマナー・異文化対応力</li>
            </ul>
          </section>

          {/* コース */}
          <section id="course-content" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">コース内容・カリキュラム</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {COURSE_CONTENT.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">💼</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* おすすめ国 */}
          <section id="top-destinations" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">おすすめ国・学校</h2>
            <div className="space-y-3">
              {TOP_DESTINATIONS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{d.place}</p>
                    <p className="text-sm font-bold text-amber-700">{d.cost}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 期間別 */}
          <section id="duration" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">期間別の到達レベル</h2>
            <div className="space-y-3">
              {DURATION_LEVELS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{d.duration}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.level}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="短期留学・IELTS免除条件も合わせて"
            description="社会人の短期留学全般、英語試験の代替手段も確認を。"
            primaryHref="/short-term-study"
            primaryLabel="短期留学1-3ヶ月"
            secondaryHref="/english-test-waiver"
            secondaryLabel="IELTS/TOEFL免除条件"
          />

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用シミュレーション</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">渡航先・期間</th>
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

          {/* TOEIC対策 */}
          <section id="test-prep" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">TOEIC/IELTS対策との両立</h2>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・多くの校が「ビジネス英語＋試験対策」のハイブリッドコース提供</p>
              <p>・午前一般/ビジネス英語＋午後TOEIC/IELTS対策が定番</p>
              <p>・1ヶ月でTOEIC 100-150点、3ヶ月で200点UPが目安</p>
              <p>・フィリピンはマンツーマンで試験対策が効率的</p>
              <p>・帰国直前にTOEIC受験で具体スコア化、転職・昇進に活用</p>
            </div>
          </section>

          {/* キャリア活用 */}
          <section id="career-use" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">キャリア・転職への活用</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {CAREER_USE.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">→</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「ビジネス英語・社会人・TOEIC」関連の言及を集計。
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
            ※ 費用は2026年5月時点の参考値です。最新情報は各学校公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/short-term-study" className="text-primary-600 hover:underline">→ 短期留学1-3ヶ月</Link></li>
              <li><Link href="/english-test-waiver" className="text-primary-600 hover:underline">→ IELTS/TOEFL免除</Link></li>
              <li><Link href="/cebu-study-real-cost" className="text-primary-600 hover:underline">→ セブ留学リアルコスト</Link></li>
              <li><Link href="/wh-job-hunting-japan" className="text-primary-600 hover:underline">→ 帰国後就活</Link></li>
              <li><Link href="/wh-bilingual-job" className="text-primary-600 hover:underline">→ バイリンガル海外仕事</Link></li>
              <li><Link href="/30s-guide" className="text-primary-600 hover:underline">→ 30代からの留学</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
