'use client';

import { useMemo, useState } from 'react';
import type { Country, CourseType } from '@/lib/microcms/types';
import { quickEstimate, formatJpyShort } from '@/lib/segments/cost-estimator';

type Props = {
  countries: Country[];
  defaultCountrySlug?: string;
  defaultMonths?: number;
  defaultCourseType?: CourseType;
  className?: string;
};

const COURSE_OPTIONS: { value: CourseType; label: string }[] = [
  { value: 'general', label: '一般英語' },
  { value: 'conversation', label: '会話中心' },
  { value: 'business', label: 'ビジネス英語' },
  { value: 'exam-prep', label: '試験対策（IELTS/TOEFL）' },
  { value: 'intensive', label: '集中コース' },
];

const MONTH_OPTIONS = [1, 2, 3, 4, 6, 9, 12, 18, 24, 36, 48];

export default function CostEstimator({
  countries,
  defaultCountrySlug,
  defaultMonths = 12,
  defaultCourseType = 'general',
  className = '',
}: Props) {
  const validCountries = useMemo(
    () => countries.filter((c) => c.programStatus !== 'closed'),
    [countries]
  );

  const [countryId, setCountryId] = useState(
    defaultCountrySlug && validCountries.some((c) => c.id === defaultCountrySlug)
      ? defaultCountrySlug
      : validCountries[0]?.id ?? ''
  );
  const [months, setMonths] = useState<number>(defaultMonths);
  const [courseType, setCourseType] = useState<CourseType>(defaultCourseType);
  const [hasWorkIncome, setHasWorkIncome] = useState(false);

  const selectedCountry = validCountries.find((c) => c.id === countryId);

  const result = useMemo(() => {
    if (!selectedCountry) return null;
    return quickEstimate({
      country: selectedCountry,
      months,
      courseType,
      hasWorkIncome,
    });
  }, [selectedCountry, months, courseType, hasWorkIncome]);

  return (
    <section className={`bg-white border border-gray-200 rounded-xl p-5 ${className}`}>
      <h3 className="font-bold text-base text-gray-900 mb-1">費用かんたん試算</h3>
      <p className="text-xs text-gray-600 mb-4">
        国・期間・コースを選ぶと、概算総額が即時に計算されます（為替により±5%変動）。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <label className="block">
          <span className="text-xs font-semibold text-gray-700 mb-1 block">国</span>
          <select
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
          >
            {validCountries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flagEmoji} {c.nameJp}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-gray-700 mb-1 block">期間</span>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m < 12 ? `${m}ヶ月` : `${m / 12}年`}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-gray-700 mb-1 block">コース</span>
          <select
            value={courseType}
            onChange={(e) => setCourseType(e.target.value as CourseType)}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
          >
            {COURSE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hasWorkIncome}
            onChange={(e) => setHasWorkIncome(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-xs">就労収入（ワーホリ等）を見込む</span>
        </label>
      </div>

      {result && (
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <span className="text-sm font-semibold text-primary-900">概算総額</span>
            <span className="text-2xl font-bold text-primary-900 tabular-nums">
              {formatJpyShort(result.total)}
            </span>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1.5 text-xs">
            {result.breakdown.map((row) => (
              <li key={row.label} className="flex justify-between">
                <span className="text-gray-700">{row.label}</span>
                <span
                  className={`tabular-nums font-semibold ${
                    row.valueJpy < 0 ? 'text-emerald-700' : 'text-gray-900'
                  }`}
                >
                  {row.valueJpy < 0 ? '−' : ''}
                  {formatJpyShort(Math.abs(row.valueJpy))}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-gray-500 mt-3">
            ※概算値です。実際の費用は学校・都市・時期により大きく変動します。具体的なシミュレーションは無料相談をご利用ください。
          </p>
        </div>
      )}
    </section>
  );
}
