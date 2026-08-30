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

const PAGE_PATH = '/wh-marriage-international';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '国際結婚完全ガイド｜ワーホリ・留学先での出会いから結婚・ビザ・文化差',
  description: 'ワーホリ・留学先での国際結婚の出会いから結婚までを完全解説。パートナービザ・婚姻手続き・文化差・成功する関係づくり・離婚リスクまで実例ベースで網羅。',
  path: PAGE_PATH,
  keywords: [
    '国際結婚',
    'ワーホリ 国際結婚',
    '留学 国際結婚',
    'パートナービザ',
    '海外 結婚 手続き',
    '国際結婚 ビザ',
  ],
});

const TOC_HEADINGS = [
  { id: 'reality', label: '国際結婚の現実（メリデメ）' },
  { id: 'meeting', label: '出会いから結婚までの一般的フロー' },
  { id: 'wedding-procedure', label: '結婚の法的手続き（国別）' },
  { id: 'partner-visa', label: 'パートナービザ取得' },
  { id: 'cultural-difference', label: '文化差を乗り越える5つの工夫' },
  { id: 'success-factors', label: '長続きする関係づくりのコツ' },
  { id: 'divorce-risk', label: '離婚リスクと対処法' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const PROS = [
  '2つの国・文化を行き来する豊かな人生',
  '子どもがバイリンガル・グローバル育ち',
  'パートナーの国でのPR・市民権取得ルート',
  '世界観・価値観が大きく広がる',
  '日本と海外の親族ネットワーク',
];

const CONS = [
  '文化差・言語の壁で誤解多',
  'どちらの国に住むかの選択（決断難）',
  '日本側親族の反対リスク（特に伝統的家庭）',
  'ビザ・法的手続きが煩雑',
  '離婚率は日本人同士より高い傾向',
];

const MEETING_FLOW = [
  { stage: '①出会い', detail: 'シェアハウス・職場・学校・パーティ・マッチングアプリ（Bumble・Hinge）' },
  { stage: '②デート（1-3ヶ月）', detail: 'カフェ・レストラン・週末旅行で相互理解、文化差確認' },
  { stage: '③真剣交際（3-12ヶ月）', detail: 'パートナーの家族・友人に紹介、長期的展望議論' },
  { stage: '④同棲（6-12ヶ月）', detail: '生活習慣・金銭感覚・家事分担の現実テスト' },
  { stage: '⑤婚約・結婚（同棲6-24ヶ月後）', detail: '結婚式・婚姻届・パートナービザ申請' },
  { stage: '⑥共同生活確立', detail: 'どちらの国に住むか、キャリア・家族計画決定' },
];

const WEDDING_BY_COUNTRY = [
  { country: 'オーストラリア', detail: '結婚許可申請（NOIM）→1ヶ月後挙式可、婚姻登録は地方政府' },
  { country: 'カナダ', detail: '州ごとに異なる、Marriage Licenseを州機関で取得→挙式' },
  { country: 'イギリス', detail: 'Notice of Marriage提出→28日待機→Civil Marriage挙式' },
  { country: 'アメリカ', detail: '州ごとに異なる、Marriage License→挙式→婚姻証明書' },
  { country: '日本', detail: '海外で結婚→在外日本大使館に婚姻届提出 or 日本市役所提出' },
];

const PARTNER_VISA_KEY = [
  '①現地国民・PR保持者と結婚 or 事実婚（12ヶ月以上）',
  '②関係性証明書類：共同生活・共通の経済・社会的承認の証拠',
  '③申請料：豪AUD 9,365、加CAD 1,365、英£1,538等',
  '④審査期間：申請から発給まで1-3年',
  '⑤一時ビザ→PRビザの2段階発給が一般的',
  '⑥結婚詐欺対策で審査厳格、関係性の真実証明必要',
];

const CULTURAL_TIPS = [
  '言語：パートナーの母国語を真剣に学ぶ意志（最低B1レベル）',
  '宗教・価値観：相互尊重、子どもの宗教教育を事前合意',
  '家族との関係：両家の親族訪問頻度・サポートを話し合う',
  '金銭感覚：貯金率・支出優先順位の擦り合わせ',
  '住む国：どちらに住むか、いつ移動するかを長期計画',
];

const SUCCESS_FACTORS = [
  '十分な交際期間（最低1-2年）＋同棲経験',
  '言語コミュニケーション能力（共通言語＋お互いの母国語学習）',
  '両家の親族・友人との関係構築',
  '金銭・キャリア・家族計画の事前合意',
  '困難時のサポートシステム（カウンセラー・コミュニティ）',
  '相互の文化・宗教・価値観への尊重',
];

const DIVORCE_NOTES = [
  '国際結婚の離婚率は日本人同士より高い（30-50%）',
  '主な離婚理由：文化差・コミュニケーション不足・住む国の対立',
  '子どもがいる場合のハーグ条約適用に注意',
  '離婚時のビザ・財産分与・親権が複雑',
  '結婚前の交際1-2年＋同棲が離婚率を大きく下げる',
];

const FAQS = [
  {
    question: 'ワーホリ中に出会って結婚は珍しい？',
    answer:
      '珍しくない。実際に多くのワーホリ生が現地パートナーと出会い、結婚に至っています。シェアハウス・職場・パーティ・マッチングアプリ等の出会いの機会多。ただ「ワーホリ恋愛＝勢い」と「真剣交際＝長期視点」を区別、最低1-2年の交際＋同棲経験を経てから結婚決断を。',
  },
  {
    question: 'パートナービザは絶対取れる？',
    answer:
      '関係性の真実性が認められれば取得可。①法的婚姻 or 12ヶ月以上の事実婚、②関係性証明書類（共同生活・経済・社会的承認）、③健康診断・身元証明等で審査。結婚詐欺対策で審査厳格、書類準備に半年以上かかることも。MARA等の登録移民弁護士相談推奨。',
  },
  {
    question: 'どちらの国に住む？',
    answer:
      '夫婦の最大の決断。①パートナーの母国（永住権前提）、②日本（パートナーが日本適応）、③第三国（共通の理想地）、④往復生活（時期で分ける）の4選択肢。キャリア・家族・子育て・親族介護等を10年スパンで考えて決定を。',
  },
  {
    question: '日本側親族の反対にどう対処？',
    answer:
      '①パートナーを日本訪問させて親族に会わせる、②文化・価値観の共通点を強調、③親の不安（言葉・将来）を1つずつ解消、④結婚後の親族交流計画提示。完全反対が緩むまで時間（半年-2年）必要。最終的には自分の人生の決断、と毅然と進む覚悟も。',
  },
  {
    question: '離婚率高いって本当？',
    answer:
      '統計的には日本人同士の婚姻より離婚率高（30-50% vs 25-30%）。理由は文化差・コミュニケーション不足・住む国の対立等。一方で「十分な交際期間＋同棲＋両家の理解」のある国際結婚カップルは長続きする例多。準備期間が離婚率を大きく下げます。',
  },
];

export default async function WhMarriageInternationalPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(結婚|国際結婚|パートナー|彼氏|彼女|交際)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(結婚|国際結婚|パートナー|彼氏|彼女|交際)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '国際結婚完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '国際結婚完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              国際結婚完全ガイド｜ワーホリ・留学先での出会い・結婚・ビザ・文化差
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ワーホリ・留学先でパートナーがいる方／国際結婚を視野に入れる方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリ・留学先で運命の人に出会い国際結婚するケースは増加中。一方で文化差・住む国・離婚率等の課題も。
              <br />
              この記事では出会いから結婚までのフロー、法的手続き、パートナービザ、文化差を乗り越える工夫、長続きする関係づくりまで実例ベースで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '最低1-2年の交際＋同棲経験が結婚決断の目安',
              'パートナービザ取得は関係性の真実性証明が鍵',
              '文化差・住む国・両家の理解を事前に擦り合わせる',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* リアル */}
          <section id="reality" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国際結婚の現実（メリデメ）</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-emerald-800">✓ メリット</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {PROS.map((p, i) => (
                    <li key={i} className="leading-relaxed">・{p}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-rose-800">✗ デメリット</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {CONS.map((c, i) => (
                    <li key={i} className="leading-relaxed">・{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* フロー */}
          <section id="meeting" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">出会いから結婚までの一般的フロー</h2>
            <div className="space-y-3">
              {MEETING_FLOW.map((m, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{m.stage}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{m.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 結婚手続き */}
          <section id="wedding-procedure" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">結婚の法的手続き（国別）</h2>
            <div className="space-y-3">
              {WEDDING_BY_COUNTRY.map((w, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{w.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{w.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="ワーホリでの出会い・カップルワーホリも合わせて"
            description="出会いの場、カップルでのワーホリ滞在も視野に入れて。"
            primaryHref="/wh-connections"
            primaryLabel="ワーホリでの出会い"
            secondaryHref="/couple-wh"
            secondaryLabel="カップルワーホリ"
          />

          {/* パートナービザ */}
          <section id="partner-visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">パートナービザ取得</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {PARTNER_VISA_KEY.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">💍</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 文化差 */}
          <section id="cultural-difference" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">文化差を乗り越える5つの工夫</h2>
            <div className="space-y-3">
              {CULTURAL_TIPS.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{i + 1}. {c.split('：')[0]}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.split('：')[1]}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 長続きするコツ */}
          <section id="success-factors" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">長続きする関係づくりのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SUCCESS_FACTORS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 離婚 */}
          <section id="divorce-risk" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">離婚リスクと対処法</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {DIVORCE_NOTES.map((d, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「結婚・パートナー・交際」関連の言及を集計。
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
            ※ 法的手続き・ビザ要件は2026年5月時点の情報です。最新情報は各国大使館・登録移民弁護士・国際結婚専門の法律家にご相談ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-connections" className="text-primary-600 hover:underline">→ ワーホリでの出会い</Link></li>
              <li><Link href="/couple-wh" className="text-primary-600 hover:underline">→ カップルワーホリ</Link></li>
              <li><Link href="/wh-after-wh-stay" className="text-primary-600 hover:underline">→ WH後の滞在延長</Link></li>
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/wh-female-safety" className="text-primary-600 hover:underline">→ 女性WH安全</Link></li>
              <li><Link href="/after-wh" className="text-primary-600 hover:underline">→ ワーホリ後の進路</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
