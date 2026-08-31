import type { Metadata } from 'next';
import CountryPurposePage, { type PurposeSearchParams } from '@/components/country-purpose/CountryPurposePage';
import { getCountryBySlug } from '@/lib/microcms/countries';
import { getPurposeGuideDefinition } from '@/lib/country-purpose/registry';
import { getCountryPurposeVisuals } from '@/lib/country-purpose/visuals';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const revalidate = 1800;

type Props = { params: { slug: string }; searchParams: PurposeSearchParams };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const country = await getCountryBySlug(params.slug).catch(() => null);
  const definition = getPurposeGuideDefinition(params.slug, 'working-holiday');
  if (!country || !definition) return {};
  const filtered = Object.values(searchParams).some(Boolean);
  const purposeVisuals = getCountryPurposeVisuals(params.slug, 'working-holiday');
  return generatePageMetadata({
    title: `${country.nameJp}ワーホリ完全ガイド｜体験談・費用・仕事・ビザ`,
    description: definition.allowNoVerifiedExperience
      ? `${country.nameJp}ワーホリの制度、申請、費用、仕事、税、住居、安全、渡航後手続を公的一次情報に基づいて詳しく解説します。`
      : `${country.nameJp}ワーホリの制度、申請、費用、仕事、税、住居、安全、渡航後手続と、本人確認済みの体験談をまとめた総合ガイドです。`,
    path: `/countries/${params.slug}/working-holiday`,
    ogImage: purposeVisuals?.hero.src ?? country.heroImage?.url,
    noindex: filtered,
    noindexFollow: filtered,
  });
}

export default function WorkingHolidayPage({ params, searchParams }: Props) {
  return <CountryPurposePage countrySlug={params.slug} purpose="working-holiday" searchParams={searchParams} />;
}
