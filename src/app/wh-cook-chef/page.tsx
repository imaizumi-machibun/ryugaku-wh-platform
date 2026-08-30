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

const PAGE_PATH = '/wh-cook-chef';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外シェフ・料理人完全ガイド｜Commercial Cookery・寿司職人・PR',
  description: '海外でシェフ・料理人として働く完全ガイド。Commercial Cookery資格、寿司職人、給与水準、雇用主スポンサーでPR取得まで実例ベースで完全解説。',
  path: PAGE_PATH,
  keywords: [
    '海外 シェフ',
    '海外 料理人',
    '寿司職人 海外',
    'Commercial Cookery',
    'Chef オーストラリア',
    '料理人 PR',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-chef', label: 'なぜ海外シェフ・料理人なのか' },
  { id: 'qualifications', label: '主要資格・コース' },
  { id: 'job-types', label: '職種・雇用先' },
  { id: 'salary', label: '給与水準・労働環境' },
  { id: 'sushi-chef', label: '寿司職人の特別ルート' },
  { id: 'pr-route', label: 'PR取得への直通ルート' },
  { id: 'preparation', label: '準備期間と費用' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const QUALIFICATIONS = [
  {
    cert: 'Certificate III in Commercial Cookery',
    duration: '1年',
    cost: 'AUD 10,000-18,000',
    detail: '料理人入門、レストランCook就労可',
  },
  {
    cert: 'Certificate IV in Commercial Cookery',
    duration: '6-12ヶ月（III取得後）',
    cost: 'AUD 6,000-12,000',
    detail: 'シェフ昇格、メニュー開発・スタッフ管理',
  },
  {
    cert: 'Diploma of Hospitality Management',
    duration: '12-24ヶ月',
    cost: 'AUD 15,000-25,000',
    detail: 'レストラン経営、Centre Managerへ',
  },
  {
    cert: 'Advanced Diploma',
    duration: '24ヶ月',
    cost: 'AUD 20,000-30,000',
    detail: 'マネジメント上級、PR最有利',
  },
];

const JOB_TYPES = [
  { type: '日本食レストラン', detail: '寿司職人・ラーメン職人・天ぷら職人、日本人歓迎' },
  { type: '高級レストラン（Fine Dining）', detail: 'フランス・イタリア料理、Chef de Partie・Sous Chef' },
  { type: 'カフェ・ビストロ', detail: 'モダンオーストラリア料理・朝食ランチ中心' },
  { type: 'ホテル・リゾート', detail: '大規模キッチン、安定雇用、福利厚生◎' },
  { type: 'パブ・スポーツバー', detail: 'カジュアル料理、シフト柔軟、人気職場' },
];

const SALARY_INFO = [
  { role: 'Kitchen Hand', salary: 'AUD 24-28/時', detail: '見習い、皿洗い・下処理' },
  { role: 'Cook（Cert III）', salary: 'AUD 28-34/時', detail: 'メイン料理担当、レストラン中堅' },
  { role: 'Chef de Partie', salary: 'AUD 30-38/時', detail: '部門責任者、5-10年経験' },
  { role: 'Sous Chef', salary: 'AUD 38-45/時 or 年収AUD 75,000-95,000', detail: '副料理長、マネジメント' },
  { role: 'Head Chef', salary: '年収AUD 90,000-150,000', detail: '料理長、レストラン全体管理' },
  { role: '寿司職人（経験者）', salary: 'AUD 28-40/時', detail: 'スシ専門、職人技で評価' },
];

const SUSHI_CHEF_ROUTE = [
  '日本で寿司学校（1-3ヶ月）or 寿司店経験2-3年積む',
  '渡航前にWH or 学生ビザ取得',
  '日本食レストラン（GoodSushi、ZUMA等）に応募',
  'Sushi Helper（軍艦巻き・盛り付け）からスタート',
  '6-12ヶ月でSushi Chef昇格、にぎり寿司担当',
  '寿司Senior Chefまで上り、雇用主スポンサー獲得',
  'PR申請（豪：Chef職種リスト常連）',
];

const PR_ROUTES = [
  '①豪Chef → Skilled Independent 189（職種リスト常連）',
  '②豪Chef → 雇用主スポンサー TSS 482 → ENS 186（4年勤務後PR）',
  '③加Cook → LMIA → PNP → Express EntryでPR',
  '④英Chef → Skilled Worker Visa → 5年でILR（PR）',
  '※料理人・シェフは世界中で慢性的不足、PR取得しやすい職種',
];

const PREPARATION = [
  { phase: '渡航前1年', detail: '英語学習（IELTS 5.5-6.0+）、日本での料理経験積む' },
  { phase: '渡航時', detail: '学生ビザ or WHV、Certificate III入学' },
  { phase: '6ヶ月後', detail: 'パートタイムKitchen Hand勤務、現場経験開始' },
  { phase: '1年後', detail: 'Certificate III卒業→フルタイムCook就労' },
  { phase: '2-3年後', detail: 'Chef de Partie昇格→PR申請開始' },
];

const FAQS = [
  {
    question: '日本の料理経験ゼロでも海外シェフになれる？',
    answer:
      'なれる。Certificate III in Commercial Cookery（1年）で料理人資格取得→Kitchen Hand→Cookと段階的にスキルアップ。日本食レストランは「日本人＝料理上手」のイメージで採用優遇。30歳超の社会人キャリアチェンジで料理人になる人も多。',
  },
  {
    question: '寿司職人になるルートは？',
    answer:
      '日本で寿司学校（1-3ヶ月）or 寿司店経験2-3年→渡航→日本食レストランでSushi Helperからスタート→Sushi Chefへ。豪・米・カナダの主要都市で寿司Chefは慢性的不足、PR取得まで早い場合4-5年。「日本人寿司職人」のブランドは世界的に通用。',
  },
  {
    question: '労働時間長いって本当？',
    answer:
      '本当。週40-50時間が標準、ピークシーズン60時間も。シフト制（朝/昼/夜）、週末・祝日勤務多。一方、料理人は世界中で需要高、安定雇用＋PRルート確保＋スキル一生もの、というメリットが大。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      'IELTS 5.5-6.0+で開始可。料理の現場用語は限定的、現場で覚える＋同僚との会話で英語上達。レストランスタッフは多国籍で英語ネイティブ少なめ、コミュニケーション英語で問題なし。PR申請時はIELTS 6.0+必須。',
  },
  {
    question: '帰国後のキャリアは？',
    answer:
      '海外シェフ経験は日本でも高評価。①外資系ホテル・レストラン就職、②独立して海外風レストラン開業、③料理教室・料理研究家、④日本食グローバル企業への就職。「海外で学んだ料理＋日本食」の組み合わせは独自性高、起業成功例も多。',
  },
];

export default async function WhCookChefPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(シェフ|料理人|寿司|chef|cook|レストラン|キッチン)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(シェフ|料理人|寿司|chef|cook|レストラン|キッチン)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外シェフ・料理人完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外シェフ・料理人完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外シェフ・料理人完全ガイド｜Commercial Cookery・寿司職人・PR
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="海外で料理人・シェフとして働き、PR取得を目指す方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              海外シェフ・料理人は、世界中で慢性的不足の人気職種。Certificate IIIで資格取得＋実務経験＋雇用主スポンサーでPR取得という王道ルートが確立しています。
              <br />
              この記事では資格、職種、給与、寿司職人ルート、PR取得まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'Certificate III in Commercial Cookery（1年）でCook就労可',
              '時給AUD 24-45、寿司職人は特別ルートでPR最速',
              '世界中で料理人不足、雇用主スポンサー獲得しやすい',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-chef" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ海外シェフ・料理人なのか</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・世界中で慢性的料理人不足、雇用主スポンサー獲得しやすい</li>
              <li>・Certificate III（1年）で実用資格取得</li>
              <li>・日本人＝料理上手のイメージで採用優遇</li>
              <li>・寿司職人は世界的ブランド、独自のキャリアパス</li>
              <li>・PR取得直結ルート（豪Chefは職業リスト常連）</li>
              <li>・帰国後も外資系ホテル・独立起業に活かせる</li>
            </ul>
          </section>

          {/* 資格 */}
          <section id="qualifications" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要資格・コース</h2>
            <div className="space-y-3">
              {QUALIFICATIONS.map((q, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{q.cert}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>期間:</strong> {q.duration}</p>
                    <p><strong>費用:</strong> <span className="text-amber-700 font-bold">{q.cost}</span></p>
                    <p className="text-xs text-gray-500 mt-2">{q.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 職種 */}
          <section id="job-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">職種・雇用先</h2>
            <div className="space-y-3">
              {JOB_TYPES.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{j.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{j.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 給与 */}
          <section id="salary" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">給与水準・労働環境</h2>
            <div className="space-y-3">
              {SALARY_INFO.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{s.role}</p>
                    <p className="text-sm font-bold text-amber-700">{s.salary}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="日本食レストラン・看護師・チャイルドケアも合わせて"
            description="他の専門職での海外キャリアも視野に。"
            primaryHref="/wh-japanese-restaurant"
            primaryLabel="日本食レストラン勤務"
            secondaryHref="/wh-nurse"
            secondaryLabel="海外で看護師"
          />

          {/* 寿司職人 */}
          <section id="sushi-chef" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">寿司職人の特別ルート</h2>
            <ol className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5 list-none">
              {SUSHI_CHEF_ROUTE.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* PR */}
          <section id="pr-route" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">PR取得への直通ルート</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PR_ROUTES.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">👨‍🍳</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 準備期間 */}
          <section id="preparation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">準備期間と費用</h2>
            <div className="space-y-3">
              {PREPARATION.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{p.phase}</p>
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
                体験談 <strong>n={all.length}件</strong> から「シェフ・料理人・寿司・キッチン」関連の言及を集計。
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
            ※ 資格・給与・ビザは2026年5月時点の情報です。最新情報はTAFE等の学校公式情報、各国移民局でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-japanese-restaurant" className="text-primary-600 hover:underline">→ 日本食レストラン勤務</Link></li>
              <li><Link href="/wh-nurse" className="text-primary-600 hover:underline">→ 海外で看護師</Link></li>
              <li><Link href="/wh-childcare" className="text-primary-600 hover:underline">→ 海外チャイルドケア</Link></li>
              <li><Link href="/melbourne-barista" className="text-primary-600 hover:underline">→ メルボルンでバリスタ</Link></li>
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/au-second-year-visa" className="text-primary-600 hover:underline">→ 豪WHセカンドビザ</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
