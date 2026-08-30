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

const PAGE_PATH = '/wh-online-business';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外でオンラインビジネス完全ガイド｜ノマド・フリーランス・税金',
  description: 'ワーホリ・留学中の海外オンラインビジネス完全ガイド。フリーランス・ノマド、おすすめ職種、税金、Wise/銀行、ノマドビザ国まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    '海外 オンラインビジネス',
    '海外 フリーランス',
    'デジタルノマド',
    'ノマドビザ',
    '海外 リモートワーク',
    'ワーホリ 副業',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-online', label: 'なぜ海外オンラインビジネスか' },
  { id: 'top-jobs', label: 'おすすめオンライン職種10選' },
  { id: 'nomad-visa', label: 'ノマドビザ対応国一覧' },
  { id: 'banking-payment', label: '銀行・決済・Wise活用' },
  { id: 'tax-rules', label: '税金ルール（日本＋現地）' },
  { id: 'visa-compliance', label: 'WHV/学生ビザでのオンライン就労' },
  { id: 'top-cities', label: 'ノマド向け都市5選' },
  { id: 'success-tips', label: '成功する7つのコツ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TOP_JOBS = [
  { job: '①Web開発・プログラミング', hourly: '$30-100', detail: 'React/Node.js等のフリーランス、Upwork・Toptal等' },
  { job: '②Webデザイン・グラフィック', hourly: '$25-80', detail: 'Figma/Photoshop、ポートフォリオサイトから受注' },
  { job: '③コンテンツライティング', hourly: '$15-50', detail: '日英バイリンガル記事、SEO記事、ブログ' },
  { job: '④翻訳・通訳', hourly: '$20-60', detail: '日英翻訳、専門分野（IT・医療・法務）で高単価' },
  { job: '⑤動画編集', hourly: '$20-60', detail: 'YouTubeチャンネル支援、Premiere Pro/Final Cut' },
  { job: '⑥SNS運用代行', hourly: '$15-40', detail: 'Instagram・TikTok運用、コミュニティ管理' },
  { job: '⑦オンライン日本語講師', hourly: '$15-30', detail: 'italki・Preply・Cafetalk経由、海外学生向け' },
  { job: '⑧バーチャルアシスタント', hourly: '$15-35', detail: '事務作業・スケジュール管理、米国クライアント中心' },
  { job: '⑨EC運営（個人輸出入）', hourly: '時給換算困難', detail: 'Amazon・Shopify、海外向け日本商品' },
  { job: '⑩ブログ・YouTube収益化', hourly: '時給換算困難', detail: '長期収益化、アフィリエイト・広告収入' },
];

const NOMAD_VISA_COUNTRIES = [
  { country: 'ポルトガル', visa: 'Digital Nomad Visa', detail: '月収€3,280以上、1年（更新可）' },
  { country: 'スペイン', visa: 'Digital Nomad Visa', detail: '月収€2,520以上、1年（最大5年）' },
  { country: 'エストニア', visa: 'Digital Nomad Visa', detail: '月収€4,500以上、1年' },
  { country: 'ドバイ', visa: 'Remote Work Visa', detail: '月収$5,000以上、1年' },
  { country: 'バリ（インドネシア）', visa: 'Second Home Visa', detail: '5-10年滞在可、$130,000投資' },
  { country: 'タイ', visa: 'Long-Term Resident', detail: '月収$80,000/年以上、10年滞在可' },
];

const BANKING_PAYMENT = [
  'Wise（旧TransferWise）：多通貨口座、為替手数料最安、必須ツール',
  'Revolut：欧州中心、暗号資産対応、無料カード発行',
  'PayPal：受取手数料高いがグローバル標準',
  'Stripe：自分のサイトで決済受付、開発者向け',
  '日本銀行口座（住民票残し）：日本円受取・送金、税金処理に必要',
  '日本クレカ（楽天・三井住友等）：海外でも使用、ポイント還元',
];

const TAX_RULES = [
  '日本居住者：全世界所得が日本所得税の対象、確定申告必須',
  '非居住者（海外1年超滞在＋転出届）：海外所得は日本非課税',
  '現地国の税金：滞在国の税法による、観光ビザはグレーゾーン',
  '租税条約活用：日本と渡航先間で二重課税回避',
  'マイナンバー・確定申告：日本居住期間中の所得は確定申告',
  '税理士相談推奨：海外オンラインビジネスの税務は複雑',
];

const VISA_COMPLIANCE = [
  'WHV：基本的に「現地の雇用主」での就労、オンラインフリーランスはグレー',
  '学生ビザ：週20時間制限、オンライン副業の扱いは要確認',
  'ノマドビザ：オンライン労働専用ビザ、合法的に長期滞在可',
  '観光ビザ：「労働」とみなされる場合、ビザ違反リスク',
  '一般的見解：日本クライアント向けのオンライン業務は「日本国内労働」扱いで多くの国でOK',
  '不安なら現地弁護士相談、ビザ違反は将来の入国拒否リスク',
];

const TOP_CITIES = [
  { city: 'リスボン（ポルトガル）', detail: '物価安・治安◎・気候温暖、Digital Nomad Visa対応' },
  { city: 'バリ（インドネシア）', detail: 'コワーキングスペース充実、低生活費、コミュニティ大' },
  { city: 'バンコク（タイ）', detail: '物価超安、ノマドメッカ、英語通用' },
  { city: 'ベルリン（ドイツ）', detail: 'スタートアップ文化、欧州拠点、Tech Hub' },
  { city: 'メキシコシティ', detail: '物価安・治安改善・米国時差近、ラテン文化体験' },
];

const SUCCESS_TIPS = [
  '出発前にクライアント1-2社確保、月収最低$2,000の見通し',
  'スキル特化：何でも屋ではなく「日英バイリンガル×Web開発」等の組み合わせ',
  'ポートフォリオサイト＋LinkedIn整備、専門性を可視化',
  '時差管理：日本・米国・欧州のクライアントとの調整スキル',
  'コミュニティ参加：Meetup・コワーキング・ノマド向けFB groups',
  '健康管理：座り仕事＋孤独感対策、定期運動＋オフライン交流',
  '収入の波対策：複数収入源＋6ヶ月の生活費貯金',
];

const FAQS = [
  {
    question: 'WHVでオンラインビジネスは合法？',
    answer:
      'グレーゾーン。WHVは原則「現地雇用主での就労」を想定、日本クライアント向けのオンライン業務は「現地での労働ではない」と解釈する人多。明確な禁止条文はないが、税務・ビザ違反リスクを避けるなら、ノマドビザ取得国への移動も選択肢。',
  },
  {
    question: 'いくらから始められる？',
    answer:
      '初期投資ほぼゼロ。PC・ネット環境＋Wise/PayPalアカウントがあれば即開始可。最初の数ヶ月は月収$500-2,000レベル、軌道に乗れば月収$3,000-10,000＋も可能。SkillShare・Udemy等のスキル学習投資は推奨。',
  },
  {
    question: '英語苦手でもできる？',
    answer:
      '可能。日本クライアント向けの業務（日本語コンテンツ作成・翻訳・日英バイリンガルサポート等）なら英語必要なし。海外クライアント向けはビジネス英語必須、IELTS 6.5+程度が目安。',
  },
  {
    question: '税金処理が複雑そう、どうする？',
    answer:
      '海外ノマドの税務は確かに複雑。①日本の住民票・税法上の居住者扱いを明確化、②海外滞在期間で居住者/非居住者判定、③現地国の税法確認、④租税条約活用で二重課税回避。海外ノマド特化の税理士（クラウド会計freee等で紹介可）に相談がおすすめ。',
  },
  {
    question: 'ノマドビザ取得すべき？',
    answer:
      '長期（1年超）海外オンラインビジネス志向なら強く推奨。ノマドビザは合法的就労＋税務クリア＋現地公的サービス利用可。ポルトガル・スペイン・エストニア・ドバイが主要選択肢、月収€2,500-4,500の証明が必要。',
  },
];

export default async function WhOnlineBusinessPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(オンライン|リモート|フリーランス|ノマド|nomad|remote)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(オンライン|リモート|フリーランス|ノマド|nomad|remote)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外でオンラインビジネス完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外でオンラインビジネス完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外でオンラインビジネス完全ガイド｜ノマド・フリーランス・税金
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="海外でリモートワーク・フリーランスを始めたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              リモートワーク・デジタルノマドの普及で、海外でオンラインビジネスを営みながら世界を旅する人が急増。ワーホリ・留学中の収入源としても活用可能、ノマドビザ取得国も拡大中。
              <br />
              この記事では職種、ノマドビザ、税金、銀行、おすすめ都市、成功のコツまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'おすすめ職種10選、月収$2,000-10,000+を狙える',
              'ノマドビザ対応国が拡大、合法的長期滞在可',
              '税務処理複雑、海外ノマド特化税理士相談推奨',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-online" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ海外オンラインビジネスか</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・住む場所に縛られず働ける究極の自由</li>
              <li>・物価安国に住みながら高単価通貨で稼ぐ</li>
              <li>・ワーホリ・留学中の収入源としても活用可</li>
              <li>・キャリアの選択肢（フリーランス・起業・正社員）</li>
              <li>・グローバルクライアントとの取引で英語＋ビジネス力UP</li>
              <li>・将来の独立・起業の基盤構築</li>
            </ul>
          </section>

          {/* 職種 */}
          <section id="top-jobs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">おすすめオンライン職種10選</h2>
            <div className="space-y-3">
              {TOP_JOBS.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{j.job}</p>
                    <p className="text-sm font-bold text-amber-700">{j.hourly}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{j.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ノマドビザ */}
          <section id="nomad-visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ノマドビザ対応国一覧</h2>
            <div className="space-y-3">
              {NOMAD_VISA_COUNTRIES.map((n, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{n.country}</p>
                    <p className="text-sm font-bold text-amber-700">{n.visa}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{n.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 銀行 */}
          <section id="banking-payment" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">銀行・決済・Wise活用</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {BANKING_PAYMENT.map((b, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">💳</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="海外IT エンジニア・銀行口座開設も合わせて"
            description="フリーランス・正社員両方の選択肢、海外口座開設手順も確認。"
            primaryHref="/wh-tech-engineer"
            primaryLabel="海外ITエンジニア"
            secondaryHref="/banking-overseas"
            secondaryLabel="海外銀行口座開設"
          />

          {/* 税金 */}
          <section id="tax-rules" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">税金ルール（日本＋現地）</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {TAX_RULES.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">💰</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ビザコンプラ */}
          <section id="visa-compliance" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">WHV/学生ビザでのオンライン就労</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {VISA_COMPLIANCE.map((v, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">⚠️</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* おすすめ都市 */}
          <section id="top-cities" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ノマド向け都市5選</h2>
            <div className="space-y-3">
              {TOP_CITIES.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{c.city}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 成功のコツ */}
          <section id="success-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">成功する7つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SUCCESS_TIPS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「オンライン・リモート・フリーランス・ノマド」関連の言及を集計。
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
            ※ ビザ・税制度・通貨は2026年5月時点の情報です。最新情報は各国移民局公式情報、海外ノマド特化税理士へのご相談を推奨します。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-tech-engineer" className="text-primary-600 hover:underline">→ 海外ITエンジニア</Link></li>
              <li><Link href="/banking-overseas" className="text-primary-600 hover:underline">→ 海外銀行口座開設</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金ガイド</Link></li>
              <li><Link href="/engineer-wh" className="text-primary-600 hover:underline">→ エンジニアワーホリ</Link></li>
              <li><Link href="/wh-after-japan-tax" className="text-primary-600 hover:underline">→ 帰国後の税金</Link></li>
              <li><Link href="/wh-after-wh-stay" className="text-primary-600 hover:underline">→ WH後の滞在延長</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
