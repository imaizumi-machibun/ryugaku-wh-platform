import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import {
  hasNonEmptySearchParams,
  type SearchParamValue,
} from '@/lib/countries/wage-filter';

export function buildCountriesMetadata(
  searchParams: Record<string, SearchParamValue>
): Metadata {
  const metadata = generatePageMetadata({
    title: '国から探す',
    description:
      '留学・ワーキングホリデーの対象国一覧。地域や費用レベルで絞り込んで、あなたにぴったりの留学先を見つけましょう。',
    path: '/countries',
  });

  if (!hasNonEmptySearchParams(searchParams)) return metadata;

  return {
    ...metadata,
    robots: { index: false, follow: true },
  };
}
