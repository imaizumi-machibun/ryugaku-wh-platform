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
   * 体験談の代替を作るためのフラグではなく、詳細ガイドを主役にして募集導線だけを出す手動承認。
   */
  allowNoVerifiedExperience?: boolean;
};

const WH_COVERAGE = [
  '向いている人', '制度・条件', '申請', '費用', '仕事・賃金・税',
  '住居・都市', '就学', '医療・安全', '渡航後手続', '延長・帰国後',
];

const STUDY_COVERAGE = [
  '留学種別', '入学条件', '出願', 'ビザ・滞在許可', '学費・生活費',
  '学校・都市選び', '住居・保険', '奨学金', '学校生活', '卒業後',
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
    officialSources: [
      { label: 'France-Visas — Young traveller', url: 'https://france-visas.gouv.fr/en/web/france-visas/jeunes-voyageurs', supports: '制度・対象・滞在条件' },
      { label: 'France-Visas — Japan', url: 'https://france-visas.gouv.fr/en/web/france-visas/japon', supports: '日本からの申請・必要書類' },
    ],
  },
  {
    countrySlug: 'taiwan', purpose: 'working-holiday', sourceArticleId: 'wh-taiwan-complete-guide',
    mergedArticleIds: ['wh-taiwan-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    officialSources: [
      { label: '台湾外交部領事事務局 — 日本人向けワーキング・ホリデー査証', url: 'https://www.boca.gov.tw/fp-388-45-eee84-1.html', supports: '査証・申請・滞在条件' },
      { label: '台湾外交部 — 日台ワーキング・ホリデー制度改定', url: 'https://www.mofa.gov.tw/News_Content.aspx?n=99&s=121852&sms=77', supports: '制度改定・取得回数' },
    ],
  },
  {
    countrySlug: 'hungary', purpose: 'working-holiday', sourceArticleId: 'wh-hungary-complete-guide',
    mergedArticleIds: ['wh-hungary-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    officialSources: [
      { label: '在日ハンガリー大使館 — ワーキングホリデー', url: 'https://tokio.mfa.gov.hu/ja/working.holiday.visa', supports: '制度・申請・必要書類' },
      { label: 'Enter Hungary — Working Holiday Scheme', url: 'https://enterhungary.gov.hu/eh/tajekoztato/en/okmanywhs', supports: '滞在許可・入国後手続' },
    ],
  },
  {
    countrySlug: 'argentina', purpose: 'working-holiday', sourceArticleId: 'wh-argentina-complete-guide',
    mergedArticleIds: ['wh-argentina-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    officialSources: [
      { label: '駐日アルゼンチン共和国大使館 — ワーキングホリデービザ', url: 'https://ejapo.cancilleria.gob.ar/ja/node/82490', supports: '対象・必要書類・資金・保険・申請' },
    ],
  },
  {
    countrySlug: 'chile', purpose: 'working-holiday', sourceArticleId: 'wh-chile-complete-guide',
    mergedArticleIds: ['wh-chile-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    officialSources: [
      { label: 'チリ外務省 — 日本とのワーキングホリデー制度', url: 'https://www.consulado.gob.cl/workingholiday/japon', supports: '対象・期間・資金・保険・申請' },
      { label: 'チリ移民局 — 国際協定に基づく一時滞在', url: 'https://serviciomigraciones.cl/residencia-temporal/subcategorias/acuerdos-internacionales/', supports: '申請経路・滞在許可' },
    ],
  },
  {
    countrySlug: 'hong-kong', purpose: 'working-holiday', sourceArticleId: 'wh-hongkong-complete-guide',
    mergedArticleIds: ['wh-hongkong-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    officialSources: [
      { label: 'Hong Kong Immigration Department — Working Holiday Scheme', url: 'https://www.immd.gov.hk/eng/services/visas/working_holiday_scheme.html', supports: '対象・枠・就労・就学・資金・保険' },
      { label: 'GovHK — Apply for Working Holiday Visa', url: 'https://www.gov.hk/en/nonresidents/visarequire/visasentrypermits/applyworkingholiday.htm', supports: '申請方法・必要書類' },
    ],
  },
  {
    countrySlug: 'italy', purpose: 'working-holiday', sourceArticleId: 'wh-italy-complete-guide',
    mergedArticleIds: ['wh-italy-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    officialSources: [
      { label: '駐日イタリア大使館 — 日伊ワーキングホリデー協定の施行', url: 'https://ambtokyo.esteri.it/ja/news/dall_ambasciata/2026/04/entrata-in-vigore-dellaccordo-vacanza-lavoro-tra-italia-e-giappone/', supports: '制度開始・申請案内' },
    ],
  },
  {
    countrySlug: 'latvia', purpose: 'working-holiday', sourceArticleId: 'wh-latvia-complete-guide',
    mergedArticleIds: ['wh-latvia-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    officialSources: [
      { label: '駐日ラトビア共和国大使館 — ワーキングホリデー査証', url: 'https://www2.mfa.gov.lv/jp/japan/ryouji-jouhou/wakinguhoride-sasho', supports: '対象・申請・必要書類・保険' },
      { label: 'Latvijas Vēstnesis — 日本との協定', url: 'https://likumi.lv/ta/id/339447', supports: '制度の法的根拠・条件' },
    ],
  },
  {
    countrySlug: 'lithuania', purpose: 'working-holiday', sourceArticleId: 'wh-lithuania-complete-guide',
    mergedArticleIds: ['wh-lithuania-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    officialSources: [
      { label: '駐日リトアニア共和国大使館 — Visas', url: 'https://jp.mfa.lt/en/travel-and-residence/coming-to-lithuania/visas/134', supports: 'ワーキングホリデー査証・申請窓口' },
      { label: 'Migration Department — Japan Working Holiday service', url: 'https://www.migracija.lt/en/japonija', supports: '対象・申請・必要書類' },
    ],
  },
  {
    countrySlug: 'uruguay', purpose: 'working-holiday', sourceArticleId: 'wh-uruguay-complete-guide',
    mergedArticleIds: ['wh-uruguay-complete-guide'], coverageAreas: WH_COVERAGE,
    allowNoVerifiedExperience: true,
    officialSources: [
      { label: 'ウルグアイ政府 — Working Holiday for foreign citizens', url: 'https://www.gub.uy/tramites/vacaciones-trabajo-working-holiday-vacaciones-trabajo-working-holiday-ciudadanos-extranjeros', supports: '対象・申請・必要書類' },
      { label: 'ウルグアイ外務省 — 日本とのワーキングホリデー協定', url: 'https://www.gub.uy/ministerio-relaciones-exteriores/comunicacion/comunicados/acuerdo-vacaciones-trabajo-entre-uruguay-japon', supports: '制度・協定' },
    ],
  },
  {
    countrySlug: 'united-states', purpose: 'study-abroad', sourceArticleId: 'wh-usa-study-guide',
    mergedArticleIds: ['wh-usa-study-guide'],
    coverageAreas: STUDY_COVERAGE,
    officialSources: [{ label: 'EducationUSA', url: 'https://educationusa.state.gov/', supports: '学校選び・出願・資金計画' }],
  },
  {
    countrySlug: 'canada', purpose: 'study-abroad', sourceArticleId: 'study-canada-complete-guide',
    mergedArticleIds: ['study-canada-complete-guide'],
    coverageAreas: STUDY_COVERAGE,
    officialSources: [
      { label: 'IRCC — Study permit', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html', supports: '就学許可・申請料金' },
      { label: 'IRCC — Designated learning institutions', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html', supports: 'DLI・PGWP対象プログラム' },
      { label: 'IRCC — Work off campus', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html', supports: '在学中の学外就労' },
      { label: 'IRCC — PGWP eligibility', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html', supports: '卒業後就労許可の条件' },
      { label: 'EduCanada — Study costs', url: 'https://www.educanada.ca/programs-programmes/education_cost-cout_education.aspx/articles/student-guide-what-is-the-cost-of-living-in-canada/?lang=eng', supports: '学費・生活費・奨学金' },
    ],
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
