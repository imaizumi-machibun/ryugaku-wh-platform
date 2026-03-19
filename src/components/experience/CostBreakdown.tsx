import type { Experience } from '@/lib/microcms/types';
import { formatJPY } from '@/lib/utils/format';

type Props = {
  experience: Experience;
};

export default function CostBreakdown({ experience }: Props) {
  const items = [
    { label: '月間生活費', value: experience.monthlyLivingJpy, color: 'bg-blue-500' },
    { label: '月間家賃', value: experience.monthlyRentJpy, color: 'bg-green-500' },
    { label: '月間食費', value: experience.monthlyFoodJpy, color: 'bg-yellow-500' },
    { label: '月間収入', value: experience.monthlyIncomeJpy, color: 'bg-purple-500' },
  ].filter((item) => item.value != null);

  if (items.length === 0) return null;

  const maxValue = Math.max(...items.map((i) => i.value!));

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-bold mb-4">費用内訳（月額）</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">{formatJPY(item.value!)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${item.color} h-2.5 rounded-full`}
                style={{ width: `${(item.value! / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
