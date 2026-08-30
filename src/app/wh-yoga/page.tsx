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

const PAGE_PATH = '/wh-yoga';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ヨガ留学完全ガイド｜RYT200・バリ・インド・米国・インストラクター',
  description: 'ヨガ留学完全ガイド。RYT200/500資格取得、バリ・インド・米国の主要スクール、費用、インストラクター就職、帰国後キャリアまで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'ヨガ 留学',
    'RYT200',
    'バリ ヨガ留学',
    'インド ヨガ留学',
    'ヨガインストラクター 資格',
    '海外 ヨガスクール',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-yoga', label: 'なぜヨガ留学が人気か' },
  { id: 'certifications', label: '主要資格（RYT200/500）' },
  { id: 'top-destinations', label: '主要留学先5選' },
  { id: 'cost', label: '費用シミュレーション' },
  { id: 'program-content', label: 'プログラム内容' },
  { id: 'after-graduation', label: '卒業後のキャリア' },
  { id: 'tips', label: '成功する5つのコツ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const CERTIFICATIONS = [
  {
    cert: 'RYT200（200時間）',
    duration: '3-4週間（集中）',
    cost: '$1,500-3,500',
    detail: 'ヨガアライアンス認定の入門資格、世界中で通用',
  },
  {
    cert: 'RYT500（追加300時間）',
    duration: '4-6週間（追加）',
    cost: '$2,500-5,000',
    detail: '上級資格、専門ヨガ流派学習',
  },
  {
    cert: 'YACEP（継続教育）',
    duration: '随時',
    cost: '$200-500/コース',
    detail: '資格維持のための継続学習証明',
  },
];

const TOP_DESTINATIONS = [
  {
    place: 'バリ（インドネシア）',
    feature: 'ヨガリゾートの聖地、ウブド中心。物価安・自然豊か',
    cost: 'RYT200 $1,500-3,000＋滞在費',
  },
  {
    place: 'リシケシュ（インド）',
    feature: 'ヨガ発祥地、本場の伝統ヨガ学習',
    cost: 'RYT200 $1,200-2,500（最安）',
  },
  {
    place: 'ハワイ（米国）',
    feature: '英語学習＋ヨガ、美しい自然',
    cost: 'RYT200 $3,000-5,000（高め）',
  },
  {
    place: 'コスタリカ',
    feature: 'ジャングル＋ビーチ、エコリゾート',
    cost: 'RYT200 $2,500-4,500',
  },
  {
    place: 'タイ（チェンマイ）',
    feature: 'コスパ良、ウェルネスツーリズム盛ん',
    cost: 'RYT200 $1,800-3,500',
  },
];

const COST_SIMULATION = [
  { destination: 'バリ・ウブド 3週間', tuition: '$2,000-3,000', living: '$600-1,000', total: '約40-60万円' },
  { destination: 'インド・リシケシュ 4週間', tuition: '$1,200-2,500', living: '$400-800', total: '約25-50万円' },
  { destination: 'ハワイ 4週間', tuition: '$3,500-5,000', living: '$2,000-3,500', total: '約85-130万円' },
  { destination: 'タイ・チェンマイ 3週間', tuition: '$2,000-3,500', living: '$500-900', total: '約40-65万円' },
];

const PROGRAM_CONTENT = [
  'アサナ（ポーズ）：基本〜上級ポーズの実践と指導法',
  'プラナヤマ（呼吸法）：各種呼吸法の理論と実践',
  'メディテーション（瞑想）：マインドフルネス、瞑想指導法',
  '解剖学：人体の筋肉・骨格、ヨガにおける身体使い方',
  'ヨガ哲学：ヨガスートラ、バガヴァッド・ギーター等',
  '指導法：クラス組み立て、アジャストメント、生徒対応',
  '修了試験：筆記＋実技、合格でRYT200認定',
];

const AFTER_GRAD = [
  '日本でヨガインストラクター就職（時給2,500-5,000円）',
  '海外ヨガスタジオ就職（バリ・タイ・米国等）',
  '独立してヨガスタジオ開業',
  'オンラインヨガ講師（Zoom・YouTube）',
  '企業ヨガ・ホテルヨガ等の派遣業',
  'ヨガリトリート企画運営',
  'ヨガ＋他業界（医療・介護・教育）でユニーク',
];

const TIPS = [
  '出発前に基本ヨガ経験積む（最低6ヶ月）',
  '英語：簡単なヨガ用語＋基本会話、IELTS 5.5+程度',
  '体力作り：3週間の集中プログラムは体力勝負',
  '修了後のキャリアプラン明確化',
  'スクール選び：認定講師の質・卒業生の活躍を確認',
];

const FAQS = [
  {
    question: 'ヨガ未経験でもRYT200取れる？',
    answer:
      '取れますが推奨は最低6ヶ月の経験。3週間でアサナ・解剖学・哲学・指導法を一気に学ぶため、全くの未経験は厳しい。出発前に週2-3回ヨガクラス通い＋自宅練習で基礎作りを推奨。経験者なら3週間で十分修得可。',
  },
  {
    question: 'RYT200の価値は？',
    answer:
      '世界中で通用するヨガアライアンス公認資格。日本でも70%以上のヨガスタジオが採用条件として求める。取得後は時給2,500-5,000円のヨガインストラクターとして即就職可、副業・独立への道も。',
  },
  {
    question: 'バリとインド、どっち？',
    answer:
      'バリ：リゾート感＋多国籍＋英語環境＋設備◎、初心者向き。インド：本場の伝統＋哲学深堀＋最安、ヨガ歴長い経験者向き。観光・ライフスタイル重視ならバリ、深い学び重視ならインド。両方経験するヨガ講師も多。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      'IELTS 5.5+程度で十分。授業は英語＋サンスクリット語、シンプルな指示が多。哲学・解剖学はテキストで補完。日本人参加者多めのスクールなら通訳サポートも。3-4週間で英語＋ヨガ両方上達するボーナス効果あり。',
  },
  {
    question: '帰国後の収入は？',
    answer:
      '日本でヨガインストラクター時給2,500-5,000円、月収15-40万円（フルタイム）。独立すれば月収50-100万円も可能、ただ集客力次第。「ヨガ＋他スキル（マッサージ・栄養学・ピラティス等）」の組み合わせで差別化＋単価UPが現代の成功パターン。',
  },
];

export default async function WhYogaPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(ヨガ|yoga|瞑想|メディテーション|RYT)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(ヨガ|yoga|瞑想|メディテーション|RYT)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ヨガ留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ヨガ留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ヨガ留学完全ガイド｜RYT200・バリ・インド・米国・インストラクター
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="ヨガ留学・インストラクター志望の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ヨガ留学は、3-4週間の集中プログラムで世界共通のRYT200資格を取得＋ヨガ深堀＋海外滞在＋英語上達を同時に実現できる人気の選択肢。
              <br />
              この記事ではRYT200/500資格、主要留学先、費用、プログラム内容、卒業後キャリアまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'RYT200（3週間集中）で世界共通ヨガインストラクター資格',
              'バリ・インド・米国・タイが主要留学先、コスパ重視ならインド',
              '帰国後は時給2,500-5,000円のヨガ講師として即活躍可',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-yoga" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜヨガ留学が人気か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・3-4週間の短期集中で世界共通RYT200資格取得</li>
              <li>・ヨガ＋自然＋多国籍環境の特別体験</li>
              <li>・帰国後すぐヨガインストラクターとして就職可</li>
              <li>・社会人有給・転職の合間に挑戦しやすい</li>
              <li>・ライフスタイル変化、メンタル健康の習得</li>
              <li>・独立・副業の選択肢、生涯のスキル</li>
            </ul>
          </section>

          {/* 資格 */}
          <section id="certifications" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要資格（RYT200/500）</h2>
            <div className="space-y-3">
              {CERTIFICATIONS.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{c.cert}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>期間:</strong> {c.duration}</p>
                    <p><strong>費用:</strong> <span className="text-amber-700 font-bold">{c.cost}</span></p>
                    <p className="text-xs text-gray-500 mt-2">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 主要留学先 */}
          <section id="top-destinations" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要留学先5選</h2>
            <div className="space-y-3">
              {TOP_DESTINATIONS.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{d.place}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{d.feature}</p>
                  <p className="text-sm text-amber-700 font-bold">{d.cost}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用シミュレーション</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">渡航先・期間</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">学費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">生活費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">合計</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_SIMULATION.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.destination}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.tuition}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.living}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="短期留学・アート留学等の他選択肢も合わせて"
            description="ヨガ以外の専門留学、短期留学全般も視野に入れて検討を。"
            primaryHref="/short-term-study"
            primaryLabel="短期留学1-3ヶ月"
            secondaryHref="/wh-art-design"
            secondaryLabel="アート・デザイン留学"
          />

          {/* プログラム */}
          <section id="program-content" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">プログラム内容</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PROGRAM_CONTENT.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🧘</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 卒業後 */}
          <section id="after-graduation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">卒業後のキャリア</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {AFTER_GRAD.map((a, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">→</span>
                  <span>{a}</span>
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
                体験談 <strong>n={all.length}件</strong> から「ヨガ・瞑想・RYT」関連の言及を集計。
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
            ※ 費用は2026年5月時点の参考値です。最新情報は各スクール公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/short-term-study" className="text-primary-600 hover:underline">→ 短期留学1-3ヶ月</Link></li>
              <li><Link href="/wh-art-design" className="text-primary-600 hover:underline">→ アート・デザイン留学</Link></li>
              <li><Link href="/wh-volunteer" className="text-primary-600 hover:underline">→ 海外ボランティア</Link></li>
              <li><Link href="/wh-mental-health" className="text-primary-600 hover:underline">→ ワーホリのメンタルヘルス</Link></li>
              <li><Link href="/wh-online-business" className="text-primary-600 hover:underline">→ 海外オンラインビジネス</Link></li>
              <li><Link href="/wh-after-30-no-experience" className="text-primary-600 hover:underline">→ 30代社会人未経験WH</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
