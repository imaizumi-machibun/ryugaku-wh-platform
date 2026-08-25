import assert from 'node:assert/strict';
import test from 'node:test';

import { getCountryEditorialLinks, getCountrySeoOverride } from './country-overrides';

test('country pages and working-holiday articles have distinct search roles', () => {
  assert.match(getCountrySeoOverride('denmark')?.title ?? '', /ワーホリ/);
  assert.match(getCountrySeoOverride('austria')?.title ?? '', /ワーホリ/);
  assert.doesNotMatch(getCountrySeoOverride('estonia')?.title ?? '', /ワーホリ/);
  assert.doesNotMatch(getCountrySeoOverride('ireland')?.title ?? '', /ワーホリ/);
});

test('priority country pages link to their dedicated editorial guides', () => {
  assert.equal(getCountryEditorialLinks('denmark').length, 2);
  assert.equal(getCountryEditorialLinks('austria').length, 1);
  assert.equal(getCountryEditorialLinks('estonia').length, 1);
  assert.equal(getCountryEditorialLinks('ireland').length, 1);
  assert.deepEqual(getCountryEditorialLinks('unknown'), []);

  for (const slug of ['denmark', 'austria', 'estonia', 'ireland']) {
    for (const link of getCountryEditorialLinks(slug)) {
      assert.match(link.href, /^\/articles\/[a-z0-9-]+$/);
    }
  }
});
