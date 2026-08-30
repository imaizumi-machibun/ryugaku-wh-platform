'use client';

import { useState } from 'react';
import { SITUATION_TABS, getGuideArticlesByTag } from '@/lib/data/guide-articles';
import GuideArticleCard from './GuideArticleCard';

export default function SituationGuide() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container-custom">
        <h2 className="max-w-3xl text-display font-black text-gray-900">あなたの状況から記事を探す</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-gray-600">
          目的・悩み・準備の段階から、いまのあなたに役立つ記事が見つかります。
        </p>

        {/* タブ */}
        <div role="tablist" aria-label="状況の軸" className="mt-10 flex flex-wrap gap-2">
          {SITUATION_TABS.map((tab, i) => (
            <button
              key={tab.axis}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`min-h-[44px] rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                active === i
                  ? 'bg-primary-900 text-white'
                  : 'border border-gray-300 bg-transparent text-gray-600 hover:border-primary-400 hover:text-primary-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 全タブを描画し、非アクティブは hidden（クローラビリティ確保） */}
        {SITUATION_TABS.map((tab, i) => (
          <div key={tab.axis} role="tabpanel" className={active === i ? 'mt-10 space-y-12' : 'hidden'}>
            {tab.groups.map((group) => {
              const articles = getGuideArticlesByTag(group.tag, 4);
              if (articles.length === 0) return null;
              return (
                <div key={group.tag}>
                  <h3 className="mb-5 text-lg font-bold text-gray-900 md:text-xl">{group.label}</h3>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {articles.map((a) => (
                      <GuideArticleCard key={a.href} article={a} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
