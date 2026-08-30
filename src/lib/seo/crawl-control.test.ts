import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildBlockedRobotsTxt,
  isCanonicalHostname,
  isNonIndexablePath,
  normalizeHostname,
} from './crawl-control';

test('本番ホストだけをcanonicalとして扱う', () => {
  assert.equal(isCanonicalHostname('study-work-hub.com'), true);
  assert.equal(isCanonicalHostname('study-work-hub.com:443'), true);
  assert.equal(isCanonicalHostname('WWW.STUDY-WORK-HUB.COM.'), true);
  assert.equal(isCanonicalHostname('ryugaku-wh-platform-git-feature.vercel.app'), false);
  assert.equal(isCanonicalHostname('localhost'), false);
  assert.equal(normalizeHostname(' Study-Work-Hub.com. '), 'study-work-hub.com');
  assert.equal(normalizeHostname('[::1]:3000'), '::1');
});

test('API・投稿・埋め込み・開発専用パスを検索対象外にする', () => {
  for (const pathname of [
    '/api',
    '/api/search',
    '/api/og',
    '/submit',
    '/submit/review',
    '/embed/matching',
    '/_vercel/insights/script.js',
    '/_next/webpack-hmr',
    '/__nextjs_original-stack-frame',
  ]) {
    assert.equal(isNonIndexablePath(pathname), true, pathname);
  }

  for (const pathname of ['/', '/articles/example', '/_next/static/chunks/app.js', '/articles/hero.jpg']) {
    assert.equal(isNonIndexablePath(pathname), false, pathname);
  }
});

test('非本番ホスト用robots.txtは全クロールを拒否する', () => {
  assert.equal(buildBlockedRobotsTxt(), 'User-agent: *\nDisallow: /\n');
});
