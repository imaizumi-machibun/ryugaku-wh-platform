import Link from 'next/link';
import type { Experience } from '@/lib/microcms/types';
import Card from '@/components/ui/Card';
import StarRating from '@/components/ui/StarRating';
import { formatDuration, isNew } from '@/lib/utils/format';
import { GENDERS } from '@/lib/utils/constants';

type Props = { experience: Experience };

export default function ExperienceCard({ experience }: Props) {
  // 本人の「語り」を主役に。アドバイスがあれば優先し、なければ本文冒頭を引用
  const quote = (experience.advice || experience.content || '')
    .replace(/<[^>]+>/g, '')
    .trim();
  const genderLabel = GENDERS.find((g) => g.value === experience.gender)?.label;
  const meta = [
    experience.ageAtDeparture ? `${experience.ageAtDeparture}歳` : null,
    genderLabel,
    experience.durationMonths ? `滞在${formatDuration(experience.durationMonths)}` : null,
  ]
    .filter(Boolean)
    .join('・');

  return (
    <Link href={`/experiences/${experience.id}`}>
      <Card hover className="h-full">
        <div className="flex h-full flex-col p-6">
          {/* 大きな引用符＋本人の語り */}
          <span aria-hidden className="font-serif text-5xl leading-[0.5] text-primary-300">
            &ldquo;
          </span>
          <p className="mt-3 line-clamp-4 flex-1 text-[15px] leading-relaxed text-gray-800">
            {quote}
          </p>

          {/* 投稿者プロフィール（出身国は国旗で示す） */}
          <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl"
              aria-hidden
            >
              {experience.country?.flagEmoji ?? '🌍'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900">
                {experience.country?.nameJp}
                <span className="font-normal text-gray-400">／{experience.cityPrimary}</span>
              </p>
              {meta && <p className="truncate text-xs text-gray-500">{meta}</p>}
            </div>
            {isNew(experience.publishedAt || experience.createdAt) && (
              <span className="shrink-0 rounded-full bg-accent-400 px-2 py-0.5 text-[10px] font-bold text-primary-900">
                NEW
              </span>
            )}
          </div>
          <div className="mt-3">
            <StarRating rating={experience.ratingOverall} size="sm" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
