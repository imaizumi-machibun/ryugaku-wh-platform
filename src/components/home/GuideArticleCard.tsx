import Link from 'next/link';
import { ARTICLE_CATEGORIES } from '@/lib/utils/constants';
import type { GuideArticle } from '@/lib/data/guide-articles';

export default function GuideArticleCard({ article }: { article: GuideArticle }) {
  const catLabel = ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.label ?? '';

  return (
    <Link
      href={article.href}
      className="group flex h-full flex-col justify-between border-t-2 border-gray-900 bg-white p-5 transition-colors hover:bg-gray-50/70"
    >
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-600">
          {catLabel}
        </p>
        <h4 className="text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary-700">
          {article.title}
        </h4>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {article.description}
        </p>
      </div>
      <span className="mt-5 text-sm font-bold text-primary-600">
        読む
        <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
