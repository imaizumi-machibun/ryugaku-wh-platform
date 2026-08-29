export type AffiliateIntent =
  | 'english-online'
  | 'english-school'
  | 'english-coaching'
  | 'kids-english'
  | 'wifi'
  | 'chinese'
  | 'canada-support';

export interface A8AffiliateProgram {
  readonly programId: `s${string}`;
  readonly brandName: string;
  readonly intent: AffiliateIntent;
  /** A8.netが生成したテキスト素材。属性・空白・計測imgを含めて変更しない。 */
  readonly textHtml: string;
  /** 2026-08-29 CSVのtextHtmlをUTF-8でSHA-256化した監査値。 */
  readonly materialSha256: string;
}

export const AFFILIATE_INTENTS: ReadonlyArray<{
  id: AffiliateIntent;
  title: string;
  description: string;
}> = [
  { id: 'english-online', title: 'オンライン英会話', description: '渡航前や帰国後に、自宅から英会話を練習したい方向けの広告です。' },
  { id: 'english-school', title: '通学型・マンツーマン英会話', description: '対面や個別形式で英会話を学びたい方向けの広告です。' },
  { id: 'english-coaching', title: '英語コーチング', description: '学習計画や継続支援を含む英語学習サービスの広告です。' },
  { id: 'kids-english', title: '子ども向け英語', description: '子ども向けレッスン・オンラインスクールの広告です。' },
  { id: 'wifi', title: '海外Wi-Fi', description: '渡航先で使うレンタルWi-Fiを検討する方向けの広告です。' },
  { id: 'chinese', title: 'オンライン中国語', description: '中国語をオンラインで学びたい方向けの広告です。' },
  { id: 'canada-support', title: 'カナダ留学サポート', description: 'カナダ留学の学校申込や現地サポートを検討する方向けの広告です。' },
] as const;

export const A8_AFFILIATE_PROGRAMS = [
  {
    programId: 's00000014257004',
    brandName: 'NOVA 新・お茶の間留学',
    intent: 'english-online',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=44X1QV+BK6J5E+320A+NTRMQ" rel="nofollow">NOVA新・お茶の間留学 安心の月謝制！</a>\n<img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=44X1QV+BK6J5E+320A+NTRMQ" alt="">',
    materialSha256: '02b05a59865b33b69d06af464b065087605235c7d2d91358fb3f81f6b95168d8',
  },
  {
    programId: 's00000023892001',
    brandName: 'CCレッスン',
    intent: 'chinese',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3NPQ6N+CDY7EA+54CO+5YJRM" rel="nofollow">オンライン中国語のサブスクリプションサービス【CCレッスン】</a>\n\n<img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=3NPQ6N+CDY7EA+54CO+5YJRM" alt="">',
    materialSha256: '2ba541cbc39929792b5fb200f32d1d11347ec346f8c42a2e4e5b4946f3c8c562',
  },
  {
    programId: 's00000013909002',
    brandName: 'U.S.データ',
    intent: 'wifi',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3NIX72+8TY0C2+2ZBM+BWVTE" rel="nofollow">≪アメリカWiFi≫</a>\n<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=3NIX72+8TY0C2+2ZBM+BWVTE" alt="">',
    materialSha256: '3a240d20fafc923e5f3a46b1bc094427acbe8e6577c35172f98d692ba76d865d',
  },
  {
    programId: 's00000013909001',
    brandName: 'アロハデータ',
    intent: 'wifi',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3NIX72+8SR54I+2ZBM+60OXE" rel="nofollow">ALOHA DATA</a>\n<img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3NIX72+8SR54I+2ZBM+60OXE" alt="">',
    materialSha256: '6dcd639457f0fbd893e308dd53c4ddd032794b57faa883be8a314ef17f90a899',
  },
  {
    programId: 's00000013909003',
    brandName: '韓国データ',
    intent: 'wifi',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3NIX72+8S5PIQ+2ZBM+HV7V6" rel="nofollow">≪韓国WiFi≫</a>\n<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=3NIX72+8S5PIQ+2ZBM+HV7V6" alt="">',
    materialSha256: 'c24de9c9c039ebb8ba314b816763053f5c122c7fa057b5b675587a7a16b48dfd',
  },
  {
    programId: 's00000020865001',
    brandName: 'ECC外語学院',
    intent: 'english-school',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3HP5C8+7GJ14I+4GZU+5ZEMQ" rel="nofollow">英会話ならＥＣＣ外語学院　 まずはカウンセリング＆無料体験レッスンへ！</a>\n<img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HP5C8+7GJ14I+4GZU+5ZEMQ" alt="">',
    materialSha256: '2060dd64c3ecc14d1f6b9d02f2bba43e33cb15d95da5ba71e284fbdc4c0b9937',
  },
  {
    programId: 's00000014257001',
    brandName: 'NOVAバイリンガルKIDS',
    intent: 'kids-english',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3H9RVV+BBRSI+320A+63WO2" rel="nofollow">3歳からのこども英会話　NOVAバイリンガルKIDS</a>\n<img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=3H9RVV+BBRSI+320A+63WO2" alt="">',
    materialSha256: '8c5f6c7d5d427e7f3726f225bf364731bae9598ffbf148b54b3853221521a37f',
  },
  {
    programId: 's00000014257002',
    brandName: 'NOVAライブステーション',
    intent: 'english-online',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3H9RVV+1QJ1TE+320A+BWVTE" rel="nofollow">NOVAの外国人講師がオンラインでレッスンを生配信！</a>\n\n\n<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=3H9RVV+1QJ1TE+320A+BWVTE" alt="">',
    materialSha256: 'a4eaac6a2cb231d6cfc1257e88a67b61202741811762fedb43e796c6927a5154',
  },
  {
    programId: 's00000018547002',
    brandName: 'SakuraMobile海外Wifi',
    intent: 'wifi',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3BQVHK+9YFHGY+3Z3Y+C0IZM" rel="nofollow">当日でもOK！現地空港Wifiカウンターで受け取れる！【SakuraMobile海外Wifi】</a>\n<img border="0" width="1" height="1" src="https://www16.a8.net/0.gif?a8mat=3BQVHK+9YFHGY+3Z3Y+C0IZM" alt="">',
    materialSha256: '90950d39feef9a6e472048930831ac97287e53afb834cdb7e1804b988b4efd33',
  },
  {
    programId: 's00000013202003',
    brandName: '産経オンライン英会話Plus',
    intent: 'english-online',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3BQMW5+AJV38Y+2TV8+HWXLE" rel="nofollow">日本人講師やネイティブ講師も選べる産経オンライン英会話Plus</a>\n<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3BQMW5+AJV38Y+2TV8+HWXLE" alt="">',
    materialSha256: '28f1be56d954681a66310e16eceaa04abb6fb06322bfd715d60339119b8257a8',
  },
  {
    programId: 's00000012753001',
    brandName: 'Bizmates',
    intent: 'english-online',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3BDS3J+FP0WDU+2QEI+6HMHU" rel="nofollow">ビジネス特化型オンライン英会話ならBizmates（ビズメイツ）</a>\n<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=3BDS3J+FP0WDU+2QEI+6HMHU" alt="">',
    materialSha256: '94c39c170fadc7e1b91c67d11acdbdbfa077a970ad73f12e61e0b9e2d0933dba',
  },
  {
    programId: 's00000018953001',
    brandName: 'Cambly',
    intent: 'english-online',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3BDG9G+8L0I9E+428Q+62U36" rel="nofollow">今すぐトライアルを試そう！【Cambly（キャンブリー）】</a>\n<img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=3BDG9G+8L0I9E+428Q+62U36" alt="">',
    materialSha256: 'd311920a01cd8bc1ec10ee9bb68b20f70f0344da94c3ad26f7496250447563cf',
  },
  {
    programId: 's00000013202002',
    brandName: 'mimitore',
    intent: 'english-coaching',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3BDG9G+ESA242+2TV8+BWVTE" rel="nofollow">英語リスニングに特化したコーチングプログラム『mimitore』</a>\n<img border="0" width="1" height="1" src="https://www18.a8.net/0.gif?a8mat=3BDG9G+ESA242+2TV8+BWVTE" alt="">',
    materialSha256: '71cc159604499bbe2f99cefc5d2194b4e72fb22e54f0ae1f3e6b25d7f1a4f360',
  },
  {
    programId: 's00000008409001',
    brandName: 'レアジョブ英会話',
    intent: 'english-online',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3B9HLV+CBKGZ6+1SVU+686ZM" rel="nofollow">レアジョブ英会話</a>\n<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3B9HLV+CBKGZ6+1SVU+686ZM" alt="">',
    materialSha256: '7f40b24d020d19eaf36cc4f5588e77da05b72584ca0dadcb05b4a7cb001fec49',
  },
  {
    programId: 's00000018104001',
    brandName: 'シェーン英会話（子供用）',
    intent: 'kids-english',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=35HONG+E6UGC2+3VOW+64JTE" rel="nofollow">子供用【シェーン英会話】</a>\n<img border="0" width="1" height="1" src="https://www16.a8.net/0.gif?a8mat=35HONG+E6UGC2+3VOW+64JTE" alt="">',
    materialSha256: '6b532aaecc8c004ea32db67f28f97771e82e72263ab9c0527b6b577f6040ee50',
  },
  {
    programId: 's00000017068001',
    brandName: 'PROGRIT',
    intent: 'english-coaching',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=35HQ7Q+Q7LWY+3NP4+614CY" rel="nofollow">短期間でやり抜く英語力を【PROGRIT(プログリット）】</a>\n<img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=35HQ7Q+Q7LWY+3NP4+614CY" alt="">',
    materialSha256: '5f38bceb9ba349806de53e615e154c3fe6d993ab75ea42b31b6ec90b7f266192',
  },
  {
    programId: 's00000011875001',
    brandName: 'グローバルWiFi',
    intent: 'wifi',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=35JIFC+FJNZXU+2JMM+64C3M" rel="nofollow">グローバルWiFi公式サイトを見てみる</a>\n\n<img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=35JIFC+FJNZXU+2JMM+64C3M" alt="">',
    materialSha256: '4feb1f094df5f88c31360a21c3c28e0c6e0746210698c88015f26e2de54d407c',
  },
  {
    programId: 's00000013504001',
    brandName: 'WiFiトラベル',
    intent: 'wifi',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=35JIFC+FHVP4I+2W74+5ZMCI" rel="nofollow">200カ国対応海外WiFiレンタルサービス</a>\n<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=35JIFC+FHVP4I+2W74+5ZMCI" alt="">',
    materialSha256: '360c69220af51a3d14e72aff449012ee0a8fc94babda03193eca43cb6409ab90',
  },
  {
    programId: 's00000019218001',
    brandName: 'GABA',
    intent: 'english-school',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=35HQ7Q+P0QPE+44AC+5YRHE" rel="nofollow">マンツーマン英会話【GABA】</a>\n<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=35HQ7Q+P0QPE+44AC+5YRHE" alt="">',
    materialSha256: '5c66af9b42ee727e1ce1a29c8a893e7a44c258387377482316a2c1ba74364429',
  },
  {
    programId: 's00000014758001',
    brandName: 'ネイティブキャンプキッズ',
    intent: 'kids-english',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=35HQ89+9T2L0Y+35VG+6LWTE" rel="nofollow">ネイティブキャンプキッズ</a>\n<img border="0" width="1" height="1" src="https://www18.a8.net/0.gif?a8mat=35HQ89+9T2L0Y+35VG+6LWTE" alt="">',
    materialSha256: '4b3df22d953e6dc168e8fd8e80b2ad138de12e0af05077390279564f9272372f',
  },
  {
    programId: 's00000010346001',
    brandName: 'b わたしの英会話',
    intent: 'english-school',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=35HMB1+FJNZXU+27TW+5YJRM" rel="nofollow">女性限定・初心者専門の英会話スクール</a>\n<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=35HMB1+FJNZXU+27TW+5YJRM" alt="">',
    materialSha256: '545de2e57dc5519d1fdbeb50c5e7a24b6b1bd6427bc854949865a564348726b9',
  },
  {
    programId: 's00000016980001',
    brandName: 'トライズ',
    intent: 'english-coaching',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=35HMB1+FD48AA+3N0O+5YRHE" rel="nofollow">【全額返金保証】トライズなら1年で英語が身につく3つの理由</a>\n<img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=35HMB1+FD48AA+3N0O+5YRHE" alt="">',
    materialSha256: '99b25d913f06dbc083a0d722b60ebe47918f900f521878f4af3d58433a0fc68e',
  },
  {
    programId: 's00000019598001',
    brandName: 'Global Step Academy',
    intent: 'kids-english',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=35FQYK+BVHRN6+477W+5YRHE" rel="nofollow">オンライン・インターナショナルスクールGlobal Step Academy</a>\n\n<img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=35FQYK+BVHRN6+477W+5YRHE" alt="">',
    materialSha256: '6f925ca2e55dd6a2b73336f4032e6b63237f68b24e058221650ed0b12d879d31',
  },
  {
    programId: 's00000017209001',
    brandName: 'カナダジャーナル',
    intent: 'canada-support',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=35FQYK+BUAWFM+3OSA+60H7M" rel="nofollow">日本人スタッフがきめ細かいサポートをいたします、安心な留学をするなら【カナダジャーナル】</a>\n<img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=35FQYK+BUAWFM+3OSA+60H7M" alt="">',
    materialSha256: 'a452a4b52843dd371064277bb9654db55c52dc94d9f4a672409367644b945326',
  },
  {
    programId: 's00000013909009',
    brandName: 'チャイナデータ',
    intent: 'wifi',
    textHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=2ZH7PU+6S49BM+2ZBM+1HNDBM" rel="nofollow">中国専用ポケットWiFiルーター</a>\n<img border="0" width="1" height="1" src="https://www18.a8.net/0.gif?a8mat=2ZH7PU+6S49BM+2ZBM+1HNDBM" alt="">',
    materialSha256: '0756564f1c01e63d728d0f84e168ed63970d86fcf2999db31216a33823353d59',
  },
] as const satisfies readonly A8AffiliateProgram[];

export function getProgramsByIntent(intent: AffiliateIntent): A8AffiliateProgram[] {
  return A8_AFFILIATE_PROGRAMS
    .filter((program) => program.intent === intent)
    .slice()
    .sort((a, b) => a.programId.localeCompare(b.programId));
}
