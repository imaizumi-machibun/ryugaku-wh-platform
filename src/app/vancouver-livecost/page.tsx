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

const PAGE_PATH = '/vancouver-livecost';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'バンクーバー生活費完全シミュレーション｜家賃・食費・交通｜月20-35万円',
  description: 'バンクーバーの月間生活費を「節約・標準・余裕」3パターンで詳細シミュレーション。家賃・食費・SkyTrain・娯楽・冬コストまで。日本食材豊富な都市の生活サバイバル術。',
  path: PAGE_PATH,
  keywords: [
    'バンクーバー 生活費',
    'バンクーバー 家賃',
    'バンクーバー 食費',
    'バンクーバー ワーホリ',
    'バンクーバー 留学 費用',
    'カナダ 生活費',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '月間生活費の全体像（3パターン）' },
  { id: 'rent', label: '家賃の実態とエリア相場' },
  { id: 'food', label: '食費を月CAD 350に抑える方法' },
  { id: 'transport', label: '交通費・SkyTrainの活用' },
  { id: 'entertainment', label: '娯楽・カフェ・夜遊び' },
  { id: 'japanese-food', label: '日本食材店マップ' },
  { id: 'saving-tips', label: '月CAD 1,700生活サバイバル術10選' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COST_PATTERNS = [
  {
    pattern: '節約（最低）',
    rent: 'CAD 900（シェア郊外）',
    food: 'CAD 350',
    transport: 'CAD 105（U-Pass等）',
    other: 'CAD 250',
    total: 'CAD 1,605 / 約18万円',
    note: '自炊・公共交通のみ・娯楽控えめ',
  },
  {
    pattern: '標準（学生・WH）',
    rent: 'CAD 1,200（シェアDowntown）',
    food: 'CAD 500',
    transport: 'CAD 105',
    other: 'CAD 450',
    total: 'CAD 2,255 / 約25万円',
    note: '週末外食2-3回・娯楽あり',
  },
  {
    pattern: '余裕（社会人）',
    rent: 'CAD 2,000（1人暮らし）',
    food: 'CAD 800',
    transport: 'CAD 200',
    other: 'CAD 900',
    total: 'CAD 3,900 / 約43万円',
    note: '外食頻繁・旅行・ジム会員',
  },
];

const RENT_AREAS = [
  { area: 'Downtown', rent: 'CAD 1,500〜2,500', detail: '中心部・観光地アクセス◎、家賃最高' },
  { area: 'Kitsilano', rent: 'CAD 1,200〜1,800', detail: 'ビーチ近・若者人気、家賃中〜高' },
  { area: 'Mount Pleasant', rent: 'CAD 1,200〜1,700', detail: 'ヒップエリア、カフェ多、若者向け' },
  { area: 'Commercial Drive', rent: 'CAD 1,000〜1,500', detail: '多文化・グルメ、コスパ良' },
  { area: 'East Vancouver', rent: 'CAD 800〜1,200', detail: '郊外、家族向け、価格安' },
  { area: 'Burnaby/Richmond', rent: 'CAD 700〜1,100', detail: '通勤30-45分、アジアコミュニティ強い' },
];

const FOOD_TIPS = [
  '主要スーパー（No Frills、Save On Foods、T&T）を比較利用',
  '中華街・コリアンタウンで新鮮・安く食材調達',
  'Granville Island Marketで新鮮野菜・魚',
  'メキシカン・ベトナム料理で安く外食（CAD 12-18）',
  '寿司ロール（CAD 5-10）の量＆安さは驚き',
  'Tim Hortons・McDonaldで朝食CAD 5-8',
];

const TRANSPORT_INFO = [
  { item: 'TransLink月パス（Zone 1）', cost: 'CAD 107.30', detail: 'SkyTrain・バス・SeaBus乗り放題（Downtown内）' },
  { item: 'TransLink月パス（Zone 1-3）', cost: 'CAD 189.00', detail: 'Burnaby・Surrey含む全域' },
  { item: 'U-Pass（学生）', cost: 'CAD 41/月', detail: '学費に含まれる、最強コスパ' },
  { item: '自転車（Mobi等）', cost: 'CAD 85/年', detail: '30分以内無制限、4-10月メイン' },
  { item: 'Uber/Lyft', cost: 'CAD 10-25/回', detail: '深夜・雨天時のみ' },
];

const ENTERTAINMENT = [
  { item: 'スターバックス', cost: 'CAD 4-6' },
  { item: '美術館（Vancouver Art Gallery）', cost: 'CAD 12-25' },
  { item: 'クラブ（土曜）', cost: 'CAD 15-25' },
  { item: 'クラフトビール', cost: 'CAD 7-10' },
  { item: 'シネマ', cost: 'CAD 13-18' },
  { item: 'ジム（GoodLife等）', cost: 'CAD 30-50' },
];

const JAPANESE_STORES = [
  { name: 'Konbiniya Japan Centre', location: 'Robson St（Downtown中心）', detail: '日本食材専門店、定番ブランド充実' },
  { name: 'Fujiya Japanese Foods', location: '4店舗（Clark/Downtown/Burnaby/Richmond）', detail: '老舗、寿司ネタ・刺身も購入可' },
  { name: 'Nikaido Japanese Grocery', location: 'Burnaby', detail: '住宅街の隠れ家、納豆・豆腐豊富' },
  { name: 'T&T Supermarket', location: '複数店舗', detail: 'アジア系大手スーパー、日本食材コーナーあり' },
  { name: 'Daiso（ダイソー）', location: 'Richmond等', detail: '日本の100円ショップ、CAD 2-3で生活用品' },
];

const SAVING_TIPS = [
  '家賃はシェアハウス、Downtown外でCAD 800-1,200',
  'TransLink月パス（CAD 107）で交通固定化',
  'No Frills・T&Tで週末まとめ買い、自炊率80%',
  'Mobi自転車で4-10月の交通費ゼロ',
  '美術館の無料デー（Vancouver Art Galleryは火曜夜）',
  'Happy Hour（午後4-7時）のドリンク半額活用',
  '携帯はFido/Public Mobileの月CAD 30プラン',
  '日本食材は中華街・コリアンタウンで安く購入',
  '中古品はFacebook Marketplace・Craigslist',
  '無料イベント（Stanley Park・Beach festivals）活用',
];

const FAQS = [
  {
    question: 'バンクーバーで月18万円生活は可能？',
    answer:
      '可能です。家賃CAD 900（郊外シェア）＋食費CAD 350＋TransLink CAD 105＋雑費CAD 250で月CAD 1,605（約18万円）。ただし自炊率80%以上＋娯楽控えめが前提。標準的な学生生活でも月CAD 2,000-2,500（22-28万円）が現実的。',
  },
  {
    question: 'トロントと比べてどっち高い？',
    answer:
      'ほぼ同等、わずかにバンクーバーの方が家賃高い傾向。Downtownの1ベッドルームでバンクーバーCAD 2,200、トロントCAD 1,900。一方、冬の暖房費はトロントの方が高い（年通して相殺）。',
  },
  {
    question: '日本食材は手に入る？高い？',
    answer:
      '手に入る、しかも豊富。Konbiniya・Fujiya等の日本食材専門店が複数あり、ほぼ全ての和食材が入手可能。価格は日本の1.3-1.5倍程度。米CAD 25-30/10kg、味噌CAD 10、納豆CAD 4-5（3パック）が相場。海外で日本食材に困らない数少ない都市。',
  },
  {
    question: '冬の防寒コストは？',
    answer:
      'トロント・モントリオールほどは要らない。バンクーバーは冬5度・雨多で、ダウン＋レインジャケットあれば十分。初期投資CAD 200-400程度（ダウン＋防水靴＋傘）。光熱費も月CAD 50-100でOK。',
  },
  {
    question: 'シェアハウス見つかりやすい？',
    answer:
      '探しやすいが競争あり。Facebook groups（Vancouver Roommates）、Craigslist、Kijijiで毎日新しい募集が出ます。Downtownのシェア部屋はCAD 1,000-1,400で、人気の物件は1-2日で決まることも。3-4週間の探し期間を確保。',
  },
];

export default async function VancouverLivecostPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const vanExperiences = all.filter((e) =>
    e.country?.id === 'canada' && /バンクーバー|Vancouver/i.test(e.cityPrimary ?? '')
  );
  const mentions = countMentions(all, /(バンクーバー|Vancouver|カナダ|生活費)/i);
  const sample = vanExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(バンクーバー|Vancouver|カナダ|生活費|家賃)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'バンクーバー生活費完全シミュレーション', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'バンクーバー生活費完全シミュレーション' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              バンクーバー生活費完全シミュレーション｜家賃・食費・SkyTrain｜月18-43万円
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="バンクーバーでワーホリ・留学予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              カナダ西海岸最大都市バンクーバーは、世界の「住みやすい都市」常連。温暖湿潤気候＋日本食材豊富＋日本人多コミュニティで、初心者ワーホリにも人気。
              <br />
              この記事では月18万円〜43万円までの3パターンの生活費、エリア別家賃、節約術まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '月CAD 1,605（約18万円）〜CAD 3,900（約43万円）まで生活水準で差',
              '家賃はシェアハウスCAD 900-1,200、TransLink月パスCAD 107',
              '日本食材店4店舗以上、和食生活も容易',
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
            title="トロント生活費・バンクーバー語学学校も合わせて"
            description="カナダ2大都市の比較、バンクーバー語学学校10校情報も確認を。"
            primaryHref="/toronto-livecost"
            primaryLabel="トロント生活費"
            secondaryHref="/vancouver-language-school"
            secondaryLabel="バンクーバー語学学校"
          />

          {/* 交通 */}
          <section id="transport" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">交通費・SkyTrainの活用</h2>
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

          {/* 日本食材 */}
          <section id="japanese-food" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">日本食材店マップ</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              バンクーバーは海外都市の中でも日本食材入手が圧倒的に楽。主要店舗は以下：
            </p>
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
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月CAD 1,700生活サバイバル術10選</h2>
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
                バンクーバー渡航者の体験談 <strong>n={vanExperiences.length}件</strong>。
                バンクーバー・生活費関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
              <li><Link href="/toronto-livecost" className="text-primary-600 hover:underline">→ トロント生活費</Link></li>
              <li><Link href="/vancouver-language-school" className="text-primary-600 hover:underline">→ バンクーバー語学学校</Link></li>
              <li><Link href="/toronto-vs-vancouver" className="text-primary-600 hover:underline">→ トロントvsバンクーバー</Link></li>
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ</Link></li>
              <li><Link href="/canada-tax-return" className="text-primary-600 hover:underline">→ カナダTax Return</Link></li>
              <li><Link href="/countries/canada" className="text-primary-600 hover:underline">→ カナダ国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
