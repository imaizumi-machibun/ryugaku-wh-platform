/**
 * 記事本文 (HTML) から「よくある質問」または「FAQ」セクションを抽出する。
 *
 * 想定する記事構造:
 *   <h2>よくある質問</h2>  ← または「よくある質問（FAQ）」
 *     <h3>{質問}</h3>
 *     <p>{回答}</p>
 *     <h3>{質問}</h3>
 *     <p>{回答}</p>
 *     ...
 *   <h2>次のセクション</h2>  ← ここまでが FAQ ブロック
 *
 * 抽出した FAQ は generateFAQJsonLd に渡して FAQPage 構造化データを出力する用途。
 */

type FaqItem = { question: string; answer: string };

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractFaqFromArticleBody(body: string | undefined): FaqItem[] {
  if (!body) return [];

  // 「よくある質問」または独立語としての「FAQ」を含む H2 を探す。
  // FAQPage は表示本文と一致するときだけ出力するため、見出し以外の本文中の FAQ は拾わない。
  const faqSectionMatch = body.match(
    /<h2[^>]*>[^<]*(?:よくある質問|FAQ)[^<]*<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/i
  );
  if (!faqSectionMatch) return [];

  const faqSection = faqSectionMatch[1];

  // H3 + 直後の P を1問1答として抜き出す
  const items: FaqItem[] = [];
  const pattern = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(faqSection)) !== null) {
    const question = stripTags(m[1]);
    const answer = stripTags(m[2]);
    if (question && answer) items.push({ question, answer });
  }
  return items;
}
