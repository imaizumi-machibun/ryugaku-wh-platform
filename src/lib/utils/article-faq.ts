/**
 * 記事本文 (HTML) から「よくある質問」または「FAQ」セクションを抽出する。
 *
 * 想定する記事構造:
 *   <h2>よくある質問</h2>  ← または「よくある質問（FAQ）」
 *     <h3>{質問}</h3>
 *     <p>{回答}</p>  ← 複数段落・表・リスト・引用を含んでもよい
 *     <h3>{質問}</h3>
 *     <p>{回答}</p>
 *     ...
 *   <h2>次のセクション</h2>  ← ここまでが FAQ ブロック
 *
 * 抽出した FAQ は generateFAQJsonLd に渡して FAQPage 構造化データを出力する用途。
 */

type FaqItem = { question: string; answer: string };

/**
 * FAQの質問見出しだけを判定する。
 *
 * 今後の入稿では末尾を「？」に統一する。ここでは既存記事との互換性のため、
 * 日本語の疑問終止「か」や、質問として定着している依頼・懸念・場合分けの
 * 見出しも受け付ける。FAQ H2内に同居する「まとめ」「チェックリスト」等を
 * Questionとして誤出力しないための境界でもある。
 */
export function isFaqQuestionHeading(value: string): boolean {
  const heading = value.replace(/\s+/g, ' ').trim();
  if (!heading) return false;
  return /[?？]$/.test(heading)
    || /か[。.．]?$/u.test(heading)
    || /(?:たら|教えてください|聞きました|心配です[。.．]?|対処法|どうする)$/u.test(heading);
}

function stripTags(html: string): string {
  return html
    .replace(/<(?:script|style)[^>]*>[\s\S]*?<\/(?:script|style)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(?:p|li|tr|td|th|blockquote|div|section|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp|ldquo|rdquo|lsquo|rsquo|ndash|mdash|hellip|middot|yen);/gi, (_match, entity: string) => {
      const normalized = entity.toLowerCase();
      if (normalized.startsWith('#x')) return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
      if (normalized.startsWith('#')) return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
      const named: Record<string, string> = {
        amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
        ldquo: '"', rdquo: '"', lsquo: "'", rsquo: "'",
        ndash: '–', mdash: '—', hellip: '…', middot: '·', yen: '¥',
      };
      return named[normalized] ?? _match;
    })
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

  // H3から次のH3までを1問の表示回答として抜き出す。
  // 最初のpだけに限定すると、表示されている補足段落・表・リスト・引用が
  // FAQPageから欠落するため、回答ブロック全体をプレーンテキスト化する。
  const items: FaqItem[] = [];
  const pattern = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(faqSection)) !== null) {
    const question = stripTags(m[1]);
    const answer = stripTags(m[2]);
    if (question && answer && isFaqQuestionHeading(question)) items.push({ question, answer });
  }
  return items;
}
