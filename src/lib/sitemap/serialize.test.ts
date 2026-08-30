import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { SITE_URL } from '@/lib/utils/constants';
import { serializeSitemapIndex, serializeUrlset } from './serialize';

test('本番URLの既定値にexample.comや空白を含めない', () => {
  assert.equal(SITE_URL, 'https://study-work-hub.com');
  assert.equal(SITE_URL, SITE_URL.trim());
  assert.doesNotMatch(SITE_URL, /example\.com/);
});

test('サイトマップのlocを改行なしの絶対URLで出力する', () => {
  const indexXml = serializeSitemapIndex([
    { loc: `${SITE_URL}/sitemap-countries.xml` },
  ]);
  const urlsetXml = serializeUrlset([
    { url: `${SITE_URL}/countries/denmark` },
  ]);

  assert.match(
    indexXml,
    /<loc>https:\/\/study-work-hub\.com\/sitemap-countries\.xml<\/loc>/
  );
  assert.match(
    urlsetXml,
    /<loc>https:\/\/study-work-hub\.com\/countries\/denmark<\/loc>/
  );
  assert.doesNotMatch(`${indexXml}\n${urlsetXml}`, /example\.com|<loc>[^<]*\n[^<]*<\/loc>/);
});

test('robots.txtは本番サイトマップを案内し、比較ハブを拒否しない', () => {
  const robots = readFileSync('public/robots.txt', 'utf8');

  assert.match(robots, /Sitemap: https:\/\/study-work-hub\.com\/sitemap\.xml/);
  assert.doesNotMatch(robots, /example\.com|Disallow: \/compare/);
  assert.match(robots, /User-agent: Googlebot[\s\S]*Disallow: \/api\//);
  assert.match(robots, /User-agent: Googlebot-Image[\s\S]*Disallow: \/api\//);
  assert.match(robots, /User-agent: Twitterbot[\s\S]*Allow: \/api\/og/);
  assert.match(robots, /Disallow: \/submit\//);
  assert.match(robots, /Disallow: \/embed\//);
  assert.doesNotMatch(robots, /Disallow: \/_next\/static/);
});
