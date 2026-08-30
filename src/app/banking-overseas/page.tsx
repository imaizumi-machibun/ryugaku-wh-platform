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

const PAGE_PATH = '/banking-overseas';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外で銀行口座開設完全ガイド｜国別必要書類・最短ルート・おすすめ銀行',
  description: '留学・ワーホリで必須の海外銀行口座開設。豪・加・英・NZ等の主要国別の必要書類、最短ルート、各国おすすめ銀行、Wise/Revolutとの使い分けまで完全解説。',
  path: PAGE_PATH,
  keywords: [
    '海外 銀行口座',
    'ワーホリ 銀行口座',
    'カナダ 銀行 開設',
    'オーストラリア 銀行口座',
    '海外 口座 開設',
    '留学 銀行',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-needed', label: 'なぜ現地銀行口座が必要なのか' },
  { id: 'common-docs', label: '共通で必要な書類' },
  { id: 'australia', label: 'オーストラリアの銀行口座開設' },
  { id: 'canada', label: 'カナダの銀行口座開設' },
  { id: 'uk', label: 'イギリスの銀行口座開設' },
  { id: 'newzealand', label: 'ニュージーランドの銀行口座開設' },
  { id: 'wise-alternative', label: 'Wise/Revolutでも代替可能？' },
  { id: 'common-trouble', label: 'よくあるトラブルと対処' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COMMON_DOCS = [
  { item: 'パスポート', detail: '有効期限内、写真付身分証として' },
  { item: 'ビザ（電子 or 紙）', detail: '入国時の証明書、Print outしておく' },
  { item: '滞在先住所証明', detail: '賃貸契約書・公共料金請求書・学校発行のletter等' },
  { item: '銀行口座開設フォーム（窓口で記入）', detail: '英文で記入、所要15〜30分' },
  { item: '初回入金額', detail: '通常$100〜500、現金 or 現地ATM出金' },
];

const AUSTRALIA_BANKS = [
  {
    bank: 'Commonwealth Bank（CommBank）',
    feature: '最大手、Smart Access口座が学生・WH向け、12ヶ月手数料無料',
    apply: '出発前にオンライン仮申請可、現地で支店訪問して完了',
  },
  {
    bank: 'ANZ',
    feature: 'Access Advantage口座、デビット即日発行、アプリ便利',
    apply: '到着後支店訪問、TFNなくても口座開設可（後で追加）',
  },
  {
    bank: 'Westpac',
    feature: 'Choice口座、年会費無料、海外送金強い',
    apply: '空港支店もあり到着即日開設可能（シドニー・メルボルン・ブリスベン）',
  },
  {
    bank: 'NAB',
    feature: 'Classic Banking口座、手数料完全無料',
    apply: 'オンライン申請＋電話面談で完結（支店訪問不要）',
  },
];

const CANADA_BANKS = [
  {
    bank: 'RBC（Royal Bank of Canada）',
    feature: 'No Limit Banking for Students、月会費無料、学生向け特典多',
    apply: 'SIN取得後、支店訪問→即日カード発行',
  },
  {
    bank: 'TD Canada Trust',
    feature: 'TD Student Chequing、月会費無料、ワーホリも対象',
    apply: '支店訪問、書類提出から1週間程度で発行',
  },
  {
    bank: 'Scotiabank',
    feature: 'StartRight Program for newcomers、ワーホリ・学生・PR候補者向け特化',
    apply: '空港カウンターで申込可、最も外国人フレンドリー',
  },
  {
    bank: 'CIBC',
    feature: 'Smart for Newcomers、初年度月会費・国際送金無料',
    apply: '支店訪問、書類確認後すぐ発行',
  },
];

const UK_BANKS = [
  {
    bank: 'Monzo / Starling（デジタル銀行）',
    feature: 'アプリのみで口座開設、住所証明柔軟、英国内最人気',
    apply: 'アプリDL→自撮りビデオ＋ID提出で1〜2日で開設',
  },
  {
    bank: 'HSBC（International Account）',
    feature: '海外送金強い、日本HSBCで事前申込→渡英後本人確認',
    apply: '日本のHSBCから「Passport International Account」で事前手続き推奨',
  },
  {
    bank: 'Barclays',
    feature: '伝統的大手、住所証明厳しめ、本店訪問必要',
    apply: '渡英後支店予約→書類確認→2週間で発行',
  },
  {
    bank: 'Lloyds Bank',
    feature: 'Classic Account、UK居住歴3ヶ月以上推奨',
    apply: '支店訪問、滞在3ヶ月後がスムーズ',
  },
];

const NZ_BANKS = [
  {
    bank: 'ANZ NZ',
    feature: '最大手、Choice Account、出発前オンライン申請可',
    apply: '日本から仮申請→現地で支店訪問→即日カード発行',
  },
  {
    bank: 'ASB',
    feature: 'StreamLine口座、住所証明柔軟、学生向け',
    apply: '到着後支店訪問、IRD番号なしでも開設可',
  },
  {
    bank: 'BNZ',
    feature: 'YouMoney口座、若年層向け手数料無料',
    apply: '支店予約→書類確認→7-10日で発行',
  },
];

const WISE_ALTERNATIVE_PROS = [
  '渡航前にオンライン完結で開設可能',
  '通貨50種類対応、為替手数料が銀行の1/10',
  '日本円・現地通貨を同一アカウントで管理',
  'デビットカード即日発行（郵送）',
  '給与受取・税還付受領も可能',
];

const WISE_ALTERNATIVE_CONS = [
  '一部現地銀行ATMで使えない場合あり',
  '雇用主によっては「現地銀行口座必須」と言われる',
  '高額利用（月$3,000超）で本人確認追加要求',
  '物理カード到着まで1〜2週間',
];

const COMMON_TROUBLE = [
  '住所証明として認められないドキュメントを持参（ホテル予約証は不可）',
  'TFN/SIN取得前に口座開設不可と思い込む（実は多くの国で後追加OK）',
  '銀行手数料を比較せず開設、月数千円の維持費',
  'デビットカードのPIN再設定方法を聞き忘れ',
  'オンラインバンキング設定時の本人確認電話を見逃す',
];

const FAQS = [
  {
    question: '日本の銀行口座だけで海外生活できる？',
    answer:
      'できますが効率悪い。日本のクレカ＋Wise＋現金で乗り切ることは可能ですが、給与振込・公共料金引落・現地アプリ決済・税還付受領で現地口座が必須になります。長期滞在（3ヶ月超）なら口座開設を強く推奨。',
  },
  {
    question: '出発前に口座開設できる？',
    answer:
      'できる国とできない国あり。オーストラリア（CommBank/Westpac）・ニュージーランド（ANZ NZ）は日本から仮申請可、現地で本人確認のみ。カナダ・イギリスは現地到着後の手続きが基本。事前申請可なら出発前に手続きしておくと現地で即使えます。',
  },
  {
    question: '銀行口座は何ヶ月で開設できる？',
    answer:
      '国・銀行によりますが、書類が揃えば即日〜1週間で開設可。豪はWestpac空港支店なら到着即日、加は支店訪問即日カード、英はMonzo/Starlingで1-2日。住所証明が不安定（ホステル等）だと2-3週間かかることも。',
  },
  {
    question: 'デビットカードと現金、どちらメインで使う？',
    answer:
      '基本はデビット、現金は最低限。海外はキャッシュレス化が進んでおり、$5以下でもカード決済OKが普通。現金は$50〜100程度を予備として持ち歩く感覚。Tipは現金が便利な場合あり。',
  },
  {
    question: '帰国時に口座は閉じるべき？',
    answer:
      '閉じた方がいい。維持費が発生し続ける、残高放置で休眠口座になる、税還付受領が複雑になる等のデメリット。閉じる前に①税還付受領、②残高引出し or 日本口座送金、③雇用主・家賃支払い停止 を済ませる。閉鎖は窓口 or アプリで5〜10分。',
  },
];

export default async function BankingOverseasPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(銀行|口座|デビット|ATM|Bank|Card)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(銀行|口座|デビット|ATM|Bank|Card)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外で銀行口座開設完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外で銀行口座開設完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外で銀行口座開設完全ガイド｜国別必要書類・最短ルート・おすすめ銀行
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="留学・ワーホリで現地銀行口座開設予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              留学・ワーホリで3ヶ月以上滞在するなら、現地銀行口座開設はほぼ必須。給与振込・家賃支払い・税還付受領のすべてで使われます。
              <br />
              この記事では豪・加・英・NZの主要4ヶ国別に、必要書類・最短ルート・おすすめ銀行・Wise/Revolutとの使い分けまで完全解説。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '滞在3ヶ月超なら現地銀行口座は必須（給与受取・税還付受領）',
              'パスポート＋ビザ＋住所証明があれば即日〜1週間で開設可',
              '一部国は日本から事前申請可（豪Westpac、NZ ANZ等）',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ必要 */}
          <section id="why-needed" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ現地銀行口座が必要なのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              短期旅行ならクレカ＋Wise＋現金で乗り切れますが、長期滞在は現地銀行口座があるとQOLが大きく上がります。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・給与振込（雇用主が現地銀行口座を要求するケース多）</li>
              <li>・家賃・公共料金の自動引落</li>
              <li>・現地アプリ決済（Uber、Deliveroo等）</li>
              <li>・税還付（DASP、Tax Return等）の受領口座</li>
              <li>・ATM出金手数料の節約（外国カードは$2-5/回）</li>
              <li>・現地クレジットスコアの構築（PR申請時に有利）</li>
            </ul>
          </section>

          {/* 共通書類 */}
          <section id="common-docs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">共通で必要な書類</h2>
            <div className="space-y-3">
              {COMMON_DOCS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{d.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* オーストラリア */}
          <section id="australia" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">🇦🇺 オーストラリアの銀行口座開設</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Big 4（CommBank/ANZ/Westpac/NAB）が市場の8割を占有。出発前オンライン仮申請可の銀行も多い。
            </p>
            <div className="space-y-3">
              {AUSTRALIA_BANKS.map((b, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{b.bank}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{b.feature}</p>
                  <p className="text-xs text-gray-500"><strong>申請方法:</strong> {b.apply}</p>
                </div>
              ))}
            </div>
          </section>

          {/* カナダ */}
          <section id="canada" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">🇨🇦 カナダの銀行口座開設</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Big 5（RBC/TD/Scotiabank/BMO/CIBC）が大手。Scotiabankが最も外国人フレンドリーで人気。
            </p>
            <div className="space-y-3">
              {CANADA_BANKS.map((b, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{b.bank}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{b.feature}</p>
                  <p className="text-xs text-gray-500"><strong>申請方法:</strong> {b.apply}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="Wise・送金・クレカ整備も合わせて"
            description="海外送金・両替・クレカ整備の総合ガイドで、お金回りを完全準備。"
            primaryHref="/wise-payment-guide"
            primaryLabel="Wise・送金・クレカ完全ガイド"
            secondaryHref="/pre-departure-checklist"
            secondaryLabel="出発前チェックリスト"
          />

          {/* イギリス */}
          <section id="uk" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">🇬🇧 イギリスの銀行口座開設</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              伝統的銀行（Barclays/HSBC/Lloyds）は住所証明が厳しいため、Monzo/Starlingのデジタル銀行が圧倒的人気。
            </p>
            <div className="space-y-3">
              {UK_BANKS.map((b, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{b.bank}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{b.feature}</p>
                  <p className="text-xs text-gray-500"><strong>申請方法:</strong> {b.apply}</p>
                </div>
              ))}
            </div>
          </section>

          {/* NZ */}
          <section id="newzealand" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">🇳🇿 ニュージーランドの銀行口座開設</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ANZ・ASB・BNZの3大銀行が市場の大半。日本から事前申請が比較的スムーズな国。
            </p>
            <div className="space-y-3">
              {NZ_BANKS.map((b, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{b.bank}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{b.feature}</p>
                  <p className="text-xs text-gray-500"><strong>申請方法:</strong> {b.apply}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Wise代替 */}
          <section id="wise-alternative" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Wise/Revolutでも代替可能？</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-emerald-800">✓ 代替メリット</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {WISE_ALTERNATIVE_PROS.map((p, i) => (
                    <li key={i} className="leading-relaxed">・{p}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-rose-800">✗ 注意点</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {WISE_ALTERNATIVE_CONS.map((c, i) => (
                    <li key={i} className="leading-relaxed">・{c}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-4 leading-relaxed">
              <strong>結論：</strong>短期（〜3ヶ月）はWise/Revolutで十分、長期（3ヶ月超）は現地銀行口座＋Wiseを併用するのが最強。
            </p>
          </section>

          {/* トラブル */}
          <section id="common-trouble" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくあるトラブルと対処</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {COMMON_TROUBLE.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
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
                体験談 <strong>n={all.length}件</strong> から「銀行・口座・デビット・ATM」関連の言及を集計。
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
            ※ 各銀行の口座種類・手数料・条件は2026年5月時点の情報です。最新情報は各銀行公式サイトでご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金・クレカ完全ガイド</Link></li>
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト</Link></li>
              <li><Link href="/australia-tfn-guide" className="text-primary-600 hover:underline">→ オーストラリアTFN取得</Link></li>
              <li><Link href="/canada-tax-return" className="text-primary-600 hover:underline">→ カナダTax Return</Link></li>
              <li><Link href="/wh-pension-refund-australia" className="text-primary-600 hover:underline">→ 豪Super還付</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
