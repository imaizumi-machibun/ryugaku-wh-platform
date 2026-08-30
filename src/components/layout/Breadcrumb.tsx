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
    <nav aria-label="パンくずリスト" className="py-3 overflow-x-auto">
      <ol
        className="flex items-center gap-2 text-sm text-gray-500 flex-wrap"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link
            href="/"
            className="hover:text-primary-600 transition-colors"
            itemProp="item"
          >
            <span itemProp="name">ホーム</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-2 whitespace-nowrap"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <span className="text-gray-300" aria-hidden="true">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-primary-600 transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="text-gray-800" itemProp="name" aria-current="page">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(i + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
