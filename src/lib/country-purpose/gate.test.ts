import assert from 'node:assert/strict';
import test from 'node:test';
import type { Country, School } from '@/lib/microcms/types';
import type { ResolvedCountryPurposeGuide } from '@/lib/microcms/countryPurposeGuides';
import { evaluateCountryPurposeGate } from './gate';

const country = {
  id: 'united-states',
  nameJp: 'アメリカ',
  nameEn: 'United States',
  programStatus: 'closed',
} as Country;

const guide = {
  title: 'アメリカ留学完全ガイド',
  introduction: '留学の選び方を解説します。',
  body: `<p>${'留学情報'.repeat(1600)}</p><h2>留学種別</h2><p>語学留学と大学留学を比較します。</p><h2>入学条件と出願</h2><p>語学要件を確認します。</p><h2>学生ビザ</h2><p>滞在許可を確認します。</p><h2>学費と生活費</h2><p>予算を立てます。</p><h2>学校選びと都市選び</h2><p>大学と地域を比較します。</p><h2>住居と保険</h2><p>学生寮を確認します。</p><h2>奨学金と資金計画</h2><p>資金を管理します。</p><h2>授業と学生生活</h2><p>学生支援を比較します。</p><h2>卒業後の進路</h2><p>卒業後就労の条件を確認します。</p><h2>よくある質問</h2><h3>学校はどう選びますか？</h3><p>目的と予算で比較します。</p><h3>ビザは必要ですか？</h3><p>受講内容に応じて公式情報を確認します。</p><h3>費用はいくらですか？</h3><p>学費と生活費を分けて計算します。</p>`,
  checkedAt: '2026-08-31',
  status: 'publishable',
  sources: [
    { label: 'EducationUSA', url: 'https://educationusa.state.gov/', supports: '学校選び', checkedAt: '2026-08-31' },
    { label: 'U.S. Department of State', url: 'https://travel.state.gov/', supports: '学生ビザ', checkedAt: '2026-08-31' },
    { label: 'Study in the States', url: 'https://studyinthestates.dhs.gov/', supports: '滞在資格', checkedAt: '2026-08-31' },
  ],
  sourceArticleId: 'wh-usa-study-guide',
} satisfies ResolvedCountryPurposeGuide;

const school = {
  id: 'example-school',
  name: 'Example School',
  country,
  city: 'New York',
} as School;

test('留学は体験談が0件でも、リッチ本文と複数の一次情報がそろえば公開できる', () => {
  const result = evaluateCountryPurposeGate({
    country,
    purpose: 'study-abroad',
    guide,
    experiences: [],
    schools: [school],
  });

  assert.equal(result.pass, true);
  assert.equal(result.checks.experienceRequirement, true);
  assert.equal(result.advisories.verifiedExperienceAvailable, false);
  assert.equal(result.advisories.schoolInventoryAvailable, true);
});

test('留学は学校在庫が0件でも、一次情報と国固有ガイドがそろえば公開できる', () => {
  const result = evaluateCountryPurposeGate({
    country,
    purpose: 'study-abroad',
    guide,
    experiences: [],
    schools: [],
  });

  assert.equal(result.pass, true);
  assert.equal(result.checks.experienceRequirement, true);
  assert.equal(result.advisories.schoolInventoryAvailable, false);
});

test('留学は体験談があっても、本文が薄ければ公開しない', () => {
  const result = evaluateCountryPurposeGate({
    country,
    purpose: 'study-abroad',
    guide: { ...guide, body: '<h2>留学</h2><p>学校を比較します。</p>' },
    experiences: [],
    schools: [school],
  });

  assert.equal(result.pass, false);
  assert.equal(result.checks.richBody, false);
  assert.equal(result.checks.countrySpecificCoverage, false);
});

test('留学は本文が長くても、一次情報が3件未満なら公開しない', () => {
  const result = evaluateCountryPurposeGate({
    country,
    purpose: 'study-abroad',
    guide: { ...guide, sources: guide.sources.slice(0, 2) },
    experiences: [],
    schools: [school],
  });

  assert.equal(result.pass, false);
  assert.equal(result.checks.officialSources, false);
});

test('留学は確認日が古い、または次回確認日を過ぎた場合に公開しない', () => {
  const staleCheckedAt = evaluateCountryPurposeGate({
    country,
    purpose: 'study-abroad',
    guide: { ...guide, checkedAt: '2024-01-01' },
    experiences: [],
    schools: [school],
  });
  const overdueReview = evaluateCountryPurposeGate({
    country,
    purpose: 'study-abroad',
    guide: { ...guide, nextCheckAt: '2026-01-01' },
    experiences: [],
    schools: [school],
  });

  assert.equal(staleCheckedAt.pass, false);
  assert.equal(staleCheckedAt.checks.freshReview, false);
  assert.equal(overdueReview.pass, false);
  assert.equal(overdueReview.checks.freshReview, false);
});
