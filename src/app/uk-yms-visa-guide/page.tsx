import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { isPublished } from '@/lib/publish/schedule';

const PAGE_PATH = '/uk-yms-visa-guide';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'イギリス YMS（ユース モビリティ）ビザ完全ガイド｜抽選・申請・費用',
  description: 'イギリスのワーホリ相当ビザ「YMS（Youth Mobility Scheme）」の申請手順を完全解説。抽選の仕組み、年間1,500枠の競争率、必要書類、費用15万円超、最大2年滞在の使い方まで実例ベースで解説。',
  path: PAGE_PATH,
  keywords: [
    'イギリス YMS ビザ',
    'YMS 抽選',
    'イギリス ワーホリ',
    'UK YMS',
    'Youth Mobility Scheme',
    'イギリス ビザ 申請',
    'ロンドン ワーホリ',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: 'YMSとは？オーストラリア・カナダとの違い' },
  { id: 'lottery', label: '年2回の抽選と倍率の実態' },
  { id: 'requirements', label: '応募条件と必要書類' },
  { id: 'cost', label: '申請費用と滞在費' },
  { id: 'steps', label: '申請から渡英までの8ステップ' },
  { id: 'after-arrival', label: '渡英後にやること' },
  { id: 'where-to-go', label: 'ロンドン以外のおすすめ都市' },
  { id: 'faq', label: 'よくある質問' },
];

const STEPS = [
  { num: 1, title: '年2回の抽選エントリー（1月・7月）', detail: 'gov.uk経由でオンライン応募。氏名・パスポート番号・誕生日のみで応募可能。' },
  { num: 2, title: '抽選結果通知（応募から2週間以内）', detail: 'メールで「You have been selected」と通知。当選後30日以内に申請開始が必要。' },
  { num: 3, title: 'オンライン申請＋費用支払い', detail: 'gov.uk のVisa Application Centreで申請。費用とIHS（医療費負担金）を同時支払い。' },
  { num: 4, title: 'バイオメトリクス（生体情報）登録', detail: '東京・大阪のVAC（ビザ申請センター）で指紋・写真撮影。事前予約必須。' },
  { num: 5, title: '書類提出', detail: 'パスポート・残高証明・抽選結果通知をVACに提出 or 郵送。' },
  { num: 6, title: '審査（通常3週間）', detail: '審査結果のメール待ち。承認されればパスポート＋ビザシール返送。' },
  { num: 7, title: 'BRP（生体認証ID）の受け取り準備', detail: '入国後10日以内にBRPを指定郵便局で受け取る必要あり。' },
  { num: 8, title: '渡英＋BRP受け取り', detail: '入国時にパスポートとビザを提示。指定郵便局でBRPを受け取って完了。' },
];

const FAQS = [
  {
    question: 'YMSの当選確率はどれくらい？',
    answer:
      '日本人向け年間枠は1,500人。応募者数は毎年2,000〜4,000人と推定され、倍率1.5〜3倍。1月・7月の年2回応募可能なので、外れても次回再応募できます。',
  },
  {
    question: 'なぜYMS応募者数は公開されない？',
    answer:
      'UK政府は応募者総数を公式に発表していません。SNSや留学エージェントの統計では「日本人は当選率比較的高い」と言われ、しっかり書類が揃っていれば当選可能性は高いとされます。',
  },
  {
    question: 'IHSとは？',
    answer:
      'Immigration Health Surcharge（移民健康サーチャージ）。UK滞在中のNHS（国民保健サービス）利用権の事前支払い。年間£776（約14万円）、2年で£1,552（約28万円）。申請時に一括で支払う必要あり。',
  },
  {
    question: 'YMSビザで取れる仕事は？',
    answer:
      '原則どんな仕事もOK（医療・公務員など一部除く）。ホスピタリティ（パブ・カフェ・レストラン）、リテール、コールセンター、IT・クリエイティブ系まで幅広い。最低時給£11.44（2024年4月時点、約2,150円）。',
  },
  {
    question: 'BRPは何？必ず受け取らないとダメ？',
    answer:
      'Biometric Residence Permit。UK滞在の身分証となるカード。入国後10日以内に指定郵便局で受け取り必須。受け取らないとビザ違反となり、その後の更新やUK内移動で問題が発生します。',
  },
];

export default async function UkYmsVisaGuidePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'イギリス YMS ビザ完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'イギリス YMS ビザ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              イギリス YMS ビザ完全ガイド｜抽選・申請・費用・最大2年滞在
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="イギリス渡航を検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              イギリスにはワーホリ協定がない代わりに、「YMS（Youth Mobility Scheme）」というワーホリ相当のビザがあります。
              <br />
              特徴は「年2回の抽選制」「最大2年滞在可能」「申請費用15万円超と高め」の3点。
              <br />
              この記事では、抽選の仕組み・申請手順・費用・渡英後にやること・ロンドン以外のおすすめ都市まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'YMSは年2回（1月・7月）の抽選制、日本人年間枠1,500人',
              '申請費用約£298＋IHS £1,552（2年分）＝総額約42万円',
              '最大2年滞在可能、ロンドン以外の都市（マンチェスター等）も狙い目',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 概要 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">YMSとは？オーストラリア・カナダとの違い</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              YMS（Youth Mobility Scheme）は、イギリスのワーホリ相当ビザ。EU離脱後、英国に若年層を呼び込むためのプログラムです。日本との協定で、年間1,500人の枠が設定されています。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold">項目</th>
                    <th className="px-3 py-3 font-semibold text-center">🇬🇧 YMS</th>
                    <th className="px-3 py-3 font-semibold text-center">🇦🇺 ワーホリ</th>
                    <th className="px-3 py-3 font-semibold text-center">🇨🇦 IEC</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: '滞在期間', uk: '最大2年', au: '最大1年（延長可）', ca: '1〜2年' },
                    { item: '申請方式', uk: '年2回抽選', au: '随時申請', ca: '抽選制' },
                    { item: '年齢制限', uk: '18〜30歳', au: '18〜30歳（一部35歳）', ca: '18〜30歳' },
                    { item: '申請費用', uk: '約42万円（IHS込）', au: '約4.8万円', ca: '約3万円' },
                    { item: '就労制限', uk: '原則制限なし', au: '同一雇用主6ヶ月', ca: '制限なし' },
                  ].map((r, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium">{r.item}</td>
                      <td className="px-3 py-3 text-center text-xs">{r.uk}</td>
                      <td className="px-3 py-3 text-center text-xs">{r.au}</td>
                      <td className="px-3 py-3 text-center text-xs">{r.ca}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ YMSは費用が高い分、2年滞在と原則就労制限なしのメリットあり。
            </p>
          </section>

          {/* 抽選 */}
          <section id="lottery" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">年2回の抽選と倍率の実態</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              YMSは1月と7月に各750人ずつ、年間1,500人の枠を抽選で配分。応募はオンラインで簡単（氏名・パスポート番号・誕生日のみ）。当選通知は応募から2週間以内にメールで届きます。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>💡 当選率を上げるコツ</strong>: (1) 1月・7月の応募開始日にすぐ応募（締切は数日以内）、(2) 外れたら次回再応募、(3) 抽選後30日以内に申請完了する準備を事前に整えておく。
              </p>
            </div>
          </section>

          {/* 応募条件 */}
          <section id="requirements" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募条件と必要書類</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・<strong>年齢</strong>: 申請時18〜30歳（31歳の誕生日前まで）</li>
              <li>・<strong>残高証明</strong>: £2,530以上（約47万円相当）。申請日から28日以上前の最終残高</li>
              <li>・<strong>パスポート</strong>: 残存期間6ヶ月以上</li>
              <li>・<strong>健康診断書</strong>: 一部条件で必要（過去にUKや特定国に長期滞在歴がある場合）</li>
              <li>・<strong>結核検査証明書</strong>: 過去6ヶ月以内にUK指定機関で受診（特定国経由の渡英者向け）</li>
              <li>・<strong>抽選当選通知</strong>: メールのプリントアウト</li>
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="アイルランドも視野に入れたい方へ"
            description="UKと地理的に近いアイルランド（31歳まで申請可）も比較対象に。"
            primaryHref="/ireland-wh"
            primaryLabel="アイルランド ワーホリ完全ガイド"
            secondaryHref="/compare/countries"
            secondaryLabel="国別比較ランキング"
          />

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申請費用と滞在費</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold">項目</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">金額</th>
                    <th className="px-3 py-3 font-semibold">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: '申請料', cost: '£298（約55,000円）', note: 'gov.ukで支払い' },
                    { item: 'IHS（移民健康サーチャージ）', cost: '£1,552（約28万円）', note: '2年分一括支払い' },
                    { item: 'バイオメトリクス費用', cost: '£19.20（約3,500円）', note: 'VACで支払い' },
                    { item: 'TLS（VAC手数料）', cost: '£55〜（約10,000円）', note: '東京/大阪VACで支払い' },
                    { item: '渡航費（航空券）', cost: '15〜30万円', note: '時期により変動' },
                    { item: '初期滞在費（ロンドン1ヶ月）', cost: '40〜60万円', note: '家賃・保証金・食費' },
                  ].map((r, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium">{r.item}</td>
                      <td className="px-3 py-3 text-xs">{r.cost}</td>
                      <td className="px-3 py-3 text-xs">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ ビザ関連費用合計約42万円、初期費用全部で約100万円が必要。
            </p>
          </section>

          {/* ステップ */}
          <section id="steps" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申請から渡英までの8ステップ</h2>
            <ol className="space-y-3">
              {STEPS.map((s) => (
                <li key={s.num} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                  <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold">
                    {s.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1 text-base">{s.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 渡英後 */}
          <section id="after-arrival" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">渡英後にやること</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              <li>・入国後10日以内に指定郵便局でBRP（Biometric Residence Permit）を受け取る</li>
              <li>・National Insurance Number（NIN）を申請（仕事に必須）</li>
              <li>・銀行口座開設（Monzo・Revolut等のオンライン銀行が便利）</li>
              <li>・GP（家庭医）に登録（NHSを使うため）</li>
              <li>・住居の確定（初期はAirbnbや短期ホステル→シェアハウス）</li>
              <li>・SIMカード契約（GiffGaff・Vodafone等）</li>
            </ul>
          </section>

          {/* 都市選択 */}
          <section id="where-to-go" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ロンドン以外のおすすめ都市</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ロンドンは家賃高すぎ問題があります。生活費を抑えたいなら地方都市も検討を。
            </p>
            <div className="space-y-3">
              {[
                { city: 'マンチェスター', detail: 'ロンドンの半額の家賃・スポーツ・音楽の街。ホスピタリティ求人多数。' },
                { city: 'エディンバラ（スコットランド）', detail: '古城と自然・観光業強い。家賃ロンドンの60%。' },
                { city: 'ブリストル', detail: 'クリエイティブ・テック企業集積。学生街で活気あり。' },
                { city: 'リバプール', detail: '音楽・サッカーの街。家賃ロンドンの50%。' },
                { city: 'ブライトン', detail: 'ロンドンから電車1時間の海辺の街。LGBTQフレンドリー。' },
              ].map((c) => (
                <div key={c.city} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1">{c.city}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
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

          <p className="text-xs text-gray-500 mb-8">
            ※ 本記事は2026年5月時点の情報です。最新のビザ条件・費用は<a href="https://www.gov.uk/youth-mobility" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">gov.uk公式サイト</a>でご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/countries/united-kingdom" className="text-primary-600 hover:underline">
                  → イギリス 国別ページ
                </Link>
              </li>
              <li>
                <Link href="/countries/ireland/working-holiday" className="text-primary-600 hover:underline">
                  → アイルランド ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/canada-iec-visa" className="text-primary-600 hover:underline">
                  → カナダ IEC ビザ申請ガイド
                </Link>
              </li>
              <li>
                <Link href="/compare/countries" className="text-primary-600 hover:underline">
                  → 国別比較ランキング
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合う国
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
