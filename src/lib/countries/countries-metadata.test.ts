import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCountriesMetadata } from './countries-metadata';
import { SITE_URL } from '@/lib/utils/constants';

const canonicalUrl = `${SITE_URL}/countries`;

test('クエリなしの国一覧はindex可能でcanonicalとOG URLを固定する', () => {
  const metadata = buildCountriesMetadata({});

  assert.equal(metadata.alternates?.canonical, canonicalUrl);
  assert.equal(metadata.openGraph?.url, canonicalUrl);
  assert.equal(metadata.robots, undefined);
});

test('値のある検索条件は種類を問わずnoindex,followにする', () => {
  const queries = [
    { region: 'オセアニア' },
    { cost: 'high' },
    { q: '英語' },
    { wageUnit: 'hourly', wageMin: '1500' },
    { region: 'ヨーロッパ', cost: 'medium', wageUnit: 'monthly', wageMin: '250000' },
    { wageUnit: 'invalid', wageMin: '-1' },
    { unknown: 'value' },
  ];

  for (const query of queries) {
    const metadata = buildCountriesMetadata(query);
    assert.deepEqual(metadata.robots, { index: false, follow: true });
    assert.equal(metadata.alternates?.canonical, canonicalUrl);
    assert.equal(metadata.openGraph?.url, canonicalUrl);
  }
});

test('空値だけのクエリはindex可能として扱う', () => {
  assert.equal(buildCountriesMetadata({ region: '', wageMin: '' }).robots, undefined);
  assert.equal(buildCountriesMetadata({ q: ['', ''] }).robots, undefined);
});
