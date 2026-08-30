import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/layout/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateItemListJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { BUDGETS } from '@/lib/data/budgets';
import { formatJPY } from '@/lib/utils/format';
import { getCountries } from '@/lib/microcms/countries';
import { getExperiences } from '@/lib/microcms/experiences';

export const revalidate = 86400;

// 比較表に並べる人気9カ国（順序固定で安定したSEO面表示にする）
const POPULAR_COUNTRY_SLUGS = [
  'australia',
  'canada',
  'new-zealand',
  'ireland',
  'united-kingdom',
  'malta',
  'philippines',
  'taiwan',
  'south-korea',
];

export const metadata: Metadata = generatePageMetadata({
  title: `ワーホリ費用 比較ガイド｜国別の総費用と予算別プラン全${BUDGETS.length}通り【2026年版】`,
  description: `ワーホリの費用を国別・予算別に徹底比較。30万円の格安プランから500万円超のMBAまで、ビザ代・生活費・語学学校代の総額をひと目で比較できます。`,
  path: '/budget',
  keywords: [
    'ワーホリ 費用 比較',
    'ワーホリ 費用',
    'ワーホリ 国別 費用',
    'ワーホリ 予算',
    '留学 費用 比較',
    '30万円 留学',
    '100万円 ワーホリ',
    '安い ワーホリ',
  ],
});

const FAQS = [
  {
    question: 'ワーホリに必要な貯金の最低ラインはいくらですか？',
    answer:
      'オーストラリア・カナダなど人気国の場合、初期費用50万円＋現地3ヶ月分の生活費として最低80〜100万円が目安です。現地で働いて補填する前提なら100〜150万円、語学学校に長く通うなら200万円以上が安心ラインです。',
  },
  {
    question: 'オーストラリアとカナダ、費用を抑えやすいのはどちらですか？',
    answer:
      '最低賃金が高く稼ぎやすいのはオーストラリア（時給AUD24.10）。初期費用はカナダの方が航空券分やや安く済みます。1年滞在の総支出を体験談で比較すると、オーストラリアは現地収入で生活費をほぼまかなえるケースが多く、純粋な持ち出しはカナダより少なくなる傾向があります。',
  },
  {
    question: '現地で稼いだお金で生活費はまかなえますか？',
    answer:
      'オーストラリア・カナダ・ニュージーランドであれば、フルタイム勤務でほぼ生活費を補填できます。語学学校に通う期間は週20時間制限などがあるため、3〜6ヶ月分の生活費を出発前に貯めておくのが現実的です。',
  },
  {
    question: '語学学校に通わないとどれくらい費用は節約できますか？',
    answer:
      '語学学校1ヶ月で15〜30万円が相場のため、半年通学した場合90〜180万円の差になります。ただし語学力が伸び悩むと求人の選択肢が狭まり結果的に稼ぎが減るため、最初の1〜3ヶ月だけ通学する折衷案を選ぶ体験談が多いです。',
  },
  {
    question: '渡航前に準備すべき費用（ビザ代・航空券など）の合計は？',
    answer:
      'ビザ代3〜5万円、航空券10〜25万円、海外保険年間15〜25万円、初期滞在費（ホームステイ4週間など）8〜15万円が標準的。合計で40〜70万円が出発時点で必要になります。詳細は各国ページでご確認いただけます。',
  },
];

type CountryComparisonRow = {
  slug: string;
  nameJp: string;
  flagEmoji?: string;
  visaCostJpy?: number;
  livingCostMonthJpy?: number;
  avgRentMonthlyJpy?: number;
  visaDurationMonths?: number;
  actualLivingJpy: number | null;
  experienceCount: number;
};

export default async function BudgetTopPage() {
  const [countriesData, experiencesData] = await Promise.all([
    getCountries({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getExperiences({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
  ]);

  const countryMap = new Map(countriesData.contents.map((c) => [c.id, c]));

  // 国別の体験談 monthlyLivingJpy 平均
  const experienceByCountry = new Map<string, number[]>();
  for (const exp of experiencesData.contents) {
    if (!exp.country?.id || exp.monthlyLivingJpy == null) continue;
    const arr = experienceByCountry.get(exp.country.id) ?? [];
    arr.push(exp.monthlyLivingJpy);
    experienceByCountry.set(exp.country.id, arr);
  }

  const comparisonRows: CountryComparisonRow[] = POPULAR_COUNTRY_SLUGS.map((slug) => {
    const country = countryMap.get(slug);
    const livings = experienceByCountry.get(slug) ?? [];
    const actualLivingJpy =
      livings.length > 0 ? Math.round(livings.reduce((s, v) => s + v, 0) / livings.length) : null;
    return {
      slug,
      nameJp: country?.nameJp ?? slug,
      flagEmoji: country?.flagEmoji,
      visaCostJpy: country?.visaCostJpy,
      livingCostMonthJpy: country?.livingCostMonthJpy,
      avgRentMonthlyJpy: country?.avgRentMonthlyJpy,
      visaDurationMonths: country?.visaDurationMonths,
      actualLivingJpy,
      experienceCount: livings.length,
    };
  }).filter((row) => row.nameJp !== row.slug); // データが揃っていない国は除外

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '予算から探す', url: '/budget' },
        ])}
      />
      <JsonLd
        data={generateItemListJsonLd({
          name: '予算別ワーホリ・留学プラン',
          items: BUDGETS.map((b) => ({ name: `予算${b.label}`, url: `/budget/${b.slug}` })),
        })}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom pt-6">
        <Breadcrumb items={[{ label: '予算から探す' }]} />
      </div>
      <PageHero
        eyebrow="Budget"
        title="国別の費用を比較して、損しない国選びを"
        description={`ワーホリの費用は国や期間で2倍以上変わります。人気9カ国の総費用比較と、予算別プラン全${BUDGETS.length}通りを、実際の体験談データと合わせて一覧化しました。`}
      />

      <div className="container-custom py-12 md:py-16">
        <article className="max-w-5xl mx-auto">
        <header className="mb-6">
          <ArticleMetaBadge
            readingMinutes={6}
            updatedAt="2026年5月"
            targetAudience="予算が気になるワーホリ志望の方"
          />
        </header>

        <KeyTakeaway
          items={[
            '人気9カ国の総費用比較表（ビザ代・生活費・家賃・実態値）',
            '予算別ワーホリ・留学プラン全' + BUDGETS.length + '通りと、それぞれの推奨期間',
            'ワーホリ費用に関するよくある質問5つに回答',
          ]}
        />

        {/* 国別 総費用比較表 */}
        {comparisonRows.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-3">人気9カ国 総費用 比較表</h2>
            <p className="text-sm text-gray-600 mb-4">
              ビザ代・公的データの月額生活費・体験談ベースの実態生活費を国別に並べました。実際の生活費は体験談 {experiencesData.contents.length} 件から国別平均を算出しています。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">国</th>
                    <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">ビザ代</th>
                    <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">ビザ期間</th>
                    <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">月額生活費（目安）</th>
                    <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">月額家賃（目安）</th>
                    <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">体験談平均</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.slug} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <Link
                          href={`/countries/${row.slug}`}
                          className="text-primary-600 hover:underline font-medium"
                        >
                          {row.flagEmoji} {row.nameJp}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.visaCostJpy ? formatJPY(row.visaCostJpy) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.visaDurationMonths ? `${row.visaDurationMonths}ヶ月` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.livingCostMonthJpy ? formatJPY(row.livingCostMonthJpy) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.avgRentMonthlyJpy ? formatJPY(row.avgRentMonthlyJpy) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.actualLivingJpy ? (
                          <>
                            {formatJPY(row.actualLivingJpy)}
                            <span className="text-xs text-gray-500 block">
                              （{row.experienceCount}件平均）
                            </span>
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 公的データの月額生活費は国別ページ収録の公式情報、体験談平均は実際にワーホリへ行った方の自己申告ベースです。
            </p>
          </section>
        )}

        {/* 中段CTA */}
        <MidCTA
          title="費用を抑えつつ、自分に合う国を1分で探す"
          description="目的・期間・予算・治安の条件から、9カ国の中であなたに合う国を診断します。"
          primaryHref="/matching"
          primaryLabel="国診断をはじめる"
          secondaryHref="/compare/countries"
          secondaryLabel="国別ランキングを見る"
        />

        {/* 予算別プラン */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">予算別ワーホリ・留学プラン（全{BUDGETS.length}通り）</h2>
          <p className="text-sm text-gray-600 mb-4">
            自分の予算で実現できる留学・ワーホリプランを一覧で確認。各プランで推奨される国・期間も解説しています。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BUDGETS.map((b) => (
              <Link
                key={b.slug}
                href={`/budget/${b.slug}`}
                className="bg-white border border-gray-200 hover:border-primary-400 hover:shadow-soft-lg rounded-xl p-6 transition-all block"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="font-bold text-2xl text-primary-700">{b.label}</h3>
                  <span className="text-xs text-gray-500">
                    {b.minJpy === 0
                      ? `〜${formatJPY(b.maxJpy)}`
                      : b.maxJpy === Infinity
                      ? `${formatJPY(b.minJpy)}〜`
                      : `${formatJPY(b.minJpy)}〜${formatJPY(b.maxJpy)}`}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{b.description}</p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">想定期間:</span> {b.recommendedDuration}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">ワーホリ費用に関するよくある質問</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 内部リンク */}
        <section className="mb-8 bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">合わせて読みたい</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <li>
              <Link href="/compare/countries" className="text-primary-600 hover:underline">
                → ワーホリ国 比較ランキング【人気9カ国】
              </Link>
            </li>
            <li>
              <Link href="/compare" className="text-primary-600 hover:underline">
                → 国を2つ並べて詳細比較する
              </Link>
            </li>
            <li>
              <Link href="/guide/visa-cost" className="text-primary-600 hover:underline">
                → ワーホリ完全ガイド：ビザと費用のフェーズ
              </Link>
            </li>
            <li>
              <Link href="/age/20s-late" className="text-primary-600 hover:underline">
                → 社会人ワーホリ完全ガイド（20代後半）
              </Link>
            </li>
          </ul>
        </section>
        </article>
      </div>
    </>
  );
}
