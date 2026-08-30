type ArticleMetaBadgeProps = {
  readingMinutes: number;
  updatedAt: string;
  targetAudience?: string;
};

export default function ArticleMetaBadge({
  readingMinutes,
  updatedAt,
  targetAudience,
}: ArticleMetaBadgeProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2 text-xs">
      <span className="rounded-full bg-primary-50 px-3 py-1 font-medium text-primary-700">
        約{readingMinutes}分で読めます
      </span>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">更新 {updatedAt}</span>
      {targetAudience && (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">{targetAudience}</span>
      )}
    </div>
  );
}
