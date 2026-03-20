import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuideBySlug, getGuides, getGuidesByPhase, getGuideSlugs } from '@/lib/microcms/guides';
import GuideSidebar from '@/components/guide/GuideSidebar';
import GuideMobileTOC from '@/components/guide/GuideMobileTOC';
import GuideNavigation from '@/components/guide/GuideNavigation';
import GuideKeyPoints from '@/components/guide/GuideKeyPoints';
import GuideChecklist from '@/components/guide/GuideChecklist';
import GuideTipBox from '@/components/guide/GuideTipBox';
import GuideProgressBar from '@/components/guide/GuideProgressBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import { generateGuideJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { generateArticleMetadata } from '@/lib/seo/metadata';
import { GUIDE_PHASES } from '@/lib/utils/constants';
import { formatDate } from '@/lib/utils/format';
import type { GuidePhase } from '@/lib/microcms/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getGuideSlugs();
  return slugs.map((s) => ({ phase: s.phase, slug: s.id }));
}

type Props = { params: { phase: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const guide = await getGuideBySlug(params.slug);
    return generateArticleMetadata({
      title: `${guide.title} | ワーホリ完全ガイド`,
      description: guide.description || `${guide.title}について詳しく解説`,
      path: `/guide/${params.phase}/${params.slug}`,
      ogImage: guide.heroImage?.url,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
    });
  } catch {
    return {};
  }
}

export default async function GuideArticlePage({ params }: Props) {
  const phaseInfo = GUIDE_PHASES.find((p) => p.value === params.phase);
  if (!phaseInfo) notFound();

  let guide;
  try {
    guide = await getGuideBySlug(params.slug);
  } catch {
    notFound();
  }

  if (guide.phase !== params.phase) notFound();

  const [phaseGuides, allGuidesData] = await Promise.all([
    getGuidesByPhase(params.phase as GuidePhase),
    getGuides({ limit: 100 }),
  ]);

  return (
    <>
      <JsonLd data={generateGuideJsonLd(guide)} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ完全ガイド', url: '/guide' },
          { name: phaseInfo.label, url: `/guide/${params.phase}` },
          { name: guide.title, url: `/guide/${params.phase}/${params.slug}` },
        ])}
      />

      <div className="container-custom py-8">
        <Breadcrumb
          items={[
            { label: 'ワーホリ完全ガイド', href: '/guide' },
            { label: phaseInfo.label, href: `/guide/${params.phase}` },
            { label: guide.title },
          ]}
        />

        {/* Progress bar */}
        <div className="mb-6">
          <GuideProgressBar currentPhase={guide.phase} />
        </div>

        {/* Main layout */}
        <div className="flex gap-8">
          {/* Sidebar (desktop only) */}
          <GuideSidebar
            currentGuideId={guide.id}
            phase={guide.phase}
            guides={phaseGuides}
            phaseLabel={phaseInfo.label}
            phaseEmoji={phaseInfo.emoji}
          />

          {/* Content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Link
                  href={`/guide/${params.phase}`}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${phaseInfo.color}`}
                >
                  {phaseInfo.emoji} {phaseInfo.label}
                </Link>
                <span className="text-sm text-gray-500">
                  {formatDate(guide.publishedAt || guide.createdAt)}
                </span>
                {guide.estimatedMinutes && (
                  <span className="text-sm text-gray-400">
                    読了 約{guide.estimatedMinutes}分
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3">{guide.title}</h1>
              {guide.description && (
                <p className="text-gray-600 text-lg leading-relaxed">{guide.description}</p>
              )}
            </header>

            {/* Hero Image */}
            {guide.heroImage && (
              <div className="relative h-52 sm:h-72 md:h-80 rounded-xl overflow-hidden mb-8">
                <Image
                  src={guide.heroImage.url}
                  alt={guide.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Key Points */}
            {guide.keyPoints && guide.keyPoints.length > 0 && (
              <GuideKeyPoints keyPoints={guide.keyPoints} />
            )}

            {/* Body */}
            <div
              className="prose-guide mb-8"
              dangerouslySetInnerHTML={{ __html: guide.body }}
            />

            {/* Checklist */}
            {guide.checklist && guide.checklist.length > 0 && (
              <GuideChecklist checklist={guide.checklist} guideId={guide.id} />
            )}

            {/* Tips */}
            {guide.tips && guide.tips.length > 0 && (
              <GuideTipBox tips={guide.tips} />
            )}

            {/* Related Countries */}
            {guide.relatedCountries && guide.relatedCountries.length > 0 && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-lg font-bold mb-3">関連する国</h2>
                <div className="flex flex-wrap gap-2">
                  {guide.relatedCountries.map((c) => (
                    <Link
                      key={c.id}
                      href={`/countries/${c.id}`}
                      className="flex items-center gap-1 bg-gray-100 rounded-full px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
                    >
                      {c.flagEmoji} {c.nameJp}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <GuideNavigation
              currentGuide={guide}
              allGuides={allGuidesData.contents}
            />
          </article>
        </div>

        {/* Mobile TOC */}
        <GuideMobileTOC
          currentGuideId={guide.id}
          phase={guide.phase}
          guides={phaseGuides}
          phaseLabel={phaseInfo.label}
        />
      </div>
    </>
  );
}
