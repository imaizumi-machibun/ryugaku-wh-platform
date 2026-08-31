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

test('削除した監査節を指す本文内目次も除去する', () => {
  const body = [
    '<h2>仕事探し</h2>',
    '<p>求人と契約を確認します。</p>',
    '<ul><li><a href="#contract">契約を確認する</a></li><li><a href="#own-data">公開体験談94件の一致は0件</a></li></ul>',
    '<h3 id="contract">契約を確認する</h3>',
    '<p>書面契約を受け取ります。</p>',
    '<h3 id="own-data">公開体験談94件の一致は0件</h3>',
    '<p>Study Work Hub編集部は公開体験談94件をAPIで確認しました。結果は0件です。</p>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.match(cleaned, /href="#contract"/);
  assert.doesNotMatch(cleaned, /own-data|94件|Study Work Hub/);
});

test('microCMSが自動採番した見出しIDを本文内目次のfragmentへ戻す', () => {
  const body = [
    '<h2 id="h-auto-1">学校選び</h2>',
    '<p>目的に合う学校を比較します。</p>',
    '<ul><li><a href="#language-course">語学コースを比較する</a></li><li><a href="#degree-course">学位課程を比較する</a></li></ul>',
    '<h3 id="h-auto-2">語学コースを比較する</h3>',
    '<p>授業時間と支援を確認します。</p>',
    '<h3 id="h-auto-3">学位課程を比較する</h3>',
    '<p>入学条件と卒業資格を確認します。</p>',
  ].join('');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.match(cleaned, /<h3 id="language-course">語学コースを比較する<\/h3>/);
  assert.match(cleaned, /<h3 id="degree-course">学位課程を比較する<\/h3>/);
  assert.match(cleaned, /href="#language-course"/);
  assert.doesNotMatch(cleaned, /h-auto-2|h-auto-3/);
});

test('見出しを短く要約したH2直後の小目次も順序対応でIDを戻す', () => {
  const body = [
    '<h2 id="h-auto-1">在学中の仕事・卒業後の進路</h2>',
    '<p>条件を分けて確認します。</p>',
    '<ul><li><a href="#work-hours">就労時間と最低賃金</a></li><li><a href="#internship">課程内インターンシップ</a></li><li><a href="#graduate-route">卒業後の進路</a></li></ul>',
    '<h3 id="h-auto-2">Stamp 2の就労時間と最低賃金</h3>',
    '<p>学期中と休暇期を分けます。</p>',
    '<p>詳しくは<a href="#internship">課程内インターンシップの条件</a>を確認します。</p>',
    '<h3 id="h-auto-3">インターンシップは課程の一部かを確認する</h3>',
    '<p>対象課程を確認します。</p>',
    '<h3 id="h-auto-4">卒業後は資格水準で選択肢が変わる</h3>',
    '<p>卒業後制度を確認します。</p>',
  ].join('');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.match(cleaned, /<h3 id="work-hours">Stamp 2の就労時間と最低賃金<\/h3>/);
  assert.match(cleaned, /<h3 id="internship">インターンシップは課程の一部かを確認する<\/h3>/);
  assert.match(cleaned, /<h3 id="graduate-route">卒業後は資格水準で選択肢が変わる<\/h3>/);
  assert.equal((cleaned.match(/href="#internship"/g) ?? []).length, 2);
});

test('ID復元後も編集部の監査語を含む目次項目は表示しない', () => {
  const body = [
    '<ul><li><a href="#fit">自社体験談94件の確認結果と向く人</a></li><li><a href="#safety">安全対策</a></li></ul>',
    '<h3 id="h-auto-1">自社体験談94件の確認結果と向く人</h3>',
    '<p>Study Work Hub編集部が公開体験談94件を確認したところ対象は0件でした。</p>',
    '<p>予備資金を持ち、現地語で手続できる人に向きます。</p>',
    '<h3 id="h-auto-2">安全対策</h3><p>緊急連絡先を控えます。</p>',
  ].join('');

  const cleaned = cleanPurposeArticleReaderContent(body, { adviceHeading: '向いている人' });

  assert.doesNotMatch(cleaned, /94件|Study Work Hub|href="#fit"/);
  assert.match(cleaned, /<h3 id="fit">向いている人<\/h3>/);
  assert.match(cleaned, /href="#safety"/);
  assert.match(cleaned, /<h3 id="safety">安全対策<\/h3>/);
});

test('同名見出しが複数ある場合はmicroCMSのIDを推測で置換しない', () => {
  const body = [
    '<ul><li><a href="#first-faq">費用はいくらですか</a></li></ul>',
    '<h3 id="h-auto-1">費用はいくらですか</h3><p>回答1です。</p>',
    '<h3 id="h-auto-2">費用はいくらですか</h3><p>回答2です。</p>',
  ].join('');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.doesNotMatch(cleaned, /href="#first-faq"/);
  assert.match(cleaned, /id="h-auto-1"/);
  assert.match(cleaned, /id="h-auto-2"/);
});

test('確認済み事例があっても旧94件母集団の抽出ログは節ごと除く', () => {
  const body = [
    '<h2>費用</h2>',
    '<p>公式情報で予算を作ります。</p>',
    '<h3>韓国の体験談4件は相場ではなく個別例として見る</h3>',
    '<p>自社データは個別例を知るために使います。公開体験談94件から国名欄が「韓国」の4件を抽出しました。本人の記述で分けると、ワーホリは1件、留学は2件、目的不明は1件でした。</p>',
    '<table><tr><th>回答項目</th><th>中央値</th><th>範囲</th></tr><tr><td>生活費</td><td>11万円</td><td>留学・WH・目的不明が混在</td></tr></table>',
    '<h3>住居探しの実例</h3>',
    '<p>本人の体験談から、契約前に保証金を確認します。</p>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.doesNotMatch(cleaned, /94件|国名欄|中央値|11万円/);
  assert.match(cleaned, /<h3>住居探しの実例<\/h3>/);
  assert.match(cleaned, /契約前に保証金/);
});

test('自社件数の説明だけを落とし、同じ段落の具体的な体験は残す', () => {
  const body = [
    '<h3>ソウルの住居探しを1名の体験談から考える</h3>',
    '<p>自社の韓国体験談4件のうち、本人の回答にワーホリと書かれていたのは1件でした。その1名はソウルで11か月を過ごし、住居探しの負担を振り返っています。</p>',
    '<blockquote>住む場所を探すのが大変だった。</blockquote>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.doesNotMatch(cleaned, /自社|4件のうち|その1名/);
  assert.match(cleaned, /本人の回答でワーホリを確認できた体験者はソウルで11か月/);
  assert.match(cleaned, /<blockquote>/);
});

test('有用な行動説明は残し、編集部が独自に置いた日程の説明だけを除く', () => {
  const body = [
    '<h2>到着後30日の仕事・住居</h2>',
    '<p>到着後は、就労権を確かめて住居と仕事探しを進めます。30日は法定期限ではなく、生活の基盤を作るためにStudy Work Hub編集部が設けた整理枠です。</p>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.match(cleaned, /就労権を確かめて住居と仕事探し/);
  assert.doesNotMatch(cleaned, /Study Work Hub編集部|設けた整理枠/);
});

test('英国の94件抽出工程を除き、確認済み2事例の比較表は残す', () => {
  const body = [
    '<h3>ロンドンと地方を4軸で選ぶ</h3>',
    '<p>都市は求人と住居費で選びます。この基準はStudy Work Hubが確認した就労体験2件を対照して作った判断補助です。</p>',
    '<p>Study Work Hub編集部は公開中の体験談94件を読み取り専用APIから取得しました。国データがイギリスと一致する6件を抽出し、人手で確認しています。その結果、短期留学4件とワーキングホリデー2件でした。</p>',
    '<table><tr><th>判断軸</th><th>確認すること</th></tr><tr><td>住居費</td><td>候補物件を比べる</td></tr></table>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.doesNotMatch(cleaned, /Study Work Hub|94件|国データ|短期留学4件/);
  assert.match(cleaned, /都市は求人と住居費で選びます/);
  assert.match(cleaned, /<table>/);
});

test('イタリアの短期留学引用は残し、API照合とWH0件の説明は除く', () => {
  const body = [
    '<h3>イタリア語は生活場面から準備</h3>',
    '<p>出発前は生活で使うイタリア語から準備します。</p>',
    '<p>Study Work Hub編集部は公開体験談94件を読み取り専用APIから全件取得しました。国名がイタリアと完全一致する投稿は1件です。ただし短期留学で、確認できたワーホリ体験談は0件でした。このため費用平均や成功率には使いません。</p>',
    '<p>その短期留学者の声は、ワーホリ体験ではないと明示して言葉の準備を考える補助例に限ります。公開ページとAPIの原文を照合した引用です。</p>',
    '<blockquote>細かい気持ちを伝えるのが難しかった。</blockquote>',
  ].join('\n');

  const cleaned = cleanPurposeArticleReaderContent(body);

  assert.doesNotMatch(cleaned, /Study Work Hub編集部|94件|完全一致|0件|APIの原文/);
  assert.match(cleaned, /言葉の準備を考える補助例/);
  assert.match(cleaned, /<blockquote>/);
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
