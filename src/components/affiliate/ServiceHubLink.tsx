import Link from 'next/link';
import type { AffiliateIntent } from '@/lib/affiliate-programs';

type Props = {
  intent: AffiliateIntent;
  title: string;
  description: string;
};

export default function ServiceHubLink({ intent, title, description }: Props) {
  return (
    <aside className="my-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
      <p className="mb-2 text-xs font-bold text-amber-800">広告（PR）</p>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mb-4 text-sm leading-6 text-gray-700">{description}</p>
      <Link
        href={`/services#${intent}`}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary-700 px-5 py-3 text-sm font-bold text-white hover:bg-primary-800"
      >
        広告掲載サービスを確認する
      </Link>
    </aside>
  );
}
