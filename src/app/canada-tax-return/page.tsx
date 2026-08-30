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

const PAGE_PATH = '/canada-tax-return';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'カナダ税金還付（Tax Return）完全ガイド｜SIN・T4・CRA・申告手順',
  description: 'カナダで働いたら必須の確定申告（Tax Return）。SIN・T4・CRA申告手順、還付額試算、申告期限、初心者でも自分でできる申告方法を完全解説。',
  path: PAGE_PATH,
  keywords: [
    'カナダ 税金 還付',
    'カナダ Tax Return',
    'カナダ 確定申告',
    'カナダ SIN',
    'カナダ T4',
    'CRA 申告',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-needed', label: 'なぜカナダで確定申告が必要なのか' },
  { id: 'key-terms', label: '必須の3用語：SIN・T4・CRA' },
  { id: 'deadline', label: '申告期限と還付タイミング' },
  { id: 'how-to-apply', label: '申告手順（無料ソフト利用）' },
  { id: 'refund-amount', label: '還付額シミュレーション' },
  { id: 'deductions', label: '控除できる経費5種類' },
  { id: 'common-mistakes', label: 'よくあるトラブルと対処' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const KEY_TERMS = [
  {
    term: 'SIN（Social Insurance Number）',
    detail: 'カナダ国民識別番号。9桁。雇用契約・銀行口座・税申告に必須',
    how: 'Service Canada事務所で即日発行可能、無料',
  },
  {
    term: 'T4（Statement of Remuneration Paid）',
    detail: '雇用主が発行する年間収入証明書。日本の源泉徴収票に相当',
    how: '毎年2月末までに雇用主から受領、申告必須書類',
  },
  {
    term: 'CRA（Canada Revenue Agency）',
    detail: 'カナダ歳入庁。日本の国税庁に相当。確定申告の窓口',
    how: 'My Accountをオンライン開設、申告書を提出',
  },
];

const APPLY_STEPS = [
  { step: 1, title: '前年分のT4を全雇用主から収集', detail: '複数勤務先で働いた場合、すべてのT4が必要' },
  { step: 2, title: '無料申告ソフトのダウンロード', detail: 'Wealthsimple Tax・TurboTax Free等。CRA認定ソフト' },
  { step: 3, title: 'SIN・T4情報を入力', detail: '画面の指示通りに入力、所要時間30〜60分' },
  { step: 4, title: '控除・経費を入力', detail: '通勤費・引越し費・健康保険料等を漏れなく' },
  { step: 5, title: 'CRA経由でNETFILE送信', detail: 'ソフトから直接送信、3日以内に受領通知' },
  { step: 6, title: '還付金受領（2〜8週間）', detail: '指定銀行口座に直接振込' },
];

const REFUND_SIMULATIONS = [
  { earnings: 'CAD 20,000 (6ヶ月勤務)', tax: 'CAD 3,500', refund: '約CAD 1,500', jpy: '約16万円' },
  { earnings: 'CAD 30,000 (1年勤務)', tax: 'CAD 5,500', refund: '約CAD 2,000', jpy: '約22万円' },
  { earnings: 'CAD 45,000 (1年勤務)', tax: 'CAD 9,000', refund: '約CAD 2,500', jpy: '約27万円' },
  { earnings: 'CAD 60,000 (2年勤務)', tax: 'CAD 13,500', refund: '約CAD 3,500', jpy: '約38万円' },
];

const DEDUCTIONS = [
  { item: '通勤・引越し費用', detail: '転職に伴う引越しは最大$3,000控除可' },
  { item: '健康保険料（PrivateHealth）', detail: '雇用主が天引きしていない場合の自費分' },
  { item: '労働組合費・専門資格料', detail: 'バリスタ・看護師等の更新料も控除対象' },
  { item: 'チャリティ寄付', detail: '$200まで15%、それ以上は29%税額控除' },
  { item: 'TFSA・RRSP拠出金', detail: '退職金口座への積立、所得控除が大きい' },
];

const COMMON_MISTAKES = [
  'T4を1枚しか提出せず還付額が減る → 複数勤務先の全T4必須',
  '通勤交通費を控除し忘れて還付額減 → 経費レシート保管が大事',
  '締切4/30を過ぎてペナルティ → 翌年から5%/月の延滞金',
  '銀行口座番号間違いで還付遅延 → My Account で再設定可能',
  '帰国後申告し忘れ → 海外からでもオンライン申告可能、忘れずに',
];

const FAQS = [
  {
    question: 'カナダで働いたら税金還付は必須？',
    answer:
      '法的には収入があれば申告義務あり。さらにほとんどのワーホリ・学生は還付額がプラスになる（払いすぎた所得税が戻ってくる）ため、申告した方が金銭的にお得。1年勤務で平均CAD 2,000（約22万円）の還付が一般的です。',
  },
  {
    question: 'いつまでに申告すべき？',
    answer:
      '毎年4月30日が申告期限。前年1〜12月の所得を翌年4月末までに申告。期限を過ぎると5%/月の延滞金が課されます。帰国後でも申告可能（オンラインでカナダ国外から提出OK）。',
  },
  {
    question: '申告は自分でできる？それとも税理士？',
    answer:
      'WealthsimpleやTurboTax等の無料ソフトを使えば、初心者でも30〜60分で完了します。所得CAD 50,000以下のシンプルな申告なら税理士不要。複数の州で働いた、自営業を兼業した等の複雑ケースなら税理士（H&R Block等）を検討。',
  },
  {
    question: 'GST/HSTクレジットはもらえる？',
    answer:
      '低所得者向けの還付制度。所得CAD 35,000以下なら最大CAD 519/年（独身）受け取れます。Tax Return提出時に自動判定されるため、別途申請不要。ワーホリ・留学生も対象。',
  },
  {
    question: '帰国後に申告するメリットは？',
    answer:
      '還付金額は同じですが、銀行口座を閉じる前に申告した方がスムーズ。閉じた後でも申告可能ですが、小切手郵送→換金の手間が増えます。帰国前にCRA My Accountを開設、My Account から海外送金設定もできます。',
  },
];

export default async function CanadaTaxReturnPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const caExperiences = all.filter((e) => e.country?.id === 'canada');
  const mentions = countMentions(all, /(税金|還付|Tax|確定申告|SIN|T4)/i);
  const sample = caExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(税金|還付|Tax|確定申告|SIN|T4|カナダ)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'カナダ税金還付Tax Return完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'カナダ税金還付Tax Return完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              カナダ税金還付（Tax Return）完全ガイド｜SIN・T4・CRA・申告手順
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="カナダで働いたワーホリ・学生・帰国予定者"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              カナダで働いた人は必ず確定申告（Tax Return）が必要。意外と知らない人が多いが、ほとんどのワーホリ・学生は還付額がプラスで「払いすぎた税金が戻ってくる」ボーナスです。
              <br />
              この記事ではSIN・T4・CRAの基本、申告手順、還付額シミュレーション、控除可能経費まで初心者向けに完全解説。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '1年勤務で平均CAD 2,000（約22万円）の還付が一般的',
              '無料ソフト（Wealthsimple等）で自分で30〜60分で完了',
              '申告期限は4月30日、帰国後でもオンライン申告可能',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ必要 */}
          <section id="why-needed" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜカナダで確定申告が必要なのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              カナダで給与所得がある人（ワーホリ・学生・PR・市民 全て）は確定申告の法的義務があります。雇用主は給与から所得税を源泉徴収していますが、年間税額の精算は申告者が自分で行う仕組みです。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・払いすぎた税金は還付される（ほぼ全員プラス還付）</li>
              <li>・GST/HSTクレジット（低所得向け給付金）も自動判定</li>
              <li>・申告履歴は将来のPR申請でも参照される</li>
              <li>・申告しないとペナルティ＋将来の信用問題</li>
            </ul>
          </section>

          {/* 用語 */}
          <section id="key-terms" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">必須の3用語：SIN・T4・CRA</h2>
            <div className="space-y-3">
              {KEY_TERMS.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{t.term}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{t.detail}</p>
                  <p className="text-xs text-gray-500"><strong>取得方法:</strong> {t.how}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 期限 */}
          <section id="deadline" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申告期限と還付タイミング</h2>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
              <p className="text-base font-bold text-rose-800 mb-3">⏰ 申告期限：毎年 4月30日</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・前年1月〜12月分の所得を翌年4月30日までに申告</li>
                <li>・期限超過は5%/月の延滞金（最大47%）</li>
                <li>・申告から還付までの目安：オンラインで2〜4週間、紙申告で6〜8週間</li>
                <li>・銀行口座直接振込が最速</li>
              </ul>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="カナダワーホリの全体像も合わせて"
            description="IECビザ申請・SIN取得・銀行口座開設まで網羅したガイド。"
            primaryHref="/canada-iec-visa"
            primaryLabel="カナダIECビザ完全ガイド"
            secondaryHref="/canada-sim-card"
            secondaryLabel="カナダSIMカード"
          />

          {/* 申告手順 */}
          <section id="how-to-apply" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申告手順（無料ソフト利用）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Wealthsimple Tax（旧SimpleTax）が最も人気。完全無料、日本語UIなしですが操作シンプルです。
            </p>
            <div className="space-y-3">
              {APPLY_STEPS.map((s) => (
                <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {s.step}: {s.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 還付シミュレーション */}
          <section id="refund-amount" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">還付額シミュレーション</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              年収・勤務期間別の還付額目安（1CAD=110円換算）。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">年収・勤務期間</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">源泉徴収</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">還付額</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">円換算</th>
                  </tr>
                </thead>
                <tbody>
                  {REFUND_SIMULATIONS.map((r, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{r.earnings}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.tax}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.refund}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{r.jpy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 控除 */}
          <section id="deductions" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">控除できる経費5種類</h2>
            <div className="space-y-3">
              {DEDUCTIONS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{d.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* よくあるミス */}
          <section id="common-mistakes" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくあるトラブルと対処</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {COMMON_MISTAKES.map((m, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                カナダ渡航者の体験談 <strong>n={caExperiences.length}件</strong>。
                税金・申告関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 税率・控除・申告手順は2026年5月時点の情報です。最新情報は CRA（canada.ca/en/revenue-agency）公式情報でご確認ください。複雑なケースは税理士へご相談ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ完全ガイド</Link></li>
              <li><Link href="/canada-sim-card" className="text-primary-600 hover:underline">→ カナダSIMカード</Link></li>
              <li><Link href="/vancouver-language-school" className="text-primary-600 hover:underline">→ バンクーバー語学学校</Link></li>
              <li><Link href="/toronto-vs-vancouver" className="text-primary-600 hover:underline">→ トロントvsバンクーバー</Link></li>
              <li><Link href="/tax-return" className="text-primary-600 hover:underline">→ ワーホリ確定申告（豪・加・英）</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
