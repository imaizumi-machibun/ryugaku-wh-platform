import type { GuidePhase } from '@/lib/microcms/types';
import { GUIDE_PHASES } from '@/lib/utils/constants';

type Props = {
  currentPhase: GuidePhase;
};

export default function GuideProgressBar({ currentPhase }: Props) {
  const currentIndex = GUIDE_PHASES.findIndex((p) => p.value === currentPhase);

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
      {GUIDE_PHASES.map((phase, i) => {
        const isActive = i === currentIndex;
        const isPast = i < currentIndex;
        return (
          <div key={phase.value} className="flex items-center shrink-0">
            {i > 0 && (
              <div className={`w-4 sm:w-6 h-0.5 ${isPast ? 'bg-primary-400' : 'bg-gray-200'}`} />
            )}
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white ring-2 ring-primary-200'
                  : isPast
                    ? 'bg-primary-400 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
              title={phase.label}
            >
              {i + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}
