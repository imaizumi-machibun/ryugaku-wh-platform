import Link from 'next/link';
import type { Guide, GuidePhase } from '@/lib/microcms/types';

type Props = {
  phase: GuidePhase;
  label: string;
  emoji: string;
  color: string;
  description: string;
  guides: Guide[];
  phaseIndex: number;
};

export default function GuidePhaseCard({ phase, label, emoji, color, description, guides, phaseIndex }: Props) {
  return (
    <div className="relative">
      {/* Timeline connector */}
      {phaseIndex > 0 && (
        <div className="absolute -top-8 left-6 sm:left-8 w-0.5 h-8 bg-gray-200" />
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
        {/* Phase header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${color.split(' ').filter(c => c.startsWith('bg-')).join(' ')}`}>
            {emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">PHASE {phaseIndex + 1}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">{label}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>

        {/* Article list */}
        {guides.length > 0 ? (
          <div className="space-y-1 mb-4">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guide/${phase}/${guide.id}`}
                className="flex items-center gap-2 py-2 px-3 -mx-1 rounded-lg text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 transition-colors min-h-[44px]"
              >
                <span className="text-xs text-gray-400 w-5 text-right shrink-0">{guide.orderInPhase}.</span>
                <span>{guide.title}</span>
                {guide.estimatedMinutes && (
                  <span className="ml-auto text-xs text-gray-400 shrink-0">{guide.estimatedMinutes}分</span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-4">記事は準備中です</p>
        )}

        {/* CTA */}
        {guides.length > 0 && (
          <Link
            href={`/guide/${phase}/${guides[0].id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            読み始める
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
