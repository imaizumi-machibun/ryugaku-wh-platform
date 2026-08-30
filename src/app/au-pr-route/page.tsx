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

const PAGE_PATH = '/au-pr-route';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーストラリアPR取得ルート完全マップ｜WHV→学生→雇用主スポンサー→PRの5パターン',
  description: 'ワーホリから始まるオーストラリアPR取得の5ルート。雇用主スポンサー・技術独立・州指名・パートナービザ・投資家ビザの要件・期間・費用を完全解説。',
  path: PAGE_PATH,
  keywords: [
    'オーストラリア PR',
    '永住権 オーストラリア',
    'ワーホリ 永住権',
    '豪 PR ルート',
    'スポンサービザ',
    'パートナービザ',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '5つの主要PRルート概要' },
  { id: 'route-1-employer', label: '①雇用主スポンサー（482 → 186）' },
  { id: 'route-2-skilled', label: '②技術独立（189）' },
  { id: 'route-3-state', label: '③州指名技術（190）' },
  { id: 'route-4-partner', label: '④パートナービザ（820/801）' },
  { id: 'route-5-business', label: '⑤投資家・事業家ビザ' },
  { id: 'timeline', label: '一般的な期間と費用' },
  { id: 'tips', label: '成功させるための7つのコツ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const ROUTES_OVERVIEW = [
  {
    route: '①雇用主スポンサー',
    visa: 'TSS 482 → ENS 186',
    time: '4年（4年労働後にPR）',
    difficulty: '★★★（中）',
    feature: '最も一般的、職種限定（看護師・ITエンジニア・シェフ等）',
  },
  {
    route: '②技術独立',
    visa: 'Skilled Independent 189',
    time: '2-3年',
    difficulty: '★★★★（高）',
    feature: '点数制（IELTS 7+、職歴3年+、年齢25-32歳が有利）',
  },
  {
    route: '③州指名技術',
    visa: 'Skilled Nominated 190',
    time: '2-4年',
    difficulty: '★★★（中）',
    feature: '州ごとに指定職種、189より緩い要件',
  },
  {
    route: '④パートナービザ',
    visa: 'Partner 820/801',
    time: '2-3年',
    difficulty: '★★（やや低）',
    feature: '豪市民・PR保持者と結婚 or 事実婚（12ヶ月以上）',
  },
  {
    route: '⑤投資家・事業家',
    visa: 'Business Innovation 188 → 888',
    time: '4-5年',
    difficulty: '★★★★★（最高）',
    feature: '投資額AUD 250万-500万必要、起業実績必須',
  },
];

const ROUTE_1_DETAIL = [
  { item: 'STEP 1: 雇用主スポンサー獲得', detail: 'TSS 482ビザのスポンサー企業を探す' },
  { item: 'STEP 2: TSS 482ビザで4年労働', detail: '指定職種で4年連続勤務（同一雇用主）' },
  { item: 'STEP 3: ENS 186 PR申請', detail: '雇用主スポンサーで永住権申請、Skilled Migration Visa' },
  { item: 'STEP 4: PR取得', detail: '申請から6-12ヶ月で永住権付与' },
];

const ROUTE_2_DETAIL = [
  { item: 'STEP 1: 職種選定', detail: 'MLTSSL（中長期戦略職種リスト）から選定（IT・看護・教師等）' },
  { item: 'STEP 2: 必要スコア取得', detail: 'IELTS 7+、職歴3年+、年齢25-32（点数システム）' },
  { item: 'STEP 3: EOI（Expression of Interest）提出', detail: 'SkillSelectシステムに登録、招待を待つ' },
  { item: 'STEP 4: 招待→ビザ申請', detail: '招待後60日以内にビザ申請、6-12ヶ月で発給' },
];

const COST_TIMELINE = [
  { route: '雇用主スポンサー', cost: 'AUD 4,000〜8,000', time: '4-5年' },
  { route: '技術独立189', cost: 'AUD 4,640', time: '2-3年' },
  { route: '州指名190', cost: 'AUD 4,640', time: '2-4年' },
  { route: 'パートナー820/801', cost: 'AUD 9,365', time: '2-3年' },
  { route: '投資家188→888', cost: 'AUD 7,000+投資額', time: '4-5年' },
];

const SUCCESS_TIPS = [
  'ワーホリ中に「PR取得可能な職種」での経験を積む（看護・IT・シェフ等）',
  'IELTS 7+を早期に取得（年齢点数ロスを最小化）',
  '専門学校・大学進学で職業資格＋点数加算',
  '地方都市（リージョナル）勤務でPR点数優遇',
  '英語要件は早期クリア、永続的に必要',
  '移民弁護士（MARA登録）への相談で書類エラー回避',
  '年齢制限（PR申請時45歳）を考慮した長期計画',
];

const FAQS = [
  {
    question: 'ワーホリから直接PR申請できる？',
    answer:
      'ワーホリビザから直接のPR申請ルートはありません。ワーホリ→学生ビザ or 雇用主スポンサービザに切替→数年間勤務→PR申請 という多段階ルートが必要。最短で4-5年。職種選定・年齢・英語力で大きく難易度変動。',
  },
  {
    question: 'どのPRルートが現実的？',
    answer:
      '年齢・職種・英語力次第。20代でIELTS 7+取得可能なら技術独立189が最短。看護師・教師・IT資格保持者は雇用主スポンサー有利。豪人パートナーがいるならパートナービザが最も確実。投資家ビザは資金面で大半の人に不可能。',
  },
  {
    question: 'PR取得後のメリットは？',
    answer:
      'メリット大。①永住権で何年でも滞在可、②就労制限なし（自由に転職）、③Medicare（公的医療）対象、④Centrelink（社会保障）対象、⑤大学学費が国民並み（外国人の1/3）、⑥子どもの公立学校無料、⑦市民権申請への道。',
  },
  {
    question: 'PR申請後、却下されたら？',
    answer:
      'AAT（Administrative Appeals Tribunal）に異議申立可能、所要1-2年。再申請も可能だが、却下歴は次回審査に影響することも。MARA登録の移民弁護士に相談し、再戦略を組むのが標準。',
  },
  {
    question: '年齢制限はある？',
    answer:
      'あります。Skilled Migrant Visa（189/190）は申請時45歳未満。30歳でも年齢点数最大、35歳超で減点開始。長期計画なら20代後半〜30代前半でPRルート確立を目指すのが理想。',
  },
];

export default async function AuPrRoutePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ausExperiences = all.filter((e) => e.country?.id === 'australia');
  const mentions = countMentions(all, /(PR|永住|スポンサー|長期|帰国)/);
  const sample = ausExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(PR|永住|スポンサー|長期|オーストラリア)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーストラリアPR取得ルート', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーストラリアPR取得ルート' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーストラリアPR取得ルート完全マップ｜5パターン
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="ワーホリ後にオーストラリア永住を視野に入れる方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリ滞在で「オーストラリアに住み続けたい」と思ったら、PR（Permanent Residency＝永住権）取得を目指すのが王道。
              <br />
              ただしルートは複雑で、職種・年齢・英語力により最適な道が変わります。この記事では5つの主要ルート、要件、期間、費用、成功のコツを完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '主要5ルート：雇用主スポンサー・技術独立・州指名・パートナー・投資家',
              '最短2-3年、一般的に4-5年でPR取得',
              'IELTS 7+・年齢25-35歳・職種選定が成功の鍵',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 概要 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">5つの主要PRルート概要</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-2 py-2 text-left">ルート</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">ビザ番号</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">期間</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">難易度</th>
                  </tr>
                </thead>
                <tbody>
                  {ROUTES_OVERVIEW.map((r, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold text-primary-700">{r.route}</td>
                      <td className="border border-gray-200 px-2 py-2 text-xs">{r.visa}</td>
                      <td className="border border-gray-200 px-2 py-2">{r.time}</td>
                      <td className="border border-gray-200 px-2 py-2 text-xs">{r.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ①雇用主 */}
          <section id="route-1-employer" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">①雇用主スポンサー（482 → 186）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              最も一般的なルート。指定職種で雇用主のスポンサーを得て、4年勤務後にPR申請。
            </p>
            <div className="space-y-3">
              {ROUTE_1_DETAIL.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{d.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ②技術独立 */}
          <section id="route-2-skilled" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">②技術独立（189）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              点数制で評価、スポンサー不要の独立ルート。要件は厳しいが取得後の自由度最高。
            </p>
            <div className="space-y-3">
              {ROUTE_2_DETAIL.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{d.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="オーストラリアセカンドビザ取得も合わせて"
            description="WHから始まる長期滞在の第一歩、セカンドビザ取得の88日条件・申請手順。"
            primaryHref="/au-second-year-visa"
            primaryLabel="豪WHセカンドビザ"
            secondaryHref="/wh-after-30"
            secondaryLabel="30歳ギリギリWH"
          />

          {/* ③州指名 */}
          <section id="route-3-state" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">③州指名技術（190）</h2>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・各州（NSW、VIC、QLD、WA等）が指定する職種リストから選定</p>
              <p>・189より要件緩く、特定州での2年勤務義務あり</p>
              <p>・地方都市（リージョナル）勤務でさらに優遇（491ビザ経由）</p>
              <p>・州指定リスト＋EOI登録＋ビザ申請の3段階</p>
              <p>・所要期間：申請から6-12ヶ月、合計2-4年</p>
            </div>
          </section>

          {/* ④パートナー */}
          <section id="route-4-partner" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">④パートナービザ（820/801）</h2>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・豪市民 or PR保持者と結婚 or 事実婚（12ヶ月以上）</p>
              <p>・関係性の証明書類（共同生活・共通の経済・社会的承認）が必要</p>
              <p>・820（一時）→2年後に801（PR）に移行</p>
              <p>・申請料 AUD 9,365（最高額）</p>
              <p>・最も確実だが、結婚詐欺対策で審査厳格</p>
            </div>
          </section>

          {/* ⑤投資家 */}
          <section id="route-5-business" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">⑤投資家・事業家ビザ</h2>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・Business Innovation 188（一時）→4年後に888（PR）</p>
              <p>・投資額AUD 250万-500万、事業家としての実績必須</p>
              <p>・州指名・連邦両方の承認が必要</p>
              <p>・現地企業の設立・経営・雇用創出が条件</p>
              <p>・富裕層・経営者向け、一般ワーホリ生にはハードル高</p>
            </div>
          </section>

          {/* 期間費用 */}
          <section id="timeline" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">一般的な期間と費用</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">ルート</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">申請料</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">所要期間</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_TIMELINE.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.route}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700">{c.cost}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 申請料は2026年5月時点。移民弁護士費用（AUD 3,000-8,000）は別途。
            </p>
          </section>

          {/* コツ */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">成功させるための7つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SUCCESS_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
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
                オーストラリア渡航者の体験談 <strong>n={ausExperiences.length}件</strong>。
                PR・永住・長期滞在関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ ビザ要件・費用・所要期間は2026年5月時点の情報です。複雑な制度のため、最新情報は Department of Home Affairs（immi.homeaffairs.gov.au）公式情報＋MARA登録移民弁護士へのご相談を推奨します。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/au-second-year-visa" className="text-primary-600 hover:underline">→ 豪WHセカンドビザ</Link></li>
              <li><Link href="/australia-jobs" className="text-primary-600 hover:underline">→ オーストラリア仕事探し方</Link></li>
              <li><Link href="/australia-tfn-guide" className="text-primary-600 hover:underline">→ TFN取得ガイド</Link></li>
              <li><Link href="/after-wh" className="text-primary-600 hover:underline">→ ワーホリ後の進路</Link></li>
              <li><Link href="/engineer-wh" className="text-primary-600 hover:underline">→ エンジニアワーホリ</Link></li>
              <li><Link href="/countries/australia" className="text-primary-600 hover:underline">→ オーストラリア国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
