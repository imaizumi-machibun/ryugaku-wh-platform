export const AFFILIATE_IMPRESSION_THRESHOLD = 0.5;
export const AFFILIATE_IMPRESSION_DWELL_MS = 1_000;

export const AFFILIATE_EVENT_NAMES = {
  impression: 'affiliate_impression',
  click: 'affiliate_click',
} as const;

export type AffiliateEventName =
  (typeof AFFILIATE_EVENT_NAMES)[keyof typeof AFFILIATE_EVENT_NAMES];

export type AffiliateMaterialType = 'banner' | 'text';

export interface AffiliateEventInput {
  siteId: string;
  programId: string;
  pagePath: string;
  placementId: string;
  materialType: AffiliateMaterialType;
}

export interface AffiliateEventParams extends Record<string, unknown> {
  site_id: string;
  program_id: string;
  page_path: string;
  placement_id: string;
  material_type: AffiliateMaterialType;
}

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: Record<string, unknown>) => void;
    dataLayer?: unknown[];
    doNotTrack?: string;
  }
}

export function normalizePagePath(value: string): string {
  const pathOnly = value.split(/[?#]/, 1)[0]?.trim() || '/';
  return pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
}

export function buildAffiliateEventParams(
  input: AffiliateEventInput
): AffiliateEventParams {
  return {
    site_id: input.siteId,
    program_id: input.programId,
    page_path: normalizePagePath(input.pagePath),
    placement_id: input.placementId,
    material_type: input.materialType,
  };
}

export function createAffiliateImpressionKey(
  params: AffiliateEventParams
): string {
  return [
    params.site_id,
    params.program_id,
    params.page_path,
    params.placement_id,
  ].join('|');
}

function asDataLayerCommand(entry: unknown): unknown[] | null {
  if (Array.isArray(entry)) return entry;
  if (!entry || typeof entry !== 'object' || !('length' in entry)) return null;

  try {
    return Array.from(entry as ArrayLike<unknown>);
  } catch {
    return null;
  }
}

/** Consent Modeの最新状態がanalytics_storage=deniedなら独自イベントも送らない。 */
export function hasDeniedAnalyticsConsent(dataLayer: readonly unknown[] = []): boolean {
  let analyticsStorage: unknown;

  for (const entry of dataLayer) {
    const command = asDataLayerCommand(entry);
    if (
      command?.[0] !== 'consent' ||
      (command[1] !== 'default' && command[1] !== 'update')
    ) {
      continue;
    }

    const settings = command[2];
    if (settings && typeof settings === 'object' && 'analytics_storage' in settings) {
      analyticsStorage = (settings as { analytics_storage?: unknown }).analytics_storage;
    }
  }

  return analyticsStorage === 'denied';
}

export function canSendAffiliateAnalytics(measurementId: string): boolean {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false;

  const browserState = window as unknown as Record<string, unknown>;
  if (browserState[`ga-disable-${measurementId}`] === true) return false;

  const navigatorPrivacy = window.navigator as Navigator & {
    globalPrivacyControl?: boolean;
    doNotTrack?: string;
  };
  if (
    navigatorPrivacy.globalPrivacyControl === true ||
    navigatorPrivacy.doNotTrack === '1' ||
    window.doNotTrack === '1'
  ) {
    return false;
  }

  return !hasDeniedAnalyticsConsent(window.dataLayer);
}

export function sendAffiliateEvent(
  eventName: AffiliateEventName,
  input: AffiliateEventInput,
  measurementId: string
): boolean {
  if (!canSendAffiliateAnalytics(measurementId)) return false;

  window.gtag?.('event', eventName, buildAffiliateEventParams(input));
  return true;
}
