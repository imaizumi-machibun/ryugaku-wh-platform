import Link from 'next/link';
import type { Experience } from '@/lib/microcms/types';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import { formatDuration } from '@/lib/utils/format';
import { formatJpyShort } from '@/lib/segments/cost-estimator';

type Props = {
  experience: Experience;
  estimatedTotalJpy?: number;
};

export default function ExperienceWithCost({ experience, estimatedTotalJpy }: Props) {
  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="block border border-gray-200 rounded-xl p-5 hover:border-primary-400 hover:bg-primary-50/30 transition-colors h-full"
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {experience.country?.flagEmoji && <span>{experience.country.flagEmoji}</span>}
        <Badge variant="primary">{experience.country?.nameJp}</Badge>
        <span className="text-xs text-gray-500">{experience.cityPrimary}</span>
      </div>
      <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2">{experience.title}</h3>
      <StarRating rating={experience.ratingOverall} size="sm" />
      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-700">
        {experience.durationMonths && (
          <span>
            <span className="text-gray-500">期間</span>{' '}
            <span className="font-semibold">{formatDuration(experience.durationMonths)}</span>
          </span>
        )}
        {estimatedTotalJpy != null && (
          <span>
            <span className="text-gray-500">推計総額</span>{' '}
            <span className="font-semibold text-primary-700 tabular-nums">
              {formatJpyShort(estimatedTotalJpy)}
            </span>
          </span>
        )}
        {experience.monthlyIncomeJpy != null && experience.monthlyIncomeJpy > 0 && (
          <span>
            <span className="text-gray-500">月収</span>{' '}
            <span className="font-semibold text-gray-800 tabular-nums">
              {formatJpyShort(experience.monthlyIncomeJpy)}
            </span>
          </span>
        )}
      </div>
    </Link>
  );
}
