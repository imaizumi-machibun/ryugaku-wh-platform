import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeGuidePhase } from './phase';

test('microCMSの空配列phaseを通常記事として扱う', () => {
  assert.equal(normalizeGuidePhase([]), null);
});

test('microCMSの配列または文字列phaseを有効なガイド段階へ正規化する', () => {
  assert.equal(normalizeGuidePhase(['return-career']), 'return-career');
  assert.equal(normalizeGuidePhase('arrival'), 'arrival');
});

test('未知のphaseを転送先に使用しない', () => {
  assert.equal(normalizeGuidePhase(['']), null);
  assert.equal(normalizeGuidePhase('unknown'), null);
  assert.equal(normalizeGuidePhase(undefined), null);
});
