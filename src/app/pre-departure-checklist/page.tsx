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

const PAGE_PATH = '/pre-departure-checklist';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '【出発前チェックリスト完全版】留学・ワーホリでやることリスト60項目｜時期別タイムライン',
  description: '留学・ワーホリ出発前にやることを「6ヶ月前〜前日」までタイムライン形式で60項目に整理。住民票・年金・健康保険・税金・銀行・スマホ・保険・荷物まで、漏れなくチェック。',
  path: PAGE_PATH,
  keywords: [
    '留学 出発前 やること',
    'ワーホリ 出発前 チェックリスト',
    '留学 準備 期間',
    'ワーホリ 準備期間',
    '海外渡航 準備リスト',
    '留学 持ち物',
  ],
});

const TOC_HEADINGS = [
  { id: 'timeline', label: '出発前タイムライン全体像' },
  { id: '6m-before', label: '6ヶ月前｜お金・ビザ・学校決定' },
  { id: '3m-before', label: '3ヶ月前｜手続き本格スタート' },
  { id: '1m-before', label: '1ヶ月前｜行政手続きの集中期' },
  { id: '1w-before', label: '1週間前｜荷物パッキング最終' },
  { id: 'day-before', label: '前日〜当日｜直前確認' },
  { id: 'common-mistakes', label: '実例から学ぶ「やり忘れがちな10項目」' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const CHECKLIST_6M = [
  { item: '渡航先・期間の最終決定', detail: '国・都市・期間を確定する。学校選びはここから' },
  { item: '資金計画と貯金目標設定', detail: 'ワーホリ100〜150万円、語学留学150〜300万円が目安' },
  { item: 'パスポートの残存期間チェック', detail: '渡航中＋6ヶ月以上の有効期限が必要。期限切れなら更新（約2週間）' },
  { item: '語学学校・エージェント選定', detail: '人気校は3〜6ヶ月前に席が埋まる。早期予約で割引も' },
  { item: 'ビザ申請の準備開始', detail: 'ワーホリビザ国別に必要書類が異なる。残高証明・健康診断必要な国も' },
  { item: '海外保険の比較検討', detail: 'AIG・東京海上・JIなど。クレカ付帯では足りない国も多い' },
];

const CHECKLIST_3M = [
  { item: 'ビザ申請の本格スタート', detail: 'カナダ・イギリスは抽選式。期限内に必ず応募' },
  { item: '航空券の購入', detail: '3ヶ月前の方が早期割引で安い。片道 or 往復は国・滞在期間で判断' },
  { item: '海外保険の契約', detail: 'ワーホリ1年で15〜25万円が相場。出発日から契約開始' },
  { item: 'クレジットカード整備', detail: '海外用に2枚（メイン+予備）。Visa・Masterの組み合わせ推奨' },
  { item: 'Wiseアカウント作成', detail: '送金・両替の最強ツール。事前に本人確認完了させる' },
  { item: '英会話レッスン開始', detail: '出発までに最低200時間の英語接触。オンライン英会話・Voicy等' },
];

const CHECKLIST_1M = [
  { item: '住民票の海外転出届', detail: '1年以上海外滞在なら必須。出発14日前から提出可能' },
  { item: '国民年金の手続き', detail: '転出届を出すと年金は任意加入扱い。免除・任意継続を選択' },
  { item: '国民健康保険の脱退', detail: '転出届と同時に脱退手続き。住民税の通知も同時受領' },
  { item: '住民税の納付（一括 or 振替）', detail: '前年所得に基づく税金。出発前に一括 or 親族代行依頼' },
  { item: '確定申告（必要に応じて）', detail: '会社員退職組は出発前に年末調整 or 確定申告' },
  { item: '銀行口座の整理', detail: '使わない口座は解約 or 親族管理。海外送金できる銀行を確認' },
  { item: 'スマホの契約整理', detail: '解約 or 一時停止。番号保管サービス（月数百円）で番号維持' },
  { item: 'クレカの海外利用設定', detail: '海外利用枠の上限引き上げ、不正利用検知をオンに' },
  { item: '免許証の国際免許取得', detail: '都道府県の運転免許センターで即日発行（2,350円、1年有効）' },
  { item: '予防接種・健康診断', detail: '渡航先で推奨されるワクチン接種。ワーホリビザに健康診断必要な国も' },
];

const CHECKLIST_1W = [
  { item: '荷物のパッキング', detail: 'スーツケース23kg＋手荷物7kgが航空会社標準。重量計で必ず計測' },
  { item: '海外用変換プラグの準備', detail: '国別に形状が違う。マルチプラグなら全世界対応' },
  { item: '必須書類のコピー＆スキャン', detail: 'パスポート・ビザ・保険証券をクラウド保管。盗難時の保険' },
  { item: '現金の両替', detail: '到着直後の交通費・食事用に2〜3万円分。レートが悪いので最低限' },
  { item: 'スマホのSIMフリー化', detail: 'ドコモ・au・ソフトバンクで無料申請。SIMロックがかかったままだと現地SIMが使えない' },
  { item: '常備薬・処方薬の準備', detail: '英文の処方箋が必要な薬も。3ヶ月分まで持ち込み可' },
  { item: 'コンタクト・眼鏡予備', detail: '海外で買うと高い。1年分持参が安心' },
  { item: '親族・友人への連絡', detail: '緊急連絡先・到着予定の共有。LINE・WhatsAppで連絡手段確認' },
];

const CHECKLIST_DAY = [
  { item: '空港到着は出発3時間前', detail: '国際線は2〜3時間前到着が安全。チェックインカウンター混雑に備える' },
  { item: 'パスポート・航空券・ビザ最終確認', detail: '手荷物に必ず入れる。スーツケースに入れない' },
  { item: '海外保険の証券持参', detail: 'クラウドにも保管。空港で再印刷も可' },
  { item: '到着空港から滞在先までの移動手段', detail: 'タクシー・電車・送迎を事前予約。深夜到着は特に注意' },
  { item: '到着連絡用のWi-Fi or eSIM', detail: '空港着いた瞬間に親族へ連絡。eSIMなら出発前に有効化可能' },
];

const COMMON_MISTAKES = [
  'パスポート期限切れに出発直前に気づく（更新2週間必要）',
  '海外転出届を出さず、住民税・年金・健康保険を二重払い',
  'クレカ会社に海外利用申請忘れ→現地で利用停止',
  'SIMロック解除を忘れ、現地SIMが使えない',
  '常備薬の英文処方箋を取らず、現地で必要量買えない',
  '保険の補償開始日が出発日とずれている',
  '日本の銀行口座のキャッシュカード暗証番号を忘れる',
  '住民税の納付忘れ→帰国後に督促状＋延滞金',
  '国際免許の有効期限（1年）を超える長期滞在で運転不可',
  '航空会社のマイル登録忘れ→数万マイルの損失',
];

const FAQS = [
  {
    question: '出発前の準備期間はどれくらい必要？',
    answer:
      '最低3ヶ月、理想は6ヶ月。ビザ申請（カナダ・イギリスは抽選式で数ヶ月待ち）、語学学校予約（人気校は3〜6ヶ月前に満席）、住民票・年金・税金の行政手続きを考えると6ヶ月あると安心です。1ヶ月で全部準備するのは現実的に難しい。',
  },
  {
    question: '住民票の海外転出届は必ず必要？',
    answer:
      '1年以上海外滞在なら必須。出さないと住民税・国民健康保険・年金を払い続けることになり、年20〜30万円の無駄が出ます。1年未満でも、長期滞在予定なら出した方が経済的にメリットが大きい。出発14日前から手続き可能。',
  },
  {
    question: '荷物は何kgまで持っていける？',
    answer:
      '航空会社により異なりますが、エコノミーで「スーツケース23kg×1個＋手荷物7kg」が標準。LCCは別途料金、フルサービスキャリアは追加料金で2個目可。重量超過は1kgあたり数千円の罰金なので必ず重量計で計測。',
  },
  {
    question: '常備薬はどれくらい持っていける？',
    answer:
      '一般用医薬品は3ヶ月分まで（医師の処方箋なし）。処方薬は薬剤師に「英文の処方箋」を発行してもらえば1年分まで持参可能。睡眠薬・向精神薬は一部国で輸入禁止のため事前に大使館に確認。',
  },
  {
    question: '出発直前にやり忘れたら何が一番マズい？',
    answer:
      '①パスポート期限切れ（更新2週間必要、出発不可）、②ビザ未取得（入国拒否）、③海外保険未加入（医療費破産リスク）の3つが致命的。住民票や年金は最悪帰国後に手続きできますが、この3つは出発できない・現地で詰むレベルのトラブルになります。',
  },
];

export default async function PreDepartureChecklistPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(準備|持ち物|出発前|パッキング|住民票|忘れ)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.cons?.map((c) => c.text).join(' ') ?? ''}`,
        /(準備|持ち物|出発前|パッキング|住民票|忘れ)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '出発前チェックリスト', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '出発前チェックリスト' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              【出発前チェックリスト完全版】留学・ワーホリでやることリスト60項目
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="留学・ワーホリ出発を控えた方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              出発前の準備は、6ヶ月前から始めるのが理想です。住民票・年金・健康保険などの行政手続き、ビザ・航空券・保険、銀行・スマホ・荷物まで、やることは60項目以上。
              <br />
              この記事では時期別タイムライン形式で漏れなく整理。「やり忘れて現地で詰む10大ミス」も実例ベースで解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '理想は6ヶ月前から準備開始、最低でも3ヶ月は必要',
              '1ヶ月前は行政手続きの集中期（住民票・年金・税金）',
              '「パスポート期限・ビザ・保険」の3つは絶対やり忘れない',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* タイムライン */}
          <section id="timeline" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">出発前タイムライン全体像</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              留学・ワーホリ準備は、時期によってやるべきことが大きく変わります。下記タイムラインで全体像を把握しましょう。
            </p>
            <div className="space-y-3 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed"><strong className="text-amber-800">6ヶ月前:</strong> 渡航決定・資金計画・学校予約・ビザ準備開始（6項目）</p>
              <p className="text-sm text-gray-800 leading-relaxed"><strong className="text-amber-800">3ヶ月前:</strong> ビザ申請・航空券購入・保険契約・カード整備（6項目）</p>
              <p className="text-sm text-gray-800 leading-relaxed"><strong className="text-amber-800">1ヶ月前:</strong> 住民票・年金・健康保険・住民税・銀行・スマホ・免許（10項目）</p>
              <p className="text-sm text-gray-800 leading-relaxed"><strong className="text-amber-800">1週間前:</strong> パッキング・両替・SIM・常備薬・連絡先共有（8項目）</p>
              <p className="text-sm text-gray-800 leading-relaxed"><strong className="text-amber-800">前日〜当日:</strong> 空港着・書類確認・移動手段・到着連絡（5項目）</p>
            </div>
          </section>

          {/* 6ヶ月前 */}
          <section id="6m-before" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">6ヶ月前｜お金・ビザ・学校決定</h2>
            <div className="space-y-3">
              {CHECKLIST_6M.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">☐ {c.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3ヶ月前 */}
          <section id="3m-before" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">3ヶ月前｜手続き本格スタート</h2>
            <div className="space-y-3">
              {CHECKLIST_3M.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">☐ {c.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="退職してワーホリに行く場合の手続きも"
            description="社会人で退職してワーホリに行く方は、住民票・年金・健康保険の手続きが特に重要です。"
            primaryHref="/quit-job-wh"
            primaryLabel="社会人ワーホリ退職ガイド"
            secondaryHref="/wise-payment-guide"
            secondaryLabel="Wise・送金・クレカ"
          />

          {/* 1ヶ月前 */}
          <section id="1m-before" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">1ヶ月前｜行政手続きの集中期</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              出発14日前から住民票の海外転出届が提出可能になります。年金・健康保険・住民税の手続きを同時に進めましょう。
            </p>
            <div className="space-y-3">
              {CHECKLIST_1M.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">☐ {c.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 1週間前 */}
          <section id="1w-before" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">1週間前｜荷物パッキング最終</h2>
            <div className="space-y-3">
              {CHECKLIST_1W.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">☐ {c.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 前日 */}
          <section id="day-before" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">前日〜当日｜直前確認</h2>
            <div className="space-y-3">
              {CHECKLIST_DAY.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">☐ {c.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* やり忘れ10項目 */}
          <section id="common-mistakes" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">実例から学ぶ「やり忘れがちな10項目」</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              帰国者の声と編集部の取材から、特に見落としが多い10項目を抽出しました。
            </p>
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
                体験談 <strong>n={all.length}件</strong> から「準備・持ち物・忘れ物」関連の言及を集計。
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
            ※ 行政手続き（住民票・年金・税金）の詳細は、最新情報を各市区町村・税務署等の公式情報でご確認ください。本記事は2026年5月時点の一般的なガイドです。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/quit-job-wh" className="text-primary-600 hover:underline">→ 社会人ワーホリ退職ガイド</Link></li>
              <li><Link href="/wise-payment-guide" className="text-primary-600 hover:underline">→ Wise・送金・クレカ完全ガイド</Link></li>
              <li><Link href="/packing" className="text-primary-600 hover:underline">→ 持ち物リスト</Link></li>
              <li><Link href="/departure-timing" className="text-primary-600 hover:underline">→ 出発時期の選び方</Link></li>
              <li><Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">→ 不安を解消する方法</Link></li>
              <li><Link href="/agent-comparison" className="text-primary-600 hover:underline">→ エージェント必要？</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
