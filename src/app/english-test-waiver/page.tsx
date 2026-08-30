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

const PAGE_PATH = '/english-test-waiver';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'IELTS/TOEFL免除条件完全ガイド｜大学・語学学校が認める代替手段',
  description: 'IELTS/TOEFLが免除される条件を国別・学校別に網羅。Duolingo English Test、TOEIC、Cambridge、PTE、英語圏在住歴、語学学校修了など代替手段を完全解説。',
  path: PAGE_PATH,
  keywords: [
    'IELTS 免除',
    'TOEFL 免除',
    '英語試験 免除',
    'IELTS 代替',
    'Duolingo English Test',
    'TOEIC 留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-waived', label: 'なぜIELTS/TOEFL免除制度があるのか' },
  { id: 'waiver-types', label: '免除パターン5種類' },
  { id: 'alt-tests', label: '代替試験一覧（Duolingo・Cambridge・PTE等）' },
  { id: 'by-country', label: '国別の免除条件' },
  { id: 'by-school', label: '学校別の免除条件' },
  { id: 'docs-needed', label: '免除申請に必要な書類' },
  { id: 'tips', label: '免除を勝ち取るための7つのコツ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const WAIVER_TYPES = [
  {
    type: '①代替試験スコア提出',
    detail: 'Duolingo English Test・Cambridge・PTE・TOEICなどIELTS/TOEFL以外の英語試験を認める',
    example: 'カナダ・オーストラリアの語学学校はDuolingoスコアを受入れ',
  },
  {
    type: '②条件付き入学（語学学校併修）',
    detail: 'スコア不足でも併設の語学学校で英語コース修了→本科入学',
    example: '英・豪・加の大学・専門学校で広く採用',
  },
  {
    type: '③英語圏での教育歴',
    detail: '英語圏の中学・高校・大学に2年以上在籍した実績',
    example: '英・豪・加・米・NZ・愛・南アで2年以上の場合多くの学校で免除',
  },
  {
    type: '④パスポート国籍による免除',
    detail: '英語圏国籍者は無条件で英語要件免除',
    example: '英・豪・加・米・NZ・愛・シンガポール等',
  },
  {
    type: '⑤学校独自のオンライン英語テスト',
    detail: '入学希望校が独自に実施する15〜45分のオンライン試験で代替',
    example: 'カナダ・オーストラリアの私立カレッジで増加中',
  },
];

const ALT_TESTS = [
  { name: 'Duolingo English Test', cost: '$59', time: '60分', detail: '自宅オンライン、24時間以内に結果。160点満点で大学はDuolingo110+を要求' },
  { name: 'Cambridge English (FCE/CAE/CPE)', cost: '£175〜250', time: '4時間', detail: '永久有効。CAE 180+で多くの大学免除可' },
  { name: 'PTE Academic', cost: 'AUD 405', time: '3時間', detail: 'コンピューターベース、5日以内に結果。豪・加・英で広く受入' },
  { name: 'TOEFL Essentials', cost: '$130', time: '1.5時間', detail: '自宅オンラインTOEFL簡易版。受入校は限定的' },
  { name: 'IELTS Indicator', cost: 'AUD 200', time: '2.5時間', detail: 'IELTS主催のオンライン版。一部学校のみ受入' },
  { name: 'TOEIC L&R', cost: '7,810円', time: '2時間', detail: '日本で受験者多い。海外受入は限定的、職業系のみ' },
];

const BY_COUNTRY = [
  { country: 'オーストラリア', acceptance: 'Duolingo・Cambridge・PTE広く受入。学生ビザはIELTS必須の場合多' },
  { country: 'カナダ', acceptance: 'Duolingo・PTE・Cambridge受入。SDS（学生ダイレクトストリーム）はIELTS6.0必須' },
  { country: 'イギリス', acceptance: 'UKVI認定IELTSが基本。Cambridge・PTE・Trinityも条件付き受入' },
  { country: 'アメリカ', acceptance: 'TOEFL・IELTS・Duolingo広く受入。F-1ビザ取得には基本要件あり' },
  { country: 'ニュージーランド', acceptance: 'IELTS・TOEFL・Cambridge・PTE受入。学生ビザ要件あり' },
  { country: 'アイルランド', acceptance: 'IELTS・Cambridge受入。Duolingo増加中' },
];

const BY_SCHOOL = [
  { type: '英語圏の語学学校', detail: 'ほぼ全てが英語試験スコア不要、入学時のレベル分けテストで代替' },
  { type: '私立大学・カレッジ（豪・加）', detail: '条件付き入学が一般的、語学コース併修で本科入学OK' },
  { type: '公立大学（豪・加・英）', detail: 'IELTS 6.0-6.5要求が標準。Duolingo・Cambridgeも受入増' },
  { type: '専門学校（TAFE・College）', detail: 'IELTS 5.5以下でも入学可、条件付き多い' },
  { type: '大学院（豪・米・英）', detail: 'IELTS 6.5-7.0要求が一般的、TOEFL受入も多' },
];

const DOCS_NEEDED = [
  '代替試験の公式スコアレポート（電子送付推奨）',
  '高校・大学卒業証明書（英文）',
  '成績証明書（英文）',
  '英語圏在住・教育歴の証明書（必要に応じて）',
  '推薦状・モチベーションレター',
  'パスポートコピー',
];

const TIPS = [
  '出願先の入学要件ページで「English Proficiency」セクションを必ず確認',
  '迷ったら入学事務局にメールで直接問い合わせ（Duolingo受入か等）',
  'Duolingoは安く早いが、難関校はIELTS必須が多いので注意',
  '条件付き入学なら、語学学校から本科への接続プログラム選択',
  'TOEICは海外通用度が低い、留学目的ならIELTS or Cambridge推奨',
  '英語圏中高卒業の人はパスポートと卒業証明書で免除申請可能',
  '免除申請は早めに、書類確認に2-4週間かかる',
];

const FAQS = [
  {
    question: 'IELTSを受けずに留学する方法はある？',
    answer:
      'あります。Duolingo English Test、Cambridge、PTE Academic等の代替試験スコア提出、語学学校から条件付き入学、英語圏での教育歴証明、学校独自テスト等のルートがあります。ただし大学院・難関大学はIELTS必須の場合が多いため、出願先により確認が必要。',
  },
  {
    question: 'Duolingo English Testはどこまで通用する？',
    answer:
      '近年急速に受入校が増えており、2026年現在で世界5,000以上の大学・カレッジが受入。アメリカ・カナダ・オーストラリアの語学学校・私立カレッジは広く受入。一方でイギリス・公立大学・大学院ではまだIELTS優位。出願先での個別確認必須。',
  },
  {
    question: 'TOEICで留学できる？',
    answer:
      '海外大学・カレッジでの受入は限定的。日本では認知度が高いものの、海外では「Listening & Reading」のみのテスト形式が留学要件と合わない（Speaking/Writing必須が多い）。職業系プログラム・日本人向けプログラム以外では推奨されません。',
  },
  {
    question: '英語圏で2年以上学んだら免除？',
    answer:
      'はい、多くの学校で免除されます。「英語圏の認定教育機関で2年以上の教育を完了」の証明書を提出。受入条件は学校により異なるため、入学事務局に直接確認推奨。中・高・大の卒業証明書（英文）が必要書類になります。',
  },
  {
    question: 'スコア不足でも入学できる？',
    answer:
      '可能。「条件付き入学（Conditional Offer）」制度を多くの英語圏大学が提供。提示されたスコアに満たない場合は、併設の語学学校で必要レベルまで学習→本科入学のスキーム。出発時のスコア不要、現地で着実に上達できます。',
  },
];

export default async function EnglishTestWaiverPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(IELTS|TOEFL|TOEIC|Duolingo|英語試験|英語力)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(IELTS|TOEFL|TOEIC|Duolingo|英語試験|英語力)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'IELTS/TOEFL免除条件完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'IELTS/TOEFL免除条件完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              IELTS/TOEFL免除条件完全ガイド｜大学・語学学校が認める代替手段
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="IELTS/TOEFLを受けたくない方／代替手段を探している方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「留学にはIELTSやTOEFLが必須」と思っていませんか？実は近年、Duolingo・Cambridge・PTEなどの代替試験や、条件付き入学、教育歴証明など多様な免除パターンが整備されています。
              <br />
              この記事では国別・学校別の免除条件、代替試験6種類の比較、必要書類まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '代替試験はDuolingo・Cambridge・PTEなど6種類が選択肢',
              '英語圏教育歴2年以上・パスポート国籍で完全免除も',
              '条件付き入学なら出発時のスコア不要、現地で上達OK',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ免除制度 */}
          <section id="why-waived" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜIELTS/TOEFL免除制度があるのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              IELTSやTOEFLは受験料が高く（IELTSは27,500円）、世界中で受験会場が限られる課題があります。コロナ禍以降、各大学は「英語力を別の手段で証明できれば良い」という方針に転換、結果として免除パターンが多様化しました。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・Duolingo English Testの受入校が世界5,000校以上に拡大</li>
              <li>・コロナ後に大学独自のオンライン英語試験が登場</li>
              <li>・「条件付き入学＋語学学校併修」スキームが定着</li>
              <li>・英語圏教育歴・国籍による完全免除も継続</li>
            </ul>
          </section>

          {/* 免除パターン */}
          <section id="waiver-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">免除パターン5種類</h2>
            <div className="space-y-3">
              {WAIVER_TYPES.map((w, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{w.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{w.detail}</p>
                  <p className="text-xs text-gray-500"><strong>例:</strong> {w.example}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="英語ゼロから留学を成功させる方法"
            description="英語に自信がなくても、現地で確実に上達する方法と学校選びを解説。"
            primaryHref="/no-english"
            primaryLabel="英語ゼロでも留学"
            secondaryHref="/language-school-ranking"
            secondaryLabel="語学学校ランキング"
          />

          {/* 代替試験 */}
          <section id="alt-tests" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">代替試験一覧</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-2 py-2 text-left">試験名</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">費用</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">所要時間</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {ALT_TESTS.map((t, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{t.name}</td>
                      <td className="border border-gray-200 px-2 py-2">{t.cost}</td>
                      <td className="border border-gray-200 px-2 py-2">{t.time}</td>
                      <td className="border border-gray-200 px-2 py-2 text-xs">{t.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 国別 */}
          <section id="by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別の免除条件</h2>
            <div className="space-y-3">
              {BY_COUNTRY.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{c.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.acceptance}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 学校別 */}
          <section id="by-school" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">学校別の免除条件</h2>
            <div className="space-y-3">
              {BY_SCHOOL.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{s.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 必要書類 */}
          <section id="docs-needed" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">免除申請に必要な書類</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {DOCS_NEEDED.map((d, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">📄</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* コツ */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">免除を勝ち取るための7つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {TIPS.map((t, i) => (
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
                体験談 <strong>n={all.length}件</strong> から「IELTS・TOEFL・英語試験」関連の言及を集計。
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
            ※ 受験料・受入要件は2026年5月時点の情報です。最新情報は各試験運営団体・出願先大学の公式サイトでご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/no-english" className="text-primary-600 hover:underline">→ 英語ゼロでも留学</Link></li>
              <li><Link href="/language-school-ranking" className="text-primary-600 hover:underline">→ 語学学校ランキング</Link></li>
              <li><Link href="/cebu-study-real-cost" className="text-primary-600 hover:underline">→ セブ留学リアルコスト</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト</Link></li>
              <li><Link href="/30s-guide" className="text-primary-600 hover:underline">→ 30代からの留学</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
