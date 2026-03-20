import type { KeyPoint } from '@/lib/microcms/types';

type Props = {
  keyPoints: KeyPoint[];
};

export default function GuideKeyPoints({ keyPoints }: Props) {
  if (keyPoints.length === 0) return null;

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 my-6">
      <h3 className="text-base font-bold text-primary-800 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        このページのポイント
      </h3>
      <ul className="space-y-2">
        {keyPoints.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-primary-900">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-primary-200 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <span>{point.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
