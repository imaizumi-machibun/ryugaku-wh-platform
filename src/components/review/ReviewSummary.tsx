import type { Review } from '@/lib/microcms/types';
import StarRating from '@/components/ui/StarRating';
import { aggregateReviewRatings, type ReviewRatingAgg } from '@/lib/utils/aggregation';

type Props = { reviews: Review[] };

const DETAIL_FIELDS: { key: keyof ReviewRatingAgg; label: string }[] = [
  { key: 'ratingTeaching', label: '授業の質' },
  { key: 'ratingFacilities', label: '施設' },
  { key: 'ratingLocation', label: '立地' },
  { key: 'ratingCostPerf', label: 'コスパ' },
];

export default function ReviewSummary({ reviews }: Props) {
  const agg = aggregateReviewRatings(reviews);
  if (!agg) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <span className="text-4xl font-bold text-primary-600">{agg.ratingOverall.toFixed(1)}</span>
          <p className="text-xs text-gray-500 mt-1">{agg.count}件の口コミ</p>
        </div>
        <StarRating rating={agg.ratingOverall} size="lg" showValue={false} />
      </div>
      <div className="space-y-3">
        {DETAIL_FIELDS.map(({ key, label }) => {
          const value = agg[key] as number;
          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium">{value.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${(value / 5) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
