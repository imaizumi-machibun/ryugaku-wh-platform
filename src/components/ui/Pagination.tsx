import Link from 'next/link';

type Props = {
  totalCount: number;
  perPage: number;
  currentPage: number;
  basePath: string;
  searchParams?: Record<string, string>;
};

export default function Pagination({
  totalCount,
  perPage,
  currentPage,
  basePath,
  searchParams = {},
}: Props) {
  const totalPages = Math.ceil(totalCount / perPage);
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) params.set('page', String(page));
    else params.delete('page');
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav aria-label="ページネーション" className="flex justify-center mt-8">
      <ul className="flex items-center gap-1">
        {currentPage > 1 && (
          <li>
            <Link
              href={buildHref(currentPage - 1)}
              className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              前へ
            </Link>
          </li>
        )}
        {pages.map((page, i) =>
          page === '...' ? (
            <li key={`dots-${i}`} className="px-2 text-gray-400">...</li>
          ) : (
            <li key={page}>
              <Link
                href={buildHref(page)}
                className={`px-3 py-2 text-sm rounded-md ${
                  page === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </Link>
            </li>
          )
        )}
        {currentPage < totalPages && (
          <li>
            <Link
              href={buildHref(currentPage + 1)}
              className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              次へ
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
