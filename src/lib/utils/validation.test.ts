import assert from 'node:assert/strict';
import test from 'node:test';
import { experienceSubmitSchema } from './validation';

const base = {
  title: 'カナダでの体験談', countryId: 'canada', cityPrimary: 'Toronto',
  content: '実際の体験を本人の言葉で記載します。'.repeat(10), ratingOverall: '5',
  primaryPurpose: 'working-holiday', secondaryPurposes: [], visaOrPermit: 'IEC Working Holiday',
};

test('空の任意数値を0に誤変換せず投稿を受理する', () => {
  const result = experienceSubmitSchema.safeParse({ ...base, durationMonths: '', monthlyRentJpy: '' });
  assert.equal(result.success, true);
});
test('留学は留学種別を必須にする', () => {
  const result = experienceSubmitSchema.safeParse({ ...base, primaryPurpose: 'study-abroad', visaOrPermit: 'F-1' });
  assert.equal(result.success, false);
  if (!result.success) assert.ok(result.error.issues.some((issue) => issue.path[0] === 'studyType'));
});
