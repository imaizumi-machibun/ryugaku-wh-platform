type KeyTakeawayProps = {
  items: string[];
  title?: string;
};

export default function KeyTakeaway({
  items,
  title = 'この記事でわかること',
}: KeyTakeawayProps) {
  return (
    <aside className="mb-8 rounded-2xl border border-primary-100 bg-primary-50 p-6">
      <p className="mb-3 text-sm font-bold text-primary-900">{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-primary-900">
            <span className="mt-0.5 shrink-0 font-bold text-accent-600" aria-hidden="true">
              ▸
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
