import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'アイルランド ワーホリ完全ガイド｜費用・ビザ・仕事・31歳まで申請可',
  description: 'アイルランドのワーキングホリデーを完全解説。31歳まで申請可能（業界最高クラス）、月生活費20〜25万円、ダブリン中心の仕事事情、EU圏拠点としての魅力まで実例ベースで紹介。',
  path: '/ireland-wh',
  keywords: [
    'アイルランド ワーホリ',
    'アイルランド ワーホリ 費用',
    'アイルランド 35歳',
    'アイルランド ワーホリ ビザ',
    'ダブリン 仕事',
    'アイルランド 留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-ireland', label: 'なぜアイルランド？4つの魅力' },
  { id: 'visa', label: 'ビザ情報（31歳まで申請可）' },
  { id: 'cost', label: '費用の目安' },
  { id: 'jobs', label: '仕事事情' },
  { id: 'cities', label: 'おすすめ都市' },
  { id: 'faq', label: 'よくある質問' },
];

const FAQS = [
  {
    question: 'アイルランドワーホリの年齢制限は？',
    answer:
      '申請時点で18〜30歳。日本との協定では「申請時31歳の誕生日まで」が対象。30歳超え直前の駆け込み申請が可能なので、他国（オーストラリア除く）より範囲が広いです。',
  },
  {
    question: 'アイルランドの英語は訛りが強いと聞きますが？',
    answer:
      'ダブリン都市部のビジネス英語は標準的。地方や下町に行くとアイリッシュ英語が出てきますが、慣れの問題。むしろ多様な英語に触れられる機会としてプラス。',
  },
  {
    question: 'EU圏の旅行はワーホリビザでできる？',
    answer:
      'アイルランドはEU加盟国だが、ワーホリビザは「アイルランド国内のみ就労可」。EU他国への観光旅行は可能（90日間有効のシェンゲン圏ルールに準拠）。',
  },
  {
    question: 'ダブリンの家賃はどれくらい？',
    answer:
      'シェアハウス（個室）で月10〜15万円、スタジオで月18〜25万円。ヨーロッパの中では高めだが、ロンドンより安い。コーク・ゴールウェイなど地方都市は月7〜10万円。',
  },
  {
    question: 'アイルランドで就ける仕事は？',
    answer:
      'ホスピタリティ（パブ・カフェ・ホテル）、リテール、コールセンター、IT（テック企業の欧州本社多数）が定番。最低時給€12.70（約2,000円）。',
  },
];

export default function IrelandWhPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'アイルランド ワーホリ完全ガイド', url: '/ireland-wh' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'アイルランド ワーホリ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              アイルランド ワーホリ完全ガイド｜費用・ビザ・仕事・31歳まで申請可
            </h1>
            <ArticleMetaBadge
              readingMinutes={7}
              updatedAt="2026年5月"
              targetAudience="ヨーロッパでワーホリを検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              アイルランドは「31歳まで申請できる英語圏」という独自ポジション。
              <br />
              ヨーロッパ拠点として観光・キャリア両面で魅力的な選択肢です。
              <br />
              この記事では、ビザ・費用・仕事事情・おすすめ都市まで、アイルランドワーホリの全体像を解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '31歳まで申請可能（30歳手前の駆け込みOK）',
              '生活費月20〜25万円、ダブリンならIT・ホスピタリティの求人豊富',
              'EU圏旅行の拠点として最適、英語圏なので生活も困らない',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜアイルランド */}
          <section id="why-ireland" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜアイルランド？4つの魅力</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">① 31歳まで申請可能</h3>
                <p className="text-sm text-gray-700">業界トップクラスの年齢上限。30歳のラストチャンスの方の駆け込み先として定番。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">② 英語圏で生活コスト中レベル</h3>
                <p className="text-sm text-gray-700">イギリスより1.5割安く、オーストラリアと同等。生活費月20〜25万円が目安。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">③ Google・Facebook等のIT欧州本社集積</h3>
                <p className="text-sm text-gray-700">ダブリンはIT産業のヨーロッパ拠点。IT職種の方は現地就職も視野に。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">④ EU圏旅行の拠点として最高</h3>
                <p className="text-sm text-gray-700">アイルランドからは欧州主要都市へLCCで1〜2時間。旅好きには最高の立地。</p>
              </div>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他のヨーロッパ国とも比較したい方へ"
            description="9カ国の特徴を費用・治安・稼ぎやすさで横並び比較。"
            primaryHref="/compare/countries"
            primaryLabel="国別比較ランキング"
            secondaryHref="/matching"
            secondaryLabel="国診断をはじめる"
          />

          {/* ビザ */}
          <section id="visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザ情報（31歳まで申請可）</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・<strong>年齢</strong>: 申請時18〜30歳（31歳の誕生日前まで）</li>
              <li>・<strong>滞在期間</strong>: 最大12ヶ月</li>
              <li>・<strong>申請料</strong>: €255（約42,000円）</li>
              <li>・<strong>残高証明</strong>: €3,000以上（約50万円）</li>
              <li>・<strong>申請窓口</strong>: 在日アイルランド大使館</li>
              <li>・<strong>必要書類</strong>: パスポート・写真・履歴書・残高証明・保険証書</li>
              <li>・<strong>年間枠</strong>: 日本人向け年間400枠（先着）</li>
            </ul>
          </section>

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用の目安</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-bold mb-2">1年滞在の総費用目安（ダブリン）</p>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>・初期費用（ビザ・航空券・保険）: 30〜40万円</li>
                <li>・初月の滞在費（家賃・食費・準備）: 25〜35万円</li>
                <li>・現地での生活費（11ヶ月分）: 220〜280万円</li>
                <li className="pt-2 font-bold border-t border-gray-300">合計: 275〜355万円</li>
              </ul>
              <p className="text-xs text-gray-600 mt-3">※ 現地での給与収入で生活費を補填すれば、持ち出しは100〜150万円程度に。</p>
            </div>
          </section>

          {/* 仕事 */}
          <section id="jobs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">仕事事情</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              最低時給€12.70（約2,000円）、平均時給€14〜18。主な職種は以下。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・<strong>ホスピタリティ</strong>: パブ・カフェ・レストラン（時給€12.70〜15）</li>
              <li>・<strong>リテール</strong>: 衣料品店・スーパー（時給€12.70〜14）</li>
              <li>・<strong>コールセンター</strong>: 日本語サポート系で時給€15〜20</li>
              <li>・<strong>IT・テック</strong>: Google・Facebook等の欧州本社で時給€25〜40</li>
              <li>・<strong>日系企業</strong>: ダブリンの日系飲食店・観光業</li>
            </ul>
          </section>

          {/* 都市 */}
          <section id="cities" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">おすすめ都市</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">ダブリン（Dublin）</h3>
                <p className="text-sm text-gray-700">首都で最大の都市。求人豊富、IT産業の中心。家賃は高い（個室シェア月12〜18万円）。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">コーク（Cork）</h3>
                <p className="text-sm text-gray-700">第二の都市。ダブリンより家賃3割安く、生活費を抑えたい方向け。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">ゴールウェイ（Galway）</h3>
                <p className="text-sm text-gray-700">西部の港町。観光業の求人多数、コミュニティが小さく友達ができやすい。</p>
              </div>
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
            ※ 本記事は2026年5月時点の情報です。最新のビザ条件は在日アイルランド大使館の公式情報でご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/countries/ireland" className="text-primary-600 hover:underline">
                  → アイルランド 国別ページ
                </Link>
              </li>
              <li>
                <Link href="/30s-guide" className="text-primary-600 hover:underline">
                  → 30代ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/engineer-wh" className="text-primary-600 hover:underline">
                  → エンジニア ワーホリ戦略
                </Link>
              </li>
              <li>
                <Link href="/germany-wh" className="text-primary-600 hover:underline">
                  → ドイツ ワーホリ完全ガイド
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
