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

const PAGE_PATH = '/wh-snowboard-ski';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'スキー・スノボワーホリ完全ガイド｜カナダ・NZ・豪のスキー場仕事',
  description: 'スキー・スノボ留学＆ワーホリ完全ガイド。カナダ・NZ・豪・日本のスキー場仕事、リゾート寮、シーズン就労、リフトパス無料特典まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'スキー ワーホリ',
    'スノボ ワーホリ',
    'カナダ スキー場 仕事',
    'ウィスラー ワーホリ',
    'クイーンズタウン スキー',
    'スキー場 リゾートバイト',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-ski-snow', label: 'なぜスキー・スノボWHが人気か' },
  { id: 'top-resorts', label: '世界のおすすめスキーリゾート5選' },
  { id: 'job-types', label: 'スキー場の仕事10種類' },
  { id: 'salary-perks', label: '給与・福利厚生（リフトパス無料！）' },
  { id: 'season-timing', label: 'シーズン就労のタイミング' },
  { id: 'how-to-apply', label: '応募方法・採用フェア' },
  { id: 'life-resort', label: 'リゾート生活のリアル' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TOP_RESORTS = [
  {
    resort: 'ウィスラー（カナダ・BC州）',
    season: '12-4月（北半球）',
    feature: '世界最大級リゾート、日本人多、PRルートあり',
    salary: 'CAD 18-25/時＋リフトパス無料',
  },
  {
    resort: 'バンフ（カナダ・アルバータ州）',
    season: '11-5月',
    feature: '国立公園内、絶景、3つのスキー場連携',
    salary: 'CAD 17-23/時',
  },
  {
    resort: 'クイーンズタウン（NZ）',
    season: '6-10月（南半球）',
    feature: 'アクティビティ天国、英語環境◎',
    salary: 'NZD 23-30/時',
  },
  {
    resort: 'ペリッシャー（豪・NSW）',
    season: '6-10月（南半球）',
    feature: '豪WHV保持者多、ファームジョブ代替',
    salary: 'AUD 28-35/時',
  },
  {
    resort: 'ニセコ（日本）',
    season: '12-4月',
    feature: '世界的人気の日本スキー場、英語留学＋スキー',
    salary: '時給1,200-1,800円',
  },
];

const JOB_TYPES = [
  { type: 'リフトオペレーター', detail: 'リフト操作、英語最低限OK、初心者人気No.1' },
  { type: 'スキー・スノボインストラクター', detail: '資格必須（CSIA/CSCF等）、給与高め' },
  { type: 'スキーパトロール', detail: '医療・救助スキル必須、上級職' },
  { type: 'ホテル・ロッジ受付', detail: '英語必須、客対応スキル' },
  { type: 'レストラン・カフェ', detail: 'ホール・キッチン、シフト柔軟' },
  { type: 'ハウスキーピング', detail: '客室清掃、英語ほぼ不要、即採用多' },
  { type: 'スキー・スノボショップ', detail: 'レンタル・販売、用具知識有利' },
  { type: 'バスドライバー', detail: '大型免許必要、給与高、特殊スキル' },
  { type: 'スパ・マッサージ', detail: '資格者は高給、Wellness志向客向け' },
  { type: 'チャイルドケア（キッズプログラム）', detail: '子供スキースクール補助、ファミリー客対応' },
];

const SALARY_PERKS = [
  '時給：CAD 17-30/AUD 28-35/NZD 23-30、ローカル並み',
  'リフトパス無料：通常$1,500-3,000相当、最強特典',
  'スタッフ寮：週$150-300、相部屋、シーズン中限定',
  '食事補助：1日1-2食提供 or 50%割引のリゾート多',
  'スキー・スノボレッスン無料 or 割引',
  'シーズン後のボーナス（最後まで勤務）',
  'リゾート系列ホテル・施設の社員割引',
];

const SEASON_TIMING = [
  { hemisphere: '北半球シーズン', period: '11月-5月', resort: 'ウィスラー・バンフ・ニセコ・コロラド・スイス', apply: '採用は8-10月、面接ピーク9-10月' },
  { hemisphere: '南半球シーズン', period: '6月-10月', resort: 'クイーンズタウン・ペリッシャー・スレドボー', apply: '採用は3-5月、面接ピーク4-5月' },
  { hemisphere: '通年スキー（氷河）', period: '一部地域', resort: 'スイス・氷河スキー場', apply: '通年募集少数あり' },
];

const HOW_TO_APPLY = [
  '①各リゾート公式サイトの「Careers」「Jobs」ページから直接応募',
  '②スキー場ジョブフェア（オンライン・現地、シーズン前）参加',
  '③Cool Works（北米スキーリゾート専門求人サイト）登録',
  '④BackpackerJobBoard（豪・NZのリゾート求人）',
  '⑤Facebook groups「Ski Resort Jobs」「Whistler Jobs」等',
  '⑥日系エージェント（カナダ留学エージェント、サポート充実）',
];

const LIFE_RESORT = [
  '住居：スタッフ寮（相部屋・週$150-300）or シェアハウス',
  '食事：寮の食堂 or 自炊、リゾート内レストラン高め',
  '交通：リゾート内徒歩 or スタッフバス、車不要',
  '社交：世界中のスタッフと国際交流、毎晩パーティ多',
  '体力：スキー＋仕事＋夜遊びでハードだが楽しい',
  '英語：多国籍環境で英語急上昇、特に若者多',
];

const FAQS = [
  {
    question: 'スキー・スノボ初心者でも応募できる？',
    answer:
      'できる。リフトオペレーター・ハウスキーピング・レストラン等の職種はスキー経験不要。むしろ「自分も学びながら働きたい」モチベーションで採用される。シーズン中に滑り上達して翌シーズンインストラクターを目指すパターン多。',
  },
  {
    question: 'リフトパス無料の価値は？',
    answer:
      '通常$1,500-3,000相当の特典、これだけで給与換算で月$300-500プラス。スタッフは平日朝・夜の閉店前後の貸切時間に滑れる特権あり。シーズン中に100日以上滑る人も、コスパ最強の趣味＋仕事の組み合わせ。',
  },
  {
    question: 'シーズン後はどうする？',
    answer:
      'WHV保持者は他都市・他リゾートに移動して継続就労。北半球→南半球の二大陸滞在も可（豪WHV＋加IECで5月-10月豪、11月-4月加）。シーズン終了時のスタッフボーナス＋次の仕事準備期間として活用。',
  },
  {
    question: '採用面接はどう進む？',
    answer:
      'オンライン面接が主流、Zoom/Skype 20-30分。英語面接、志望動機・スキル・シフト柔軟性・チームワーク質問。スキーリゾートはチームワーク重視、明るく前向きな態度がアピールポイント。応募は早めに（シーズン3-4ヶ月前）。',
  },
  {
    question: 'インストラクター資格は取れる？',
    answer:
      '取れる。カナダはCSIA（スキー）、CSCF（スノボ）の資格取得コースが多数あり、Level 1で1-2週間・$1,500-2,500。資格取得後はインストラクター職に応募可、時給CAD 25-40＋指導料収入で高単価。日本帰国後もスキー場で活かせる。',
  },
];

export default async function WhSnowboardSkiPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(スキー|スノボ|スノーボード|ウィスラー|リゾート|snow|ski)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(スキー|スノボ|スノーボード|ウィスラー|リゾート|snow|ski)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'スキー・スノボワーホリ完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'スキー・スノボワーホリ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              スキー・スノボワーホリ完全ガイド｜カナダ・NZ・豪のスキー場仕事
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="スキー・スノボ好きでWH/留学を検討する方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              スキー・スノボ＋WHの組み合わせは、趣味と仕事と海外生活を同時に楽しめる最強のライフスタイル。リフトパス無料＋スタッフ寮＋多国籍仲間と毎日滑る最高の時間。
              <br />
              この記事では世界のおすすめリゾート、職種、給与・福利厚生、応募方法、リゾート生活まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'リフトパス無料（$1,500-3,000相当）＋スタッフ寮＋食事補助',
              '初心者でもリフトオペ・接客で採用、シーズン中に上達可',
              '北半球（11-4月）＋南半球（6-10月）でほぼ通年滑れる',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-ski-snow" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜスキー・スノボWHが人気か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・リフトパス無料、シーズン中100日滑れる</li>
              <li>・スタッフ寮提供で住居費激減</li>
              <li>・多国籍スタッフで英語環境◎、24時間英語</li>
              <li>・絶景の山岳リゾートで生活、SNS映え◎</li>
              <li>・初心者でも採用、シーズン中に上達可</li>
              <li>・シーズン後はインストラクター資格でキャリア化可</li>
            </ul>
          </section>

          {/* トップリゾート */}
          <section id="top-resorts" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">世界のおすすめスキーリゾート5選</h2>
            <div className="space-y-3">
              {TOP_RESORTS.map((r, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{r.resort}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>シーズン:</strong> {r.season}</p>
                    <p><strong>給与:</strong> <span className="text-amber-700 font-bold">{r.salary}</span></p>
                    <p className="text-xs text-gray-500 mt-2">{r.feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 職種 */}
          <section id="job-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">スキー場の仕事10種類</h2>
            <div className="space-y-3">
              {JOB_TYPES.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{j.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{j.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 給与福利 */}
          <section id="salary-perks" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">給与・福利厚生（リフトパス無料！）</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SALARY_PERKS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">⛷️</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="カナダIEC・NZ語学留学も合わせて"
            description="スキー場WHには対応国のビザ取得が前提、関連情報も確認を。"
            primaryHref="/canada-iec-visa"
            primaryLabel="カナダIECビザ"
            secondaryHref="/nz-language-school"
            secondaryLabel="NZ語学留学"
          />

          {/* シーズン */}
          <section id="season-timing" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">シーズン就労のタイミング</h2>
            <div className="space-y-3">
              {SEASON_TIMING.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{s.hemisphere}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>期間:</strong> {s.period}</p>
                    <p><strong>主要リゾート:</strong> {s.resort}</p>
                    <p className="text-xs text-gray-500"><strong>応募:</strong> {s.apply}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 応募 */}
          <section id="how-to-apply" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募方法・採用フェア</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {HOW_TO_APPLY.map((h, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* リゾート生活 */}
          <section id="life-resort" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">リゾート生活のリアル</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {LIFE_RESORT.map((l, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">🏔️</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「スキー・スノボ・リゾート」関連の言及を集計。
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
            ※ 給与・福利厚生は2026年5月時点の参考値です。最新情報は各リゾート公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ</Link></li>
              <li><Link href="/nz-language-school" className="text-primary-600 hover:underline">→ NZ語学留学</Link></li>
              <li><Link href="/vancouver-language-school" className="text-primary-600 hover:underline">→ バンクーバー語学学校</Link></li>
              <li><Link href="/au-rural-job" className="text-primary-600 hover:underline">→ 豪リージョナル仕事</Link></li>
              <li><Link href="/wh-connections" className="text-primary-600 hover:underline">→ ワーホリでの出会い</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
