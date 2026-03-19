import Link from 'next/link';
import type { Experience } from '@/lib/microcms/types';
import Card from '@/components/ui/Card';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import { formatDuration, isNew } from '@/lib/utils/format';

type Props = { experience: Experience };

export default function ExperienceCard({ experience }: Props) {
  return (
    <Link href={`/experiences/${experience.id}`}>
      <Card hover className="h-full">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            {experience.country?.flagEmoji && (
              <span className="text-lg">{experience.country.flagEmoji}</span>
            )}
            <Badge variant="primary">{experience.country?.nameJp}</Badge>
            <span className="text-xs text-gray-500">{experience.cityPrimary}</span>
            {isNew(experience.publishedAt || experience.createdAt) && (
              <Badge variant="new">NEW</Badge>
            )}
          </div>
          <h3 className="font-bold text-base mb-2 line-clamp-2">{experience.title}</h3>
          <StarRating rating={experience.ratingOverall} size="sm" />
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
            {experience.durationMonths && (
              <span>{formatDuration(experience.durationMonths)}</span>
            )}
            {experience.ageAtDeparture && (
              <span>{experience.ageAtDeparture}歳で出発</span>
            )}
          </div>
          {experience.wouldRecommend && (
            <p className="mt-2 text-xs text-green-600 font-medium">おすすめ</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
