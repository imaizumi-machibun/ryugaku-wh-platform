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

const PAGE_PATH = '/au-rural-job';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーストラリアのリージョナル仕事完全ガイド｜給与水準・対象地域・職種',
  description: 'オーストラリアのリージョナル（地方都市）仕事完全解説。セカンドビザ取得に直結する対象地域、職種、給与水準、稼げる時期、生活コストまで実例ベースで網羅。',
  path: PAGE_PATH,
  keywords: [
    'オーストラリア リージョナル',
    'オーストラリア 地方 仕事',
    'リージョナル 求人',
    'ファーム 仕事',
    'オーストラリア セカンドビザ 仕事',
    '豪 リモートエリア',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-rural', label: 'なぜリージョナルが狙い目か' },
  { id: 'target-areas', label: '対象地域マップ' },
  { id: 'job-types', label: '主要職種5カテゴリ' },
  { id: 'salary', label: '給与水準・繁忙期' },
  { id: 'how-to-find', label: '仕事の探し方5選' },
  { id: 'life', label: 'リージョナル生活の現実' },
  { id: 'preparation', label: '出発前の準備5ステップ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TARGET_AREAS = [
  { state: 'QLD（クイーンズランド）', areas: 'ブンダバーグ、ケアンズ、タウンズビル等', detail: 'バナナ・マンゴー・サトウキビ栽培、トロピカル気候' },
  { state: 'WA（西オーストラリア）', areas: 'カルグーリー、ジェラルトン、エスペランス', detail: '鉱業・農業、給与高め' },
  { state: 'NT（北部準州）', areas: 'ダーウィン、アリススプリングス', detail: '建設業・観光業、需要安定' },
  { state: 'TAS（タスマニア）', areas: 'ホバート全域、ローンセストン', detail: 'りんご・チェリー・ホップ栽培' },
  { state: 'SA（南オーストラリア）', areas: 'アデレード以外の地方', detail: 'ぶどう（ワイン産地）・トマト・玉ねぎ' },
  { state: 'VIC（ビクトリア）', areas: 'メルボルン以外の地方', detail: 'りんご・梨・チェリー・ベリー類' },
];

const JOB_TYPES = [
  {
    type: '①ファームピッキング（果物・野菜収穫）',
    detail: 'バナナ・りんご・ぶどう・トマト・ベリー類の収穫作業',
    pay: '出来高制（$0.50-2/箱）、平均週$500-1,200',
  },
  {
    type: '②パッキング工場（選別・梱包）',
    detail: '果物・野菜の選別、梱包、出荷準備',
    pay: '時給$24-30、週40時間で$960-1,200',
  },
  {
    type: '③畜産業（牛・羊の世話）',
    detail: '広大な牧場でカウボーイ的な仕事、長期住み込み',
    pay: '時給$25-32、週給$1,000-1,400',
  },
  {
    type: '④鉱業（FIFO労働）',
    detail: 'Fly In Fly Outで2週間労働＋1週間休、給与最高',
    pay: '時給$35-50、年収$80,000-150,000',
  },
  {
    type: '⑤建設業（リージョナル都市）',
    detail: '住宅・インフラ建設、ダーウィン・パース郊外で需要高',
    pay: '時給$28-35、週給$1,200-1,500',
  },
];

const SALARY_BY_SEASON = [
  { period: '10〜12月', crop: 'ぶどう（VIC/SA）、ベリー類', earning: '週$700-1,400' },
  { period: '1〜3月', crop: 'りんご・梨（TAS/VIC）、ぶどう収穫終盤', earning: '週$800-1,500' },
  { period: '4〜6月', crop: 'マンゴー・バナナ（QLD）、オレンジ', earning: '週$700-1,300' },
  { period: '7〜9月', crop: 'バナナ通年、サトウキビ、パッキング工場', earning: '週$600-1,200' },
];

const HOW_TO_FIND = [
  { method: 'Workforce Australia', detail: '政府公式ジョブサイト、リージョナル求人多数' },
  { method: 'Backpacker Job Board', detail: 'ワーホリ専用、住み込み可案件豊富' },
  { method: 'Gumtree', detail: 'カジュアル農場直接募集、即日採用多' },
  { method: 'Facebook groups', detail: '「Australian Backpacker Jobs」等で日次更新' },
  { method: 'Hostel紹介', detail: 'リージョナル都市のバックパッカーホステルが仕事紹介、住居込み' },
];

const LIFE_REALITY = [
  '住居：ホステル（週$200-300）or 農場住み込み（無料or週$50-100）',
  '車：自家用車推奨（中古$3,000-5,000）、公共交通弱',
  '社交：主にワーホリ仲間、現地ローカル少',
  '気候：QLD/NTは年中暑い、TAS/VIC冬寒い',
  '通信：田舎は4G弱、衛星電話必要な地域も',
  '日本食材：ほぼ入手不可、自炊スキル必須',
];

const PREPARATION = [
  { step: 1, title: '88日条件の正確な理解', detail: '対象地域＋対象職種＋雇用主証明書（Form 1263）の3点セット' },
  { step: 2, title: '英語の基本会話力', detail: '農場主・同僚との意思疎通、簡単な指示理解' },
  { step: 3, title: '体力作り', detail: '農作業は重労働、出発前から週3-4回のトレーニング推奨' },
  { step: 4, title: '中古車の予算確保', detail: '$3,000-5,000で購入、出発前に資金枠を残す' },
  { step: 5, title: 'リージョナル都市の事前リサーチ', detail: '気候・物価・求人需要を比較、最初の目的地選定' },
];

const FAQS = [
  {
    question: 'リージョナルで本当にセカンドビザ取れる？',
    answer:
      '取れます。対象地域＋対象職種で88日（フルタイム週6日）就労＋Pay Slip＋Form 1263の3点セットを揃えれば確実。ただし「対象地域外で働いた」「Pay Slipが揃わない」「フルタイム未達」のミスで申請不可になるケース多数。事前に正確な情報確認＋雇用主との合意が大切。',
  },
  {
    question: '英語力ゼロでも仕事はある？',
    answer:
      'あります。ファーム作業は単純作業なので英語最低限でOK。ただ「採用面接の自己紹介」「同僚への質問」「指示の理解」程度の英語は必要。完全ゼロだと採用率落ちる。出発前に「Hi」「Yes」「Can you teach me」程度を覚えれば十分。',
  },
  {
    question: '給与はいくらくらい稼げる？',
    answer:
      'ファーム出来高制なら週$500-1,400、固定時給制なら週$800-1,200。鉱業FIFO労働なら週$2,000以上も可能。日本円換算で月20-60万円。物価も安いので、貯金しやすい環境です。',
  },
  {
    question: '住居はどうする？',
    answer:
      '①バックパッカーホステル（週$200-300、相部屋）、②農場住み込み（無料or週$50-100、食事付き）、③車中泊（短期）、④シェアハウス（リージョナル都市は安、週$150-250）の選択肢。長期なら住み込みが最強コスパ。',
  },
  {
    question: '危険な仕事や搾取はある？',
    answer:
      '残念ながらあります。最低時給以下の違法雇用、性的ハラスメント、契約と異なる労働条件等の被害報告も。違法雇用主はFair Work Australia（無料・日本語対応）に通報。怪しい雇用主は避け、評判の良い農場・ホステル紹介を選ぶ。',
  },
];

export default async function AuRuralJobPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ausExperiences = all.filter((e) => e.country?.id === 'australia');
  const mentions = countMentions(all, /(リージョナル|ファーム|地方|農場|farm|rural|88日)/i);
  const sample = ausExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(リージョナル|ファーム|地方|農場|farm|rural)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーストラリアリージョナル仕事完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーストラリアリージョナル仕事完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーストラリアのリージョナル仕事完全ガイド｜給与水準・対象地域・職種
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="セカンドビザ取得・リージョナル仕事に興味のある方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              オーストラリアのリージョナル（地方都市）仕事は、セカンドビザ取得直結＋給与水準高＋生活費安、というワーホリ生にとって最強の組み合わせ。
              <br />
              この記事では対象地域、職種別給与、繁忙期、仕事の探し方、リアルな生活まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'セカンドビザ取得＋週$500-1,400稼げる＋生活費安の三拍子',
              '繁忙期（10-3月）が最も稼ぎやすい',
              '英語ゼロでも仕事はあるが、最低限の会話力推奨',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-rural" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜリージョナルが狙い目か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・セカンドビザ取得（追加1年滞在）に直結</li>
              <li>・大都市より時給高い場合多（最低時給保証＋繁忙期割増）</li>
              <li>・住居費激安（住み込み無料 or 週$50-100）</li>
              <li>・出来高制で頑張れば週$1,400以上稼げる</li>
              <li>・大自然・ローカル文化の体験</li>
              <li>・大都市の競争激しい仕事探しを回避</li>
            </ul>
          </section>

          {/* 対象地域 */}
          <section id="target-areas" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">対象地域マップ</h2>
            <div className="space-y-3">
              {TARGET_AREAS.map((a, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{a.state}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-1"><strong>主要エリア:</strong> {a.areas}</p>
                  <p className="text-xs text-gray-500">{a.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 職種 */}
          <section id="job-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要職種5カテゴリ</h2>
            <div className="space-y-3">
              {JOB_TYPES.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{j.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{j.detail}</p>
                  <p className="text-sm text-amber-700 font-bold">{j.pay}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="セカンドビザ取得の詳細も合わせて"
            description="88日条件の正確なルール、Pay Slip取得、申請手順を完全解説。"
            primaryHref="/au-second-year-visa"
            primaryLabel="豪WHセカンドビザ完全ガイド"
            secondaryHref="/australia-farm-job"
            secondaryLabel="オーストラリアファームジョブ"
          />

          {/* 給与 */}
          <section id="salary" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">給与水準・繁忙期</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">時期</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">主要作物・地域</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">週給目安</th>
                  </tr>
                </thead>
                <tbody>
                  {SALARY_BY_SEASON.map((s, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{s.period}</td>
                      <td className="border border-gray-200 px-3 py-2">{s.crop}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{s.earning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 探し方 */}
          <section id="how-to-find" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">仕事の探し方5選</h2>
            <div className="space-y-3">
              {HOW_TO_FIND.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{h.method}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{h.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 生活現実 */}
          <section id="life" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">リージョナル生活の現実</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {LIFE_REALITY.map((l, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">🌾</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 準備 */}
          <section id="preparation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">出発前の準備5ステップ</h2>
            <div className="space-y-3">
              {PREPARATION.map((p) => (
                <div key={p.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {p.step}: {p.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                オーストラリア渡航者の体験談 <strong>n={ausExperiences.length}件</strong>。
                リージョナル・ファーム・農場関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 給与・繁忙期は2026年5月時点の参考値です。最新の対象地域・職種は Department of Home Affairs の Specified Work ページでご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/au-second-year-visa" className="text-primary-600 hover:underline">→ 豪WHセカンドビザ完全ガイド</Link></li>
              <li><Link href="/australia-farm-job" className="text-primary-600 hover:underline">→ オーストラリアファームジョブ</Link></li>
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/wh-labor-rights" className="text-primary-600 hover:underline">→ ワーホリ労働権利</Link></li>
              <li><Link href="/australia-jobs" className="text-primary-600 hover:underline">→ オーストラリア仕事探し方</Link></li>
              <li><Link href="/wh-pension-refund-australia" className="text-primary-600 hover:underline">→ 豪Super還付</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
