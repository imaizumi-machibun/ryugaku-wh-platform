import Link from 'next/link';

type Props = {
  href: string;
  label: string;
  subLabel?: string;
};

export default function SegmentStickyCTA({ href, label, subLabel }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-2 shadow-lg">
      <Link
        href={href}
        className="flex items-center justify-center gap-2 bg-primary-600 text-white font-bold text-sm py-3 rounded-xl"
      >
        <span>{label}</span>
        {subLabel && <span className="text-xs font-normal opacity-90">{subLabel}</span>}
      </Link>
    </div>
  );
}
