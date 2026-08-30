import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/microcms/types';
import { ARTICLE_CATEGORIES } from '@/lib/utils/constants';
import { formatDate } from '@/lib/utils/format';
import { getArticleImage } from '@/lib/utils/article-images';

type Props = {
  article: Article;
  /** タイトルの見出しレベル（一覧では h2、サイドのリストでは h3 など） */
  headingLevel?: 'h2' | 'h3';
};

export default function ArticleCard({ article, headingLevel = 'h2' }: Props) {
  const catLabel = ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.label;
  const imageSrc = getArticleImage(article);
  const Heading = headingLevel;

  return (
    <Link
      href={`/articles/${article.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* アイキャッチ画像（グリーン微オーバーレイ + カテゴリバッジ） */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary-900/5">
        <Image
          src={imageSrc}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.04]"
        />
        {/* サイトのトーンに馴染ませるグリーンの微オーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/35 via-primary-900/5 to-transparent" />
        {catLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-700 shadow-sm backdrop-blur-sm">
            {catLabel}
          </span>
        )}
      </div>

      {/* テキスト */}
      <div className="flex flex-1 flex-col p-5">
        <Heading className="line-clamp-3 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary-700">
          {article.title}
        </Heading>
        {article.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {article.description}
          </p>
        )}
        <p className="mt-4 pt-1 text-xs tabular-nums text-gray-400">
          {formatDate(article.publishedAt || article.createdAt)}
        </p>
      </div>
    </Link>
  );
}
