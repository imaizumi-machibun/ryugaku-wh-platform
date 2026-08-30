import type { Metadata } from 'next';
import Link from 'next/link';
import MatchingFlow from '@/components/matching/MatchingFlow';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ国診断（埋め込み版）',
  description: '5問でわかる、あなたにぴったりのワーホリ国診断。',
  path: '/embed/matching',
  noindex: true,
});

/**
 * 他サイトが iframe で貼るための埋め込み版。
 * ヘッダー・フッターは SiteChrome により /embed 配下では非表示になる。
 * 末尾に出典リンク（target=_blank）を置き、ブランド露出と流入を確保する。
 */
export default function EmbedMatchingPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <MatchingFlow />
      <p className="mt-4 text-center text-xs text-gray-500">
        提供:{' '}
        <Link
          href="/matching"
          target="_blank"
          rel="noopener"
          className="text-primary-600 hover:underline font-semibold"
        >
          ワーホリ国診断 | Study Work Hub
        </Link>
      </p>
    </div>
  );
}
