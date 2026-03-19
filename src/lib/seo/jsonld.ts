import { SITE_NAME, SITE_URL } from '../utils/constants';
import type { Country, School, Experience, Article } from '../microcms/types';

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: '留学・ワーキングホリデーの体験談・学校口コミデータベース',
    inLanguage: 'ja',
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
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
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: school.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: school.city,
      addressCountry: school.country?.nameEn,
    },
    ...(school.website && { url: school.website }),
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
