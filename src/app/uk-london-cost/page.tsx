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

const PAGE_PATH = '/uk-london-cost';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ロンドン生活費完全シミュレーション｜Zone別家賃・地下鉄・節約術',
  description: 'ロンドンの月間生活費を「節約・標準・余裕」3パターンで詳細シミュレーション。Zone別家賃・食費・地下鉄・カフェ文化・物価高対策まで。月20-50万円実例。',
  path: PAGE_PATH,
  keywords: [
    'ロンドン 生活費',
    'ロンドン 家賃',
    'ロンドン 物価',
    'UK 生活費',
    'ロンドン ワーホリ',
    'ロンドン 留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '月間生活費の全体像（3パターン）' },
  { id: 'rent-by-zone', label: 'Zone別家賃相場（Zone 1-6）' },
  { id: 'food', label: '食費を月£250に抑える方法' },
  { id: 'tube-bus', label: '地下鉄・バス費用' },
  { id: 'entertainment', label: 'カフェ・パブ・娯楽' },
  { id: 'hidden-cost', label: '見落としがちな隠れコスト' },
  { id: 'saving-tips', label: '月£1,500生活サバイバル術12選' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COST_PATTERNS = [
  {
    pattern: '節約（最低）',
    rent: '£800（Zone 3-4シェア）',
    food: '£250',
    transport: '£180（Zone 1-3）',
    other: '£170',
    total: '£1,400 / 約26万円',
    note: '自炊メイン・地下鉄のみ・娯楽控えめ',
  },
  {
    pattern: '標準（学生・WH）',
    rent: '£1,000（Zone 2シェア）',
    food: '£400',
    transport: '£180',
    other: '£420',
    total: '£2,000 / 約37万円',
    note: '週末外食2-3回・パブ・娯楽あり',
  },
  {
    pattern: '余裕（社会人）',
    rent: '£1,800（Zone 1個室）',
    food: '£600',
    transport: '£250（UberとPair）',
    other: '£800',
    total: '£3,450 / 約64万円',
    note: '外食頻繁・ミュージカル・旅行',
  },
];

const RENT_BY_ZONE = [
  { zone: 'Zone 1（中心部）', area: 'Westminster、Camden、Soho等', rent: '£1,200〜2,500', detail: '観光地・職場アクセス◎、最高家賃' },
  { zone: 'Zone 2', area: 'Hackney、Wandsworth、Greenwich等', rent: '£900〜1,500', detail: '若者人気・コスパ良' },
  { zone: 'Zone 3', area: 'Wimbledon、Tooting等', rent: '£700〜1,200', detail: '通勤30分以内、家族向け' },
  { zone: 'Zone 4-5', area: 'Croydon、Wembley等', rent: '£600〜1,000', detail: '通勤45分、家賃手頃' },
  { zone: 'Zone 6（郊外）', area: 'Heathrow周辺等', rent: '£500〜900', detail: '通勤1時間、最安' },
];

const FOOD_TIPS = [
  '主要スーパー（Tesco/Sainsbury\'s/Aldi/Lidl）を比較利用',
  'Borough Market・Camden Marketで新鮮・特別な食材',
  'Pret A MangerやEat等で昼食£5-8',
  'ケバブ・カレー（イギリス国民食）で安く外食£8-12',
  'パブのSunday Roast（£12-18）は週末の定番',
  'Tesco Meal Deal（£4で軽食一式）は神制度',
];

const TUBE_BUS_INFO = [
  { item: 'Oyster Card', cost: '£7デポジット', detail: 'プリペイドICカード、必須' },
  { item: '月パス（Zone 1-2）', cost: '£163.20', detail: 'Zone 1-2圏内乗り放題、Tube/Bus' },
  { item: '月パス（Zone 1-3）', cost: '£192.10', detail: '中心部＋郊外まで' },
  { item: 'バス1回', cost: '£1.75', detail: '1時間以内乗換無料（Hopper fare）' },
  { item: '自転車（Santander Cycles）', cost: '£35.40/月', detail: '30分以内無制限' },
];

const ENTERTAINMENT = [
  { item: 'コーヒー（Pret等）', cost: '£3-5' },
  { item: '美術館（National Gallery等）', cost: '£0（無料）' },
  { item: 'ミュージカル（学割）', cost: '£25-50' },
  { item: 'パブ（パイント）', cost: '£5-7' },
  { item: 'シネマ', cost: '£12-18' },
  { item: 'クラブ', cost: '£15-25' },
];

const HIDDEN_COSTS = [
  'Council Tax（住民税相当）：シェアに含まれることが多いが、確認必須（月£100-200）',
  'TV License（BBC視聴料）：£169.50/年、シェアに含むこと多',
  'Council Water bill：月£20-40',
  '電気・ガス：冬月£100-150、夏月£50-80',
  'Internet（個別契約）：月£25-40',
  'Phone（プリペイド）：月£10-20',
];

const SAVING_TIPS = [
  '家賃はZone 3-4シェア、月£800-1,000で済ます',
  'Oyster月パス購入（£163-192）で交通固定',
  'Aldi/Lidlで週末まとめ買い、自炊率80%',
  '美術館はほぼ全て無料（British Museum、Tate等）',
  'ミュージカルは当日割引（£25-40）でロンドンらしさ',
  'パブのHappy Hour（午後4-7時）活用',
  'Tesco Meal Deal（£4）で平日昼食',
  '無料Wi-Fi（カフェ・地下鉄駅）活用',
  'クラブは平日 or 早入場でクーポン獲得',
  'Santander Cycles（自転車）で4-10月の交通費削減',
  '中古品はGumtree・Vintedで安く調達',
  'NHS GP登録で病院無料（IHS払い済みなら）',
];

const FAQS = [
  {
    question: 'ロンドンで月20万円生活は本当に可能？',
    answer:
      '可能だがタイト。Zone 3-4シェア家賃£800＋自炊食費£250＋交通£180＋雑費£170で月£1,400（約26万円）が現実的下限。Zone 1中心部生活なら最低£1,800-2,000必要。「住む場所」が生活費の8割を決める都市です。',
  },
  {
    question: 'Zone 1とZone 3-4どっち選ぶ？',
    answer:
      'コスト重視ならZone 3-4、便利重視ならZone 2。Zone 1は通勤超便利だが家賃£1,200以上。Zone 2はバランス良、Zone 3-4は通勤30-45分だが家賃半額。最初の数ヶ月はZone 2で慣れて、長期は予算次第で再検討。',
  },
  {
    question: 'ロンドンの食費は高い？',
    answer:
      'スーパー食材は東京と同等、外食は東京の1.5-2倍。Tesco/Sainsburys等の自炊なら週£40-60、外食週2回でも月£400以内に収まる。一方Pret A Manger等のチェーンは安め、Tesco Meal Deal（£4）は神。Sunday Roast（£12-18）は週末の楽しみに。',
  },
  {
    question: '見落としやすい隠れコストは？',
    answer:
      'Council Tax（月£100-200）・TV License（年£169.50）・電気/ガス代（冬月£100-150）・水道代（月£20-40）。シェアハウス契約時に「Bills Included」「Council Tax含む」かを必ず確認。「家賃£700」が実は「+ £200-300」になるケース多。',
  },
  {
    question: 'WHV/学生ビザでアルバイトできる？',
    answer:
      'YMS（WHV）保持者は週40時間就労可、Student Visaは週20時間。最低時給£11.44/時間、ロンドンの観光業・接客は£12-18が一般的。日本食レストラン（Wagamama、ラーメン店等）は日本人歓迎、即採用も。月給£1,500-2,500で生活費補填可能。',
  },
];

export default async function UkLondonCostPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ukExperiences = all.filter((e) => e.country?.id === 'united-kingdom');
  const mentions = countMentions(all, /(ロンドン|London|UK|イギリス|生活費|家賃)/i);
  const sample = ukExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(ロンドン|London|UK|イギリス|生活費|家賃)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ロンドン生活費完全シミュレーション', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ロンドン生活費完全シミュレーション' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ロンドン生活費完全シミュレーション｜Zone別家賃・地下鉄・節約術
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ロンドンでYMS・留学・短期滞在予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              世界の中心都市ロンドンは物価高で有名ですが、Zone選び＋自炊＋節約術で月26万円から生活可能。
              <br />
              この記事ではZone別家賃、月3パターン生活費、地下鉄費用、隠れコスト、節約術12選まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '月£1,400（約26万円）〜£3,450（約64万円）まで Zone と生活水準で大差',
              'Zone 1家賃£1,200以上、Zone 3-4なら£800で済む',
              'Council Tax等の隠れコストに注意、契約時に確認必須',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 全体像 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月間生活費の全体像（3パターン）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ライフスタイル別に3パターンを試算（1£=185円換算、2026年5月時点）。
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

          {/* Zone家賃 */}
          <section id="rent-by-zone" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Zone別家賃相場（Zone 1-6）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ロンドンは中心からZone 1-6に分かれ、家賃と通勤時間が反比例。
            </p>
            <div className="space-y-3">
              {RENT_BY_ZONE.map((z, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{z.zone}</p>
                    <p className="text-sm font-bold text-amber-700">{z.rent}/月</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">エリア例: {z.area}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{z.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 食費 */}
          <section id="food" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">食費を月£250に抑える方法</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {FOOD_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🍴</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="UK YMS・語学留学も合わせて"
            description="YMS抽選当選コツ・UK語学学校・欧州周遊と組み合わせて計画を。"
            primaryHref="/uk-yms-visa-guide"
            primaryLabel="UK YMSビザ完全ガイド"
            secondaryHref="/europe-budget-travel"
            secondaryLabel="欧州周遊予算術"
          />

          {/* 地下鉄 */}
          <section id="tube-bus" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">地下鉄・バス費用</h2>
            <div className="space-y-3">
              {TUBE_BUS_INFO.map((t, i) => (
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
            <h2 className="text-xl sm:text-2xl font-bold mb-3">カフェ・パブ・娯楽</h2>
            <div className="grid grid-cols-2 gap-3">
              {ENTERTAINMENT.map((e, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                  <p className="font-bold text-sm mb-1 text-primary-700">{e.item}</p>
                  <p className="text-sm text-amber-700 font-bold">{e.cost}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 大英博物館・ナショナルギャラリー等の主要美術館はほぼ全て無料、ロンドンの特権！
            </p>
          </section>

          {/* 隠れコスト */}
          <section id="hidden-cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">見落としがちな隠れコスト</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {HIDDEN_COSTS.map((h, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">💸</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 節約 */}
          <section id="saving-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月£1,500生活サバイバル術12選</h2>
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
                UK渡航者の体験談 <strong>n={ukExperiences.length}件</strong>。
                ロンドン・UK・生活費関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 物価・家賃・為替は2026年5月時点の情報です。為替変動・市場変動に注意。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/uk-yms-visa-guide" className="text-primary-600 hover:underline">→ UK YMSビザ完全ガイド</Link></li>
              <li><Link href="/uk-yms-lottery-tips" className="text-primary-600 hover:underline">→ UK YMS抽選当選コツ</Link></li>
              <li><Link href="/uk-language-school" className="text-primary-600 hover:underline">→ UK語学留学</Link></li>
              <li><Link href="/europe-budget-travel" className="text-primary-600 hover:underline">→ 欧州周遊予算術</Link></li>
              <li><Link href="/au-vs-uk" className="text-primary-600 hover:underline">→ 豪vs英比較</Link></li>
              <li><Link href="/countries/united-kingdom" className="text-primary-600 hover:underline">→ イギリス国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
