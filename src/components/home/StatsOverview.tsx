import Image from 'next/image';
import CountUp from '@/components/ui/CountUp';

type Props = {
  countryCount: number;
  schoolCount: number;
  experienceCount: number;
  reviewCount: number;
};

export default function StatsOverview({
  countryCount,
  schoolCount,
  experienceCount,
  reviewCount,
}: Props) {
  const stats = [
    { value: countryCount, unit: 'カ国', label: '対応国数' },
    { value: schoolCount, unit: '校', label: '語学学校データ' },
    { value: experienceCount, unit: '件', label: '体験談' },
    { value: reviewCount, unit: '件', label: '学校口コミ' },
  ];

  return (
    <section className="section-dark grain relative overflow-hidden py-20 text-white md:py-28">
      {/* 背景写真（世界の広がり）。グリーンで深く沈めて数字の可読性を確保 */}
      <div className="absolute inset-0 z-0">
        <Image src="/home/stats-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 z-[1] bg-primary-900/85" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-tr from-primary-900/95 via-primary-900/80 to-primary-900/65" />
      <div className="container-custom relative z-10">
        <h2 className="mb-12 max-w-3xl text-display font-black text-white">
          経験者のデータが、
          <br className="hidden sm:block" />
          あなたの判断材料になる。
        </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-0 md:divide-x md:divide-white/15">
          {stats.map((s) => (
            <div key={s.label} className="md:px-8 md:first:pl-0">
              <p className="text-stat font-black tabular-nums text-white">
                <CountUp value={s.value} />
                <span className="ml-1 align-baseline text-xl font-medium text-white/50 md:text-2xl">
                  {s.unit}
                </span>
              </p>
              <p className="mt-2 text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-white/45">
          ※ 全口コミ・体験談は、実際に渡航した経験者のみが投稿できます
        </p>
      </div>
    </section>
  );
}
