import Link from 'next/link';
import { BUDGETS } from '@/lib/data/budgets';
import { GENERATIONS } from '@/lib/data/generations';
import { DURATIONS } from '@/lib/data/durations';
import { OCCUPATIONS } from '@/lib/data/occupations';

type Props = {
  countryCount: number;
  schoolCount: number;
  experienceCount: number;
  articleCount: number;
};

export default function DatabaseGateway({
  countryCount,
  schoolCount,
  experienceCount,
  articleCount,
}: Props) {
  const tier1: {
    href: string;
    label: string;
    desc: string;
    count: number | null;
    unit: string;
  }[] = [
    { href: '/countries', label: '国から探す', desc: 'ビザ・費用・条件で比較', count: countryCount, unit: 'カ国' },
    { href: '/schools', label: '学校から探す', desc: '口コミ・費用で比較', count: schoolCount, unit: '校' },
    { href: '/experiences', label: '体験談を読む', desc: '経験者のリアルな声', count: experienceCount, unit: '件' },
    { href: '/articles', label: 'お役立ち記事', desc: 'ビザ・費用・準備の解説', count: articleCount, unit: '本' },
    { href: '/compare', label: '国を比較する', desc: '2カ国を横並びで比較', count: null, unit: '' },
    { href: '/matching', label: '国を診断する', desc: '6つの質問で診断', count: null, unit: '' },
  ];

  const axes = [
    { label: '予算から', href: '/budget', chips: BUDGETS.map((b) => ({ href: `/budget/${b.slug}`, label: b.label })) },
    { label: '期間から', href: '/duration', chips: DURATIONS.map((d) => ({ href: `/duration/${d.slug}`, label: d.label })) },
    { label: '年代から', href: '/age', chips: GENERATIONS.map((g) => ({ href: `/age/${g.slug}`, label: g.label })) },
    { label: '職種から', href: '/jobs', chips: OCCUPATIONS.slice(0, 8).map((o) => ({ href: `/jobs/${o.slug}`, label: o.label })) },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <h2 className="max-w-3xl text-display font-black text-gray-900">データベースから探す</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-gray-600">
          国・学校・体験談・記事のデータと、条件別のまとめから、自由に探せます。
        </p>

        {/* Tier1: 罫線グリッド（番号＋ラベル＋件数） */}
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
          {tier1.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white p-6 transition-colors hover:bg-gray-50/80"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black tabular-nums text-gray-200 transition-colors group-hover:text-primary-300 md:text-3xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.count != null ? (
                  <span className="text-2xl font-black tabular-nums text-primary-700 md:text-3xl">
                    {item.count.toLocaleString()}
                    <span className="ml-0.5 text-xs font-medium text-gray-400">{item.unit}</span>
                  </span>
                ) : (
                  <span className="text-base font-bold text-accent-700 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-700 md:text-xl">
                {item.label}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* Tier2: 条件から探す */}
        <div className="mt-16">
          <h3 className="mb-8 text-xl font-bold text-gray-900 md:text-2xl">条件から探す</h3>
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
            {axes.map((axis) => (
              <div key={axis.href}>
                <Link
                  href={axis.href}
                  className="group mb-4 flex items-baseline justify-between border-b border-gray-200 pb-2 font-bold text-gray-900 transition-colors hover:text-primary-700"
                >
                  <span>{axis.label}</span>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-primary-600">すべて見る →</span>
                </Link>
                <div className="flex flex-wrap gap-2">
                  {axis.chips.map((chip) => (
                    <Link
                      key={chip.href}
                      href={chip.href}
                      className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:border-primary-400 hover:text-primary-700"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ガイド・調査 */}
        <div className="mt-16 flex flex-wrap gap-x-10 gap-y-3 border-t border-gray-200 pt-8 text-sm font-bold">
          <Link href="/guide" className="text-primary-700 hover:underline">
            ワーホリ完全ガイド →
          </Link>
          <Link href="/research" className="text-primary-700 hover:underline">
            調査データ・統計 →
          </Link>
        </div>
      </div>
    </section>
  );
}
