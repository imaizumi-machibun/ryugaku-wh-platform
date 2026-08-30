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

const PAGE_PATH = '/short-term-study';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '短期留学1〜3ヶ月完全ガイド｜社会人GW・夏休み・国別費用',
  description: '社会人GW・夏休み・有給を活用した1-3ヶ月の短期留学を完全解説。国別費用シミュレーション、ビザ要否、おすすめ学校、英語上達効果、申込スケジュールまで網羅。',
  path: PAGE_PATH,
  keywords: [
    '短期留学',
    '社会人 短期留学',
    '夏休み 留学',
    'GW 留学',
    '1ヶ月 留学',
    '3ヶ月 留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-short', label: 'なぜ短期留学が人気か' },
  { id: 'duration-effects', label: '期間別の英語上達効果' },
  { id: 'by-country', label: '国別費用と特徴' },
  { id: 'visa-rules', label: 'ビザ要否（3ヶ月以下）' },
  { id: 'top-destinations', label: '社会人短期留学おすすめ5都市' },
  { id: 'preparation', label: '申込から出発までのスケジュール' },
  { id: 'max-results', label: '短期で最大効果を出す5つのコツ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const DURATION_EFFECTS = [
  {
    duration: '1週間〜10日',
    effect: '「英語ノイズ」になる感覚、英語環境への慣れ',
    target: '英語に触れる第一歩、観光メイン',
  },
  {
    duration: '2週間',
    effect: 'リスニング軽く改善、簡単な会話可能に',
    target: '体験留学、GW＋有給活用社会人',
  },
  {
    duration: '1ヶ月',
    effect: '日常会話レベル到達、自信向上',
    target: '夏休み社会人、明確に上達したい人',
  },
  {
    duration: '3ヶ月',
    effect: 'TOEIC 150-200点UP、ビジネス基礎到達',
    target: '本格上達狙う社会人、退職前提',
  },
];

const BY_COUNTRY = [
  { country: 'セブ（フィリピン）', cost: '1ヶ月20-30万円', detail: 'マンツーマン中心、最短・最安、初心者向け' },
  { country: 'マルタ', cost: '1ヶ月25-38万円', detail: '欧州雰囲気＋治安◎、ビザ不要（90日）' },
  { country: 'マレーシア', cost: '1ヶ月15-25万円', detail: '最安、生活費安、東南アジア英語環境' },
  { country: 'オーストラリア', cost: '1ヶ月35-50万円', detail: '英語圏王道、観光留学、ビザ不要（3ヶ月）' },
  { country: 'カナダ', cost: '1ヶ月35-50万円', detail: '北米英語、ビザ不要（6ヶ月）' },
  { country: 'イギリス', cost: '1ヶ月50-80万円', detail: '本場英語＋欧州周遊、6ヶ月までビザ不要' },
  { country: 'アメリカ', cost: '1ヶ月55-90万円', detail: '世界一物価高、F-1ビザ必要（90日超）' },
];

const VISA_RULES = [
  { country: '豪・NZ', rule: '3ヶ月以内ならビザ不要（観光ビザ扱い）、就労不可' },
  { country: '加', rule: '6ヶ月以内ならビザ不要（観光）、就労不可' },
  { country: '英', rule: '6ヶ月以内ならビザ不要（観光）、就労不可' },
  { country: 'マルタ', rule: '90日以内ならビザ不要（シェンゲン圏）' },
  { country: '米', rule: '90日以内なら観光ビザ（ESTA）、就労・本格留学不可' },
  { country: 'セブ・マレーシア', rule: '30日以内ビザ不要、超える場合はSSP取得' },
];

const TOP_DESTINATIONS = [
  {
    city: 'セブ（フィリピン）',
    feature: 'マンツーマン1日4-8時間、最短上達、寮付き',
    cost: '1ヶ月20-30万円（寮込み）',
    forWho: 'コスパ重視・初心者・スピード上達',
  },
  {
    city: 'バンクーバー（カナダ）',
    feature: '日本人多めだが治安◎、観光地アクセス◎',
    cost: '1ヶ月35-50万円',
    forWho: '北米英語・初心者・安心感重視',
  },
  {
    city: 'メルボルン（豪）',
    feature: 'カフェ文化、英語環境◎、リラックス',
    cost: '1ヶ月35-50万円',
    forWho: '英語没頭・カフェ巡り好き',
  },
  {
    city: 'マルタ',
    feature: '欧州雰囲気＋温暖気候、ビザ不要、地中海',
    cost: '1ヶ月25-38万円',
    forWho: '欧州体験＋コスパ重視',
  },
  {
    city: 'ロンドン（英）',
    feature: '本場英語＋欧州周遊拠点、6ヶ月までビザ不要',
    cost: '1ヶ月50-80万円',
    forWho: '本場英語＋欧州旅行好き',
  },
];

const PREP_TIMELINE = [
  { period: '出発3ヶ月前', activity: '渡航先・期間決定、学校選定開始、貯金' },
  { period: '出発2ヶ月前', activity: '学校申込・入学許可受領、航空券予約' },
  { period: '出発1ヶ月前', activity: '海外保険契約、宿泊予約、ビザ手続き' },
  { period: '出発2週間前', activity: 'パッキング、SIM/eSIM準備、現金両替' },
  { period: '出発前日', activity: '書類最終確認、空港3時間前到着' },
];

const MAX_RESULT_TIPS = [
  '出発前にオンライン英会話で基礎会話力UP（DMM英会話等）',
  '日本人少ない学校を選ぶ（フィリピンは多、欧州は少）',
  'ホームステイ選択でアウトプット機会増',
  '学校外でも英語環境作る（カフェ・Meetup参加）',
  '日記・SNSを英語で書く習慣',
  '帰国後の継続学習計画（オンライン英会話継続）',
];

const FAQS = [
  {
    question: '1ヶ月の短期留学でどれくらい英語上達する？',
    answer:
      'TOEIC換算で50-100点UPが目安、特にリスニング・スピーキングに効果大。「英語を話す習慣」が最大の収穫。完全な英語力UP目的なら3ヶ月以上推奨。1ヶ月は「英語環境への慣れ＋自信獲得」が現実的な成果。',
  },
  {
    question: '社会人で1ヶ月の休暇取れる？',
    answer:
      '取れる方法あり。①有給休暇＋GW＋夏休み組み合わせ、②長期休暇制度活用、③退職してリセット、④リモートワーク併用、⑤転職の合間。実際の社会人短期留学者の多くは2-3ヶ月の有給＋休職組合せ。会社制度を活用しましょう。',
  },
  {
    question: 'どの国・都市が短期留学向き？',
    answer:
      'コスパ重視ならセブ、欧州雰囲気＋ビザ不要ならマルタ、英語圏王道なら豪・加、本場英語なら英、本場アメリカなら米。1-3ヶ月の場合、ビザ不要の国（豪・加・英・マルタ）が手続き楽。',
  },
  {
    question: '短期留学で本当に英語上達する？',
    answer:
      '上達します、ただし「期間相応」。1ヶ月で初級→中級、3ヶ月で中級→中上級に進化可能。重要なのは「出発前の基礎」と「現地での積極性」。完全英語環境で過ごす24時間×30日 vs 日本での週1英会話、効果の差は明白。',
  },
  {
    question: '帰国後どう活かす？',
    answer:
      '①TOEIC等の試験で具体スコア取得、②英語学習を継続（オンライン英会話）、③転職市場で「短期海外経験」アピール、④長期留学・ワーホリへのステップ。短期留学は「次のキャリア・人生選択への入口」として最大活用を。',
  },
];

export default async function ShortTermStudyPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(短期|1ヶ月|3ヶ月|社会人|有給)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(短期|1ヶ月|3ヶ月|社会人|有給)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '短期留学1-3ヶ月完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '短期留学1-3ヶ月完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              短期留学1〜3ヶ月完全ガイド｜社会人GW・夏休み・国別費用
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="社会人で短期間の留学を検討する方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「1年も休めない」社会人でも、GW・有給・夏休みを組み合わせれば1〜3ヶ月の短期留学が可能。ビザ不要の国も多く、手続きシンプル。
              <br />
              この記事では期間別の英語上達効果、国別費用、ビザ要否、おすすめ5都市、最大効果のコツまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '3ヶ月以内ならビザ不要の国が多い（豪・加・英・マルタ等）',
              '1ヶ月で日常会話、3ヶ月でビジネス基礎レベル',
              '社会人は有給＋夏休み＋休職組合せで実現可',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ短期 */}
          <section id="why-short" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ短期留学が人気か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・1年のワーホリは無理でも、1-3ヶ月なら社会人も実現可</li>
              <li>・3ヶ月以内ならビザ不要の国多、手続き楽</li>
              <li>・費用も20-90万円と1年留学の1/10-1/3</li>
              <li>・有給＋夏休み＋休職を組み合わせれば仕事継続可</li>
              <li>・「お試し留学」として将来の長期留学検討材料に</li>
              <li>・転職前のキャリアブランク有効活用</li>
            </ul>
          </section>

          {/* 期間別効果 */}
          <section id="duration-effects" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">期間別の英語上達効果</h2>
            <div className="space-y-3">
              {DURATION_EFFECTS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{d.duration}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2"><strong>効果:</strong> {d.effect}</p>
                  <p className="text-xs text-gray-500"><strong>こんな人向き:</strong> {d.target}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 国別 */}
          <section id="by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別費用と特徴</h2>
            <div className="space-y-3">
              {BY_COUNTRY.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{c.country}</p>
                    <p className="text-sm font-bold text-amber-700">{c.cost}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ビザ */}
          <section id="visa-rules" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザ要否（3ヶ月以下）</h2>
            <div className="space-y-3">
              {VISA_RULES.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{v.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{v.rule}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="本格的な長期留学・ワーホリも視野に"
            description="1年以上の留学・ワーホリの全体像も合わせて検討すると、より自分に合う選択肢が見つかります。"
            primaryHref="/matching"
            primaryLabel="自分に合う留学診断"
            secondaryHref="/agent-comparison"
            secondaryLabel="エージェント必要？"
          />

          {/* おすすめ */}
          <section id="top-destinations" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">社会人短期留学おすすめ5都市</h2>
            <div className="space-y-3">
              {TOP_DESTINATIONS.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{t.city}</p>
                    <p className="text-sm font-bold text-amber-700">{t.cost}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{t.feature}</p>
                  <p className="text-xs text-gray-500"><strong>こんな人向き:</strong> {t.forWho}</p>
                </div>
              ))}
            </div>
          </section>

          {/* スケジュール */}
          <section id="preparation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">申込から出発までのスケジュール</h2>
            <div className="space-y-3">
              {PREP_TIMELINE.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{p.period}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{p.activity}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 最大化のコツ */}
          <section id="max-results" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">短期で最大効果を出す5つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {MAX_RESULT_TIPS.map((t, i) => (
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
                体験談 <strong>n={all.length}件</strong> から「短期・1ヶ月・3ヶ月・社会人」関連の言及を集計。
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
            ※ 費用・ビザ要件は2026年5月時点の情報です。最新情報は各国大使館・学校公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/cebu-study-real-cost" className="text-primary-600 hover:underline">→ セブ留学リアルコスト</Link></li>
              <li><Link href="/malta-study" className="text-primary-600 hover:underline">→ マルタ留学完全ガイド</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
              <li><Link href="/no-english" className="text-primary-600 hover:underline">→ 英語ゼロでも留学</Link></li>
              <li><Link href="/30s-guide" className="text-primary-600 hover:underline">→ 30代からの留学</Link></li>
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
