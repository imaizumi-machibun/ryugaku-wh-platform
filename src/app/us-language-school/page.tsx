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

const PAGE_PATH = '/us-language-school';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'アメリカ語学留学完全ガイド｜F-1ビザ・主要校・費用・州別特徴',
  description: 'アメリカ語学留学のF-1ビザ取得、主要語学学校5校、費用シミュレーション、州別特徴（NY/LA/SF/ボストン）、治安、就活活用まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'アメリカ 語学留学',
    'アメリカ 留学 費用',
    'アメリカ 語学学校',
    'F-1ビザ',
    'ニューヨーク 留学',
    'ロサンゼルス 留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-us', label: 'なぜアメリカ留学なのか' },
  { id: 'visa', label: 'F-1ビザ取得5ステップ' },
  { id: 'top-schools', label: '主要語学学校5校' },
  { id: 'cost', label: '費用シミュレーション（年300〜500万円）' },
  { id: 'by-city', label: '州・都市別の特徴' },
  { id: 'safety', label: '治安・州別注意点' },
  { id: 'after-graduation', label: '卒業後の就労・進路' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const VISA_STEPS = [
  { step: 1, title: '語学学校の入学許可（I-20）取得', detail: '希望校に出願、I-20書類が郵送 or 電子で受領' },
  { step: 2, title: 'SEVIS費用支払い（$350）', detail: '米国移民局指定システムで支払い、領収書保存' },
  { step: 3, title: 'DS-160オンライン申請', detail: 'F-1ビザ申請書、所要時間1〜2時間' },
  { step: 4, title: '大使館・領事館で面接', detail: '東京・大阪・札幌・福岡・那覇で面接予約、書類持参' },
  { step: 5, title: 'パスポート受領・渡米準備', detail: '面接後1〜2週間でビザ付パスポート郵送' },
];

const TOP_SCHOOLS = [
  {
    name: 'Kaplan International',
    cities: 'NY、LA、SF、ボストン他',
    feature: '世界最大規模の語学学校チェーン、多国籍、レベル分け細かい',
    cost: '4週間$1,500〜2,500',
  },
  {
    name: 'EF（Education First）',
    cities: 'NY、LA、SF、サンディエゴ等',
    feature: 'ハイクオリティ施設、IELTS・TOEFL対策強い',
    cost: '4週間$1,800〜2,800',
  },
  {
    name: 'EC English',
    cities: 'NY、ボストン、サンディエゴ',
    feature: 'コンパクトな規模、コミュニティ感、初心者向け',
    cost: '4週間$1,400〜2,200',
  },
  {
    name: 'ELS Language Centers',
    cities: '全米60都市',
    feature: '大学キャンパス内併設多、進学準備に強み',
    cost: '4週間$1,600〜2,400',
  },
  {
    name: 'Rennert International',
    cities: 'NY中心',
    feature: '小規模・少人数授業（最大10名）、質重視',
    cost: '4週間$1,900〜2,800',
  },
];

const COST_SIMULATION = [
  { period: '1ヶ月', tuition: '$1,500〜2,500', living: '$2,000〜3,500', total: '約55〜90万円' },
  { period: '3ヶ月', tuition: '$4,000〜7,000', living: '$6,000〜10,500', total: '約160〜280万円' },
  { period: '6ヶ月', tuition: '$7,500〜13,000', living: '$12,000〜21,000', total: '約310〜520万円' },
  { period: '1年', tuition: '$14,000〜24,000', living: '$24,000〜42,000', total: '約580〜990万円' },
];

const BY_CITY = [
  {
    city: 'ニューヨーク',
    feature: '世界の中心、多国籍、刺激最大、家賃高',
    forWho: '都会派・刺激重視・ファッション/アート好き',
  },
  {
    city: 'ロサンゼルス',
    feature: '気候良好、エンタメ業界、車社会',
    forWho: '気候・ライフスタイル重視・エンタメ志向',
  },
  {
    city: 'サンフランシスコ',
    feature: 'IT中心、欧州的雰囲気、家賃最高',
    forWho: 'IT志望・スタートアップ・テック業界',
  },
  {
    city: 'ボストン',
    feature: '大学都市、知的雰囲気、四季明瞭',
    forWho: '進学志望・学術志向・伝統文化好き',
  },
  {
    city: 'サンディエゴ',
    feature: '温暖・治安◎・コスパ良、リゾート感',
    forWho: 'コスパ重視・初心者・落ち着いた暮らし好き',
  },
];

const SAFETY_NOTES = [
  '主要都市の中心部は基本的に安全、夜の地下鉄・郊外には注意',
  'NYのSubway深夜・Bronx一部・LAのSouth Centralは避ける',
  'SFのTenderloin地区は治安悪化、滞在エリアは要選定',
  '車社会のLAは公共交通弱、Uber/Lyft活用前提',
  '銃所持合法州あり、トラブル時は警察ではなく逃げる優先',
];

const AFTER_GRAD = [
  '語学学校→大学進学（コミュニティカレッジ→4年制編入が人気）',
  'OPT（Optional Practical Training）で1年就労可能（大学卒業後）',
  'STEM分野卒業ならOPT 3年延長可能',
  '日系企業の米国支社への就職（東海岸はNY、西海岸はLA・SF）',
  '帰国後の外資系・グローバル企業転職、米国経験はプラス',
];

const FAQS = [
  {
    question: 'アメリカ語学留学の総額は？',
    answer:
      '1ヶ月55〜90万円、3ヶ月160〜280万円、半年310〜520万円、1年580〜990万円が目安。世界一物価高の留学先、特にNY/SFは家賃$2,000-3,500/月と非常に高い。サンディエゴ・南部都市は同等英語環境で約30%安く済みます。',
  },
  {
    question: 'F-1ビザは取りやすい？',
    answer:
      '近年厳しめ。「英語学習＋帰国意思」を面接で明確に説明する必要あり。SEVIS費用＋ビザ申請料＋面接で合計$700-800、申請から発行まで4-8週間。コロナ後は面接予約が取りにくい時期もあるため、3-6ヶ月前から準備推奨。',
  },
  {
    question: 'アルバイトはできる？',
    answer:
      'F-1ビザは「学内アルバイト週20時間まで」のみ可。学外バイトは原則不可（違反でビザ失効リスク）。CPT（Curricular Practical Training）等の特例で学外就労可能なケースもあるが、語学学校の段階では基本不可です。',
  },
  {
    question: 'ワーホリと比較してどう？',
    answer:
      'アメリカにはワーホリ協定なし。働きながら生活したいならカナダ・オーストラリア。学業集中で英語＋本場のアメリカ文化体験したいならアメリカ。コスト重視＋働きたいならワーホリ国、本場の英語＋アメリカ大学進学を視野ならアメリカ。',
  },
  {
    question: '州・都市はどう選ぶ？',
    answer:
      '気候・予算・キャリア志向で決定。コスパ重視ならサンディエゴ・南部、刺激重視ならNY、IT志望ならSF、アカデミックな雰囲気ならボストン、エンタメ・気候重視ならLA。事前に複数の語学学校情報を比較し、留学エージェントに相談するとミスマッチ防げます。',
  },
];

export default async function UsLanguageSchoolPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const usExperiences = all.filter((e) => e.country?.id === 'united-states');
  const mentions = countMentions(all, /(アメリカ|US|USA|ニューヨーク|ロサンゼルス|F-1)/i);
  const sample = usExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(アメリカ|US|ニューヨーク|ロサンゼルス|F-1)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'アメリカ語学留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'アメリカ語学留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              アメリカ語学留学完全ガイド｜F-1ビザ・主要校・費用・州別特徴
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="アメリカ語学留学を検討する方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「本場のアメリカ英語＋アメリカ文化を体験したい」「将来アメリカ大学進学を視野」そんな方向けのアメリカ語学留学。
              <br />
              この記事ではF-1ビザ取得、主要語学学校5校、費用、州・都市別の特徴、卒業後の進路まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '1年総額580〜990万円、世界一物価高だが本場体験',
              'F-1ビザ必須、コロナ後は面接予約に時間かかる',
              'NY/SF/LAは家賃高、コスパならサンディエゴ・南部',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜアメリカ */}
          <section id="why-us" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜアメリカ留学なのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              アメリカは世界最大の英語圏国家、本場アメリカ文化を体験できる留学先。コストは高いですが、英語＋多文化＋ビジネス感覚を一気に身につけられます。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・本場アメリカ英語の習得、世界標準の英語</li>
              <li>・多文化・多民族環境で世界各国の人と交流</li>
              <li>・アメリカ大学進学・大学院進学のスタート地点</li>
              <li>・帰国後の外資系・グローバル企業評価高</li>
              <li>・OPT（卒業後1年就労）でアメリカでの実務経験</li>
              <li>・エンタメ・テック・金融等世界最先端産業の中心</li>
            </ul>
          </section>

          {/* ビザ */}
          <section id="visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">F-1ビザ取得5ステップ</h2>
            <div className="space-y-3">
              {VISA_STEPS.map((s) => (
                <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {s.step}: {s.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
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
                  <p className="text-xs text-gray-500 mb-1">都市: {s.cities}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他の英語圏留学先と比較"
            description="カナダ・オーストラリア・マルタ等のコスパ留学先も合わせて検討を。"
            primaryHref="/vancouver-language-school"
            primaryLabel="バンクーバー語学学校"
            secondaryHref="/matching"
            secondaryLabel="自分に合う留学診断"
          />

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用シミュレーション（年300〜500万円）</h2>
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

          {/* 州別 */}
          <section id="by-city" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">州・都市別の特徴</h2>
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

          {/* 治安 */}
          <section id="safety" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">治安・州別注意点</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {SAFETY_NOTES.map((n, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 卒業後 */}
          <section id="after-graduation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">卒業後の就労・進路</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {AFTER_GRAD.map((a, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
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
                アメリカ渡航者の体験談 <strong>n={usExperiences.length}件</strong>。
                アメリカ留学関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ ビザ要件・費用は2026年5月時点の情報です。最新情報は在日米国大使館・各学校公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/vancouver-language-school" className="text-primary-600 hover:underline">→ バンクーバー語学学校</Link></li>
              <li><Link href="/malta-study" className="text-primary-600 hover:underline">→ マルタ留学完全ガイド</Link></li>
              <li><Link href="/cebu-study-real-cost" className="text-primary-600 hover:underline">→ セブ留学リアルコスト</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
              <li><Link href="/english-test-waiver" className="text-primary-600 hover:underline">→ IELTS/TOEFL免除条件</Link></li>
              <li><Link href="/countries/united-states" className="text-primary-600 hover:underline">→ アメリカ国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
