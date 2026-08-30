import Link from 'next/link';

export type RankRow = {
  rank: number;
  label: string;
  flag?: string;
  /** 表示する数値（「18.5万円」「★4.2」など整形済み） */
  value: string;
  /** サンプル件数（n） */
  count: number;
  /** 国詳細などへの内部リンク（任意） */
  href?: string;
};

type Props = {
  rows: RankRow[];
  /** 数値列の見出し（「月間生活費の中央値」など） */
  valueHeader: string;
  /** 1列目の見出し（既定: 国） */
  labelHeader?: string;
};

/**
 * 調査レポートのランキング表。
 * 件数列(n)を必ず出し、サンプル数の透明性を担保する。
 */
export default function RankingTable({ rows, valueHeader, labelHeader = '国' }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold whitespace-nowrap">順位</th>
            <th className="px-4 py-3 font-semibold">{labelHeader}</th>
            <th className="px-4 py-3 font-semibold whitespace-nowrap">{valueHeader}</th>
            <th className="px-4 py-3 font-semibold whitespace-nowrap">件数</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.rank}-${row.label}`} className="border-t border-gray-100">
              <td className="px-4 py-3 font-bold text-primary-700">{row.rank}</td>
              <td className="px-4 py-3 font-medium">
                {row.flag && (
                  <span className="mr-1" aria-hidden="true">
                    {row.flag}
                  </span>
                )}
                {row.href ? (
                  <Link href={row.href} className="text-primary-700 hover:underline">
                    {row.label}
                  </Link>
                ) : (
                  row.label
                )}
              </td>
              <td className="px-4 py-3 font-semibold whitespace-nowrap">{row.value}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">n={row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
