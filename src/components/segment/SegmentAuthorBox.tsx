const DEFAULT_NAME = 'Study Work Hub 編集部';
const DEFAULT_BIO =
  '留学・ワーキングホリデー経験者と国内SEO/コンテンツチームが、各国の最新情報を一次情報ベースで監修しています。費用試算は公式機関の発表・現地大使館サイト・実体験者の声をもとに、毎月内容を更新しています。';

type Props = {
  name?: string;
  bio?: string;
  className?: string;
};

export default function SegmentAuthorBox({ name = DEFAULT_NAME, bio = DEFAULT_BIO, className = '' }: Props) {
  const initials = name.replace('Study Work Hub ', '').slice(0, 2);
  return (
    <aside className={`mt-12 mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6 ${className}`}>
      <p className="text-xs font-semibold text-gray-500 mb-3">この記事の執筆・監修</p>
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900">{name}</p>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{bio}</p>
        </div>
      </div>
    </aside>
  );
}
