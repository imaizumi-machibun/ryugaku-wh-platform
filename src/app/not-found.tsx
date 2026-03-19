import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-custom py-20 text-center">
      {/* SVG Illustration */}
      <div className="mb-8">
        <svg
          className="w-48 h-48 mx-auto text-gray-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="90" strokeWidth="4" className="text-gray-100" fill="currentColor" />
          <path
            d="M60 80 L80 100 L60 120"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300"
          />
          <path
            d="M120 80 L140 100 L120 120"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300"
          />
          <path
            d="M85 140 Q100 130 115 140"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="text-gray-300"
          />
        </svg>
      </div>

      <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ページが見つかりません
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        お探しのページは存在しないか、移動された可能性があります。
        以下のリンクからお探しの情報を見つけてください。
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
        <Link
          href="/"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          トップページへ戻る
        </Link>
        <Link
          href="/countries"
          className="inline-block border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
        >
          国から探す
        </Link>
      </div>

      <div className="max-w-md mx-auto">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">人気のページ</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: '体験談', href: '/experiences' },
            { label: '学校検索', href: '/schools' },
            { label: 'お役立ち記事', href: '/articles' },
            { label: '国を比較', href: '/compare' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
