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
    title: `${country.nameJp}留学完全ガイド｜体験談・学校・費用・ビザ`,
    description: `${country.nameJp}の語学・大学・専門・Co-op・交換留学を、学校選び、入学条件、学費、ビザ、住居、卒業後と本人確認済み体験談から解説します。`,
    path: `/countries/${params.slug}/study-abroad`,
    ogImage: country.heroImage?.url,
    noindex: filtered,
    noindexFollow: filtered,
  });
}

export default function StudyAbroadPage({ params, searchParams }: Props) {
  return <CountryPurposePage countrySlug={params.slug} purpose="study-abroad" searchParams={searchParams} />;
}
