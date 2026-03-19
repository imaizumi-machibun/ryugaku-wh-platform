import type { Region, CostLevel, CostRange, ArticleCategory, CourseType, SchoolFeature, SchoolLanguage, Accreditation, Facility, AccommodationType, Gender, LanguageLevel, ProgramStatus } from '../microcms/types';

export const REGIONS: { value: Region; label: string }[] = [
  { value: 'オセアニア', label: 'オセアニア' },
  { value: 'ヨーロッパ', label: 'ヨーロッパ' },
  { value: '北米', label: '北米' },
  { value: 'アジア', label: 'アジア' },
  { value: '南米', label: '南米' },
  { value: '中東', label: '中東' },
];

export const COST_LEVELS: { value: CostLevel; label: string }[] = [
  { value: 'low', label: '費用低め' },
  { value: 'medium', label: '費用普通' },
  { value: 'high', label: '費用高め' },
  { value: 'very-high', label: '費用かなり高め' },
];

export const COST_RANGES: { value: CostRange; label: string }[] = [
  { value: 'budget', label: 'リーズナブル' },
  { value: 'standard', label: 'スタンダード' },
  { value: 'premium', label: 'プレミアム' },
];

export const PROGRAM_STATUSES: { value: ProgramStatus; label: string; color: string }[] = [
  { value: 'open', label: '受付中', color: 'bg-green-100 text-green-800' },
  { value: 'limited', label: '制限あり', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'suspended', label: '一時停止', color: 'bg-orange-100 text-orange-800' },
  { value: 'closed', label: '停止中', color: 'bg-red-100 text-red-800' },
];

export const ARTICLE_CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: 'visa', label: 'ビザ' },
  { value: 'cost', label: '費用' },
  { value: 'preparation', label: '準備' },
  { value: 'job', label: '仕事' },
  { value: 'language', label: '語学' },
  { value: 'insurance', label: '保険' },
  { value: 'housing', label: '住居' },
  { value: 'culture', label: '文化' },
  { value: 'other', label: 'その他' },
];

export const COURSE_TYPES: { value: CourseType; label: string }[] = [
  { value: 'general', label: '一般英語' },
  { value: 'business', label: 'ビジネス' },
  { value: 'exam-prep', label: '試験対策' },
  { value: 'conversation', label: '会話' },
  { value: 'intensive', label: '集中コース' },
];

export const SCHOOL_FEATURES: { value: SchoolFeature; label: string }[] = [
  { value: 'small-class', label: '少人数制' },
  { value: 'online-support', label: 'オンラインサポート' },
  { value: 'japanese-staff', label: '日本人スタッフ' },
  { value: 'certificate', label: '資格取得' },
  { value: 'activities', label: 'アクティビティ' },
  { value: 'accommodation', label: '宿泊手配' },
];

export const SCHOOL_LANGUAGES: { value: SchoolLanguage; label: string }[] = [
  { value: 'english', label: '英語' },
  { value: 'french', label: 'フランス語' },
  { value: 'spanish', label: 'スペイン語' },
  { value: 'german', label: 'ドイツ語' },
  { value: 'korean', label: '韓国語' },
  { value: 'chinese', label: '中国語' },
  { value: 'italian', label: 'イタリア語' },
  { value: 'portuguese', label: 'ポルトガル語' },
  { value: 'arabic', label: 'アラビア語' },
];

export const ACCREDITATIONS: { value: Accreditation; label: string }[] = [
  { value: 'british-council', label: 'British Council' },
  { value: 'cambridge-english', label: 'Cambridge English' },
  { value: 'ialc', label: 'IALC' },
  { value: 'eaquals', label: 'Eaquals' },
  { value: 'neas', label: 'NEAS' },
  { value: 'languages-canada', label: 'Languages Canada' },
  { value: 'celta', label: 'CELTA' },
  { value: 'acels', label: 'ACELS' },
  { value: 'nzqa', label: 'NZQA' },
  { value: 'other', label: 'その他' },
];

export const FACILITIES: { value: Facility; label: string }[] = [
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'study-room', label: '自習室' },
  { value: 'cafe', label: 'カフェ' },
  { value: 'library', label: '図書室' },
  { value: 'computer-lab', label: 'PC室' },
  { value: 'lounge', label: 'ラウンジ' },
  { value: 'kitchen', label: 'キッチン' },
  { value: 'garden', label: '庭園' },
  { value: 'gym', label: 'ジム' },
  { value: 'prayer-room', label: '祈祷室' },
];

export const ACCOMMODATION_TYPES: { value: AccommodationType; label: string }[] = [
  { value: 'homestay', label: 'ホームステイ' },
  { value: 'student-residence', label: '学生寮' },
  { value: 'shared-apartment', label: 'シェアアパート' },
  { value: 'studio', label: 'スタジオ' },
  { value: 'hotel', label: 'ホテル' },
  { value: 'hostel', label: 'ホステル' },
];

export const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' },
  { value: 'prefer-not-to-say', label: '回答しない' },
];

export const LANGUAGE_LEVELS: { value: LanguageLevel; label: string }[] = [
  { value: 'beginner', label: '初心者' },
  { value: 'elementary', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'upper-intermediate', label: '中上級' },
  { value: 'advanced', label: '上級' },
];

export const RATING_LABELS = {
  ratingOverall: '総合',
  ratingSafety: '治安',
  ratingJob: '仕事',
  ratingCost: 'コスパ',
  ratingLifestyle: '充実度',
  ratingLanguage: '語学上達',
  ratingTeaching: '授業の質',
  ratingFacilities: '施設',
  ratingLocation: '立地',
  ratingCostPerf: 'コスパ',
} as const;

export const SITE_NAME = 'Stufy Work Hub';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
export const PER_PAGE = 12;
