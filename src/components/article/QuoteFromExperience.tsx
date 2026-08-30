import Link from 'next/link';
import type { Experience } from '@/lib/microcms/types';

type QuoteFromExperienceProps = {
  text: string;
  experience: Experience;
  truncated?: boolean;
};

function formatYearMonth(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

function genderLabel(g?: string): string | null {
  if (g === 'male') return '男性';
  if (g === 'female') return '女性';
  return null;
}

function durationLabel(months?: number): string {
  if (!months) return '';
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const remainder = months % 12;
    return remainder === 0 ? `${years}年` : `${years}年${remainder}ヶ月`;
  }
  return `${months}ヶ月`;
}

export default function QuoteFromExperience({
  text,
  experience,
  truncated = false,
}: QuoteFromExperienceProps) {
  const gender = genderLabel(experience.gender);
  const age = experience.ageAtDeparture ? `${experience.ageAtDeparture}歳` : '年齢非公開';
  const place = `${experience.country?.nameJp ?? ''}${experience.cityPrimary ? `・${experience.cityPrimary}` : ''}`;
  const duration = durationLabel(experience.durationMonths);
  const yearMonth = formatYearMonth(experience.publishedAt || experience.createdAt);
  const rating = experience.ratingOverall?.toFixed(1);

  const attributes = [gender, age, place, duration, rating ? `★${rating}` : null, yearMonth]
    .filter(Boolean) as string[];

  return (
    <figure className="my-6 border-l-4 border-primary-300 bg-gray-50 pl-4 pr-4 py-4 rounded-r-lg">
      <blockquote className="text-sm text-gray-800 leading-relaxed italic">
        <span aria-hidden="true" className="text-2xl text-primary-300 leading-none align-text-top mr-1">
          “
        </span>
        {text}
        {truncated && '（一部抜粋）'}
      </blockquote>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600">
        {attributes.map((attr, i) => (
          <span key={i} className="bg-white border border-gray-200 rounded-full px-2 py-0.5">
            {attr}
          </span>
        ))}
        {experience.id && (
          <Link
            href={`/experiences/${experience.id}`}
            className="text-primary-600 hover:underline ml-1"
          >
            体験談を読む →
          </Link>
        )}
      </figcaption>
    </figure>
  );
}
