import type { Scenario } from '@/lib/segments/types';
import { formatJpyShort } from '@/lib/segments/cost-estimator';

type Props = {
  scenario: Scenario;
  className?: string;
};

export default function BudgetBreakdownTable({ scenario, className = '' }: Props) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-700">
            <th className="border border-gray-200 px-3 py-2 font-semibold">項目</th>
            <th className="border border-gray-200 px-3 py-2 font-semibold text-right">下限</th>
            <th className="border border-gray-200 px-3 py-2 font-semibold text-right">上限</th>
            <th className="border border-gray-200 px-3 py-2 font-semibold">備考</th>
          </tr>
        </thead>
        <tbody>
          {scenario.breakdown.map((row) => (
            <tr key={row.item}>
              <td className="border border-gray-200 px-3 py-2 font-medium text-gray-900">
                {row.item}
              </td>
              <td className="border border-gray-200 px-3 py-2 text-right tabular-nums text-gray-800">
                {formatJpyShort(row.lowJpy)}
              </td>
              <td className="border border-gray-200 px-3 py-2 text-right tabular-nums text-gray-800">
                {formatJpyShort(row.highJpy)}
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs text-gray-600">
                {row.note ?? '—'}
              </td>
            </tr>
          ))}
          <tr className="bg-primary-50 font-bold">
            <td className="border border-primary-100 px-3 py-2 text-primary-900">合計</td>
            <td className="border border-primary-100 px-3 py-2 text-right tabular-nums text-primary-900">
              {formatJpyShort(scenario.totalJpy.min)}
            </td>
            <td className="border border-primary-100 px-3 py-2 text-right tabular-nums text-primary-900">
              {formatJpyShort(scenario.totalJpy.max)}
            </td>
            <td className="border border-primary-100 px-3 py-2 text-xs text-primary-800">
              {scenario.requirementNote ?? ''}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
