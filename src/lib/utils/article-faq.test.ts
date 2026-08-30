import assert from 'node:assert/strict';
import test from 'node:test';
import { extractFaqFromArticleBody } from './article-faq';

test('「よくある質問」とFAQのH2から表示中のQ&Aだけを抽出する', () => {
  const japanese = '<h2>よくある質問</h2><h3>質問1</h3><p>回答1</p><h2>まとめ</h2><h3>対象外</h3><p>対象外</p>';
  const acronym = '<h2>ハンガリーワーホリのFAQと出発前チェック</h2><p>導入</p><h3>30歳でも申請できますか</h3><p>回答です。</p><h3>必要資金はいくらですか</h3><p>公式情報を確認します。</p>';

  assert.deepEqual(extractFaqFromArticleBody(japanese), [
    { question: '質問1', answer: '回答1' },
  ]);
  assert.deepEqual(extractFaqFromArticleBody(acronym), [
    { question: '30歳でも申請できますか', answer: '回答です。' },
    { question: '必要資金はいくらですか', answer: '公式情報を確認します。' },
  ]);
});
