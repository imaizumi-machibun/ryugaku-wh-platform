import { COST_ASSUMPTIONS } from '@/lib/segments/cost-estimator';

type Props = {
  className?: string;
};

export default function ExchangeRateNotice({ className = '' }: Props) {
  return (
    <aside
      className={`text-xs text-gray-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2 ${className}`}
    >
      <span className="font-semibold text-amber-800">為替注記</span>
      <span className="ml-2">
        {COST_ASSUMPTIONS.exchangeRateNote}（最終更新 {COST_ASSUMPTIONS.exchangeRateUpdatedAt}）
      </span>
    </aside>
  );
}
