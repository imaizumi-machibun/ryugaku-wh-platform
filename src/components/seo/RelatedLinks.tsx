import Link from 'next/link';
import type { RelatedSection } from '@/lib/seo/relations';

type Props = {
  sections: RelatedSection[];
  variant?: 'card' | 'inline';
};

export default function RelatedLinks({ sections, variant = 'card' }: Props) {
  const visible = sections.filter((s) => s.links.length > 0);
  if (visible.length === 0) return null;

  if (variant === 'inline') {
    return (
      <nav aria-label="関連リンク" className="mt-8 space-y-6">
        {visible.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-bold mb-3 text-gray-900">{section.title}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {section.links.map((link, j) => (
                <li key={j}>
                  <Link
                    href={link.href}
                    className="block p-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg text-sm transition-colors border border-transparent hover:border-primary-200"
                  >
                    <span className="font-medium">{link.label}</span>
                    {link.description && (
                      <span className="block text-xs text-gray-500 mt-1">{link.description}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav
      aria-label="関連リンク"
      className="mt-12 bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-2xl p-6 md:p-8"
    >
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">関連情報・あわせて読みたい</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((section, i) => (
          <div key={i}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-primary-700 mb-3 border-b border-primary-200 pb-1">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link, j) => (
                <li key={j}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-primary-700 hover:underline transition-colors block leading-snug"
                  >
                    {link.label}
                    {link.description && (
                      <span className="block text-xs text-gray-500 mt-0.5">{link.description}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
