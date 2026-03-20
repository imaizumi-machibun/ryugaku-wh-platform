import Link from 'next/link';
import type { Guide, GuidePhase } from '@/lib/microcms/types';
import { GUIDE_PHASES } from '@/lib/utils/constants';

type Props = {
  currentGuide: Guide;
  allGuides: Guide[];
};

export default function GuideNavigation({ currentGuide, allGuides }: Props) {
  const sorted = [...allGuides].sort((a, b) => {
    const phaseOrder = (p: GuidePhase) => GUIDE_PHASES.findIndex((ph) => ph.value === p);
    const pa = phaseOrder(a.phase);
    const pb = phaseOrder(b.phase);
    if (pa !== pb) return pa - pb;
    return a.orderInPhase - b.orderInPhase;
  });

  const currentIndex = sorted.findIndex((g) => g.id === currentGuide.id);
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  const getPhaseInfo = (phase: GuidePhase) =>
    GUIDE_PHASES.find((p) => p.value === phase);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-8 border-t border-gray-200">
      {prev ? (
        <Link
          href={`/guide/${prev.phase}/${prev.id}`}
          className="flex-1 group p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all min-h-[44px]"
        >
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            前の記事
            {prev.phase !== currentGuide.phase && (
              <span className="ml-1 text-gray-300">({getPhaseInfo(prev.phase)?.label})</span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
            {prev.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={`/guide/${next.phase}/${next.id}`}
          className="flex-1 group p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-right min-h-[44px]"
        >
          <div className="text-xs text-gray-400 mb-1 flex items-center justify-end gap-1">
            次の記事
            {next.phase !== currentGuide.phase && (
              <span className="mr-1 text-gray-300">({getPhaseInfo(next.phase)?.label})</span>
            )}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
            {next.title}
          </p>
        </Link>
      ) : (
        <Link
          href="/guide"
          className="flex-1 group p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-right min-h-[44px]"
        >
          <div className="text-xs text-gray-400 mb-1 flex items-center justify-end gap-1">
            ガイドトップへ
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
            ワーホリ完全ガイド トップ
          </p>
        </Link>
      )}
    </div>
  );
}
