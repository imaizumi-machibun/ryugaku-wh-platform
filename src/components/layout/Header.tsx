'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/search/SearchBar';

const NAV_ITEMS = [
  { href: '/countries', label: '国から探す' },
  { href: '/schools', label: '学校から探す' },
  { href: '/guide', label: 'ワーホリガイド' },
  { href: '/experiences', label: '体験談' },
  { href: '/articles', label: 'お役立ち記事' },
  { href: '/compare', label: '国を比較' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="shrink-0 text-lg font-black tracking-tight text-gray-900">
            Study Work Hub
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="w-44">
              <SearchBar variant="header" />
            </div>
            <Link
              href="/submit/experience"
              className="shrink-0 rounded-xl bg-accent-400 px-4 py-2 text-sm font-bold text-primary-900 transition-all hover:bg-accent-500 hover:shadow-glow-accent"
            >
              体験談を投稿
            </Link>
          </div>

          {/* Hamburger (CSS, no icon lib) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
            aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
          >
            <span className={`h-0.5 w-6 bg-gray-800 transition-all duration-200 ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-gray-800 transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-gray-800 transition-all duration-200 ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={() => setIsOpen(false)} />
          <nav className="absolute inset-x-0 top-0 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white px-5 pb-8 pt-4 shadow-xl">
            <div className="mb-5">
              <SearchBar variant="header" />
            </div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">探す</p>
            <div className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-gray-100 py-3.5 font-medium text-gray-800 transition-colors hover:text-primary-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/submit/experience"
                className="rounded-xl bg-accent-400 py-3 text-center font-bold text-primary-900"
                onClick={() => setIsOpen(false)}
              >
                体験談を投稿
              </Link>
              <Link
                href="/submit/review"
                className="rounded-xl border-2 border-accent-400 py-3 text-center font-bold text-accent-700"
                onClick={() => setIsOpen(false)}
              >
                口コミを投稿
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
