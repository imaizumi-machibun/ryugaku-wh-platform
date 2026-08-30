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

const PAGE_PATH = '/sydney-livecost';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'シドニー生活費完全シミュレーション｜家賃・食費・Opal Card｜月25-50万円',
  description: 'シドニーの月間生活費を「節約・標準・余裕」3パターンで詳細シミュレーション。家賃・食費・Opal Card・Bondi/Manlyエリア・物価高対策まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'シドニー 生活費',
    'シドニー 家賃',
    'シドニー 食費',
    'シドニー ワーホリ',
    'シドニー 留学 費用',
    'オーストラリア 生活費',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '月間生活費の全体像（3パターン）' },
  { id: 'rent', label: '家賃の実態とエリア相場' },
  { id: 'food', label: '食費を月AUD 500に抑える方法' },
  { id: 'transport', label: 'Opal Card・交通費' },
  { id: 'entertainment', label: '娯楽・ビーチ・夜遊び' },
  { id: 'japanese-food', label: '日本食材店マップ' },
  { id: 'saving-tips', label: '月AUD 2,500生活サバイバル術10選' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COST_PATTERNS = [
  {
    pattern: '節約（最低）',
    rent: 'AUD 1,000（郊外シェア）',
    food: 'AUD 400',
    transport: 'AUD 180（Opal Card）',
    other: 'AUD 250',
    total: 'AUD 1,830 / 約20万円',
    note: '自炊メイン・公共交通のみ・娯楽控えめ',
  },
  {
    pattern: '標準（学生・WH）',
    rent: 'AUD 1,400（中心部シェア）',
    food: 'AUD 550',
    transport: 'AUD 180',
    other: 'AUD 500',
    total: 'AUD 2,630 / 約29万円',
    note: '週末外食2-3回・娯楽あり',
  },
  {
    pattern: '余裕（社会人）',
    rent: 'AUD 2,500（1人暮らしBondi近郊）',
    food: 'AUD 800',
    transport: 'AUD 250',
    other: 'AUD 900',
    total: 'AUD 4,450 / 約49万円',
    note: '外食頻繁・旅行・ジム会員',
  },
];

const RENT_AREAS = [
  { area: 'CBD（中心部）', rent: 'AUD 1,500〜2,500', detail: 'オフィス街、通勤便利、家賃最高' },
  { area: 'Bondi/Coogee（東部ビーチ）', rent: 'AUD 1,300〜2,200', detail: 'ビーチアクセス神、若者人気' },
  { area: 'Surry Hills/Newtown', rent: 'AUD 1,200〜1,800', detail: 'カフェ・若者文化、ヒップエリア' },
  { area: 'Manly（北部ビーチ）', rent: 'AUD 1,200〜2,000', detail: 'フェリー通勤、家族向け' },
  { area: 'Inner West（Marrickville等）', rent: 'AUD 900〜1,400', detail: '多文化・グルメ、コスパ良' },
  { area: 'Parramatta（西部）', rent: 'AUD 700〜1,200', detail: '通勤30-45分、家賃手頃' },
];

const FOOD_TIPS = [
  '主要スーパー（Coles、Woolworths、Aldi）を比較利用',
  'Asian Grocery（Eastwood、Chatswood等）で安い米・野菜',
  '伝統市場（Paddy\'s Markets、Sydney Fish Market）で新鮮食材',
  'パブの平日$10ランチ・$15ステーキ',
  '中華・ベトナム・タイ料理でAUD 12-18',
  'Coles Meal Deal（AUD 4-6）で平日昼食',
];

const TRANSPORT_INFO = [
  { item: 'Opal Card', cost: 'デポジット無料', detail: 'プリペイドICカード、必須' },
  { item: '週上限額', cost: 'AUD 50', detail: '週8回乗車後は無料' },
  { item: '日曜上限', cost: 'AUD 2.80/日', detail: '日曜は1日乗り放題AUD 2.80のみ' },
  { item: 'Train + Bus', cost: '1回AUD 2.50-7.00', detail: '距離別、ピーク時のみ料金高' },
  { item: 'Ferry（Manly→Circular Quay）', cost: 'AUD 9.30', detail: '観光感覚で通勤、絶景' },
];

const ENTERTAINMENT = [
  { item: 'コーヒー', cost: 'AUD 4-6' },
  { item: '美術館（Art Gallery NSW）', cost: 'AUD 0（無料）' },
  { item: 'ビーチ（Bondi）', cost: 'AUD 0（無料）' },
  { item: 'パブ（パイント）', cost: 'AUD 10-15' },
  { item: 'シネマ', cost: 'AUD 18-25' },
  { item: 'ジム（Anytime等）', cost: 'AUD 60-80/月' },
];

const JAPANESE_STORES = [
  { name: 'Tokyo Mart', location: 'Northbridge', detail: 'シドニー最大級日本食材店' },
  { name: 'Maruya', location: 'Crows Nest等4店舗', detail: '老舗、寿司ネタ・刺身も購入可' },
  { name: 'Daiso（ダイソー）', location: 'World Square等', detail: '日本の100円ショップ、AUD 2.80均一' },
  { name: 'Pacific Yong Sang', location: 'Eastwood', detail: 'アジア系大型スーパー、日本食材コーナーあり' },
];

const SAVING_TIPS = [
  '家賃はInner Westシェア（AUD 900-1,400）でコスパ重視',
  'Opal Card週上限AUD 50で交通固定',
  'Aldi/Asian Groceryで週末まとめ買い、自炊率80%',
  '無料ビーチ（Bondi/Manly）を最大限活用',
  '美術館・Botanic Gardens無料、Tate等の特別展のみ有料',
  'パブのHappy Hour（午後4-7時）活用',
  '日曜のOpal上限AUD 2.80を使った日帰り旅',
  '携帯はBoost Mobile/Belong等の安いプラン',
  '中古品はFacebook Marketplace、Gumtree',
  '無料イベント（Vivid Sydney、Australia Day等）活用',
];

const FAQS = [
  {
    question: 'シドニーで月20万円生活は可能？',
    answer:
      '可能、ただしタイト。家賃AUD 1,000（郊外シェア）＋食費AUD 400＋Opal AUD 180＋雑費AUD 250で月AUD 1,830（約20万円）。Inner West・Parramatta等の郊外シェア＋自炊80%が前提。CBD・Bondi近郊は家賃高、月30-35万円が現実的。',
  },
  {
    question: 'メルボルンと比べてどっち高い？',
    answer:
      'シドニーが圧倒的に高い。家賃は約15-20%高、特にCBD・Bondi近郊は世界トップクラスの家賃。一方シドニーはビーチ・観光地アクセス◎・国際的雰囲気が圧倒。「コスパ重視ならメルボルン、ビーチ＆都市生活ならシドニー」。',
  },
  {
    question: 'シェアハウス見つかりやすい？',
    answer:
      '探しやすいが競争激しい。Facebook groups（Sydney Share Accommodation）、Flatmates.com.au、Gumtreeで毎日新しい募集。CBD・Bondi近郊のシェア部屋はAUD 350-500/週、人気物件は1-2日で決まる。3-4週間の探し期間確保＋複数内見が鉄則。',
  },
  {
    question: 'Opal Cardは本当に便利？',
    answer:
      '神制度。週上限AUD 50（8回乗車後無料）、日曜AUD 2.80（1日乗り放題）、複数交通機関共通。Train・Bus・Light Rail・Ferry全て使える。海外でこのレベルのプリペイドICカード持つ都市は珍しい、シドニー生活の必需品。',
  },
  {
    question: '日本食材は手に入る？',
    answer:
      '入手可能。Tokyo Mart（Northbridge）、Maruya（Crows Nest等）、Daiso、Pacific Yong Sang（Eastwood）等で主要食材揃う。価格は日本の1.5-2倍。Daisoの存在は他都市と差別化、生活用品の節約に大助かり。',
  },
];

export default async function SydneyLivecostPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const sydExperiences = all.filter((e) =>
    e.country?.id === 'australia' && /シドニー|Sydney/i.test(e.cityPrimary ?? '')
  );
  const mentions = countMentions(all, /(シドニー|Sydney|オーストラリア|生活費|家賃)/i);
  const sample = sydExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(シドニー|Sydney|オーストラリア|生活費|家賃)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'シドニー生活費完全シミュレーション', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'シドニー生活費完全シミュレーション' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              シドニー生活費完全シミュレーション｜家賃・食費・Opal Card｜月20-49万円
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="シドニーでワーホリ・留学・生活予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              オーストラリア最大都市シドニーは、ビーチ＋国際的雰囲気＋多文化で世界の住みやすい都市常連。一方で家賃高騰中、世界トップクラスのコスト都市でもあります。
              <br />
              この記事では月20万円〜49万円までの3パターンの生活費、エリア別家賃、Opal Card活用、節約術まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '月AUD 1,830（約20万円）〜AUD 4,450（約49万円）まで生活水準で大差',
              '家賃はシェアハウスAUD 900-1,400、Opal Card週上限AUD 50',
              'Bondi/Manlyのビーチアクセス無料、都市＋海の両立',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 全体像 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月間生活費の全体像（3パターン）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ライフスタイル別に3パターンを試算（1AUD=100円換算、2026年5月時点）。
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
            <h2 className="text-xl sm:text-2xl font-bold mb-3">食費を月AUD 500に抑える方法</h2>
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
            title="シドニーシェアハウス・メルボルン比較も合わせて"
            description="シェアハウス探し方の詳細、メルボルンとの比較も確認を。"
            primaryHref="/sydney-sharehouse"
            primaryLabel="シドニーシェアハウス"
            secondaryHref="/sydney-vs-melbourne"
            secondaryLabel="シドニーvsメルボルン"
          />

          {/* 交通 */}
          <section id="transport" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Opal Card・交通費</h2>
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
            <h2 className="text-xl sm:text-2xl font-bold mb-3">娯楽・ビーチ・夜遊び</h2>
            <div className="grid grid-cols-2 gap-3">
              {ENTERTAINMENT.map((e, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                  <p className="font-bold text-sm mb-1 text-primary-700">{e.item}</p>
                  <p className="text-sm text-amber-700 font-bold">{e.cost}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ Bondi/Manlyのビーチアクセス無料！世界一安い贅沢。
            </p>
          </section>

          {/* 日本食材 */}
          <section id="japanese-food" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">日本食材店マップ</h2>
            <div className="space-y-3">
              {JAPANESE_STORES.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{s.name}</p>
                  <p className="text-xs text-gray-500 mb-1">📍 {s.location}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 節約 */}
          <section id="saving-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月AUD 2,500生活サバイバル術10選</h2>
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
                シドニー渡航者の体験談 <strong>n={sydExperiences.length}件</strong>。
                シドニー・生活費関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 物価・家賃・為替は2026年5月時点の情報です。市場変動により大きく変動します。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/sydney-sharehouse" className="text-primary-600 hover:underline">→ シドニーシェアハウス</Link></li>
              <li><Link href="/sydney-vs-melbourne" className="text-primary-600 hover:underline">→ シドニーvsメルボルン</Link></li>
              <li><Link href="/australia-jobs" className="text-primary-600 hover:underline">→ オーストラリア仕事</Link></li>
              <li><Link href="/australia-tfn-guide" className="text-primary-600 hover:underline">→ 豪TFN取得</Link></li>
              <li><Link href="/au-second-year-visa" className="text-primary-600 hover:underline">→ 豪WHセカンドビザ</Link></li>
              <li><Link href="/countries/australia" className="text-primary-600 hover:underline">→ オーストラリア国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
