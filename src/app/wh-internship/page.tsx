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

const PAGE_PATH = '/wh-internship';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外インターンシップ完全ガイド｜有給/無給・業界別・応募方法・ビザ要件',
  description: 'ワーホリ・留学中の海外インターンシップを完全解説。有給/無給の違い、業界別の探し方、応募手順、ビザ要件、得られるスキル、帰国後の就活への影響まで網羅。',
  path: PAGE_PATH,
  keywords: [
    '海外 インターンシップ',
    'ワーホリ インターン',
    '留学 インターン',
    '海外 インターン 応募',
    'インターンシップ 英語',
    '海外 有給インターン',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-internship', label: 'なぜ海外インターンシップなのか' },
  { id: 'paid-unpaid', label: '有給 vs 無給インターンの違い' },
  { id: 'industries', label: '人気業界5選' },
  { id: 'visa-by-country', label: '国別ビザ要件' },
  { id: 'how-to-find', label: '応募の探し方5選' },
  { id: 'apply-process', label: '応募〜採用までのプロセス' },
  { id: 'after-internship', label: '帰国後の就活への影響' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const PAID_VS_UNPAID = [
  {
    type: '有給インターンシップ',
    detail: '時給/月給で給与支給、社員と同等の業務担当',
    pros: '収入確保＋実務スキル＋履歴書映え',
    cons: '応募競争激しい、英語スキル必須レベル',
    salary: '時給$15-30、月給$2,000-4,500',
  },
  {
    type: '無給インターンシップ',
    detail: '給与なし、学習機会としての参加',
    pros: '応募ハードル低、業界経験積みやすい',
    cons: '生活費は別途、長期は経済的負担',
    salary: '交通費・食事補助のみのケース多',
  },
];

const INDUSTRIES = [
  {
    industry: '①IT・テック企業',
    detail: 'スタートアップ・大手テック企業のエンジニア/PM/マーケ職',
    paid: '有給多、シリコンバレー時給$25-40',
  },
  {
    industry: '②マーケティング・PR',
    detail: '広告代理店・ブランド企業のデジマ・SNS担当',
    paid: '有給/無給混在、時給$18-25',
  },
  {
    industry: '③ホスピタリティ・観光',
    detail: 'ホテル・観光業のフロント・予約担当',
    paid: '有給メイン、時給$15-22',
  },
  {
    industry: '④NPO・国際機関',
    detail: 'UN・国際NGO・環境団体での調査・運営',
    paid: '無給メイン、住居・食事提供あり',
  },
  {
    industry: '⑤デザイン・クリエイティブ',
    detail: 'デザイン事務所・出版社・映像制作会社',
    paid: '無給/低給メイン、ポートフォリオ充実',
  },
];

const VISA_BY_COUNTRY = [
  {
    country: 'オーストラリア',
    rules: 'WHV保持者は週20時間まで合法（学生）、フルタイム可（WHV）',
    notes: '正社員雇用ではなくインターン契約も可',
  },
  {
    country: 'カナダ',
    rules: 'IEC Working Holiday or International Co-op で就労可',
    notes: 'IEC Internship枠で大学経由のインターンも',
  },
  {
    country: 'イギリス',
    rules: 'YMS保持者は就労可、Student Visa保持者は週20時間まで',
    notes: 'Charity Volunteer Visaで無給インターン可',
  },
  {
    country: 'アメリカ',
    rules: 'J-1 Visa（インターン専用）or F-1 OPT',
    notes: 'スポンサー組織必須、申請3-6ヶ月かかる',
  },
  {
    country: 'ドイツ',
    rules: 'WHV保持者は就労可、3ヶ月超は社会保険登録',
    notes: 'Praktikum（インターン）文化が定着',
  },
];

const HOW_TO_FIND = [
  { method: 'LinkedIn', detail: '世界最大のビジネスSNS、グローバル企業のインターン求人多' },
  { method: 'Indeed / Glassdoor', detail: '一般求人サイト、「Intern」キーワードで検索' },
  { method: '大学キャリアセンター', detail: '現地大学に併修している場合は限定求人あり' },
  { method: 'AIESEC', detail: '世界最大の学生団体、グローバルインターン斡旋' },
  { method: '日系インターンエージェント', detail: 'jエージェント・タイガーモブ等、日本人特化サポート' },
];

const APPLY_PROCESS = [
  { step: 1, title: '英文Resume・Cover Letter準備', detail: '1ページ英文Resume、業界・職種別Cover Letterカスタマイズ' },
  { step: 2, title: 'LinkedIn等で求人検索', detail: '「Intern」+「業界」+「都市」で絞り込み、5-10社応募' },
  { step: 3, title: 'オンライン面接（1-2回）', detail: 'Zoom/Teams面接、英語・志望動機・スキル深堀' },
  { step: 4, title: '内定→ビザ確認', detail: 'ビザ要件再確認、雇用契約書サイン' },
  { step: 5, title: 'インターン開始', detail: '通常3〜6ヶ月、フルタイム or パートタイム' },
];

const AFTER_INTERNSHIP = [
  '実務経験＋英語＋海外人脈の3点セットを履歴書に',
  '帰国後の転職市場で「即戦力人材」として高評価',
  '外資系・グローバル企業への転職有利',
  'インターン先からの正社員オファーも可能',
  '同業界の日系企業海外事業部への転職ルート',
  'インターン経験を活かして起業・フリーランス独立',
];

const FAQS = [
  {
    question: 'ワーホリビザでインターンできる？',
    answer:
      'できます。WHVは就労許可があるため、現地企業でのインターンシップ（有給・無給問わず）参加可能。学生ビザの場合は週20時間制限があるため、フルタイムインターンは長期休暇中のみ。詳細な就労条件は国・ビザにより異なるため要確認。',
  },
  {
    question: '無給インターンでも参加する価値ある？',
    answer:
      'あります。①業界経験積める、②英語ビジネスシーンで通用するレベルに、③帰国後の転職で「海外実務経験」アピール、④グローバル人脈構築、の価値大。ただし生活費とのバランス。3-6ヶ月の短期＋アルバイト併用が現実的。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      '業界・職種により差。テック・マーケ・PRはTOEIC 800以上、ホスピタリティはTOEIC 600以上、無給コミュニティ系はTOEIC 500以上が目安。「ビジネス英語で議事進行・メール対応」ができれば多くの業界で通用。',
  },
  {
    question: 'インターン応募の競争率は？',
    answer:
      '人気職種（GAFA・コンサル等）は数百倍の難関、中堅企業の特定業界は10-20倍が一般的。「海外経験＋日本語スキル」のユニークさで差別化、ニッチな業界を狙うのも戦略。日系企業の現地法人は応募競争弱め。',
  },
  {
    question: '帰国後の転職に有利？',
    answer:
      '業界による。外資系・グローバル企業・スタートアップは強くプラス評価。一方、伝統的な日系大企業は「ブランク」と見られることも。狙う業界を絞り、「海外インターン経験＋業界知識」セットでアピールできる転職先を選ぶのが成功の鍵。',
  },
];

export default async function WhInternshipPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(インターン|internship|キャリア|職歴|転職)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(インターン|internship|キャリア|職歴|転職)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外インターンシップ完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外インターンシップ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外インターンシップ完全ガイド｜有給/無給・業界別・応募・ビザ
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ワーホリ・留学中に実務経験積みたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリ・留学の最大の差別化要素になる「海外インターンシップ」。アルバイトと違って業界の実務経験＋英語ビジネスシーン＋グローバル人脈が手に入る、帰国後就活の強力な武器です。
              <br />
              この記事では有給/無給の違い、業界別の探し方、ビザ要件、応募プロセス、帰国後への活かし方まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '海外実務経験＋ビジネス英語＋人脈の3点を一気に獲得',
              'WHV・学生ビザで参加可能、就労ルール要確認',
              '帰国後の外資系・グローバル企業転職で強力な武器に',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-internship" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ海外インターンシップなのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              「ワーホリでカフェ・接客のみ」と比べて、インターンシップ経験は転職市場での評価を大きく押し上げます。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・実務スキル（業界知識＋ツール操作）取得</li>
              <li>・ビジネス英語（メール・会議・プレゼン）習得</li>
              <li>・グローバル人脈（同僚・上司・取引先）構築</li>
              <li>・履歴書映え（「現地企業でインターン」記載）</li>
              <li>・正社員オファーへのチャンス</li>
              <li>・自己発見（業界・職種適性のリアル把握）</li>
            </ul>
          </section>

          {/* 有給 vs 無給 */}
          <section id="paid-unpaid" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">有給 vs 無給インターンの違い</h2>
            <div className="space-y-3">
              {PAID_VS_UNPAID.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{p.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{p.detail}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                    <p className="text-emerald-700"><strong>メリット:</strong> {p.pros}</p>
                    <p className="text-rose-700"><strong>デメリット:</strong> {p.cons}</p>
                  </div>
                  <p className="text-sm text-amber-700 font-bold">{p.salary}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 業界 */}
          <section id="industries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">人気業界5選</h2>
            <div className="space-y-3">
              {INDUSTRIES.map((ind, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{ind.industry}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{ind.detail}</p>
                  <p className="text-xs text-amber-700"><strong>給与目安:</strong> {ind.paid}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ビザ */}
          <section id="visa-by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別ビザ要件</h2>
            <div className="space-y-3">
              {VISA_BY_COUNTRY.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{v.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-1">{v.rules}</p>
                  <p className="text-xs text-gray-500">{v.notes}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="帰国後の就活戦略も合わせて"
            description="海外インターン経験を最大活用する転職戦略、業界別狙い目、英語アピール法。"
            primaryHref="/wh-job-hunting-japan"
            primaryLabel="帰国後就活完全ガイド"
            secondaryHref="/english-resume-guide"
            secondaryLabel="英文レジュメ書き方"
          />

          {/* 探し方 */}
          <section id="how-to-find" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募の探し方5選</h2>
            <div className="space-y-3">
              {HOW_TO_FIND.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{h.method}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{h.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 応募プロセス */}
          <section id="apply-process" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募〜採用までのプロセス</h2>
            <div className="space-y-3">
              {APPLY_PROCESS.map((p) => (
                <div key={p.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {p.step}: {p.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 帰国後 */}
          <section id="after-internship" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">帰国後の就活への影響</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {AFTER_INTERNSHIP.map((a, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「インターン・キャリア・職歴」関連の言及を集計。
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
            ※ ビザ要件・給与目安は2026年5月時点の情報です。最新情報は各国移民局・企業公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-job-hunting-japan" className="text-primary-600 hover:underline">→ 帰国後就活完全ガイド</Link></li>
              <li><Link href="/english-resume-guide" className="text-primary-600 hover:underline">→ 英文レジュメ書き方</Link></li>
              <li><Link href="/engineer-wh" className="text-primary-600 hover:underline">→ エンジニアワーホリ</Link></li>
              <li><Link href="/after-wh" className="text-primary-600 hover:underline">→ ワーホリ後の進路</Link></li>
              <li><Link href="/30s-guide" className="text-primary-600 hover:underline">→ 30代からの留学</Link></li>
              <li><Link href="/agent-comparison" className="text-primary-600 hover:underline">→ エージェント必要？</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
