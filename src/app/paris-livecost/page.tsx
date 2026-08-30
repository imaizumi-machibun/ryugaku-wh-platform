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

const PAGE_PATH = '/paris-livecost';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'パリ生活費完全シミュレーション｜家賃・食費・メトロ｜月20-50万円',
  description: 'パリの月間生活費を「節約・標準・余裕」3パターンで詳細シミュレーション。家賃・食費・メトロ・カフェ文化・物価高対策まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'パリ 生活費',
    'パリ 家賃',
    'パリ 留学 費用',
    'フランス 生活費',
    'パリ ワーホリ',
    'パリ 物価',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '月間生活費の全体像（3パターン）' },
  { id: 'rent', label: '家賃の実態とエリア相場' },
  { id: 'food', label: '食費を月€350に抑える方法' },
  { id: 'transport', label: 'メトロ・Navigo Pass' },
  { id: 'cafe-entertainment', label: 'カフェ・娯楽・観光' },
  { id: 'french-tips', label: 'フランス語ゼロでも生活する方法' },
  { id: 'saving-tips', label: '月€1,200生活サバイバル術10選' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COST_PATTERNS = [
  {
    pattern: '節約（最低）',
    rent: '€700（Zone 3-4シェア）',
    food: '€300',
    transport: '€86.40（Navigo月パス）',
    other: '€150',
    total: '€1,236 / 約20万円',
    note: '自炊メイン・メトロのみ・娯楽控えめ',
  },
  {
    pattern: '標準（学生・WH）',
    rent: '€1,000（中心部シェア）',
    food: '€450',
    transport: '€86.40',
    other: '€400',
    total: '€1,936 / 約31万円',
    note: 'カフェ・週末外食・娯楽あり',
  },
  {
    pattern: '余裕（社会人）',
    rent: '€1,800（中心部1人暮らし）',
    food: '€700',
    transport: '€200',
    other: '€700',
    total: '€3,400 / 約54万円',
    note: '外食頻繁・観光・ジム会員',
  },
];

const RENT_AREAS = [
  { area: 'Marais（4区）', rent: '€1,200〜2,500', detail: 'パリ中心部、観光地、家賃最高' },
  { area: 'Saint-Germain（6区）', rent: '€1,300〜2,800', detail: '左岸の高級住宅街、カフェ文化' },
  { area: 'Montmartre（18区）', rent: '€900〜1,600', detail: 'モンマルトル、アーティスト、観光' },
  { area: 'Belleville（20区）', rent: '€700〜1,200', detail: '多文化・若者人気、コスパ良' },
  { area: '近郊（Zone 3-4）', rent: '€500〜900', detail: 'メトロ30-45分、家賃最安' },
];

const FOOD_TIPS = [
  '主要スーパー（Carrefour、Monoprix、Lidl）を比較利用',
  'Marché（市場、週1-2回開催）で新鮮野菜・果物半額',
  'ベーカリー（Boulangerie）の朝食パン€1-3',
  'カフェ・ビストロランチ€12-18（コース）',
  'ケバブ・クレープでファストフード€5-10',
  'Aligreの市場（バスティーユ近郊）が最安',
];

const TRANSPORT_INFO = [
  { item: 'Navigo月パス（Zone 1-5）', cost: '€86.40', detail: 'パリ全域＋空港乗り放題' },
  { item: 'Navigo Imagine R（学生）', cost: '€38.10/月', detail: '26歳以下学生、最強コスパ' },
  { item: '1回券（Ticket t+）', cost: '€2.15', detail: 'メトロ・バス・トラム共通' },
  { item: 'Vélib（自転車）', cost: '€39/年', detail: '30分以内無制限、市内活動向け' },
  { item: 'タクシー', cost: '€10-30/回', detail: 'ピーク時はUber推奨' },
];

const CAFE_ENTERTAINMENT = [
  { item: 'カフェ（エスプレッソ）', cost: '€2-4（カウンター）' },
  { item: 'カフェ（テラス席）', cost: '€4-6' },
  { item: 'ワイン（バー）', cost: '€5-8/杯' },
  { item: '美術館（ルーヴル等）', cost: '€15-20（18歳未満無料）' },
  { item: 'シネマ', cost: '€10-13' },
  { item: 'ジム', cost: '€30-60/月' },
];

const FRENCH_TIPS = [
  '基本フレーズ：「Bonjour」「Merci」「Excusez-moi」「Combien?」だけは必須',
  '英語通用度：観光地・若者カフェ・大学関連は◎、地方・年配層は△',
  'Google翻訳・DeepL併用で日常買い物OK',
  'パリは多文化、英語＋ジェスチャーで通じる場面多',
  '長期滞在ならフランス語A2レベル学習推奨（自治体無料コースあり）',
];

const SAVING_TIPS = [
  '家賃は近郊シェア（Zone 3-4）で月€500-700',
  'Navigo月パス（€86.40）で交通固定',
  'Marchéで週末まとめ買い、自炊率80%',
  '美術館の無料デー（月第1日曜の主要美術館）',
  '18歳未満・26歳以下学生はEU美術館無料、観光大半カバー',
  'カフェはカウンター（テラスの半額）',
  '携帯はFree Mobile €2-20の格安SIM',
  'パン屋の閉店間際半額活用',
  '中古品はLeboncoin（仏最大の中古サイト）',
  '無料イベント（パリ祭・無料コンサート）多',
];

const FAQS = [
  {
    question: 'パリで月20万円生活は可能？',
    answer:
      '可能だがタイト。Zone 3-4シェア€700＋自炊食費€300＋Navigo €86＋雑費€150で月€1,236（約20万円）。中心部生活なら最低€1,500-1,800必要。「家賃が生活費の大半」のパリでは住む場所選びが鍵。',
  },
  {
    question: 'フランス語ゼロでも生活できる？',
    answer:
      '可能、ただし不便。観光地・若者カフェ・大学関連は英語通用度◎、地方・年配層・行政手続きは仏語必要。Google翻訳＋基本フレーズ（Bonjour・Merci）で日常買い物OK。長期滞在ならA2レベル学習推奨、自治体無料コースあり。',
  },
  {
    question: 'シェアハウス見つかりやすい？',
    answer:
      '探しにくい。Leboncoin、Appartager、Facebook groupsで毎日新募集、競争激しい。仏語必須の場合多、英語OKシェアは家賃高め。Marais・Saint-Germainの中心部シェアは1-2日で決まることも、3-4週間の探し期間確保＋早めの内見が鉄則。',
  },
  {
    question: 'ロンドンと比べてどっち高い？',
    answer:
      'ロンドンの方が高い。家賃・食費・交通費ともパリの方が安、特にNavigo月パス€86.40はロンドンOyster £163の半額。一方ロンドンは美術館全て無料・英語通用度100%・週末欧州周遊安、というメリット。「コスパならパリ、利便性ならロンドン」。',
  },
  {
    question: 'WHV取得して働ける？',
    answer:
      'フランスWHVは年1,500人枠、申請可。週20時間制限あり、観光業・カフェ・日本食レストラン中心。最低時給€11.65/時間。日本料理人気で日本食レストラン就職は比較的容易、長期キャリア構築への足がかりとしても活用可。',
  },
];

export default async function ParisLivecostPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const frExperiences = all.filter((e) => e.country?.id === 'france');
  const mentions = countMentions(all, /(パリ|Paris|フランス|France|生活費)/i);
  const sample = frExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(パリ|Paris|フランス|France|生活費)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'パリ生活費完全シミュレーション', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'パリ生活費完全シミュレーション' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              パリ生活費完全シミュレーション｜家賃・食費・メトロ｜月20-54万円
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="パリで留学・WH・滞在予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              芸術の都パリは、美術・カフェ文化・歴史を堪能できる夢の留学先。一方で家賃高騰中、欧州でもトップクラスのコスト都市でもあります。
              <br />
              この記事では月20万円〜54万円までの3パターンの生活費、エリア別家賃、フランス語ゼロ攻略法、節約術まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '月€1,236（約20万円）〜€3,400（約54万円）まで生活水準で大差',
              '家賃はZone 3-4シェア€700-1,000で抑える',
              'Navigo月パス€86.40でパリ全域＋空港乗り放題',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 全体像 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月間生活費の全体像（3パターン）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ライフスタイル別に3パターンを試算（1€=160円換算、2026年5月時点）。
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
            <h2 className="text-xl sm:text-2xl font-bold mb-3">食費を月€350に抑える方法</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {FOOD_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🍞</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="ベルリン・ロンドン生活費・欧州周遊も合わせて"
            description="欧州主要都市の生活費比較、周遊予算術も確認。"
            primaryHref="/berlin-livecost"
            primaryLabel="ベルリン生活費"
            secondaryHref="/europe-budget-travel"
            secondaryLabel="欧州周遊予算術"
          />

          {/* 交通 */}
          <section id="transport" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">メトロ・Navigo Pass</h2>
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

          {/* カフェ・娯楽 */}
          <section id="cafe-entertainment" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">カフェ・娯楽・観光</h2>
            <div className="grid grid-cols-2 gap-3">
              {CAFE_ENTERTAINMENT.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                  <p className="font-bold text-sm mb-1 text-primary-700">{c.item}</p>
                  <p className="text-sm text-amber-700 font-bold">{c.cost}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ カウンター席はテラス席の半額！パリ式コーヒーの飲み方。
            </p>
          </section>

          {/* フランス語 */}
          <section id="french-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">フランス語ゼロでも生活する方法</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {FRENCH_TIPS.map((f, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">🇫🇷</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 節約 */}
          <section id="saving-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">月€1,200生活サバイバル術10選</h2>
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
                フランス渡航者の体験談 <strong>n={frExperiences.length}件</strong>。
                パリ・フランス・生活費関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 物価・家賃・為替は2026年5月時点の情報です。市場変動に注意。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/berlin-livecost" className="text-primary-600 hover:underline">→ ベルリン生活費</Link></li>
              <li><Link href="/uk-london-cost" className="text-primary-600 hover:underline">→ ロンドン生活費</Link></li>
              <li><Link href="/europe-budget-travel" className="text-primary-600 hover:underline">→ 欧州周遊予算術</Link></li>
              <li><Link href="/malta-study" className="text-primary-600 hover:underline">→ マルタ留学完全ガイド</Link></li>
              <li><Link href="/countries/france" className="text-primary-600 hover:underline">→ フランス国別ガイド</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
