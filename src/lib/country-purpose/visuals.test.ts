import assert from 'node:assert/strict';
import test from 'node:test';
import { COUNTRY_PURPOSE_VISUALS, getCountryPurposeVisuals } from './visuals';

test('アルゼンチンワーホリにUnsplashのヒーロー1枚と記事内2枚がある', () => {
  const visuals = getCountryPurposeVisuals('argentina', 'working-holiday');

  assert.ok(visuals);
  assert.equal(visuals.inline.length, 2);
  assert.equal(getCountryPurposeVisuals('argentina', 'study-abroad'), undefined);
});

test('登録画像は直接画像URL・出典・作者・原寸を持ち、重複しない', () => {
  for (const [key, visualSet] of Object.entries(COUNTRY_PURPOSE_VISUALS)) {
    const visuals = [visualSet.hero, ...visualSet.inline];
    assert.equal(new Set(visuals.map((visual) => visual.src)).size, visuals.length, key);

    for (const visual of visuals) {
      assert.equal(new URL(visual.src).hostname, 'images.unsplash.com');
      assert.equal(new URL(visual.sourceUrl).hostname, 'unsplash.com');
      assert.match(new URL(visual.sourceUrl).pathname, /^\/photos\//);
      assert.equal(new URL(visual.photographerProfileUrl).hostname, 'unsplash.com');
      assert.match(new URL(visual.photographerProfileUrl).pathname, /^\/@/);
      assert.ok(visual.width > 0);
      assert.ok(visual.height > 0);
      assert.ok(visual.alt.length >= 15);
      assert.ok(visual.caption.length >= 20);
      assert.ok(visual.photographerName.length > 0);
    }
  }
});
