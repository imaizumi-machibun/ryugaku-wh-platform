'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/countries', label: '国から探す', icon: '🌏' },
  { href: '/schools', label: '学校から探す', icon: '🏫' },
  { href: '/experiences', label: '体験談', icon: '📝' },
  { href: '/articles', label: 'お役立ち記事', icon: '📰' },
  { href: '/compare', label: '国を比較', icon: '📊' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <span>留学・ワーホリDB</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/submit/experience"
              className="bg-accent-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors"
            >
              体験談を投稿
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Full screen slide-out */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <nav className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-xl transform animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-primary-600">メニュー</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="メニューを閉じる"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {/* Nav Section */}
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">探す</p>
              <div className="flex flex-col gap-1 mb-6">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 text-gray-700 hover:text-primary-600 py-3 px-3 rounded-lg hover:bg-primary-50 transition-colors min-h-[44px]"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Action Section */}
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">投稿する</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/submit/experience"
                  className="bg-accent-500 text-white text-center py-3 px-4 rounded-lg hover:bg-accent-600 transition-colors font-semibold min-h-[44px] flex items-center justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  体験談を投稿
                </Link>
                <Link
                  href="/submit/review"
                  className="border-2 border-accent-500 text-accent-600 text-center py-3 px-4 rounded-lg hover:bg-accent-50 transition-colors font-semibold min-h-[44px] flex items-center justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  口コミを投稿
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
