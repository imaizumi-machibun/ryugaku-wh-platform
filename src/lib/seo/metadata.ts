import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '../utils/constants';
import type { Country, School, Experience } from '../microcms/types';

type MetadataParams = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
  noindexFollow?: boolean;
  keywords?: string[];
};

export function generatePageMetadata({
  title,
  description,
  path,
  ogImage,
  noindex,
  noindexFollow,
  keywords,
}: MetadataParams): Metadata {
  const url = `${SITE_URL}${path}`;
  // app/layout.tsx の title.template がブランド名を付与する。
  // OGP/Twitter には template が適用されないため、そちらだけ明示的に付ける。
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 && { keywords }),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'ja_JP',
      type: 'website',
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
    },
    ...(noindex && { robots: { index: false, follow: noindexFollow ?? false } }),
  };
}

export function generateArticleMetadata({
  title,
  description,
  path,
  ogImage,
  publishedTime,
  modifiedTime,
  keywords,
}: MetadataParams & { publishedTime?: string; modifiedTime?: string }): Metadata {
  const base = generatePageMetadata({ title, description, path, ogImage, keywords });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
  };
}

// ============================================================
// 国ページ用メタデータ生成（年/地域を自動挿入）
// ============================================================
export function generateCountryMetadata(
  country: Country,
  path: string,
  overrides?: { metaTitle?: string; metaDescription?: string }
): Metadata {
  const keywords = [
    `${country.nameJp} 基本情報`,
    `${country.nameJp} 都市`,
    `${country.nameJp} 気候`,
    `${country.nameJp} 通貨`,
    `${country.nameJp} 生活`,
  ];
  const defaultTitle = `${country.nameJp}の基本情報・都市・生活環境｜留学・ワーホリ国別ハブ`;
  const defaultDescription = `${country.nameJp}（${country.nameEn}）の基本情報、気候、通貨、時差、主要都市、生活環境を紹介。ワーホリと留学は目的別の詳細ガイドへ分けて案内します。`;

  return generatePageMetadata({
    title: overrides?.metaTitle ?? defaultTitle,
    description: overrides?.metaDescription ?? defaultDescription,
    path,
    ogImage: country.heroImage?.url,
    keywords,
  });
}

// ============================================================
// 学校ページ用メタデータ生成（都市・国・コース情報を自動挿入）
// ============================================================
export function generateSchoolMetadata(school: School, path: string): Metadata {
  const countryName = school.country?.nameJp ?? '';
  const courseHint = school.courseTypes?.length ? '一般英語・ビジネス対応' : '語学コース';

  const keywords = [
    `${school.name} 評判`,
    `${school.name} 口コミ`,
    `${school.name} 費用`,
    `${school.city} 語学学校`,
    `${countryName} ${school.city} 留学`,
    `${countryName} 語学学校`,
  ];

  const title = `${school.name}の口コミ・評判・費用｜${countryName}${school.city ? `・${school.city}` : ''}の${courseHint}`;
  const description = `${school.name}（${countryName}${school.city ? `・${school.city}` : ''}）の口コミ・評価・コース・週あたり費用を実体験者の声付きで解説。同地域のおすすめ学校との比較も掲載。`;

  return generatePageMetadata({
    title,
    description,
    path,
    ogImage: school.heroImage?.url,
    keywords,
  });
}

// ============================================================
// 体験談ページ用メタデータ生成（年・国・期間・職業を自動挿入）
// ============================================================
export function generateExperienceMetadata(experience: Experience, path: string): Metadata {
  const countryName = experience.country?.nameJp ?? '';
  const cityName = experience.cityPrimary ?? '';
  const year = experience.publishedAt
    ? new Date(experience.publishedAt).getFullYear()
    : new Date().getFullYear();
  const months = experience.durationMonths;
  const durationLabel = months ? `${months >= 12 ? `${Math.floor(months / 12)}年` : `${months}ヶ月`}` : '';
  const ageLabel = experience.ageAtDeparture ? `${experience.ageAtDeparture}歳` : '';

  const titleParts: string[] = [];
  titleParts.push(`【${year}年 ${countryName}${cityName ? `・${cityName}` : ''}】`);
  if (durationLabel) titleParts.push(`${durationLabel}`);
  if (ageLabel) titleParts.push(ageLabel);
  const purposeLabel = experience.classificationStatus === 'verified'
    ? experience.primaryPurpose === 'working-holiday'
      ? 'ワーホリ'
      : experience.primaryPurpose === 'study-abroad'
        ? '留学'
        : '海外生活'
    : 'ワーホリ・留学';
  titleParts.push(`${purposeLabel}体験談`);
  const dynamicTitle = titleParts.join(' ').trim();
  const title = experience.title.length > 5 ? experience.title : dynamicTitle;

  const keywords = [
    `${countryName} ${purposeLabel} 体験談`,
    `${cityName} ${purposeLabel}`,
    `${countryName} ${durationLabel}`,
    `${year}年 ワーホリ`,
  ].filter(Boolean);

  const descParts: string[] = [];
  descParts.push(`${countryName}${cityName ? `・${cityName}` : ''}での${durationLabel ? `${durationLabel}` : ''}${purposeLabel}体験談。`);
  if (experience.monthlyLivingJpy) {
    descParts.push(`生活費月${Math.round(experience.monthlyLivingJpy / 10000)}万円のリアル、`);
  }
  if (experience.ratingOverall) {
    descParts.push(`総合評価★${experience.ratingOverall.toFixed(1)}/5。`);
  }
  descParts.push('良かった点・大変だった点・これから行く方へのアドバイス付き。');

  return generateArticleMetadata({
    title,
    description: descParts.join(''),
    path,
    publishedTime: experience.publishedAt,
    modifiedTime: experience.updatedAt,
    keywords,
  });
}

// ============================================================
// 比較ページ用メタデータ
// ============================================================
export function generateCompareMetadata(opts: {
  itemAName: string;
  itemBName: string;
  category: '国' | '学校' | '言語';
  path: string;
}): Metadata {
  const { itemAName, itemBName, category, path } = opts;
  const year = new Date().getFullYear();
  const title = `${itemAName} vs ${itemBName}｜${category}の違いを徹底比較【${year}年版】`;
  const description = `${itemAName}と${itemBName}を費用・期間・条件など多角的に比較。どちらが自分に合うか体験談ベースで解説します。`;
  const keywords = [
    `${itemAName} ${itemBName} 比較`,
    `${itemAName} ${itemBName} どっち`,
    `${itemAName} ${itemBName} 違い`,
  ];
  return generatePageMetadata({ title, description, path, keywords });
}

// ============================================================
// 都市ページ用メタデータ
// ============================================================
export function generateCityMetadata(opts: {
  cityNameJp: string;
  countryNameJp: string;
  path: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
}): Metadata {
  const { cityNameJp, countryNameJp, path, description, metaTitle, metaDescription } = opts;
  const year = new Date().getFullYear();
  const title =
    metaTitle ||
    `${cityNameJp}（${countryNameJp}）のワーホリ・留学完全ガイド【${year}年版】`;
  const finalDescription =
    metaDescription ||
    description ||
    `${cityNameJp}（${countryNameJp}）でのワーキングホリデー・留学情報まとめ。生活費、おすすめ語学学校、仕事事情、治安、体験談を一挙紹介。`;
  const keywords = [
    `${cityNameJp} ワーホリ`,
    `${cityNameJp} 留学`,
    `${cityNameJp} 語学学校`,
    `${cityNameJp} 生活費`,
    `${countryNameJp} ${cityNameJp}`,
  ];
  return generatePageMetadata({ title, description: finalDescription, path, keywords });
}

// ============================================================
// 目的別ページ用メタデータ
// ============================================================
export function generatePurposeMetadata(opts: {
  countryNameJp: string;
  purposeLabel: string;
  path: string;
}): Metadata {
  const { countryNameJp, purposeLabel, path } = opts;
  const year = new Date().getFullYear();
  const title = `${countryNameJp}の${purposeLabel}完全ガイド【${year}年版】費用・期間・体験談`;
  const description = `${countryNameJp}で${purposeLabel}を目指す方向けの完全ガイド。必要費用、期間、おすすめのプログラム、体験談を網羅。`;
  const keywords = [
    `${countryNameJp} ${purposeLabel}`,
    `${purposeLabel} 費用`,
    `${purposeLabel} ${countryNameJp}`,
  ];
  return generatePageMetadata({ title, description, path, keywords });
}

// ============================================================
// 費用特化ページ
// ============================================================
export function generateCostMetadata(country: Country, path: string): Metadata {
  const year = new Date().getFullYear();
  const livingPart = country.livingCostMonthJpy
    ? `月${Math.round(country.livingCostMonthJpy / 10000)}万円〜`
    : '';
  const title = `${country.nameJp}の留学・ワーホリ費用は実際いくら？${livingPart}【${year}年最新】`;
  const description = `${country.nameJp}でかかる留学・ワーホリ費用を、ビザ・学費・住居・食費・交通費まで実体験ベースで完全解説。節約のコツも紹介。`;
  const keywords = [
    `${country.nameJp} 留学 費用`,
    `${country.nameJp} ワーホリ 費用`,
    `${country.nameJp} 生活費`,
    `${country.nameJp} ${year} 費用`,
  ];
  return generatePageMetadata({ title, description, path, keywords });
}

// ============================================================
// セグメント別ページ（職業・予算・期間・年代）
// ============================================================
export function generateSegmentMetadata(opts: {
  segmentLabel: string;
  segmentType: '職業' | '予算' | '期間' | '年代';
  path: string;
  count?: number;
}): Metadata {
  const { segmentLabel, segmentType, path, count } = opts;
  const year = new Date().getFullYear();
  const countText = count ? `${count}件の体験談から` : '';
  const title = `${segmentLabel}のワーホリ・留学体験談まとめ【${year}年最新】${countText.replace('から', '')}`;
  const description = `${segmentLabel}でワーホリ・留学を実現した方々の体験談を集約。${countText}費用・準備・成功のコツがわかります。`;
  const keywords = [
    `${segmentLabel} ワーホリ`,
    `${segmentLabel} 留学`,
    `${segmentLabel} 体験談`,
    `${segmentType}別 ワーホリ`,
  ];
  return generatePageMetadata({ title, description, path, keywords });
}
