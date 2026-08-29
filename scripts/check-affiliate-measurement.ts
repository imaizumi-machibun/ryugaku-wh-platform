import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  AFFILIATE_EVENT_NAMES,
  AFFILIATE_IMPRESSION_DWELL_MS,
  AFFILIATE_IMPRESSION_THRESHOLD,
  buildAffiliateEventParams,
  createAffiliateImpressionKey,
  hasDeniedAnalyticsConsent,
} from '../src/lib/affiliate-measurement';

assert.deepEqual(AFFILIATE_EVENT_NAMES, {
  impression: 'affiliate_impression',
  click: 'affiliate_click',
});
assert.equal(AFFILIATE_IMPRESSION_THRESHOLD, 0.5);
assert.equal(AFFILIATE_IMPRESSION_DWELL_MS, 1_000);

const params = buildAffiliateEventParams({
  siteId: '025',
  programId: 's00000014257004',
  pagePath: '/services?utm_source=test#english',
  placementId: 'services:english-online:card',
  materialType: 'text',
});
assert.deepEqual(params, {
  site_id: '025',
  program_id: 's00000014257004',
  page_path: '/services',
  placement_id: 'services:english-online:card',
  material_type: 'text',
});
assert.deepEqual(Object.keys(params).sort(), [
  'material_type',
  'page_path',
  'placement_id',
  'program_id',
  'site_id',
]);
assert.equal(
  createAffiliateImpressionKey(params),
  '025|s00000014257004|/services|services:english-online:card'
);

assert.equal(
  hasDeniedAnalyticsConsent([
    ['consent', 'default', { analytics_storage: 'denied' }],
  ]),
  true
);
assert.equal(
  hasDeniedAnalyticsConsent([
    ['consent', 'default', { analytics_storage: 'denied' }],
    ['consent', 'update', { analytics_storage: 'granted' }],
  ]),
  false
);
function asGtagArguments(..._args: unknown[]): IArguments {
  return arguments;
}
assert.equal(
  hasDeniedAnalyticsConsent([
    asGtagArguments('consent', 'update', { analytics_storage: 'denied' }),
  ]),
  true,
  'gtagがdataLayerへ積むArguments形式も判定すること'
);

const hookSource = readFileSync(
  resolve(process.cwd(), 'src/components/affiliate/useAffiliateMeasurement.ts'),
  'utf8'
);
assert.match(hookSource, /new IntersectionObserver/);
assert.match(hookSource, /onClickCapture/);
assert.match(hookSource, /closest\('a'\)/);
assert.match(hookSource, /window\.location\.pathname/g);
assert.doesNotMatch(hookSource, /location\.(?:search|hash|href)/);
assert.doesNotMatch(hookSource, /referrer|user_agent|userAgent/i);

const wrapperSource = readFileSync(
  resolve(process.cwd(), 'src/components/affiliate/A8TextAd.tsx'),
  'utf8'
);
assert.match(wrapperSource, /onClickCapture=\{affiliateMeasurement\.onClickCapture\}/);
assert.match(wrapperSource, /data-affiliate-placement-id=\{placementId\}/);
assert.match(wrapperSource, /data-affiliate-material-type="text"/);
assert.equal(
  wrapperSource.match(/dangerouslySetInnerHTML=\{\{ __html: html \}\}/g)?.length,
  1,
  'A8生成HTMLは従来どおり1箇所で全文描画すること'
);

console.log('Affiliate measurement OK: GA4 safe params / 50% for 1s / capture click');
