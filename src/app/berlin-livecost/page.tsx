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

const PAGE_PATH = '/berlin-livecost';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ベルリン生活費完全シミュレーション｜家賃・食費・交通｜月10万円生活術',
  description: 'ベルリンの月間生活費を「最低・標準・余裕」の3パターンで詳細シミュレーション。家賃・食費・交通・娯楽・税金まで。月10万円台のサバイバル術と賢い節約方法を完全公開。',
  path: PAGE_PATH,
  keywords: [
    'ベルリン 生活費',
    'ベルリン ワーホリ',
    'ドイツ 生活費',
    'ベルリン 家賃',
    'ベルリン 食費',
    'ドイツ ワーホリ 費用',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '月間生活費の全体像（3パターン）' },
  { id: 'rent', label: '家賃の実態とエリア相場' },
  { id: 'food', label: '食費を月3〜4万円に抑える方法' },
  { id: 'transport', label: '交通費・通信費の節約' },
  { id: 'entertainment', label: '娯楽・カフェ・夜遊び' },
  { id: 'tax-insurance', label: '税金・健康保険の必須コスト' },
  { id: 'saving-tips', label: '月10万円生活サバイバル術10選' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COST_PATTERNS = [
  {
    pattern: '最低（節約MAX）',
    rent: '€400 (シェア郊外)',
    food: '€150',
    transport: '€59 (Deutschlandticket)',
    other: '€100',
    total: '€709 / 約11万円',
    note: '自炊・公共交通のみ・娯楽控えめ',
  },
  {
    pattern: '標準（学生・WH一般）',
    rent: '€600 (シェア中心部)',
    food: '€250',
    transport: '€59 (Deutschlandticket)',
    other: '€250',
    total: '€1,159 / 約18万円',
    note: '週末外食2〜3回・基本娯楽あり',
  },
  {
    pattern: '余裕（社会人・夫婦）',
    rent: '€900 (1人暮らし)',
    food: '€400',
    transport: '€100 (Bike + 公共)',
    other: '€500',
    total: '€1,900 / 約30万円',
    note: '外食頻繁・旅行年数回・ジム会員',
  },
];

const RENT_AREAS = [
  { area: 'Mitte（中心部）', rent: '€700〜1,200', detail: '観光地・夜景良・若者多。家賃高め' },
  { area: 'Friedrichshain', rent: '€500〜800', detail: 'クラブ・カフェ多・若者の聖地。コスパ良' },
  { area: 'Kreuzberg', rent: '€600〜900', detail: 'トルコ系移民多・多文化。料理レベル高' },
  { area: 'Neukölln', rent: '€450〜700', detail: 'アーティスト・若者向け。再開発進行中' },
  { area: 'Charlottenburg', rent: '€800〜1,300', detail: '高級住宅街・落ち着いた雰囲気・年代上層' },
  { area: 'Wedding/Spandau', rent: '€350〜550', detail: '郊外、最安。通勤30〜45分' },
];

const FOOD_TIPS = [
  '主要スーパー（Aldi/Lidl/Penny/Netto）の比較利用',
  '週末のWochenmarkt（青空市場）で新鮮野菜を半額',
  'トルコ系のSpätkauf（夜営業の食料品店）は意外と安い',
  'メンザ（学生食堂）で€3〜5の昼食',
  'ケバブ（€4〜7）・ベーカリーパン（€1〜2）で安く済ます',
  '冷凍野菜・乾燥豆をストックして自炊頻度UP',
];

const TRANSPORT_INFO = [
  { item: 'Deutschlandticket（全国乗り放題）', cost: '月€59', detail: 'ベルリン市内＋ドイツ全国の地域電車乗り放題。コスパ最強' },
  { item: 'BVG Monatskarte（ベルリン市内のみ）', cost: '月€88', detail: 'Deutschlandticket登場で利用減' },
  { item: '自転車（中古購入）', cost: '€100〜300', detail: 'ベルリンは自転車インフラ充実、年中使える' },
  { item: 'Uber/Bolt', cost: '€8〜20/回', detail: '深夜・雨天時のみ利用、毎日使うとすぐ高くなる' },
];

const ENTERTAINMENT = [
  { item: 'カフェ（コーヒー）', cost: '€3〜5' },
  { item: '美術館（学割）', cost: '€4〜8' },
  { item: 'クラブ（土曜）', cost: '€15〜25（入場のみ）' },
  { item: 'ベルリンビール（バー）', cost: '€3〜5' },
  { item: 'シネマ（最新作）', cost: '€10〜13' },
  { item: 'ジム月会員（McFit等）', cost: '€20〜30' },
];

const TAX_INSURANCE = [
  { item: '健康保険（公的・学生向け）', cost: '月€110〜130', detail: 'TK等の公的保険。学生ビザ・WHビザ加入必須' },
  { item: '健康保険（民間・WH若年）', cost: '月€30〜80', detail: 'Care Concept・Mawistaなど。年齢・条件で変動' },
  { item: 'ARD/ZDFラジオテレビ料金（Rundfunkbeitrag）', cost: '月€18.36', detail: '世帯単位、シェアハウスは1人分でOK' },
  { item: '所得税（雇用時）', cost: '給与の14-45%', detail: '所得階級別、Klasse 1（独身）が標準' },
];

const SAVING_TIPS = [
  '家賃は迷わずシェアハウス（WG）、月€400-600で済ませる',
  'Deutschlandticket（€59/月）で交通費を固定化',
  'Aldi/Lidlで週末まとめ買い、自炊率80%以上',
  '中古自転車購入（€100〜300）で通勤交通費ゼロ',
  '美術館・博物館の学割（学生証は語学学校でも発行可）',
  'クラブは入場料無料の平日 or 早入場割引利用',
  '携帯はO2/Aldi Talkのプリペイドプラン（月€10〜15）',
  '電気・ガスはVerivox等で比較し最安契約に切替',
  'Vinted/eBay Kleinanzeigenで家具・服を中古調達',
  '無料イベント（公園BBQ・無料コンサート）を活用',
];

const FAQS = [
  {
    question: 'ベルリンで月10万円生活は本当に可能？',
    answer:
      '可能です。家賃€400（郊外シェア）＋食費€150（自炊中心）＋Deutschlandticket€59＋雑費€100で月€709（約11万円）に収まります。ただし娯楽・旅行はほぼゼロ、自炊率90%以上が前提。標準的な学生生活でも月€1,100〜1,300（17〜20万円）が現実的な数字です。',
  },
  {
    question: '家賃が高いと聞くけど、シェアハウスは見つかる？',
    answer:
      '近年ベルリンは家賃高騰中、見つけにくくなっています。WG-Gesucht（最大のシェア募集サイト）・eBay Kleinanzeigen・Facebook groupsで探すのが王道。「Deutsch + Englisch」可とアピール、ビデオ通話面接準備、内見時は「自己紹介15秒+質問3つ」で勝負。3〜4週間は探す覚悟を。',
  },
  {
    question: 'Deutschlandticketは本当に使える？',
    answer:
      '神制度。月€59でドイツ全国の地域電車（RE/RB）＋市内交通乗り放題。ベルリン市内のSバーン・Uバーン・バス・トラム全てOK。週末ドイツ国内旅行も実質無料に。ICE/IC等の長距離特急のみ別料金。ワーホリ・学生にとってコスト面の救世主です。',
  },
  {
    question: '英語だけで生活できる？',
    answer:
      '可能です。ベルリンは欧州随一の国際都市、ドイツ語ゼロでも生活OK。ただし役所手続き・銀行口座開設・賃貸契約はドイツ語必須の場面あり。日常生活ではほぼ英語通用、語学学校・カフェ・スーパーも英語OK。長期滞在ならドイツ語A1〜A2学習推奨。',
  },
  {
    question: '日本食材は手に入る？高い？',
    answer:
      '主要日本食材は入手可能ですが高い。お米€8/kg、醤油€5、味噌€8、納豆€4（パック3個）が相場。アジア食材店（GoAsia、Kafadu）、Amazon、ベルリン日本人会のオンラインショップが主な調達先。自炊レパートリーを和洋折衷にすると食費抑制できます。',
  },
];

export default async function BerlinLivecostPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const germanyExperiences = all.filter((e) => e.country?.id === 'germany');
  const mentions = countMentions(all, /(ベルリン|Berlin|ドイツ|Germany)/i);
  const sample = germanyExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(ベルリン|Berlin|ドイツ|Germany|家賃|生活費)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ベルリン生活費完全シミュレーション', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ベルリン生活費完全シミュレーション' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ベルリン生活費完全シミュレーション｜家賃・食費・交通｜月10万円生活術
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ドイツ・ベルリンでワーホリ/学生生活予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ベルリンは欧州主要都市の中で家賃が安く、文化・娯楽が豊富で若者に人気。一方で近年は家賃高騰で「以前ほど安くない」のも事実。
              <br />
              この記事では月10万円〜30万円までの3パターンの生活費シミュレーション、エリア別家賃相場、月10万円生活サバイバル術まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '月€709（約11万円）〜€1,900（約30万円）まで生活水準で大差',
              '家賃はシェアハウス€400-600が標準、Deutschlandticket€59で交通固定',
              '英語のみ生活可能だが、ドイツ語A1学習で行政・賃貸が楽に',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 全体像 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月間生活費の全体像（3パターン）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ライフスタイル別に3パターンを試算（1€=158円換算、2026年5月時点）。
            </p>
            <div className="space-y-3">
              {COST_PATTERNS.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{p.pattern}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-700 mb-2">
                    <p>家賃: {p.rent}</p>
                    <p>食費: {p.food}</p>
                    <p>交通: {p.transport}</p>
                    <p>その他: {p.other}</p>
                  </div>
                  <p className="text-base font-bold text-primary-700 mb-1">{p.total}</p>
                  <p className="text-xs text-gray-500">{p.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 家賃 */}
          <section id="rent" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">家賃の実態とエリア相場</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ベルリンはエリアにより家賃格差が大きい。シェアハウス（WG）で1部屋を借りるのが最も一般的です。
            </p>
            <div className="space-y-3">
              {RENT_AREAS.map((a, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{a.area}</p>
                    <p className="text-sm font-bold text-amber-700">{a.rent}/月</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{a.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 食費 */}
          <section id="food" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">食費を月3〜4万円に抑える方法</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {FOOD_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🛒</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="ドイツワーホリの全体ガイドも"
            description="ベルリン生活費以外にも、ドイツワーホリビザ・仕事探し・申請手順を網羅。"
            primaryHref="/germany-wh"
            primaryLabel="ドイツワーホリ完全ガイド"
            secondaryHref="/wh-saving-tips"
            secondaryLabel="ワーホリ節約術20選"
          />

          {/* 交通 */}
          <section id="transport" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">交通費・通信費の節約</h2>
            <div className="space-y-3">
              {TRANSPORT_INFO.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-sm text-primary-700">{t.item}</p>
                    <p className="text-sm font-bold text-amber-700">{t.cost}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{t.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 娯楽 */}
          <section id="entertainment" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">娯楽・カフェ・夜遊び</h2>
            <div className="grid grid-cols-2 gap-3">
              {ENTERTAINMENT.map((e, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                  <p className="font-bold text-sm mb-1 text-primary-700">{e.item}</p>
                  <p className="text-sm text-amber-700 font-bold">{e.cost}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 税金保険 */}
          <section id="tax-insurance" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">税金・健康保険の必須コスト</h2>
            <div className="space-y-3">
              {TAX_INSURANCE.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-sm text-primary-700">{t.item}</p>
                    <p className="text-sm font-bold text-rose-700">{t.cost}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{t.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 節約術 */}
          <section id="saving-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月10万円生活サバイバル術10選</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {SAVING_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">{i + 1}.</span>
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
                ドイツ渡航者の体験談 <strong>n={germanyExperiences.length}件</strong>。
                ベルリン・ドイツ関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 物価・家賃・保険料は2026年5月時点の情報です。為替変動・市場変動により大きく変動する可能性があります。最新情報は現地公式情報をご参照ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/countries/germany/working-holiday" className="text-primary-600 hover:underline">→ ドイツワーホリ完全ガイド</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術20選</Link></li>
              <li><Link href="/housing-comparison" className="text-primary-600 hover:underline">→ 住居タイプ比較</Link></li>
              <li><Link href="/wh-connections" className="text-primary-600 hover:underline">→ ワーホリでの出会い</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金ガイド</Link></li>
              <li><Link href="/countries/germany" className="text-primary-600 hover:underline">→ ドイツ国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
