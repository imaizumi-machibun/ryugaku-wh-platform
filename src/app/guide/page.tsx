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
  description: 'ワーキングホリデーの準備から帰国後のキャリアまで、9つのフェーズに分けてステップバイステップで解説する完全ガイド。情報収集、ビザ申請、出発準備、現地生活、仕事、住居、語学、安全対策、帰国後キャリアのすべてをカバー。',
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

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ完全ガイド' }]} />

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            ワーホリ完全ガイド
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            情報収集から帰国後のキャリアまで、ワーキングホリデーのすべてを
            <strong>9つのフェーズ・{totalArticles}記事</strong>で徹底解説。
            初めての方もステップバイステップで進められます。
          </p>
        </div>

        {/* Phase timeline */}
        <div className="max-w-3xl mx-auto space-y-8">
          {grouped.map((group, i) => (
            <GuidePhaseCard
              key={group.phase}
              phase={group.phase}
              label={group.label}
              emoji={group.emoji}
              color={group.color}
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
