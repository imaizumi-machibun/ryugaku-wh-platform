import type { Metadata } from 'next';
import { getGuidesGroupedByPhase } from '@/lib/microcms/guides';
import GuidePhaseCard from '@/components/guide/GuidePhaseCard';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ完全ガイド',
  description:
    'ワーキングホリデーの準備から帰国後のキャリアまで、9つのフェーズに分けてステップバイステップで解説する完全ガイド。情報収集、ビザ申請、出発準備、現地生活、仕事、住居、語学、安全対策、帰国後キャリアのすべてをカバー。',
  path: '/guide',
});

export default async function GuidePage() {
  const grouped = await getGuidesGroupedByPhase();
  const totalArticles = grouped.reduce((sum, g) => sum + g.guides.length, 0);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ完全ガイド', url: '/guide' },
        ])}
      />

      {/* Breadcrumb */}
      <div className="container-custom pt-6">
        <Breadcrumb items={[{ label: 'ワーホリ完全ガイド' }]} />
      </div>

      {/* Hero（濃緑・エディトリアル） */}
      <section className="section-dark grain relative mt-6 overflow-hidden text-white">
        <div className="container-custom relative z-10 py-20 md:py-28">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-accent-300">Complete Guide</p>
          <h1 className="max-w-4xl text-hero font-black text-white">ワーホリ完全ガイド</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            情報収集から帰国後のキャリアまで、ワーキングホリデーのすべてを
            <strong className="font-bold text-white">9つのフェーズ・{totalArticles}記事</strong>
            で徹底解説。初めての方も、ステップバイステップで進められます。
          </p>
        </div>
      </section>

      {/* Phase timeline（番号エディトリアル） */}
      <div className="container-custom py-20 md:py-28">
        <div className="space-y-14">
          {grouped.map((group, i) => (
            <GuidePhaseCard
              key={group.phase}
              phase={group.phase}
              label={group.label}
              description={group.description}
              guides={group.guides}
              phaseIndex={i}
            />
          ))}
        </div>
      </div>
    </>
  );
}
