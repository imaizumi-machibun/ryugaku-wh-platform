import type { Metadata } from 'next';
import Link from 'next/link';
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

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ節約術20選｜現地で月5万円削減できる実践テクニック',
  description: 'ワーキングホリデーの生活費を月5万円削減できる実践節約術20選。食費・住居・通信・交通・娯楽の5カテゴリで、すぐ実行できるテクニックを実渡航者の体験談ベースで解説。',
  path: '/wh-saving-tips',
  keywords: [
    'ワーホリ 節約術',
    'ワーホリ 生活費 削減',
    'ワーホリ 安く 生活',
    'ワーホリ 食費 節約',
    'ワーホリ 家賃 節約',
    'ワーホリ お金 節約',
  ],
});

const TOC_HEADINGS = [
  { id: 'food', label: '食費の節約（5選）' },
  { id: 'housing', label: '住居費の節約（5選）' },
  { id: 'communication', label: '通信費の節約（4選）' },
  { id: 'transport', label: '交通費の節約（3選）' },
  { id: 'leisure', label: '娯楽・その他の節約（3選）' },
  { id: 'experiences', label: '体験談から見る節約の工夫' },
  { id: 'faq', label: 'よくある質問' },
];

const CATEGORIES = [
  {
    id: 'food',
    title: '食費の節約（5選）',
    saving: '月2〜3万円削減目安',
    tips: [
      { num: 1, title: '自炊メイン化（外食週1〜2回まで）', detail: '外食1食AUD20〜30に対して自炊なら1食5〜8AUDで済む。週6日自炊で月3万円以上の差。' },
      { num: 2, title: 'アジア系スーパーで食材調達', detail: 'Asian Grocery系の店は野菜・米・調味料が一般スーパーの半額。日本食材も含めて節約効果大。' },
      { num: 3, title: '冷凍野菜・冷凍肉の活用', detail: '生鮮品より3割安く、ロス（廃棄）がゼロ。週末まとめ買い→冷凍ストックが定番。' },
      { num: 4, title: 'ハッピーアワー・閉店前の値引きを狙う', detail: 'スーパーの値引きシール時間（夕方〜閉店前）、カフェのハッピーアワー（14〜17時）を活用。' },
      { num: 5, title: '職場のまかない・余り物をもらう', detail: 'カフェ・レストランの仕事ならまかない付きの店舗を選ぶ。食費が実質ゼロになる場合も。' },
    ],
  },
  {
    id: 'housing',
    title: '住居費の節約（5選）',
    saving: '月3〜5万円削減目安',
    tips: [
      { num: 6, title: 'シェアハウスのリビング部屋（Lounge Room）を選ぶ', detail: 'プライベートルームより週20〜40豪ドル安い。バックパッカー卒業後の最初の選択肢として定番。' },
      { num: 7, title: '少し郊外のエリアに住む', detail: '都市中心部から電車30分のエリアは家賃が3割安い。通勤時間とのトレードオフで判断。' },
      { num: 8, title: 'シェアハウスで「Cleaning duty」を引き受け、家賃割引', detail: '掃除当番を引き受けて週10〜20豪ドル家賃割引、という交渉も可能。家主と相談を。' },
      { num: 9, title: 'House Sittingで一時的に無料滞在', detail: '長期旅行する家主の家を留守番。サイト「Trusted Housesitters」で物件多数。生活費ゼロ期間を作れる。' },
      { num: 10, title: '光熱費込み物件を選ぶ', detail: '一見高くても、別途光熱費（月50〜100豪ドル）が含まれていれば結果的にお得。契約時に確認。' },
    ],
  },
  {
    id: 'communication',
    title: '通信費の節約（4選）',
    saving: '月3,000〜8,000円削減目安',
    tips: [
      { num: 11, title: 'プリペイドSIMで月20〜30豪ドル以内', detail: 'AmaysimやBoost MobileのプリペイドSIMで月25豪ドル、10〜30GBが定番。契約縛りなし。' },
      { num: 12, title: '日本のスマホは解約 or 一時休止', detail: '通信会社の「海外渡航中の休止サービス」で基本料金を月100円程度に抑える。' },
      { num: 13, title: 'WhatsApp・LINEで国際通話', detail: '電話料金はゼロ。Wi-Fi環境ならすべての通信が無料に。家族との連絡もこれで十分。' },
      { num: 14, title: '無料Wi-Fiスポットを活用', detail: 'カフェ・図書館・ショッピングモールの無料Wi-Fiでデータ消費を抑える。' },
    ],
  },
  {
    id: 'transport',
    title: '交通費の節約（3選）',
    saving: '月5,000〜15,000円削減目安',
    tips: [
      { num: 15, title: '定期券（Weekly/Monthly Pass）を購入', detail: '都市部の公共交通機関は週・月単位の定期券で1回券の半額。Opal Card等のチャージ式も活用。' },
      { num: 16, title: '自転車通勤・通学に切り替え', detail: '中古自転車（100〜200豪ドル）を購入すれば交通費がほぼゼロ。健康にも◎。' },
      { num: 17, title: 'カーシェアリングを活用（必要なときだけ）', detail: '車を所有する必要がある場面（週末旅行など）はGoGetやTuro等のカーシェアで時間貸し。' },
    ],
  },
  {
    id: 'leisure',
    title: '娯楽・その他の節約（3選）',
    saving: '月5,000〜10,000円削減目安',
    tips: [
      { num: 18, title: '無料イベント・公園を楽しむ', detail: '都市の無料コンサート・ビーチ・ハイキング・美術館の無料日を活用。Meetupで無料コミュニティに参加。' },
      { num: 19, title: '中古品（Gumtree・Facebook Marketplace）で家具調達', detail: '引っ越し時に必要な家具・家電は中古で揃える。卒業シーズン後（11〜12月）は掘り出し物多数。' },
      { num: 20, title: 'クレジットカードのキャッシュバック・ポイント還元', detail: '海外ATMの手数料・両替手数料を節約するため、Wiseデビット＋還元率の高いクレカを併用。' },
    ],
  },
];

const FAQS = [
  {
    question: 'ワーホリで月いくら節約できますか？',
    answer:
      'すべての節約術を実践した場合、月5〜10万円の削減が現実的です。特に食費と住居費の2つが最大の削減ポイント。年間で60〜120万円の差になります。',
  },
  {
    question: '節約しすぎて生活がつまらなくなりませんか？',
    answer:
      'バランスが大事。「食費・住居費・通信費」のような必須コストは徹底節約し、「旅行・娯楽・友達との外食」はメリハリをつけて使う、というスタイルがおすすめ。「節約のために楽しみを我慢」はメンタルに悪影響。',
  },
  {
    question: 'シェアハウスの家賃交渉は本当にできる？',
    answer:
      'できます。長期契約（3ヶ月以上）の確約と引き換えに、週10〜20豪ドル割引を引き出す例は多いです。「Cleaning duty」「庭仕事」などの役割を引き受ける条件で家賃割引もよくあるパターン。',
  },
  {
    question: '日本食材は高いから諦めるべき？',
    answer:
      '完全に諦めるとストレスになるので、「アジア系スーパーで安く買える日本食材」（米・醤油・味噌・乾物）に絞って利用。高級日本食材店はたまの贅沢用。',
  },
  {
    question: 'カフェのまかないってどのくらいの価値ですか？',
    answer:
      'シフトごとに食事1〜2食が提供される店舗が多く、月15〜25食。食費換算で月3〜5万円相当の節約に。仕事選びの基準の1つに「まかない有無」を入れるとお得。',
  },
];

export default async function WhSavingTipsPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(節約|安く|抑え|シェア|まかない|自炊|中古)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(節約|安く|抑え|シェア|まかない|自炊|中古)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ節約術20選', url: '/wh-saving-tips' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ節約術20選' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリ節約術20選｜現地で月5万円削減できる実践テクニック
            </h1>
            <ArticleMetaBadge
              readingMinutes={8}
              updatedAt="2026年5月"
              targetAudience="ワーホリ中の生活費を抑えたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリの生活費は、工夫次第で月5〜10万円も差が出ます。
              <br />
              食費・住居費・通信費・交通費・娯楽の5カテゴリで、すぐ実行できる20の節約術を、実渡航者の体験談ベースでまとめました。
              全部やれば年間60〜120万円の差に。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '5カテゴリ（食・住・通信・交通・娯楽）の実践節約20選',
              '最も効果が大きい食費・住居費で月5万円削減のテクニック',
              '体験談から見る現地での節約の工夫',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* カテゴリ別Tips */}
          {CATEGORIES.map((cat) => (
            <section key={cat.id} id={cat.id} className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{cat.title}</h2>
              <p className="text-xs text-primary-700 font-semibold mb-4">{cat.saving}</p>
              <div className="space-y-3">
                {cat.tips.map((t) => (
                  <div key={t.num} className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold mb-2 text-base flex items-start gap-2">
                      <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold mt-0.5">
                        {t.num}
                      </span>
                      <span>{t.title}</span>
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{t.detail}</p>
                  </div>
                ))}
              </div>
              {cat.id === 'housing' && (
                <div className="mt-6">
                  <MidCTA
                    title="住居選びをもっと詳しく比較したい方へ"
                    description="ホームステイ・シェアハウス・寮の3タイプを8項目で徹底比較しています。"
                    primaryHref="/housing-comparison"
                    primaryLabel="住居タイプ比較を見る"
                    secondaryHref="/budget"
                    secondaryLabel="費用比較ガイド"
                  />
                </div>
              )}
            </section>
          ))}

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見る節約の工夫</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              実渡航者の体験談から、節約に関する言及を集計しました。
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{mentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {mentions.containsCount}件</strong>
                （{mentions.percentage}%）が節約・自炊・シェアなどの工夫について言及していました。
              </p>
              <p className="text-xs text-gray-500">
                ※ advice/pros/cons から「節約/安く/抑え/シェア/まかない/自炊/中古」のいずれかを含む体験談（参考値）。
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
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/wise-payment-guide" className="text-primary-600 hover:underline">
                  → Wise・クレカ・両替ガイド
                </Link>
              </li>
              <li>
                <Link href="/housing-comparison" className="text-primary-600 hover:underline">
                  → 住居タイプ比較
                </Link>
              </li>
              <li>
                <Link href="/australia-jobs" className="text-primary-600 hover:underline">
                  → オーストラリア仕事探し方
                </Link>
              </li>
              <li>
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語話せなくてもワーホリ
                </Link>
              </li>
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための教訓
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
