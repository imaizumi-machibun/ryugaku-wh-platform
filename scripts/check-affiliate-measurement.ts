import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  AFFILIATE_EVENT_NAMES,
  AFFILIATE_IMPRESSION_DWELL_MS,
  AFFILIATE_IMPRESSION_THRESHOLD,
  buildAffiliateEventParams,
  createAffiliateImpressionKey,
  detectAffiliateStoreFromSignals,
  hasDeniedAnalyticsConsent,
} from '../src/lib/affiliate-measurement';

assert.deepEqual(AFFILIATE_EVENT_NAMES, {
  impression: 'affiliate_impression',
  click: 'affiliate_click',
});
assert.equal(AFFILIATE_IMPRESSION_THRESHOLD, 0.5);
assert.equal(AFFILIATE_IMPRESSION_DWELL_MS, 1_000);

const params = buildAffiliateEventParams({
  affiliateNetwork: 'a8net',
  siteId: '025',
  programId: 's00000014257004',
  pagePath: '/services?utm_source=test#english',
  placementId: 'services:english-online:card',
  materialType: 'text',
});
assert.deepEqual(params, {
  affiliate_network: 'a8net',
  site_id: '025',
  program_id: 's00000014257004',
  page_path: '/services',
  placement_id: 'services:english-online:card',
  material_type: 'text',
});
assert.deepEqual(Object.keys(params).sort(), [
  'affiliate_network',
  'material_type',
  'page_path',
  'placement_id',
  'program_id',
  'site_id',
]);
assert.equal(
  createAffiliateImpressionKey(params),
  'a8net|025|s00000014257004|/services|services:english-online:card|text'
);

assert.equal(detectAffiliateStoreFromSignals(['Amazonで見る']), 'amazon');
assert.equal(detectAffiliateStoreFromSignals(['楽天市場で見る']), 'rakuten');
assert.equal(detectAffiliateStoreFromSignals(['Yahoo!ショッピングで見る']), 'yahoo');
assert.equal(
  detectAffiliateStoreFromSignals(['https://af.moshimo.com/af/c/click?p_id=54&pc_id=54']),
  'rakuten'
);
assert.equal(detectAffiliateStoreFromSignals(['商品を見る']), 'unknown');

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
const gtagArgumentsLike = {
  0: 'consent',
  1: 'update',
  2: { analytics_storage: 'denied' },
  length: 3,
} as unknown as IArguments;
assert.equal(
  hasDeniedAnalyticsConsent([
    gtagArgumentsLike,
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
assert.match(hookSource, /closest<HTMLAnchorElement>\('a'\)/);
assert.match(hookSource, /detectAffiliateStore\(anchor\)/);
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

const moshimoSource = readFileSync(
  resolve(process.cwd(), 'src/components/affiliate/MoshimoAffiliateCard.tsx'),
  'utf8'
);
assert.match(moshimoSource, /affiliateNetwork: 'moshimo'/);
assert.match(moshimoSource, /siteId: '686751'/);
assert.match(moshimoSource, /programId: 'moshimo-easy-link'/);
assert.match(moshimoSource, /placementId: 'article_inline_1'/);
assert.match(moshimoSource, /materialType: 'product_card'/);
assert.match(moshimoSource, /trackStore: true/);
const encodedMoshimoSource = moshimoSource.match(/SOURCE_B64\s*=\s*'([^']+)'/)?.[1];
assert.ok(encodedMoshimoSource, 'もしも広告HTMLが見つかりません');
assert.equal(
  createHash('sha256').update(encodedMoshimoSource).digest('hex'),
  '31c23e33a51f17ee8bc83a51938fabe133f104e6ed1f1cd4a64fd084c7157a57',
  'もしも広告HTML・URLは変更しないでください'
);

console.log('Affiliate measurement OK: unified schema / store / 50% for 1s / capture click');
