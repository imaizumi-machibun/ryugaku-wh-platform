import type { Review } from '@/lib/microcms/types';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import HelpfulButton from '@/components/review/HelpfulButton';
import { formatDate } from '@/lib/utils/format';

type Props = { review: Review };

export default function ReviewCard({ review }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{review.nickname}</span>
          <span className="text-xs text-gray-500">{review.attendedYear}年通学</span>
          <Badge variant="success" className="text-[10px]">
            <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            認証済み
          </Badge>
        </div>
        <StarRating rating={review.ratingOverall} size="sm" />
      </div>
      <h4 className="font-semibold mb-2">{review.title}</h4>
      <p className="text-sm text-gray-600 mb-3 line-clamp-4">{review.body}</p>
      {(review.pros || review.cons) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {review.pros && (
            <div className="bg-green-50 rounded-md p-3">
              <p className="text-xs font-medium text-green-700 mb-1">良い点</p>
              <p className="text-sm text-green-800">{review.pros}</p>
            </div>
          )}
          {review.cons && (
            <div className="bg-red-50 rounded-md p-3">
              <p className="text-xs font-medium text-red-700 mb-1">改善点</p>
              <p className="text-sm text-red-800">{review.cons}</p>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-400">
          {formatDate(review.publishedAt || review.createdAt)}
        </span>
        <HelpfulButton reviewId={review.id} />
      </div>
    </div>
  );
}
