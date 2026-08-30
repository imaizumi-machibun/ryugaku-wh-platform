import Link from 'next/link';
import type { Guide, GuidePhase } from '@/lib/microcms/types';

type Props = {
  phase: GuidePhase;
  label: string;
  description: string;
  guides: Guide[];
  phaseIndex: number;
};

export default function GuidePhaseCard({ phase, label, description, guides, phaseIndex }: Props) {
  const num = String(phaseIndex + 1).padStart(2, '0');

  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="grid gap-6 md:grid-cols-[16rem_1fr] md:gap-10">
        {/* 番号＋フェーズ名 */}
        <div>
          <span className="block text-5xl font-black leading-none tabular-nums text-gray-200 md:text-6xl">
            {num}
          </span>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-600">
            Phase {num}
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">{label}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{description}</p>
        </div>

        {/* 記事リスト（罫線区切り） */}
        <div>
          {guides.length > 0 ? (
            <ul>
              {guides.map((guide) => (
                <li key={guide.id} className="border-b border-gray-100 first:border-t">
                  <Link
                    href={`/guide/${phase}/${guide.id}`}
                    className="group flex items-center gap-4 py-4 transition-colors hover:text-primary-700"
                  >
                    <span className="w-6 shrink-0 text-xs tabular-nums text-gray-400">
                      {String(guide.orderInPhase).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-[15px] font-medium text-gray-800 transition-colors group-hover:text-primary-700">
                      {guide.title}
                    </span>
                    {guide.estimatedMinutes && (
                      <span className="shrink-0 text-xs tabular-nums text-gray-400">
                        {guide.estimatedMinutes}分
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-gray-400">記事は準備中です</p>
          )}
        </div>
      </div>
    </div>
  );
}
