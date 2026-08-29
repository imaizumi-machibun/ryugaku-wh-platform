'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import {
  AFFILIATE_EVENT_NAMES,
  AFFILIATE_IMPRESSION_DWELL_MS,
  AFFILIATE_IMPRESSION_THRESHOLD,
  buildAffiliateEventParams,
  createAffiliateImpressionKey,
  sendAffiliateEvent,
  type AffiliateMaterialType,
} from '@/lib/affiliate-measurement';

const sentImpressions = new Set<string>();

interface UseAffiliateMeasurementOptions {
  enabled?: boolean;
  measurementId: string;
  siteId: string;
  programId: string;
  placementId: string;
  materialType: AffiliateMaterialType;
}

export function useAffiliateMeasurement<TElement extends HTMLElement>({
  enabled = true,
  measurementId,
  siteId,
  programId,
  placementId,
  materialType,
}: UseAffiliateMeasurementOptions) {
  const elementRef = useRef<TElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!enabled || !element || typeof IntersectionObserver === 'undefined') return;

    const pagePath = window.location.pathname;
    const input = { siteId, programId, pagePath, placementId, materialType };
    const impressionKey = createAffiliateImpressionKey(
      buildAffiliateEventParams(input)
    );
    if (sentImpressions.has(impressionKey)) return;

    let dwellTimer: number | undefined;
    const clearDwellTimer = () => {
      if (dwellTimer === undefined) return;
      window.clearTimeout(dwellTimer);
      dwellTimer = undefined;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < AFFILIATE_IMPRESSION_THRESHOLD) {
          clearDwellTimer();
          return;
        }
        if (dwellTimer !== undefined || sentImpressions.has(impressionKey)) return;

        dwellTimer = window.setTimeout(() => {
          dwellTimer = undefined;
          if (
            sendAffiliateEvent(
              AFFILIATE_EVENT_NAMES.impression,
              input,
              measurementId
            )
          ) {
            sentImpressions.add(impressionKey);
            observer.disconnect();
          }
        }, AFFILIATE_IMPRESSION_DWELL_MS);
      },
      { threshold: AFFILIATE_IMPRESSION_THRESHOLD }
    );

    observer.observe(element);
    return () => {
      clearDwellTimer();
      observer.disconnect();
    };
  }, [enabled, materialType, measurementId, placementId, programId, siteId]);

  const onClickCapture = useCallback(
    (event: ReactMouseEvent<TElement>) => {
      if (!enabled) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a');
      if (!anchor || !event.currentTarget.contains(anchor)) return;

      sendAffiliateEvent(
        AFFILIATE_EVENT_NAMES.click,
        {
          siteId,
          programId,
          pagePath: window.location.pathname,
          placementId,
          materialType,
        },
        measurementId
      );
    },
    [enabled, materialType, measurementId, placementId, programId, siteId]
  );

  return { elementRef, onClickCapture };
}
