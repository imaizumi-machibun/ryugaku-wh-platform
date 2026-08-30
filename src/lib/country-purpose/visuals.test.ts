import assert from 'node:assert/strict';
import test from 'node:test';
import { COUNTRY_PURPOSE_GUIDES } from './registry';
import { COUNTRY_PURPOSE_VISUALS, getCountryPurposeVisuals } from './visuals';

test('アルゼンチンワーホリにUnsplashのヒーロー1枚と記事内2枚がある', () => {
  const visuals = getCountryPurposeVisuals('argentina', 'working-holiday');

  assert.ok(visuals);
  assert.equal(visuals.inline.length, 2);
  assert.equal(getCountryPurposeVisuals('argentina', 'study-abroad'), undefined);
});

test('登録画像は直接画像URL・出典・作者・原寸を持ち、重複しない', () => {
  const allImages: string[] = [];
  const allSources: string[] = [];

  for (const [key, visualSet] of Object.entries(COUNTRY_PURPOSE_VISUALS)) {
    const visuals = [visualSet.hero, ...visualSet.inline];
    assert.equal(visualSet.inline.length, 2, key);
    assert.equal(new Set(visuals.map((visual) => visual.src)).size, visuals.length, key);

    for (const visual of visuals) {
      allImages.push(visual.src);
      allSources.push(visual.sourceUrl);
      assert.equal(new URL(visual.src).hostname, 'images.unsplash.com');
      assert.equal(new URL(visual.sourceUrl).hostname, 'unsplash.com');
      assert.match(new URL(visual.sourceUrl).pathname, /^\/photos\//);
      assert.equal(new URL(visual.photographerProfileUrl).hostname, 'unsplash.com');
      assert.match(new URL(visual.photographerProfileUrl).pathname, /^\/@/);
      assert.ok(visual.width > 0);
      assert.ok(visual.height > 0);
      assert.ok(visual.alt.length >= 15, `${key}: alt=${visual.alt}`);
      assert.ok(visual.caption.length >= 20, `${key}: caption=${visual.caption}`);
      assert.ok(visual.photographerName.length > 0);
    }
  }

  assert.equal(new Set(allImages).size, allImages.length, '直接画像URLは全ページ横断で一意');
  assert.equal(new Set(allSources).size, allSources.length, '写真ページは全ページ横断で一意');
});

test('公開登録されたすべての目的別ページにヒーロー1枚と本文画像2枚がある', () => {
  assert.ok(COUNTRY_PURPOSE_GUIDES.length > 0);

  for (const definition of COUNTRY_PURPOSE_GUIDES) {
    const visuals = getCountryPurposeVisuals(definition.countrySlug, definition.purpose);
    assert.ok(visuals, `${definition.countrySlug}:${definition.purpose}`);
    assert.equal(visuals.inline.length, 2, `${definition.countrySlug}:${definition.purpose}`);
  }
});
