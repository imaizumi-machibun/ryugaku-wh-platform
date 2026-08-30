import { SITE_NAME, SITE_URL } from '../utils/constants';
import type { Country, School, Experience, Article, Guide, Review } from '../microcms/types';

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: '留学・ワーキングホリデーの体験談・学校口コミデータベース',
    inLanguage: 'ja',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/experiences?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: '株式会社街中文学',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description:
      '留学・ワーキングホリデーの体験談・語学学校・国別情報を、一次情報と渡航経験者のアンケートをもとに提供するデータベースメディア。',
    foundingLocation: {
      '@type': 'Place',
      name: '日本',
    },
    sameAs: ['https://machibun.co.jp/'],
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateCountryJsonLd(
  country: Country,
  aggregateRating?: { average: number; count: number }
) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: `${country.nameJp}のワーキングホリデー`,
    description: `${country.nameJp}（${country.nameEn}）のワーキングホリデー・留学情報`,
    serviceType: 'Working Holiday Visa',
    areaServed: {
      '@type': 'Country',
      name: country.nameEn,
    },
  };

  if (aggregateRating && aggregateRating.count > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.average,
      bestRating: 5,
      worstRating: 1,
      ratingCount: aggregateRating.count,
    };
  }

  return jsonLd;
}

export function generateFAQJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateSchoolJsonLd(
  school: School,
  aggregateRating?: { average: number; count: number }
) {
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: school.city,
  };
  if (school.country?.nameEn) address.addressCountry = school.country.nameEn;
  if (school.address) address.streetAddress = school.address;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: school.name,
    address,
    ...(school.website && { url: school.website }),
    ...(school.email && { email: school.email }),
    ...(school.phone && { telephone: school.phone }),
    ...(school.foundedYear && { foundingDate: String(school.foundedYear) }),
    ...(school.latitude && school.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: school.latitude,
        longitude: school.longitude,
      },
    }),
  };

  if (aggregateRating && aggregateRating.count > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.average,
      bestRating: 5,
      worstRating: 1,
      ratingCount: aggregateRating.count,
    };
  }

  return jsonLd;
}

export function generateExperienceJsonLd(experience: Experience) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: experience.title,
    datePublished: experience.publishedAt,
    dateModified: experience.updatedAt,
    author: {
      '@type': 'Person',
      name: '投稿者',
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: experience.ratingOverall,
        bestRating: 5,
        worstRating: 1,
      },
    },
  };
}

export function generateArticleJsonLd(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    ...(article.heroImage && {
      image: article.heroImage.url,
    }),
  };
}

export function generateGuideJsonLd(guide: Guide) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: 'ワーホリ完全ガイド',
      url: `${SITE_URL}/guide`,
    },
    ...(guide.heroImage && {
      image: guide.heroImage.url,
    }),
  };
}

// ============================================================
// 新規追加: ItemList（一覧ページ用）
// ============================================================
export function generateItemListJsonLd(opts: {
  name: string;
  description?: string;
  items: { name: string; url: string; image?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    ...(opts.description && { description: opts.description }),
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
      ...(item.image && { image: item.image }),
    })),
  };
}

// ============================================================
// 新規追加: Review（個別レビュー）
// ============================================================
export function generateReviewJsonLd(review: Review) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'EducationalOrganization',
      name: review.school?.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingOverall,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Person',
      name: review.nickname,
    },
    reviewBody: review.body,
    datePublished: review.publishedAt,
  };
}

// ============================================================
// 新規追加: AggregateRating（単独）
// ============================================================
export function generateAggregateRatingJsonLd(opts: {
  itemName: string;
  itemType: 'EducationalOrganization' | 'Place' | 'Product';
  average: number;
  count: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': opts.itemType,
    name: opts.itemName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: opts.average,
      bestRating: 5,
      worstRating: 1,
      ratingCount: opts.count,
    },
  };
}

// ============================================================
// 新規追加: Course（学校コース用）
// ============================================================
export function generateCourseJsonLd(opts: {
  schoolName: string;
  courseName: string;
  description?: string;
  url?: string;
  weeklyFeeLow?: number;
  weeklyFeeHigh?: number;
}) {
  const offers: Record<string, unknown>[] = [];
  if (opts.weeklyFeeLow) {
    offers.push({
      '@type': 'Offer',
      price: opts.weeklyFeeLow,
      priceCurrency: 'JPY',
      description: '週あたり下限',
    });
  }
  if (opts.weeklyFeeHigh) {
    offers.push({
      '@type': 'Offer',
      price: opts.weeklyFeeHigh,
      priceCurrency: 'JPY',
      description: '週あたり上限',
    });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.courseName,
    ...(opts.description && { description: opts.description }),
    ...(opts.url && { url: opts.url }),
    provider: {
      '@type': 'EducationalOrganization',
      name: opts.schoolName,
    },
    ...(offers.length > 0 && { offers }),
  };
}

// ============================================================
// 新規追加: HowTo（ガイド用）
// ============================================================
export function generateHowToJsonLd(opts: {
  name: string;
  description?: string;
  steps: { name: string; text: string }[];
  totalTimeMinutes?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    ...(opts.description && { description: opts.description }),
    ...(opts.totalTimeMinutes && { totalTime: `PT${opts.totalTimeMinutes}M` }),
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

// ============================================================
// 新規追加: Place（国・都市ページ用）
// ============================================================
export function generatePlaceJsonLd(opts: {
  name: string;
  countryName?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}) {
  const place: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: opts.name,
  };
  if (opts.description) place.description = opts.description;
  if (opts.countryName) {
    place.address = {
      '@type': 'PostalAddress',
      addressCountry: opts.countryName,
      addressLocality: opts.name,
    };
  }
  if (opts.latitude && opts.longitude) {
    place.geo = {
      '@type': 'GeoCoordinates',
      latitude: opts.latitude,
      longitude: opts.longitude,
    };
  }
  return place;
}

// ============================================================
// 新規追加: MonetaryAmount を含む Service（費用ページ）
// ============================================================
export function generateCostServiceJsonLd(opts: {
  countryName: string;
  livingCostMonthJpy?: number;
  visaCostJpy?: number;
}) {
  const monetaryItems: Record<string, unknown>[] = [];
  if (opts.livingCostMonthJpy) {
    monetaryItems.push({
      '@type': 'MonetaryAmount',
      name: '月々の生活費',
      currency: 'JPY',
      value: opts.livingCostMonthJpy,
    });
  }
  if (opts.visaCostJpy) {
    monetaryItems.push({
      '@type': 'MonetaryAmount',
      name: 'ビザ申請費',
      currency: 'JPY',
      value: opts.visaCostJpy,
    });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${opts.countryName}での留学・ワーホリ費用`,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    areaServed: {
      '@type': 'Country',
      name: opts.countryName,
    },
    ...(monetaryItems.length > 0 && {
      offers: monetaryItems.map((item) => ({ '@type': 'Offer', priceSpecification: item })),
    }),
  };
}

// ============================================================
// 新規追加: Experience を Review として宣言するアダプタ
// ============================================================
export function generateExperienceReviewJsonLd(exp: Experience) {
  const itemReviewed: Record<string, unknown> = exp.school
    ? {
        '@type': 'EducationalOrganization',
        name: exp.school.name,
        address: {
          '@type': 'PostalAddress',
          addressCountry: exp.school.country?.nameEn,
          addressLocality: exp.school.city,
        },
      }
    : {
        '@type': 'Place',
        name: exp.cityPrimary || exp.country?.nameJp,
        address: {
          '@type': 'PostalAddress',
          addressCountry: exp.country?.nameEn,
        },
      };

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: exp.ratingOverall,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Person',
      name: '体験談投稿者',
    },
    name: exp.title,
    reviewBody: (exp.content ?? '').slice(0, 280),
    datePublished: exp.publishedAt,
  };
}

// ============================================================
// 新規追加: CollectionPage（絞り込み一覧ページ用）
// ============================================================
export function generateCollectionPageJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  itemListJsonLd?: Record<string, unknown>;
}) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith('http') ? opts.url : `${SITE_URL}${opts.url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
  if (opts.itemListJsonLd) {
    jsonLd.mainEntity = opts.itemListJsonLd;
  }
  return jsonLd;
}

// ============================================================
// 新規追加: QAPage
// ============================================================
export function generateQAPageJsonLd(opts: {
  question: string;
  acceptedAnswer: string;
  suggestedAnswers?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: opts.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: opts.acceptedAnswer,
      },
      ...(opts.suggestedAnswers && opts.suggestedAnswers.length > 0 && {
        suggestedAnswer: opts.suggestedAnswers.map((text) => ({
          '@type': 'Answer',
          text,
        })),
      }),
    },
  };
}

// ============================================================
// 新規追加: Dataset（調査レポート用 — 引用元・データソースとして認識させる）
// ============================================================
export function generateDatasetJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  temporalCoverage?: string;
  measurementTechnique?: string;
  variableMeasured?: string[];
  keywords?: string[];
  license?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith('http') ? opts.url : `${SITE_URL}${opts.url}`,
    isAccessibleForFree: true,
    inLanguage: 'ja',
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(opts.temporalCoverage && { temporalCoverage: opts.temporalCoverage }),
    ...(opts.measurementTechnique && { measurementTechnique: opts.measurementTechnique }),
    ...(opts.variableMeasured &&
      opts.variableMeasured.length > 0 && { variableMeasured: opts.variableMeasured }),
    ...(opts.keywords && opts.keywords.length > 0 && { keywords: opts.keywords }),
    ...(opts.license && { license: opts.license }),
    ...(opts.dateModified && { dateModified: opts.dateModified }),
  };
}

// ============================================================
// 新規追加: WebApplication（無料の診断・比較ツール用）
// ============================================================
export function generateWebApplicationJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith('http') ? opts.url : `${SITE_URL}${opts.url}`,
    applicationCategory: opts.applicationCategory ?? 'UtilitiesApplication',
    operatingSystem: 'Web',
    inLanguage: 'ja',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'JPY',
    },
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
