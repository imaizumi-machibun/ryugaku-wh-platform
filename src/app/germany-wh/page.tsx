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
  title: 'ドイツ ワーホリ完全ガイド｜費用・ビザ・仕事・ベルリンの魅力',
  description: 'ドイツのワーキングホリデーを完全解説。ビザ申請手順、月生活費15〜20万円、ベルリン・ミュンヘン・ハンブルクの仕事事情、ドイツ語不要OKな仕事、永住権ルートまで解説。',
  path: '/germany-wh',
  keywords: [
    'ドイツ ワーホリ',
    'ドイツ ワーホリ ビザ',
    'ドイツ 留学 費用',
    'ベルリン ワーホリ',
    'ドイツ 仕事',
    'ドイツ 永住権',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-germany', label: 'なぜドイツ？3つの魅力' },
  { id: 'visa', label: 'ドイツワーホリビザ' },
  { id: 'cost', label: '費用の目安' },
  { id: 'jobs', label: '仕事事情と日本人雇用' },
  { id: 'cities', label: 'おすすめ都市' },
  { id: 'language', label: 'ドイツ語は必要？' },
  { id: 'faq', label: 'よくある質問' },
];

const FAQS = [
  {
    question: 'ドイツワーホリの年齢制限は？',
    answer: '申請時18〜30歳。31歳の誕生日前まで申請可能。アイルランドと同じく駆け込み申請OK。',
  },
  {
    question: 'ドイツ語が話せなくても大丈夫？',
    answer: 'ベルリン・ミュンヘンの都市部なら英語だけでも生活可能。ただし仕事の選択肢を広げたいならドイツ語A2レベル以上があると有利。日系企業・英語環境の職場もあります。',
  },
  {
    question: 'ベルリンとミュンヘン、どちらがおすすめ？',
    answer: 'ベルリン：家賃やや高めだがクリエイティブ・スタートアップ天国。ミュンヘン：家賃高いが大企業（BMW・Siemens等）が多くIT・エンジニアに人気。アーティスト・自由派はベルリン、安定派はミュンヘン。',
  },
  {
    question: 'ドイツワーホリから永住権を目指せる？',
    answer: '可能です。ワーホリ→Blue Card（高度人材ビザ）→永住権という流れが定番。ITエンジニア・看護師・特定の専門職が有利。Blue Cardは年収€44,000以上で申請可。',
  },
  {
    question: 'ドイツの最低時給は？',
    answer: '2024年時点で€12.41（約2,000円）。EU内では中レベル。週20時間程度でも生活費を補填できます。',
  },
];

export default function GermanyWhPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ドイツ ワーホリ完全ガイド', url: '/germany-wh' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ドイツ ワーホリ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ドイツ ワーホリ完全ガイド｜費用・ビザ・仕事・ベルリンの魅力
            </h1>
            <ArticleMetaBadge
              readingMinutes={7}
              updatedAt="2026年5月"
              targetAudience="ヨーロッパでワーホリを検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ドイツのワーホリは「英語圏ではないけど英語で生活可能」「ヨーロッパ生活拠点として最強」「Blue Cardで永住権ルートが開ける」の3つの魅力があります。
              <br />
              この記事では、ビザ・費用・仕事・都市選びまで、ドイツワーホリの全体像を解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'ドイツは生活費月15〜20万円とヨーロッパの中で抑えやすい',
              'ベルリンはスタートアップ天国、ミュンヘンは大企業集積',
              'Blue Cardルートで永住権も視野',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜドイツ */}
          <section id="why-germany" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜドイツ？3つの魅力</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">① ヨーロッパで生活費が安い</h3>
                <p className="text-sm text-gray-700">月15〜20万円で生活可。フランス・イギリス・アイルランドより1〜2割安い。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">② ベルリン＝スタートアップ天国</h3>
                <p className="text-sm text-gray-700">クリエイティブ職・テック職の若者が世界中から集まる。英語環境で働ける。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">③ Blue Card→永住権ルート</h3>
                <p className="text-sm text-gray-700">ワーホリ→現地就職→Blue Card→33ヶ月で永住権申請可能（ドイツ語B1必要）。長期キャリア形成も可。</p>
              </div>
            </div>
          </section>

          {/* ビザ */}
          <section id="visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ドイツワーホリビザ</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・<strong>年齢</strong>: 申請時18〜30歳</li>
              <li>・<strong>滞在期間</strong>: 最大12ヶ月</li>
              <li>・<strong>申請料</strong>: €75（約12,500円）</li>
              <li>・<strong>残高証明</strong>: €2,000以上（約33万円）</li>
              <li>・<strong>申請窓口</strong>: 在日ドイツ大使館（東京）or 総領事館（大阪）</li>
              <li>・<strong>必要書類</strong>: パスポート・写真・履歴書・残高証明・保険証書・申請理由書</li>
              <li>・<strong>就労制限</strong>: 同一雇用主のもとで6ヶ月まで（同じ会社で1年は不可）</li>
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="アイルランド・ドイツ・カナダで迷っている方へ"
            description="9カ国の特徴を費用・治安・稼ぎやすさで横並び比較できます。"
            primaryHref="/compare/countries"
            primaryLabel="国別比較ランキング"
            secondaryHref="/matching"
            secondaryLabel="国診断をはじめる"
          />

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用の目安</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-bold mb-2">1年滞在の総費用目安（ベルリン）</p>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>・初期費用（ビザ・航空券・保険）: 25〜35万円</li>
                <li>・初月の滞在費: 18〜25万円</li>
                <li>・現地での生活費（11ヶ月）: 165〜220万円</li>
                <li className="pt-2 font-bold border-t border-gray-300">合計: 210〜280万円</li>
              </ul>
              <p className="text-xs text-gray-600 mt-3">※ 現地給与で生活費を補填すれば、持ち出しは80〜130万円程度に。</p>
            </div>
          </section>

          {/* 仕事 */}
          <section id="jobs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">仕事事情と日本人雇用</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・<strong>ホスピタリティ</strong>: ベルリンの日系レストラン・カフェ多数</li>
              <li>・<strong>IT・スタートアップ</strong>: ベルリンのスタートアップで英語のみで採用される企業も</li>
              <li>・<strong>ものづくり・エンジニアリング</strong>: ミュンヘンに大企業集積、専門スキルあれば高時給</li>
              <li>・<strong>日本企業のドイツ拠点</strong>: BMW・トヨタ・ソニーなどでバイリンガル人材需要</li>
              <li>・<strong>日本語教師</strong>: 大学・語学学校で需要</li>
            </ul>
          </section>

          {/* 都市 */}
          <section id="cities" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">おすすめ都市</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">ベルリン</h3>
                <p className="text-sm text-gray-700">アーティスト・クリエイティブ・スタートアップ天国。家賃月8〜12万円（シェア）。英語で生活可。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">ミュンヘン</h3>
                <p className="text-sm text-gray-700">バイエルン州の中心都市。大企業多くIT・エンジニア向け。家賃高め（シェア月12〜18万円）。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">ハンブルク</h3>
                <p className="text-sm text-gray-700">港町で物流・貿易産業強い。家賃中レベル、生活コスト安め。</p>
              </div>
            </div>
          </section>

          {/* 言語 */}
          <section id="language" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ドイツ語は必要？</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              都市部（特にベルリン）なら英語のみでも生活可能。ただし仕事の選択肢を広げる・現地コミュニティに溶け込みたい場合はドイツ語A2レベル以上があると有利。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              <li>・<strong>A1〜A2</strong>: 基本的な会話・買い物。語学学校で2〜3ヶ月で到達可能</li>
              <li>・<strong>B1</strong>: 一般職種で働ける目安。Blue Card申請にも有利</li>
              <li>・<strong>B2以上</strong>: 専門職・大学進学レベル</li>
            </ul>
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
            ※ 本記事は2026年5月時点の情報です。最新のビザ条件は在日ドイツ大使館でご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/countries/germany" className="text-primary-600 hover:underline">
                  → ドイツ 国別ページ
                </Link>
              </li>
              <li>
                <Link href="/engineer-wh" className="text-primary-600 hover:underline">
                  → エンジニア ワーホリ戦略
                </Link>
              </li>
              <li>
                <Link href="/ireland-wh" className="text-primary-600 hover:underline">
                  → アイルランド ワーホリ
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
