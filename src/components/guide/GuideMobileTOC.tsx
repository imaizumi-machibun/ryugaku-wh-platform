'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomSheet from '@/components/ui/BottomSheet';
import type { Guide, GuidePhase } from '@/lib/microcms/types';

type Props = {
  currentGuideId: string;
  phase: GuidePhase;
  guides: Guide[];
  phaseLabel: string;
};

export default function GuideMobileTOC({ currentGuideId, phase, guides, phaseLabel }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    const elements = document.querySelectorAll('.prose-guide h2[id], .prose-guide h3[id]');
    const items = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: el.tagName === 'H2' ? 2 : 3,
    }));
    setHeadings(items);
  }, []);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
        aria-label="目次を開く"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="目次">
        {/* Page headings */}
        {headings.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">このページの内容</p>
            <nav className="space-y-1">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 text-sm rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] flex items-center ${
                    h.level === 3 ? 'pl-6 text-gray-500' : 'text-gray-700 font-medium'
                  }`}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Articles in phase */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{phaseLabel}</p>
          <nav className="space-y-1">
            {guides.map((g) => (
              <Link
                key={g.id}
                href={`/guide/${phase}/${g.id}`}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-3 text-sm rounded-lg min-h-[44px] flex items-center transition-colors ${
                  g.id === currentGuideId
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs text-gray-400 mr-2">{g.orderInPhase}.</span>
                {g.title}
              </Link>
            ))}
          </nav>
        </div>
      </BottomSheet>
    </>
  );
}
