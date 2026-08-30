import Link from 'next/link';
import type { SegmentType } from '@/lib/segments/types';
import { buildCrossAxisLinks } from '@/lib/segments/cross-axis';

type LinkItem = {
  label: string;
  href: string;
  description?: string;
};

type Section = {
  title: string;
  links: LinkItem[];
};

type Props = {
  sections: Section[];
  // 指定すると「ほかの切り口で探す」横断ナビを末尾に表示する。
  // 値は現在いる軸（その軸自身はナビから除外される）。
  crossAxis?: SegmentType;
  className?: string;
};

const COLS_CLASS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
};

export default function SegmentRelatedLinks({ sections, crossAxis, className = '' }: Props) {
  const crossAxisLinks = crossAxis !== undefined ? buildCrossAxisLinks(crossAxis) : [];
  if (sections.length === 0 && crossAxisLinks.length === 0) return null;
  const colsClass = COLS_CLASS[Math.min(sections.length, 3)] ?? 'md:grid-cols-3';
  return (
    <div className={className}>
      {sections.length > 0 && (
        <section className={`grid grid-cols-1 ${colsClass} gap-6`}>
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-700 hover:text-primary-900 hover:underline block"
                    >
                      {link.label}
                    </Link>
                    {link.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {crossAxisLinks.length > 0 && (
        <div className={sections.length > 0 ? 'mt-8 pt-6 border-t border-gray-200' : ''}>
          <h3 className="text-sm font-bold text-gray-900 mb-3">ほかの切り口で探す</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {crossAxisLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block border border-gray-200 rounded-lg p-3 hover:border-primary-400 hover:bg-primary-50/30"
              >
                <p className="font-semibold text-sm text-primary-700">{link.label}</p>
                <p className="text-xs text-gray-500 mt-1">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
