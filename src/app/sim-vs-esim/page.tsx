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
import ServiceHubLink from '@/components/affiliate/ServiceHubLink';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { getExperiences } from '@/lib/microcms/experiences';
import { countMentions, extractMatchingSentence } from '@/lib/stats/experiences-cross';
import { isPublished } from '@/lib/publish/schedule';

const PAGE_PATH = '/sim-vs-esim';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外SIM vs eSIM 完全比較｜選び方・おすすめサービス・国別最安プラン',
  description: '留学・ワーホリ・旅行向けの海外SIMとeSIMを徹底比較。違い・メリット・デメリット、Airalo/Holafly/Sailの比較、国別最安プラン、トラブル対処を完全解説。',
  path: PAGE_PATH,
  keywords: [
    '海外 SIM eSIM 比較',
    '海外 eSIM',
    '海外 SIM おすすめ',
    'Airalo',
    'Holafly',
    'ワーホリ SIM',
  ],
});

const TOC_HEADINGS = [
  { id: 'difference', label: '物理SIMとeSIMの違い' },
  { id: 'pros-cons', label: 'メリット・デメリット比較' },
  { id: 'esim-services', label: 'eSIM主要サービス比較' },
  { id: 'physical-sim', label: '物理SIM主要サービス' },
  { id: 'by-country', label: '国別最安プラン' },
  { id: 'how-to-setup', label: 'eSIM設定手順5ステップ' },
  { id: 'common-trouble', label: 'よくあるトラブルと対処' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const PROS_CONS_TABLE = [
  { item: '購入タイミング', sim: '現地空港 or 事前郵送', esim: '出発前にオンライン即時' },
  { item: '到着時の利用開始', sim: '購入＋設定が必要', esim: '到着前から有効化済' },
  { item: '価格', sim: '安い（プリペイド）', esim: '少し高め（10-20%）' },
  { item: '通信品質', sim: '現地キャリア直接、最良', esim: '提携キャリア、ほぼ同等' },
  { item: '電話番号', sim: '現地番号付き', esim: '電話番号なし or データのみ' },
  { item: 'デバイス対応', sim: 'ほぼ全機種', esim: 'iPhone XS以降・Pixel 3以降等' },
  { item: '紛失リスク', sim: 'カード紛失あり', esim: 'デジタルなし' },
];

const ESIM_SERVICES = [
  { name: 'Airalo', area: '200ヶ国以上', plan: '$4.5〜（1GB/7日〜）', detail: '世界最大手eSIM。アプリ使いやすい、初心者向け' },
  { name: 'Holafly', area: '170ヶ国', plan: '€19〜（無制限/5日〜）', detail: '無制限プラン強み、テザリング可' },
  { name: 'Sail（楽天モバイル）', area: '125ヶ国', plan: '500円〜（500MB/3日〜）', detail: '日本円決済、サポート日本語' },
  { name: 'Ubigi', area: '190ヶ国', plan: '$4.5〜（500MB/30日〜）', detail: '長期プラン豊富、欧州強み' },
  { name: 'Glocalme', area: '140ヶ国', plan: '$3〜（300MB/1日〜）', detail: '短期旅行向けの細かいプラン' },
];

const PHYSICAL_SIMS = [
  { country: 'オーストラリア', recommended: 'Optus、Vodafone、Lebara', plan: 'AUD 30/月で50GB' },
  { country: 'カナダ', recommended: 'Lucky Mobile、Public Mobile、Fido', plan: 'CAD 30-40/月で10-50GB' },
  { country: 'イギリス', recommended: 'GiffGaff、SMARTY、Vodafone', plan: '£10-20/月で20GB' },
  { country: 'ドイツ', recommended: 'Aldi Talk、O2、Vodafone', plan: '€10-25/月で20GB' },
  { country: 'フィリピン', recommended: 'Smart、Globe', plan: 'PHP 500/月で30GB' },
];

const SETUP_STEPS = [
  { step: 1, title: 'eSIM対応機種か確認', detail: 'iPhone XS以降、Pixel 3以降、Galaxy S20以降がeSIM対応' },
  { step: 2, title: 'サービスでeSIMプラン購入', detail: 'Airalo/Holafly等のアプリで国・期間・データ量を選択' },
  { step: 3, title: 'QRコードを受領（メール）', detail: '購入直後にQRコード送信、保管しておく' },
  { step: 4, title: 'スマホ設定で「モバイル通信プラン追加」', detail: 'iPhone：設定→モバイル通信→eSIM追加→QRコード読取' },
  { step: 5, title: '渡航先で有効化', detail: '飛行機降りてWi-FiオフOK、自動接続' },
];

const COMMON_TROUBLE = [
  'eSIM対応機種でなかった → 物理SIMかWi-Fiルーターに切替',
  'QRコードを失くした → アプリ内で再発行可能（多くのサービス）',
  '現地に着いたが繋がらない → モバイルデータローミングをオン、ネットワーク手動選択',
  'データ使い切り → アプリでトップアップ追加購入',
  '電話番号が必要なケース → 物理SIM併用 or 050IP電話アプリ',
];

const FAQS = [
  {
    question: 'eSIMと物理SIMどちらがおすすめ？',
    answer:
      '短期旅行・出張ならeSIM（即時利用・紛失リスクなし）、長期滞在ならeSIMで初動＋物理SIMに切替が定番。eSIM対応機種なら、最初の1〜2週間eSIMで凌ぎ、現地で物理SIM契約して長期利用に切り替えるのがコスパ最強です。',
  },
  {
    question: 'AiraloとHolaflyどっち？',
    answer:
      'データ量重視ならAiralo（細かいプラン）、テザリング・無制限重視ならHolafly。Airaloは日本人ユーザー多くアプリ使いやすい、$4.5〜で気軽に試せる。Holaflyは€19〜で5日無制限プランから、長期旅行に強み。',
  },
  {
    question: 'eSIMで電話番号は使える？',
    answer:
      '多くのeSIMはデータのみで電話番号なし。電話受発信が必要なら物理SIMが必須。050IP電話アプリ（SMARTalk等）と組み合わせれば、データeSIM＋IP電話で乗り切ることも可能。',
  },
  {
    question: '日本のSIMをそのまま海外で使えない？',
    answer:
      '使えるが高額。ドコモ・au・ソフトバンクの海外パケットは1日2,980円〜と非常に高い。月数万円かかるため、現地SIM or eSIM一択。日本のSIMロックを解除しておくのが事前準備として重要。',
  },
  {
    question: 'SIMロック解除は必須？',
    answer:
      '物理SIMもeSIMも、現地SIMを使うなら必須。ドコモ・au・ソフトバンクの公式サイトでオンライン申請、即日無料。2022年以降の機種はSIMロックフリーが標準。中古機種を使う場合は確認必須。',
  },
];

export default async function SimVsEsimPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(SIM|eSIM|通信|データ|Wi-Fi|携帯)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(SIM|eSIM|通信|データ|Wi-Fi|携帯)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外SIM vs eSIM 完全比較', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外SIM vs eSIM 完全比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外SIM vs eSIM 完全比較｜選び方・おすすめサービス・国別最安プラン
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="留学・ワーホリ・旅行で海外通信を準備中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              海外でスマホを使う方法は「物理SIM」「eSIM」「Wi-Fiルーター」の3択。近年eSIMが急速に普及し、出発前にオンラインで購入→到着即利用が可能に。
              <br />
              この記事では物理SIMとeSIMを徹底比較、主要サービス（Airalo/Holafly等）、国別最安プラン、設定手順まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '短期旅行ならeSIM、長期滞在ならeSIM＋物理SIM併用',
              'eSIM大手はAiralo（細かいプラン）・Holafly（無制限）',
              'SIMロック解除は必須、ドコモ等で無料即日申請可',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 違い */}
          <section id="difference" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">物理SIMとeSIMの違い</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              eSIM（embedded SIM）は端末内蔵型の電子SIMで、QRコード読込で即時有効化できます。物理SIMは従来通りのカード型。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-sky-800">📱 物理SIM</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  カード型SIMを端末に挿入。現地空港 or 街中のキャリアショップで購入。
                  価格安く、現地番号付きで、ほぼ全機種対応。
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-emerald-800">📲 eSIM</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  端末内蔵チップにオンライン登録。出発前にオンライン購入→QRコード読込で即有効化。
                  カード紛失リスクなし、即日利用可、対応機種限定。
                </p>
              </div>
            </div>
          </section>

          {/* メリデメ */}
          <section id="pros-cons" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">メリット・デメリット比較</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-2 py-2 text-left">項目</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">物理SIM</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">eSIM</th>
                  </tr>
                </thead>
                <tbody>
                  {PROS_CONS_TABLE.map((p, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{p.item}</td>
                      <td className="border border-gray-200 px-2 py-2">{p.sim}</td>
                      <td className="border border-gray-200 px-2 py-2">{p.esim}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ServiceHubLink
            intent="wifi"
            title="海外Wi-Fiレンタルも比較候補に"
            description="SIM・eSIM以外に、複数端末で共有しやすいレンタルWi-Fiの広告サービスも確認できます。対応国や受取方法は各社で異なります。"
          />

          {/* eSIMサービス */}
          <section id="esim-services" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">eSIM主要サービス比較</h2>
            <div className="space-y-3">
              {ESIM_SERVICES.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{s.name}</p>
                    <p className="text-sm font-bold text-amber-700">{s.plan}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">対応エリア: {s.area}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="国別SIM情報も合わせて"
            description="カナダ・各国のSIMカード詳細情報、出発前準備を完璧に。"
            primaryHref="/canada-sim-card"
            primaryLabel="カナダSIMカード詳細"
            secondaryHref="/pre-departure-checklist"
            secondaryLabel="出発前チェックリスト"
          />

          {/* 物理SIM */}
          <section id="physical-sim" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">物理SIM主要サービス（国別）</h2>
            <div className="space-y-3">
              {PHYSICAL_SIMS.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{s.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-1"><strong>推奨キャリア:</strong> {s.recommended}</p>
                  <p className="text-sm text-amber-700 font-bold">{s.plan}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 国別最安 */}
          <section id="by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別最安プラン</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              短期（1ヶ月）と長期（3ヶ月超）で選び方が変わります。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・<strong>1〜2週間旅行:</strong> Airalo or Holaflyの短期プラン（$10-20）</p>
              <p>・<strong>1ヶ月留学:</strong> eSIMで初動→現地物理SIMに切替（合計$50〜）</p>
              <p>・<strong>3ヶ月以上滞在:</strong> 現地物理SIMの月額プランが圧倒的お得（月$20-40）</p>
              <p>・<strong>複数国周遊:</strong> Airaloの「Regional eSIM」が便利（欧州・東南アジア等）</p>
            </div>
          </section>

          {/* 設定手順 */}
          <section id="how-to-setup" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">eSIM設定手順5ステップ</h2>
            <div className="space-y-3">
              {SETUP_STEPS.map((s) => (
                <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {s.step}: {s.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* トラブル */}
          <section id="common-trouble" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくあるトラブルと対処</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {COMMON_TROUBLE.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「SIM・eSIM・通信」関連の言及を集計。
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
            ※ 料金・プラン・対応機種は2026年5月時点の情報です。最新情報は各サービス公式サイトでご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/canada-sim-card" className="text-primary-600 hover:underline">→ カナダSIMカード詳細</Link></li>
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト</Link></li>
              <li><Link href="/packing" className="text-primary-600 hover:underline">→ 持ち物リスト</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金・クレカ</Link></li>
              <li><Link href="/banking-overseas" className="text-primary-600 hover:underline">→ 海外銀行口座開設</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
