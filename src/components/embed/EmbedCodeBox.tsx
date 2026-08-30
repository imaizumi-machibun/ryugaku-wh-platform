'use client';

import { useState } from 'react';

type Props = {
  /** 埋め込みページのパス（例: /embed/matching） */
  embedPath: string;
  /** 出典リンク先の本体ページパス（例: /matching） */
  canonicalPath: string;
  /** ツール名（コード・出典リンクに入る） */
  title: string;
  /** 絶対URL生成用のサイトURL */
  siteUrl: string;
  /** iframe の高さ(px) */
  height?: number;
};

/**
 * 「このツールを紹介する」ボックス。
 * 出典リンク（rel なしの dofollow）付き iframe コードと、リンク単体コードを
 * ワンクリックでコピーできるようにし、他サイトに貼ってもらう = 被リンクを生む。
 */
export default function EmbedCodeBox({
  embedPath,
  canonicalPath,
  title,
  siteUrl,
  height = 640,
}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const embedSrc = `${siteUrl}${embedPath}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const iframeCode = `<iframe src="${embedSrc}" width="100%" height="${height}" loading="lazy" style="border:1px solid #e5e7eb;border-radius:12px;max-width:680px;" title="${title}"></iframe>
<p style="font-size:12px;margin-top:6px;">提供: <a href="${canonicalUrl}">${title}｜Study Work Hub</a></p>`;
  const linkCode = `<a href="${canonicalUrl}">${title}｜Study Work Hub</a>`;

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // クリップボード非対応環境では何もしない
    }
  }

  const snippets: { key: string; heading: string; body: string; rows: number }[] = [
    { key: 'iframe', heading: '埋め込みコード（ブログ・サイトに貼り付け）', body: iframeCode, rows: 4 },
    { key: 'link', heading: 'リンクだけ貼る場合', body: linkCode, rows: 2 },
  ];

  return (
    <section className="bg-primary-50 border border-primary-100 rounded-xl p-5 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-primary-900">このツールを紹介する</h2>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        ブログやサイトでこの診断ツールを紹介いただけます。下のコードをコピーして貼り付けるだけで、ツールの埋め込みと出典リンクが設置されます。営利・非営利を問わずご自由にお使いください（出典リンクは残してください）。
      </p>
      <div className="space-y-4">
        {snippets.map((s) => (
          <div key={s.key}>
            <div className="flex items-center justify-between mb-1 gap-2">
              <p className="text-xs font-semibold text-gray-600">{s.heading}</p>
              <button
                onClick={() => copy(s.key, s.body)}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors"
                aria-label={`${s.heading}をコピー`}
              >
                {copiedKey === s.key ? 'コピーしました' : 'コードをコピー'}
              </button>
            </div>
            <textarea
              readOnly
              rows={s.rows}
              value={s.body}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-800 resize-none"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
