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

const PAGE_PATH = '/toronto-livecost';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'トロント生活費完全シミュレーション｜家賃・食費・交通｜月15万円〜35万円',
  description: 'トロントの月間生活費を「節約・標準・余裕」3パターンで詳細シミュレーション。家賃・食費・交通・娯楽・税金まで。月15万円台のサバイバル術と賢い節約方法を完全公開。',
  path: PAGE_PATH,
  keywords: [
    'トロント 生活費',
    'トロント 家賃',
    'カナダ 生活費',
    'トロント 食費',
    'トロント ワーホリ',
    'トロント 留学 費用',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '月間生活費の全体像（3パターン）' },
  { id: 'rent', label: '家賃の実態とエリア相場' },
  { id: 'food', label: '食費を月CAD 350に抑える方法' },
  { id: 'transport', label: '交通費・TTCの活用' },
  { id: 'entertainment', label: '娯楽・カフェ・夜遊び' },
  { id: 'climate-cost', label: '冬の光熱費・防寒コスト' },
  { id: 'saving-tips', label: '月CAD 1,500生活サバイバル術10選' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COST_PATTERNS = [
  {
    pattern: '節約（最低）',
    rent: 'CAD 700（シェア郊外）',
    food: 'CAD 300',
    transport: 'CAD 130（TTC月パス）',
    other: 'CAD 200',
    total: 'CAD 1,330 / 約15万円',
    note: '自炊・公共交通のみ・娯楽控えめ',
  },
  {
    pattern: '標準（学生・WH）',
    rent: 'CAD 1,000（シェア中心部）',
    food: 'CAD 450',
    transport: 'CAD 130',
    other: 'CAD 400',
    total: 'CAD 1,980 / 約22万円',
    note: '週末外食2-3回・娯楽あり',
  },
  {
    pattern: '余裕（社会人）',
    rent: 'CAD 1,800（1人暮らし）',
    food: 'CAD 700',
    transport: 'CAD 200（Uber併用）',
    other: 'CAD 800',
    total: 'CAD 3,500 / 約38万円',
    note: '外食頻繁・旅行・ジム会員',
  },
];

const RENT_AREAS = [
  { area: 'Downtown（中心部）', rent: 'CAD 1,200〜2,000', detail: '観光地・夜景良・通勤便利。家賃高め' },
  { area: 'Yorkville', rent: 'CAD 1,500〜2,500', detail: '高級住宅街、ショッピング街。最高級' },
  { area: 'Annex', rent: 'CAD 900〜1,400', detail: 'トロント大学近、若者多、コスパ良' },
  { area: 'Chinatown / Kensington', rent: 'CAD 800〜1,200', detail: '多文化・カジュアル、家賃手頃' },
  { area: 'Etobicoke', rent: 'CAD 700〜1,100', detail: '西部郊外、通勤30-45分。家族向け' },
  { area: 'Scarborough', rent: 'CAD 600〜1,000', detail: '東部郊外、最安。アジア系コミュニティ多' },
];

const FOOD_TIPS = [
  '主要スーパー（No Frills、Food Basics、Loblaws）の比較利用',
  'Chinatownのアジア系スーパー（T&T）で安く新鮮野菜・米',
  'St. Lawrence Market等の市場で新鮮食材',
  'Tim Hortonsで朝食コーヒー＋ベーグル（CAD 5-7）',
  '中華・ベトナム・タイ料理で安く外食（CAD 12-18）',
  'メキシカン・ピザでテイクアウト（CAD 10-15）',
];

const TRANSPORT_INFO = [
  { item: 'TTC（公共交通）月パス', cost: 'CAD 156.00', detail: '地下鉄・バス・路面電車乗り放題。学生CAD 130' },
  { item: 'プレスト・カード', cost: 'CAD 3.30/回', detail: '1回乗車料金、2時間以内なら乗換無料' },
  { item: '自転車（Bike Share）', cost: 'CAD 105/年', detail: '30分以内無制限、暖かい季節向け' },
  { item: 'Uber/Lyft', cost: 'CAD 10〜25/回', detail: '深夜・雨天時のみ利用、毎日使うと高い' },
];

const ENTERTAINMENT = [
  { item: 'スターバックス', cost: 'CAD 4-6' },
  { item: '美術館（ROM学割）', cost: 'CAD 15-25' },
  { item: 'クラブ（土曜）', cost: 'CAD 15-30' },
  { item: 'クラフトビール（バー）', cost: 'CAD 8-12' },
  { item: 'シネマ', cost: 'CAD 13-18' },
  { item: 'ジム（GoodLife等）', cost: 'CAD 30-50' },
];

const CLIMATE_COST = [
  '冬の光熱費：月CAD 80〜150（電気＋暖房）、夏は半分',
  'ダウンジャケット：CAD 200〜500（必須、安物はNG）',
  '冬靴：CAD 100〜300（滑り止め＆防水必須）',
  '手袋・帽子・マフラー：CAD 50〜100',
  '冬期は外食減・配達増、Uber Eats月CAD 100〜200増',
];

const SAVING_TIPS = [
  '家賃は迷わずシェアハウス、Downtown外で月CAD 700-1,000',
  'TTC月パス（CAD 156）で交通費固定化',
  'No Frillsで週末まとめ買い、自炊率80%以上',
  'Bike Shareで暖かい季節は交通費ゼロ',
  '美術館の無料デー活用（ROMは月最初の水曜）',
  'クラブ・バーは平日割引利用',
  '携帯はFido/Public Mobileの月CAD 30プラン',
  '冬服は10月の早割セール購入',
  '中古品はFacebook Marketplace活用',
  '無料イベント（Harbourfront・無料コンサート）活用',
];

const FAQS = [
  {
    question: 'トロントで月15万円生活は可能？',
    answer:
      '可能です。家賃CAD 700（郊外シェア）＋食費CAD 300（自炊中心）＋TTC CAD 130＋雑費CAD 200で月CAD 1,330（約15万円）。ただし娯楽・旅行ほぼゼロ、自炊率90%以上が前提。標準的な学生生活でも月CAD 1,800〜2,000（20〜23万円）が現実的。',
  },
  {
    question: 'バンクーバーと比べてどっち高い？',
    answer:
      'ほぼ同等、わずかにバンクーバーの方が家賃高い傾向。Downtownの1ベッドルームでバンクーバーCAD 2,200、トロントCAD 1,900。食費・交通費はほぼ同じ。冬の暖房費はトロントの方が高い。',
  },
  {
    question: 'シェアハウスは見つかりやすい？',
    answer:
      '探しやすい。Facebook groups（Toronto Roommates）、Kijiji、Craigslistで毎日新しい募集が出ます。ただし冬（特に1-3月）は供給少、9-10月の新学期前後は争奪戦。理想は3-4週間の探し期間を確保。',
  },
  {
    question: '冬の防寒コストは？',
    answer:
      '初期投資CAD 400〜800（ダウン＋冬靴＋小物）、毎月の光熱費が夏より2倍。CanadaGooseは$1,000超だが、Uniqlo・Old Navyで安く揃えることも可能。中古ダウンを9月のFacebook MarketplaceでCAD 100-200で買うのがコスパ最強。',
  },
  {
    question: '日本食材は手に入る？高い？',
    answer:
      '入手可能、ただし価格はバンクーバーより1.5倍程度。J-Town、Sanko Japanese、T&T Supermarketで主要食材入手可。米CAD 30/10kg、味噌CAD 12、納豆CAD 5（3パック）が相場。',
  },
];

export default async function TorontoLivecostPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const torontoExperiences = all.filter((e) =>
    e.country?.id === 'canada' && /トロント|Toronto/i.test(e.cityPrimary ?? '')
  );
  const mentions = countMentions(all, /(トロント|Toronto|カナダ|生活費|家賃)/i);
  const sample = torontoExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(トロント|Toronto|カナダ|生活費|家賃)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'トロント生活費完全シミュレーション', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'トロント生活費完全シミュレーション' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              トロント生活費完全シミュレーション｜家賃・食費・交通｜月15万円〜35万円
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="トロントでワーホリ・留学・生活予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              カナダ最大都市トロントは、ワーホリ・留学・移住先としてバンクーバーと並ぶ人気。家賃は近年高騰中ですが、英語環境＋多文化＋仕事機会で根強い人気。
              <br />
              この記事では月15万円〜35万円までの3パターンの生活費シミュレーション、エリア別家賃相場、冬期コスト、節約術まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '月CAD 1,330（約15万円）〜CAD 3,500（約38万円）まで生活水準で大差',
              '家賃はシェアハウスCAD 700-1,000が標準、TTC月パスCAD 156',
              '冬の防寒コスト初期投資CAD 400-800、月光熱費2倍',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 全体像 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月間生活費の全体像（3パターン）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ライフスタイル別に3パターンを試算（1CAD=110円換算、2026年5月時点）。
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
              トロントは近年家賃高騰中。シェアハウスで1部屋を借りるのが最も一般的です。
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
            <h2 className="text-xl sm:text-2xl font-bold mb-3">食費を月CAD 350に抑える方法</h2>
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
            title="トロントvsバンクーバー比較も合わせて"
            description="カナダ2大都市の生活費・気候・仕事を徹底比較。あなたに合うのはどっち？"
            primaryHref="/toronto-vs-vancouver"
            primaryLabel="トロントvsバンクーバー"
            secondaryHref="/canada-iec-visa"
            secondaryLabel="カナダIECビザ"
          />

          {/* 交通 */}
          <section id="transport" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">交通費・TTCの活用</h2>
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

          {/* 冬コスト */}
          <section id="climate-cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">冬の光熱費・防寒コスト</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {CLIMATE_COST.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">❄️</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 節約術 */}
          <section id="saving-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月CAD 1,500生活サバイバル術10選</h2>
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
                トロント渡航者の体験談 <strong>n={torontoExperiences.length}件</strong>。
                トロント・カナダ生活費関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 物価・家賃・為替は2026年5月時点の情報です。市場変動により大きく変動する可能性があります。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/toronto-vs-vancouver" className="text-primary-600 hover:underline">→ トロントvsバンクーバー</Link></li>
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ</Link></li>
              <li><Link href="/canada-sim-card" className="text-primary-600 hover:underline">→ カナダSIMカード</Link></li>
              <li><Link href="/canada-tax-return" className="text-primary-600 hover:underline">→ カナダTax Return</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術</Link></li>
              <li><Link href="/countries/canada" className="text-primary-600 hover:underline">→ カナダ国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
