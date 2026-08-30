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

const PAGE_PATH = '/wh-volunteer';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外ボランティア完全ガイド｜WHV/学生で参加・種類・応募・キャリア活用',
  description: 'ワーホリ・留学中の海外ボランティア完全解説。WWOOF・HelpX・Workaway・NGOボランティア等の種類、応募方法、メリット、キャリア活用までを実例で網羅。',
  path: PAGE_PATH,
  keywords: [
    '海外 ボランティア',
    'WWOOF',
    'HelpX',
    'Workaway',
    'ワーホリ ボランティア',
    '海外 NGO ボランティア',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-volunteer', label: 'なぜ海外ボランティアに参加するか' },
  { id: 'types', label: 'ボランティアの種類4選' },
  { id: 'wwoof', label: 'WWOOF（有機農業）詳細' },
  { id: 'helpx-workaway', label: 'HelpX・Workaway詳細' },
  { id: 'ngo-volunteer', label: 'NGO・国際機関ボランティア' },
  { id: 'how-to-apply', label: '応募〜参加までの流れ' },
  { id: 'after-volunteer', label: 'キャリア活用とその後' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TYPES = [
  {
    type: '①WWOOF（World Wide Opportunities on Organic Farms）',
    detail: '有機農場で1日4-6時間労働、宿泊＋食事提供',
    cost: '年会費約NZD 40 / AUD 70',
    period: '1週間〜数ヶ月',
  },
  {
    type: '②HelpX',
    detail: '農場・ホステル・家庭で労働＋宿泊＋食事',
    cost: '年会費€20',
    period: '1週間〜数ヶ月',
  },
  {
    type: '③Workaway',
    detail: '世界中の家庭・施設で多様な労働、最も汎用的',
    cost: '年会費€44',
    period: '1週間〜1年',
  },
  {
    type: '④NGO・国際機関ボランティア',
    detail: '環境・社会・教育系のNGO団体での専門ボランティア',
    cost: '無料〜数千ドル',
    period: '1ヶ月〜1年',
  },
];

const WWOOF_DETAIL = [
  '1日4-6時間の農作業（野菜収穫・除草・動物世話等）',
  '対価として宿泊＋食事（3食）提供、給与なし',
  '世界中の有機農場ネットワーク（豪・NZ・カナダ・欧州・南米等）',
  '年会費約NZD 40 / AUD 70で会員登録',
  '農場主との直接交渉、1週間〜数ヶ月の柔軟な滞在',
  '自然体験＋ローカル文化体験＋英語環境',
  '注意点：労働ビザではないため、滞在期間中の正規労働ではない（豪のセカンドビザ条件には不可）',
];

const HELPX_WORKAWAY = [
  { service: 'HelpX', focus: '農場・ホステル中心、欧米豪に強み', cost: '€20/2年', usage: '個人ホスト多、英語必須' },
  { service: 'Workaway', focus: '家庭・施設・学校・NGO等多様', cost: '€44/年', usage: '世界中の機会、Workaway+でビザサポートも' },
];

const NGO_OPTIONS = [
  '環境系：オーストラリアのコアラ保護、コスタリカのウミガメ保護',
  '社会系：南アフリカのスラム支援、インドの孤児院',
  '教育系：東南アジアの英語教師ボランティア',
  '災害復旧：自然災害被災地での復旧支援',
  '医療系：医療系学生・有資格者向け医療ミッション',
  '国際機関：UN Volunteers（有資格者・経験者向け）',
];

const APPLY_FLOW = [
  { step: 1, title: 'サービス登録・年会費支払い', detail: 'WWOOF/HelpX/Workaway等の公式サイトでアカウント作成' },
  { step: 2, title: 'プロフィール作成', detail: '自己紹介・スキル・希望期間・希望地域を英語で記載' },
  { step: 3, title: 'ホスト探し・連絡', detail: 'キーワード・地域で検索、興味のあるホストにメッセージ' },
  { step: 4, title: '面接（ビデオ通話）', detail: '相互理解のためのビデオ通話、期間・労働内容・住居確認' },
  { step: 5, title: '到着・参加開始', detail: '指定日に到着、最初の数日で慣れる、契約期間内勤務' },
];

const CAREER_USE = [
  '英語ビジネスシーンで「ボランティア経験」アピール',
  '社会貢献意識を示すエピソードとして履歴書映え',
  'グローバル人脈構築（ホスト・他ボランティアとの繋がり）',
  '帰国後のNGO・社会的企業就職へのルート',
  '人生観・価値観の変化、キャリア再考のきっかけ',
  '海外ボランティアから自分でNPO立ち上げの実例も',
];

const FAQS = [
  {
    question: 'WWOOFは仕事？それともボランティア？',
    answer:
      'ボランティア。労働の対価として宿泊＋食事を提供される「フェアエクスチェンジ」関係。給与は支給されません。豪のセカンドビザの「Specified Work」には該当しないため、ワーホリ延長目的なら別途有給労働が必要。純粋に「文化体験＋節約滞在」目的。',
  },
  {
    question: 'HelpXとWorkawayどっちがいい？',
    answer:
      'HelpXは農場・ホステル中心、欧米豪に強み。Workawayは家庭・施設・NGO等多様で世界中。費用はHelpX€20/2年、Workaway€44/年。両方登録するワーホリ生も多い。Workawayの方が機会数多く、初心者向け。',
  },
  {
    question: 'ビザは何が必要？',
    answer:
      '渡航国による。WHV保持者はOK、観光ビザでもボランティア可（無給のため）。ただし英国・米国等は「労働」と見なされる場合あり、Visitor Visaで明示的にボランティア許可されているか要確認。豪・加・NZは観光ビザでも問題なし。',
  },
  {
    question: 'NGOボランティアは経験ないと難しい？',
    answer:
      'NGO・国際機関ボランティア（UN Volunteer等）は専門スキル・職歴必須。一方、現地NGOの現場ボランティア（孤児院・環境保全等）は経験不要、参加費（数千〜数万ドル）支払うことで参加可能なケース多。両方ニーズあり。',
  },
  {
    question: 'ホストとトラブルがあったら？',
    answer:
      'WWOOF/HelpX/Workawayの公式サポート利用＋次のホスト探し。事前にレビュー確認、ビデオ通話で人柄チェックが重要。荷物を持って速やかに退去、必要なら警察・大使館に相談。「合わない時は無理しない」のが鉄則。',
  },
];

export default async function WhVolunteerPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(ボランティア|WWOOF|Workaway|HelpX|volunteer|NGO)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(ボランティア|WWOOF|Workaway|HelpX|volunteer|NGO)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外ボランティア完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外ボランティア完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外ボランティア完全ガイド｜WHV/学生で参加・種類・応募・キャリア活用
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="ワーホリ・留学中にボランティア参加したい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリ・留学中の海外ボランティアは、生活費節約＋ローカル文化体験＋英語環境＋人脈構築＋キャリア活用の一石五鳥。
              <br />
              この記事ではWWOOF・HelpX・Workaway・NGOボランティア等の種類、応募方法、メリット、キャリア活用までを実例で完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'WWOOF・Workawayは年€20-44で世界中の機会にアクセス',
              '宿泊＋食事提供で生活費激減、ローカル文化体験◎',
              '帰国後のキャリア・社会貢献マインドに大きな影響',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-volunteer" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ海外ボランティアに参加するか</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・宿泊＋食事提供で生活費を激減</li>
              <li>・ローカル家庭・農場での文化体験</li>
              <li>・24時間英語環境＋深い人間関係</li>
              <li>・社会貢献意識＋人生観の変化</li>
              <li>・グローバル人脈構築</li>
              <li>・履歴書映え、転職市場での差別化要素</li>
              <li>・WHV終了後の「次のステップ模索期間」として活用</li>
            </ul>
          </section>

          {/* 種類 */}
          <section id="types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ボランティアの種類4選</h2>
            <div className="space-y-3">
              {TYPES.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{t.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{t.detail}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                    <p><strong>費用:</strong> {t.cost}</p>
                    <p><strong>期間:</strong> {t.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* WWOOF */}
          <section id="wwoof" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">WWOOF（有機農業）詳細</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {WWOOF_DETAIL.map((d, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🌾</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* HelpX/Workaway */}
          <section id="helpx-workaway" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">HelpX・Workaway詳細</h2>
            <div className="space-y-3">
              {HELPX_WORKAWAY.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{s.service}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-1"><strong>フォーカス:</strong> {s.focus}</p>
                  <p className="text-sm text-amber-700 font-bold mb-1">{s.cost}</p>
                  <p className="text-xs text-gray-500">{s.usage}</p>
                </div>
              ))}
            </div>
          </section>

          {/* NGO */}
          <section id="ngo-volunteer" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">NGO・国際機関ボランティア</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {NGO_OPTIONS.map((n, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">🌍</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他のWH中アクティビティも合わせて"
            description="インターンシップ・欧州周遊等、WH中の充実プランも検討を。"
            primaryHref="/wh-internship"
            primaryLabel="海外インターンシップ"
            secondaryHref="/europe-budget-travel"
            secondaryLabel="欧州周遊予算術"
          />

          {/* 応募フロー */}
          <section id="how-to-apply" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募〜参加までの流れ</h2>
            <div className="space-y-3">
              {APPLY_FLOW.map((f) => (
                <div key={f.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {f.step}: {f.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{f.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* キャリア活用 */}
          <section id="after-volunteer" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">キャリア活用とその後</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {CAREER_USE.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「ボランティア・WWOOF・Workaway」関連の言及を集計。
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
            ※ 年会費・参加費は2026年5月時点の情報です。最新情報は各サービス公式情報、ビザ要件は各国移民局でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-internship" className="text-primary-600 hover:underline">→ 海外インターンシップ</Link></li>
              <li><Link href="/europe-budget-travel" className="text-primary-600 hover:underline">→ 欧州周遊予算術</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術</Link></li>
              <li><Link href="/wh-connections" className="text-primary-600 hover:underline">→ ワーホリでの出会い</Link></li>
              <li><Link href="/australia-farm-job" className="text-primary-600 hover:underline">→ オーストラリアファームジョブ</Link></li>
              <li><Link href="/after-wh" className="text-primary-600 hover:underline">→ ワーホリ後の進路</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
