import Link from 'next/link';

type MidCTAProps = {
  title: string;
  description?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function MidCTA({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: MidCTAProps) {
  return (
    <aside className="my-12 rounded-2xl border border-primary-100 bg-primary-50 p-6 text-center sm:p-8">
      <h3 className="mb-2 text-lg font-bold text-primary-900 sm:text-xl">{title}</h3>
      {description && (
        <p className="mb-5 text-sm leading-relaxed text-primary-800">{description}</p>
      )}
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={primaryHref}
          className="inline-block rounded-xl bg-accent-400 px-6 py-3 text-sm font-bold text-primary-900 transition-all hover:bg-accent-500 hover:shadow-glow-accent"
        >
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-block rounded-xl border border-primary-200 bg-white px-6 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </aside>
  );
}
