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

const PAGE_PATH = '/wh-hotel-management';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ホテルマネジメント留学完全ガイド｜スイス名門校・Co-op・就職・PR',
  description: 'ホテルマネジメント留学の完全ガイド。スイス・豪・カナダの名門校、Co-op（有給インターン）、費用、卒業後の就職・PR取得まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'ホテルマネジメント 留学',
    'ホスピタリティ 留学',
    'スイス ホテル学校',
    'ホテル 専門学校 海外',
    'ホテルマネジメント Co-op',
    'ホスピタリティ PR',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-hotel', label: 'なぜホテルマネジメント留学か' },
  { id: 'top-schools', label: '世界トップ校・地域別' },
  { id: 'coop', label: 'Co-op（有給インターン）の魅力' },
  { id: 'cost', label: '費用シミュレーション' },
  { id: 'curriculum', label: 'カリキュラム内容' },
  { id: 'career', label: '卒業後のキャリア・年収' },
  { id: 'pr-route', label: 'PR取得ルート' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TOP_SCHOOLS = [
  {
    school: 'Les Roches（スイス）',
    feature: 'スイス御三家、世界ランキング上位、ラグジュアリーホテル就職',
    cost: '年CHF 35,000-50,000',
  },
  {
    school: 'Glion Institute（スイス）',
    feature: 'スイス御三家、ビジネス＋ホスピタリティ融合',
    cost: '年CHF 35,000-50,000',
  },
  {
    school: 'EHL Hospitality Business School（スイス）',
    feature: '世界No.1ホスピタリティ大学、最難関',
    cost: '年CHF 40,000-55,000',
  },
  {
    school: 'Blue Mountains（豪）',
    feature: '豪トップ、Co-op充実、PR取得有利',
    cost: '年AUD 30,000-40,000',
  },
  {
    school: 'Capilano University（カナダ）',
    feature: 'バンクーバー、Co-op＋PGWP、コスパ良',
    cost: '年CAD 18,000-25,000',
  },
];

const COOP_BENEFITS = [
  '在学中に有給ホテルインターン（6ヶ月-1年）',
  '世界的ホテルチェーン（Marriott、Hilton等）で実務',
  '給与をもらいながら学費の一部回収',
  '実務経験＋人脈で卒業後就職に直結',
  '理論（授業）＋実践（インターン）の往復学習',
  'グローバルホテルネットワークへの入口',
];

const COST_SIMULATION = [
  { program: 'スイス学士4年', tuition: 'CHF 140,000-200,000', living: 'CHF 60,000-80,000', total: '約3,400-4,800万円' },
  { program: '豪Diploma 2年', tuition: 'AUD 30,000-50,000', living: 'AUD 30,000-50,000', total: '約900-1,500万円' },
  { program: '加Co-op Diploma 2年', tuition: 'CAD 25,000-40,000', living: 'CAD 24,000-40,000', total: '約700-1,200万円' },
];

const CURRICULUM = [
  'ホテルオペレーション（フロント・客室・F&B）',
  'ホスピタリティマネジメント（人材・財務・マーケティング）',
  'レベニューマネジメント（収益最大化）',
  'ラグジュアリーブランド・サービス論',
  'イベント・MICE（会議・展示会）運営',
  '実技：レストラン・バー・客室サービス',
  'Co-opインターンシップ（実務）',
];

const CAREER = [
  'ホテルフロント・ゲストサービス：年収$35,000-50,000',
  'F&Bマネージャー：年収$50,000-75,000',
  'レベニューマネージャー：年収$60,000-90,000',
  'ホテル支配人（GM）：年収$80,000-200,000',
  'クルーズ船・リゾート運営：グローバルキャリア',
  'イベント・MICE業界：年収$50,000-100,000',
  'ラグジュアリーブランド（接客・運営）',
];

const PR_ROUTES = [
  '豪：ホスピタリティマネージャーは職種リスト、Co-op→就職→PR',
  '加：Capilano等のCo-op→PGWP（卒業後就労3年）→Express EntryでPR',
  'スイス：EU圏外は就労ビザ厳しいが、卒業生は世界中で就職可',
  '※ホスピタリティは世界中で人材不足、グローバルキャリア構築しやすい',
];

const FAQS = [
  {
    question: 'ホテルマネジメント留学は誰向け？',
    answer:
      'ホテル・観光・サービス業界でグローバルキャリアを築きたい人。接客好き・おもてなし精神・国際志向の人に最適。スイス御三家は富裕層向けの高額校、豪・加はCo-op＋PR取得を狙う実利志向の人に人気。',
  },
  {
    question: 'Co-opとは？メリットは？',
    answer:
      'Co-op（Cooperative Education）は在学中の有給インターンシップ制度。世界的ホテルチェーンで6ヶ月-1年働き、給与をもらいながら実務経験＋学費の一部回収。理論と実践の往復で、卒業後の就職に直結する最強の学習システム。',
  },
  {
    question: 'スイスと豪・加、どっち？',
    answer:
      'スイス：世界最高峰のブランド＋ラグジュアリーホテル就職、ただし学費年CHF 35,000-55,000と高額。豪・加：Co-op＋PR取得が狙え、コスパも良い。「ブランド＋ラグジュアリー志向」ならスイス、「PR＋実利志向」なら豪・加。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      'IELTS 5.5-6.5（学部・Diploma）。ホスピタリティは接客英語＋ビジネス英語必須、Co-op先のホテルでは実践英語が急上昇。スイスの一部校はフランス語・ドイツ語も学べる、多言語環境がキャリアの強みに。',
  },
  {
    question: '卒業後の年収は？',
    answer:
      'スタートはホテルフロント年収$35,000-50,000、5-10年でマネージャー$50,000-90,000、GM（支配人）まで上れば$80,000-200,000。グローバルホテルチェーンでの世界転勤キャリアも、ホスピタリティ業界はグローバル人材需要高。',
  },
];

export default async function WhHotelManagementPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(ホテル|ホスピタリティ|観光|接客|hotel)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(ホテル|ホスピタリティ|観光|接客|hotel)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ホテルマネジメント留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ホテルマネジメント留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ホテルマネジメント留学完全ガイド｜スイス名門校・Co-op・就職・PR
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ホスピタリティ業界でグローバルキャリアを築きたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ホテルマネジメント留学は、世界的ホテルチェーン就職＋グローバルキャリア＋PR取得を狙える人気の選択肢。スイス御三家から豪・加のCo-op校まで、選択肢豊富。
              <br />
              この記事では世界トップ校、Co-op制度、費用、カリキュラム、卒業後キャリア、PR取得まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'スイス御三家（Les Roches・Glion・EHL）が世界最高峰',
              'Co-op（有給インターン）で実務経験＋学費回収',
              '豪・加はCo-op＋PR取得が狙え、コスパも良い',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-hotel" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜホテルマネジメント留学か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・世界的ホテルチェーンでのグローバルキャリア</li>
              <li>・Co-opで給与をもらいながら実務経験</li>
              <li>・ホスピタリティは世界中で人材不足、就職しやすい</li>
              <li>・豪・加はPR取得ルート確立</li>
              <li>・接客＋マネジメント＋ビジネスの総合スキル</li>
              <li>・クルーズ・リゾート・イベント等の幅広い業界へ</li>
            </ul>
          </section>

          {/* 主要校 */}
          <section id="top-schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">世界トップ校・地域別</h2>
            <div className="space-y-3">
              {TOP_SCHOOLS.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{s.school}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{s.feature}</p>
                  <p className="text-sm text-amber-700 font-bold">{s.cost}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Co-op */}
          <section id="coop" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Co-op（有給インターン）の魅力</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {COOP_BENEFITS.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🏨</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="海外大学・大学院進学全般も合わせて"
            description="ホテルマネジメント以外の専門留学、海外進学全般も視野に。"
            primaryHref="/wh-overseas-university"
            primaryLabel="海外大学・大学院進学"
            secondaryHref="/wh-internship"
            secondaryLabel="海外インターンシップ"
          />

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用シミュレーション</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">プログラム</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">学費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">生活費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">合計</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_SIMULATION.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.program}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.tuition}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.living}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ※ Co-op給与で学費の一部回収可。豪・加はスイスの約1/3-1/4のコスト。
            </p>
          </section>

          {/* カリキュラム */}
          <section id="curriculum" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">カリキュラム内容</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {CURRICULUM.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">📚</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* キャリア */}
          <section id="career" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">卒業後のキャリア・年収</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {CAREER.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">→</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* PR */}
          <section id="pr-route" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">PR取得ルート</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PR_ROUTES.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🌏</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「ホテル・ホスピタリティ・観光・接客」関連の言及を集計。
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
            ※ 学費・年収は2026年5月時点の参考値です。最新情報は各校公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-overseas-university" className="text-primary-600 hover:underline">→ 海外大学・大学院進学</Link></li>
              <li><Link href="/wh-internship" className="text-primary-600 hover:underline">→ 海外インターンシップ</Link></li>
              <li><Link href="/wh-cook-chef" className="text-primary-600 hover:underline">→ 海外シェフ・料理人</Link></li>
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/wh-bilingual-job" className="text-primary-600 hover:underline">→ バイリンガル海外仕事</Link></li>
              <li><Link href="/english-test-waiver" className="text-primary-600 hover:underline">→ IELTS/TOEFL免除</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
