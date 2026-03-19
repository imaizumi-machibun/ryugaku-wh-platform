import type { Country } from '@/lib/microcms/types';
import { formatJPY, formatDuration } from '@/lib/utils/format';

type Props = { country: Country };

export default function QuickFacts({ country }: Props) {
  const facts = [
    { label: '首都', value: country.capital },
    { label: '公用語', value: country.officialLanguage },
    { label: '通貨', value: country.currency },
    { label: '日本との時差', value: country.timeDifferenceJapan },
    { label: 'フライト時間', value: country.flightTimeHours ? `約${country.flightTimeHours}時間` : undefined },
    { label: 'ベストシーズン', value: country.bestSeason },
    { label: 'ビザ費用', value: country.visaCostJpy ? formatJPY(country.visaCostJpy) : undefined },
    { label: '滞在期間', value: country.visaDurationMonths ? formatDuration(country.visaDurationMonths) : undefined },
    { label: '年齢制限', value: country.visaAgeMin && country.visaAgeMax ? `${country.visaAgeMin}〜${country.visaAgeMax}歳` : undefined },
    { label: '月間生活費', value: country.livingCostMonthJpy ? formatJPY(country.livingCostMonthJpy) : undefined },
    { label: '月間家賃', value: country.avgRentMonthlyJpy ? formatJPY(country.avgRentMonthlyJpy) : undefined },
    { label: '最低賃金', value: country.minimumWageLocal },
  ].filter((f) => f.value);

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">基本情報</h2>
      <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-xs text-gray-500 mb-1">{fact.label}</dt>
            <dd className="font-medium text-sm">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
