'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type SortOption = {
  value: string;
  label: string;
};

type Props = {
  options: SortOption[];
  basePath: string;
};

export default function SortSelect({ options, basePath }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || '';

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    params.delete('page');
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-gray-500 whitespace-nowrap">
        並び替え
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
