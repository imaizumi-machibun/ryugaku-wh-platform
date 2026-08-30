import type { Metadata } from 'next';
import CountryPurposePage, { type PurposeSearchParams } from '@/components/country-purpose/CountryPurposePage';
import { getCountryBySlug } from '@/lib/microcms/countries';
import { getPurposeGuideDefinition } from '@/lib/country-purpose/registry';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const revalidate = 1800;

type Props = { params: { slug: string }; searchParams: PurposeSearchParams };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const country = await getCountryBySlug(params.slug).catch(() => null);
  if (!country || !getPurposeGuideDefinition(params.slug, 'study-abroad')) return {};
  const filtered = Object.values(searchParams).some(Boolean);
  return generatePageMetadata({
    title: `${country.nameJp}留学完全ガイド｜学校・費用・ビザ・生活`,
    description: `${country.nameJp}留学の種類、学校選び、入学条件、学費、ビザ、住居、現地生活、卒業後まで詳しく解説。掲載校も学校名と都市から絞り込めます。`,
    path: `/countries/${params.slug}/study-abroad`,
    ogImage: country.heroImage?.url,
    noindex: filtered,
    noindexFollow: filtered,
  });
}

export default function StudyAbroadPage({ params, searchParams }: Props) {
  return <CountryPurposePage countrySlug={params.slug} purpose="study-abroad" searchParams={searchParams} />;
}
