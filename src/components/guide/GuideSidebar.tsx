'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Guide, GuidePhase } from '@/lib/microcms/types';

type Props = {
  currentGuideId: string;
  phase: GuidePhase;
  guides: Guide[];
  phaseLabel: string;
  phaseEmoji: string;
};

export default function GuideSidebar({ currentGuideId, phase, guides, phaseLabel, phaseEmoji }: Props) {
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  useEffect(() => {
    const headings = document.querySelectorAll('.prose-guide h2[id], .prose-guide h3[id]');
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
        {/* Phase header */}
        <div className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
          <span>{phaseEmoji}</span>
          <span>{phaseLabel}</span>
        </div>

        {/* Article list in this phase */}
        <nav className="space-y-0.5">
          {guides.map((g) => (
            <Link
              key={g.id}
              href={`/guide/${phase}/${g.id}`}
              className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                g.id === currentGuideId
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs text-gray-400 mr-1.5">{g.orderInPhase}.</span>
              {g.title}
            </Link>
          ))}
        </nav>

        {/* Page headings (table of contents) */}
        {activeHeadingId !== undefined && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">目次</p>
            <TableOfContents activeId={activeHeadingId} />
          </div>
        )}
      </div>
    </aside>
  );
}

function TableOfContents({ activeId }: { activeId: string }) {
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

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-0.5">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`block text-xs py-1 transition-colors ${
            h.level === 3 ? 'pl-4' : 'pl-2'
          } ${
            activeId === h.id
              ? 'text-primary-600 font-semibold border-l-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700 border-l-2 border-transparent'
          }`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
