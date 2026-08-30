import type { CountryPurposeGuidePurpose } from '@/lib/microcms/types';

export type PurposeGuideDefinition = {
  countrySlug: string;
  purpose: CountryPurposeGuidePurpose;
  sourceArticleId: string;
  mergedArticleIds: string[];
  redirectFromPaths?: string[];
  coverageAreas: string[];
  officialSources: { label: string; url: string; supports: string }[];
  /**
   * 体験談が0件でも、一次情報と十分な国固有本文がそろう場合に限り公開を許可する。
   * 体験談の代替を作るためのフラグではなく、0件を透明に表示して募集するための手動承認。
   */
  allowNoVerifiedExperience?: boolean;
  experienceAuditNote?: string;
};

const WH_COVERAGE = [
  '向いている人', '制度・条件', '申請', '費用', '仕事・賃金・税',
  '住居・都市', '就学', '医療・安全', '渡航後手続', '延長・帰国後',
];

export const COUNTRY_PURPOSE_GUIDES: PurposeGuideDefinition[] = [
  {
    countrySlug: 'australia', purpose: 'working-holiday', sourceArticleId: 'wh-australia-complete-guide',
    mergedArticleIds: ['wh-australia-complete-guide', 'wh-australia-experiences'], coverageAreas: WH_COVERAGE,
    officialSources: [{ label: 'Australian Department of Home Affairs', url: 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/overview', supports: '制度・対象・就労条件' }],
  },
  {
    countrySlug: 'canada', purpose: 'working-holiday', sourceArticleId: 'wh-canada-complete-guide',
    mergedArticleIds: ['wh-canada-complete-guide'], coverageAreas: WH_COVERAGE,
    officialSources: [{ label: 'IRCC — IEC eligibility', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/eligibility.html', supports: '制度・対象・参加条件' }],
  },
  {
    countrySlug: 'united-kingdom', purpose: 'working-holiday', sourceArticleId: 'wh-uk-complete-guide',
    mergedArticleIds: ['wh-uk-complete-guide'], coverageAreas: WH_COVERAGE,
    officialSources: [{ label: 'GOV.UK — Youth Mobility Scheme visa', url: 'https://www.gov.uk/youth-mobility', supports: '制度・対象・申請' }],
  },
  {
    countrySlug: 'ireland', purpose: 'working-holiday', sourceArticleId: 'wh-ireland-complete-guide',
    mergedArticleIds: ['wh-ireland-complete-guide', 'wh-ireland-experiences'], redirectFromPaths: ['/ireland-wh'], coverageAreas: WH_COVERAGE,
    officialSources: [{ label: 'Embassy of Ireland in Japan', url: 'https://www.ireland.ie/en/japan/tokyo/services/visas/working-holiday-programme/', supports: '制度・申請条件' }],
  },
  {
    countrySlug: 'germany', purpose: 'working-holiday', sourceArticleId: 'wh-germany-complete-guide',
    mergedArticleIds: ['wh-germany-complete-guide', 'wh-germany-experiences'], redirectFromPaths: ['/germany-wh'], coverageAreas: WH_COVERAGE,
    officialSources: [{ label: 'ドイツ連邦共和国大使館 — ワーキングホリデー', url: 'https://japan.diplo.de/ja-ja/service/wh-957786', supports: '制度・申請条件' }],
  },
  {
    countrySlug: 'new-zealand', purpose: 'working-holiday', sourceArticleId: 'wh-newzealand-complete-guide',
    mergedArticleIds: ['wh-newzealand-complete-guide'], coverageAreas: WH_COVERAGE,
    officialSources: [{ label: 'Immigration New Zealand — Japan Working Holiday Visa', url: 'https://www.immigration.govt.nz/visas/japan-working-holiday-visa/', supports: '制度・対象・申請条件' }],
  },
  {
    countrySlug: 'south-korea', purpose: 'working-holiday', sourceArticleId: 'wh-korea-complete-guide',
    mergedArticleIds: ['wh-korea-complete-guide'], coverageAreas: WH_COVERAGE,
    officialSources: [{ label: '駐日本国大韓民国大使館', url: 'https://overseas.mofa.go.kr/jp-ja/index.do', supports: '査証・公館別案内' }],
  },
  {
    countrySlug: 'france', purpose: 'working-holiday', sourceArticleId: 'wh-france-complete-guide',
    mergedArticleIds: ['wh-france-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    experienceAuditNote: '公開体験談94件を本人記述で確認しましたが、フランスのワーホリを明記した体験談は0件でした。英国・アイルランドのワーホリ中にフランスへ旅行した記録は、フランスのワーホリ体験として集計していません。',
    officialSources: [
      { label: 'France-Visas — Young traveller', url: 'https://france-visas.gouv.fr/en/web/france-visas/jeunes-voyageurs', supports: '制度・対象・滞在条件' },
      { label: 'France-Visas — Japan', url: 'https://france-visas.gouv.fr/en/web/france-visas/japon', supports: '日本からの申請・必要書類' },
    ],
  },
  {
    countrySlug: 'taiwan', purpose: 'working-holiday', sourceArticleId: 'wh-taiwan-complete-guide',
    mergedArticleIds: ['wh-taiwan-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    experienceAuditNote: '公開体験談94件を本人記述で確認しましたが、台湾のワーホリを明記した体験談は0件でした。国名・年齢・滞在期間だけからビザや渡航目的を推測せず、確認できた体験談だけを今後追加します。',
    officialSources: [
      { label: '台湾外交部領事事務局 — 日本人向けワーキング・ホリデー査証', url: 'https://www.boca.gov.tw/fp-388-45-eee84-1.html', supports: '査証・申請・滞在条件' },
      { label: '台湾外交部 — 日台ワーキング・ホリデー制度改定', url: 'https://www.mofa.gov.tw/News_Content.aspx?n=99&s=121852&sms=77', supports: '制度改定・取得回数' },
    ],
  },
  {
    countrySlug: 'hungary', purpose: 'working-holiday', sourceArticleId: 'wh-hungary-complete-guide',
    mergedArticleIds: ['wh-hungary-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    experienceAuditNote: '公開体験談94件を国名と本人の記述で確認しましたが、ハンガリー滞在を確認できる投稿は0件でした。別国の費用や仕事探しをハンガリーの相場へ置き換えず、確認できる体験談が届くまで集計対象なしとします。',
    officialSources: [
      { label: '在日ハンガリー大使館 — ワーキングホリデー', url: 'https://tokio.mfa.gov.hu/ja/working.holiday.visa', supports: '制度・申請・必要書類' },
      { label: 'Enter Hungary — Working Holiday Scheme', url: 'https://enterhungary.gov.hu/eh/tajekoztato/en/okmanywhs', supports: '滞在許可・入国後手続' },
    ],
  },
  {
    countrySlug: 'united-states', purpose: 'study-abroad', sourceArticleId: 'wh-usa-study-guide',
    mergedArticleIds: ['wh-usa-study-guide'],
    coverageAreas: ['留学種別', '入学条件', '出願', 'ビザ', '学費', '生活費・住居', '学校・都市選び', '奨学金', '学校生活', '卒業後'],
    officialSources: [{ label: 'EducationUSA', url: 'https://educationusa.state.gov/', supports: '学校選び・出願・資金計画' }],
  },
];

export function getPurposeGuideDefinition(
  countrySlug: string,
  purpose: CountryPurposeGuidePurpose
): PurposeGuideDefinition | undefined {
  return COUNTRY_PURPOSE_GUIDES.find(
    (guide) => guide.countrySlug === countrySlug && guide.purpose === purpose
  );
}

export function getPublishedPurposePaths(): string[] {
  return COUNTRY_PURPOSE_GUIDES.map(
    ({ countrySlug, purpose }) => `/countries/${countrySlug}/${purpose}`
  );
}

export const REDIRECTED_ARTICLE_SLUGS = new Set(
  COUNTRY_PURPOSE_GUIDES.flatMap((guide) => guide.mergedArticleIds)
);

export const ARTICLE_PURPOSE_REDIRECTS = Object.fromEntries(
  COUNTRY_PURPOSE_GUIDES.flatMap((guide) =>
    guide.mergedArticleIds.map((articleId) => [
      `/articles/${articleId}`,
      `/countries/${guide.countrySlug}/${guide.purpose}`,
    ])
  )
) as Readonly<Record<string, string>>;

export const STATIC_PURPOSE_REDIRECTS = Object.fromEntries(
  COUNTRY_PURPOSE_GUIDES.flatMap((guide) =>
    (guide.redirectFromPaths ?? []).map((sourcePath) => [
      sourcePath,
      `/countries/${guide.countrySlug}/${guide.purpose}`,
    ])
  )
) as Readonly<Record<string, string>>;

export const REDIRECTED_STATIC_PATHS = new Set(Object.keys(STATIC_PURPOSE_REDIRECTS));

export function resolveLegacyPurposePath(
  countrySlug: string,
  oldPurpose: string
): string | null {
  if (oldPurpose === 'working-holiday' && getPurposeGuideDefinition(countrySlug, 'working-holiday')) {
    return `/countries/${countrySlug}/working-holiday`;
  }
  if (
    ['language', 'university', 'parent-child'].includes(oldPurpose) &&
    getPurposeGuideDefinition(countrySlug, 'study-abroad')
  ) {
    return `/countries/${countrySlug}/study-abroad`;
  }
  return null;
}

export function findRedirectTarget(pathname: string): string | null {
  return ARTICLE_PURPOSE_REDIRECTS[pathname] ?? STATIC_PURPOSE_REDIRECTS[pathname] ?? null;
}
