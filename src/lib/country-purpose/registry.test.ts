import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ARTICLE_PURPOSE_REDIRECTS,
  COUNTRY_PURPOSE_GUIDES,
  getPublishedPurposePaths,
  resolveLegacyPurposePath,
  STATIC_PURPOSE_REDIRECTS,
} from './registry';

test('正規目的別URLと統合元記事に重複・自己転送・転送チェーンがない', () => {
  const paths = getPublishedPurposePaths();
  assert.equal(new Set(paths).size, paths.length);
  const redirects = { ...ARTICLE_PURPOSE_REDIRECTS, ...STATIC_PURPOSE_REDIRECTS };
  const sources = Object.keys(redirects);
  assert.equal(new Set(sources).size, sources.length);
  for (const [source, target] of Object.entries(redirects)) {
    assert.notEqual(source, target);
    assert.equal(redirects[target], undefined, `${source} creates a redirect chain`);
    assert.ok(paths.includes(target), `${target} is not a canonical purpose page`);
  }
});

test('公開定義は品質ゲートに必要な8分野と公式出典を持つ', () => {
  for (const guide of COUNTRY_PURPOSE_GUIDES) {
    assert.ok(guide.coverageAreas.length >= 8, `${guide.countrySlug}/${guide.purpose}`);
    assert.ok(
      guide.officialSources.length >= (guide.purpose === 'study-abroad' ? 3 : 1),
      `${guide.countrySlug}/${guide.purpose}`
    );
    assert.ok(guide.mergedArticleIds.includes(guide.sourceArticleId));
  }
});

test('旧purposeは検証済みの吸収先だけ301対象にする', () => {
  assert.equal(resolveLegacyPurposePath('canada', 'working-holiday'), '/countries/canada/working-holiday');
  assert.equal(resolveLegacyPurposePath('united-states', 'language'), '/countries/united-states/study-abroad');
  assert.equal(resolveLegacyPurposePath('canada', 'language'), '/countries/canada/study-abroad');
  assert.equal(resolveLegacyPurposePath('australia', 'language'), '/countries/australia/study-abroad');
  assert.equal(resolveLegacyPurposePath('united-kingdom', 'language'), '/countries/united-kingdom/study-abroad');
  assert.equal(resolveLegacyPurposePath('new-zealand', 'language'), '/countries/new-zealand/study-abroad');
  assert.equal(resolveLegacyPurposePath('south-korea', 'language'), '/countries/south-korea/study-abroad');
  assert.equal(STATIC_PURPOSE_REDIRECTS['/nz-language-school'], '/countries/new-zealand/study-abroad');
  assert.equal(STATIC_PURPOSE_REDIRECTS['/korea-study'], '/countries/south-korea/study-abroad');
  assert.equal(resolveLegacyPurposePath('australia', 'internship'), null);
});
