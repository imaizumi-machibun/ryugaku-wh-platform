import type { Country, CountryPurposeGuidePurpose, Experience, School } from '@/lib/microcms/types';
import type { ResolvedCountryPurposeGuide } from '@/lib/microcms/countryPurposeGuides';
import { getPurposeGuideDefinition } from './registry';
import { isVerifiedForPurpose } from '@/lib/experiences/classification';
import { extractFaqFromArticleBody } from '@/lib/utils/article-faq';

export type PublicationGateResult = {
  pass: boolean;
  checks: Record<string, boolean>;
};

const visibleLength = (html: string): number =>
  html.replace(/<[^>]+>/g, '').replace(/&[a-zA-Z#0-9]+;/g, '').replace(/\s/g, '').length;

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
  const checks = {
    registeredOwner: Boolean(definition),
    currentProgramme:
      args.purpose === 'study-abroad' || args.country.programStatus === 'open',
    publishableGuide: args.guide?.status === 'publishable',
    richBody: Boolean(args.guide && visibleLength(args.guide.body) >= 6000),
    verifiedExperience:
      verifiedExperiences.length >= 1 ||
      Boolean(definition?.allowNoVerifiedExperience && definition.experienceAuditNote),
    countrySpecificCoverage: (definition?.coverageAreas.length ?? 0) >= 8,
    officialSources: (args.guide?.sources.length ?? 0) >= 1,
    faq: extractFaqFromArticleBody(args.guide?.body).length >= 3,
    studyInventory:
      args.purpose === 'working-holiday' || (args.schools?.length ?? 0) >= 1,
    redirectsDeclared: (definition?.mergedArticleIds.length ?? 0) >= 1,
  };
  return { pass: Object.values(checks).every(Boolean), checks };
}
