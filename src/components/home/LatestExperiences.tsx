import Link from 'next/link';
import type { Experience } from '@/lib/microcms/types';
import ExperienceCard from '@/components/experience/ExperienceCard';

type Props = {
  experiences: Experience[];
};

export default function LatestExperiences({ experiences }: Props) {
  if (experiences.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">最新の体験談</h2>
          <Link href="/experiences" className="text-primary-600 hover:underline text-sm">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}
