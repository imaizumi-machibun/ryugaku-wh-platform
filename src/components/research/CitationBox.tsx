'use client';

import { useState } from 'react';

type Props = {
  /** レポートのタイトル（出典表記に入る） */
  pageTitle: string;
  /** 絶対URL（他サイトに貼られるため相対不可） */
  pageUrl: string;
  /** サイト名（運営者） */
  siteName: string;
};

/**
 * 「このデータの引用・転載について」セクション。
 * 出典テキストとリンク付きHTMLをワンクリックでコピーできるようにし、
 * 引用する側の手間をゼロにして自然な被リンクを促す。
 * リンクHTMLは rel を付けない素の <a>（dofollow）。
 */
export default function CitationBox({ pageTitle, pageUrl, siteName }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const citationText = `${siteName}「${pageTitle}」(${pageUrl})`;
  const linkHtml = `<a href="${pageUrl}">${siteName}「${pageTitle}」</a>`;

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // クリップボード非対応環境では何もしない
    }
  }

  const snippets: { key: string; heading: string; body: string }[] = [
    { key: 'text', heading: '出典表記（テキスト）', body: citationText },
    { key: 'html', heading: 'リンク付きHTML（ブログ・記事用）', body: linkHtml },
  ];

  return (
    <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-sky-900">このデータの引用・転載について</h2>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        本調査の数値・グラフ・ランキングは、<strong>出典の明記とこのページへのリンク</strong>を添えていただければ、
        営利・非営利を問わずどなたでも自由にご利用いただけます。報道・教育・研究目的での引用も歓迎します。
        下記のコードをそのままお使いいただけます。
      </p>
      <div className="space-y-4">
        {snippets.map((s) => (
          <div key={s.key}>
            <p className="text-xs font-semibold text-gray-600 mb-1">{s.heading}</p>
            <div className="flex gap-2">
              <code className="flex-1 block bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 break-all">
                {s.body}
              </code>
              <button
                onClick={() => copy(s.key, s.body)}
                className="shrink-0 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
                aria-label={`${s.heading}をコピー`}
              >
                {copiedKey === s.key ? 'コピー済み' : 'コピー'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
