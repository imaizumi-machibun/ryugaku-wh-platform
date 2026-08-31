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

test('phase付きガイドの旧articles URLは正規guide URLへ恒久転送する', () => {
  const articleRoute = readFileSync('src/app/articles/[slug]/page.tsx', 'utf8');

  assert.match(articleRoute, /if \(article\.phase\)/);
  assert.match(articleRoute, /permanentRedirect\(`\/guide\/\$\{article\.phase\}\/\$\{params\.slug\}`\)/);
});

test('国別費用ページはBreadcrumbListをJSON-LDバンドルから一度だけ出力する', () => {
  const costRoute = readFileSync('src/app/countries/[slug]/cost/page.tsx', 'utf8');

  assert.match(costRoute, /buildSegmentJsonLdBundle/);
  assert.doesNotMatch(costRoute, /generateBreadcrumbJsonLd/);
});

test('学校ItemListはCollectionPageのmainEntityだけに含め、同じオブジェクトを重複出力しない', () => {
  const bundle = readFileSync('src/lib/segments/jsonld-bundle.ts', 'utf8');
  const topLevelPushes = bundle.match(/bundle\.push\(schoolItemList\)/g) ?? [];

  assert.equal(topLevelPushes.length, 0);
  assert.match(bundle, /itemListJsonLd: schoolItemList/);
});
