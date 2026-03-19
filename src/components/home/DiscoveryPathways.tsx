'use client';

import { useState } from 'react';
import Link from 'next/link';

type Pathway = {
  label: string;
  items: { label: string; href: string; emoji?: string }[];
};

const PATHWAYS: Pathway[] = [
  {
    label: '目的別',
    items: [
      { label: 'ワーキングホリデー', href: '/experiences', emoji: '💼' },
      { label: '語学留学', href: '/schools', emoji: '📚' },
      { label: '費用を抑えたい', href: '/schools?cost=budget', emoji: '💰' },
      { label: '短期（3ヶ月以内）', href: '/experiences', emoji: '⏰' },
      { label: '長期（1年以上）', href: '/experiences', emoji: '🗓' },
    ],
  },
  {
    label: '地域別',
    items: [
      { label: 'オセアニア', href: '/countries', emoji: '🦘' },
      { label: 'ヨーロッパ', href: '/countries', emoji: '🏰' },
      { label: '北米', href: '/countries', emoji: '🗽' },
      { label: 'アジア', href: '/countries', emoji: '🏯' },
    ],
  },
  {
    label: '費用別',
    items: [
      { label: 'リーズナブル', href: '/schools?cost=budget', emoji: '💵' },
      { label: 'スタンダード', href: '/schools?cost=standard', emoji: '💳' },
      { label: 'プレミアム', href: '/schools?cost=premium', emoji: '💎' },
    ],
  },
];

export default function DiscoveryPathways() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-12">
      <div className="container-custom">
        <h2 className="text-2xl font-bold mb-6">あなたに合った探し方</h2>

        {/* Tab pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {PATHWAYS.map((pathway, i) => (
            <button
              key={pathway.label}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
                activeTab === i
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {pathway.label}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {PATHWAYS[activeTab].items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all min-h-[44px]"
            >
              {item.emoji && <span className="text-2xl">{item.emoji}</span>}
              <span className="text-sm font-medium text-gray-700 text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
