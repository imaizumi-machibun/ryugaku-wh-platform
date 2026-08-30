import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/layout/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateItemListJsonLd } from '@/lib/seo/jsonld';
import { GENERATIONS } from '@/lib/data/generations';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: `年代から探すワーホリ・留学｜学生・20代・30代・40代以上まで完全ガイド`,
  description: `世代別のワーホリ・留学戦略。20代前半の王道ワーホリから、30代の語学留学、40代以上のシニア留学までケース別に解説。`,
  path: '/age',
  keywords: ['20代 ワーホリ', '30代 ワーホリ', '30代 留学', '40代 留学', '社会人 ワーホリ'],
});

export default function AgeTopPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '年代から探す', url: '/age' },
        ])}
      />
      <JsonLd
        data={generateItemListJsonLd({
          name: '年代別ワーホリ・留学ガイド',
          items: GENERATIONS.map((g) => ({ name: g.label, url: `/age/${g.slug}` })),
        })}
      />

      <div className="container-custom pt-6">
        <Breadcrumb items={[{ label: '年代から探す' }]} />
      </div>
      <PageHero
        eyebrow="By age"
        title="年代から探すワーホリ・留学"
        description="自分の年代に合わせたプランを見つけられます。各世代の悩みに寄り添った戦略を解説します。"
      />

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GENERATIONS.map((g) => (
            <Link
              key={g.slug}
              href={`/age/${g.slug}`}
              className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-soft-lg"
            >
              <h2 className="mb-2 text-xl font-bold text-primary-700">{g.label}</h2>
              <p className="mb-3 text-sm leading-relaxed text-gray-600">{g.description}</p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">こんな方に:</span> {g.whoFor}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
