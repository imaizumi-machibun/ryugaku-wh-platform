'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

type SearchResult = {
  type: 'country' | 'school' | 'experience' | 'article';
  id: string;
  title: string;
  subtitle?: string;
};

type Props = {
  variant?: 'hero' | 'header';
};

const TYPE_LABELS: Record<string, string> = {
  country: '国',
  school: '学校',
  experience: '体験談',
  article: '記事',
};

const TYPE_COLORS: Record<string, string> = {
  country: 'bg-green-100 text-green-700',
  school: 'bg-blue-100 text-blue-700',
  experience: 'bg-orange-100 text-orange-700',
  article: 'bg-purple-100 text-purple-700',
};

export default function SearchBar({ variant = 'hero' }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
        setIsOpen(true);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function getHref(result: SearchResult) {
    const paths: Record<string, string> = {
      country: `/countries/${result.id}`,
      school: `/schools/${result.id}`,
      experience: `/experiences/${result.id}`,
      article: `/articles/${result.id}`,
    };
    return paths[result.type];
  }

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="国名・学校名・キーワードで検索..."
          className={`w-full pl-12 pr-4 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400 ${
            isHero ? 'py-3.5 shadow-lg text-base' : 'py-2 text-sm border border-gray-300'
          }`}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50 animate-fade-in">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={getHref(result)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[result.type]}`}>
                {TYPE_LABELS[result.type]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{result.title}</p>
                {result.subtitle && (
                  <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && query.length >= 2 && !isLoading && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-200 p-6 text-center z-50 animate-fade-in">
          <p className="text-sm text-gray-500">「{query}」に一致する結果が見つかりませんでした</p>
        </div>
      )}
    </div>
  );
}
