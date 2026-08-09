'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { REGIONS, COST_LEVELS } from '@/lib/utils/constants';
import {
  HOURLY_WAGE_MINIMUMS,
  MONTHLY_WAGE_MINIMUMS,
  clearWageFilterParams,
  parseWageFilter,
  type WageUnit,
} from '@/lib/countries/wage-filter';
import BottomSheet from '@/components/ui/BottomSheet';

type WageFilterControlsProps = {
  idPrefix: string;
  selectedUnit: WageUnit;
  activeMinimum?: number;
  onUnitChange: (unit: WageUnit) => void;
  onMinimumChange: (minimum: string) => void;
};

function formatWageMinimum(unit: WageUnit, minimum: number) {
  if (unit === 'hourly') {
    return `${minimum.toLocaleString('ja-JP')}円以上`;
  }

  return `${(minimum / 10_000).toLocaleString('ja-JP')}万円以上`;
}

function WageFilterControls({
  idPrefix,
  selectedUnit,
  activeMinimum,
  onUnitChange,
  onMinimumChange,
}: WageFilterControlsProps) {
  const minimums: readonly number[] =
    selectedUnit === 'hourly' ? HOURLY_WAGE_MINIMUMS : MONTHLY_WAGE_MINIMUMS;
  const minimumSelectId = `${idPrefix}-wage-minimum`;

  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        稼げる金額（最低賃金ベース）
      </legend>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="inline-flex w-fit rounded-lg border border-gray-300 bg-white p-1" aria-label="給与の単位">
          {(['hourly', 'monthly'] as const).map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => onUnitChange(unit)}
              aria-pressed={selectedUnit === unit}
              className={`min-h-[36px] rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedUnit === unit
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {unit === 'hourly' ? '時給' : '月給'}
            </button>
          ))}
        </div>
        <div className="min-w-0 sm:w-56">
          <label htmlFor={minimumSelectId} className="mb-1 block text-xs font-medium text-gray-600">
            {selectedUnit === 'hourly' ? '最低時給' : '最低月給'}
          </label>
          <select
            id={minimumSelectId}
            value={activeMinimum === undefined ? '' : String(activeMinimum)}
            onChange={(event) => onMinimumChange(event.target.value)}
            className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">指定なし</option>
            {minimums.map((minimum) => (
              <option key={minimum} value={minimum}>
                {formatWageMinimum(selectedUnit, minimum)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-gray-500">
        税引前の法定最低賃金を日本円に換算した目安です。月給は公表月額、または時給×40時間×52週÷12か月で換算しています。法定最低賃金がない国は対象外です。
      </p>
    </fieldset>
  );
}

export default function CountryFilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wageFilter = parseWageFilter(searchParams);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [selectedWageUnit, setSelectedWageUnit] = useState<WageUnit>(
    wageFilter?.unit ?? 'hourly'
  );

  const currentRegion = searchParams.get('region') || '';
  const currentCost = searchParams.get('cost') || '';
  const currentQ = searchParams.get('q') || '';
  const activeWageMinimum =
    wageFilter?.unit === selectedWageUnit ? wageFilter.min : undefined;

  // 不正値や片側だけの賃金パラメータはサーバーと同様に「未適用」として扱う。
  // SEOのnoindex判定は別途、値のある全クエリを対象にする。
  const hasFilters = Boolean(currentRegion || currentCost || currentQ || wageFilter);

  useEffect(() => {
    if (wageFilter?.unit) {
      setSelectedWageUnit(wageFilter.unit);
    }
  }, [wageFilter?.unit]);

  const navigateWithParams = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      router.push(query ? `/countries?${query}` : '/countries');
    },
    [router]
  );

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      navigateWithParams(params);
    },
    [navigateWithParams, searchParams]
  );

  const submitKeyword = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (keyword.trim()) {
      params.set('q', keyword.trim());
    } else {
      params.delete('q');
    }
    navigateWithParams(params);
  }, [navigateWithParams, searchParams, keyword]);

  const changeWageUnit = useCallback(
    (unit: WageUnit) => {
      if (unit === selectedWageUnit) return;

      setSelectedWageUnit(unit);
      const params = clearWageFilterParams(searchParams);
      navigateWithParams(params);
    },
    [navigateWithParams, searchParams, selectedWageUnit]
  );

  const changeWageMinimum = useCallback(
    (minimum: string) => {
      const params = clearWageFilterParams(searchParams);

      if (minimum) {
        const numericMinimum = Number(minimum);
        const allowedMinimums: readonly number[] =
          selectedWageUnit === 'hourly' ? HOURLY_WAGE_MINIMUMS : MONTHLY_WAGE_MINIMUMS;

        if (allowedMinimums.includes(numericMinimum)) {
          params.set('wageUnit', selectedWageUnit);
          params.set('wageMin', String(numericMinimum));
        }
      }

      navigateWithParams(params);
    },
    [navigateWithParams, searchParams, selectedWageUnit]
  );

  const filterContent = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">フリーワード</label>
        <form
          onSubmit={(e) => { e.preventDefault(); submitKeyword(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="国名・都市名など"
            className="flex-1 rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors min-h-[44px]"
          >
            検索
          </button>
        </form>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">地域</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('region', '')}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              !currentRegion ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            すべて
          </button>
          {REGIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => updateFilter('region', r.value)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                currentRegion === r.value ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">費用レベル</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('cost', '')}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              !currentCost ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            すべて
          </button>
          {COST_LEVELS.map((c) => (
            <button
              key={c.value}
              onClick={() => updateFilter('cost', c.value)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                currentCost === c.value ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <WageFilterControls
        idPrefix="mobile"
        selectedUnit={selectedWageUnit}
        activeMinimum={activeWageMinimum}
        onUnitChange={changeWageUnit}
        onMinimumChange={changeWageMinimum}
      />
      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setKeyword('');
            setSelectedWageUnit('hourly');
            router.push('/countries');
            setIsSheetOpen(false);
          }}
          className="text-sm text-primary-600 hover:underline"
        >
          フィルターをリセット
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: Inline filters */}
      <div className="hidden sm:block bg-gray-50 rounded-xl p-6">
        <h2 className="font-bold mb-4">絞り込み検索</h2>
        <form
          onSubmit={(e) => { e.preventDefault(); submitKeyword(); }}
          className="flex gap-2 mb-4"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="国名・都市名などで検索"
            className="flex-1 rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            検索
          </button>
        </form>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">地域</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('region', '')}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  !currentRegion ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                すべて
              </button>
              {REGIONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => updateFilter('region', r.value)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    currentRegion === r.value ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">費用レベル</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('cost', '')}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  !currentCost ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                すべて
              </button>
              {COST_LEVELS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => updateFilter('cost', c.value)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    currentCost === c.value ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-400'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <WageFilterControls
            idPrefix="desktop"
            selectedUnit={selectedWageUnit}
            activeMinimum={activeWageMinimum}
            onUnitChange={changeWageUnit}
            onMinimumChange={changeWageMinimum}
          />
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              setSelectedWageUnit('hourly');
              router.push('/countries');
            }}
            className="mt-4 text-sm text-primary-600 hover:underline"
          >
            フィルターをリセット
          </button>
        )}
      </div>

      {/* Mobile: Bottom sheet trigger */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium min-h-[44px] ${
            hasFilters
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-300 text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          絞り込み{hasFilters ? '（適用中）' : ''}
        </button>

        <BottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title="絞り込み検索"
        >
          {filterContent}
        </BottomSheet>
      </div>
    </>
  );
}
