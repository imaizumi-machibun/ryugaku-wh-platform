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
    officialSources: [
      { label: 'EducationUSA', url: 'https://educationusa.state.gov/', supports: '学校選び・出願・資金計画' },
      { label: 'U.S. Department of State — Student Visa', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html', supports: '学生ビザ・申請手順' },
      { label: 'DHS — Study in the States', url: 'https://studyinthestates.dhs.gov/students', supports: 'F-1学生の学校・滞在・就労条件' },
      { label: 'ICE — I-901 SEVIS Fee', url: 'https://www.ice.gov/sevis/i901', supports: 'SEVIS費用と支払い' },
    ],
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
  {
    countrySlug: 'united-kingdom', purpose: 'study-abroad', sourceArticleId: 'study-uk-complete-guide',
    mergedArticleIds: ['study-uk-complete-guide'],
    redirectFromPaths: ['/uk-language-school'],
    coverageAreas: STUDY_COVERAGE,
    officialSources: [
      { label: 'GOV.UK — Student visa', url: 'https://www.gov.uk/student-visa', supports: '学生ビザ・申請・費用・滞在条件' },
      { label: 'GOV.UK — Short-term study visa', url: 'https://www.gov.uk/study-visit-visa', supports: '6〜11か月の英語留学・申請条件' },
      { label: 'GOV.UK — Student visa money', url: 'https://www.gov.uk/student-visa/money', supports: '授業料・生活費の資金要件' },
      { label: 'GOV.UK — Graduate visa', url: 'https://www.gov.uk/graduate-visa', supports: '卒業後の滞在・就労条件' },
    ],
  },
  {
    countrySlug: 'australia', purpose: 'study-abroad', sourceArticleId: 'study-australia-complete-guide',
    mergedArticleIds: ['study-australia-complete-guide'],
    coverageAreas: STUDY_COVERAGE,
    officialSources: [
      { label: 'Australian Department of Home Affairs — Student visa', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500', supports: '学生ビザ・英語・資金・就労条件' },
      { label: 'CRICOS — Course Search', url: 'https://cricos.education.gov.au/Course/CourseSearch.aspx', supports: '留学生を受け入れる学校・コースの登録' },
      { label: 'Study Australia — Plan your studies', url: 'https://www.studyaustralia.gov.au/en/plan-your-studies', supports: '留学種別・学校選び・費用・奨学金' },
      { label: 'Fair Work Ombudsman — International students', url: 'https://www.fairwork.gov.au/tools-and-resources/fact-sheets/rights-and-obligations/international-students', supports: '留学生の就労権利・賃金' },
    ],
  },
  {
    countrySlug: 'new-zealand', purpose: 'study-abroad', sourceArticleId: 'study-new-zealand-complete-guide',
    mergedArticleIds: ['study-new-zealand-complete-guide'],
    redirectFromPaths: ['/nz-language-school'],
    coverageAreas: STUDY_COVERAGE,
    officialSources: [
      { label: 'Immigration New Zealand — Fee Paying Student Visa', url: 'https://www.immigration.govt.nz/visas/fee-paying-student-visa/', supports: '学生ビザ・資金・保険・申請条件' },
      { label: 'Immigration New Zealand — Working on a student visa', url: 'https://www.immigration.govt.nz/study/once-you-have-a-student-visa/working-on-a-student-visa/', supports: '留学生の就労条件' },
      { label: 'NZQA — Education providers', url: 'https://www.nzqa.govt.nz/providers/index.do', supports: '学校・教育機関の登録確認' },
      { label: 'Study with New Zealand — Study options', url: 'https://www.studywithnewzealand.govt.nz/en/study-options/study-options', supports: '留学種別・学校選び' },
    ],
  },
  {
    countrySlug: 'south-korea', purpose: 'study-abroad', sourceArticleId: 'study-korea-complete-guide',
    mergedArticleIds: ['study-korea-complete-guide'],
    redirectFromPaths: ['/korea-study'],
    coverageAreas: STUDY_COVERAGE,
    officialSources: [
      { label: 'Study in Korea — 学生ビザと在留資格', url: 'https://studyinkorea.go.kr/ko/plan/visaAndStay.do', supports: 'D-2・D-4査証と在留手続' },
      { label: 'Study in Korea — 時間制就業', url: 'https://www.studyinkorea.go.kr/ko/life/residenceAndStayInfo.do?tab=part-time-job', supports: '留学生のアルバイト許可・条件' },
      { label: 'Study in Korea — 留学経費', url: 'https://studyinkorea.go.kr/ko/plan/abroadExpenses.do', supports: '学費・教育課程別費用' },
      { label: 'Study in Korea — 学校・課程検索', url: 'https://studyinkorea.go.kr/ko/search_v1.do', supports: '学校・大学・課程選び' },
    ],
  },
  {
    countrySlug: 'france', purpose: 'study-abroad', sourceArticleId: 'study-france-complete-guide',
    mergedArticleIds: ['study-france-complete-guide'],
    coverageAreas: STUDY_COVERAGE,
    officialSources: [
      { label: 'France-Visas — Student', url: 'https://france-visas.gouv.fr/en/etudiant', supports: '学生査証・資金・滞在条件' },
      { label: 'Campus France Japon — Études en France', url: 'https://www.japon.campusfrance.org/fr/qu-est-ce-que-la-procedure-etudes-en-france', supports: '日本からの出願・EEF手続' },
      { label: 'Campus France — Finding a programme', url: 'https://www.campusfrance.org/en/finding-a-university-programme-France', supports: '大学・課程・学位の選び方' },
      { label: 'Campus France — Tuition fees', url: 'https://www.campusfrance.org/en/tuition-fees-France', supports: '公立高等教育の登録料・免除' },
      { label: 'Service-Public — Student work', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2713', supports: '学生資格での就労条件' },
    ],
  },
  {
    countrySlug: 'ireland', purpose: 'study-abroad', sourceArticleId: 'study-ireland-complete-guide',
    mergedArticleIds: ['study-ireland-complete-guide'],
    coverageAreas: STUDY_COVERAGE,
    officialSources: [
      { label: 'Irish Immigration — Planning to study in Ireland', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/planning-to-study-in-ireland/', supports: '留学種別・学生許可・申請準備' },
      { label: 'Irish Immigration — Immigration permission stamps', url: 'https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/', supports: 'Stamp 2・在学中の就労条件' },
      { label: 'TrustEd Ireland — Eligible programmes', url: 'https://www.trustedireland.ie/check-eligible-courses-for-study-visas', supports: '学生査証対象プログラムの確認' },
      { label: 'Education in Ireland — Where can I study?', url: 'https://www.educationinireland.com/en/where-can-i-study-in-ireland', supports: '学校・課程・都市選び' },
    ],
  },
  {
    countrySlug: 'malta', purpose: 'study-abroad', sourceArticleId: 'study-malta-complete-guide',
    mergedArticleIds: ['study-malta-complete-guide'],
    redirectFromPaths: ['/malta-study'],
    coverageAreas: STUDY_COVERAGE,
    officialSources: [
      { label: 'Identità — National long-stay visa', url: 'https://identita.gov.mt/central-visa-unit-national-visa-long-stay-visa/', supports: '長期留学の査証・申請' },
      { label: 'Identità — Student visa employment', url: 'https://identita.gov.mt/central-visa-unit-student-visa-employment/', supports: '学生の就労条件・許可' },
      { label: 'MFHEA — Licensed providers and programmes', url: 'https://mfhea.mt/list-of-licensed-providers-and-accredited-programmes/', supports: '高等教育機関・認定課程の確認' },
      { label: 'ELT Council — Licensed ELT schools', url: 'https://eltcouncil.gov.mt/list-of-licensed-elt-schools-in-malta/', supports: '認可語学学校の確認' },
    ],
  },
  {
    countrySlug: 'philippines', purpose: 'study-abroad', sourceArticleId: 'study-philippines-complete-guide',
    mergedArticleIds: ['study-philippines-complete-guide'],
    coverageAreas: STUDY_COVERAGE,
    officialSources: [
      { label: 'Philippine Bureau of Immigration — Special Study Permit', url: 'https://immigration.gov.ph/services/special-study-permit/', supports: 'SSPの対象・申請・必要書類' },
      { label: 'Philippine Bureau of Immigration — Student visa 9(f)', url: 'https://immigration.gov.ph/student-visa-9f/', supports: '9(f)学生査証・申請条件' },
      { label: 'Philippine Bureau of Immigration — Accredited entities', url: 'https://immigration.gov.ph/resources/accredited-entities/', supports: 'BI認定教育機関の確認' },
      { label: 'CHED — Higher Education Institution Directory', url: 'https://heida.ched.gov.ph/hei-directory', supports: '大学・高等教育機関の確認' },
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
