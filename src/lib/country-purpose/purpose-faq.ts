import { extractFaqFromArticleBody } from '@/lib/utils/article-faq';

const FAQ_H2_PATTERN = /<h2[^>]*>[^<]*(?:よくある質問|FAQ)[^<]*<\/h2>/i;

/**
 * countryPurposeGuides の専用FAQ欄を、読者に表示する本文へ統合する。
 * 表示本文とFAQPageが同じHTMLを正本にできるよう、別配列では保持しない。
 */
export function mergePurposeGuideFaq(body: string, faq?: string): string {
  const faqMarkup = faq?.trim();
  if (!faqMarkup) return body;

  if (FAQ_H2_PATTERN.test(body)) {
    throw new Error('countryPurposeGuide: body と faq の両方にFAQがあります');
  }

  const section = FAQ_H2_PATTERN.test(faqMarkup)
    ? faqMarkup
    : `<h2>よくある質問</h2>${faqMarkup}`;
  const merged = `${body}${section}`;

  if (extractFaqFromArticleBody(merged).length === 0) {
    throw new Error('countryPurposeGuide: faq は質問形式のH3と回答を含めてください');
  }

  return merged;
}
