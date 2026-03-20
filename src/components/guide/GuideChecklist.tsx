'use client';

import { useState, useEffect } from 'react';
import type { ChecklistItem } from '@/lib/microcms/types';

type Props = {
  checklist: ChecklistItem[];
  guideId: string;
};

export default function GuideChecklist({ checklist, guideId }: Props) {
  const storageKey = `guide-checklist-${guideId}`;
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setChecked(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, [storageKey]);

  const toggle = (index: number) => {
    const next = { ...checked, [index]: !checked[index] };
    setChecked(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  if (checklist.length === 0) return null;

  const completedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 my-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          チェックリスト
        </h3>
        <span className="text-xs text-gray-500">
          {completedCount}/{checklist.length} 完了
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-4">
        <div
          className="h-1.5 bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${(completedCount / checklist.length) * 100}%` }}
        />
      </div>

      <ul className="space-y-2">
        {checklist.map((item, i) => (
          <li key={i}>
            <label className="flex items-start gap-3 cursor-pointer group min-h-[44px] py-1">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 shrink-0"
              />
              <div>
                <span className={`text-sm transition-colors ${checked[i] ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {item.text}
                </span>
                {item.note && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                )}
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
