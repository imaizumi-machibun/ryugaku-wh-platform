import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/layout/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateItemListJsonLd } from '@/lib/seo/jsonld';
import { DURATIONS } from '@/lib/data/durations';
import { formatJPY } from '@/lib/utils/format';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: `期間から探すワーホリ・留学｜2週間〜2年以上まで${DURATIONS.length}プラン`,
  description: `2週間の短期留学から2年以上のセカンドワーホリまで、期間別の予算・おすすめ国・語学習得のリアルを解説。`,
  path: '/duration',
  keywords: ['短期留学', '1ヶ月 留学', '半年 ワーホリ', '1年 ワーホリ', '2年 ワーホリ'],
});

export default function DurationTopPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '期間から探す', url: '/duration' },
        ])}
      />
      <JsonLd
        data={generateItemListJsonLd({
          name: '期間別ワーホリ・留学プラン',
          items: DURATIONS.map((d) => ({ name: d.label, url: `/duration/${d.slug}` })),
        })}
      />

      <div className="container-custom pt-6">
        <Breadcrumb items={[{ label: '期間から探す' }]} />
      </div>
      <PageHero
        eyebrow="By duration"
        title="期間から探すワーホリ・留学"
        description="短期留学から1年以上のワーホリまで、希望する期間に合わせた最適なプランを見つけられます。"
      />

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DURATIONS.map((d) => (
            <Link
              key={d.slug}
              href={`/duration/${d.slug}`}
              className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-soft-lg"
            >
              <h2 className="mb-2 text-xl font-bold text-primary-700">{d.label}</h2>
              <p className="mb-3 text-sm leading-relaxed text-gray-600">{d.description}</p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">予算:</span> {formatJPY(d.budgetRangeJpy.min)}〜{formatJPY(d.budgetRangeJpy.max)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
