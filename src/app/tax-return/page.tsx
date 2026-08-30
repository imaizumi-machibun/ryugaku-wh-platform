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
  title: 'ワーホリの確定申告完全ガイド｜出発年・帰国年・現地申告の3ケース別解説',
  description: 'ワーキングホリデーの確定申告は「出発年」「帰国年」「現地での申告」の3ケースで対応が異なります。住民税・所得税の還付方法、税務署での手続き、必要書類を実体験ベースで解説。タックスリターンとの違いも明記。',
  path: '/tax-return',
  keywords: [
    'ワーホリ 確定申告',
    '帰国後 確定申告 ワーホリ',
    'ワーホリ 税金 申告',
    'ワーホリ 所得税 還付',
    'ワーホリ 住民税',
    'ワーホリ 出発年 確定申告',
    'ワーホリ 帰国年 確定申告',
  ],
});

const TOC_HEADINGS = [
  { id: 'three-cases', label: '3つのケース別：あなたはどれ？' },
  { id: 'before-departure', label: '出発年の確定申告（退職した年）' },
  { id: 'during-overseas', label: 'ワーホリ中の日本側の手続き' },
  { id: 'after-return', label: '帰国年の確定申告' },
  { id: 'experiences', label: '体験談：申告した人・しなかった人' },
  { id: 'faq', label: 'よくある質問' },
];

const FAQS = [
  {
    question: 'ワーホリで確定申告は必須ですか？',
    answer:
      '日本で給与所得があった年に源泉徴収されている場合、確定申告で還付を受けられる可能性が高いです。特に「年の途中で退職してワーホリに行った」ケースは、払いすぎた所得税が戻ってくることが多いので、申告するメリットが大きいです。',
  },
  {
    question: '海外で稼いだ収入も日本で申告が必要ですか？',
    answer:
      '出発前に「海外転出届」を出して住民票を抜いている場合、日本の非居住者扱いとなり、原則として海外で得た所得は日本で申告不要です。ただし日本での所得（不動産収入など）がある場合は申告が必要なので、税理士や税務署に相談してください。',
  },
  {
    question: '帰国した年は確定申告が必要ですか？',
    answer:
      '帰国後に日本で再就職して給与をもらっている場合、年末調整で対応できることが多いです。ただし「ワーホリ先で稼いだ分」を日本で申告するかは、居住者・非居住者の判定とその国との租税条約によって異なります。詳細は税務署または国際税務に強い税理士に確認しましょう。',
  },
  {
    question: '現地のタックスリターン（オーストラリア・カナダ等）と日本の確定申告は別ですか？',
    answer:
      '別物です。オーストラリアやカナダなど現地の税務当局に申告して還付を受ける「タックスリターン」は、現地での所得に対するものです。日本の確定申告は、日本で得た所得（出発前の給与など）に対する手続きです。両方とも対応が必要なケースもあります。',
  },
  {
    question: '確定申告はいつまでに、どこでやればいい？',
    answer:
      '毎年2月16日〜3月15日の間に、住所地を管轄する税務署で行います。海外滞在中の場合は「納税管理人」を日本国内に立てておくと、家族や知人が代理で手続きできます。e-Taxを使えば海外からもオンラインで提出可能です。',
  },
];

const CASE_GUIDE = [
  {
    id: 'before-departure',
    color: 'rose',
    title: '出発年の確定申告（退職した年）',
    target: '年の途中で退職してワーホリに出発した方',
    summary: '退職した年の所得税が払いすぎになっている可能性が高い。確定申告で還付を受けられるケースが多数。',
    points: [
      '退職前に勤務先から「源泉徴収票」を必ず受け取る',
      '退職後の年内に再就職していない場合、年末調整がされていない',
      '社会保険料控除・生命保険料控除・医療費控除などが使える',
      '医療費控除の対象は年内10万円以上（または所得の5%超）',
      '出発前に確定申告を済ませる or 納税管理人を立てる',
    ],
    actionLink: { href: '/quit-job-wh', label: '社会人ワーホリの退職タイミングと手続きガイド（準備中）' },
  },
  {
    id: 'during-overseas',
    color: 'blue',
    title: 'ワーホリ中の日本側の手続き',
    target: 'すでに渡航中の方・1年以内に帰国予定の方',
    summary: '住民票を抜いていれば原則として日本での所得申告は不要。ただし日本国内に収入源があれば申告必要。',
    points: [
      '住民票を抜いている＝非居住者扱い、日本での税務申告は原則不要',
      '日本国内に賃貸不動産収入がある場合は申告必要',
      '日本国内に株式配当・利子所得がある場合も対象',
      '住民税は1月1日に住民票がなければ翌年度免除',
      'e-Taxを使えば海外からも電子申告可能',
    ],
    actionLink: { href: '/guide/departure-prep', label: '出発前の手続き完全ガイド' },
  },
  {
    id: 'after-return',
    color: 'emerald',
    title: '帰国年の確定申告',
    target: '帰国して日本で再就職した方・再就職前の方',
    summary: '帰国後の再就職先で年末調整が可能。タイミングによっては自分で確定申告が必要に。',
    points: [
      '帰国後の再就職時に「住民票の戻し」を市役所で行う',
      '再就職先に「給与所得者の扶養控除等申告書」を提出',
      '12月31日時点で在職していれば、勤務先で年末調整',
      '12月中に退職している・無職の場合は、翌年2〜3月に自分で確定申告',
      '現地のタックスリターン還付金は原則として日本での再申告不要（非居住者期間中の所得のため）',
    ],
    actionLink: { href: '/after-wh', label: '帰国後の就活完全ガイド' },
  },
];

export default async function TaxReturnPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  // 税金・確定申告言及の集計
  const taxMentions = countMentions(all, /(確定申告|税金|還付|住民税|所得税|タックスリターン|税務)/);
  const sample = taxMentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(`${sample.advice ?? ''} ${sample.cons?.map((c) => c.text).join(' ') ?? ''}`, /(確定申告|税金|還付|住民税|所得税|タックスリターン|税務)/)
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリの確定申告ガイド', url: '/tax-return' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリの確定申告ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリの確定申告｜出発年・帰国年・現地申告の3ケース別解説
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="ワーホリ前後の税務手続きが気になる方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーキングホリデーの確定申告は、自分が今どのタイミングにいるかで、やることがまったく違います。
              <br />
              「出発した年」「ワーホリ中」「帰国した年」の3つに分けて、それぞれの対応をまとめました。
              払いすぎた所得税が還付されるケースも多いので、出発前と帰国後にチェックすべきポイントを整理しています。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '出発年・ワーホリ中・帰国年の3ケース別の確定申告対応',
              '退職した年に払いすぎた所得税を還付してもらう方法',
              '現地のタックスリターン（豪・加など）と日本の確定申告の違い',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 3ケース分岐 */}
          <section id="three-cases" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">3つのケース別：あなたはどれ？</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              まずは自分のタイミングを把握しましょう。下の3つから一番近いものを選んで、該当セクションを確認してください。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CASE_GUIDE.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="block bg-white border border-gray-200 hover:border-primary-400 rounded-xl p-4 transition-colors"
                >
                  <p className="text-xs font-semibold text-primary-600 mb-2">{c.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.target}</p>
                </a>
              ))}
            </div>
          </section>

          {/* ケース別解説 */}
          {CASE_GUIDE.map((c) => (
            <section key={c.id} id={c.id} className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">{c.title}</h2>
              <p className="text-sm text-gray-600 mb-4">対象：{c.target}</p>
              <div className="bg-primary-50 border-l-4 border-primary-400 px-4 py-3 mb-4 rounded-r">
                <p className="text-sm text-primary-900 leading-relaxed font-medium">{c.summary}</p>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-2">押さえるべきポイント</p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-800 mb-4">
                {c.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 bg-primary-400 rounded-full shrink-0" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={c.actionLink.href}
                className="inline-flex items-center text-sm text-primary-600 hover:underline font-medium"
              >
                → {c.actionLink.label}
              </Link>
            </section>
          ))}

          {/* 中段CTA */}
          <MidCTA
            title="社会人退職→ワーホリの全体手続きはこちら"
            description="退職前から帰国後までの「税金・年金・健康保険」の全体像をまとめたガイドもあわせてどうぞ。"
            primaryHref="/after-wh"
            primaryLabel="帰国後の就活ガイド"
            secondaryHref="/age/20s-late"
            secondaryLabel="社会人ワーホリ完全ガイド"
          />

          {/* 体験談言及データ */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談：申告した人・しなかった人</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              実際にワーホリへ行った77人の体験談から、確定申告・税金関連の言及があった件数を集計しました。
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{taxMentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {taxMentions.containsCount}件</strong>
                （{taxMentions.percentage}%）が税金・確定申告関連について言及していました。
              </p>
              <p className="text-xs text-gray-500">
                ※ advice/pros/cons フィールドのテキストから「確定申告/税金/還付/住民税/所得税/タックスリターン」のいずれかを含む体験談を抽出（参考値）。
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
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            ※ 本記事は2026年5月時点の一般的な情報をまとめたものです。個別のケースについては、最寄りの税務署または国際税務に詳しい税理士へ必ずご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/after-wh" className="text-primary-600 hover:underline">
                  → 帰国後就活完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/age/20s-late" className="text-primary-600 hover:underline">
                  → 社会人ワーホリ完全ガイド（20代後半）
                </Link>
              </li>
              <li>
                <Link href="/guide/visa-cost" className="text-primary-600 hover:underline">
                  → ビザ・費用フェーズの完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための7つの教訓
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="text-primary-600 hover:underline">
                  → 全77件の体験談を読む
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
