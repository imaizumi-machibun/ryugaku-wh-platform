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

const PAGE_PATH = '/wh-nurse';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外で看護師として働く完全ガイド｜資格変換・IELTS・PR取得ルート',
  description: '日本人看護師が海外で働くための完全ガイド。資格変換手続き、IELTS要件、就職方法、給与水準、豪・加・英・米のPR取得ルートまで実例ベースで完全解説。',
  path: PAGE_PATH,
  keywords: [
    '海外 看護師',
    '日本 看護師 海外',
    '看護師 オーストラリア',
    '看護師 カナダ',
    '看護師 PR',
    'NCLEX',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-nurse-abroad', label: 'なぜ看護師の海外就職が人気か' },
  { id: 'qualification-by-country', label: '国別の資格変換手続き' },
  { id: 'english-requirements', label: '英語要件（IELTS/OET）' },
  { id: 'salary-by-country', label: '国別の給与水準' },
  { id: 'pr-route', label: 'PR取得への直通ルート' },
  { id: 'job-search', label: '就職の進め方' },
  { id: 'preparation', label: '準備期間と費用' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const QUALIFICATION_BY_COUNTRY = [
  {
    country: 'オーストラリア',
    body: 'AHPRA（Australian Health Practitioner Regulation Agency）',
    process: 'Skills Assessment → Internship 12週 → Registration',
    english: 'IELTS 7.0 or OET B',
    time: '12-24ヶ月',
  },
  {
    country: 'カナダ',
    body: 'NNAS（National Nursing Assessment Service）',
    process: 'Application → Document Verification → 州ライセンス申請',
    english: 'IELTS 6.5+ or CELBAN',
    time: '12-18ヶ月',
  },
  {
    country: 'イギリス',
    body: 'NMC（Nursing and Midwifery Council）',
    process: 'CBT試験 → OSCE試験 → Registration',
    english: 'IELTS 7.0 or OET B',
    time: '12-24ヶ月',
  },
  {
    country: 'アメリカ',
    body: 'CGFNS + 州看護局',
    process: 'CGFNS資格認証 → NCLEX-RN試験 → 州ライセンス',
    english: 'TOEFL/IELTS不要（NCLEX英語のみ）',
    time: '12-18ヶ月',
  },
];

const ENGLISH_DETAIL = [
  { test: 'IELTS Academic', scoreNeeded: '7.0（全セクション）', detail: '世界標準、最も認知度高、年に複数回受験可' },
  { test: 'OET（Occupational English Test）', scoreNeeded: 'Grade B（350点）', detail: '医療英語専用、看護師にはIELTSより取りやすい' },
  { test: 'PTE Academic', scoreNeeded: '65（豪のみ受入）', detail: 'コンピューターベース、結果5日以内' },
  { test: 'TOEFL iBT', scoreNeeded: '94（米国のみ）', detail: 'NCLEX-RNには不要、参考用' },
];

const SALARY_BY_COUNTRY = [
  { country: 'オーストラリア', salary: 'AUD 70,000-95,000', perDay: 'AUD 35-45/時', detail: 'シドニー・メルボルンは高め、地方は中央値' },
  { country: 'カナダ', salary: 'CAD 65,000-90,000', perDay: 'CAD 35-45/時', detail: 'BC州・オンタリオ州が高め' },
  { country: 'イギリス', salary: '£28,000-45,000', perDay: '£14-22/時', detail: 'NHS（公的）よりPrivateの方が高め' },
  { country: 'アメリカ', salary: '$75,000-130,000', perDay: '$35-65/時', detail: '州により差大、カリフォルニア・NYは最高水準' },
];

const PR_ROUTES = [
  '①豪：Skilled Independent 189 → 看護師は職種リスト上位、PR取得しやすい',
  '②加：Express Entry → NOC 31301（RN）でCRS点数高、1-2年でPR',
  '③英：Skilled Worker Visa → NHS雇用主スポンサー → 5年でILR（PR）',
  '④米：H-1B → Green Card（EB-3）、職務優先順位高、5-10年',
  '※全国でNurse Shortage継続中、雇用主スポンサーが得やすい職種',
];

const JOB_SEARCH_TIPS = [
  '専門エージェント活用（看護師特化）：UK NHS Professionals、Health Carousel等',
  'LinkedIn・Indeedで現地応募、応募から面接まで3-6ヶ月',
  'Skype/Zoom面接が一般的、英語面接対策必須',
  '雇用主は資格変換・ビザサポート込みのオファー多',
  'Internship必須国（豪・英）は事前に病院確保が鍵',
];

const PREPARATION = [
  { phase: '渡航1.5-2年前', detail: 'IELTS受験開始、英語学習集中（6ヶ月以上）' },
  { phase: '渡航1年前', detail: 'IELTS 7.0達成、資格変換書類準備開始' },
  { phase: '渡航6ヶ月前', detail: '資格変換申請（豪AHPRA、加NNAS等）、職業エージェント登録' },
  { phase: '渡航3ヶ月前', detail: '雇用主オファー獲得→ビザ申請、住居確保' },
  { phase: '渡航時', detail: 'Internship（豪・英）or 直接勤務開始' },
];

const COSTS = [
  'IELTS受験料：1回約27,000円、複数回必要',
  '資格変換費用：豪AUD 1,180-2,650、加CAD 650-1,500',
  '英語学校（事前学習）：50-150万円',
  'Internship費用（豪）：AUD 5,000-10,000（無給）',
  'ビザ申請：豪AUD 4,000-8,000、加CAD 1,500-2,000',
  '渡航・生活初期費用：100-150万円',
  '総額：200-400万円が目安',
];

const FAQS = [
  {
    question: '日本の看護師経験は海外で通用する？',
    answer:
      '通用する。「看護師として2-3年以上の臨床経験」は世界共通の評価。ただし手技・薬剤・電子カルテ・看護観の違いに最初戸惑う人多。資格変換＋現地のInternshipで橋渡し。経験年数長いほど雇用主スポンサーを得やすい。',
  },
  {
    question: 'IELTS 7.0は現実的？',
    answer:
      '十分な準備で達成可能。看護師は知的好奇心・学習能力が元々高く、6-12ヶ月の集中学習でIELTS 7.0達成例多。OETは医療英語専用でIELTSより取りやすいケース多、特に豪・英はOET受入推奨。週20-30時間の英語学習＋オンライン英会話継続が鉄板。',
  },
  {
    question: 'PR取得は本当に速い？',
    answer:
      'はい、看護師は世界中で慢性的不足、PR取得が他職種より圧倒的に有利。豪は職業リスト最優先・Express Entry CRS点数加点・雇用主スポンサー獲得しやすい。1-3年でPR取得例多、グローバル看護師として長期キャリア構築可。',
  },
  {
    question: '英語学習しながら看護師継続できる？',
    answer:
      '可能。日本の病院で働きながら、夜間・週末にIELTS対策。Online英会話毎日30分＋週末まとめて学習で12-18ヶ月でIELTS 7達成例多。退職→留学集中も選択肢、自分のライフスタイルとの相談で。',
  },
  {
    question: '海外で看護師として働く時のリスクは？',
    answer:
      '①初期費用200-400万円の投資、②資格変換失敗リスク（一部書類不備）、③現地看護観・チーム医療への適応難、④冬季ホームシック・文化適応疲労。一方リターン（年収UP・グローバルキャリア・PR取得）が大きいため、計画的に挑戦する価値高。',
  },
];

export default async function WhNursePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(看護|医療|ナース|nurse|医師|薬剤)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(看護|医療|ナース|nurse|医師|薬剤)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外で看護師として働く完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外で看護師として働く完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外で看護師として働く完全ガイド｜資格変換・IELTS・PR取得ルート
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="日本人看護師で海外キャリアを目指す方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              世界中で慢性的に看護師が不足、日本人看護師の海外就職が急増中。年収は日本の1.5-3倍、PR取得もスムーズ、生涯キャリアの大きな選択肢です。
              <br />
              この記事では国別の資格変換、IELTS要件、給与、PR取得、準備期間まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '世界中で看護師不足、雇用主スポンサーを得やすい',
              'IELTS 7.0 or OET Bが必須、6-12ヶ月の集中学習',
              '豪・加で1-3年でPR取得可、年収日本の1.5-3倍',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-nurse-abroad" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ看護師の海外就職が人気か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・世界中の慢性的看護師不足、雇用主スポンサー獲得しやすい</li>
              <li>・年収日本の1.5-3倍（豪・加・米）</li>
              <li>・PR取得が他職種より速く確実</li>
              <li>・労働環境（残業少・休暇多）が日本より良い</li>
              <li>・グローバル看護師としてのキャリア多様化</li>
              <li>・帰国後も外資系医療機関・通訳・教育職へ転身可</li>
            </ul>
          </section>

          {/* 資格変換 */}
          <section id="qualification-by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別の資格変換手続き</h2>
            <div className="space-y-3">
              {QUALIFICATION_BY_COUNTRY.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{c.country}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>認証機関:</strong> {c.body}</p>
                    <p><strong>プロセス:</strong> {c.process}</p>
                    <p><strong>英語:</strong> {c.english}</p>
                    <p><strong>所要期間:</strong> {c.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 英語要件 */}
          <section id="english-requirements" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語要件（IELTS/OET）</h2>
            <div className="space-y-3">
              {ENGLISH_DETAIL.map((e, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{e.test}</p>
                    <p className="text-sm font-bold text-amber-700">{e.scoreNeeded}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{e.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 給与 */}
          <section id="salary-by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別の給与水準</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">国</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">年収</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">時給</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {SALARY_BY_COUNTRY.map((s, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{s.country}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700">{s.salary}</td>
                      <td className="border border-gray-200 px-3 py-2">{s.perDay}</td>
                      <td className="border border-gray-200 px-3 py-2 text-xs">{s.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="PR取得ルート・海外IT エンジニアと合わせて"
            description="看護師に限らず、専門職での海外キャリアの全体像を確認。"
            primaryHref="/au-pr-route"
            primaryLabel="豪PR取得5ルート"
            secondaryHref="/wh-tech-engineer"
            secondaryLabel="海外ITエンジニア"
          />

          {/* PR ルート */}
          <section id="pr-route" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">PR取得への直通ルート</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PR_ROUTES.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🏥</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 就職 */}
          <section id="job-search" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">就職の進め方</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {JOB_SEARCH_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 準備期間 */}
          <section id="preparation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">準備期間と費用</h2>
            <div className="space-y-3 mb-4">
              {PREPARATION.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{p.phase}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
            <p className="font-bold text-base mb-2 text-amber-700">💰 費用内訳</p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {COSTS.map((c, i) => (
                <li key={i} className="leading-relaxed">・{c}</li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「看護・医療・ナース」関連の言及を集計。
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
            ※ 資格変換・ビザ要件・給与は2026年5月時点の情報です。最新情報は各国看護師協会・移民局・専門エージェントでご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/wh-tech-engineer" className="text-primary-600 hover:underline">→ 海外ITエンジニア</Link></li>
              <li><Link href="/english-test-waiver" className="text-primary-600 hover:underline">→ IELTS/TOEFL免除</Link></li>
              <li><Link href="/wh-job-hunting-japan" className="text-primary-600 hover:underline">→ 帰国後就活</Link></li>
              <li><Link href="/30s-guide" className="text-primary-600 hover:underline">→ 30代からの留学</Link></li>
              <li><Link href="/after-wh" className="text-primary-600 hover:underline">→ ワーホリ後の進路</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
