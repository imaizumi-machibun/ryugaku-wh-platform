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

const PAGE_PATH = '/europe-budget-travel';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ・留学中の欧州周遊予算術｜LCC/夜行バス/Eurail・ホステル節約',
  description: '英・独・愛などのワーホリ・留学拠点から欧州周遊する完全予算術。LCC/夜行バス/Eurail Pass比較、ホステル予算、おすすめ周遊ルート、1ヶ月15万円の節約ハック。',
  path: PAGE_PATH,
  keywords: [
    '欧州 周遊 予算',
    'ヨーロッパ 旅行 安く',
    'Eurail Pass',
    'LCC 欧州',
    '欧州 ホステル',
    'ワーホリ 欧州 旅行',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-europe', label: '欧州拠点なら周遊は必須' },
  { id: 'transport', label: '移動手段比較（LCC/バス/Eurail）' },
  { id: 'accommodation', label: '宿泊（ホステル/Airbnb）' },
  { id: 'food', label: '食費を1日€20に抑える' },
  { id: 'recommended-routes', label: 'おすすめ周遊ルート3パターン' },
  { id: 'cost-simulation', label: '予算シミュレーション（1週間/2週間/1ヶ月）' },
  { id: 'saving-hacks', label: '節約ハック15選' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TRANSPORT_COMPARE = [
  {
    type: 'LCC（Ryanair/EasyJet/Wizz Air等）',
    cost: '片道€10-50（早割）',
    speed: '速い（1-3時間）',
    detail: '早割2-3ヶ月前購入で激安、ただし機内手荷物のみ・空港遠い',
    best: '長距離（500km超）の移動',
  },
  {
    type: '夜行バス（Flixbus等）',
    cost: '片道€10-30',
    speed: '遅い（6-12時間）',
    detail: 'ホテル代も浮く、若者に人気、コスパ最強',
    best: '中距離（300-700km）＋宿泊節約',
  },
  {
    type: 'Eurail Pass（鉄道周遊）',
    cost: '€280-590（1ヶ月）',
    speed: '中速（2-6時間）',
    detail: 'Pass購入で乗り放題、座席指定別途、駅近便利',
    best: '6国以上周遊・鉄道の旅好き',
  },
  {
    type: 'BlaBlaCar（相乗り）',
    cost: '片道€10-30',
    speed: '速い（2-4時間）',
    detail: 'ドライバーの車に相乗り、英語＋ドイツ語可、独・仏多',
    best: '中距離＋ローカル交流',
  },
];

const ACCOMMODATION = [
  { type: 'Hostel（ドミトリー）', cost: '€15-30/泊', detail: 'Hostelworldで予約、6-12人部屋。最安' },
  { type: 'Hostel（個室）', cost: '€40-70/泊', detail: '安いホテル並み、Wi-Fi・キッチン付' },
  { type: 'Airbnb（個室）', cost: '€30-60/泊', detail: '長期割引活用、洗濯機・キッチン付' },
  { type: 'Airbnb（全室）', cost: '€60-150/泊', detail: '2-3人で泊まれば割安、家族感' },
  { type: 'カウチサーフィング', cost: '€0（無料）', detail: 'ローカル家にステイ、文化体験◎、安全意識必須' },
];

const FOOD_TIPS = [
  '主要スーパー（Lidl/Aldi/Carrefour）で食材調達',
  '伝統市場（パリのMarché、バルセロナLa Boqueria等）で新鮮安く',
  'Hostelの共用キッチンで自炊（週3-4回）',
  'ケバブ・ピザ・パン€5-7で安く外食',
  '昼食ランチセット€10-15（夜より2-3割安）',
  '水道水OKの国は水ボトル節約（独・仏・伊・北欧等）',
];

const ROUTES = [
  {
    name: '①西欧定番3週間（パリ・アムス・ベルリン・プラハ・ウィーン・ローマ）',
    days: '21日',
    cost: '€1,200-1,800',
    transport: 'LCC＋夜行バス組み合わせ',
    highlight: 'パリ・ローマの定番＋プラハ・ベルリンの隠れ名所',
  },
  {
    name: '②北欧シーズン2週間（コペンハーゲン・ストックホルム・オスロ）',
    days: '14日',
    cost: '€1,500-2,500（北欧物価高）',
    transport: 'LCC＋鉄道',
    highlight: 'オーロラ・フィヨルド・北欧デザイン',
  },
  {
    name: '③イベリア・地中海2週間（リスボン・マドリード・バルセロナ・ニース）',
    days: '14日',
    cost: '€800-1,200（南欧安）',
    transport: 'LCC＋夜行バス',
    highlight: '地中海・ガウディ建築・ワイン',
  },
];

const COST_SIM = [
  { duration: '1週間（3都市）', transport: '€150', accommodation: '€175', food: '€140', other: '€100', total: '€565（約9万円）' },
  { duration: '2週間（5都市）', transport: '€300', accommodation: '€350', food: '€280', other: '€200', total: '€1,130（約18万円）' },
  { duration: '1ヶ月（7-10都市）', transport: '€500', accommodation: '€700', food: '€560', other: '€400', total: '€2,160（約34万円）' },
];

const SAVING_HACKS = [
  'LCC早割2-3ヶ月前購入で半額',
  'Eurail Pass購入はAge 27以下なら大幅割引',
  '夜行バス＝ホテル代浮く「移動＋宿泊」一石二鳥',
  'Hostelは複数泊予約で割引',
  '主要観光地は早朝（7-9時）に行くと並ばずに済む',
  '無料ウォーキングツアー活用（チップ制）',
  '美術館の「First Sunday Free」活用（パリ・マドリード等）',
  '学生証で交通・美術館30-50%割引',
  'Couchsurfingで宿泊費ゼロ＋ローカル交流',
  '自炊週3-4回で食費半額',
  '水道水飲める国は水ボトル禁',
  'クレカ・現金両方持参で為替手数料最小化',
  'Wise・Revolutの多通貨カードで両替コスト最小',
  'eSIM（Airalo等）で各国SIMなしで通信',
  'Hostelの自由参加イベント（パブクロール）で出会い＋安く',
];

const FAQS = [
  {
    question: '欧州周遊の予算はどれくらい？',
    answer:
      '1週間9万円、2週間18万円、1ヶ月34万円が節約モードの目安。LCC＋ホステル＋自炊重視。普通モードなら1.5-2倍、贅沢モードなら2-3倍。北欧・スイスは物価高、東欧・南欧は安。',
  },
  {
    question: 'Eurail Pass買うべき？',
    answer:
      '6国以上周遊＋鉄道の旅好きなら買う価値あり。1ヶ月€280-590、座席指定別途。3国以下なら個別購入の方が安いケース多。Age 27以下なら大幅割引でお得感UP。LCC＋夜行バスとの組み合わせが最強コスパ。',
  },
  {
    question: '英語だけで周遊できる？',
    answer:
      'できる。観光地・ホステル・主要レストランは英語通用。ただし南欧（伊・西・葡）・東欧の田舎は英語通用度低。Google翻訳＋簡単な現地語フレーズ（「こんにちは」「ありがとう」）で十分。',
  },
  {
    question: 'ワーホリ中に欧州周遊するベストタイミングは？',
    answer:
      'WHV中の長期休暇 or 終了直後。英・独・愛のWHV中は週末旅行可、長期休暇に1-2週間集中周遊。Working Holidayが終わって帰国前の1ヶ月をフル活用するパターンも王道。',
  },
  {
    question: '安全面で注意すべきは？',
    answer:
      'パリ・ローマ・バルセロナの観光名所のスリ多発、地下鉄・カフェのバッグ放置厳禁。深夜の駅・住宅街の単独歩行避ける。ホステルのロッカー必須、貴重品分散保管。日本人女性向け安全対策は別途参照。',
  },
];

export default async function EuropeBudgetTravelPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(欧州|ヨーロッパ|周遊|旅行|Europe|LCC)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(欧州|ヨーロッパ|周遊|旅行|Europe)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '欧州周遊予算術', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '欧州周遊予算術' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリ・留学中の欧州周遊予算術｜LCC・バス・Eurail
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="英・独・愛等の欧州拠点で周遊予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              欧州ワーホリ・留学の最大の特権が「欧州周遊」。LCC・夜行バス・Eurailを駆使すれば、1ヶ月15-20万円で7-10都市を巡れます。
              <br />
              この記事では移動手段比較、宿泊・食事の節約、おすすめ周遊ルート、予算シミュレーション、節約ハック15選を完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '1週間9万円、2週間18万円、1ヶ月34万円が節約モードの目安',
              'LCC早割＋夜行バス＋ホステル自炊が3点セット',
              '欧州拠点なら必ず周遊計画を、最大の特権',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-europe" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">欧州拠点なら周遊は必須</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・LCC（Ryanair等）で2-3時間＋€10-50で隣国へ</li>
              <li>・夜行バスで宿泊費＋移動費を同時にカバー</li>
              <li>・EU加盟国はパスポート不要・国境フリー</li>
              <li>・ワーホリ・留学拠点（英・独・愛・仏等）から欧州中心部アクセス◎</li>
              <li>・歴史的建造物・美食・文化・芸術が一気に体験</li>
              <li>・帰国後の話題・履歴書映え</li>
            </ul>
          </section>

          {/* 移動手段 */}
          <section id="transport" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">移動手段比較（LCC/バス/Eurail）</h2>
            <div className="space-y-3">
              {TRANSPORT_COMPARE.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{t.type}</p>
                    <p className="text-sm font-bold text-amber-700">{t.cost}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">所要: {t.speed}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-1">{t.detail}</p>
                  <p className="text-xs text-emerald-700"><strong>ベスト:</strong> {t.best}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 宿泊 */}
          <section id="accommodation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">宿泊（ホステル/Airbnb）</h2>
            <div className="space-y-3">
              {ACCOMMODATION.map((a, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-sm text-primary-700">{a.type}</p>
                    <p className="text-sm font-bold text-amber-700">{a.cost}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{a.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 食費 */}
          <section id="food" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">食費を1日€20に抑える</h2>
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
            title="欧州拠点の留学・WH先も合わせて検討"
            description="マルタ・UK・ベルリン等の欧州拠点情報も合わせて。"
            primaryHref="/uk-yms-visa-guide"
            primaryLabel="UK YMSビザ完全ガイド"
            secondaryHref="/berlin-livecost"
            secondaryLabel="ベルリン生活費"
          />

          {/* おすすめルート */}
          <section id="recommended-routes" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">おすすめ周遊ルート3パターン</h2>
            <div className="space-y-3">
              {ROUTES.map((r, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{r.name}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>期間:</strong> {r.days}</p>
                    <p><strong>予算:</strong> <span className="text-amber-700 font-bold">{r.cost}</span></p>
                    <p><strong>移動:</strong> {r.transport}</p>
                    <p className="text-xs text-gray-500 mt-2">{r.highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 予算シミュレーション */}
          <section id="cost-simulation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">予算シミュレーション</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-2 py-2 text-left">期間</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">移動</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">宿泊</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">食費</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">合計</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_SIM.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{c.duration}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.transport}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.accommodation}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.food}</td>
                      <td className="border border-gray-200 px-2 py-2 text-primary-700 font-bold">{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 節約ハック */}
          <section id="saving-hacks" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">節約ハック15選</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {SAVING_HACKS.map((h, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「欧州・周遊・旅行」関連の言及を集計。
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
            ※ 物価・移動費は2026年5月時点の情報です。為替・時期により大きく変動するため、最新情報をご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/uk-yms-visa-guide" className="text-primary-600 hover:underline">→ UK YMSビザ完全ガイド</Link></li>
              <li><Link href="/berlin-livecost" className="text-primary-600 hover:underline">→ ベルリン生活費</Link></li>
              <li><Link href="/malta-study" className="text-primary-600 hover:underline">→ マルタ留学完全ガイド</Link></li>
              <li><Link href="/wh-female-safety" className="text-primary-600 hover:underline">→ 女性WH安全</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
