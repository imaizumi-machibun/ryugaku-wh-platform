import assert from 'node:assert/strict';
import test from 'node:test';

import { extractFaqFromArticleBody } from '@/lib/utils/article-faq';
import { mergePurposeGuideFaq } from './purpose-faq';

test('専用FAQ欄を表示本文へ統合し、同じ本文からFAQPage用データを抽出できる', () => {
  const merged = mergePurposeGuideFaq(
    '<h2>学校選び</h2><p>認可を確認します。</p>',
    '<h3>学校はどう選びますか？</h3><p>認可と授業内容を比べます。</p>'
  );

  assert.match(merged, /<h2>よくある質問<\/h2>/);
  assert.deepEqual(extractFaqFromArticleBody(merged), [
    { question: '学校はどう選びますか？', answer: '認可と授業内容を比べます。' },
  ]);
});

test('bodyと専用FAQ欄の二重入力を公開本文へ混在させない', () => {
  assert.throws(
    () => mergePurposeGuideFaq(
      '<h2>FAQ</h2><h3>既存の質問ですか？</h3><p>はい。</p>',
      '<h3>追加の質問ですか？</h3><p>はい。</p>'
    ),
    /両方にFAQ/
  );
});

test('質問形式でない専用FAQ欄は公開本文へ統合しない', () => {
  assert.throws(
    () => mergePurposeGuideFaq('<h2>学校選び</h2><p>本文です。</p>', '<p>質問のない説明だけです。</p>'),
    /質問形式のH3/
  );
});
