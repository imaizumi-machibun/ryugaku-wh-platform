import Image from 'next/image';
import type { Article } from '@/lib/microcms/types';

const DEFAULT_AUTHOR_NAME = 'Study Work Hub 編集部';
const DEFAULT_AUTHOR_BIO =
  '留学・ワーキングホリデー経験者と国内SEO/コンテンツチームが、各国の最新情報を一次情報ベースで監修しています。記事は公式機関の発表・現地大使館サイト・実体験者の声をもとに、毎月内容を更新しています。';

type Props = { article: Article };

// microCMS articles APIに将来追加予定の著者フィールドを安全に取り出すヘルパー。
// 現状は未登録のためフォールバック値（編集部）を返す。
function getAuthorInfo(article: Article): {
  name: string;
  bio: string;
  avatarUrl?: string;
} {
  const a = article as Article & {
    authorName?: string;
    authorBio?: string;
    authorAvatar?: { url: string };
  };
  return {
    name: a.authorName?.trim() || DEFAULT_AUTHOR_NAME,
    bio: a.authorBio?.trim() || DEFAULT_AUTHOR_BIO,
    avatarUrl: a.authorAvatar?.url,
  };
}

export default function AuthorBox({ article }: Props) {
  const author = getAuthorInfo(article);
  const initials = author.name.replace('Study Work Hub ', '').slice(0, 2);

  return (
    <aside className="mt-12 mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
      <p className="text-xs font-semibold text-gray-500 mb-3">この記事の執筆・監修</p>
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {author.avatarUrl ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={author.avatarUrl}
                alt={author.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
              {initials}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900">{author.name}</p>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{author.bio}</p>
        </div>
      </div>
    </aside>
  );
}
