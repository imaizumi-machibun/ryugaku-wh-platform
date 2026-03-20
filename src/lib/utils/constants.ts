import type { Region, CostLevel, CostRange, ArticleCategory, CourseType, SchoolFeature, SchoolLanguage, Accreditation, Facility, AccommodationType, Gender, LanguageLevel, ProgramStatus, GuidePhase, TipType } from '../microcms/types';

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
  { value: 'japanese', label: '日本語' },
  { value: 'thai', label: 'タイ語' },
  { value: 'vietnamese', label: 'ベトナム語' },
  { value: 'dutch', label: 'オランダ語' },
  { value: 'czech', label: 'チェコ語' },
  { value: 'greek', label: 'ギリシャ語' },
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

export const GUIDE_PHASES: {
  value: GuidePhase;
  label: string;
  emoji: string;
  color: string;
  description: string;
}[] = [
  { value: 'info-gathering', label: '情報収集・意思決定', emoji: '🔍', color: 'bg-blue-100 text-blue-800 border-blue-200', description: 'ワーホリの基礎知識と国選びのポイントを学ぼう' },
  { value: 'visa-cost', label: 'ビザ・費用計画', emoji: '💰', color: 'bg-green-100 text-green-800 border-green-200', description: 'ビザ申請から資金計画まで具体的に準備しよう' },
  { value: 'departure-prep', label: '出発準備', emoji: '✈️', color: 'bg-purple-100 text-purple-800 border-purple-200', description: '出発前にやるべき手続き・持ち物を確認しよう' },
  { value: 'arrival', label: '到着・立ち上げ', emoji: '🏠', color: 'bg-orange-100 text-orange-800 border-orange-200', description: '現地到着後すぐにやるべきことをチェック' },
  { value: 'work', label: '仕事', emoji: '💼', color: 'bg-red-100 text-red-800 border-red-200', description: '仕事探しからタックスリターンまで完全網羅' },
  { value: 'housing', label: '住居', emoji: '🏡', color: 'bg-teal-100 text-teal-800 border-teal-200', description: 'シェアハウスの探し方・トラブル回避法を解説' },
  { value: 'language-life', label: '語学・生活', emoji: '📚', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', description: '語学力アップと現地生活を充実させるコツ' },
  { value: 'safety-mental', label: '安全・メンタル', emoji: '🛡️', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', description: '安全対策とメンタルヘルスケアの方法' },
  { value: 'return-career', label: '帰国・キャリア', emoji: '🎯', color: 'bg-pink-100 text-pink-800 border-pink-200', description: '帰国準備からワーホリ経験を活かすキャリア戦略' },
];

export const TIP_STYLES: Record<TipType, { bg: string; border: string; icon: string; label: string }> = {
  tip: { bg: 'bg-blue-50', border: 'border-blue-300', icon: '💡', label: 'ヒント' },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-300', icon: '⚠️', label: '注意' },
  important: { bg: 'bg-red-50', border: 'border-red-300', icon: '❗', label: '重要' },
};

export const SITE_NAME = 'Study Work Hub';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://example.com');
export const PER_PAGE = 12;
