'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Country } from '@/lib/microcms/types';
import { COST_RANGES, SCHOOL_LANGUAGES } from '@/lib/utils/constants';
import BottomSheet from '@/components/ui/BottomSheet';

type Props = {
  countries: Country[];
};

export default function SchoolFilterPanel({ countries }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');

  const currentCountry = searchParams.get('country') || '';
  const currentLanguage = searchParams.get('language') || '';
  const currentCost = searchParams.get('cost') || '';
  const currentQ = searchParams.get('q') || '';

  const hasFilters = currentCountry || currentLanguage || currentCost || currentQ;

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/schools?${params.toString()}`);
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
    params.delete('page');
    router.push(`/schools?${params.toString()}`);
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
            placeholder="学校名・都市名など"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">国</label>
        <select
          value={currentCountry}
          onChange={(e) => updateFilter('country', e.target.value)}
          className="w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
        >
          <option value="">すべての国</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.flagEmoji} {c.nameJp}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">語学</label>
        <select
          value={currentLanguage}
          onChange={(e) => updateFilter('language', e.target.value)}
          className="w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
        >
          <option value="">すべての言語</option>
          {SCHOOL_LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">費用帯</label>
        <select
          value={currentCost}
          onChange={(e) => updateFilter('cost', e.target.value)}
          className="w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
        >
          <option value="">すべて</option>
          {COST_RANGES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      {hasFilters && (
        <button
          onClick={() => {
            setKeyword('');
            router.push('/schools');
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
            placeholder="学校名・都市名などで検索"
            className="flex-1 rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            検索
          </button>
        </form>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">国</label>
            <select
              value={currentCountry}
              onChange={(e) => updateFilter('country', e.target.value)}
              className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">すべての国</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flagEmoji} {c.nameJp}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">語学</label>
            <select
              value={currentLanguage}
              onChange={(e) => updateFilter('language', e.target.value)}
              className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">すべての言語</option>
              {SCHOOL_LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">費用帯</label>
            <select
              value={currentCost}
              onChange={(e) => updateFilter('cost', e.target.value)}
              className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">すべて</option>
              {COST_RANGES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {hasFilters && (
          <button
            onClick={() => { setKeyword(''); router.push('/schools'); }}
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
