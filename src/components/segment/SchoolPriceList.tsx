import Link from 'next/link';
import type { School } from '@/lib/microcms/types';
import { formatJpyShort } from '@/lib/segments/cost-estimator';

type Props = {
  schools: School[];
  estimates: Map<string, number>;
  monthsAssumed: number;
  className?: string;
};

export default function SchoolPriceList({ schools, estimates, monthsAssumed, className = '' }: Props) {
  if (schools.length === 0) return null;

  return (
    <ul className={`space-y-3 ${className}`}>
      {schools.map((school) => {
        const total = estimates.get(school.id);
        return (
          <li key={school.id}>
            <Link
              href={`/schools/${school.id}`}
              className="block border border-gray-200 rounded-xl p-4 hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    {school.country?.flagEmoji && <span>{school.country.flagEmoji}</span>}
                    <span>{school.country?.nameJp}</span>
                    <span>·</span>
                    <span>{school.city}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{school.name}</p>
                  {school.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{school.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {total != null && (
                    <p className="text-sm font-bold text-primary-700 tabular-nums">
                      {formatJpyShort(total)}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-500">{monthsAssumed}ヶ月想定</p>
                  {school.weeklyFeeLow && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      週{formatJpyShort(school.weeklyFeeLow)}〜
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
