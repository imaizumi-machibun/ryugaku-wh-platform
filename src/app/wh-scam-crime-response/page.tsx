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

const PAGE_PATH = '/wh-scam-crime-response';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '【ワーホリ・留学】詐欺・犯罪被害の対処法完全ガイド｜手口10選・連絡先一覧',
  description: 'ワーホリ・留学中に遭いやすい詐欺・犯罪手口10選、被害時の連絡先（大使館・警察・保険会社）、事前予防策まで実例ベースで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'ワーホリ 詐欺',
    '留学 犯罪 被害',
    'ワーホリ トラブル',
    '海外 詐欺 手口',
    '留学 治安',
    'ワーホリ 安全',
  ],
});

const TOC_HEADINGS = [
  { id: 'scam-types', label: 'よくある詐欺・犯罪手口10選' },
  { id: 'immediate-action', label: '被害に遭った直後の3ステップ' },
  { id: 'contact-list', label: '緊急連絡先一覧（大使館・警察）' },
  { id: 'embassy', label: '大使館でできること・できないこと' },
  { id: 'insurance-claim', label: '保険請求の手順' },
  { id: 'prevention', label: '予防策10ヶ条' },
  { id: 'high-risk-areas', label: '注意すべき場面・場所' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const SCAM_TYPES = [
  {
    type: '①求人詐欺',
    detail: '「高給バイト」をSNSで募集→デポジット要求 or 個人情報抜き取り',
    risk: '所得・個人情報・パスポート情報',
    prevention: '正規求人サイト（Seek/Indeed）以外は警戒、面接前の入金要求は100%詐欺',
  },
  {
    type: '②家賃詐欺',
    detail: '実在しない物件を写真だけで募集→「内見前にデポジット送金」要求',
    risk: '送金した家賃（$500〜2,000）',
    prevention: '必ず内見してから契約、Gumtree等の個人取引は要警戒',
  },
  {
    type: '③ロマンス詐欺',
    detail: 'マッチングアプリ経由で関係構築→投資話・金銭援助要求',
    risk: '送金額（数十万〜数百万）',
    prevention: '「会ったことない相手にお金を送らない」を絶対ルールに',
  },
  {
    type: '④置き引き・スリ',
    detail: '観光地・カフェ・電車内でバッグ・スマホ・パスポートを盗難',
    risk: 'パスポート・現金・スマホ',
    prevention: 'カバンは常に手元・前面、貴重品分散、置き引き多発エリアを把握',
  },
  {
    type: '⑤SIMスワップ詐欺',
    detail: 'キャリアになりすまし電話番号を奪取→銀行アプリ侵入',
    risk: '銀行口座全額',
    prevention: '二段階認証はSMSではなくアプリ認証（Google Authenticator）',
  },
  {
    type: '⑥税関・警察なりすまし',
    detail: '「税関違反」「ビザ問題」と電話→罰金支払い要求',
    risk: '送金額（$200〜1,000）',
    prevention: '本物の税関・警察は電話で金銭要求しない、必ず大使館に確認',
  },
  {
    type: '⑦偽両替詐欺',
    detail: '空港・観光地の両替所で異常な手数料・偽札',
    risk: '両替額の5〜30%',
    prevention: '空港両替は最小限、Wise・銀行ATMで両替推奨',
  },
  {
    type: '⑧クレジットカード スキミング',
    detail: 'ATM・店舗のカード読取機にスキマー設置→情報複製',
    risk: '不正利用額（数万〜数十万）',
    prevention: '銀行ATM以外で使わない、明細を毎週チェック',
  },
  {
    type: '⑨偽警官の押し売り',
    detail: '私服警官と称して「パスポート提示」要求→金品強奪',
    risk: '財布・パスポート',
    prevention: '警官バッジ提示要求、近くの店舗に逃げ込む',
  },
  {
    type: '⑩シェアハウス内盗難',
    detail: 'ルームメイト・前住人による窃盗',
    risk: '現金・PC・カメラ',
    prevention: '貴重品はロッカー、自分の部屋にも鍵、入居時に住人確認',
  },
];

const IMMEDIATE_ACTION = [
  { step: 1, title: '安全確保＋警察通報', detail: '身の安全を最優先、すぐ警察へ通報（番号は下記）' },
  { step: 2, title: 'クレカ・銀行への連絡', detail: '盗難時は即時カード停止。銀行アプリから停止可' },
  { step: 3, title: '保険会社の緊急連絡先', detail: '24時間日本語対応、ポリスレポート発行サポート' },
];

const EMERGENCY_CONTACTS = [
  { country: 'オーストラリア', police: '000', embassy: '在豪日本大使館：(02) 6273 3244' },
  { country: 'カナダ', police: '911', embassy: '在加日本大使館：(613) 241-8541' },
  { country: 'イギリス', police: '999 / 112', embassy: '在英日本大使館：(020) 7465-6500' },
  { country: 'アメリカ', police: '911', embassy: '在米日本大使館：(202) 238-6700' },
  { country: 'ニュージーランド', police: '111', embassy: '在NZ日本大使館：(04) 473-1540' },
  { country: 'アイルランド', police: '999 / 112', embassy: '在愛日本大使館：(01) 202-8300' },
];

const EMBASSY_CAN = [
  'パスポート再発行・帰国のための渡航書発行',
  '現地の弁護士・通訳の紹介（費用は自己負担）',
  '家族への安否連絡の仲介',
  '事件・事故の証明書類発行',
  '緊急時の入院手続きサポート',
];

const EMBASSY_CANT = [
  '金銭の貸付（緊急時のみ少額の例外あり）',
  '警察捜査・犯人逮捕',
  '示談交渉・損害賠償請求',
  '入院費・弁護士費の代理支払い',
  '宿泊先・食事の提供',
];

const INSURANCE_STEPS = [
  '警察に被害届を出し「ポリスレポート」発行',
  '保険会社24時間日本語ヘルプに電話、案内に従う',
  '盗難品リスト・購入時のレシート・現品写真を準備',
  '帰国後30日以内に保険請求書類を提出',
];

const PREVENTION_TIPS = [
  'パスポート・大金は宿泊先のロッカー保管、外出時は身分証コピーのみ',
  '貴重品は3ヶ所に分散（財布・カバン・服内ポケット）',
  '「タダの〇〇」「高給バイト」「即時送金」は全て警戒',
  '夜の一人歩きを避ける、Uberを使う',
  'シェアハウス契約は必ず内見＋契約書サイン',
  'クレカ明細を毎週チェック、不審な利用は即連絡',
  'SNSに位置情報・パスポート写真をアップしない',
  'Wi-Fiは公共より自分のSIM・eSIM優先（パスワード盗難防止）',
  '酔った状態で帰宅しない、知らない人について行かない',
  '帰国までパスポートのコピーをクラウド保管',
];

const HIGH_RISK = [
  { place: '空港到着直後', risk: '疲労＋言葉の壁で判断力低下、置き引き・偽タクシー多発' },
  { place: '観光地・人混み', risk: 'スリ・置き引きが集中、リュック前掛け推奨' },
  { place: '深夜のATM', risk: 'スキミング・強盗、銀行内ATMを使う' },
  { place: 'マッチングアプリ', risk: 'ロマンス詐欺・恐喝、初対面は公共の場で' },
  { place: 'カジュアル求人サイト', risk: '架空求人・個人情報詐取、正規大手サイトを優先' },
];

const FAQS = [
  {
    question: '日本語対応の警察ホットラインはある？',
    answer:
      'オーストラリア・カナダなど主要国の主要都市の警察には日本語通訳サービスあり（警察番号にかけると「Japanese」と伝えれば通訳手配）。また在外日本大使館・領事館には24時間緊急ホットラインがあり、警察への通報を仲介してくれます。',
  },
  {
    question: 'パスポートを盗まれたらどうする？',
    answer:
      '①警察にすぐ届け出てポリスレポート発行、②大使館に紛失届提出、③帰国までの渡航書を発行（即日〜3日）。新規パスポートも発行可能だが2〜4週間かかります。現地警察への届出が遅れると保険適用外になるため、被害発覚から24時間以内に対応を。',
  },
  {
    question: '詐欺で送金してしまったお金は戻ってくる？',
    answer:
      '残念ながら、海外送金後の取り戻しは極めて困難。クレジットカード払いの場合のみ、カード会社の「チャージバック」制度で返金される可能性あり。送金前に「これは詐欺かも」と疑う癖をつけ、必ず家族や友人に相談を。',
  },
  {
    question: '海外保険は犯罪被害もカバーする？',
    answer:
      'カバーします。盗難・強盗による現金・所持品の損害は「携行品損害補償」で保証（通常20〜30万円まで）。ただし置き忘れ・紛失は対象外。必ず警察への被害届＋保険会社への連絡を48時間以内に。',
  },
  {
    question: '危ない国はどこ？',
    answer:
      'ワーホリ協定国（豪・加・NZ・英・愛・独・仏）は基本的に治安良好、但し大都市の中心部・観光地ではスリ・置き引きが多発。アメリカは都市格差大で要確認。フィリピンは治安注意。外務省「海外安全ホームページ」で最新情報を必ず確認してから渡航を。',
  },
];

export default async function WhScamCrimeResponsePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(詐欺|盗難|強盗|治安|犯罪|警察|スリ)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.cons?.map((c) => c.text).join(' ') ?? ''}`,
        /(詐欺|盗難|強盗|治安|犯罪|警察|スリ)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '詐欺・犯罪被害の対処法', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '詐欺・犯罪被害の対処法' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              【ワーホリ・留学】詐欺・犯罪被害の対処法完全ガイド｜手口10選・連絡先一覧
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="留学・ワーホリ予定者／滞在中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「海外は危険」というイメージは過剰ですが、ワーホリ・留学者を狙った詐欺・犯罪は確実に存在します。日本にはない手口、言葉の壁で判断が遅れるリスク、被害時の対応の難しさ。
              <br />
              この記事では狙われやすい手口10選、被害時の3ステップ、大使館・警察・保険会社の使い分けまで実例ベースで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '「送金要求＋急かす」は100%詐欺、立ち止まって家族に相談',
              '被害時は警察→カード会社→保険会社の順で連絡',
              '大使館はパスポート再発行・通訳紹介はOK、金銭貸付は不可',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 手口 */}
          <section id="scam-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくある詐欺・犯罪手口10選</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              実際に被害事例が多い順に10種類を紹介。手口を知っているだけで防げる確率が大きく上がります。
            </p>
            <div className="space-y-3">
              {SCAM_TYPES.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-rose-700">{s.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{s.detail}</p>
                  <div className="text-xs space-y-1">
                    <p><strong className="text-gray-700">リスク:</strong> {s.risk}</p>
                    <p><strong className="text-emerald-700">予防:</strong> {s.prevention}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 直後の3ステップ */}
          <section id="immediate-action" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">被害に遭った直後の3ステップ</h2>
            <div className="space-y-3">
              {IMMEDIATE_ACTION.map((a) => (
                <div key={a.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {a.step}: {a.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{a.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="出発前にやることリストで予防策を完成させる"
            description="出発前のチェックリストで保険・身分証コピー・パスポート保管まで漏れなく準備しましょう。"
            primaryHref="/pre-departure-checklist"
            primaryLabel="出発前チェックリスト60項目"
            secondaryHref="/overseas-hospital-guide"
            secondaryLabel="海外で病院にかかる完全ガイド"
          />

          {/* 緊急連絡先 */}
          <section id="contact-list" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">緊急連絡先一覧（大使館・警察）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              出発前にスマホに登録、紙でも持参を強く推奨します。
            </p>
            <div className="space-y-3">
              {EMERGENCY_CONTACTS.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{c.country}</p>
                  <div className="text-sm space-y-1">
                    <p><strong>警察・救急:</strong> <span className="text-rose-700 font-bold">{c.police}</span></p>
                    <p><strong>大使館:</strong> {c.embassy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 大使館 */}
          <section id="embassy" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">大使館でできること・できないこと</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-emerald-800">✓ できること</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {EMBASSY_CAN.map((e, i) => (
                    <li key={i} className="leading-relaxed">・{e}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-rose-800">✗ できないこと</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {EMBASSY_CANT.map((e, i) => (
                    <li key={i} className="leading-relaxed">・{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 保険請求 */}
          <section id="insurance-claim" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">保険請求の手順</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {INSURANCE_STEPS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 予防策 */}
          <section id="prevention" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">予防策10ヶ条</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PREVENTION_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 注意すべき場面 */}
          <section id="high-risk-areas" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">注意すべき場面・場所</h2>
            <div className="space-y-3">
              {HIGH_RISK.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-rose-700">{h.place}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{h.risk}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「詐欺・盗難・治安」関連の言及を集計。
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
            ※ 大使館連絡先・緊急番号は2026年5月時点の情報です。最新情報は外務省「海外安全ホームページ」「在外公館」ページで必ずご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト60項目</Link></li>
              <li><Link href="/overseas-hospital-guide" className="text-primary-600 hover:underline">→ 海外で病院にかかる完全ガイド</Link></li>
              <li><Link href="/passport-lost-overseas" className="text-primary-600 hover:underline">→ パスポート紛失時の対処</Link></li>
              <li><Link href="/wh-labor-rights" className="text-primary-600 hover:underline">→ ワーホリ労働権利侵害</Link></li>
              <li><Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">→ 不安解消ガイド</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金・クレカ</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
