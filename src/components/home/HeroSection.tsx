'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';

// グレイン（印刷物の質感）の SVG ノイズ
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  // 写真（脇役）だけ控えめにパララックス。主役テキストは動かさず、去り際にフェード
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={ref}
        className="relative min-h-[88vh] overflow-hidden bg-primary-900 text-white"
      >
        {/* 写真（パララックス） */}
        <m.div
          className="absolute inset-0 z-0"
          style={reduce ? undefined : { y: imgY }}
        >
          <Image
            src="/hero/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </m.div>

        {/* 二層オーバーレイ（写真をブランド深緑に沈める） */}
        <div className="absolute inset-0 z-[1] bg-primary-900/35" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-tr from-primary-900/95 via-primary-900/55 to-transparent" />

        {/* グレイン */}
        <div
          className="absolute inset-0 z-[2] opacity-[0.06] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: GRAIN }}
        />

        {/* コピー（左下・非対称・特大。出現アニメは付けず去り際だけフェード＝LCP保護） */}
        <m.div
          className="container-custom relative z-10 flex min-h-[88vh] flex-col justify-end pb-24 pt-32 md:pb-32"
          style={reduce ? undefined : { opacity: textOpacity }}
        >
          <h1 className="max-w-4xl text-hero font-black text-white">
            世界へ、
            <br />
            踏み出す。
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
            費用・体験談・学校情報を、実際に行った人のデータから。あなたに合った一歩が、きっと見つかる。
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/matching"
              className="inline-flex items-center justify-center rounded-xl bg-accent-400 px-8 py-4 text-base font-bold text-primary-900 transition-all duration-200 ease-smooth hover:bg-accent-300 hover:shadow-glow-accent"
            >
              自分に合う国を診断する
            </Link>
            <Link
              href="/countries"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/10"
            >
              国から探す
            </Link>
          </div>
        </m.div>

        {/* スクロール誘導（アイコンなし・極細線＋英字） */}
        <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 md:flex">
          <span className="text-[10px] font-medium tracking-[0.3em]">SCROLL</span>
          <span className="h-10 w-px bg-white/30" />
        </div>
      </section>
    </LazyMotion>
  );
}
