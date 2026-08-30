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

const PAGE_PATH = '/cebu-study-real-cost';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'セブ島留学の費用リアル｜1ヶ月・3ヶ月・6ヶ月の総額シミュレーション',
  description: 'セブ島留学の費用を「学費・寮費・食費・お小遣い・隠れコスト」の全項目で完全解説。1ヶ月15万・3ヶ月40万・6ヶ月80万の総額シミュレーション、学校タイプ別費用、SSP・ビザ延長などの隠れた出費まで実例ベースでまとめました。',
  path: PAGE_PATH,
  keywords: [
    'セブ島 留学 費用',
    'フィリピン 留学 費用',
    'セブ 留学 1ヶ月',
    'セブ 留学 3ヶ月',
    'セブ 留学 6ヶ月',
    'フィリピン 留学 安い',
    'セブ 留学 リアル',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: 'セブ島留学の費用構造（5項目）' },
  { id: 'cost-by-period', label: '1ヶ月・3ヶ月・6ヶ月の総額シミュレーション' },
  { id: 'school-type', label: '学校タイプ別の費用差' },
  { id: 'hidden-costs', label: '見落としがちな「隠れコスト」7項目' },
  { id: 'saving-tips', label: 'セブ島留学で節約する5つのコツ' },
  { id: 'experiences', label: '体験談から見る実際の費用' },
  { id: 'faq', label: 'よくある質問' },
];

const COST_BREAKDOWN = [
  {
    item: '① 学費（授業料）',
    range: '5〜15万円/月',
    detail: 'マンツーマン中心の学校で月8〜12万円が標準。スパルタ系は6〜8万円、リゾート系は12〜15万円。',
  },
  {
    item: '② 寮費（宿泊費）',
    range: '3〜8万円/月',
    detail: '校内寮の相部屋なら月3〜4万円、個室なら月6〜8万円。多くの学校は学費に含まれる「パッケージ料金」。',
  },
  {
    item: '③ 食費（学校提供）',
    range: '学費に含まれる場合多い',
    detail: 'ほぼ全ての学校が3食付き。学外で食べる週末・外食を別途月1〜2万円見込む。',
  },
  {
    item: '④ お小遣い（外食・買い物）',
    range: '2〜4万円/月',
    detail: 'マッサージ（1時間500〜1,000円）、週末旅行、お土産、SIM、洗濯代など。',
  },
  {
    item: '⑤ 隠れコスト（後述）',
    range: '1〜3万円/月',
    detail: 'SSP（特別就学許可証）、ビザ延長、ACR I-Card、電気代、教材費など。',
  },
];

const PERIODS = [
  {
    period: '1ヶ月留学',
    schoolFee: '8〜15万円',
    living: '2〜4万円',
    initial: '5万円',
    total: '15〜24万円',
    note: '短期集中。学費・宿泊込みパッケージ＋初期費用（航空券・SSP・保険）',
  },
  {
    period: '3ヶ月留学',
    schoolFee: '24〜45万円',
    living: '6〜12万円',
    initial: '8万円',
    total: '38〜65万円',
    note: '英語ゼロから日常会話到達する標準期間。ビザ延長1回必要。',
  },
  {
    period: '6ヶ月留学',
    schoolFee: '48〜85万円',
    living: '12〜24万円',
    initial: '10万円',
    total: '70〜120万円',
    note: 'ビジネス英語・IELTS対策まで到達可能。ビザ延長2〜3回必要。',
  },
];

const SCHOOL_TYPES = [
  {
    type: 'スパルタ系（バギオ・セブ）',
    cost: '月13〜18万円（寮・食事込み）',
    feature: '1日10〜12時間の授業、平日外出禁止。短期集中で英語力を最大化したい人向け。',
    example: 'PINES, MONOL, Genius English',
  },
  {
    type: '標準系（セブ）',
    cost: '月15〜22万円（寮・食事込み）',
    feature: '1日6〜8時間の授業、平日外出OK。バランス重視の最大派閥。',
    example: 'CIA, SMEAG, CPI, QQ English',
  },
  {
    type: 'リゾート系（マクタン島）',
    cost: '月20〜28万円（寮・食事込み）',
    feature: '海沿いのリゾート併設、週末ビーチ、観光と両立。社会人・家族向け。',
    example: 'Bayside, Cebu Blue Ocean Academy',
  },
  {
    type: '親子留学プログラム',
    cost: '月25〜40万円（親子2人）',
    feature: '子供向けプログラム＋親の語学コース。ファミリールーム提供。',
    example: 'Genius English Family, EV Family',
  },
];

const HIDDEN_COSTS = [
  {
    item: 'SSP（特別就学許可証）',
    cost: '約16,000円（一律）',
    note: '到着後に学校経由で申請。フィリピンで語学学校に通うために必須。',
  },
  {
    item: 'ビザ延長費用（30日ごと）',
    cost: '約12,000〜15,000円/回',
    note: 'ビザなし渡航は30日まで。それ以降は学校経由で延長申請。3ヶ月以上滞在は要注意。',
  },
  {
    item: 'ACR I-Card（59日以上滞在）',
    cost: '約8,000円（一律）',
    note: '59日を超える滞在で必須の外国人ID。学校経由で申請。',
  },
  {
    item: '電気代（個別徴収）',
    cost: '月2,000〜5,000円',
    note: 'エアコン使用量に応じて。多くの学校が月末に実費精算。',
  },
  {
    item: '教材費',
    cost: '初回5,000〜10,000円',
    note: '入学時に必要なテキスト代。学校により含まれる場合と別途の場合あり。',
  },
  {
    item: '空港送迎',
    cost: '無料〜3,000円',
    note: '多くの学校が初回無料。日曜以外の到着は有料の学校も。',
  },
  {
    item: '海外旅行保険',
    cost: '月7,000〜15,000円',
    note: 'クレジットカード付帯保険でカバーしきれない期間分。3ヶ月以上なら任意加入の保険が必要。',
  },
];

const SAVING_TIPS = [
  '早期申込割引（出発3〜6ヶ月前で5〜10%引き）',
  '長期割引（3ヶ月以上で5〜15%引き）',
  '相部屋（3人部屋）を選ぶ（個室より月2〜3万円安い）',
  'マッサージ・外食を週1〜2回に絞る（月1〜2万円節約可）',
  '航空券を3〜4ヶ月前に予約（往復5〜8万円）',
];

const FAQS = [
  {
    question: 'セブ島留学は本当に安いですか？',
    answer:
      'はい、欧米留学と比べると圧倒的に安いです。1ヶ月の総額で比較すると、セブ島15〜24万円に対しオーストラリア・カナダは35〜50万円、アメリカ・イギリスは45〜70万円。同じ予算で2〜3倍の期間留学できます。',
  },
  {
    question: '寮の相部屋と個室、どちらがおすすめ？',
    answer:
      '英語環境重視なら相部屋（外国人ルームメイトとの英会話機会）、勉強・休息重視なら個室。費用差は月2〜3万円。初めての海外なら個室で生活リズムを整え、慣れたら相部屋に移る人もいます。',
  },
  {
    question: 'ビザ延長は学校がやってくれる？',
    answer:
      'はい、ほぼ全ての学校が代行してくれます。費用は実費＋手数料2,000〜5,000円程度。延長手続きは入国管理局（Bureau of Immigration）で行われ、学校がパスポートを預かって代理申請します。',
  },
  {
    question: '隠れコストはどれくらい上乗せされる？',
    answer:
      '3ヶ月留学の場合、SSP（16,000円）＋ビザ延長2回（25,000円）＋ACR I-Card（8,000円）＋電気代（9,000円）＋雑費＝合計5〜7万円程度。これを含めた総額を予算に組み込みましょう。',
  },
  {
    question: 'セブ島留学で英語はどれくらい伸びる？',
    answer:
      '個人差はありますが、TOEIC400→600（3ヶ月）、TOEIC600→750（3ヶ月）が標準的な伸び。1日6〜10時間のマンツーマン授業＋寮での会話が効果的。スパルタ系を選ぶとさらに伸びは早いです。',
  },
];

export default async function CebuStudyRealCostPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const phExperiences = all.filter((e) => e.country?.id === 'philippines');
  const mentions = countMentions(phExperiences, /(費用|料金|お金|寮|学費|生活費|節約)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(費用|料金|お金|寮|学費|生活費|節約)/
      )
    : null;

  const phCount = phExperiences.length;
  const livingValues = phExperiences
    .map((e) => e.monthlyLivingJpy)
    .filter((v): v is number => v != null);
  const avgLiving = livingValues.length > 0
    ? Math.round(livingValues.reduce((s, v) => s + v, 0) / livingValues.length)
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'セブ島留学の費用リアル', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'セブ島留学の費用リアル' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              セブ島留学の費用リアル｜1ヶ月・3ヶ月・6ヶ月の総額シミュレーション
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="セブ島留学を検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「セブ島留学は安い」と聞くけど、実際いくら？という疑問にお答えします。
              <br />
              この記事では、学費・寮費・食費・お小遣い・隠れコストの5項目を全部含めた「総額」を、1ヶ月・3ヶ月・6ヶ月の3パターンで明示。
              <br />
              学校タイプ別の費用差、見落としがちな「隠れコスト」、節約のコツまで実例ベースでまとめました。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'セブ島留学の総額：1ヶ月15〜24万円・3ヶ月38〜65万円・6ヶ月70〜120万円',
              '隠れコスト（SSP・ビザ延長・ACR・電気代）は3ヶ月で5〜7万円上乗せ',
              'スパルタ系・標準系・リゾート系で月5〜10万円の費用差',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 費用構造 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">セブ島留学の費用構造（5項目）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              セブ島留学の費用は、大きく分けて5項目。「学費・寮費・食費」は学校パッケージに含まれていることが多く、別途「お小遣い・隠れコスト」を計算する必要があります。
            </p>
            <div className="space-y-3">
              {COST_BREAKDOWN.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <h3 className="font-bold text-base">{c.item}</h3>
                    <span className="text-sm font-bold text-primary-700">{c.range}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 期間別シミュレーション */}
          <section id="cost-by-period" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">1ヶ月・3ヶ月・6ヶ月の総額シミュレーション</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              「初期費用（航空券・保険・SSP）＋月額費用」で、3パターンの総額をまとめました。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold">期間</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">学校パッケージ</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">生活費</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">初期費用</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">総額</th>
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((p) => (
                    <tr key={p.period} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-bold">{p.period}</td>
                      <td className="px-3 py-3 text-xs">{p.schoolFee}</td>
                      <td className="px-3 py-3 text-xs">{p.living}</td>
                      <td className="px-3 py-3 text-xs">{p.initial}</td>
                      <td className="px-3 py-3 font-bold text-primary-700 text-xs">{p.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2">
              {PERIODS.map((p) => (
                <div key={`note-${p.period}`} className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700">
                  <strong>{p.period}：</strong>{p.note}
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="フィリピン留学を含めて、自分に合う国を診断"
            description="5問の診断で、フィリピン以外の選択肢（マルタ・カナダ・豪等）も含めて相性スコアでTOP3提案。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/countries/philippines"
            secondaryLabel="フィリピン国別ガイド"
          />

          {/* 学校タイプ別 */}
          <section id="school-type" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">学校タイプ別の費用差</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              セブ島の学校は大きく4タイプ。費用も特徴も違うため、優先順位で選びましょう。
            </p>
            <div className="space-y-3">
              {SCHOOL_TYPES.map((s) => (
                <div key={s.type} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <h3 className="font-bold text-base">{s.type}</h3>
                    <span className="text-sm font-bold text-primary-700">{s.cost}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{s.feature}</p>
                  <p className="text-xs text-gray-500">例: {s.example}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 隠れコスト */}
          <section id="hidden-costs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">見落としがちな「隠れコスト」7項目</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              学校パッケージには含まれない、現地で発生する追加費用。3ヶ月留学なら合計5〜7万円の上乗せになります。
            </p>
            <div className="space-y-2">
              {HIDDEN_COSTS.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
                    <p className="font-bold text-sm">{i + 1}. {h.item}</p>
                    <span className="text-sm font-bold text-rose-700">{h.cost}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{h.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 節約のコツ */}
          <section id="saving-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">セブ島留学で節約する5つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SAVING_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見る実際の費用</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                フィリピン渡航者の体験談 <strong>n={phCount}件</strong> から費用関連の言及を集計しました。
              </p>
              {avgLiving && (
                <p className="text-sm text-gray-700 mb-2">
                  月平均生活費（学費含む）: <strong className="text-primary-700">¥{avgLiving.toLocaleString()}</strong>
                  <span className="text-xs text-gray-500 ml-2">（{livingValues.length}件の体験談平均）</span>
                </p>
              )}
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

          <p className="text-xs text-gray-500 mb-8">
            ※ 本記事は2026年5月時点の情報です。為替・学校料金・ビザ手数料は変動するため、最新情報は各学校公式サイト・大使館でご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/countries/philippines" className="text-primary-600 hover:underline">
                  → フィリピン国別完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語話せなくてもワーホリできる？
                </Link>
              </li>
              <li>
                <Link href="/language-school-ranking" className="text-primary-600 hover:underline">
                  → 語学学校ランキング2026
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/family-study" className="text-primary-600 hover:underline">
                  → 親子留学完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/wh-saving-tips" className="text-primary-600 hover:underline">
                  → ワーホリ節約術20選
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
