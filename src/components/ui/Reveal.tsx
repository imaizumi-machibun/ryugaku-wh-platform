'use client';

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** 表示開始までの遅延（ms） */
  delay?: number;
  className?: string;
  /** 立ち上がりの移動量(px) */
  y?: number;
};

/**
 * スクロールで可視領域に入ったら、上品なイージングで opacity+y+blur フェードイン。
 * ラッパーのみクライアントで、children はサーバーコンポーネントのまま渡せる。
 * prefers-reduced-motion 時は初期状態を付けず即表示（LCP/アクセシビリティ保護）。
 */
export default function Reveal({ children, delay = 0, className = '', y = 24 }: Props) {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial={reduce ? false : { opacity: 0, y, filter: 'blur(6px)' }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
