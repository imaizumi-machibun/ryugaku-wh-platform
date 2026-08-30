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

const PAGE_PATH = '/uk-language-school';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'イギリス語学留学完全ガイド｜Student Visa・主要校・費用・都市別特徴',
  description: 'イギリス語学留学のStudent Visa取得、主要語学学校5校、費用シミュレーション、ロンドン/オックスフォード/エディンバラ等の都市別特徴、本場英語の魅力を完全解説。',
  path: PAGE_PATH,
  keywords: [
    'イギリス 語学留学',
    'イギリス 留学 費用',
    'イギリス 語学学校',
    'ロンドン 語学留学',
    'UK Student Visa',
    'イギリス 短期留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-uk', label: 'なぜイギリス語学留学なのか' },
  { id: 'visa-types', label: 'Student Visa の種類' },
  { id: 'top-schools', label: '主要語学学校5校' },
  { id: 'cost', label: '費用シミュレーション' },
  { id: 'by-city', label: '都市別の特徴・選び方' },
  { id: 'work-rule', label: '就労ルール・アルバイト' },
  { id: 'tips', label: '満足度を高める7つのコツ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const VISA_TYPES = [
  {
    type: 'Short-term Study Visa（短期）',
    duration: '6〜11ヶ月',
    work: '就労不可',
    detail: '11ヶ月以内の英語学習向け。最も一般的、申請料£200',
  },
  {
    type: 'Student Visa（一般）',
    duration: '6ヶ月超〜',
    work: '週20時間まで就労可',
    detail: '大学・専門学校・長期語学コース向け。IHS £940/年',
  },
  {
    type: 'Standard Visitor Visa',
    duration: '6ヶ月以内',
    work: '就労不可',
    detail: '日本人は申請不要、6ヶ月までの英語学習も可能',
  },
];

const TOP_SCHOOLS = [
  {
    name: 'Kaplan International（ロンドン他）',
    cities: 'ロンドン、ケンブリッジ、エディンバラ等',
    feature: '世界最大規模、多国籍、レベル分け細かい',
    cost: '4週間£1,300〜2,000',
  },
  {
    name: 'EF（Education First）',
    cities: 'ロンドン、ブライトン、ケンブリッジ等',
    feature: 'ハイクオリティ施設、IELTS・ケンブリッジ英検対策強み',
    cost: '4週間£1,500〜2,400',
  },
  {
    name: 'St Giles International',
    cities: 'ロンドン、ブライトン、イーストボーン',
    feature: '老舗・伝統校、小規模アットホーム、質重視',
    cost: '4週間£1,200〜1,800',
  },
  {
    name: 'British Study Centres',
    cities: 'ロンドン、オックスフォード、ブライトン',
    feature: '大学キャンパスサマーコース充実',
    cost: '4週間£1,400〜2,200',
  },
  {
    name: 'International House London',
    cities: 'ロンドン中心',
    feature: '英語教授法発祥校、講師の質が高い',
    cost: '4週間£1,500〜2,300',
  },
];

const COST_SIMULATION = [
  { period: '1ヶ月', tuition: '£1,200〜2,000', living: '£1,200〜2,000', total: '約50〜80万円' },
  { period: '3ヶ月', tuition: '£3,300〜5,500', living: '£3,600〜6,000', total: '約140〜230万円' },
  { period: '6ヶ月', tuition: '£6,000〜10,000', living: '£7,200〜12,000', total: '約265〜440万円' },
  { period: '1年', tuition: '£11,000〜18,000', living: '£14,400〜24,000', total: '約510〜840万円' },
];

const BY_CITY = [
  {
    city: 'ロンドン',
    feature: '世界の中心、多国籍、家賃高、エンタメ・アート豊富',
    forWho: '都会派・本物の英語＋多文化体験重視',
  },
  {
    city: 'オックスフォード/ケンブリッジ',
    feature: '大学都市、アカデミックな雰囲気、家賃中程度',
    forWho: '進学志向・知的な留学体験重視',
  },
  {
    city: 'ブライトン',
    feature: 'リゾート都市、若者多、家賃ロンドンの2/3',
    forWho: 'ビーチ＋都会の融合、コスパ重視',
  },
  {
    city: 'エディンバラ',
    feature: 'スコットランドの首都、歴史・観光、家賃手頃',
    forWho: 'スコットランド英語・歴史好き',
  },
  {
    city: 'マンチェスター',
    feature: '北部最大都市、サッカー・音楽、家賃ロンドンの半額',
    forWho: 'コスパ重視・サッカー・音楽好き',
  },
];

const WORK_RULES = [
  'Student Visa（6ヶ月超）：週20時間まで就労可、休暇中はフルタイムOK',
  'Short-term Study Visa：就労不可',
  '日本人向け求人：ロンドン日本食レストラン、観光業多',
  '最低時給：£11.44/時間（2024年4月〜）、ロンドンは更に高め',
  '銀行口座開設にはNI番号必要、申請から発行2-4週間',
  '雇用主から税金天引き、年度末に確定申告（自己責任）',
];

const SATISFY_TIPS = [
  '長期割引活用：3ヶ月以上で20-30%割引が標準',
  '宿泊は学校手配のホームステイ＋途中でシェアハウス移行',
  'IELTS・ケンブリッジ英検対策コースで明確な目標設定',
  'ロンドン拠点でも週末は地方旅行（鉄道50%割引カード）',
  '欧州周遊（Eurostar・LCCで安く）でEU文化体験',
  '英国独特のパブ文化を体験、ローカルと交流',
  'ホストファミリーが充実、ホームステイは学生の特権',
];

const FAQS = [
  {
    question: 'イギリス語学留学の総額は？',
    answer:
      '1ヶ月50〜80万円、3ヶ月140〜230万円、半年265〜440万円、1年510〜840万円が目安。家賃高（ロンドン月£1,000〜1,500）、学費も他国より高めですが、本場の英語と歴史文化が手に入る価値あり。長期割引活用で20-30%安くなります。',
  },
  {
    question: 'ビザはどれを選ぶ？',
    answer:
      '滞在期間で決定。6ヶ月以内なら日本人ビザ不要、6-11ヶ月ならShort-term Study Visa（£200）、6ヶ月超で就労したいならStudent Visa（IHS £940/年）。短期で英語に集中したい人は前者、長期でアルバイトもしたい人は後者。',
  },
  {
    question: 'ロンドン以外でも留学できる？',
    answer:
      'できる、むしろおすすめ。オックスフォード・ケンブリッジ・ブライトン・エディンバラ・マンチェスター等の地方都市は家賃ロンドンの半額〜2/3、日本人少なめで英語環境◎。ロンドンへの日帰り旅行も鉄道で2-3時間で可能。',
  },
  {
    question: '本場のイギリス英語は通じる？',
    answer:
      '通じます。学校講師は標準英語（Received Pronunciation）が多く、生徒同士はインターナショナル英語。ローカルの英語は地方訛り（コックニー、スコティッシュ等）に最初戸惑うが、3-6ヶ月で慣れる。卒業後はTOEIC・IELTSはもちろん、欧州・米国でも通用するレベルに。',
  },
  {
    question: 'EU離脱後の影響は？',
    answer:
      '日本人にはほぼ影響なし。Brexit以前と同じ短期留学・Student Visa制度。EU市民が利用するErasmusは終了、EU圏外への門戸はむしろ広がった印象。航空券・海外保険コストは安定、為替（GBP）の変動に注意。',
  },
];

export default async function UkLanguageSchoolPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ukExperiences = all.filter((e) => e.country?.id === 'united-kingdom');
  const mentions = countMentions(all, /(イギリス|UK|ロンドン|語学|Student Visa)/i);
  const sample = ukExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(イギリス|UK|ロンドン|語学|留学)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'イギリス語学留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'イギリス語学留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              イギリス語学留学完全ガイド｜Student Visa・主要校・費用・都市別特徴
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="イギリス語学留学を検討する方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              本場のイギリス英語＋歴史・文化体験＋欧州周遊の拠点を一気に手に入れられるイギリス語学留学。
              <br />
              この記事ではビザ取得、主要語学学校5校、費用、ロンドン/地方都市別の特徴、就労ルール、満足度UPのコツまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '1年総額510〜840万円、本場の英語＋欧州周遊拠点',
              '6ヶ月以内ならビザ不要、長期はStudent Visa',
              'ロンドン以外（ブライトン・マンチェスター）はコスパ最高',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜUK */}
          <section id="why-uk" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜイギリス語学留学なのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              イギリスは本場の英語発祥地、世界の英語基準を作る国。歴史的建造物・博物館・パブ文化等、ヨーロッパ文化の中心地でもあります。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・本場のクイーンズイングリッシュ習得</li>
              <li>・大英博物館・ナショナルギャラリー等の世界的文化施設</li>
              <li>・パブ文化・サッカー・伝統行事を本場体験</li>
              <li>・欧州周遊の拠点（Eurostar・LCCで安く）</li>
              <li>・IELTS・ケンブリッジ英検等の本拠地</li>
              <li>・治安良好、医療NHS制度あり</li>
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
                  <p className="text-xs text-gray-500 mb-1">都市: {s.cities}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="UK YMSビザ抽選も合わせて"
            description="ワーホリ的にイギリスで働きたい方向け、YMS抽選当選のコツを完全解説。"
            primaryHref="/uk-yms-visa-guide"
            primaryLabel="UK YMSビザ完全ガイド"
            secondaryHref="/uk-yms-lottery-tips"
            secondaryLabel="UK YMS抽選当選コツ"
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
                    <th className="border border-gray-200 px-3 py-2 text-left">合計（円換算）</th>
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

          {/* コツ */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">満足度を高める7つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SATISFY_TIPS.map((t, i) => (
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
                イギリス渡航者の体験談 <strong>n={ukExperiences.length}件</strong>。
                イギリス語学留学関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ ビザ・費用は2026年5月時点の情報です。最新情報は GOV.UK 公式情報、各学校公式サイトでご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/uk-yms-visa-guide" className="text-primary-600 hover:underline">→ UK YMSビザ完全ガイド</Link></li>
              <li><Link href="/uk-yms-lottery-tips" className="text-primary-600 hover:underline">→ UK YMS抽選当選コツ</Link></li>
              <li><Link href="/malta-study" className="text-primary-600 hover:underline">→ マルタ留学完全ガイド</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
              <li><Link href="/english-test-waiver" className="text-primary-600 hover:underline">→ IELTS/TOEFL免除条件</Link></li>
              <li><Link href="/countries/united-kingdom" className="text-primary-600 hover:underline">→ イギリス国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
