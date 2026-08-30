// ============================================================
// 予約公開システム
// 各ページに公開日時を設定し、未公開日のページは404を返す
// ============================================================

/**
 * 各URLの公開日時（ISO 8601、日本時間想定）
 * 未登録のURLは「即公開」扱い（既存ページの後方互換のため）
 *
 * 追加時のルール：
 * - 1日2本ペースで分散
 * - 時間はランダム（9:00〜21:00の範囲内）
 * - 過去日は「公開済み」、未来日は「予約公開」
 */
export const PUBLISH_DATES: Record<string, string> = {
  // 2026-05-29 公開
  '/passport-lost-overseas': '2026-05-29T09:00:00+09:00',
  '/language-school-ranking': '2026-05-29T19:00:00+09:00',
  // 2026-05-30 公開
  '/english-resume-guide': '2026-05-30T10:00:00+09:00',
  '/cebu-study-real-cost': '2026-05-30T20:00:00+09:00',
  // 2026-05-31 公開
  '/sydney-sharehouse': '2026-05-31T09:30:00+09:00',
  '/uk-yms-visa-guide': '2026-05-31T19:30:00+09:00',
  // 2026-06-01 公開
  '/melbourne-barista': '2026-06-01T09:00:00+09:00',
  '/vancouver-language-school': '2026-06-01T19:00:00+09:00',
  // 2026-06-02 公開
  '/canada-sim-card': '2026-06-02T10:00:00+09:00',
  '/toronto-vs-vancouver': '2026-06-02T20:00:00+09:00',
  // 2026-06-03 公開
  '/pre-departure-checklist': '2026-06-03T09:00:00+09:00',
  '/australia-tfn-guide': '2026-06-03T19:30:00+09:00',
  // 2026-06-04 公開
  '/overseas-hospital-guide': '2026-06-04T10:30:00+09:00',
  '/wh-scam-crime-response': '2026-06-04T20:00:00+09:00',
  // 2026-06-05 公開
  '/malta-study': '2026-06-05T09:30:00+09:00',
  '/wh-pension-refund-australia': '2026-06-05T19:00:00+09:00',
  // 2026-06-06 公開
  '/english-test-waiver': '2026-06-06T10:00:00+09:00',
  '/berlin-livecost': '2026-06-06T20:30:00+09:00',
  // 2026-06-07 公開
  '/international-driving-permit': '2026-06-07T09:00:00+09:00',
  '/uk-yms-lottery-tips': '2026-06-07T19:00:00+09:00',
  // 2026-06-08 公開
  '/canada-tax-return': '2026-06-08T10:30:00+09:00',
  '/vancouver-vs-melbourne': '2026-06-08T20:00:00+09:00',
  // 2026-06-09 公開
  '/banking-overseas': '2026-06-09T09:00:00+09:00',
  '/sydney-vs-melbourne': '2026-06-09T19:30:00+09:00',
  // 2026-06-10 公開
  '/korea-study': '2026-06-10T10:00:00+09:00',
  '/wh-after-30': '2026-06-10T20:30:00+09:00',
  // 2026-06-11 公開
  '/wh-job-hunting-japan': '2026-06-11T09:00:00+09:00',
  '/au-second-year-visa': '2026-06-11T19:30:00+09:00',
  // 2026-06-12 公開
  '/sim-vs-esim': '2026-06-12T10:00:00+09:00',
  '/us-language-school': '2026-06-12T20:00:00+09:00',
  // 2026-06-13 公開
  '/wh-budget-100man': '2026-06-13T09:30:00+09:00',
  '/au-pr-route': '2026-06-13T19:00:00+09:00',
  // 2026-06-14 公開
  '/toronto-livecost': '2026-06-14T10:00:00+09:00',
  '/seoul-livecost': '2026-06-14T20:00:00+09:00',
  // 2026-06-15 公開
  '/wh-female-safety': '2026-06-15T09:00:00+09:00',
  '/uk-language-school': '2026-06-15T19:30:00+09:00',
  // 2026-06-16 公開
  '/au-rural-job': '2026-06-16T10:00:00+09:00',
  '/wh-loneliness': '2026-06-16T20:00:00+09:00',
  // 2026-06-17 公開
  '/au-vs-canada': '2026-06-17T09:00:00+09:00',
  '/wh-japanese-restaurant': '2026-06-17T19:30:00+09:00',
  // 2026-06-18 公開
  '/nz-language-school': '2026-06-18T10:00:00+09:00',
  '/wh-credit-history': '2026-06-18T20:00:00+09:00',
  // 2026-06-19 公開
  '/wh-internship': '2026-06-19T09:00:00+09:00',
  '/aus-vs-newzealand': '2026-06-19T19:30:00+09:00',
  // 2026-06-20 公開
  '/europe-budget-travel': '2026-06-20T10:00:00+09:00',
  '/wh-after-wh-stay': '2026-06-20T20:00:00+09:00',
  // 2026-06-21 公開
  '/short-term-study': '2026-06-21T09:00:00+09:00',
  '/wh-volunteer': '2026-06-21T19:30:00+09:00',
  // 2026-06-22 公開
  '/au-vs-uk': '2026-06-22T10:00:00+09:00',
  '/wh-after-japan-tax': '2026-06-22T20:00:00+09:00',
  // 2026-06-23 公開
  '/vancouver-livecost': '2026-06-23T09:00:00+09:00',
  '/uk-london-cost': '2026-06-23T19:30:00+09:00',
  // 2026-06-24 公開
  '/wh-tech-engineer': '2026-06-24T10:00:00+09:00',
  '/wh-marriage-international': '2026-06-24T20:00:00+09:00',
  // 2026-06-25 公開
  '/wh-au-pair': '2026-06-25T09:00:00+09:00',
  '/wh-nurse': '2026-06-25T19:30:00+09:00',
  // 2026-06-26 公開
  '/sydney-livecost': '2026-06-26T10:00:00+09:00',
  '/wh-childcare': '2026-06-26T20:00:00+09:00',
  // 2026-06-27 公開
  '/wh-overseas-university': '2026-06-27T09:00:00+09:00',
  '/us-vs-canada': '2026-06-27T19:30:00+09:00',
  // 2026-06-28 公開
  '/wh-cook-chef': '2026-06-28T10:00:00+09:00',
  '/wh-online-business': '2026-06-28T20:00:00+09:00',
  // 2026-06-29 公開
  '/wh-bilingual-job': '2026-06-29T09:00:00+09:00',
  '/wh-after-30-no-experience': '2026-06-29T19:30:00+09:00',
  // 2026-06-30 公開
  '/paris-livecost': '2026-06-30T10:00:00+09:00',
  '/wh-art-design': '2026-06-30T20:00:00+09:00',
  // 2026-07-01 公開
  '/wh-snowboard-ski': '2026-07-01T09:00:00+09:00',
  '/wh-yoga': '2026-07-01T19:30:00+09:00',
  // 2026-07-02 公開
  '/uk-vs-ireland': '2026-07-02T10:00:00+09:00',
  '/wh-multi-country': '2026-07-02T20:00:00+09:00',
  // 2026-07-03 公開
  '/wh-hotel-management': '2026-07-03T09:00:00+09:00',
  '/wh-music': '2026-07-03T19:30:00+09:00',
  // 2026-07-04 公開
  '/wh-fashion': '2026-07-04T10:00:00+09:00',
  '/wh-business-english': '2026-07-04T20:00:00+09:00',
};

/**
 * microCMS の articles エンドポイントに対する予約公開
 *
 * キーは記事の slug（contentId）。値は ISO 8601 の公開日時。
 * 過去日（または未登録）: 公開済み
 * 未来日: 予約公開（一覧と個別ページから除外）
 *
 * 追加時のルール:
 * - 1日3本ペースで分散
 * - 時間はランダム（9:00〜21:00の範囲内）
 */
export const ARTICLE_PUBLISH_DATES: Record<string, string> = {
  // 既存9記事はすべて公開済み（過去日）
  // 2026-06-01 公開
  'wh-toeic-ielts-prep-2026': '2026-06-01T10:00:00+09:00',
  'wh-farm-job-finding-guide': '2026-06-01T14:00:00+09:00',
  'wh-online-banking-comparison': '2026-06-01T19:00:00+09:00',
  'wh-packing-list-2026-complete': '2026-06-02T10:00:00+09:00',
  'wh-saving-300man-strategy': '2026-06-02T14:00:00+09:00',
  'wh-post-return-career-strategy': '2026-06-02T19:00:00+09:00',
  'wh-women-safety-manual': '2026-06-03T10:00:00+09:00',
  'wh-pre-departure-english-prep': '2026-06-03T14:00:00+09:00',
  'wh-arrival-week1-setup': '2026-06-03T19:00:00+09:00',
  'wh-newzealand-complete-guide': '2026-06-04T10:00:00+09:00',
  'wh-30s-women-strategy': '2026-06-04T14:00:00+09:00',
  'wh-medical-trouble-response': '2026-06-04T19:00:00+09:00',
  'wh-ireland-complete-guide': '2026-06-05T10:00:00+09:00',
  'wh-remote-work-jobs': '2026-06-05T14:00:00+09:00',
  'wh-self-cooking-recipes': '2026-06-05T19:00:00+09:00',
  'wh-korea-complete-guide': '2026-06-06T10:00:00+09:00',
  'wh-pre-departure-documents': '2026-06-06T14:00:00+09:00',
  'wh-travel-during-wh': '2026-06-06T19:00:00+09:00',
  'wh-australia-complete-guide': '2026-06-07T10:00:00+09:00',
  'wh-canada-complete-guide': '2026-06-07T14:00:00+09:00',
  'wh-english-resume-template': '2026-06-07T19:00:00+09:00',
  'wh-canada-iec-tips': '2026-06-08T10:00:00+09:00',
  'wh-sharehouse-troubles': '2026-06-08T14:00:00+09:00',
  'wh-mental-health-care': '2026-06-08T19:00:00+09:00',
  'wh-japanese-food-shopping': '2026-06-09T10:00:00+09:00',
  'wh-australia-pr-routes': '2026-06-09T14:00:00+09:00',
  'wh-driving-license-car': '2026-06-09T19:00:00+09:00',
  'wh-uk-yms-tips': '2026-06-10T10:00:00+09:00',
  'wh-friendship-network': '2026-06-10T14:00:00+09:00',
  'wh-pre-departure-ng': '2026-06-10T19:00:00+09:00',
  'wh-cafe-english-phrases': '2026-06-11T10:00:00+09:00',
  'wh-vaccination-prep': '2026-06-11T14:00:00+09:00',
  'wh-dental-care-abroad': '2026-06-11T19:00:00+09:00',
  'wh-fashion-clothing': '2026-06-12T10:00:00+09:00',
  'wh-cultural-manners': '2026-06-12T14:00:00+09:00',
  'wh-sharehouse-essentials': '2026-06-12T19:00:00+09:00',
  'wh-barista-complete-guide': '2026-06-13T10:00:00+09:00',
  'wh-hotel-job-guide': '2026-06-13T14:00:00+09:00',
  'wh-construction-work-guide': '2026-06-13T19:00:00+09:00',
  'wh-australia-second-visa': '2026-06-14T10:00:00+09:00',
  'wh-theft-prevention': '2026-06-14T14:00:00+09:00',
  'wh-pre-savings-plan': '2026-06-14T19:00:00+09:00',
  'wh-esim-comparison': '2026-06-15T10:00:00+09:00',
  'wh-cebu-pre-study': '2026-06-15T14:00:00+09:00',
  'wh-festivals-events': '2026-06-15T19:00:00+09:00',
  'wh-germany-complete-guide': '2026-06-18T07:00:00+09:00',
  'wh-university-student-guide': '2026-06-18T07:00:00+09:00',
  'wh-working-adult-guide': '2026-06-18T07:00:00+09:00',
  'wh-usa-study-guide': '2026-06-18T07:00:00+09:00',
  'wh-vs-studyabroad-guide': '2026-06-18T07:00:00+09:00',
  'wh-australia-canada-nz-comparison': '2026-06-18T07:00:00+09:00',
  'wh-couple-working-holiday': '2026-06-18T07:00:00+09:00',
  'wh-no-degree-working-holiday': '2026-06-18T07:00:00+09:00',
  'wh-taiwan-complete-guide': '2026-06-18T07:00:00+09:00',
  'wh-france-complete-guide': '2026-06-18T07:00:00+09:00',
  'wh-cheap-working-holiday': '2026-06-18T07:00:00+09:00',
  'wh-english-not-improving': '2026-06-18T07:00:00+09:00',
  'wh-romance-relationships': '2026-06-18T07:00:00+09:00',
  'wh-italy-complete-guide': '2026-06-18T07:00:00+09:00',
  'wh-spain-complete-guide': '2026-06-18T07:00:00+09:00',
  'wh-denmark-complete-guide': '2026-06-18T07:00:00+09:00',
  'wh-overseas-job-after': '2026-06-18T07:00:00+09:00',
  'wh-30s-men-strategy': '2026-06-18T07:00:00+09:00',
  'wh-regret-failures': '2026-06-18T07:00:00+09:00',
  'wh-tax-filing-guide': '2026-06-18T07:00:00+09:00',
  'wh-portugal-complete-guide': '2026-06-18T07:00:00+09:00',
  // 2026-07-06 公開（週次パイプライン第1号）
  'wh-denmark-cost-guide': '2026-07-06T09:00:00+09:00',
  'wh-is-life-over': '2026-07-28T11:00:00+09:00',
  'wh-korea-activity-plan': '2026-07-28T12:30:00+09:00',
  'wh-leave-of-absence': '2026-07-28T14:00:00+09:00',
  'wh-unemployment-insurance': '2026-07-29T09:00:00+09:00',
  'wh-taiwan-language-schools': '2026-07-29T12:00:00+09:00',
  'wh-nz-wages': '2026-07-29T18:00:00+09:00',
  'wh-ireland-experiences': '2026-07-30T09:00:00+09:00',
  'wh-belgium-no-program': '2026-07-30T12:00:00+09:00',
  'wh-korea-application-form': '2026-07-30T18:00:00+09:00',
};

/**
 * 指定の articles slug が公開済みかをチェック
 */
export function isArticlePublished(slug: string, now: Date = new Date()): boolean {
  const publishAt = ARTICLE_PUBLISH_DATES[slug];
  if (!publishAt) return true; // 未登録は即公開
  const publishDate = new Date(publishAt);
  if (Number.isNaN(publishDate.getTime())) return true;
  return now >= publishDate;
}

/**
 * 公開済みの articles slug だけを返す
 */
export function filterPublishedArticleSlugs(slugs: string[], now: Date = new Date()): string[] {
  return slugs.filter((s) => isArticlePublished(s, now));
}

/**
 * 指定URLが公開済みかをチェック
 * - PUBLISH_DATESに登録されていない: 公開済み（既存ページ）
 * - 登録済みで公開日が過去: 公開済み
 * - 登録済みで公開日が未来: 未公開（404にする）
 */
export function isPublished(path: string, now: Date = new Date()): boolean {
  const publishAt = PUBLISH_DATES[path];
  if (!publishAt) return true; // 未登録は即公開
  const publishDate = new Date(publishAt);
  if (Number.isNaN(publishDate.getTime())) return true; // 無効な日付は即公開
  return now >= publishDate;
}

/**
 * 公開日時を取得（記事冒頭の「更新」バッジ表示用）
 * 未登録 or 過去日付の場合は null を返す
 */
export function getPublishDate(path: string): Date | null {
  const publishAt = PUBLISH_DATES[path];
  if (!publishAt) return null;
  const d = new Date(publishAt);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

/**
 * 公開済みのパスだけを返す（sitemap.ts のフィルタ用）
 */
export function filterPublishedPaths(paths: string[], now: Date = new Date()): string[] {
  return paths.filter((p) => isPublished(p, now));
}
