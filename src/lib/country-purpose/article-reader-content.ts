type ReaderContentCleanupOptions = {
  /** 監査説明と同じ節に残った「向く人」情報へ付ける見出し。 */
  adviceHeading?: string;
  /** 監査説明と同じ節に残った安全情報へ付ける見出し。 */
  safetyHeading?: string;
};

type HeadingSection = {
  start: number;
  headingEnd: number;
  level: number;
  attributes: string;
  innerHtml: string;
};

const HEADING_PATTERN = /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function textContent(html: string): string {
  return decodeBasicEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function findHeadingSections(html: string): HeadingSection[] {
  const headings: HeadingSection[] = [];
  HEADING_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = HEADING_PATTERN.exec(html)) !== null) {
    headings.push({
      start: match.index,
      headingEnd: HEADING_PATTERN.lastIndex,
      level: Number(match[1]),
      attributes: match[2],
      innerHtml: match[3],
    });
  }

  return headings;
}

/**
 * 読者向けの体験談そのものではなく、編集部内の抽出・分類手順を説明する節を対象にする。
 * 通常の確認済み集計（例: 31件の中央値）は残し、旧94件母集団の監査ログだけを除く。
 */
function isEditorialAuditSection(heading: string, body: string): boolean {
  const sectionText = `${textContent(heading)} ${textContent(body)}`;
  const mentionsExperienceData =
    /(?:Study Work Hub|当サイト|自社|公開(?:中|している)?(?:の)?体験談|国(?:フィールド|項目)|読み取り専用API|APIで全取得)/i.test(
      sectionText
    );
  const saysNoVerifiedExample =
    /(?:0件|例はありませんでした|回答はありませんでした|掲載していません|対象事例がない|確認できる(?:記録|投稿|体験談|事例)[^。]*(?:ありません|ない)|引用できる[^。]*(?:ありません|ない))/i.test(
      sectionText
    );
  const describesLegacyCorpusMethod =
    /94件/.test(sectionText) &&
    /(?:抽出|分類|照合|確認|完全一致|国名欄|国フィールド|国項目|API|本人の記述で分け)/.test(
      sectionText
    );

  return mentionsExperienceData && (saysNoVerifiedExample || describesLegacyCorpusMethod);
}

function isEditorialAuditParagraph(paragraphHtml: string): boolean {
  const paragraph = textContent(paragraphHtml);
  if (/公開体験談(?!94件)\d+件/.test(paragraph) && !/0件/.test(paragraph)) {
    return false;
  }
  const hasAuditVocabulary =
    /(?:Study Work Hub|当編集部|当サイト|自社|公開(?:中|している)?(?:の)?体験談|国(?:フィールド|項目|データ)|API|全件(?:取得|確認)|完全一致|本文(?:でも|と)?(?:照合|確認)|確認は|この0件|本人原文|原文照合)/i.test(
      paragraph
    );
  const describesEditorialHandling =
    /(?:確認|照合|取得|集計|抽出|一致|0件|記録|投稿|回答|データ|引用|一般化|転用|流用|掲載|設け|置いた|作った|整理枠|目安|自社平均|当事者事例)/i.test(
      paragraph
    );
  const editorialPolicyOnly =
    /(?:他国|別国|旅行|交換留学)[^。]*(?:体験|経験|滞在の記録)[^。]*(?:転用|流用|置き換え|根拠には使いません|体験談としては引用していません)|本文で[^。]*(?:記録|体験談)[^。]*引用していません|この記事[^。]*(?:引用|一般化)|本人経験[^。]*原文照合|当事者事例[^。]*一般化/i.test(
      paragraph
    );
  const methodOnly =
    /(?:結果は0件|集計方法と回答の内訳|国名欄[^。]*抽出|国フィールド[^。]*一致|国項目[^。]*一致|回答者の記述だけで分け|年齢[^。]*ビザ[^。]*推定せず|その結果[^。]*(?:短期留学|目的不明|ビザ不明)[^。]*件|確認できた[^。]*(?:ワーホリ|体験談)[^。]*0件|(?:費用平均|仕事実績|成功率)[^。]*使いません)/i.test(
      paragraph
    );

  return (hasAuditVocabulary && describesEditorialHandling) || editorialPolicyOnly || methodOnly;
}

function isMixedPurposeLegacyCorpusSection(heading: string, body: string): boolean {
  const sectionText = `${textContent(heading)} ${textContent(body)}`;
  const tableText = Array.from(body.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi))
    .map((match) => textContent(match[1]))
    .join(' ');
  return (
    /94件/.test(sectionText) &&
    /(?:抽出|分類|国名欄|本人の記述で分け)/.test(sectionText) &&
    /(?:(?:留学|目的不明|ビザ不明|査証不明)[^。]*(?:混在|中央値|平均)|(?:WH|ワーホリ)[^。]*(?:留学|目的不明|ビザ不明|査証不明))/.test(tableText)
  );
}

function replacementHeading(
  originalHeading: string,
  remainingBody: string,
  options: ReaderContentCleanupOptions
): string {
  const combinedText = `${textContent(originalHeading)} ${textContent(remainingBody)}`;

  if (/(?:向く人|向いている|向きやすい|向きます|向く可能性)/.test(combinedText)) {
    return options.adviceHeading ?? '向いている人・慎重に比べたい人';
  }

  if (/(?:安全対策|安全面|治安|緊急番号|すり|置き引き)/.test(combinedText)) {
    return options.safetyHeading ?? '安全に暮らすための対策';
  }

  return '渡航前に確認したいポイント';
}

function readerFacingAuditHeading(innerHtml: string): string {
  return innerHtml
    .replace(/自社体験談94件/g, '現地生活')
    .replace(/自社94件/g, '現地生活')
    .replace(/自社データ/g, '現地生活')
    .replace(/公開体験談94件/g, '体験談');
}

function removeEditorialProcessSentences(html: string): string {
  return html.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (paragraph, attributes: string, innerHtml: string) => {
    if (!isEditorialAuditParagraph(innerHtml)) return paragraph;

    const readerSentences = innerHtml
      .split(/(?<=。)/u)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence && !isEditorialAuditParagraph(sentence));

    if (readerSentences.length === 0) return '';
    const remainder = readerSentences
      .join('')
      .replace(/^その1名は/, '本人の回答でワーホリを確認できた体験者は');
    return `<p${attributes}>${remainder}</p>`;
  });
}

function hasEditorialAuditSubsection(
  html: string,
  headings: HeadingSection[],
  headingIndex: number
): boolean {
  const parent = headings[headingIndex];
  if (parent.level !== 2 || !/(?:自社体験談94件|自社94件|自社データ)/.test(textContent(parent.innerHtml))) {
    return false;
  }

  for (let index = headingIndex + 1; index < headings.length; index += 1) {
    const child = headings[index];
    if (child.level === 2) break;
    const sectionEnd = headings[index + 1]?.start ?? html.length;
    const body = html.slice(child.headingEnd, sectionEnd);
    if (isEditorialAuditSection(child.innerHtml, body)) return true;
  }

  return false;
}

function removeDanglingFragmentListItems(html: string): string {
  const ids = new Set(
    Array.from(html.matchAll(/\sid=(['"])([^'"]+)\1/gi), (match) => match[2])
  );

  return html
    .replace(/<li\b[^>]*>[\s\S]*?<\/li>/gi, (listItem) => {
      const fragment = listItem.match(/\shref=(['"])#([^'"]+)\1/i)?.[2];
      return fragment && !ids.has(fragment) ? '' : listItem;
    })
    .replace(/<ul\b[^>]*>\s*<\/ul>/gi, '');
}

/**
 * 国別目的ページへ統合した記事本文から、読者には不要な編集部の照合ログを除く。
 *
 * - 「確認済み体験談0件」の監査節だけが対象
 * - 同じ節に続く向き不向き・安全対策・比較表・リンクは保持
 * - 有用な内容が残る場合は、読者向けの見出しへ差し替える
 * - 実体験がある集計や通常の体験談節は変更しない
 */
export function cleanPurposeArticleReaderContent(
  html: string,
  options: ReaderContentCleanupOptions = {}
): string {
  if (!html) return html;

  const headings = findHeadingSections(html);
  if (headings.length === 0) {
    return removeDanglingFragmentListItems(removeEditorialProcessSentences(html));
  }

  let result = html.slice(0, headings[0].start);

  headings.forEach((heading, index) => {
    const sectionEnd = headings[index + 1]?.start ?? html.length;
    const headingInnerHtml = hasEditorialAuditSubsection(html, headings, index) ||
      /(?:自社体験談94件|自社94件|公開体験談94件)/.test(textContent(heading.innerHtml))
      ? readerFacingAuditHeading(heading.innerHtml)
      : heading.innerHtml;
    const originalHeading = `<h${heading.level}${heading.attributes}>${headingInnerHtml}</h${heading.level}>`;
    const body = html.slice(heading.headingEnd, sectionEnd);

    if (
      heading.level === 3 &&
      isMixedPurposeLegacyCorpusSection(heading.innerHtml, body)
    ) {
      return;
    }

    if (
      heading.level !== 3 ||
      !isEditorialAuditSection(heading.innerHtml, body)
    ) {
      result += originalHeading + body;
      return;
    }

    const remainingBody = removeEditorialProcessSentences(body).replace(/^\s+/, '');
    if (!textContent(remainingBody)) return;

    const headingText = replacementHeading(
      heading.innerHtml,
      remainingBody,
      options
    );
    result += `<h3${heading.attributes}>${escapeHtml(headingText)}</h3>\n${remainingBody}`;
  });

  return removeDanglingFragmentListItems(removeEditorialProcessSentences(result));
}
