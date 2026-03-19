import { z } from 'zod';

/**
 * 体験談投稿フォームのバリデーションスキーマ
 */
export const experienceSubmitSchema = z.object({
  title: z.string().min(5, '5文字以上で入力してください').max(100, '100文字以内で入力してください'),
  countryId: z.string().min(1, '国を選択してください'),
  schoolId: z.string().optional(),
  cityPrimary: z.string().min(1, '都市名を入力してください'),
  durationMonths: z.coerce.number().min(1).max(120).optional(),
  content: z.string().min(100, '100文字以上で入力してください').max(10000),
  // 費用
  monthlyLivingJpy: z.coerce.number().min(0).optional(),
  monthlyRentJpy: z.coerce.number().min(0).optional(),
  monthlyFoodJpy: z.coerce.number().min(0).optional(),
  monthlyIncomeJpy: z.coerce.number().min(0).optional(),
  // 評価
  ratingOverall: z.coerce.number().min(1).max(5),
  ratingSafety: z.coerce.number().min(1).max(5).optional(),
  ratingJob: z.coerce.number().min(1).max(5).optional(),
  ratingCost: z.coerce.number().min(1).max(5).optional(),
  ratingLifestyle: z.coerce.number().min(1).max(5).optional(),
  ratingLanguage: z.coerce.number().min(1).max(5).optional(),
  // その他
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  advice: z.string().max(2000).optional(),
  wouldRecommend: z.boolean().optional(),
  ageAtDeparture: z.coerce.number().min(15).max(80).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  languageBefore: z.enum(['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced']).optional(),
  languageAfter: z.enum(['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced']).optional(),
  // ハニーポット
  _hp: z.string().max(0, 'スパム検知').optional(),
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
