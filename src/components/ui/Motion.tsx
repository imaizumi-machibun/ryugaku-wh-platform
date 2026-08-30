'use client';

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 子要素を時間差（stagger）で順に出現させるグループ。
 * <RevealGroup><RevealItem>...</RevealItem>...</RevealGroup> の形で使う。
 */
export function RevealGroup({
  children,
  className = '',
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, margin: '-60px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

/** RevealGroup の子。親の stagger に乗って順に出現する。 */
export function RevealItem({
  children,
  className = '',
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
    >
      {children}
    </m.div>
  );
}
