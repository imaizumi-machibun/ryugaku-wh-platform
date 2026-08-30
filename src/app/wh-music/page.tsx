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

const PAGE_PATH = '/wh-music';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '音楽留学完全ガイド｜バークリー・名門校・ジャンル別・オーディション',
  description: '海外音楽留学の完全ガイド。バークリー音楽大学・名門校、ジャンル別（ジャズ・クラシック・作曲・音楽ビジネス）、オーディション、費用、卒業後のキャリアまで完全解説。',
  path: PAGE_PATH,
  keywords: [
    '音楽留学',
    'バークリー音楽大学',
    'ジャズ 留学',
    'クラシック 留学',
    '音楽 専門学校 海外',
    'ミュージシャン 海外',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-music', label: 'なぜ海外音楽留学か' },
  { id: 'top-schools', label: '世界トップ音楽校・ジャンル別' },
  { id: 'genres', label: 'ジャンル別の留学先' },
  { id: 'audition', label: 'オーディション・出願準備' },
  { id: 'cost', label: '費用シミュレーション' },
  { id: 'career', label: '卒業後のキャリア' },
  { id: 'tips', label: '成功する5つのコツ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TOP_SCHOOLS = [
  {
    school: 'Berklee College of Music（米ボストン）',
    feature: 'ジャズ・ポピュラー音楽の最高峰、現代音楽の聖地',
    cost: '年$50,000-60,000',
  },
  {
    school: 'Juilliard School（米NY）',
    feature: 'クラシック・ダンス・演劇の世界最難関',
    cost: '年$50,000-55,000',
  },
  {
    school: 'Royal Academy of Music（英ロンドン）',
    feature: 'クラシックの名門、英国王立',
    cost: '年£25,000-35,000',
  },
  {
    school: 'Musicians Institute（米LA）',
    feature: 'ギター・ベース・ドラム等の実技特化、業界直結',
    cost: '年$30,000-40,000',
  },
  {
    school: 'BIMM Institute（英）',
    feature: 'ポピュラー・ロック音楽、音楽ビジネスも',
    cost: '年£15,000-20,000',
  },
];

const GENRES = [
  { genre: 'ジャズ・現代音楽', dest: 'バークリー（米）、ニューヨーク', detail: '世界トップミュージシャンとセッション' },
  { genre: 'クラシック', dest: 'Juilliard（米）、英・独・墺の音楽院', detail: '伝統的な演奏技術・理論' },
  { genre: '作曲・編曲', dest: 'バークリー、Royal Academy', detail: '映画音楽・ゲーム音楽含む' },
  { genre: '音楽プロデュース・DTM', dest: 'LA・ロンドンの音楽専門校', detail: '最新技術＋業界人脈' },
  { genre: '音楽ビジネス', dest: 'バークリー、BIMM', detail: 'マネジメント・著作権・マーケティング' },
  { genre: 'ボーカル', dest: 'LA・NY・ロンドンの専門校', detail: 'ポップ・ジャズ・クラシック別' },
];

const AUDITION_PREP = [
  '演奏動画・音源（ポートフォリオ）の準備',
  'オーディション課題曲の練習（数ヶ月前から）',
  '音楽理論試験の対策（多くの校で必須）',
  '英語試験（IELTS 6.0-6.5）',
  'Personal Statement（音楽への情熱・目標）',
  '推薦状（音楽教師・指導者から）',
  '一部校は対面 or オンラインオーディション',
];

const COST_SIMULATION = [
  { program: 'バークリー学士4年', tuition: '$200,000-240,000', living: '$80,000-120,000', total: '約4,600-5,800万円' },
  { program: '英BIMM学士3年', tuition: '£45,000-60,000', living: '£36,000-54,000', total: '約1,600-2,200万円' },
  { program: 'LA音楽専門2年', tuition: '$60,000-80,000', living: '$48,000-72,000', total: '約1,700-2,400万円' },
  { program: '短期サマースクール', tuition: '$3,000-8,000', living: '$2,000-5,000', total: '約75-200万円' },
];

const CAREER = [
  'プロミュージシャン・演奏家（ライブ・スタジオ）',
  '作曲家・編曲家（映画・ゲーム・CM音楽）',
  '音楽プロデューサー・サウンドエンジニア',
  '音楽教師・講師（学校・個人）',
  '音楽ビジネス（レーベル・マネジメント・著作権）',
  'YouTube・配信での音楽活動＋収益化',
  '帰国後の音楽スクール開業・講師',
];

const TIPS = [
  '出発前に演奏スキル・音楽理論を最大限磨く',
  'ポートフォリオ（演奏動画・音源）の質を高める',
  '英語＋音楽理論の両方を準備',
  '奨学金応募（実力者は学費免除も）',
  '現地ミュージシャンとのセッション・人脈構築を積極的に',
];

const FAQS = [
  {
    question: '音楽未経験でも音楽留学できる？',
    answer:
      '名門校（バークリー・Juilliard）は高度な演奏スキル＋音楽理論必須、未経験は厳しい。一方、音楽ビジネス・DTM・初心者向けコースなら未経験から可。サマースクール（1-8週間）で体験してから本格留学を検討するのも王道。',
  },
  {
    question: 'バークリーは難関？',
    answer:
      '世界最難関の一つ。オーディション＋演奏スキル＋音楽理論＋英語が必要。合格率は約30-50%、奨学金獲得者は実力者揃い。日本人卒業生も多数（世界的アーティスト輩出）、本気で音楽キャリアを目指す人向け。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      'IELTS 6.0-6.5が目安。音楽留学は実技中心と思いがちだが、理論授業・アンサンブル・ディスカッションで英語必須。「音楽は世界共通言語」だが、座学＋コミュニケーションには英語力が問われる。',
  },
  {
    question: '費用が高い、奨学金は？',
    answer:
      'バークリー等は実力者に奨学金（学費の20-100%免除）あり。オーディションでの演奏が評価されれば大幅減額も。日本国内の音楽財団・JASSO・大学独自奨学金も活用。短期サマースクール（75-200万円）から始めるのも選択肢。',
  },
  {
    question: '卒業後に音楽で食べていける？',
    answer:
      '実力＋ビジネススキル次第。プロ演奏家は競争激しいが、作曲・プロデュース・音楽教育・音楽ビジネスは安定収入の道あり。「演奏＋教育」「演奏＋配信」等の複数収入源が現代の音楽家のリアル。海外音楽留学経験は日本の音楽業界でも高評価。',
  },
];

export default async function WhMusicPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(音楽|ミュージシャン|ジャズ|バンド|music|楽器)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(音楽|ミュージシャン|ジャズ|バンド|music|楽器)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '音楽留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '音楽留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              音楽留学完全ガイド｜バークリー・名門校・ジャンル別・オーディション
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="音楽でグローバルキャリアを目指す方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              音楽留学は、世界トップミュージシャンとの学び＋本場の音楽シーン＋グローバル人脈を獲得できる夢の選択肢。バークリー・Juilliard等の名門から実技特化校まで多様。
              <br />
              この記事では世界トップ校、ジャンル別留学先、オーディション、費用、卒業後キャリアまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'バークリー（ジャズ・ポップ）、Juilliard（クラシック）が双璧',
              'オーディション＋演奏スキル＋音楽理論＋英語が必要',
              '実力者は奨学金（学費20-100%免除）獲得も',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-music" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ海外音楽留学か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・世界トップミュージシャン・教授陣との学び</li>
              <li>・本場の音楽シーン（NY・LA・ロンドン）での経験</li>
              <li>・グローバル音楽人脈の構築</li>
              <li>・最新技術・設備での音楽制作</li>
              <li>・多様なジャンル・文化との融合</li>
              <li>・卒業生ネットワーク（業界トップに繋がる）</li>
            </ul>
          </section>

          {/* 主要校 */}
          <section id="top-schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">世界トップ音楽校・ジャンル別</h2>
            <div className="space-y-3">
              {TOP_SCHOOLS.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{s.school}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{s.feature}</p>
                  <p className="text-sm text-amber-700 font-bold">{s.cost}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ジャンル */}
          <section id="genres" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ジャンル別の留学先</h2>
            <div className="space-y-3">
              {GENRES.map((g, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{g.genre}</p>
                  <p className="text-sm text-gray-800 mb-1"><strong>主な留学先:</strong> {g.dest}</p>
                  <p className="text-xs text-gray-500">{g.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* オーディション */}
          <section id="audition" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">オーディション・出願準備</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {AUDITION_PREP.map((a, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🎵</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="アート・大学進学など他専門留学も合わせて"
            description="音楽以外のクリエイティブ留学、海外大学進学全般も視野に。"
            primaryHref="/wh-art-design"
            primaryLabel="アート・デザイン留学"
            secondaryHref="/wh-overseas-university"
            secondaryLabel="海外大学・大学院進学"
          />

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用シミュレーション</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">プログラム</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">学費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">生活費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">合計</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_SIMULATION.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.program}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.tuition}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.living}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ※ 実力者は奨学金で学費20-100%免除も。サマースクールから始めるのも選択肢。
            </p>
          </section>

          {/* キャリア */}
          <section id="career" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">卒業後のキャリア</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {CAREER.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">→</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* コツ */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">成功する5つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">{i + 1}.</span>
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
                体験談 <strong>n={all.length}件</strong> から「音楽・ミュージシャン・楽器」関連の言及を集計。
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
            ※ 学費・入学要件は2026年5月時点の情報です。最新情報は各校公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-art-design" className="text-primary-600 hover:underline">→ アート・デザイン留学</Link></li>
              <li><Link href="/wh-overseas-university" className="text-primary-600 hover:underline">→ 海外大学・大学院進学</Link></li>
              <li><Link href="/us-language-school" className="text-primary-600 hover:underline">→ アメリカ語学留学</Link></li>
              <li><Link href="/uk-language-school" className="text-primary-600 hover:underline">→ イギリス語学留学</Link></li>
              <li><Link href="/scholarship-wh" className="text-primary-600 hover:underline">→ ワーホリ奨学金</Link></li>
              <li><Link href="/short-term-study" className="text-primary-600 hover:underline">→ 短期留学1-3ヶ月</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
