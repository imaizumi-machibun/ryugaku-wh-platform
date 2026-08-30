import type { Article, ArticleCategory } from '@/lib/microcms/types';
import { ARTICLE_CATEGORIES } from '@/lib/utils/constants';

/**
 * 記事のアイキャッチ画像URLを返す。
 *
 * 優先順位:
 *   1. microCMS の heroImage が設定されていればそのURL
 *   2. 記事ごとの固有画像 `/articles/article-{id}.jpg`
 *      （ARTICLE_IMAGE_SLUGS に id が含まれる＝実ファイルが存在する場合のみ）
 *   3. カテゴリ別デフォルト画像 `/articles/{category}.jpg`
 *   4. 未設定・未知カテゴリは `/articles/other.jpg`
 *
 * 固有画像・カテゴリ別デフォルト画像は public/articles/ 配下に配置されている前提。
 * 実行時のファイルシステム参照は行わず、ビルド時点で確定した静的集合
 * ARTICLE_IMAGE_SLUGS で固有画像の有無を判定する。
 */

// constants.ts の ARTICLE_CATEGORIES と整合させた、デフォルト画像が存在するカテゴリ集合
const KNOWN_CATEGORIES = new Set<ArticleCategory>(
  ARTICLE_CATEGORIES.map((c) => c.value)
);

const FALLBACK_CATEGORY: ArticleCategory = 'other';

/**
 * 記事ごとの固有アイキャッチ画像 `/articles/article-{slug}.jpg` が
 * public/articles/ 配下に存在する slug（= article.id）の静的集合。
 *
 * このリストは public/articles/ を実スキャンして生成したスナップショットであり、
 * 実行時にFSを参照しないため、固有画像を追加・削除した場合はここも更新すること。
 */
export const ARTICLE_IMAGE_SLUGS = new Set<string>([
  'wh-30s-men-strategy',
  'wh-30s-women-strategy',
  'wh-argentina-complete-guide',
  'wh-arrival-week1-setup',
  'wh-australia-canada-nz-comparison',
  'wh-australia-complete-guide',
  'wh-australia-pr-routes',
  'wh-australia-second-visa',
  'wh-austria-complete-guide',
  'wh-barista-complete-guide',
  'wh-cafe-english-phrases',
  'wh-canada-complete-guide',
  'wh-canada-iec-tips',
  'wh-cebu-pre-study',
  'wh-cheap-working-holiday',
  'wh-chile-complete-guide',
  'wh-construction-work-guide',
  'wh-country-choice-guide',
  'wh-couple-working-holiday',
  'wh-credit-card-choosing-2026',
  'wh-cultural-manners',
  'wh-culture-shock-homesick',
  'wh-czech-complete-guide',
  'wh-denmark-complete-guide',
  'wh-dental-care-abroad',
  'wh-driving-license-car',
  'wh-eastern-europe-working-holiday',
  'wh-english-not-improving',
  'wh-english-resume-template',
  'wh-esim-comparison',
  'wh-estonia-complete-guide',
  'wh-farm-job-finding-guide',
  'wh-fashion-clothing',
  'wh-festivals-events',
  'wh-finland-complete-guide',
  'wh-france-complete-guide',
  'wh-friendship-network',
  'wh-germany-complete-guide',
  'wh-high-wage-countries',
  'wh-hongkong-complete-guide',
  'wh-hotel-job-guide',
  'wh-hungary-complete-guide',
  'wh-iceland-complete-guide',
  'wh-ireland-complete-guide',
  'wh-israel-complete-guide',
  'wh-italy-complete-guide',
  'wh-japanese-food-shopping',
  'wh-korea-complete-guide',
  'wh-latvia-complete-guide',
  'wh-lithuania-complete-guide',
  'wh-luxembourg-complete-guide',
  'wh-malta-complete-guide',
  'wh-medical-trouble-response',
  'wh-mental-health-care',
  'wh-netherlands-complete-guide',
  'wh-newzealand-complete-guide',
  'wh-no-degree-working-holiday',
  'wh-no-english-jobs-7types',
  'wh-no-school-english-improvement',
  'wh-nordic-working-holiday',
  'wh-norway-complete-guide',
  'wh-online-banking-comparison',
  'wh-overseas-insurance-comparison',
  'wh-overseas-job-after',
  'wh-packing-list-2026-complete',
  'wh-poland-complete-guide',
  'wh-portugal-complete-guide',
  'wh-post-return-career-strategy',
  'wh-pre-departure-documents',
  'wh-pre-departure-english-prep',
  'wh-pre-departure-ng',
  'wh-pre-return-checklist',
  'wh-pre-savings-plan',
  'wh-regret-failures',
  'wh-remote-work-jobs',
  'wh-romance-relationships',
  'wh-saving-300man-strategy',
  'wh-self-cooking-recipes',
  'wh-sharehouse-essentials',
  'wh-sharehouse-finding-guide',
  'wh-sharehouse-troubles',
  'wh-slovakia-complete-guide',
  'wh-south-america-working-holiday',
  'wh-spain-complete-guide',
  'wh-sweden-complete-guide',
  'wh-taiwan-complete-guide',
  'wh-tax-filing-guide',
  'wh-theft-prevention',
  'wh-toeic-ielts-prep-2026',
  'wh-travel-during-wh',
  'wh-twice-countries',
  'wh-uk-complete-guide',
  'wh-uk-yms-tips',
  'wh-university-student-guide',
  'wh-uruguay-complete-guide',
  'wh-usa-study-guide',
  'wh-vaccination-prep',
  'wh-vs-studyabroad-guide',
  'wh-women-safety-manual',
  'wh-working-adult-guide',
]);

/**
 * カテゴリからデフォルト画像パスを返す（heroImage を考慮しない素のフォールバック）。
 */
export function getCategoryImage(category?: ArticleCategory | string): string {
  if (category && KNOWN_CATEGORIES.has(category as ArticleCategory)) {
    return `/articles/${category}.jpg`;
  }
  return `/articles/${FALLBACK_CATEGORY}.jpg`;
}

/**
 * 記事のアイキャッチ画像URLを返す。
 * 優先順: heroImage → 記事固有画像（存在時）→ カテゴリ別 → other。
 */
export function getArticleImage(
  article: Pick<Article, 'id' | 'heroImage' | 'category'>
): string {
  if (article.heroImage?.url) {
    return article.heroImage.url;
  }
  if (article.id && ARTICLE_IMAGE_SLUGS.has(article.id)) {
    return `/articles/article-${article.id}.jpg`;
  }
  return getCategoryImage(article.category);
}

/**
 * 画像が microCMS のリモート画像（next/image の最適化対象でドメイン許可が必要）か、
 * ローカルの public 配下画像かを判定するヘルパー。
 */
export function isRemoteArticleImage(
  article: Pick<Article, 'heroImage' | 'category'>
): boolean {
  return Boolean(article.heroImage?.url);
}
