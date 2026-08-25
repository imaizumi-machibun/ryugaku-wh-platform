import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { generatePageMetadata } from './metadata';
import { SITE_URL } from '../utils/constants';

test('page title is not branded twice while social titles keep the brand', () => {
  const metadata = generatePageMetadata({
    title: 'デンマークワーホリガイド',
    description: 'テスト用の説明',
    path: '/countries/denmark',
  });

  assert.equal(metadata.title, 'デンマークワーホリガイド');
  assert.equal(metadata.openGraph?.title, 'デンマークワーホリガイド | Study Work Hub');
  assert.equal(metadata.twitter?.title, 'デンマークワーホリガイド | Study Work Hub');
});

test('site URL is an absolute production URL without whitespace', () => {
  assert.equal(SITE_URL, SITE_URL.trim());
  assert.match(SITE_URL, /^https:\/\/[^\s]+$/);
  assert.equal(new URL('/countries/denmark', SITE_URL).origin, 'https://study-work-hub.com');
});

test('robots.txt exposes comparison pages and the production sitemap', () => {
  const robots = readFileSync('public/robots.txt', 'utf8');

  assert.doesNotMatch(robots, /Disallow:\s*\/compare/);
  assert.match(robots, /Allow:\s*\/api\/og/);
  assert.match(robots, /Sitemap:\s*https:\/\/study-work-hub\.com\/sitemap\.xml/);
  assert.doesNotMatch(robots, /example\.com/);
});
