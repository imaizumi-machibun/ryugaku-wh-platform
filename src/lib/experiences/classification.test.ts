import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EXPERIENCE_CLASSIFICATIONS,
  REVIEWED_EXPERIENCE_IDS,
} from './classification';

test('公開94件を重複なく人手確認レジストリへ固定している', () => {
  assert.equal(REVIEWED_EXPERIENCE_IDS.length, 94);
  assert.equal(new Set(REVIEWED_EXPERIENCE_IDS).size, 94);
  assert.equal(Object.keys(EXPERIENCE_CLASSIFICATIONS).length, 94);
  assert.deepEqual(Object.keys(EXPERIENCE_CLASSIFICATIONS).sort(), [...REVIEWED_EXPERIENCE_IDS].sort());
});
test('未確認目的はverifiedにならず、主目的と副目的は重複しない', () => {
  for (const [id, classification] of Object.entries(EXPERIENCE_CLASSIFICATIONS)) {
    assert.ok(['working-holiday', 'study-abroad', 'other', 'unknown'].includes(classification.primaryPurpose), id);
    if (classification.primaryPurpose === 'unknown') {
      assert.equal(classification.classificationStatus, 'needs-review', id);
    }
    assert.ok(!classification.secondaryPurposes.includes(classification.primaryPurpose), id);
  }
});
