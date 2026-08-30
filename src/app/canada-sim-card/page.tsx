import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { isPublished } from '@/lib/publish/schedule';

const PAGE_PATH = '/canada-sim-card';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'カナダのSIMカード完全ガイド｜キャリア比較・プラン・契約手順【2026年版】',
  description: 'カナダでSIMカードを契約する完全ガイド。Rogers・Bell・Telus等のメジャー3キャリア、Fido・Koodo等の格安系、プリペイドvs後払い、プラン選び、渡航直後の手続き手順まで解説。',
  path: PAGE_PATH,
  keywords: [
    'カナダ SIM',
    'カナダ 携帯',
    'カナダ SIMカード',
    'カナダ プリペイド',
    'カナダ スマホ プラン',
    'バンクーバー SIM',
  ],
});

const TOC_HEADINGS = [
  { id: 'three-types', label: 'カナダの携帯キャリア3階層' },
  { id: 'major-carriers', label: 'メジャー3社の比較（Rogers・Bell・Telus）' },
  { id: 'budget-carriers', label: '格安系（Fido・Koodo・Public・Lucky）' },
  { id: 'prepaid-vs-postpaid', label: 'プリペイド vs 後払い、どちらを選ぶ？' },
  { id: 'plans', label: 'データ容量別おすすめプラン' },
  { id: 'how-to-buy', label: '渡航直後の契約手順5ステップ' },
  { id: 'tips', label: '節約と利便性のTips' },
  { id: 'faq', label: 'よくある質問' },
];

const MAJOR_CARRIERS = [
  { name: 'Rogers', coverage: '◎ 全国カバー', price: 'CAD 60〜100/月', feature: '最大手・電波最強・後払い前提・契約2年' },
  { name: 'Bell', coverage: '◎ 全国カバー', price: 'CAD 55〜95/月', feature: '老舗・電波安定・東部に強い' },
  { name: 'Telus', coverage: '◎ 全国カバー', price: 'CAD 55〜95/月', feature: '西部に強い・カスタマー対応評判◎' },
];

const BUDGET_CARRIERS = [
  { name: 'Fido', parent: 'Rogers系列', price: 'CAD 35〜60/月', feature: 'プリペイドOK・短期向け・電波はRogersと同じ' },
  { name: 'Koodo', parent: 'Telus系列', price: 'CAD 35〜60/月', feature: 'プリペイドOK・契約縛りなしプランあり' },
  { name: 'Public Mobile', parent: 'Telus系列', price: 'CAD 15〜45/月', feature: '完全オンライン・自動更新・最安級' },
  { name: 'Lucky Mobile', parent: 'Bell系列', price: 'CAD 15〜40/月', feature: 'プリペイド限定・コスパ◎' },
  { name: 'Freedom Mobile', parent: '独立系', price: 'CAD 25〜50/月', feature: '都市部のみカバー・データ無制限プランあり' },
  { name: 'Chatr Mobile', parent: 'Rogers系列', price: 'CAD 25〜45/月', feature: 'プリペイド専門・店舗多数' },
];

const PLAN_GUIDE = [
  { usage: 'ライト（外出時の地図・連絡のみ）', data: '4〜8GB', cost: 'CAD 25〜35', recommend: 'Public Mobile・Lucky' },
  { usage: 'スタンダード（SNS・動画ライト）', data: '15〜30GB', cost: 'CAD 35〜50', recommend: 'Koodo・Fido' },
  { usage: 'ヘビー（YouTube・配信視聴）', data: '50GB〜無制限', cost: 'CAD 50〜80', recommend: 'Freedom・Rogers Infinite' },
];

const STEPS = [
  { num: 1, title: '空港でレンタルWi-Fi or 無料Wi-Fiで一時凌ぎ', detail: '空港・カフェで無料Wi-Fiを使い、最初の数日間を乗り切る' },
  { num: 2, title: '住居決定後にSIM契約', detail: '住所が必要なため、宿泊先（ホテルでも可）の住所を準備' },
  { num: 3, title: 'SIM契約店舗を訪問', detail: 'Rogers・Bell・Telusの店舗、または格安系のオンライン契約' },
  { num: 4, title: 'パスポート・SIN番号（または書類）提示', detail: 'プリペイドはパスポートのみでOK、後払いはSIN・クレカ必要' },
  { num: 5, title: 'プラン選択・SIM受領・即日開通', detail: '物理SIMが主流、最近はeSIMも増加' },
];

const FAQS = [
  {
    question: 'カナダで一番おすすめのSIMキャリアは？',
    answer:
      '短期（1ヶ月以下）ならPublic Mobile・Lucky Mobileの格安プリペイド（月CAD 15〜30）。長期（6ヶ月以上）でも電波品質を重視するならFido・Koodo（月CAD 35〜50）。Rogersはサポート充実だが2年縛り契約が前提のため、ワーホリ・留学では非推奨。',
  },
  {
    question: 'プリペイドと後払い、どちらがいい？',
    answer:
      'ワーホリ・留学はプリペイド一択。後払いは2年契約縛り＋SINクレカ必要で、短期滞在には向きません。プリペイドは月単位で解約・乗り換え可能、初期費用も安い。',
  },
  {
    question: '日本のスマホはカナダで使える？',
    answer:
      'SIMフリースマホなら使えます。日本で購入時にキャリア縛りがある場合はSIMロック解除が必要（出発前に各キャリア窓口で手続き）。iPhoneは比較的SIMフリー化しやすい。',
  },
  {
    question: 'eSIMは使える？',
    answer:
      '2024年以降eSIM対応キャリアが増加。Rogers・Bell・Telus・Public Mobileがすでに対応。事前にネット申込→QRコードでアクティベートできるため、空港到着即時に使えるのが最大の利点。',
  },
  {
    question: 'カナダのSIMで日本に通話したい場合は？',
    answer:
      'WhatsApp・LINE・Facetime等のVoIP（インターネット通話）で十分。月のデータ容量内で通話可能。通常の国際電話（電話番号を直接かける）は1分CAD 1〜3かかるため、極力VoIPを使う。',
  },
];

export default function CanadaSimCardPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'カナダのSIMカード完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'カナダのSIMカード完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              カナダのSIMカード完全ガイド｜キャリア比較・プラン・契約手順
            </h1>
            <ArticleMetaBadge
              readingMinutes={8}
              updatedAt="2026年5月"
              targetAudience="カナダ渡航前後の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              カナダのSIMカード選びは「メジャー3社 vs 格安系9社 × プリペイド vs 後払い」の組み合わせで悩むポイントが多い分野。
              <br />
              ワーホリ・留学なら結論「格安系プリペイド（Public Mobile・Lucky Mobile・Koodo等）」が最適解です。
              <br />
              この記事では、各キャリアの違い、プラン選び、契約手順までを完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'ワーホリ・留学は格安系プリペイド一択（月CAD 15〜50）',
              'メジャー3社（Rogers・Bell・Telus）は2年縛りで短期滞在に不向き',
              'eSIM対応キャリアなら渡航前にオンライン契約可能',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 3階層 */}
          <section id="three-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">カナダの携帯キャリア3階層</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              カナダのモバイル市場は3階層構造になっています。
            </p>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">① メジャー3社（Big Three）</h3>
                <p className="text-sm text-gray-700">Rogers・Bell・Telus。電波カバレッジ最強・後払い前提・2年契約縛り</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">② 格安系（サブブランド）</h3>
                <p className="text-sm text-gray-700">Fido・Koodo・Public Mobile・Lucky Mobile・Chatr。メジャー3社の電波を借りて運営。安い＆プリペイドOK</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">③ 独立系</h3>
                <p className="text-sm text-gray-700">Freedom Mobile等。独自の電波網、主要都市のみカバー、月額安い</p>
              </div>
            </div>
          </section>

          {/* メジャー3社 */}
          <section id="major-carriers" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">メジャー3社の比較（Rogers・Bell・Telus）</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold">キャリア</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">カバレッジ</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">月額目安</th>
                    <th className="px-3 py-3 font-semibold">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {MAJOR_CARRIERS.map((c) => (
                    <tr key={c.name} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium">{c.name}</td>
                      <td className="px-3 py-3 text-xs">{c.coverage}</td>
                      <td className="px-3 py-3 text-xs">{c.price}</td>
                      <td className="px-3 py-3 text-xs">{c.feature}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ メジャー3社は2年契約縛りが基本。ワーホリ・留学には非推奨。
            </p>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="カナダ全体の生活情報・仕事探しもチェック"
            description="SIMが決まったら次は仕事・住居。カナダのワーホリ全体像を確認。"
            primaryHref="/countries/canada"
            primaryLabel="カナダ国別完全ガイド"
            secondaryHref="/canada-iec-visa"
            secondaryLabel="カナダIECビザ申請"
          />

          {/* 格安系 */}
          <section id="budget-carriers" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">格安系（Fido・Koodo・Public・Lucky・Chatr・Freedom）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ワーホリ・留学に最適。メジャー3社の電波を借りているため品質はほぼ同等。月額が半額以下＋プリペイド可能。
            </p>
            <div className="space-y-3">
              {BUDGET_CARRIERS.map((c) => (
                <div key={c.name} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <h3 className="font-bold text-base">{c.name}</h3>
                    <span className="text-sm font-bold text-primary-700">{c.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">系列: {c.parent}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* プリペイドvs後払い */}
          <section id="prepaid-vs-postpaid" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">プリペイド vs 後払い、どちらを選ぶ？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <h3 className="font-bold text-emerald-900 mb-3">⭕ プリペイド（推奨）</h3>
                <ul className="text-sm text-emerald-900 space-y-1.5 list-disc pl-5">
                  <li>月単位で解約・乗り換え可能</li>
                  <li>SIN番号・クレカ不要、パスポートでOK</li>
                  <li>初期費用が安い（SIMカード CAD 10〜25）</li>
                  <li>使った分だけ支払い、超過時は自動停止</li>
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                <h3 className="font-bold text-rose-900 mb-3">⚠️ 後払い（非推奨）</h3>
                <ul className="text-sm text-rose-900 space-y-1.5 list-disc pl-5">
                  <li>2年契約縛り（解約料CAD 200〜500）</li>
                  <li>SIN番号・クレカ・信用履歴が必要</li>
                  <li>端末割引で実質安く見えるが長期は割高</li>
                  <li>ワーホリ期間中に契約期間内帰国＝解約料発生</li>
                </ul>
              </div>
            </div>
          </section>

          {/* プラン */}
          <section id="plans" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">データ容量別おすすめプラン</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold">使用量タイプ</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">データ目安</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">月額</th>
                    <th className="px-3 py-3 font-semibold">おすすめキャリア</th>
                  </tr>
                </thead>
                <tbody>
                  {PLAN_GUIDE.map((p) => (
                    <tr key={p.usage} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium text-xs">{p.usage}</td>
                      <td className="px-3 py-3 text-xs">{p.data}</td>
                      <td className="px-3 py-3 text-xs">{p.cost}</td>
                      <td className="px-3 py-3 text-xs">{p.recommend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 契約手順 */}
          <section id="how-to-buy" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">渡航直後の契約手順5ステップ</h2>
            <ol className="space-y-3">
              {STEPS.map((s) => (
                <li key={s.num} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                  <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold">
                    {s.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1 text-base">{s.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Tips */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">節約と利便性のTips</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・eSIM対応キャリアなら渡航前にオンライン契約→空港到着即時に使える</li>
              <li>・カフェ・図書館・モールの無料Wi-Fiを活用してデータ消費を抑える</li>
              <li>・電話番号は日本のものを「休止」しておく（月100円〜）と帰国後すぐ復活可</li>
              <li>・WhatsApp・LINEで国際通話＝無料、SMS・通話プランは最小限でOK</li>
              <li>・冬季（12〜2月）は屋外データ通信が不安定になりやすい</li>
            </ul>
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

          <p className="text-xs text-gray-500 mb-8">
            ※ 各キャリアの料金・プラン内容は2026年5月時点。最新情報は各社公式サイトでご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/countries/canada" className="text-primary-600 hover:underline">→ カナダ国別ガイド</Link></li>
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ申請</Link></li>
              <li><Link href="/vancouver-language-school" className="text-primary-600 hover:underline">→ バンクーバー語学学校</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金ガイド</Link></li>
              <li><Link href="/packing" className="text-primary-600 hover:underline">→ ワーホリ持ち物チェックリスト</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術20選</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
