import Link from 'next/link';
import Image from 'next/image';
import type { School } from '@/lib/microcms/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { COST_RANGES, SCHOOL_FEATURES } from '@/lib/utils/constants';
import { isNew } from '@/lib/utils/format';

type Props = {
  school: School;
  reviewCount?: number;
  averageRating?: number;
};

export default function SchoolCard({ school, reviewCount, averageRating }: Props) {
  const costLabel = COST_RANGES.find((c) => c.value === school.costRange)?.label;

  return (
    <Link href={`/schools/${school.id}`}>
      <Card hover className="h-full">
        {school.heroImage && (
          <div className="relative h-40 w-full">
            <Image
              src={school.heroImage.url}
              alt={school.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {isNew(school.createdAt) && (
              <div className="absolute top-2 left-2">
                <Badge variant="new">NEW</Badge>
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-base mb-1">{school.name}</h3>
          <p className="text-sm text-gray-500 mb-2">
            {school.country?.flagEmoji} {school.country?.nameJp} / {school.city}
          </p>
          {averageRating != null && averageRating > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <StarRating rating={averageRating} size="sm" />
              {reviewCount != null && (
                <span className="text-xs text-gray-400">({reviewCount}件)</span>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {costLabel && <Badge variant="info">{costLabel}</Badge>}
            {school.courseTypes?.slice(0, 2).map((ct) => (
              <Badge key={ct}>{ct}</Badge>
            ))}
          </div>
          {school.features && school.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {school.features.slice(0, 3).map((f) => {
                const label = SCHOOL_FEATURES.find((sf) => sf.value === f)?.label;
                return label ? (
                  <span key={f} className="text-xs text-gray-500">
                    {label}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
