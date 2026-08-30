import type { Country, School, Experience, Article } from '../microcms/types';
import { resolveCitySlug } from '../data/cities';

export type RelatedLink = {
  label: string;
  href: string;
  description?: string;
  badge?: string;
};

export type RelatedSection = {
  title: string;
  links: RelatedLink[];
};

const COUNTRY_EDITORIAL_LINKS: Record<string, RelatedLink[]> = {
  denmark: [
    {
      label: 'デンマークワーホリの申請・仕事・暮らしを詳しく読む',
      href: '/articles/wh-denmark-complete-guide',
      description: '申請条件、必要書類、仕事探し、現地生活をまとめた実践ガイド',
    },
    {
      label: 'デンマークワーホリ1年の費用と必要な貯金を確認する',
      href: '/articles/wh-denmark-cost-guide',
      description: '初期費用、毎月の生活費、収入を前提別に試算',
    },
  ],
  austria: [
    {
      label: 'オーストリアワーホリの申請・費用・仕事を詳しく読む',
      href: '/articles/wh-austria-complete-guide',
      description: '渡航条件から現地生活までをまとめた実践ガイド',
    },
  ],
  estonia: [
    {
      label: 'エストニアワーホリの条件・必要書類・保険を確認する',
      href: '/articles/wh-estonia-complete-guide',
      description: '申請準備と1年の費用を一次情報ベースで整理',
    },
  ],
  ireland: [
    {
      label: 'アイルランドワーホリの申請手順と必要書類を確認する',
      href: '/countries/ireland/working-holiday',
      description: '受付時期、申請の流れ、費用、仕事探しをまとめた実践ガイド',
    },
  ],
};

// ============================================================
// 体験談から関連ページのリンクセクションを構築
// ============================================================
export function buildExperienceRelatedSections(
  experience: Experience,
  siblings: { sameCountry?: Experience[]; sameCity?: Experience[]; sameDuration?: Experience[] } = {}
): RelatedSection[] {
  const sections: RelatedSection[] = [];
  const countrySlug = experience.country?.id;
  const countryName = experience.country?.nameJp ?? '';
  const cityName = experience.cityPrimary;

  // 同じ国の体験談
  if (siblings.sameCountry && siblings.sameCountry.length > 0) {
    sections.push({
      title: `${countryName}の他の体験談`,
      links: siblings.sameCountry.slice(0, 4).map((e) => ({
        label: e.title,
        href: `/experiences/${e.id}`,
        description: e.cityPrimary ? `${e.cityPrimary} | ★${e.ratingOverall}` : undefined,
      })),
    });
  }

  // 同じ都市
  if (siblings.sameCity && siblings.sameCity.length > 0) {
    sections.push({
      title: `${cityName}の体験談`,
      links: siblings.sameCity.slice(0, 4).map((e) => ({
        label: e.title,
        href: `/experiences/${e.id}`,
      })),
    });
  }

  // 関連カテゴリ・ハブ
  const hubLinks: RelatedLink[] = [];
  if (countrySlug && countryName) {
    hubLinks.push({
      label: `${countryName}の留学・ワーホリ完全ガイド`,
      href: `/countries/${countrySlug}`,
    });
    hubLinks.push({
      label: `${countryName}の語学学校一覧`,
      href: `/schools?country=${countrySlug}`,
    });
    hubLinks.push({
      label: `${countryName}の留学・ワーホリ費用`,
      href: `/countries/${countrySlug}/cost`,
    });
  }
  hubLinks.push({
    label: '経験者の実態調査データ（費用・語学・満足度）',
    href: '/research',
    description: '渡航経験者のアンケート・体験談を集計した独自調査',
  });
  if (experience.durationMonths) {
    const months = experience.durationMonths;
    const periodSlug = months <= 1 ? '1month' : months <= 3 ? '3months' : months <= 6 ? '6months' : months <= 12 ? '1year' : '2years';
    const periodLabel = months <= 1 ? '1ヶ月' : months <= 3 ? '3ヶ月' : months <= 6 ? '半年' : months <= 12 ? '1年' : '2年';
    hubLinks.push({
      label: `${periodLabel}のワーホリ・留学体験談まとめ`,
      href: `/duration/${periodSlug}`,
    });
  }
  if (experience.ageAtDeparture) {
    const age = experience.ageAtDeparture;
    const genSlug = age < 25 ? '20s-early' : age < 30 ? '20s-late' : age < 40 ? '30s' : '40s';
    const genLabel = age < 25 ? '20代前半' : age < 30 ? '20代後半' : age < 40 ? '30代' : '40代以上';
    hubLinks.push({
      label: `${genLabel}のワーホリ・留学体験談`,
      href: `/age/${genSlug}`,
    });
  }

  if (hubLinks.length > 0) {
    sections.push({ title: '関連カテゴリ', links: hubLinks });
  }

  return sections;
}

// ============================================================
// 学校から関連ページのリンクセクションを構築
// ============================================================
export function buildSchoolRelatedSections(
  school: School,
  siblings: { sameCity?: School[]; sameCountry?: School[] } = {}
): RelatedSection[] {
  const sections: RelatedSection[] = [];
  const countrySlug = school.country?.id;
  const countryName = school.country?.nameJp ?? '';
  const city = school.city;

  if (siblings.sameCity && siblings.sameCity.length > 0) {
    sections.push({
      title: `${city}の他の語学学校`,
      links: siblings.sameCity
        .filter((s) => s.id !== school.id)
        .slice(0, 5)
        .map((s) => ({
          label: s.name,
          href: `/schools/${s.id}`,
          description: s.weeklyFeeLow ? `週¥${s.weeklyFeeLow.toLocaleString()}〜` : undefined,
        })),
    });
  }

  if (siblings.sameCountry && siblings.sameCountry.length > 0) {
    sections.push({
      title: `${countryName}の人気語学学校`,
      links: siblings.sameCountry
        .filter((s) => s.id !== school.id && s.city !== school.city)
        .slice(0, 5)
        .map((s) => ({
          label: s.name,
          href: `/schools/${s.id}`,
          description: s.city,
        })),
    });
  }

  const hubLinks: RelatedLink[] = [];
  if (countrySlug && countryName) {
    hubLinks.push({
      label: `${countryName}の留学・ワーホリ完全ガイド`,
      href: `/countries/${countrySlug}`,
    });
    hubLinks.push({
      label: `${countryName}の体験談一覧`,
      href: `/experiences?country=${countrySlug}`,
    });
    hubLinks.push({
      label: `${countryName}の留学費用は実際いくら？`,
      href: `/countries/${countrySlug}/cost`,
    });
  }
  if (countrySlug && city) {
    const citySlug = resolveCitySlug(countrySlug, city);
    if (citySlug) {
      hubLinks.push({
        label: `${city}の留学・ワーホリ完全ガイド`,
        href: `/countries/${countrySlug}/cities/${citySlug}`,
      });
    }
  }
  if (hubLinks.length > 0) {
    sections.push({ title: '関連カテゴリ', links: hubLinks });
  }

  return sections;
}

// ============================================================
// 国から関連ページのリンクセクションを構築
// ============================================================
export function buildCountryRelatedSections(country: Country): RelatedSection[] {
  const sections: RelatedSection[] = [];
  const countrySlug = country.id;

  // 人気都市
  if (country.popularCities && country.popularCities.length > 0) {
    const cityLinks: RelatedLink[] = country.popularCities
      .slice(0, 6)
      .map((c) => {
        const citySlug = resolveCitySlug(countrySlug, c.cityName);
        if (!citySlug) return null;
        return {
          label: `${c.cityName}の留学・ワーホリ情報`,
          href: `/countries/${countrySlug}/cities/${citySlug}`,
          description: c.cityDescription,
        } as RelatedLink;
      })
      .filter((l): l is RelatedLink => l !== null);
    if (cityLinks.length > 0) {
      sections.push({
        title: `${country.nameJp}の人気都市`,
        links: cityLinks,
      });
    }
  }

  // 目的別
  const purposes: { slug: string; label: string }[] = [
    { slug: 'language', label: '語学留学' },
    { slug: 'working-holiday', label: 'ワーキングホリデー' },
    { slug: 'university', label: '大学進学' },
    { slug: 'internship', label: 'インターンシップ' },
    { slug: 'parent-child', label: '親子留学' },
  ];
  sections.push({
    title: `${country.nameJp}の目的別ガイド`,
    links: purposes.map((p) => ({
      label: `${country.nameJp}で${p.label}`,
      href: `/countries/${countrySlug}/purpose/${p.slug}`,
    })),
  });

  const editorialLinks = COUNTRY_EDITORIAL_LINKS[countrySlug];
  if (editorialLinks?.length) {
    sections.push({
      title: `${country.nameJp}の実践ガイド`,
      links: editorialLinks,
    });
  }

  // ハブ
  sections.push({
    title: '関連リンク',
    links: [
      {
        label: `${country.nameJp}の留学・ワーホリ費用を徹底解説`,
        href: `/countries/${countrySlug}/cost`,
      },
      {
        label: `${country.nameJp}の語学学校一覧`,
        href: `/schools?country=${countrySlug}`,
      },
      {
        label: `${country.nameJp}の体験談を読む`,
        href: `/experiences?country=${countrySlug}`,
      },
      {
        label: '経験者の実態調査データ（費用・語学・満足度）を見る',
        href: '/research',
        description: '渡航経験者のアンケート・体験談を集計した独自調査',
      },
    ],
  });

  return sections;
}

// ============================================================
// 記事から関連ページのリンクセクションを構築
// ============================================================
export function buildArticleRelatedSections(
  article: Article,
  siblings: { sameCategory?: Article[] } = {}
): RelatedSection[] {
  const sections: RelatedSection[] = [];

  if (siblings.sameCategory && siblings.sameCategory.length > 0) {
    sections.push({
      title: '同じカテゴリの記事',
      links: siblings.sameCategory
        .filter((a) => a.id !== article.id)
        .slice(0, 5)
        .map((a) => ({
          label: a.title,
          href: `/articles/${a.id}`,
        })),
    });
  }

  if (article.relatedCountries && article.relatedCountries.length > 0) {
    sections.push({
      title: '関連する国',
      links: article.relatedCountries.slice(0, 4).flatMap((c) => [
        {
          label: `${c.nameJp}の留学・ワーホリ完全ガイド`,
          href: `/countries/${c.id}`,
        },
        {
          label: `${c.nameJp}の費用ガイド（初期費用・生活費）`,
          href: `/countries/${c.id}/cost`,
        },
      ]),
    });
  }

  return sections;
}

// ============================================================
// 都市名 → URL slug 変換
// @deprecated 日本語名をそのまま slug に残してしまい /cities/[city] ルート
// （ASCII slug 期待）と一致せず 404 を生むため、都市ページへのリンク生成には
// 使わないこと。表示名から正しい ASCII slug を引くには
// `resolveCitySlug(countrySlug, cityName)`（@/lib/data/cities）を使う。
// ============================================================
export function cityToSlug(cityName: string): string {
  return cityName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-ぁ-んァ-ンー一-龯]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================================
// 関連度スコア（拡張用フック）
// ============================================================
export function calcRelatedScore(
  base: Pick<Experience, 'country' | 'cityPrimary' | 'durationMonths' | 'ageAtDeparture'>,
  candidate: Pick<Experience, 'country' | 'cityPrimary' | 'durationMonths' | 'ageAtDeparture'>
): number {
  let score = 0;
  if (base.country?.id && base.country.id === candidate.country?.id) score += 5;
  if (base.cityPrimary && base.cityPrimary === candidate.cityPrimary) score += 3;
  if (base.durationMonths && candidate.durationMonths) {
    const diff = Math.abs(base.durationMonths - candidate.durationMonths);
    if (diff <= 1) score += 2;
    else if (diff <= 3) score += 1;
  }
  if (base.ageAtDeparture && candidate.ageAtDeparture) {
    const diff = Math.abs(base.ageAtDeparture - candidate.ageAtDeparture);
    if (diff <= 2) score += 2;
    else if (diff <= 5) score += 1;
  }
  return score;
}
