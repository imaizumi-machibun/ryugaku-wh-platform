import type { MicroCMSImage, MicroCMSDate, MicroCMSContentId } from 'microcms-js-sdk';

// ============================================================
// Base types
// ============================================================
type MicroCMSBase = MicroCMSContentId & MicroCMSDate;

// ============================================================
// API 1: countries — 国マスターデータ
// ============================================================
export type Region = 'オセアニア' | 'ヨーロッパ' | '北米' | 'アジア' | '南米' | '中東';
export type ProgramStatus = 'open' | 'suspended' | 'limited' | 'closed';
export type CostLevel = 'low' | 'medium' | 'high' | 'very-high';

export type ApplicationStep = {
  fieldId: 'applicationStep';
  stepTitle: string;
  stepDescription?: string;
};

export type RequiredDocument = {
  fieldId: 'requiredDocument';
  docName: string;
  docNote?: string;
};

export type PopularCity = {
  fieldId: 'popularCity';
  cityName: string;
  cityDescription?: string;
};

export type SourceUrl = {
  fieldId: 'sourceUrl';
  label: string;
  url: string;
};

export type Country = MicroCMSBase & {
  nameJp: string;
  nameEn: string;
  flagEmoji?: string;
  region: Region;
  heroImage?: MicroCMSImage;
  description?: string;
  capital?: string;
  officialLanguage?: string;
  currency?: string;
  currencyCode?: string;
  timeDifferenceJapan?: string;
  flightTimeHours?: number;
  bestSeason?: string;
  programStatus: ProgramStatus;
  // ビザ情報
  visaAgeMin?: number;
  visaAgeMax?: number;
  visaDurationMonths?: number;
  visaCostJpy?: number;
  visaWorkLimit?: string;
  visaStudyLimit?: string;
  visaRenewable?: boolean;
  visaQuota?: string;
  // 費用情報
  livingCostMonthJpy?: number;
  avgRentMonthlyJpy?: number;
  minimumWageLocal?: string;
  costLevel?: CostLevel;
  // 申請情報
  applicationSteps?: ApplicationStep[];
  requiredDocuments?: RequiredDocument[];
  applicationUrl?: string;
  embassyUrl?: string;
  // 実用情報
  popularCities?: PopularCity[];
  sourceUrls?: SourceUrl[];
};

// ============================================================
// API 2: schools — 学校情報
// ============================================================
export type CourseType = 'general' | 'business' | 'exam-prep' | 'conversation' | 'intensive';
export type CostRange = 'budget' | 'standard' | 'premium';
export type SchoolFeature =
  | 'small-class'
  | 'online-support'
  | 'japanese-staff'
  | 'certificate'
  | 'activities'
  | 'accommodation';
export type SchoolLanguage = 'english' | 'french' | 'spanish' | 'german' | 'korean' | 'chinese' | 'italian' | 'portuguese' | 'arabic';
export type Accreditation = 'british-council' | 'cambridge-english' | 'ialc' | 'eaquals' | 'neas' | 'languages-canada' | 'celta' | 'acels' | 'nzqa' | 'other';
export type Facility = 'wifi' | 'study-room' | 'cafe' | 'library' | 'computer-lab' | 'lounge' | 'kitchen' | 'garden' | 'gym' | 'prayer-room';
export type AccommodationType = 'homestay' | 'student-residence' | 'shared-apartment' | 'studio' | 'hotel' | 'hostel';

export type School = MicroCMSBase & {
  name: string;
  country: Country;
  city: string;
  description?: string;
  heroImage?: MicroCMSImage;
  gallery?: MicroCMSImage[];
  courseTypes?: CourseType[];
  costRange?: CostRange;
  weeklyFeeLow?: number;
  weeklyFeeHigh?: number;
  features?: SchoolFeature[];
  website?: string;
  address?: string;
  isFeatured?: boolean;
  // 基本情報
  foundedYear?: number;
  totalStudents?: number;
  averageClassSize?: number;
  japaneseRatio?: number;
  nationalityCount?: number;
  minimumAge?: number;
  classroomCount?: number;
  // 連絡先
  email?: string;
  phone?: string;
  nearestStation?: string;
  latitude?: number;
  longitude?: number;
  // 学習環境
  languages?: SchoolLanguage[];
  accreditations?: Accreditation[];
  facilities?: Facility[];
  accommodationTypes?: AccommodationType[];
  airportPickup?: boolean;
  minimumWeeks?: number;
};

// ============================================================
// API 3: experiences — 体験談（UGC）
// ============================================================
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';
export type LanguageLevel = 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced';

export type ProConItem = {
  fieldId: 'proConItem';
  text: string;
};

export type Experience = MicroCMSBase & {
  title: string;
  country: Country;
  school?: School;
  cityPrimary: string;
  durationMonths?: number;
  content: string;
  // 費用内訳
  monthlyLivingJpy?: number;
  monthlyRentJpy?: number;
  monthlyFoodJpy?: number;
  monthlyIncomeJpy?: number;
  // 6軸評価
  ratingOverall: number;
  ratingSafety?: number;
  ratingJob?: number;
  ratingCost?: number;
  ratingLifestyle?: number;
  ratingLanguage?: number;
  // その他
  pros?: ProConItem[];
  cons?: ProConItem[];
  advice?: string;
  wouldRecommend?: boolean;
  ageAtDeparture?: number;
  gender?: Gender;
  languageBefore?: LanguageLevel;
  languageAfter?: LanguageLevel;
};

// ============================================================
// API 4: reviews — 学校口コミ（UGC）
// ============================================================
export type Review = MicroCMSBase & {
  school: School;
  country?: Country;
  nickname: string;
  attendedYear: number;
  ratingOverall: number;
  ratingTeaching?: number;
  ratingFacilities?: number;
  ratingLocation?: number;
  ratingCostPerf?: number;
  title: string;
  body: string;
  pros?: string;
  cons?: string;
};

// ============================================================
// API 5: articles — お役立ち記事 & ワーホリ完全ガイド（統合）
// ============================================================
export type ArticleCategory =
  | 'visa'
  | 'cost'
  | 'preparation'
  | 'job'
  | 'language'
  | 'insurance'
  | 'housing'
  | 'culture'
  | 'other';

export type GuidePhase =
  | 'info-gathering'
  | 'visa-cost'
  | 'departure-prep'
  | 'arrival'
  | 'work'
  | 'housing'
  | 'language-life'
  | 'safety-mental'
  | 'return-career';

export type KeyPoint = {
  fieldId: 'keyPoint';
  text: string;
};

export type ChecklistItem = {
  fieldId: 'checklistItem';
  text: string;
  note?: string;
};

export type TipType = 'tip' | 'warning' | 'important';

export type TipItem = {
  fieldId: 'tipItem';
  type: TipType;
  text: string;
};

export type Article = MicroCMSBase & {
  title: string;
  description?: string;
  heroImage?: MicroCMSImage;
  body: string;
  category?: ArticleCategory;
  relatedCountries?: Country[];
  relatedSchools?: School[];
  isFeatured?: boolean;
  // ガイド用フィールド（ガイド記事のみ使用）
  phase?: GuidePhase;
  orderInPhase?: number;
  estimatedMinutes?: number;
  keyPoints?: KeyPoint[];
  checklist?: ChecklistItem[];
  tips?: TipItem[];
};

// Guide は Article の派生型（phase, orderInPhase が必須）
export type Guide = Omit<Article, 'phase' | 'orderInPhase'> & {
  phase: GuidePhase;
  orderInPhase: number;
};

// ============================================================
// API Response types
// ============================================================
export type MicroCMSListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type MicroCMSQueries = {
  draftKey?: string;
  limit?: number;
  offset?: number;
  orders?: string;
  fields?: string[];
  q?: string;
  filters?: string;
  depth?: 1 | 2 | 3;
};
