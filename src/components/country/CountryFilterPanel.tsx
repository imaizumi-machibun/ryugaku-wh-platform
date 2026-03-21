'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { REGIONS, COST_LEVELS } from '@/lib/utils/constants';
import BottomSheet from '@/components/ui/BottomSheet';

export default function CountryFilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');

  const currentRegion = searchParams.get('region') || '';
  const currentCost = searchParams.get('cost') || '';
  const currentQ = searchParams.get('q') || '';

  const hasFilters = currentRegion || currentCost || currentQ;

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/countries?${params.toString()}`);
    },
    [router, searchParams]
  );

  const submitKeyword = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (keyword.trim()) {
      params.set('q', keyword.trim());
    } else {
      params.delete('q');
    }
    router.push(`/countries?${params.toString()}`);
  }, [router, searchParams, keyword]);

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
      {hasFilters && (
        <button
          onClick={() => {
            setKeyword('');
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
        </div>
        {hasFilters && (
          <button
            onClick={() => { setKeyword(''); router.push('/countries'); }}
            className="mt-4 text-sm text-primary-600 hover:underline"
          >
            フィルターをリセット
          </button>
        )}
      </div>

      {/* Mobile: Bottom sheet trigger */}
      <div className="sm:hidden">
        <button
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
