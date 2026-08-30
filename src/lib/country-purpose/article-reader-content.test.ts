import assert from 'node:assert/strict';
import test from 'node:test';
import { cleanPurposeArticleReaderContent } from './article-reader-content';

test('アルゼンチンの照合ログを除き、向く人と比較リンクを読者向け見出しで残す', () => {
  const body = [
    '<h2>安全・スペイン語・自社データで適性を判断する</h2>',
    '<p>安全と語学の解説です。</p>',
    '<h3>自社体験談94件の確認結果と向く人</h3>',
    '<p>Study Work Hub編集部が2026年8月26日に公開体験談94件を全件確認したところ、本人のアルゼンチン滞在を確認できる記録は0件でした。国フィールドの完全一致に加え、都市名も本文で照合しています。</p>',
    '<p>本文でアルゼンチンに直接触れた記録は1件ありましたが、他国滞在の記録と判断したため、アルゼンチンの体験談としては引用していません。</p>',
    '<p>この0件は当サイトの公開データだけを対象にした結果です。</p>',
    '<p>アルゼンチンは、予備資金を持ち、スペイン語での手続に自分で取り組める人に向きます。</p>',
    '<p><a href="/articles/wh-chile-complete-guide">チリと比較する</a></p>',
    '<h2>FAQ</h2>',
    '<p>質問への回答です。</p>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body, {
    adviceHeading: 'アルゼンチンワーホリが向く人',
  });

  assert.doesNotMatch(cleaned, /自社体験談94件|Study Work Hub|国フィールド|この0件/);
  assert.match(cleaned, /<h2>安全・スペイン語・現地生活で適性を判断する<\/h2>/);
  assert.match(cleaned, /<h3>アルゼンチンワーホリが向く人<\/h3>/);
  assert.match(cleaned, /予備資金を持ち、スペイン語での手続/);
  assert.match(cleaned, /href="\/articles\/wh-chile-complete-guide"/);
  assert.match(cleaned, /<h2>FAQ<\/h2>/);
});

test('監査件数を含む親見出しを読者向けの表現へ直す', () => {
  const body = [
    '<h2>言語・安全情報・自社94件で香港への適性を決める</h2>',
    '<p>香港が自分に合うかは、言語と安全情報から判断します。</p>',
    '<h3>自社体験談94件の確認結果</h3>',
    '<p>Study Work Hubの公開体験談94件を確認しましたが、香港ワーホリを確認できた投稿は0件でした。</p>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.doesNotMatch(cleaned, /自社94件/);
  assert.match(cleaned, /<h2>言語・安全情報・現地生活で香港への適性を決める<\/h2>/);
});

test('0件監査を含まない通常見出しの自社データ表現は変更しない', () => {
  const body = [
    '<h2>自社データで生活費を比較する</h2>',
    '<p>確認済みの回答から中央値を計算します。</p>',
    '<h3>自社31件の中央値</h3>',
    '<p>回答31件の集計結果です。</p>',
  ].join('\n');

  assert.equal(cleanPurposeArticleReaderContent(body), body);
});

test('編集部の確認過程だけを除き、同じ段落の読者向け結論を残す', () => {
  const body = [
    '<h2>制度の要点</h2>',
    '<p>当編集部は2026年8月26日に日本語と英語の公式案内を照合しました。言語によって人数表記が異なるため、対象方向を確認してください。</p>',
    '<p>申請前に必要書類を確認します。</p>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.doesNotMatch(cleaned, /当編集部|照合しました/);
  assert.match(cleaned, /言語によって人数表記が異なる/);
  assert.match(cleaned, /申請前に必要書類/);
});

test('ウルグアイの照合段落だけを除き、向き不向きの表を保持する', () => {
  const body = [
    '<h3>自社体験談94件の確認結果とウルグアイが向く人</h3>',
    '<p>Study Work Hubで公開中の体験談94件を確認した範囲では、本人のウルグアイ滞在を確認できる体験談は0件でした。</p>',
    '<p>確認は、国フィールドの完全一致0件、全文確認4件、本人原文0件という順で行いました。</p>',
    '<table><thead><tr><th>向きやすい人</th><th>慎重に比べたい人</th></tr></thead><tbody><tr><td>1年の資金計画を作れる</td><td>収入の保証が必要</td></tr></tbody></table>',
    '<p>期間と資金を同じ列で比較してください。</p>',
    '<h2>FAQ</h2>',
  ].join('\n\n');

  const cleaned = cleanPurposeArticleReaderContent(body, {
    adviceHeading: 'ウルグアイワーホリが向く人',
  });

  assert.doesNotMatch(cleaned, /94件|国フィールド|本人原文/);
  assert.match(cleaned, /<h3>ウルグアイワーホリが向く人<\/h3>/);
  assert.match(cleaned, /<table>/);
  assert.match(cleaned, /1年の資金計画を作れる/);
  assert.match(cleaned, /期間と資金を同じ列で比較/);
});

test('監査だけの独立節を丸ごと除き、次の向く人節は変更しない', () => {
  const body = [
    '<h3>現地体験は、都市と渡航時期が分かる本人記録で確認する</h3>',
    '<p>Study Work Hubの公開体験談94件を国項目と本文で照合しましたが、本人のチリ滞在を確認できる記録は0件でした。</p>',
    '<p>これは当サイト内だけの結果で、別国の体験談を転用していません。</p>',
    '<h3>チリが向く人・慎重に比べる人</h3>',
    '<p>初回1年で計画が成り立つ人に向く可能性があります。</p>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.doesNotMatch(cleaned, /本人記録で確認|94件|当サイト内だけ/);
  assert.match(cleaned, /<h3>チリが向く人・慎重に比べる人<\/h3>/);
  assert.match(cleaned, /初回1年で計画が成り立つ/);
});

test('同じ節に続く安全情報は監査段落と分けて保持する', () => {
  const body = [
    '<h3>公開体験談の確認結果と安全対策を限定して使う</h3>',
    '<p>Study Work Hubで公開中の体験談94件を確認したところ、ハンガリー滞在を確認できる投稿は0件でした。</p>',
    '<p>これは当サイト内だけの確認結果です。別国の体験談をハンガリーの相場へ置き換えません。</p>',
    '<p>安全面では、観光地や公共交通機関でのすり・置き引きに注意してください。</p>',
    '<ul><li>緊急番号112を控える</li></ul>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body, {
    safetyHeading: 'ハンガリーで安全に暮らすための対策',
  });

  assert.doesNotMatch(cleaned, /94件|当サイト内だけ|別国の体験談/);
  assert.match(cleaned, /<h3>ハンガリーで安全に暮らすための対策<\/h3>/);
  assert.match(cleaned, /すり・置き引き/);
  assert.match(cleaned, /緊急番号112/);
});

test('0件監査だけの節は前後の見出しを残して削除する', () => {
  const body = [
    '<h2>仕事</h2>',
    '<p>仕事の解説です。</p>',
    '<h3 id="own-data">公開体験談94件のリトアニア一致は0件</h3>',
    '<p>Study Work Hub編集部は公開体験談94件を読み取り専用APIで全件取得し、国項目の完全一致を確認しました。結果は0件です。</p>',
    '<p>この0件は当サイトの公開データセットに対象事例がないという意味です。</p>',
    '<p>旅行や交換留学の体験をリトアニアWHへ転用することも避けています。</p>',
    '<h2>到着後30日の行動</h2>',
    '<p>住居から整えます。</p>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.equal(
    cleaned,
    [
      '<h2>仕事</h2>',
      '<p>仕事の解説です。</p>',
      '<h2>到着後30日の行動</h2>',
      '<p>住居から整えます。</p>',
    ].join('\n')
  );
});

test('確認済み体験がある通常の集計節は変更しない', () => {
  const body = [
    '<h3>自社31件では生活費と収入の幅が大きい</h3>',
    '<p>公開体験談31件を集計し、中央値と範囲を個別例として示します。</p>',
    '<table><tr><th>項目</th><th>中央値</th></tr></table>',
  ].join('\n');

  assert.equal(cleanPurposeArticleReaderContent(body), body);
});

test('記事本文以外の0件表現を誤って除去しない', () => {
  const body = '<h3>応募を始める</h3><p>応募0件のまま待たず、求人条件を見直します。</p>';
  assert.equal(cleanPurposeArticleReaderContent(body), body);
});
