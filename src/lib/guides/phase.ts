import type { GuidePhase } from '@/lib/microcms/types';

const GUIDE_PHASE_VALUES = new Set<GuidePhase>([
  'info-gathering',
  'visa-cost',
  'departure-prep',
  'arrival',
  'work',
  'housing',
  'language-life',
  'safety-mental',
  'return-career',
]);

/**
 * microCMS のセレクト値は、未選択時に空配列、選択時に配列で返る場合がある。
 * 有効なガイド段階だけを返し、空配列や未知値を通常記事として扱う。
 */
export function normalizeGuidePhase(value: unknown): GuidePhase | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  return typeof candidate === 'string' && GUIDE_PHASE_VALUES.has(candidate as GuidePhase)
    ? candidate as GuidePhase
    : null;
}
