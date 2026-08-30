import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import QuoteFromExperience from '@/components/article/QuoteFromExperience';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { getExperiences } from '@/lib/microcms/experiences';
import { countMentions, extractMatchingSentence } from '@/lib/stats/experiences-cross';
import { isPublished } from '@/lib/publish/schedule';

const PAGE_PATH = '/passport-lost-overseas';

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: '海外でパスポートを紛失・盗難したら？今すぐやる5ステップと再発行手順',
  description: '海外でパスポートを紛失・盗難したときの緊急対応を、5ステップで時系列に解説。日本大使館・領事館への連絡方法、必要書類、再発行と帰国のための渡航書の違い、費用と日数の目安を実例ベースでまとめました。',
  path: PAGE_PATH,
  keywords: [
    'パスポート 紛失 海外',
    'パスポート 盗難 海外',
    'パスポート 再発行 海外',
    '帰国のための渡航書',
    '海外 パスポート なくした',
    'パスポート 紛失 大使館',
    'ワーホリ パスポート 紛失',
  ],
});

const TOC_HEADINGS = [
  { id: 'first-actions', label: '【緊急】まず今すぐやる5ステップ' },
  { id: 'two-options', label: '「再発行」と「帰国のための渡航書」の違い' },
  { id: 'required-docs', label: '必要書類とその準備方法' },
  { id: 'embassy-contacts', label: '主要国の日本大使館・領事館連絡先' },
  { id: 'cost-time', label: '費用と所要日数の目安' },
  { id: 'prevention', label: 'パスポート紛失・盗難を防ぐ予防策' },
  { id: 'experiences', label: '体験談から見るトラブル実態' },
  { id: 'faq', label: 'よくある質問' },
];

const FIRST_ACTIONS = [
  {
    step: 1,
    title: 'まず深呼吸して、最後に持っていた場所を思い出す',
    detail: 'カバンの中・前日宿泊のホテル・直近の交通機関・両替所・空港セキュリティ。「ない」と決め込む前に5分使って探す。',
    color: 'amber',
  },
  {
    step: 2,
    title: '地元の警察に届け出てPolice Report（盗難・紛失証明書）を取得',
    detail: '在外公館で再発行・帰国渡航書の申請時に必須。盗難の場合は特に重要。Police Stationで「I lost my passport」「My passport was stolen」と伝える。控えは必ず保管。',
    color: 'rose',
  },
  {
    step: 3,
    title: '最寄りの日本大使館・領事館に電話 or 訪問',
    detail: '24時間対応の緊急連絡先がある国も多い。営業時間外でも対応してくれるので焦らず連絡。次セクションに主要国の連絡先一覧あり。',
    color: 'blue',
  },
  {
    step: 4,
    title: '帰国予定日を確認し「再発行」か「帰国のための渡航書」を選ぶ',
    detail: '時間があるなら「再発行」、すぐ帰国するなら「帰国のための渡航書」。判断基準は次セクションで詳しく解説。',
    color: 'primary',
  },
  {
    step: 5,
    title: 'クレジットカード会社・保険会社・家族・職場に連絡',
    detail: 'クレカ不正利用防止、海外保険のサポート利用、家族へ状況共有。海外旅行保険には「身分証明書再発行費用」の補償が含まれる場合あり。',
    color: 'emerald',
  },
];

const TWO_OPTIONS = [
  {
    title: '① パスポートの再発行（Reissue）',
    when: '時間に余裕がある場合（最短1〜2週間、通常2〜4週間）',
    pros: ['完全な新しいパスポートを取得', '帰国後も継続使用可能', '次回渡航にもそのまま使える'],
    cons: ['発行に時間がかかる（戸籍謄本を日本から取り寄せる必要）', '費用がやや高い（10年16,000円、5年11,000円相当）', '滞在を延長する必要がある場合あり'],
    target: 'ワーホリ・留学中で現地に1ヶ月以上いられる方',
  },
  {
    title: '② 帰国のための渡航書（Travel Document for Returning to Japan）',
    when: 'すぐに帰国したい・帰国便が迫っている場合',
    pros: ['即日〜翌日発行可', '費用が安い（2,500円程度）', '戸籍謄本がなくても申請可（家族からのメール写真でもOK）'],
    cons: ['日本への直接帰国のみに使用可', '他国への観光・乗継には使えない', '帰国後にパスポート再発行が必要'],
    target: 'すぐに帰国したい方・滞在期限が迫っている方',
  },
];

const REQUIRED_DOCS = [
  {
    item: 'Police Report（盗難・紛失証明書）',
    detail: '現地の警察署で発行。「Passport was lost/stolen」を明記。盗難の場合は犯罪レポートとしても重要',
  },
  {
    item: '紛失届出書（旅券失効届）',
    detail: '在外公館で記入。氏名・生年月日・パスポート番号（覚えていれば）・紛失場所・状況',
  },
  {
    item: '一般旅券発給申請書 or 渡航書発給申請書',
    detail: '在外公館で記入 or 外務省サイトから事前ダウンロード可',
  },
  {
    item: '戸籍謄本（再発行のみ）',
    detail: '6ヶ月以内に発行されたもの。日本の家族に取り寄せてもらい、国際郵便で送付。再発行のみ必須',
  },
  {
    item: 'パスポート用写真（縦4.5cm×横3.5cm、6ヶ月以内）',
    detail: '現地の写真店・パスポートフォトサービスで撮影可。1枚〜2枚必要',
  },
  {
    item: '本人確認書類',
    detail: '運転免許証のコピー・マイナンバーカードのコピー・既存パスポートのコピー（あれば）',
  },
  {
    item: '帰国便のチケット（渡航書のみ）',
    detail: '帰国のための渡航書を申請する場合、帰国便のe-Ticketを提示',
  },
];

const EMBASSY_CONTACTS = [
  {
    country: '🇦🇺 オーストラリア',
    embassy: '在オーストラリア日本国大使館（キャンベラ）',
    consulates: 'シドニー総領事館・メルボルン総領事館・ブリスベン総領事館・パース総領事館',
    note: '24時間緊急連絡先あり。ワーホリ最多渡航国のため、日本人スタッフ対応が充実。',
  },
  {
    country: '🇨🇦 カナダ',
    embassy: '在カナダ日本国大使館（オタワ）',
    consulates: 'バンクーバー総領事館・トロント総領事館・カルガリー総領事館・モントリオール総領事館',
    note: '各都市の領事館はオンライン予約制が増加。緊急時は電話連絡を。',
  },
  {
    country: '🇳🇿 ニュージーランド',
    embassy: '在ニュージーランド日本国大使館（ウェリントン）',
    consulates: 'オークランド総領事館・クライストチャーチ領事事務所',
    note: 'オークランドが地理的に便利。',
  },
  {
    country: '🇮🇪 アイルランド',
    embassy: '在アイルランド日本国大使館（ダブリン）',
    consulates: '—（領事館は単一）',
    note: '人口が少なく、ダブリン大使館でほぼ全件対応。',
  },
  {
    country: '🇬🇧 イギリス',
    embassy: '在イギリス日本国大使館（ロンドン）',
    consulates: 'エディンバラ総領事館',
    note: 'ロンドン中心地。地方滞在者は事前予約を。',
  },
  {
    country: '🇵🇭 フィリピン',
    embassy: '在フィリピン日本国大使館（マニラ）',
    consulates: 'セブ領事事務所・ダバオ領事事務所',
    note: 'セブ留学者多数のため、セブ事務所の対応が早い。',
  },
  {
    country: '🇰🇷 韓国',
    embassy: '在韓国日本国大使館（ソウル）',
    consulates: '釜山総領事館・済州出張所',
    note: '即日対応も可能なケース多い。',
  },
];

const COST_TIME = [
  {
    type: 'パスポート再発行（10年・成人）',
    cost: '在外公館手数料 約16,000円相当',
    time: '通常2〜4週間（戸籍謄本の取り寄せ含む）',
    note: '戸籍謄本は日本の家族にお願いして国際郵便で送付してもらう',
  },
  {
    type: 'パスポート再発行（5年・20歳未満）',
    cost: '約11,000円相当',
    time: '通常2〜4週間',
    note: '同上',
  },
  {
    type: '帰国のための渡航書',
    cost: '約2,500円相当',
    time: '最短即日〜翌日',
    note: '戸籍謄本はメール写真でOKな在外公館も多い',
  },
  {
    type: 'パスポート用写真撮影',
    cost: '現地で500〜2,000円程度',
    time: '即日',
    note: '街中の写真店・コンビニタイプの機械でも可',
  },
];

const PREVENTION_TIPS = [
  'パスポートは原則ホテル・宿の金庫 or 部屋の隠し場所に保管。外出時はコピーのみ持参',
  'ICチップ部分のカラーコピーを2部作成（1部は荷物に、1部はクラウド保存）',
  'パスポート番号・発行日・有効期限をGoogleドライブやEvernote等にメモ',
  '緊急連絡先（家族・大使館・保険会社）をスマホとメモ帳の両方に',
  'パスポートホルダーは肌身離さないタイプ（ネックポーチ・腹巻型）を選ぶ',
  '盗難多発エリア（市場・観光地・夜の繁華街）では特に注意',
  'クレジットカードのコピーもパスポートとは別の場所に保管',
];

const FAQS = [
  {
    question: 'パスポートをなくしました。明日のフライトに間に合いますか？',
    answer:
      '通常のパスポート再発行は2〜4週間かかるため、明日のフライトには間に合いません。即日対応が必要なら「帰国のための渡航書」を申請してください。日本への直接帰国便のみ使用可で、最短即日〜翌日発行されます。費用は約2,500円。',
  },
  {
    question: 'Police Report（警察証明書）は必須ですか？',
    answer:
      'はい、在外公館での申請時に提出が求められます。特に盗難の場合は犯罪記録としても必要。最寄りの警察署（Police Station）で「I lost my passport」「My passport was stolen」と伝えれば数十分で発行されます。控えは必ず保管しましょう。',
  },
  {
    question: '戸籍謄本が日本にしかない場合は？',
    answer:
      'パスポート再発行には必須ですが、日本の家族に取り寄せてもらい国際郵便（DHL・FedEx等）で送付するのが一般的。3〜7日程度かかります。「帰国のための渡航書」なら戸籍謄本のメール写真でOKな大使館もあるので、急ぐ場合はそちらを選択。',
  },
  {
    question: 'クレジットカードや海外保険は使える？',
    answer:
      '海外旅行保険には「身分証明書再発行費用」の補償が含まれる場合があり、再発行手数料が補償対象になることも。クレカの付帯保険も同様。出発前に保険のSchedule of Benefitsをチェック。盗難の場合は警察証明書が補償申請に必須。',
  },
  {
    question: '紛失後、再発行までの滞在ビザはどうなる？',
    answer:
      '旧パスポートに貼付されていたビザは無効。新パスポート発行後、ビザのリラベル（再貼付）または再申請が必要な国があります。オーストラリアのワーホリビザは電子発給のためビザ自体は有効ですが、新パスポート情報を移民局のVEVO等で更新が必要。',
  },
];

export default async function PassportLostOverseasPage() {
  // 予約公開チェック
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  // パスポート・紛失・盗難・トラブル関連の言及をカウント
  const mentions = countMentions(all, /(パスポート|紛失|盗難|盗まれ|なくし|スリ|無くした|警察)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.cons?.map((c) => c.text).join(' ') ?? ''}`,
        /(パスポート|紛失|盗難|盗まれ|なくし|スリ|警察)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外パスポート紛失時の対処法', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外パスポート紛失時の対処法' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外でパスポートを紛失・盗難したら？今すぐやる5ステップと再発行手順
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="海外でパスポートを失くした方・予防策を知りたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              海外でパスポートを失くした瞬間、頭が真っ白になるのは普通のことです。
              <br />
              でも大丈夫。正しい手順で動けば、最短即日〜翌日で帰国できます。
              <br />
              この記事では、緊急時に今すぐやる5ステップ、再発行と帰国のための渡航書の違い、主要国の日本大使館連絡先、費用と日数の目安まで、必要な情報を一気にまとめました。
            </p>
            <div className="mt-4 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r">
              <p className="text-sm font-bold text-rose-900 mb-1">🚨 緊急の方へ</p>
              <p className="text-sm text-rose-900 leading-relaxed">
                まずは深呼吸。<a href="#first-actions" className="underline font-semibold">「今すぐやる5ステップ」</a>を読んで順番に対応してください。最寄りの日本大使館・領事館に電話するのが最速ルートです。
              </p>
            </div>
          </header>

          <KeyTakeaway
            items={[
              '紛失・盗難の場合、最寄りの警察でPolice Report取得が最初',
              '帰国を急ぐなら「帰国のための渡航書」を即日〜翌日発行可',
              'パスポート再発行は通常2〜4週間、戸籍謄本が必須',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 緊急5ステップ */}
          <section id="first-actions" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">【緊急】まず今すぐやる5ステップ</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              パニックにならず、上から順番に進めてください。1〜2時間で初動が完了します。
            </p>
            <ol className="space-y-3">
              {FIRST_ACTIONS.map((a) => (
                <li
                  key={a.step}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4"
                >
                  <span className={`shrink-0 inline-flex items-center justify-center w-10 h-10 bg-${a.color}-600 text-white rounded-full text-base font-bold`}>
                    {a.step}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2 text-base sm:text-lg">{a.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{a.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="保険を使う前に確認したいこと"
            description="海外保険には「身分証明書再発行費用」が含まれる場合あり。出発前に確認しておきましょう。"
            primaryHref="/wise-payment-guide"
            primaryLabel="Wise・クレカ・送金ガイド"
            secondaryHref="/packing"
            secondaryLabel="ワーホリ持ち物チェックリスト"
          />

          {/* 2つの選択肢 */}
          <section id="two-options" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">「再発行」と「帰国のための渡航書」の違い</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              パスポートを失くしたあと、選べるオプションは2つ。あなたの状況に合わせて選びましょう。
            </p>
            <div className="space-y-4">
              {TWO_OPTIONS.map((o, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg text-primary-700">{o.title}</h3>
                  <p className="text-xs font-semibold text-gray-500 mb-3">{o.when}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                      <p className="text-xs font-bold text-emerald-900 mb-1">メリット</p>
                      <ul className="text-xs text-emerald-900 space-y-1">
                        {o.pros.map((p, j) => (
                          <li key={j}>・{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 rounded-lg p-3">
                      <p className="text-xs font-bold text-rose-900 mb-1">注意点</p>
                      <ul className="text-xs text-rose-900 space-y-1">
                        {o.cons.map((c, j) => (
                          <li key={j}>・{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 bg-amber-50 px-3 py-2 rounded">
                    <strong>こんな方におすすめ：</strong> {o.target}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 必要書類 */}
          <section id="required-docs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">必要書類とその準備方法</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              在外公館での申請には、以下の書類が必要です。一覧で確認しましょう。
            </p>
            <div className="space-y-2">
              {REQUIRED_DOCS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1">{i + 1}. {d.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 大使館連絡先 */}
          <section id="embassy-contacts" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要国の日本大使館・領事館連絡先</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ワーホリ・留学先として人気の主要国を中心に整理しました。最新の電話番号・住所は<a href="https://www.mofa.go.jp/mofaj/annai/zaigai/list/index.html" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">外務省 在外公館リスト</a>で必ず確認を。
            </p>
            <div className="space-y-3">
              {EMBASSY_CONTACTS.map((e) => (
                <div key={e.country} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg">{e.country}</h3>
                  <p className="text-sm text-gray-800 mb-1">
                    <strong>大使館：</strong>{e.embassy}
                  </p>
                  <p className="text-sm text-gray-800 mb-2">
                    <strong>領事館：</strong>{e.consulates}
                  </p>
                  <p className="text-xs text-primary-700 bg-primary-50 px-3 py-2 rounded">
                    💡 {e.note}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 各在外公館には緊急連絡先（24時間対応）が設定されています。営業時間外でも電話を遠慮せず、状況を伝えてください。
            </p>
          </section>

          {/* 費用と日数 */}
          <section id="cost-time" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用と所要日数の目安</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">種類</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">費用</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">日数</th>
                    <th className="px-4 py-3 font-semibold">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_TIME.map((c, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium">{c.type}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{c.cost}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{c.time}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 在外公館の手数料は現地通貨建てで、最新の為替レート次第。最新情報は各在外公館の公式サイトでご確認ください。
            </p>
          </section>

          {/* 予防策 */}
          <section id="prevention" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">パスポート紛失・盗難を防ぐ予防策</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              出発前と滞在中に以下を意識すれば、紛失・盗難のリスクを大幅に下げられます。
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PREVENTION_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るトラブル実態</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{mentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {mentions.containsCount}件</strong>
                （{mentions.percentage}%）が「パスポート・盗難・紛失・警察」関連について言及していました。
              </p>
              <p className="text-xs text-gray-500">
                ※ advice/pros/cons から関連キーワードを含む体験談を抽出（参考値）。実際にトラブルに遭った方は少数派ですが、発生時の影響は大きいため予防策が重要です。
              </p>
            </div>
            {sample && quoteText && (
              <QuoteFromExperience text={quoteText} experience={sample} truncated />
            )}
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">よくある質問</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <details key={i} className="bg-gray-50 rounded-lg p-4 group">
                  <summary className="font-medium cursor-pointer list-none flex items-center justify-between gap-3">
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            ※ 本記事は2026年5月時点の一般情報です。最新の手数料・必要書類は<a href="https://www.mofa.go.jp/mofaj/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">外務省公式サイト</a>および在外公館へ必ずご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/packing" className="text-primary-600 hover:underline">
                  → ワーホリ持ち物チェックリスト（パスポート・コピーの保管）
                </Link>
              </li>
              <li>
                <Link href="/wise-payment-guide" className="text-primary-600 hover:underline">
                  → Wise・クレカ・両替の完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/wh-labor-rights" className="text-primary-600 hover:underline">
                  → ワーホリのトラブル対処（労働権利侵害）
                </Link>
              </li>
              <li>
                <Link href="/wh-mental-health" className="text-primary-600 hover:underline">
                  → ワーホリのメンタルヘルス完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/women" className="text-primary-600 hover:underline">
                  → 女性一人ワーホリ完全ガイド（安全対策）
                </Link>
              </li>
              <li>
                <Link href="/guide/safety-mental" className="text-primary-600 hover:underline">
                  → ワーホリガイド：安全とメンタル
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
