import assert from 'node:assert/strict';
import test from 'node:test';
import type { Experience } from '@/lib/microcms/types';
import { buildExperienceBreadcrumb, toVisibleBreadcrumbItems } from './breadcrumbs';

const base = {
  id: 'example', title: '体験談タイトル', content: '', cityPrimary: 'Toronto',
  ratingOverall: 5, createdAt: '', updatedAt: '', publishedAt: '', revisedAt: '',
  country: { id: 'canada', nameJp: 'カナダ', nameEn: 'Canada', region: '北米', programStatus: 'open', createdAt: '', updatedAt: '', publishedAt: '', revisedAt: '' },
} as Experience;

test('検証済みワーホリ体験談は国・目的別階層を使い、表示とJSON-LDが同じ順序になる', () => {
  const entries = buildExperienceBreadcrumb({ ...base, primaryPurpose: 'working-holiday', classificationStatus: 'verified' });
  assert.deepEqual(entries.map((entry) => entry.name), ['ホーム', '国一覧', 'カナダ', 'カナダワーホリ', '体験談タイトル']);
  assert.deepEqual(toVisibleBreadcrumbItems(entries).map((entry) => entry.label), entries.slice(1).map((entry) => entry.name));
});
test('目的不明の体験談はグローバル体験談階層に残す', () => {
  const entries = buildExperienceBreadcrumb({ ...base, primaryPurpose: 'unknown', classificationStatus: 'needs-review' });
  assert.deepEqual(entries.map((entry) => entry.name), ['ホーム', '体験談', '体験談タイトル']);
});

test('検証済み留学体験談は、公開済みの国別留学ページ階層を使う', () => {
  const entries = buildExperienceBreadcrumb({
    ...base,
    country: { ...base.country, id: 'australia', nameJp: 'オーストラリア' },
    primaryPurpose: 'study-abroad',
    classificationStatus: 'verified',
  });
  assert.deepEqual(entries.map((entry) => entry.name), ['ホーム', '国一覧', 'オーストラリア', 'オーストラリア留学', '体験談タイトル']);
});

test('留学ページが未公開の国はグローバル体験談階層に残す', () => {
  const entries = buildExperienceBreadcrumb({
    ...base,
    country: { ...base.country, id: 'china', nameJp: '中国' },
    primaryPurpose: 'study-abroad',
    classificationStatus: 'verified',
  });
  assert.deepEqual(entries.map((entry) => entry.name), ['ホーム', '体験談', '体験談タイトル']);
});
