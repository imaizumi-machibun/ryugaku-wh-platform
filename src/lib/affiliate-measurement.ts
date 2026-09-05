export const AFFILIATE_IMPRESSION_THRESHOLD = 0.5;
export const AFFILIATE_IMPRESSION_DWELL_MS = 1_000;

export const AFFILIATE_EVENT_NAMES = {
  impression: 'affiliate_impression',
  click: 'affiliate_click',
} as const;

export type AffiliateEventName =
  (typeof AFFILIATE_EVENT_NAMES)[keyof typeof AFFILIATE_EVENT_NAMES];

export type AffiliateMaterialType = 'banner' | 'text' | 'product_card';
export type AffiliateStore = 'amazon' | 'rakuten' | 'yahoo' | 'unknown';

export interface AffiliateEventInput {
  affiliateNetwork: string;
  siteId: string;
  programId: string;
  pagePath: string;
  placementId: string;
  materialType: AffiliateMaterialType;
  store?: AffiliateStore;
}

export interface AffiliateEventParams extends Record<string, unknown> {
  affiliate_network: string;
  site_id: string;
  program_id: string;
  page_path: string;
  placement_id: string;
  material_type: AffiliateMaterialType;
  store?: AffiliateStore;
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
    affiliate_network: input.affiliateNetwork,
    site_id: input.siteId,
    program_id: input.programId,
    page_path: normalizePagePath(input.pagePath),
    placement_id: input.placementId,
    material_type: input.materialType,
    ...(input.store ? { store: input.store } : {}),
  };
}

export function detectAffiliateStoreFromSignals(
  signals: readonly (string | null | undefined)[]
): AffiliateStore {
  const normalized = signals
    .filter((signal): signal is string => Boolean(signal))
    .join(' ')
    .normalize('NFKC')
    .toLowerCase();

  if (/amazon|amzn|アマゾン|[?&](?:p_id|pc_id)=170(?:&|$)/.test(normalized)) {
    return 'amazon';
  }
  if (/rakuten|楽天|[?&](?:p_id|pc_id)=54(?:&|$)/.test(normalized)) {
    return 'rakuten';
  }
  if (/yahoo!?|ヤフー|[?&](?:p_id|pc_id)=1225(?:&|$)/.test(normalized)) {
    return 'yahoo';
  }
  return 'unknown';
}

export function detectAffiliateStore(anchor: HTMLAnchorElement): AffiliateStore {
  return detectAffiliateStoreFromSignals([
    anchor.dataset.store,
    anchor.dataset.shop,
    anchor.dataset.shopName,
    anchor.getAttribute('aria-label'),
    anchor.getAttribute('title'),
    anchor.textContent,
    anchor.querySelector('img')?.getAttribute('alt'),
    anchor.getAttribute('href'),
  ]);
}

export function createAffiliateImpressionKey(
  params: AffiliateEventParams
): string {
  return [
    params.affiliate_network,
    params.site_id,
    params.program_id,
    params.page_path,
    params.placement_id,
    params.material_type,
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
