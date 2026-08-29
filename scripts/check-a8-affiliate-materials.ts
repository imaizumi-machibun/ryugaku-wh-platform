import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  A8_AFFILIATE_PROGRAMS,
  AFFILIATE_INTENTS,
} from '../src/lib/affiliate-programs';

assert.equal(A8_AFFILIATE_PROGRAMS.length, 25, '媒体に割り当てられた25件を保持すること');
assert.equal(AFFILIATE_INTENTS.length, 7, '利用意図の分類が7区分であること');

const ids = new Set<string>();
for (const program of A8_AFFILIATE_PROGRAMS) {
  assert.ok(!ids.has(program.programId), `${program.programId}が一意であること`);
  ids.add(program.programId);

  const digest = createHash('sha256').update(program.textHtml, 'utf8').digest('hex');
  assert.equal(digest, program.materialSha256, `${program.programId}のCSV素材SHA-256が一致すること`);
  assert.match(
    program.textHtml,
    /^<a href="https:\/\/px\.a8\.net\/svt\/ejp\?a8mat=[A-Z0-9+]+" rel="nofollow">[\s\S]+<\/a>\n+<img border="0" width="1" height="1" src="https:\/\/www\d+\.a8\.net\/0\.gif\?a8mat=[A-Z0-9+]+" alt="">$/,
    `${program.programId}がA8テキスト素材の完全なa要素と計測imgを保持すること`
  );
  assert.ok(!program.textHtml.includes('target='), `${program.programId}へ属性を追加していないこと`);

  const hrefMat = program.textHtml.match(/href="[^\"]+a8mat=([A-Z0-9+]+)"/)?.[1];
  const pixelMat = program.textHtml.match(/src="[^\"]+a8mat=([A-Z0-9+]+)"/)?.[1];
  assert.ok(hrefMat, `${program.programId}のリンクにa8matがあること`);
  assert.equal(pixelMat, hrefMat, `${program.programId}のリンクと計測imgのa8matが一致すること`);
}

const intentIds = new Set(AFFILIATE_INTENTS.map((intent) => intent.id));
for (const program of A8_AFFILIATE_PROGRAMS) {
  assert.ok(intentIds.has(program.intent), `${program.programId}に有効な利用意図があること`);
}

console.log(`A8 exact materials OK: ${A8_AFFILIATE_PROGRAMS.length} programs / 7 intents`);
