import type { Country, CountryPurposeGuidePurpose, Experience, School } from '@/lib/microcms/types';
import type { ResolvedCountryPurposeGuide } from '@/lib/microcms/countryPurposeGuides';
import { getPurposeGuideDefinition } from './registry';
import { isVerifiedForPurpose } from '@/lib/experiences/classification';
import { extractFaqFromArticleBody } from '@/lib/utils/article-faq';

export type PublicationGateResult = {
  pass: boolean;
  checks: Record<string, boolean>;
  advisories: Record<string, boolean>;
};

const visibleLength = (html: string): number =>
  html.replace(/<[^>]+>/g, '').replace(/&[a-zA-Z#0-9]+;/g, '').replace(/\s/g, '').length;

const STUDY_BODY_AREAS: readonly (readonly string[])[] = [
  ['留学種別', '語学留学', '大学留学', '大学院', '専門留学', '交換留学'],
  ['入学条件', '出願', '入学要件', '語学要件'],
  ['ビザ', '学生ビザ', '就学許可', '滞在許可'],
  ['学費', '授業料', '生活費', '費用'],
  ['学校選び', '学校', '大学', 'カレッジ'],
  ['都市選び', '都市', '地域'],
  ['住居', '学生寮', 'ホームステイ', '保険'],
  ['奨学金', '資金計画', '予算'],
  ['授業', '学生生活', '学生支援'],
  ['卒業後', '進路', '卒業後就労'],
];

function studyCoverageCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  return STUDY_BODY_AREAS.filter((keywords) => keywords.some((keyword) => text.includes(keyword))).length;
}

function isFreshReview(guide: ResolvedCountryPurposeGuide | null): boolean {
  if (!guide) return false;
  const checkedAt = Date.parse(guide.checkedAt);
  if (!Number.isFinite(checkedAt)) return false;
  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  if (checkedAt < oneYearAgo) return false;
  if (guide.nextCheckAt) {
    const nextCheckAt = Date.parse(guide.nextCheckAt);
    if (!Number.isFinite(nextCheckAt) || nextCheckAt < Date.now()) return false;
  }
  return true;
}

export function evaluateCountryPurposeGate(args: {
  country: Country;
  purpose: CountryPurposeGuidePurpose;
  guide: ResolvedCountryPurposeGuide | null;
  experiences: Experience[];
  schools?: School[];
}): PublicationGateResult {
  const definition = getPurposeGuideDefinition(args.country.id, args.purpose);
  const verifiedExperiences = args.experiences.filter((experience) =>
    isVerifiedForPurpose(experience, args.purpose)
  );
  const minimumSourceCount = args.purpose === 'study-abroad' ? 3 : 1;
  const checks = {
    registeredOwner: Boolean(definition),
    currentProgramme:
      args.purpose === 'study-abroad' || args.country.programStatus === 'open',
    publishableGuide: args.guide?.status === 'publishable',
    richBody: Boolean(args.guide && visibleLength(args.guide.body) >= 6000),
    experienceRequirement:
      args.purpose === 'study-abroad' ||
      verifiedExperiences.length >= 1 ||
      Boolean(definition?.allowNoVerifiedExperience),
    countrySpecificCoverage:
      args.purpose === 'study-abroad'
        ? Boolean(args.guide && studyCoverageCount(args.guide.body) >= 8)
        : (definition?.coverageAreas.length ?? 0) >= 8,
    officialSources: (args.guide?.sources.length ?? 0) >= minimumSourceCount,
    freshReview: isFreshReview(args.guide),
    faq: extractFaqFromArticleBody(args.guide?.body).length >= 3,
    redirectsDeclared: (definition?.mergedArticleIds.length ?? 0) >= 1,
  };
  const advisories = {
    verifiedExperienceAvailable: verifiedExperiences.length >= 1,
    schoolInventoryAvailable: args.purpose === 'working-holiday' || (args.schools?.length ?? 0) >= 1,
  };
  return { pass: Object.values(checks).every(Boolean), checks, advisories };
}
