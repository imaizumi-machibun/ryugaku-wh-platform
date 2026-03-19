import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="パンくずリスト" className="py-3">
      <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <li>
          <Link href="/" className="hover:text-primary-600 transition-colors">
            ホーム
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-gray-300">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-primary-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
