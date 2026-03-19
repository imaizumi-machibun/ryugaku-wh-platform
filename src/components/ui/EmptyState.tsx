import Link from 'next/link';

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: Props) {
  return (
    <div className="text-center py-16">
      <div className="text-gray-300 mb-4">
        {icon || (
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block bg-primary-600 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
