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

const PAGE_PATH = '/wh-budget-100man';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '100万円でワーホリは実現可能？｜国別シミュレーション・節約戦略・現地稼ぐ方法',
  description: '貯金100万円でワーホリは可能？オーストラリア・カナダ・NZ等の国別実現可能性、初期費用の内訳、節約戦略、現地で稼ぐ方法まで実例ベースで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'ワーホリ 100万円',
    'ワーホリ 安く',
    'ワーホリ 貯金',
    'ワーホリ 費用 抑える',
    'ワーホリ 節約',
    '安いワーホリ',
  ],
});

const TOC_HEADINGS = [
  { id: 'is-100man-enough', label: '100万円で本当に行ける？結論' },
  { id: 'initial-cost', label: '初期費用の内訳（最低必須額）' },
  { id: 'by-country', label: '国別100万円実現可能性' },
  { id: 'saving-tips', label: '出発前の節約戦略10選' },
  { id: 'survive-tips', label: '現地サバイバル術' },
  { id: 'earn-quickly', label: '現地で稼ぐ最速ルート' },
  { id: 'reality-check', label: '100万円で失敗する人の特徴' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const INITIAL_COSTS = [
  { item: 'ビザ申請料', amount: '0〜15万円', detail: '豪AUD 685（約7万）、加CAD 168（約2万）、英£298（約6万）' },
  { item: '航空券（片道）', amount: '8〜15万円', detail: '時期・航空会社により差大、LCC利用で節約可' },
  { item: '海外保険1年', amount: '15〜25万円', detail: 'AIG・東京海上等、クレカ付帯では不足ケース多' },
  { item: '初期生活費（1〜2ヶ月）', amount: '20〜30万円', detail: '住居・食費・交通・予備費' },
  { item: '貯金証明（ビザ要件）', amount: '30〜50万円', detail: '豪AUD 5,000、加CAD 2,500、英£2,530等' },
  { item: '渡航準備（パッキング等）', amount: '5〜10万円', detail: '荷物・常備薬・変換プラグ・SIM等' },
];

const BY_COUNTRY = [
  {
    country: 'オーストラリア',
    feasibility: '○ 可能（タイト）',
    detail: '時給世界トップで稼ぎやすい。最初の2-3ヶ月で資金回収可。物価高がネック',
    advice: '到着後すぐ仕事探し、シェアハウス必須、自炊率80%以上',
  },
  {
    country: 'カナダ',
    feasibility: '△ ややキツい',
    detail: 'IECビザ抽選＋健康保険必須（500ドル/月）。豪より時給安いため厳しめ',
    advice: '冬は光熱費上がる、夏出発が安全。SIN取得即座にバイト開始',
  },
  {
    country: 'ニュージーランド',
    feasibility: '○ 可能',
    detail: '物価は豪・加より安、最低時給高め。観光業・ファーム求人豊富',
    advice: 'オークランド/ウェリントン以外を選ぶと家賃半額',
  },
  {
    country: 'イギリス',
    feasibility: '✗ 困難',
    detail: 'YMS IHS年£940＋家賃高（ロンドン月£800-1,200）。100万円では半年もたない',
    advice: '最低150万円必要、200万円推奨',
  },
  {
    country: 'アイルランド',
    feasibility: '△ ややキツい',
    detail: '物価は英より安いが家賃高騰中。ダブリンは厳しい',
    advice: 'コーク等の地方都市選択でかなり安く',
  },
  {
    country: 'ドイツ',
    feasibility: '○ 可能',
    detail: '物価がEU内中位、家賃手頃。健康保険必須（月€110）',
    advice: 'ベルリン・ハンブルク等の大都市以外は更にコスパ良',
  },
];

const SAVING_STRATEGY = [
  '航空券は2-3ヶ月前購入＋平日発、LCC利用で半額に',
  '海外保険は半年契約＋半年延長で初期費用半減',
  '貯金証明は必要最低限のみ（一時送金で乗り切る人多）',
  '渡航前に不要品メルカリ販売で5-10万円捻出',
  '日本のスマホ番号保管サービス（月数百円）で節約',
  '実家で1-2ヶ月待機して住居費浮かす',
  '出発1ヶ月前から退職前最後の貯金集中',
  '住民票海外転出で年金・健康保険・住民税の二重払い回避',
  '英語学習はYouTube・無料アプリ中心（高額英会話学校避ける）',
  '渡航直前のクレカ整備でポイント・特典最大化',
];

const SURVIVE_TIPS = [
  'シェアハウスのリビング住み（家賃半額）',
  '到着前にホステル予約、空港から最安ルートで移動',
  '到着初日からウォークインで仕事探し（時短）',
  '自炊率90%、外食は週末1回',
  '公共交通の月パス契約、Uber避ける',
  'Wi-Fi借りずに無料Wi-Fiスポット活用＋プリペイドSIM',
  '日本食材は最小限、現地食材で代用レシピ覚える',
  'リサイクルショップ・無料配布グループで家具調達',
];

const EARN_QUICKLY = [
  {
    method: '①日本食レストランで即採用',
    detail: 'シドニー・メルボルン・トロント等の日系レストランは日本人歓迎、入国1週間以内採用率高',
  },
  {
    method: '②カフェ（バリスタ）でウォークイン',
    detail: 'メルボルン・バンクーバーは時給高、コース修了で1-2週間で採用',
  },
  {
    method: '③ハウスキーピング・清掃',
    detail: 'ホテル・Airbnb清掃は英語ハードル低、入国直後でも即採用多',
  },
  {
    method: '④ファームジョブ（豪セカンドビザ目的兼）',
    detail: '繁忙期（10-12月、2-4月）は人手不足、即採用＋住居付き多',
  },
  {
    method: '⑤デリバリー（Uber Eats等）',
    detail: '自転車あれば即開始、シフト自由、英会話最小限',
  },
];

const FAILURE_PATTERNS = [
  '英語ゼロで到着→仕事見つからず1ヶ月で資金枯渇',
  '高級ホステル長期滞在→月10-15万円で住居費爆発',
  '観光モードで散財→1ヶ月で3-5万円のミス',
  'ビザ取得直後に渡航→仕事の準備期間なし',
  '保険ケチって医療費破産（救急車だけ$1,000超）',
  'クレカリボ払いでカード停止→現金不足',
];

const FAQS = [
  {
    question: '本当に100万円で1年ワーホリできる？',
    answer:
      'できますが「タイト」。最初の2-3ヶ月で仕事を確保＋シェアハウス＋自炊が必須条件。豪・NZ・独は可能、英は厳しい、加はギリギリ。理想は150万円、安心なら200万円。100万円は最低ラインと考えて、現地でリスク対応する覚悟が必要。',
  },
  {
    question: '渡航直前に何円残ってればOK？',
    answer:
      '最低80万円、推奨100万円を「現金＋クレカ＋Wise」の3分散で。ビザ要件の貯金証明（豪AUD 5,000等）は別途必要なため、ビザ申請時に総額140-150万円程度はあると安心。',
  },
  {
    question: '現地で何ヶ月くらいで自立できる？',
    answer:
      '一般的に2-3ヶ月。仕事見つけて給料受取まで6-8週間、安定生活到達まで2-3ヶ月。初期費用枯渇前に仕事を必ず確保するのが鍵。日本食レストラン等の日本人ネットワーク活用が最速。',
  },
  {
    question: '100万円ワーホリ成功者の共通点は？',
    answer:
      '①出発前から仕事の目処（LinkedIn・Facebook groupで事前接触）、②シェアハウス即入居（ホステル長期しない）、③自炊スキル（節約能力）、④英語最低限（時給高い職を選べる）、⑤現地ネットワーク作る積極性（情報収集）。全部できないと厳しい。',
  },
  {
    question: '貯金少ない場合の代替案は？',
    answer:
      '①渡航時期を半年遅らせて100万円→150万円貯金、②奨学金（JASSO・民間）応募、③クラウドファンディング（数十万円調達可能）、④フィリピン語学留学（30万円〜）でステップアップ、⑤国内英語インターン経験積んで渡航時の優位性UP。',
  },
];

export default async function WhBudget100manPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(100万|貯金|節約|お金|資金|予算)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(100万|貯金|節約|お金|資金|予算)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '100万円ワーホリ完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '100万円ワーホリ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              100万円でワーホリは実現可能？｜国別シミュレーション・節約戦略
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="貯金100万円前後でワーホリを検討する方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「ワーホリには150-200万円必要」と言われがちですが、戦略次第で100万円でも実現可能です。
              <br />
              ただし「タイト」なのは事実。この記事では国別の実現可能性、初期費用の内訳、節約戦略、現地で稼ぐ最速ルート、よくある失敗パターンまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '100万円ワーホリは可能、ただし豪・NZ・独で且つ厳格な節約必須',
              '到着後2-3ヶ月で仕事確保＋シェアハウス＋自炊が成否を分ける',
              '英・加は厳しい、推奨150-200万円',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 結論 */}
          <section id="is-100man-enough" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">100万円で本当に行ける？結論</h2>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-base text-gray-800 leading-relaxed mb-3">
                <strong className="text-amber-800">結論: 可能。ただし条件付き。</strong>
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ 渡航先：豪・NZ・独などコスト中位国</li>
                <li>✓ 出発前準備：航空券安く取れる、保険最小限</li>
                <li>✓ 到着後：シェアハウス即入居・即就活</li>
                <li>✓ 英語：最低限の会話力（時給高い仕事のため）</li>
                <li>✓ 心構え：節約マインドセット、観光モード厳禁</li>
              </ul>
            </div>
          </section>

          {/* 初期費用 */}
          <section id="initial-cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">初期費用の内訳（最低必須額）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              出発前に必ずかかる費用。これだけで70〜100万円。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">項目</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">金額</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">補足</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_COSTS.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700">{c.amount}</td>
                      <td className="border border-gray-200 px-3 py-2 text-xs text-gray-600">{c.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 国別 */}
          <section id="by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別100万円実現可能性</h2>
            <div className="space-y-3">
              {BY_COUNTRY.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{c.country}</p>
                    <p className="text-sm font-bold text-amber-700">{c.feasibility}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{c.detail}</p>
                  <p className="text-xs text-gray-500"><strong>戦略:</strong> {c.advice}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 節約戦略 */}
          <section id="saving-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">出発前の節約戦略10選</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SAVING_STRATEGY.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="ワーホリ節約術の集大成も合わせて"
            description="出発前・現地での節約20選、生活費を月10万円に抑える方法を網羅。"
            primaryHref="/wh-saving-tips"
            primaryLabel="ワーホリ節約術20選"
            secondaryHref="/wh-anxiety-and-persuasion"
            secondaryLabel="不安解消ガイド"
          />

          {/* サバイバル */}
          <section id="survive-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">現地サバイバル術</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {SURVIVE_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">💡</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 稼ぐ方法 */}
          <section id="earn-quickly" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">現地で稼ぐ最速ルート</h2>
            <div className="space-y-3">
              {EARN_QUICKLY.map((e, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{e.method}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{e.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 失敗パターン */}
          <section id="reality-check" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">100万円で失敗する人の特徴</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {FAILURE_PATTERNS.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「貯金・節約・お金・予算」関連の言及を集計。
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

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術20選</Link></li>
              <li><Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">→ 不安解消ガイド</Link></li>
              <li><Link href="/australia-jobs" className="text-primary-600 hover:underline">→ オーストラリア仕事探し方</Link></li>
              <li><Link href="/melbourne-barista" className="text-primary-600 hover:underline">→ メルボルンでバリスタ</Link></li>
              <li><Link href="/scholarship-wh" className="text-primary-600 hover:underline">→ ワーホリ奨学金</Link></li>
              <li><Link href="/budget" className="text-primary-600 hover:underline">→ 予算別の留学・WH</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
