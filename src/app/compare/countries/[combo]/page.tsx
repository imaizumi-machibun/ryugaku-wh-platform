import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountryBySlug } from '@/lib/microcms/countries';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { generateCompareMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { COMPARE_COUNTRY_COMBOS, getCompareComboBySlug } from '@/lib/data/compare-combos';
import { formatJPY } from '@/lib/utils/format';
import type { Country } from '@/lib/microcms/types';

export const revalidate = 7200;

type Props = { params: { combo: string } };

export async function generateStaticParams() {
  return COMPARE_COUNTRY_COMBOS.map((c) => ({ combo: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const combo = getCompareComboBySlug(params.combo);
  if (!combo) return {};
  try {
    const [a, b] = await Promise.all([
      getCountryBySlug(combo.countryASlug),
      getCountryBySlug(combo.countryBSlug),
    ]);
    return generateCompareMetadata({
      itemAName: a.nameJp,
      itemBName: b.nameJp,
      category: '国',
      path: `/compare/countries/${params.combo}`,
    });
  } catch {
    return {};
  }
}

function CompareRow({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <tr className="border-b border-gray-200">
      <th className="py-3 pr-4 text-left text-gray-500 font-medium text-sm w-1/4">{label}</th>
      <td className="py-3 px-4 text-sm">{a}</td>
      <td className="py-3 px-4 text-sm">{b}</td>
    </tr>
  );
}

function fmtMonths(m?: number) {
  if (!m) return '—';
  if (m % 12 === 0) return `${m / 12}年`;
  return `${m}ヶ月`;
}

export default async function CompareCountriesPage({ params }: Props) {
  const combo = getCompareComboBySlug(params.combo);
  if (!combo) notFound();

  let a: Country, b: Country;
  try {
    [a, b] = await Promise.all([
      getCountryBySlug(combo.countryASlug),
      getCountryBySlug(combo.countryBSlug),
    ]);
  } catch {
    notFound();
  }

  const path = `/compare/countries/${params.combo}`;

  const faqs = [
    {
      question: `${a.nameJp}と${b.nameJp}、留学費用が安いのは？`,
      answer: a.livingCostMonthJpy && b.livingCostMonthJpy
        ? `月の生活費を比較すると${a.nameJp}は約${formatJPY(a.livingCostMonthJpy)}、${b.nameJp}は約${formatJPY(b.livingCostMonthJpy)}です。${a.livingCostMonthJpy < b.livingCostMonthJpy ? a.nameJp : b.nameJp}の方が生活費は抑えられます。学費を含めた総額は学校や都市で大きく変動します。`
        : `両国とも都市・学校により変動するため、具体的な予算を決めて見積もるのが確実です。`,
    },
    {
      question: `${a.nameJp}と${b.nameJp}、ワーキングホリデーの条件が良いのは？`,
      answer: a.visaDurationMonths && b.visaDurationMonths
        ? `ビザ滞在期間は${a.nameJp}が${fmtMonths(a.visaDurationMonths)}、${b.nameJp}が${fmtMonths(b.visaDurationMonths)}です。年齢制限はそれぞれ${a.visaAgeMin || 18}〜${a.visaAgeMax || 30}歳、${b.visaAgeMin || 18}〜${b.visaAgeMax || 30}歳。延長制度の有無も含めて比較しましょう。`
        : `ビザ条件は時期により変更されるため、最新は各国大使館・移民局の公式情報を必ず確認してください。`,
    },
    {
      question: `初めての海外で選ぶならどちら？`,
      answer: `初めての海外滞在で「日本人サポートの充実度」「日本との時差」「飛行時間」を重視するなら、${a.flightTimeHours && b.flightTimeHours && a.flightTimeHours < b.flightTimeHours ? a.nameJp : b.nameJp}（飛行時間: ${Math.min(a.flightTimeHours || 99, b.flightTimeHours || 99)}時間）の方が安心です。多文化に飛び込みたいなら${a.flightTimeHours && b.flightTimeHours && a.flightTimeHours > b.flightTimeHours ? a.nameJp : b.nameJp}も魅力的です。`,
    },
    {
      question: `語学留学に向いているのは？`,
      answer: `${a.officialLanguage || a.nameJp}を学ぶなら${a.nameJp}、${b.officialLanguage || b.nameJp}を学ぶなら${b.nameJp}が直接的に有利です。同じ英語圏でもアクセント・表現の違いがあるため、目指す進路（北米英語 or イギリス英語 or オーストラリア英語）も判断材料です。`,
    },
  ];

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '国を比較', url: '/compare' },
          { name: `${a.nameJp} vs ${b.nameJp}`, url: path },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(faqs)} />

      <div className="container-custom py-8">
        <Breadcrumb
          items={[
            { label: '国を比較', href: '/compare' },
            { label: `${a.nameJp} vs ${b.nameJp}` },
          ]}
        />

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {a.nameJp} vs {b.nameJp}｜留学・ワーホリの違いを徹底比較
          </h1>
          <p className="text-gray-600 leading-relaxed">{combo.description}</p>
        </header>

        {/* 並列表示 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[a, b].map((c, i) => (
            <Link
              key={i}
              href={`/countries/${c.id}`}
              className="bg-white border border-gray-200 hover:border-primary-400 rounded-xl p-6 transition-colors block"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{c.flagEmoji}</span>
                <div>
                  <h2 className="text-xl font-bold">{c.nameJp}</h2>
                  <p className="text-xs text-gray-500">{c.nameEn} / {c.region}</p>
                </div>
              </div>
              {c.description && (
                <p
                  className="text-sm text-gray-600 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: c.description.replace(/<[^>]+>/g, '') }}
                />
              )}
            </Link>
          ))}
        </section>

        {/* 比較表 */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-x-auto mb-10">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="py-3 pr-4 pl-4 text-left text-xs text-gray-500 uppercase tracking-wide">項目</th>
                <th className="py-3 px-4 text-left text-sm font-bold">{a.flagEmoji} {a.nameJp}</th>
                <th className="py-3 px-4 text-left text-sm font-bold">{b.flagEmoji} {b.nameJp}</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow label="地域" a={a.region || '—'} b={b.region || '—'} />
              <CompareRow label="首都" a={a.capital || '—'} b={b.capital || '—'} />
              <CompareRow label="公用語" a={a.officialLanguage || '—'} b={b.officialLanguage || '—'} />
              <CompareRow label="通貨" a={a.currency || '—'} b={b.currency || '—'} />
              <CompareRow label="時差" a={a.timeDifferenceJapan || '—'} b={b.timeDifferenceJapan || '—'} />
              <CompareRow label="飛行時間" a={`${a.flightTimeHours || '—'}時間`} b={`${b.flightTimeHours || '—'}時間`} />
              <CompareRow label="物価" a={formatJPY(a.livingCostMonthJpy) + '/月'} b={formatJPY(b.livingCostMonthJpy) + '/月'} />
              <CompareRow label="平均家賃" a={formatJPY(a.avgRentMonthlyJpy) + '/月'} b={formatJPY(b.avgRentMonthlyJpy) + '/月'} />
              <CompareRow label="最低賃金" a={a.minimumWageLocal || '—'} b={b.minimumWageLocal || '—'} />
              <CompareRow
                label="ワーホリ年齢"
                a={`${a.visaAgeMin || '?'}〜${a.visaAgeMax || '?'}歳`}
                b={`${b.visaAgeMin || '?'}〜${b.visaAgeMax || '?'}歳`}
              />
              <CompareRow label="ビザ期間" a={fmtMonths(a.visaDurationMonths)} b={fmtMonths(b.visaDurationMonths)} />
              <CompareRow label="ビザ申請料" a={formatJPY(a.visaCostJpy)} b={formatJPY(b.visaCostJpy)} />
              <CompareRow label="就労制限" a={a.visaWorkLimit || '—'} b={b.visaWorkLimit || '—'} />
              <CompareRow label="就学制限" a={a.visaStudyLimit || '—'} b={b.visaStudyLimit || '—'} />
              <CompareRow label="延長制度" a={a.visaRenewable ? 'あり' : 'なし'} b={b.visaRenewable ? 'あり' : 'なし'} />
              <CompareRow label="ベストシーズン" a={a.bestSeason || '—'} b={b.bestSeason || '—'} />
            </tbody>
          </table>
        </section>

        {/* どちらに向いている */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            {
              title: `${a.nameJp}が向いている人`,
              points: [
                a.livingCostMonthJpy && b.livingCostMonthJpy && a.livingCostMonthJpy < b.livingCostMonthJpy ? '物価をなるべく抑えたい人' : null,
                a.visaDurationMonths && b.visaDurationMonths && a.visaDurationMonths > b.visaDurationMonths ? `長期(${fmtMonths(a.visaDurationMonths)})で滞在したい人` : null,
                a.flightTimeHours && b.flightTimeHours && a.flightTimeHours < b.flightTimeHours ? '日本から近い国を選びたい人' : null,
                `${a.officialLanguage || a.nameJp}を学びたい人`,
                `${a.region}の文化を体験したい人`,
              ].filter(Boolean) as string[],
              bg: 'bg-primary-50',
              border: 'border-primary-200',
            },
            {
              title: `${b.nameJp}が向いている人`,
              points: [
                b.livingCostMonthJpy && a.livingCostMonthJpy && b.livingCostMonthJpy < a.livingCostMonthJpy ? '物価をなるべく抑えたい人' : null,
                b.visaDurationMonths && a.visaDurationMonths && b.visaDurationMonths > a.visaDurationMonths ? `長期(${fmtMonths(b.visaDurationMonths)})で滞在したい人` : null,
                b.flightTimeHours && a.flightTimeHours && b.flightTimeHours < a.flightTimeHours ? '日本から近い国を選びたい人' : null,
                `${b.officialLanguage || b.nameJp}を学びたい人`,
                `${b.region}の文化を体験したい人`,
              ].filter(Boolean) as string[],
              bg: 'bg-accent-50',
              border: 'border-accent-200',
            },
          ].map((box, i) => (
            <div key={i} className={`${box.bg} border ${box.border} rounded-xl p-6`}>
              <h3 className="font-bold mb-3 text-lg">{box.title}</h3>
              <ul className="space-y-2">
                {box.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-primary-600 mt-1">●</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">よくある質問</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">&#9660;</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <RelatedLinks
          sections={[
            {
              title: '他の国比較',
              links: COMPARE_COUNTRY_COMBOS.filter((c) => c.slug !== params.combo)
                .slice(0, 8)
                .map((c) => ({
                  label: `${c.slug.replace('-vs-', ' vs ')}`,
                  href: `/compare/countries/${c.slug}`,
                })),
            },
            {
              title: '各国の詳細',
              links: [
                { label: `${a.nameJp}の留学・ワーホリ完全ガイド`, href: `/countries/${a.id}` },
                { label: `${a.nameJp}の費用を徹底解説`, href: `/countries/${a.id}/cost` },
                { label: `${b.nameJp}の留学・ワーホリ完全ガイド`, href: `/countries/${b.id}` },
                { label: `${b.nameJp}の費用を徹底解説`, href: `/countries/${b.id}/cost` },
              ],
            },
          ]}
        />
      </div>
    </>
  );
}
