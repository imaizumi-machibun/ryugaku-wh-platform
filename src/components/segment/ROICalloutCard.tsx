import type { Scenario } from '@/lib/segments/types';
import { formatJpyShort } from '@/lib/segments/cost-estimator';

type Props = {
  scenarios: Scenario[];
  className?: string;
};

export default function ROICalloutCard({ scenarios, className = '' }: Props) {
  const withRoi = scenarios.filter((s) => s.roi);
  if (withRoi.length === 0) return null;

  return (
    <section className={`bg-emerald-50 border border-emerald-100 rounded-xl p-5 ${className}`}>
      <h3 className="font-bold text-base text-emerald-900 mb-3">投資回収（ROI）の目安</h3>
      <p className="text-xs text-emerald-800 mb-4 leading-relaxed">
        卒業後の想定年収と回収年数を、シナリオごとに整理しました。実際の進路・職種により大きく異なるため、参考値としてご覧ください。
      </p>
      <ul className="space-y-3">
        {withRoi.map((s) => (
          <li key={s.key} className="bg-white rounded-xl p-3 border border-emerald-50">
            <p className="font-semibold text-sm text-gray-900 mb-1">{s.label}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700">
              <span>
                <span className="text-gray-500">回収年数</span>{' '}
                <span className="font-bold text-emerald-700">
                  {s.roi!.yearsToRecover.min}〜{s.roi!.yearsToRecover.max}年
                </span>
              </span>
              {s.roi!.expectedIncomeJpy && (
                <span>
                  <span className="text-gray-500">想定年収</span>{' '}
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {formatJpyShort(s.roi!.expectedIncomeJpy.min)}〜
                    {formatJpyShort(s.roi!.expectedIncomeJpy.max)}
                  </span>
                </span>
              )}
            </div>
            {s.roi!.note && <p className="text-xs text-gray-600 mt-2">{s.roi!.note}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
