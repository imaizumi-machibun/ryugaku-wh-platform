import type { Scenario } from '@/lib/segments/types';
import { formatJpyShort } from '@/lib/segments/cost-estimator';
import BudgetBreakdownTable from './BudgetBreakdownTable';

type Props = {
  scenarios: Scenario[];
  className?: string;
};

export default function ScenarioTabs({ scenarios, className = '' }: Props) {
  if (scenarios.length === 0) return null;

  return (
    <div className={className}>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary-50 text-left text-primary-900">
              <th className="border border-primary-100 px-3 py-2 font-semibold">シナリオ</th>
              <th className="border border-primary-100 px-3 py-2 font-semibold">期間</th>
              <th className="border border-primary-100 px-3 py-2 font-semibold text-right">想定総額</th>
              <th className="border border-primary-100 px-3 py-2 font-semibold">適性</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => (
              <tr key={s.key} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-3 py-2">
                  <a
                    href={`#scenario-${s.key}`}
                    className="text-primary-700 hover:underline font-medium"
                  >
                    {s.label}
                  </a>
                </td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700 whitespace-nowrap">
                  {s.durationMonths.min === s.durationMonths.max
                    ? `${s.durationMonths.min}ヶ月`
                    : `${s.durationMonths.min}〜${s.durationMonths.max}ヶ月`}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-right tabular-nums text-gray-900 font-semibold">
                  {formatJpyShort(s.totalJpy.min)}〜{formatJpyShort(s.totalJpy.max)}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs text-gray-700">{s.audience}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-6">
        {scenarios.map((s) => (
          <section
            key={s.key}
            id={`scenario-${s.key}`}
            className="border border-gray-200 rounded-xl p-5"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">{s.label}</h3>
            <p className="text-xs text-gray-600 mb-4">
              <span className="font-semibold">対象：</span>
              {s.audience}
            </p>
            <BudgetBreakdownTable scenario={s} />
            {s.requirementNote && (
              <p className="text-xs text-gray-700 mt-3 bg-gray-50 px-3 py-2 rounded">
                <span className="font-semibold">入学要件：</span>
                {s.requirementNote}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
