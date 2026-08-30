import { z } from 'zod';

const emptyToUndefined = (value: unknown) => value === '' || value == null ? undefined : value;
const optionalNumber = (min: number, max: number) =>
  z.preprocess(emptyToUndefined, z.coerce.number().min(min).max(max).optional());
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(emptyToUndefined, z.enum(values).optional());

/**
 * 体験談投稿フォームのバリデーションスキーマ
 */
export const experienceSubmitSchema = z.object({
  title: z.string().min(5, '5文字以上で入力してください').max(100, '100文字以内で入力してください'),
  countryId: z.string().min(1, '国を選択してください'),
  schoolId: z.preprocess(emptyToUndefined, z.string().optional()),
  primaryPurpose: z.enum(['working-holiday', 'study-abroad', 'other']),
  secondaryPurposes: z.array(z.enum(['working-holiday', 'study-abroad', 'other'])).default([]),
  studyType: optionalEnum(['language', 'university', 'graduate', 'vocational', 'coop', 'exchange', 'high-school', 'other']),
  visaOrPermit: z.string().trim().min(1, 'ビザ・許可・プログラム名を入力してください').max(120),
  cityPrimary: z.string().min(1, '都市名を入力してください'),
  durationMonths: optionalNumber(1, 120),
  content: z.string().min(100, '100文字以上で入力してください').max(10000),
  // 費用
  monthlyLivingJpy: optionalNumber(0, 10000000),
  monthlyRentJpy: optionalNumber(0, 10000000),
  monthlyFoodJpy: optionalNumber(0, 10000000),
  monthlyIncomeJpy: optionalNumber(0, 10000000),
  // 評価
  ratingOverall: z.coerce.number().min(1).max(5),
  ratingSafety: optionalNumber(1, 5),
  ratingJob: optionalNumber(1, 5),
  ratingCost: optionalNumber(1, 5),
  ratingLifestyle: optionalNumber(1, 5),
  ratingLanguage: optionalNumber(1, 5),
  // その他
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  advice: z.preprocess(emptyToUndefined, z.string().max(2000).optional()),
  wouldRecommend: z.boolean().optional(),
  ageAtDeparture: optionalNumber(15, 80),
  gender: optionalEnum(['male', 'female', 'other', 'prefer-not-to-say']),
  languageBefore: optionalEnum(['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced']),
  languageAfter: optionalEnum(['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced']),
  // ハニーポット
  _hp: z.string().max(0, 'スパム検知').optional(),
}).superRefine((data, context) => {
  if (data.primaryPurpose === 'study-abroad' && !data.studyType) {
    context.addIssue({ code: 'custom', path: ['studyType'], message: '留学種別を選択してください' });
  }
  if (data.secondaryPurposes.includes(data.primaryPurpose)) {
    context.addIssue({ code: 'custom', path: ['secondaryPurposes'], message: '主目的と同じ副目的は選べません' });
  }
});

export type ExperienceSubmitData = z.infer<typeof experienceSubmitSchema>;

/**
 * 口コミ投稿フォームのバリデーションスキーマ
 */
export const reviewSubmitSchema = z.object({
  schoolId: z.string().min(1, '学校を選択してください'),
  countryId: z.string().min(1, '国を選択してください'),
  nickname: z.string().min(1, 'ニックネームを入力してください').max(50),
  attendedYear: z.coerce.number().min(2000).max(new Date().getFullYear()),
  ratingOverall: z.coerce.number().min(1).max(5),
  ratingTeaching: z.coerce.number().min(1).max(5).optional(),
  ratingFacilities: z.coerce.number().min(1).max(5).optional(),
  ratingLocation: z.coerce.number().min(1).max(5).optional(),
  ratingCostPerf: z.coerce.number().min(1).max(5).optional(),
  title: z.string().min(5, '5文字以上で入力してください').max(100),
  body: z.string().min(50, '50文字以上で入力してください').max(5000),
  pros: z.string().max(1000).optional(),
  cons: z.string().max(1000).optional(),
  // ハニーポット
  _hp: z.string().max(0, 'スパム検知').optional(),
});

export type ReviewSubmitData = z.infer<typeof reviewSubmitSchema>;
