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

const PAGE_PATH = '/international-driving-permit';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '国際運転免許証 取得完全ガイド｜申請手順・期限・国別の使い方',
  description: '海外で運転するなら必須の国際運転免許証。即日発行の申請手順、必要書類、有効期限1年の落とし穴、国別の使い分け（ジュネーブ条約 vs ウィーン条約）、現地免許への切替まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    '国際免許',
    '国際運転免許証',
    '国際免許 取得',
    '国際免許 期限',
    'ワーホリ 運転',
    '海外 運転免許',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-needed', label: 'なぜ国際免許が必要なのか' },
  { id: 'how-to-apply', label: '申請手順（即日発行）' },
  { id: 'documents', label: '必要書類と費用' },
  { id: 'validity', label: '有効期限1年の落とし穴' },
  { id: 'by-country', label: '国別の使えるルール' },
  { id: 'local-license', label: '現地免許への切替手続き' },
  { id: 'common-mistakes', label: 'よくあるトラブルと対処' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const APPLY_STEPS = [
  { step: 1, title: '都道府県の運転免許センター・警察署を確認', detail: '東京は鮫洲・府中・江東で発行可。即日発行は免許センターのみ' },
  { step: 2, title: '必要書類を準備', detail: '運転免許証・パスポート・写真1枚・申請書・手数料2,350円' },
  { step: 3, title: '免許センターで申請', detail: '受付→申請書記入→写真撮影→収入印紙購入→受領、所要約1時間' },
  { step: 4, title: '即日発行（A6サイズの冊子）', detail: '免許センターは即日、警察署は1〜2週間' },
];

const DOCUMENTS = [
  { item: '日本の運転免許証', detail: '有効期限内必須、ゴールド/ブルー/グリーン問わず' },
  { item: 'パスポート', detail: '有効期限内、すぐ渡航する証明' },
  { item: '写真1枚（5×4cm）', detail: '6ヶ月以内撮影、無背景、無帽' },
  { item: '申請書（現地で記入）', detail: '免許センター窓口で取得' },
  { item: '手数料2,350円（収入印紙）', detail: 'センター内で購入可' },
  { item: '渡航を証明する書類（任意）', detail: '航空券・ビザ等、求められれば提示' },
];

const COUNTRY_RULES = [
  { country: 'オーストラリア', rule: '国際免許で運転可（最長3ヶ月）。長期滞在は現地免許切替推奨' },
  { country: 'カナダ', rule: '国際免許で3-6ヶ月運転可（州により異なる）。長期は現地免許切替必須' },
  { country: 'ニュージーランド', rule: '国際免許で12ヶ月運転可、長期は現地免許へ' },
  { country: 'イギリス', rule: '国際免許で12ヶ月運転可。日本の免許でも12ヶ月OK' },
  { country: 'アメリカ', rule: '州により異なる。多くの州で運転可、CA・NY等は即現地免許推奨' },
  { country: 'ドイツ', rule: 'ウィーン条約なので国際免許でOK。6ヶ月以内' },
  { country: 'フランス・イタリア', rule: 'ウィーン条約。国際免許＋日本免許携帯で運転可' },
  { country: 'タイ・台湾', rule: '国際免許OK。一部国は日本免許の翻訳証明が必要' },
];

const COMMON_MISTAKES = [
  '有効期限を「日本での発給日から1年」と勘違い（実は発給日から1年で、渡航中に切れることが多い）',
  '出発前に取得せず、現地で取れると思い込む（取れない、日本でしか発行不可）',
  '免許センター以外（警察署）で申請して時間切れ',
  '写真サイズ間違いで再撮影（5×4cm必須）',
  '日本の免許とセットでないと無効（国際免許単独では運転不可）',
  '長期滞在で現地免許への切替を忘れ、無免許運転扱い',
];

const FAQS = [
  {
    question: '国際免許はどこで取れる？費用は？',
    answer:
      '都道府県の運転免許センターで即日発行可能。費用は2,350円（収入印紙）。警察署でも申請可能ですが、1〜2週間かかります。出発前に余裕を持って取得を。海外では取れません。',
  },
  {
    question: '有効期限はいつまで？延長できる？',
    answer:
      '発給日から1年間。延長はできません。1年を超える渡航の場合、現地で運転を続けるには現地免許への切替が必要。長期滞在予定者は出発時期と取得時期を逆算して取得を。',
  },
  {
    question: 'すべての国で使える？',
    answer:
      'ジュネーブ条約（1949年）加盟国＋ウィーン条約加盟国の合計100か国以上で有効。オーストラリア・カナダ・ニュージーランド・イギリス・アメリカ・ドイツ・フランス・タイ等の主要国はすべて対応。中国・ベトナム・キューバ等は非加盟のため使えません。',
  },
  {
    question: '日本の免許も一緒に持つ必要がある？',
    answer:
      '必須です。国際免許は「翻訳証明書」の位置づけで、日本の免許とセットで初めて有効。現地で運転中にどちらかを忘れたら、無免許運転扱いになります。両方を必ず携帯しましょう。',
  },
  {
    question: '長期滞在の場合、現地免許に切り替えるべき？',
    answer:
      '滞在3ヶ月超なら検討、1年超なら必須に近いです。豪・加・NZ・英は「日本免許→現地免許」へ筆記試験のみで切替可能（実技試験免除のことが多い）。期限・要件は州・国により異なるため、現地到着後に運輸局へ確認を。',
  },
];

export default async function InternationalDrivingPermitPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(免許|運転|車|ドライブ|レンタカー)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(免許|運転|車|ドライブ|レンタカー)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '国際運転免許証 取得完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '国際運転免許証 取得完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              国際運転免許証 取得完全ガイド｜申請手順・期限・国別の使い方
            </h1>
            <ArticleMetaBadge
              readingMinutes={8}
              updatedAt="2026年5月"
              targetAudience="海外で運転する予定の方／長期滞在予定者"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリ・留学・旅行で海外で運転するなら必須の国際運転免許証。費用2,350円・即日発行・申請所要1時間と意外に手軽ですが、有効期限1年・現地免許切替・国別ルールの落とし穴があります。
              <br />
              この記事では申請手順、必要書類、国別ルール、現地免許切替まで実用情報を完全解説。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '都道府県免許センターで即日発行・2,350円・所要約1時間',
              '有効期限は発給日から1年、延長不可',
              '日本の免許と必ずセット携帯、長期滞在は現地免許切替',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ必要 */}
          <section id="why-needed" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ国際免許が必要なのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              海外で日本の免許のみで運転すると、ほとんどの国で無免許運転扱いになります。国際運転免許証は「日本の免許の翻訳証明書」の位置づけで、ジュネーブ条約またはウィーン条約に基づき発行され、加盟国で通用します。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・レンタカー利用（旅行・現地での移動）</li>
              <li>・現地で車を購入して運転する場合（カナダ・米西海岸等）</li>
              <li>・友人の車を運転する場合（万一の事故時に保険適用）</li>
              <li>・身分証としても通用</li>
            </ul>
          </section>

          {/* 申請手順 */}
          <section id="how-to-apply" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申請手順（即日発行）</h2>
            <div className="space-y-3">
              {APPLY_STEPS.map((s) => (
                <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {s.step}: {s.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 必要書類 */}
          <section id="documents" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">必要書類と費用</h2>
            <div className="space-y-3">
              {DOCUMENTS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{d.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="出発前にやることリストで漏れなく準備"
            description="国際免許以外の出発前手続き60項目を時期別タイムラインで確認。"
            primaryHref="/pre-departure-checklist"
            primaryLabel="出発前チェックリスト60項目"
            secondaryHref="/packing"
            secondaryLabel="持ち物リスト"
          />

          {/* 有効期限 */}
          <section id="validity" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">有効期限1年の落とし穴</h2>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                <strong className="text-rose-800">⚠️ 重要：</strong>有効期限は「発給日から1年」です。「出国日から」ではないため、出発前2ヶ月前に取得すると、現地での有効期間は10ヶ月しかありません。
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・1年以内の滞在 → 出発直前（2週間前）に取得が最適</li>
                <li>・1年超の滞在 → 国際免許の期限切れ前に現地免許への切替必須</li>
                <li>・延長・更新は不可（再発行も国内のみ）</li>
                <li>・1年超滞在予定者は、現地免許切替を計画的に進める</li>
              </ul>
            </div>
          </section>

          {/* 国別ルール */}
          <section id="by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別の使えるルール</h2>
            <div className="space-y-3">
              {COUNTRY_RULES.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{c.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.rule}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 現地免許切替 */}
          <section id="local-license" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">現地免許への切替手続き</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              長期滞在中は、現地の運輸局・DMVで「日本の免許→現地免許」に切り替えるのが王道です。
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <li className="leading-relaxed">✓ 必要書類：日本の免許＋翻訳証明（大使館/JAF発行）＋パスポート＋滞在証明</li>
              <li className="leading-relaxed">✓ 多くの国で筆記試験のみ、実技試験は免除</li>
              <li className="leading-relaxed">✓ 費用は$30〜$150、所要1〜4週間</li>
              <li className="leading-relaxed">✓ 切替先は5年〜永久有効、現地保険適用がスムーズに</li>
              <li className="leading-relaxed">✓ 帰国後も日本の免許は有効（戻ってきて使用可）</li>
            </ul>
          </section>

          {/* よくあるトラブル */}
          <section id="common-mistakes" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくあるトラブルと対処</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {COMMON_MISTAKES.map((m, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「免許・運転・車」関連の言及を集計。
                該当言及は <strong className="text-primary-700">{mentions.containsCount}件</strong>。
              </p>
              <p className="text-xs text-gray-500">
                ※ サンプル数が少ない場合は参考値として捉えてください。
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

          {/* 免責 */}
          <div className="mb-8 text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-4">
            ※ 国別ルール・申請要件は2026年5月時点の情報です。最新情報は各国大使館・JAF（日本自動車連盟）公式情報、現地運輸局でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト60項目</Link></li>
              <li><Link href="/packing" className="text-primary-600 hover:underline">→ 持ち物リスト</Link></li>
              <li><Link href="/australia-farm-job" className="text-primary-600 hover:underline">→ オーストラリアファームジョブ</Link></li>
              <li><Link href="/sydney-sharehouse" className="text-primary-600 hover:underline">→ シドニーシェアハウス</Link></li>
              <li><Link href="/canada-sim-card" className="text-primary-600 hover:underline">→ カナダSIMカード</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術20選</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
