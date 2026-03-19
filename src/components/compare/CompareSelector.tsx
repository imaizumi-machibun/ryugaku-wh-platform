'use client';

import { useState } from 'react';
import type { Country } from '@/lib/microcms/types';
import { formatJPY, formatDuration } from '@/lib/utils/format';
import { PROGRAM_STATUSES, COST_LEVELS } from '@/lib/utils/constants';

type CountryBasic = Pick<
  Country,
  | 'id'
  | 'nameJp'
  | 'nameEn'
  | 'flagEmoji'
  | 'region'
  | 'programStatus'
  | 'costLevel'
  | 'capital'
  | 'officialLanguage'
  | 'currency'
  | 'timeDifferenceJapan'
  | 'flightTimeHours'
  | 'visaAgeMin'
  | 'visaAgeMax'
  | 'visaDurationMonths'
  | 'visaCostJpy'
  | 'livingCostMonthJpy'
  | 'avgRentMonthlyJpy'
  | 'minimumWageLocal'
>;

type Props = {
  countries: CountryBasic[];
};

const compareFields: { label: string; render: (c: CountryBasic) => string }[] = [
  { label: '地域', render: (c) => c.region },
  {
    label: 'プログラム状況',
    render: (c) => PROGRAM_STATUSES.find((s) => s.value === c.programStatus)?.label || '—',
  },
  {
    label: '費用レベル',
    render: (c) => COST_LEVELS.find((l) => l.value === c.costLevel)?.label || '—',
  },
  { label: '首都', render: (c) => c.capital || '—' },
  { label: '公用語', render: (c) => c.officialLanguage || '—' },
  { label: '通貨', render: (c) => c.currency || '—' },
  { label: '時差', render: (c) => c.timeDifferenceJapan || '—' },
  {
    label: 'フライト時間',
    render: (c) => (c.flightTimeHours ? `約${c.flightTimeHours}時間` : '—'),
  },
  {
    label: 'ビザ年齢',
    render: (c) =>
      c.visaAgeMin != null && c.visaAgeMax != null
        ? `${c.visaAgeMin}〜${c.visaAgeMax}歳`
        : '—',
  },
  {
    label: '滞在期間',
    render: (c) => (c.visaDurationMonths ? formatDuration(c.visaDurationMonths) : '—'),
  },
  { label: 'ビザ費用', render: (c) => (c.visaCostJpy ? formatJPY(c.visaCostJpy) : '—') },
  {
    label: '月間生活費',
    render: (c) => (c.livingCostMonthJpy ? formatJPY(c.livingCostMonthJpy) : '—'),
  },
  {
    label: '月間家賃',
    render: (c) => (c.avgRentMonthlyJpy ? formatJPY(c.avgRentMonthlyJpy) : '—'),
  },
  { label: '最低賃金', render: (c) => c.minimumWageLocal || '—' },
];

export default function CompareSelector({ countries }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const selectedCountries = countries.filter((c) => selected.includes(c.id));

  return (
    <>
      {/* Country Selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          比較する国を選択（最大3カ国）
        </label>
        <div className="flex flex-wrap gap-2">
          {countries.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                if (selected.includes(c.id)) {
                  setSelected(selected.filter((id) => id !== c.id));
                } else if (selected.length < 3) {
                  setSelected([...selected, c.id]);
                }
              }}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                selected.includes(c.id)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-300 hover:border-primary-400'
              } ${
                !selected.includes(c.id) && selected.length >= 3
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={!selected.includes(c.id) && selected.length >= 3}
            >
              {c.flagEmoji} {c.nameJp}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedCountries.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-50 border-b font-medium text-sm text-gray-500 w-32">
                  項目
                </th>
                {selectedCountries.map((c) => (
                  <th key={c.id} className="text-center p-3 bg-gray-50 border-b font-bold">
                    <span className="text-2xl block mb-1">{c.flagEmoji}</span>
                    {c.nameJp}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareFields.map((field) => (
                <tr key={field.label} className="border-b border-gray-100">
                  <td className="p-3 text-sm text-gray-500 font-medium">{field.label}</td>
                  {selectedCountries.map((c) => (
                    <td key={c.id} className="p-3 text-center text-sm">
                      {field.render(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCountries.length < 2 && (
        <div className="text-center py-12 text-gray-500">
          <p>2カ国以上選択すると比較表が表示されます</p>
        </div>
      )}
    </>
  );
}
