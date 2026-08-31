import assert from 'node:assert/strict';
import test from 'node:test';
import { extractFaqFromArticleBody, isFaqQuestionHeading } from './article-faq';

test('「よくある質問」とFAQのH2から表示中のQ&Aだけを抽出する', () => {
  const japanese = '<h2>よくある質問</h2><h3>質問1ですか？</h3><p>回答1</p><h2>まとめ</h2><h3>対象外</h3><p>対象外</p>';
  const acronym = '<h2>ハンガリーワーホリのFAQと出発前チェック</h2><p>導入</p><h3>30歳でも申請できますか</h3><p>回答です。</p><h3>必要資金はいくらですか</h3><p>公式情報を確認します。</p>';

  assert.deepEqual(extractFaqFromArticleBody(japanese), [
    { question: '質問1ですか？', answer: '回答1' },
  ]);
  assert.deepEqual(extractFaqFromArticleBody(acronym), [
    { question: '30歳でも申請できますか', answer: '回答です。' },
    { question: '必要資金はいくらですか', answer: '公式情報を確認します。' },
  ]);
});

test('回答の複数段落・リスト・表・引用を省略せずFAQPage用テキストへ変換する', () => {
  const body = [
    '<h2>よくある質問</h2>',
    '<p>この導入文は回答には含めません。</p>',
    '<h3>費用はどのように計算しますか？</h3>',
    '<p>学費と生活費を分けます。</p>',
    '<p>申請費用も加えます。</p>',
    '<ul><li>学費</li><li>生活費</li></ul>',
    '<table><tr><th>項目</th><th>金額</th></tr><tr><td>申請費</td><td>&yen;10,000</td></tr></table>',
    '<blockquote>余裕資金も用意します。</blockquote>',
    '<h3>学校はどう選びますか？</h3>',
    '<p>認可と授業内容を確認します。</p>',
    '<h2>まとめ</h2>',
  ].join('');

  assert.deepEqual(extractFaqFromArticleBody(body), [
    {
      question: '費用はどのように計算しますか？',
      answer: '学費と生活費を分けます。 申請費用も加えます。 学費 生活費 項目 金額 申請費 ¥10,000 余裕資金も用意します。',
    },
    { question: '学校はどう選びますか？', answer: '認可と授業内容を確認します。' },
  ]);
});

test('表示時に復号されるnamed entityと数値entityをFAQPageでも復号する', () => {
  const body = '<h2>FAQ</h2><h3>出願時の注意は？</h3><p>Don&apos;t&nbsp;guess。&#x20AC;100と&#8364;100を区別します。</p>';

  assert.deepEqual(extractFaqFromArticleBody(body), [
    { question: '出願時の注意は？', answer: "Don't guess。€100と€100を区別します。" },
  ]);
});

test('FAQ H2内のまとめ・チェックリストをQuestionへ誤収録しない', () => {
  const body = [
    '<h2>FAQと出発前チェック</h2>',
    '<h3>授業・支援・卒業後を設計する</h3><p>これはFAQ前の解説です。</p>',
    '<h3>30歳でも申請できますか</h3><p>条件を確認してください。</p>',
    '<h3>英語で症状を伝えられるか心配です。</h3><p>翻訳メモを準備します。</p>',
    '<h3>まとめ：今日やる3ステップ</h3><p>これはまとめです。</p>',
  ].join('');

  assert.deepEqual(extractFaqFromArticleBody(body), [
    { question: '30歳でも申請できますか', answer: '条件を確認してください。' },
    { question: '英語で症状を伝えられるか心配です。', answer: '翻訳メモを準備します。' },
  ]);
});

test('既存の疑問符なし質問は互換対象とし、説明見出しは対象外にする', () => {
  assert.equal(isFaqQuestionHeading('最低賃金より低い時給を提示されたら'), true);
  assert.equal(isFaqQuestionHeading('就労制限について詳しく教えてください'), true);
  assert.equal(isFaqQuestionHeading('Bondが返ってこない場合の対処法'), true);
  assert.equal(isFaqQuestionHeading('日本に持ち帰れない物はどうする'), true);
  assert.equal(isFaqQuestionHeading('申請前に公式情報を確認する順番'), false);
  assert.equal(isFaqQuestionHeading('まとめ：今日やる3ステップ'), false);
});
