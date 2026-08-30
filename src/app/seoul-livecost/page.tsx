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

const PAGE_PATH = '/seoul-livecost';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ソウル生活費完全シミュレーション｜コシウォン・食費・地下鉄｜月10万円〜25万円',
  description: 'ソウルの月間生活費を「節約・標準・余裕」3パターンで詳細シミュレーション。家賃（コシウォン/ワンルーム）・食費・地下鉄・娯楽・税金まで。月10万円台のサバイバル術と賢い節約方法を完全公開。',
  path: PAGE_PATH,
  keywords: [
    'ソウル 生活費',
    'ソウル 留学 費用',
    'ソウル 家賃',
    'コシウォン 値段',
    '韓国 留学 生活費',
    'ソウル 物価',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '月間生活費の全体像（3パターン）' },
  { id: 'rent', label: '家賃の選択（コシウォン vs ワンルーム）' },
  { id: 'food', label: '食費を月20万ウォンに抑える方法' },
  { id: 'transport', label: '地下鉄・バス・タクシー' },
  { id: 'entertainment', label: 'カフェ・K-POP・コスメ' },
  { id: 'mobile', label: '携帯・Wi-Fiの安いプラン' },
  { id: 'saving-tips', label: '月60万ウォン生活サバイバル術10選' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COST_PATTERNS = [
  {
    pattern: '節約（最低）',
    rent: '40万ウォン（コシウォン）',
    food: '20万ウォン',
    transport: '5万ウォン（地下鉄定期）',
    other: '10万ウォン',
    total: '75万ウォン / 約10万円',
    note: '自炊メイン・地下鉄のみ・娯楽控えめ',
  },
  {
    pattern: '標準（学生）',
    rent: '60万ウォン（ワンルーム）',
    food: '35万ウォン',
    transport: '5万ウォン',
    other: '25万ウォン',
    total: '125万ウォン / 約16万円',
    note: '外食週末2-3回・カフェ・娯楽あり',
  },
  {
    pattern: '余裕（社会人）',
    rent: '90万ウォン（広めワンルーム）',
    food: '60万ウォン',
    transport: '10万ウォン（タクシー併用）',
    other: '60万ウォン',
    total: '220万ウォン / 約30万円',
    note: '外食頻繁・コスメ・旅行・K-POPライブ',
  },
];

const RENT_OPTIONS = [
  {
    type: 'コシウォン（고시원）',
    cost: '30〜50万ウォン',
    detail: '韓国独特の超ミニマル1人部屋（2-4畳）、共用キッチン・トイレ',
    pros: '保証金ゼロ・契約簡単・即入居可',
    cons: '狭い・防音弱・プライバシー少',
  },
  {
    type: 'コシテル（고시텔）',
    cost: '40〜70万ウォン',
    detail: 'コシウォンよりやや広め、室内シャワー付き多',
    pros: '保証金ゼロ・室内シャワー',
    cons: '依然狭い・長期滞在には不向き',
  },
  {
    type: 'ワンルーム（원룸）',
    cost: '50〜90万ウォン',
    detail: '個室＋ミニキッチン＋バス、保証金300〜500万ウォン',
    pros: '広め・独立性◎・長期滞在向け',
    cons: '保証金高・契約複雑（保証人必要）',
  },
  {
    type: 'シェアハウス',
    cost: '40〜70万ウォン',
    detail: '個室＋共用キッチン・リビング、外国人留学生コミュニティ',
    pros: '友達できる・保証金少',
    cons: '人間関係問題リスク',
  },
];

const FOOD_TIPS = [
  '大学街（弘大・梨大）の学生街食堂で1食5,000-8,000ウォン',
  'コンビニ三角キンパで朝食2,000ウォン',
  '韓国式定食屋（한정식）で多品目セット8,000-12,000ウォン',
  '伝統市場（広蔵市場等）で新鮮野菜・果物半額',
  '韓国家庭料理は安、自炊1食2,000-3,000ウォン',
  '焼肉外食は3,500-5,000ウォン/人と意外と安い',
];

const TRANSPORT_INFO = [
  { item: '地下鉄1回乗車', cost: '1,400ウォン', detail: '基本料金、距離追加で2,000-3,000ウォン' },
  { item: '地下鉄定期券（30日）', cost: '55,000ウォン', detail: '無制限乗り放題、最もお得' },
  { item: 'バス1回乗車', cost: '1,200ウォン', detail: '幹線・支線バス共通、地下鉄と乗継無料' },
  { item: 'タクシー（基本料金）', cost: '4,800ウォン', detail: '深夜は2-3倍、Kakaoタクシーアプリ便利' },
];

const ENTERTAINMENT = [
  { item: 'カフェ（アメリカーノ）', cost: '4,500〜6,000ウォン' },
  { item: 'K-POPコンサート', cost: '50,000〜250,000ウォン' },
  { item: 'コスメ（韓国ブランド）', cost: '5,000〜30,000ウォン' },
  { item: '美容室（カット）', cost: '15,000〜30,000ウォン' },
  { item: 'シネマ', cost: '12,000ウォン' },
  { item: 'チムジルバン（韓国サウナ）', cost: '10,000〜15,000ウォン' },
];

const MOBILE_INFO = [
  'SKT/KT/LG U+の3キャリア、品質はほぼ同等',
  'プリペイドSIM（外国人向け）：月20,000-40,000ウォン（5GB-20GB）',
  '通常契約：保証人＋外国人登録証必要、月50,000-80,000ウォン',
  '無料Wi-Fi：地下鉄駅・カフェほぼ全店舗にあり、節約余地大',
  'eSIM：Airalo/Holaflyで500円〜（短期向け）',
];

const SAVING_TIPS = [
  '家賃はコシウォン or シェアハウスで月30-50万ウォンに',
  '学生証で美術館・地下鉄・カフェ・コスメ等の学割使い倒し',
  '伝統市場で新鮮食材＆半額調達、平日午後狙い',
  '地下鉄定期券（55,000ウォン）で交通費固定化',
  'カフェ常連割引活用（10回スタンプで1杯無料が定番）',
  '無料Wi-Fiスポット活用、プリペイドSIMは最低限',
  '韓国系SNS（NAVER、Kakao）で割引クーポン入手',
  'チムジルバンで宿泊代節約（一晩10,000ウォン）',
  '中古品はNAVERカフェやKarrot（ダンギンマーケット）',
  '無料イベント（フェスティバル・無料コンサート）活用',
];

const FAQS = [
  {
    question: 'ソウルで月10万円生活は本当に可能？',
    answer:
      '可能です。コシウォン40万ウォン＋自炊食費20万ウォン＋地下鉄定期5万ウォン＋雑費10万ウォンで月75万ウォン（約10万円）。ただし娯楽・旅行ほぼゼロ、コシウォン暮らしの狭さに耐えられる必要あり。標準的な留学生活でも月125万ウォン（16万円）が現実的。',
  },
  {
    question: 'コシウォン暮らしは本当にきつい？',
    answer:
      '人による。2-4畳の極狭部屋、共用キッチン・トイレが普通。プライバシーは少ないが、外国人留学生も多く、コミュニティはできやすい。長期（半年超）は精神的にきついため、最初の1-2ヶ月コシウォン→ワンルーム移行が一般的パターン。',
  },
  {
    question: 'ワンルーム契約は外国人でもできる？',
    answer:
      '可能だが、保証人（韓国人）or 保証金多めが条件のことが多い。学校が指定する不動産屋や、外国人専門エージェント（Goshipages、Ziptoss等）経由がスムーズ。保証金300〜500万ウォン（30-50万円）の現金準備が必須。',
  },
  {
    question: '日本食材は手に入る？',
    answer:
      '入手可能、ただし日本の1.5-2倍価格。COSMS、emart、大手スーパーで日本食材コーナーあり。お米・醤油・味噌・納豆等基本食材は揃う。日系食材専門店「東京食堂」「ヒョンソンマート」も活用可。',
  },
  {
    question: '冬・夏の光熱費はどれくらい？',
    answer:
      'コシウォン・シェアハウスは光熱費込み多。ワンルームは冬月3-5万ウォン、夏（エアコン）月5-8万ウォン。床暖房（オンドル）が標準で冬の暖房効率は良いが、夏のエアコン代が重い。',
  },
];

export default async function SeoulLivecostPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const krExperiences = all.filter((e) => e.country?.id === 'south-korea');
  const mentions = countMentions(all, /(ソウル|Seoul|韓国|Korea|生活費|コシウォン)/i);
  const sample = krExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(ソウル|Seoul|韓国|Korea|生活費|コシウォン)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ソウル生活費完全シミュレーション', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ソウル生活費完全シミュレーション' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ソウル生活費完全シミュレーション｜コシウォン・食費・地下鉄｜月10万円〜
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="ソウルで留学・滞在予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ソウルは欧米都市の半額以下で生活できる、コスパ抜群の留学先。日本から3時間と近く、K-POP・K-Drama・K-Beauty文化を本場で体験できます。
              <br />
              この記事では月10万円〜30万円までの3パターンの生活費シミュレーション、コシウォン・ワンルームの選び方、節約術まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '月75万ウォン（約10万円）〜220万ウォン（約30万円）まで生活水準で差',
              '家賃はコシウォン30-50万ウォンorワンルーム50-90万ウォン',
              '地下鉄定期券55,000ウォンで交通費固定、食費は意外と安',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 全体像 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月間生活費の全体像（3パターン）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ライフスタイル別に3パターンを試算（1ウォン=0.13円換算、2026年5月時点）。
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

          {/* 家賃選択 */}
          <section id="rent" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">家賃の選択（コシウォン vs ワンルーム）</h2>
            <div className="space-y-3">
              {RENT_OPTIONS.map((r, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{r.type}</p>
                    <p className="text-sm font-bold text-amber-700">{r.cost}/月</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{r.detail}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <p className="text-emerald-700"><strong>メリット:</strong> {r.pros}</p>
                    <p className="text-rose-700"><strong>デメリット:</strong> {r.cons}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 食費 */}
          <section id="food" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">食費を月20万ウォンに抑える方法</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {FOOD_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🍱</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="韓国留学の全体ガイドも合わせて"
            description="語学堂・大学・ビザ・K-POP文化を活かす学習法まで完全解説。"
            primaryHref="/korea-study"
            primaryLabel="韓国留学完全ガイド"
            secondaryHref="/matching"
            secondaryLabel="自分に合う留学診断"
          />

          {/* 交通 */}
          <section id="transport" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">地下鉄・バス・タクシー</h2>
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
            <h2 className="text-xl sm:text-2xl font-bold mb-3">カフェ・K-POP・コスメ</h2>
            <div className="grid grid-cols-2 gap-3">
              {ENTERTAINMENT.map((e, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                  <p className="font-bold text-sm mb-1 text-primary-700">{e.item}</p>
                  <p className="text-sm text-amber-700 font-bold">{e.cost}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 携帯 */}
          <section id="mobile" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">携帯・Wi-Fiの安いプラン</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {MOBILE_INFO.map((m, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">📱</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 節約 */}
          <section id="saving-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月60万ウォン生活サバイバル術10選</h2>
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
                韓国渡航者の体験談 <strong>n={krExperiences.length}件</strong>。
                ソウル・韓国・生活費関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 物価・家賃・為替は2026年5月時点の情報です。為替変動・市場変動により大きく変動する可能性があります。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/korea-study" className="text-primary-600 hover:underline">→ 韓国留学完全ガイド</Link></li>
              <li><Link href="/cebu-study-real-cost" className="text-primary-600 hover:underline">→ セブ留学リアルコスト</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術</Link></li>
              <li><Link href="/no-english" className="text-primary-600 hover:underline">→ 英語ゼロでも留学</Link></li>
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト</Link></li>
              <li><Link href="/countries/south-korea" className="text-primary-600 hover:underline">→ 韓国国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
