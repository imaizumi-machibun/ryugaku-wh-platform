import Image from 'next/image';
import type { SegmentMeta } from '@/lib/segments/types';

type Props = {
  seg: SegmentMeta;
  h1: string;
  lead?: string;
  /** 背景画像パス。未指定時は全絞り込み軸共通の街並みビジュアルを使用 */
  heroImage?: string;
};

export default function SegmentHero({ seg, h1, lead, heroImage }: Props) {
  const bg = heroImage ?? '/home/segment-hero.jpg';

  return (
    // container 内に収まる角丸の暗いグリーンバナー。
    // 重ね順は StatsOverview に準拠（写真 z-0 → グリーン下地+グラデ z-[1] → コンテンツ z-10）。
    <header className="section-dark grain relative mb-8 overflow-hidden rounded-2xl">
      {/* 背景写真。グリーンで深く沈めて白文字の可読性を確保 */}
      <div className="absolute inset-0 z-0">
        <Image src={bg} alt="" fill sizes="100vw" priority className="object-cover" />
      </div>
      <div className="absolute inset-0 z-[1] bg-primary-900/85" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-tr from-primary-900/95 via-primary-900/80 to-primary-900/65" />

      <div className="relative z-10 px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16">
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
          {h1}
        </h1>
        {(lead ?? seg.heroLead) && (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            {lead ?? seg.heroLead}
          </p>
        )}
      </div>
    </header>
  );
}
