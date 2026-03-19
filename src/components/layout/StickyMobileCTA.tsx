'use client';

import Link from 'next/link';

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 safe-area-pb animate-slide-up">
      <div className="flex gap-2 px-4 py-2">
        <Link
          href="/submit/experience"
          className="flex-1 bg-accent-500 text-white text-center text-sm font-semibold py-2.5 rounded-lg hover:bg-accent-600 transition-colors"
        >
          体験談を投稿
        </Link>
        <Link
          href="/submit/review"
          className="flex-1 border-2 border-accent-500 text-accent-600 text-center text-sm font-semibold py-2.5 rounded-lg hover:bg-accent-50 transition-colors"
        >
          口コミを投稿
        </Link>
      </div>
    </div>
  );
}
