import Image from 'next/image';
import Link from 'next/link';
import type { Experience } from '@/lib/microcms/types';
import ExperienceCard from '@/components/experience/ExperienceCard';

type Props = {
  experiences: Experience[];
};

export default function LatestExperiences({ experiences }: Props) {
  if (experiences.length === 0) return null;

  return (
    <section className="section-dark grain relative overflow-hidden py-16 text-white md:py-24">
      {/* 背景写真（学びの空間）。カードの可読性のため濃いめに沈める */}
      <div className="absolute inset-0 z-0">
        <Image src="/home/experiences-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 z-[1] bg-primary-900/90" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-primary-900/95 via-primary-900/88 to-primary-900/92" />
      <div className="container-custom relative z-10">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="text-display font-black text-white">最新の体験談</h2>
          <Link href="/experiences" className="shrink-0 text-sm font-bold text-accent-300 transition-opacity hover:opacity-80">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}
