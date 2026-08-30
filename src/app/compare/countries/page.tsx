import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateItemListJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { COMPARE_COUNTRY_COMBOS } from '@/lib/data/compare-combos';
import { getCountries } from '@/lib/microcms/countries';
import { getExperiences } from '@/lib/microcms/experiences';
import { formatJPY } from '@/lib/utils/format';

export const revalidate = 86400;

// ランキング比較表の対象（人気9カ国・順序固定）
const RANKING_SLUGS = [
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
  title: `ワーホリ 国 比較【2026年版】人気9カ国ランキングと費用・治安・稼ぎやすさ`,
  description: `ワーホリで人気の国を費用・治安・稼ぎやすさで徹底比較。オーストラリア・カナダ・アイルランドなど主要国のビザ・生活費・最低賃金をランキング形式で一覧化。`,
  path: '/compare/countries',
  keywords: [
    'ワーホリ 国 比較',
    'ワーホリ 国 ランキング',
    'ワーホリ おすすめ 国',
    'ワーホリ 比較',
    'ワーホリ 行きやすい 国',
    'オーストラリア カナダ どっち',
    'ワーホリ 国別',
  ],
});

const FAQS = [
  {
    question: 'ワーホリで最も人気の国はどこですか？',
    answer:
      'オーストラリア・カナダ・ニュージーランド・アイルランドの英語圏4カ国がトップ4です。中でもオーストラリアは最低賃金が高く（時給AUD24.10）、現地で稼ぎながら生活費を補填しやすいため最も多くの日本人ワーホリ渡航者がいます。',
  },
  {
    question: '英語が話せなくてもワーホリできる国はありますか？',
    answer:
      'フィリピン・マルタは日本人向け語学学校が充実しており、英語ゼロでも生活開始しやすい環境です。台湾・韓国は日本語が通じやすく、東南アジアでは日本食材も入手しやすいため初心者の海外滞在ファーストステップに適しています。',
  },
  {
    question: 'アジア圏でワーホリビザが取れる国はどこですか？',
    answer:
      '台湾・韓国・香港・シンガポール・タイなどがアジア圏のワーホリ協定国です。費用が抑えやすく、時差も小さいため日本との連絡がしやすい点がメリット。一方、英語環境としては英語圏国に比べて限定的です。',
  },
  {
    question: '費用が最も安いワーホリ先はどの国ですか？',
    answer:
      'フィリピン・台湾・韓国などアジア圏は月額生活費10〜15万円程度と最も抑えやすい国です。欧米圏ならアイルランド・ニュージーランドが比較的安く、オーストラリア・カナダの主要都市は月額25〜30万円が目安となります。',
  },
  {
    question: 'ワーホリビザを2カ国連続で取ることはできますか？',
    answer:
      '可能です。実際にオーストラリア→カナダ、ニュージーランド→アイルランドなど複数国をはしごする方も多く、最大4〜6年の海外生活を実現できます。ただし各国の年齢制限（多くが30歳まで）に注意が必要です。',
  },
];

type RankingRow = {
  slug: string;
  nameJp: string;
  flagEmoji?: string;
  livingCostMonthJpy?: number;
  visaCostJpy?: number;
  visaDurationMonths?: number;
  visaAgeMax?: number;
  minimumWageLocal?: string;
  ratingSafety: number | null;
  ratingJob: number | null;
  ratingCost: number | null;
  experienceCount: number;
};

// 月額生活費から5段階の費用スコア（安い=高得点）に変換
function costScore(jpy?: number): number {
  if (jpy == null) return 0;
  if (jpy <= 100000) return 5;
  if (jpy <= 150000) return 4;
  if (jpy <= 200000) return 3;
  if (jpy <= 250000) return 2;
  return 1;
}

function renderStars(score: number | null): string {
  if (score == null || score === 0) return '—';
  const filled = Math.round(score);
  return '★'.repeat(filled) + '☆'.repeat(Math.max(0, 5 - filled));
}

export default async function CompareCountriesTopPage() {
  const [countriesData, experiencesData] = await Promise.all([
    getCountries({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getExperiences({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
  ]);

  const countryMap = new Map(countriesData.contents.map((c) => [c.id, c]));

  // 国別の評価集計
  const ratingsByCountry = new Map<string, { safety: number[]; job: number[]; cost: number[] }>();
  for (const exp of experiencesData.contents) {
    if (!exp.country?.id) continue;
    const arr = ratingsByCountry.get(exp.country.id) ?? { safety: [], job: [], cost: [] };
    if (exp.ratingSafety != null) arr.safety.push(exp.ratingSafety);
    if (exp.ratingJob != null) arr.job.push(exp.ratingJob);
    if (exp.ratingCost != null) arr.cost.push(exp.ratingCost);
    ratingsByCountry.set(exp.country.id, arr);
  }

  const rankingRows: RankingRow[] = RANKING_SLUGS.map((slug) => {
    const country = countryMap.get(slug);
    const ratings = ratingsByCountry.get(slug);
    const avg = (vals: number[]) =>
      vals.length === 0 ? null : Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
    return {
      slug,
      nameJp: country?.nameJp ?? slug,
      flagEmoji: country?.flagEmoji,
      livingCostMonthJpy: country?.livingCostMonthJpy,
      visaCostJpy: country?.visaCostJpy,
      visaDurationMonths: country?.visaDurationMonths,
      visaAgeMax: country?.visaAgeMax,
      minimumWageLocal: country?.minimumWageLocal,
      ratingSafety: ratings ? avg(ratings.safety) : null,
      ratingJob: ratings ? avg(ratings.job) : null,
      ratingCost: ratings ? avg(ratings.cost) : null,
      experienceCount: ratings?.safety.length ?? 0,
    };
  }).filter((r) => r.nameJp !== r.slug);

  // 目的別おすすめ国の絞り込み
  const cheapest = [...rankingRows]
    .filter((r) => r.livingCostMonthJpy)
    .sort((a, b) => (a.livingCostMonthJpy ?? 0) - (b.livingCostMonthJpy ?? 0))
    .slice(0, 3);

  const englishImmersion = rankingRows.filter((r) =>
    ['australia', 'canada', 'new-zealand', 'ireland', 'united-kingdom'].includes(r.slug)
  );

  const highWage = rankingRows.filter((r) =>
    ['australia', 'canada', 'new-zealand'].includes(r.slug)
  );

  const olderApplicants = rankingRows.filter((r) => (r.visaAgeMax ?? 30) >= 35);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '国を比較', url: '/compare' },
          { name: '国別比較一覧', url: '/compare/countries' },
        ])}
      />
      <JsonLd
        data={generateItemListJsonLd({
          name: 'ワーホリ人気9カ国ランキング',
          items: rankingRows.map((r) => ({
            name: r.nameJp,
            url: `/countries/${r.slug}`,
          })),
        })}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '国を比較', href: '/compare' }, { label: '国別比較一覧' }]} />

        <article className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            人気9カ国を費用・治安・稼ぎやすさで並べた【ランキング】
          </h1>
          <ArticleMetaBadge
            readingMinutes={7}
            updatedAt="2026年5月"
            targetAudience="行く国を比較検討中の方"
          />
          <p className="text-gray-700 leading-relaxed text-base">
            「どの国に行くか、まだ決められない」
            <br />
            そんな方のために、ワーホリで人気の9カ国を「費用・治安・稼ぎやすさ」の3軸で比較しました。
            <br />
            公的データと、実際の渡航者{experiencesData.contents.length}件分の評価を組み合わせて、後悔しない国選びの判断材料を一覧化しています。
          </p>
        </header>

        <KeyTakeaway
          items={[
            '人気9カ国の総合ランキング（費用・治安・稼ぎやすさの3軸）',
            '目的別おすすめ国（節約・英語・稼ぐ・30代以降）',
            '国vs国の詳細比較ページ一覧と、ワーホリ国比較に関するFAQ',
          ]}
        />

        {/* 人気9カ国ランキング比較表 */}
        {rankingRows.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-3">人気9カ国 総合ランキング比較表</h2>
            <p className="text-sm text-gray-600 mb-4">
              費用は月額生活費が安いほど高得点。治安・稼ぎやすさは体験談の5段階評価の国別平均値です。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">国</th>
                    <th className="px-3 py-3 font-semibold text-center whitespace-nowrap">費用</th>
                    <th className="px-3 py-3 font-semibold text-center whitespace-nowrap">治安</th>
                    <th className="px-3 py-3 font-semibold text-center whitespace-nowrap">稼ぎやすさ</th>
                    <th className="px-3 py-3 font-semibold text-right whitespace-nowrap">月生活費</th>
                    <th className="px-3 py-3 font-semibold text-right whitespace-nowrap">ビザ期間</th>
                    <th className="px-3 py-3 font-semibold text-right whitespace-nowrap">年齢上限</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingRows.map((row) => (
                    <tr key={row.slug} className="border-t border-gray-100">
                      <td className="px-3 py-3">
                        <Link
                          href={`/countries/${row.slug}`}
                          className="text-primary-600 hover:underline font-medium"
                        >
                          {row.flagEmoji} {row.nameJp}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-center text-amber-600">
                        {renderStars(costScore(row.livingCostMonthJpy))}
                      </td>
                      <td className="px-3 py-3 text-center text-amber-600">
                        {renderStars(row.ratingSafety)}
                      </td>
                      <td className="px-3 py-3 text-center text-amber-600">
                        {renderStars(row.ratingJob)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {row.livingCostMonthJpy ? formatJPY(row.livingCostMonthJpy) : '—'}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {row.visaDurationMonths ? `${row.visaDurationMonths}ヶ月` : '—'}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {row.visaAgeMax ? `${row.visaAgeMax}歳` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 治安・稼ぎやすさは渡航者の自己申告ベース。データが不足している国は「—」表示です。
            </p>
          </section>
        )}

        {/* 中段CTA */}
        <MidCTA
          title="自分に合う国を5問の診断で見つける"
          description="目的・期間・予算・治安の希望を入力するだけで、相性スコアつきでTOP3を提案します。"
          primaryHref="/matching"
          primaryLabel="国診断をはじめる"
          secondaryHref="/budget"
          secondaryLabel="費用から探す"
        />

        {/* 目的別おすすめ国 */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">目的別 おすすめワーホリ国</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cheapest.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-2">💰 できるだけ費用を抑えたい</h3>
                <p className="text-xs text-gray-500 mb-3">月額生活費が安い順 TOP3</p>
                <ul className="space-y-1.5 text-sm">
                  {cheapest.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/countries/${r.slug}`} className="text-primary-600 hover:underline">
                        {r.flagEmoji} {r.nameJp}
                      </Link>
                      <span className="text-gray-500 ml-2">
                        {r.livingCostMonthJpy ? `月${formatJPY(r.livingCostMonthJpy)}〜` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {englishImmersion.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-2">📘 英語を本気で伸ばしたい</h3>
                <p className="text-xs text-gray-500 mb-3">英語が公用語の主要国</p>
                <ul className="space-y-1.5 text-sm">
                  {englishImmersion.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/countries/${r.slug}`} className="text-primary-600 hover:underline">
                        {r.flagEmoji} {r.nameJp}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {highWage.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-2">💼 稼ぎながら長期滞在したい</h3>
                <p className="text-xs text-gray-500 mb-3">最低賃金が高く現地収入を期待しやすい国</p>
                <ul className="space-y-1.5 text-sm">
                  {highWage.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/countries/${r.slug}`} className="text-primary-600 hover:underline">
                        {r.flagEmoji} {r.nameJp}
                      </Link>
                      <span className="text-gray-500 ml-2">
                        {r.minimumWageLocal ?? ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {olderApplicants.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-2">🎂 30代以降でも申請したい</h3>
                <p className="text-xs text-gray-500 mb-3">ビザ年齢上限が35歳以上の国</p>
                <ul className="space-y-1.5 text-sm">
                  {olderApplicants.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/countries/${r.slug}`} className="text-primary-600 hover:underline">
                        {r.flagEmoji} {r.nameJp}
                      </Link>
                      <span className="text-gray-500 ml-2">最大{r.visaAgeMax}歳</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* 国 vs 国 詳細比較ページ一覧 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-3">国 vs 国の詳細比較ページ</h2>
          <p className="text-sm text-gray-600 mb-4">
            気になる2カ国を選んで、費用・ビザ・気候・治安・求人事情を詳細比較できます。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {COMPARE_COUNTRY_COMBOS.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/countries/${c.slug}`}
                className="bg-white border border-gray-200 hover:border-primary-400 hover:shadow-soft-lg rounded-lg p-4 transition-all block"
              >
                <h3 className="font-bold text-base mb-1">
                  {c.slug.replace('-vs-', ' vs ').replace(/-/g, ' ')}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">ワーホリ国比較に関するよくある質問</h2>
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
              <Link href="/budget" className="text-primary-600 hover:underline">
                → ワーホリ費用 比較ガイド（国別総費用）
              </Link>
            </li>
            <li>
              <Link href="/age/20s-late" className="text-primary-600 hover:underline">
                → 社会人ワーホリ完全ガイド（20代後半）
              </Link>
            </li>
            <li>
              <Link href="/packing" className="text-primary-600 hover:underline">
                → ワーホリ持ち物チェックリスト
              </Link>
            </li>
            <li>
              <Link href="/countries/ireland/working-holiday" className="text-primary-600 hover:underline">
                → アイルランド ワーホリ完全ガイド
              </Link>
            </li>
            <li>
              <Link href="/countries/germany/working-holiday" className="text-primary-600 hover:underline">
                → ドイツ ワーホリ完全ガイド
              </Link>
            </li>
            <li>
              <Link href="/countries" className="text-primary-600 hover:underline">
                → 53カ国の詳細情報を見る
              </Link>
            </li>
          </ul>
        </section>
        </article>
      </div>
    </>
  );
}
