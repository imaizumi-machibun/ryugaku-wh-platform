import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/layout/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateItemListJsonLd } from '@/lib/seo/jsonld';
import { OCCUPATIONS } from '@/lib/data/occupations';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: `職業別のワーホリ・海外キャリア完全ガイド｜${OCCUPATIONS.length}職種から探す`,
  description: `看護師・エンジニア・バリスタなど職業別のワーホリ・海外キャリア戦略を解説。職種ごとのおすすめ国、ビザのポイント、収入目安、必要なスキルを一覧で比較。`,
  path: '/jobs',
  keywords: ['職業 ワーホリ', '海外 仕事', '海外 就職', '看護師 ワーホリ', 'エンジニア 海外'],
});

export default function JobsTopPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '職業から探す', url: '/jobs' },
        ])}
      />
      <JsonLd
        data={generateItemListJsonLd({
          name: '職業別のワーホリ・海外キャリアガイド',
          items: OCCUPATIONS.map((o) => ({ name: o.label, url: `/jobs/${o.slug}` })),
        })}
      />

      <div className="container-custom pt-6">
        <Breadcrumb items={[{ label: '職業から探す' }]} />
      </div>
      <PageHero
        eyebrow="By occupation"
        title="職業から探すワーホリ・海外キャリア"
        description={`看護師・エンジニア・バリスタなど${OCCUPATIONS.length}職種それぞれの海外キャリア戦略を、おすすめ国・ビザ・収入目安とともに一覧で比較。`}
      />

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OCCUPATIONS.map((o) => (
            <Link
              key={o.slug}
              href={`/jobs/${o.slug}`}
              className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-soft-lg"
            >
              <h2 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-primary-700">{o.label}</h2>
              <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">{o.description}</p>
              {o.salaryRange && (
                <p className="mt-3 text-xs text-gray-500">
                  <span className="font-medium">海外収入目安:</span> {o.salaryRange}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
