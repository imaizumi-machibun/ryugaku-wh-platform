import Link from 'next/link';

const FOOTER_LINKS = {
  explore: {
    title: '探す',
    items: [
      { href: '/countries', label: '国から探す' },
      { href: '/schools', label: '学校から探す' },
      { href: '/compare', label: '国を比較する' },
    ],
  },
  content: {
    title: 'コンテンツ',
    items: [
      { href: '/experiences', label: '体験談' },
      { href: '/research', label: '調査データ' },
      { href: '/articles', label: 'お役立ち記事' },
      { href: '/services', label: '広告掲載サービス（PR）' },
    ],
  },
  contribute: {
    title: '投稿',
    items: [
      { href: '/submit/experience', label: '体験談を投稿' },
      { href: '/submit/review', label: '口コミを投稿' },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-white font-bold text-lg">
              Study Work Hub
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              留学・ワーキングホリデーの体験談・学校口コミを集約したデータベースプラットフォーム
            </p>
          </div>
          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-accent-300 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col items-center gap-3 text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="text-gray-400 hover:text-accent-300 transition-colors"
            >
              運営者情報
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-accent-300 transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/survey"
              className="text-gray-400 hover:text-accent-300 transition-colors"
            >
              アンケート調査について
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Study Work Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
