type InPageTOCProps = {
  headings: { id: string; label: string }[];
  defaultOpen?: boolean;
};

export default function InPageTOC({ headings, defaultOpen = false }: InPageTOCProps) {
  if (headings.length === 0) return null;

  return (
    <details
      className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4 group"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-bold text-gray-800">
        <span className="flex items-center gap-2">
          <span aria-hidden="true">📑</span>
          目次（{headings.length}項目）
        </span>
        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <nav className="mt-3">
        <ol className="space-y-1">
          {headings.map((h, i) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className="block min-h-[44px] flex items-center text-sm text-primary-600 hover:underline hover:bg-white rounded px-3"
              >
                <span className="text-gray-400 mr-2 shrink-0">{i + 1}.</span>
                <span>{h.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
