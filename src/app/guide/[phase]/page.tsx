import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuidesByPhase } from '@/lib/microcms/guides';
import GuideProgressBar from '@/components/guide/GuideProgressBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { GUIDE_PHASES } from '@/lib/utils/constants';
import type { GuidePhase } from '@/lib/microcms/types';

export const revalidate = 3600;

export function generateStaticParams() {
  return GUIDE_PHASES.map((p) => ({ phase: p.value }));
}

type Props = { params: { phase: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const phaseInfo = GUIDE_PHASES.find((p) => p.value === params.phase);
  if (!phaseInfo) return {};
  return generatePageMetadata({
    title: `${phaseInfo.emoji} ${phaseInfo.label} | ワーホリ完全ガイド`,
    description: phaseInfo.description,
    path: `/guide/${params.phase}`,
  });
}

export default async function PhasePage({ params }: Props) {
  const phaseInfo = GUIDE_PHASES.find((p) => p.value === params.phase);
  if (!phaseInfo) notFound();

  const phaseIndex = GUIDE_PHASES.findIndex((p) => p.value === params.phase);
  const guides = await getGuidesByPhase(params.phase as GuidePhase);

  const prevPhase = phaseIndex > 0 ? GUIDE_PHASES[phaseIndex - 1] : null;
  const nextPhase = phaseIndex < GUIDE_PHASES.length - 1 ? GUIDE_PHASES[phaseIndex + 1] : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ完全ガイド', url: '/guide' },
          { name: phaseInfo.label, url: `/guide/${params.phase}` },
        ])}
      />

      <div className="container-custom py-8">
        <Breadcrumb
          items={[
            { label: 'ワーホリ完全ガイド', href: '/guide' },
            { label: phaseInfo.label },
          ]}
        />

        {/* Progress bar */}
        <div className="mb-8">
          <GuideProgressBar currentPhase={params.phase as GuidePhase} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-gray-400">PHASE {phaseIndex + 1}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <span className="text-3xl">{phaseInfo.emoji}</span>
            {phaseInfo.label}
          </h1>
          <p className="text-gray-600 text-lg">{phaseInfo.description}</p>
        </div>

        {/* Article list */}
        {guides.length > 0 ? (
          <div className="max-w-3xl space-y-3">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guide/${params.phase}/${guide.id}`}
                className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-primary-200 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {guide.orderInPhase}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                      {guide.title}
                    </h2>
                    {guide.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{guide.description}</p>
                    )}
                    {guide.estimatedMinutes && (
                      <span className="text-xs text-gray-400 mt-2 inline-block">
                        読了時間: 約{guide.estimatedMinutes}分
                      </span>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">このフェーズの記事は準備中です。</p>
          </div>
        )}

        {/* Phase navigation */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-8 border-t border-gray-200 max-w-3xl">
          {prevPhase ? (
            <Link
              href={`/guide/${prevPhase.value}`}
              className="flex-1 group p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all"
            >
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                前のフェーズ
              </div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                {prevPhase.emoji} {prevPhase.label}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextPhase ? (
            <Link
              href={`/guide/${nextPhase.value}`}
              className="flex-1 group p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-right"
            >
              <div className="text-xs text-gray-400 mb-1 flex items-center justify-end gap-1">
                次のフェーズ
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                {nextPhase.emoji} {nextPhase.label}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    </>
  );
}
