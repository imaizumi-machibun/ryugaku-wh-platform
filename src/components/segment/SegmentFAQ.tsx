import type { SegmentFAQ as FAQ } from '@/lib/segments/types';

type Props = {
  faqs: FAQ[];
  title?: string;
  className?: string;
};

export default function SegmentFAQ({ faqs, title = 'よくある質問', className = '' }: Props) {
  if (faqs.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group overflow-hidden rounded-xl border border-gray-200"
          >
            <summary className="flex cursor-pointer list-none items-start gap-3 bg-white px-5 py-4 hover:bg-gray-50">
              <span className="mt-0.5 shrink-0 font-bold text-primary-600" aria-hidden="true">
                Q.
              </span>
              <span className="flex-1 text-sm font-semibold text-gray-900">{faq.question}</span>
              <span
                className="shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                ▼
              </span>
            </summary>
            <div className="whitespace-pre-line border-t border-gray-200 bg-gray-50 px-5 py-4 text-sm leading-relaxed text-gray-800">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
