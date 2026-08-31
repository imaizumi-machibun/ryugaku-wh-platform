import type { Country, Experience, School } from '@/lib/microcms/types';
import type { Scenario, SegmentFAQ, SegmentMeta } from './types';
import {
  generateBreadcrumbJsonLd,
  generateCollectionPageJsonLd,
  generateCourseJsonLd,
  generateCostServiceJsonLd,
  generateExperienceReviewJsonLd,
  generateFAQJsonLd,
  generateItemListJsonLd,
  generatePlaceJsonLd,
  generateAggregateRatingJsonLd,
} from '@/lib/seo/jsonld';
import { SITE_URL } from '@/lib/utils/constants';

// ============================================================
// 絞り込み一覧ページ用 JSON-LD バンドル
// 1ページが必要とする全 schema.org オブジェクトを一発で生成
// ============================================================
export type SegmentJsonLdBundleInput = {
  seg: SegmentMeta;
  url: string;
  pageName: string;
  pageDescription: string;
  breadcrumb: { name: string; url: string }[];
  scenarios?: Scenario[];
  schools?: School[];
  countries?: Country[];
  experiences?: Experience[];
  faqs?: SegmentFAQ[];
};

export function buildSegmentJsonLdBundle(input: SegmentJsonLdBundleInput): Record<string, unknown>[] {
  const { seg, url, pageName, pageDescription, breadcrumb, scenarios, schools, countries, experiences, faqs } = input;

  const bundle: Record<string, unknown>[] = [];

  bundle.push(generateBreadcrumbJsonLd(breadcrumb));

  const schoolItemList = schools && schools.length > 0
    ? generateItemListJsonLd({
        name: `${seg.label}でおすすめの語学・専門学校`,
        description: `${seg.label}に該当する学校のリスト`,
        items: schools.map((s) => ({
          name: s.name,
          url: `/schools/${s.id}`,
        })),
      })
    : undefined;

  bundle.push(
    generateCollectionPageJsonLd({
      name: pageName,
      description: pageDescription,
      url,
      itemListJsonLd: schoolItemList,
    })
  );

  if (scenarios && scenarios.length > 0) {
    bundle.push(
      generateItemListJsonLd({
        name: `${seg.label}の主要シナリオ`,
        items: scenarios.map((sc) => ({
          name: sc.label,
          url: `${url}#scenario-${sc.key}`,
        })),
      })
    );
  }

  if (schools) {
    for (const school of schools.slice(0, 10)) {
      const courseLabels = school.courseTypes && school.courseTypes.length > 0
        ? school.courseTypes.map(translateCourseType).join('・')
        : '一般英語コース';
      bundle.push(
        generateCourseJsonLd({
          schoolName: school.name,
          courseName: courseLabels,
          description: school.description?.slice(0, 200),
          url: school.website,
          weeklyFeeLow: school.weeklyFeeLow,
          weeklyFeeHigh: school.weeklyFeeHigh,
        })
      );
    }
  }

  if (countries) {
    for (const country of countries.slice(0, 5)) {
      bundle.push(
        generateCostServiceJsonLd({
          countryName: country.nameEn,
          livingCostMonthJpy: country.livingCostMonthJpy,
          visaCostJpy: country.visaCostJpy,
        })
      );
      if (country.popularCities && country.popularCities.length > 0) {
        for (const pc of country.popularCities.slice(0, 2)) {
          bundle.push(
            generatePlaceJsonLd({
              name: pc.cityName,
              countryName: country.nameEn,
              description: pc.cityDescription,
            })
          );
        }
      }
    }
  }

  if (experiences && experiences.length > 0) {
    const valid = experiences.filter((e) => e.ratingOverall != null);
    if (valid.length > 0) {
      const avg = valid.reduce((sum, e) => sum + (e.ratingOverall ?? 0), 0) / valid.length;
      bundle.push(
        generateAggregateRatingJsonLd({
          itemName: pageName,
          itemType: 'Place',
          average: Math.round(avg * 10) / 10,
          count: valid.length,
        })
      );
    }
    for (const exp of experiences.slice(0, 3)) {
      bundle.push(generateExperienceReviewJsonLd(exp));
    }
  }

  if (faqs && faqs.length > 0) {
    bundle.push(generateFAQJsonLd(faqs));
  }

  return bundle;
}

function translateCourseType(courseType: string): string {
  const map: Record<string, string> = {
    general: '一般英語',
    business: 'ビジネス英語',
    'exam-prep': '試験対策（IELTS/TOEFL等）',
    conversation: '会話中心',
    intensive: '集中コース',
  };
  return map[courseType] ?? courseType;
}

export { SITE_URL };
