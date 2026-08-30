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

const PAGE_PATH = '/uk-yms-lottery-tips';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'UK YMS抽選 当選のコツ完全ガイド｜応募タイミング・倍率・再応募戦略',
  description: 'イギリスYMSビザは抽選式。年2回の応募タイミング、当選倍率、応募手順、不当選後の再応募戦略、代替プランまで実例ベースで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'UK YMS 抽選',
    'YMS 当選',
    'YMS 倍率',
    'イギリス ワーホリ 抽選',
    'UK YMS 応募 コツ',
    'YMS 再応募',
  ],
});

const TOC_HEADINGS = [
  { id: 'lottery-overview', label: 'YMS抽選の仕組み（年2回・上限1,500人）' },
  { id: 'when-to-apply', label: '応募タイミング（1月・7月）' },
  { id: 'how-to-apply', label: '応募手順5ステップ' },
  { id: 'rate', label: '当選率と倍率の実態' },
  { id: 'tips', label: '当選率を上げる7つのコツ' },
  { id: 'after-lose', label: '不当選後の選択肢' },
  { id: 'alternative', label: 'YMS以外でUKに住む方法' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const APPLY_STEPS = [
  { step: 1, title: 'GOV.UK公式サイトで応募', detail: '応募開始日時の14時（GMT）からアクセス。サーバー混雑覚悟' },
  { step: 2, title: '個人情報・パスポート番号入力', detail: '氏名・生年月日・パスポート番号・連絡先' },
  { step: 3, title: '応募完了→当選通知を待つ', detail: '応募から1〜2週間で当選/不当選メール' },
  { step: 4, title: '当選後3ヶ月以内にビザ申請', detail: 'IHS（健康保険料£940）＋ビザ申請料£298支払い' },
  { step: 5, title: '生体認証・書類提出→ビザ発行', detail: '所要3-4週間、UK滞在開始可' },
];

const TIPS = [
  '応募開始時刻14時（日本時間23時/0時）にアクセス、回線速度準備',
  '事前にGOV.UKアカウント作成、パスポート・写真をスキャン済み',
  '応募フォームを事前にプレビューで確認、入力時間短縮',
  '複数デバイス（PC＋スマホ）で同時アクセス（1回のみ応募可）',
  '年齢制限（18-30歳）の30歳到達ギリギリは応募できない月もあるため早めに',
  '応募月（1月/7月）の半年前から準備、貯金£2,530の用意',
  '不当選なら次回の7月/1月に必ず再応募、複数回応募で当選率UP',
];

const ALTERNATIVES = [
  { option: 'Student Visa（学生ビザ）', detail: '英語学校・大学・専門学校に入学。週20時間就労可、6ヶ月超ならIHS必要' },
  { option: 'Short-term Study Visa', detail: '11ヶ月までの英語学校短期留学。労働不可' },
  { option: 'Skilled Worker Visa', detail: '雇用主スポンサー付き、年収£26,200以上必要。職種限定' },
  { option: 'Graduate Visa', detail: '英大学卒業者は2年（修士は3年）就労可' },
  { option: 'Ancestry Visa', detail: '英国籍祖父母を持つ場合、5年滞在＋就労可' },
];

const FAQS = [
  {
    question: 'YMSの当選倍率はどれくらい？',
    answer:
      '年により異なりますが、近年は応募者数約4,000〜6,000人に対し当選1,500人で、倍率約2.5〜4倍。1月応募回（1,000枠）と7月応募回（500枠）に分かれており、7月回の方が倍率高め。一発当選は約3割の確率と覚悟して、再応募を計画的に。',
  },
  {
    question: '応募手数料はかかる？',
    answer:
      '応募は無料。当選後にビザ申請料£298＋IHS（健康保険料）£940/年（年単位）が必要。2年分滞在の場合IHS£1,880。応募から滞在開始まで合計約£2,500〜3,000の費用、加えて貯金証明£2,530必要。',
  },
  {
    question: '1回の応募で複数枠申し込める？',
    answer:
      '1人につき1回のみ応募可。複数アカウント・複数応募は失格になります。家族・友人と「みんなで応募」して当選率を上げるのは可能ですが、自分自身は1回限り。',
  },
  {
    question: '年齢制限はある？',
    answer:
      '応募時に18-30歳。応募時点の年齢が基準なので、31歳の誕生日前に応募できれば問題なし。応募回（1月/7月）と誕生日のタイミングを逆算して計画を立てましょう。',
  },
  {
    question: '当選後、いつまでに渡英すべき？',
    answer:
      '当選後3ヶ月以内にビザ申請、ビザ発行後6ヶ月以内に渡英必須。総じて当選から1年以内には現地入りするスケジュール。社会人が応募する場合は退職タイミングを当選後3〜6ヶ月後に設計すると無理がない。',
  },
];

export default async function UkYmsLotteryTipsPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ukExperiences = all.filter((e) => e.country?.id === 'united-kingdom');
  const mentions = countMentions(all, /(YMS|イギリス|UK|ロンドン|抽選)/);
  const sample = ukExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(YMS|イギリス|UK|ロンドン|抽選|ビザ)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'UK YMS抽選 当選のコツ完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'UK YMS抽選 当選のコツ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              UK YMS抽選 当選のコツ完全ガイド｜応募タイミング・倍率・再応募戦略
            </h1>
            <ArticleMetaBadge
              readingMinutes={8}
              updatedAt="2026年5月"
              targetAudience="UK YMSビザ応募予定の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              イギリスのYMS（Youth Mobility Scheme）は年1,500人限定の抽選式ビザ。倍率約2.5〜4倍で、一発当選は約3割。
              <br />
              この記事では応募タイミング、応募手順、当選率を上げるコツ、不当選後の再応募戦略、代替プランまで実用情報を完全解説。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '年2回応募（1月1,000枠＋7月500枠）、倍率約2.5〜4倍',
              '応募時刻14時（GMT）の0時開始にアクセス必須',
              '不当選でも次回再応募で当選率UP、3回応募で約7割当選',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 仕組み */}
          <section id="lottery-overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">YMS抽選の仕組み（年2回・上限1,500人）</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              UK YMSは英国内務省（Home Office）が年2回開催する抽選式ビザ。日本国籍者には毎年合計1,500枠が割り当てられています。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・1月応募回：1,000枠（半数以上の枠）</p>
              <p>・7月応募回：500枠（次年向け）</p>
              <p>・年齢制限：18-30歳（応募時点）</p>
              <p>・滞在期間：最大2年</p>
              <p>・貯金証明：£2,530以上</p>
              <p>・配偶者/子の同伴：可能（別途応募）</p>
            </div>
          </section>

          {/* タイミング */}
          <section id="when-to-apply" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募タイミング（1月・7月）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              応募は2日間限定で受付。応募者数が枠を超えた場合、抽選になります。
            </p>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-1 text-primary-700">1月応募回（1,000枠）</p>
                <p className="text-sm text-gray-700 leading-relaxed">毎年1月中旬の指定2日間。当年7月以降の渡英向け。倍率約2.5〜3倍</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-1 text-primary-700">7月応募回（500枠）</p>
                <p className="text-sm text-gray-700 leading-relaxed">毎年7月中旬の指定2日間。翌年1月以降の渡英向け。倍率約3〜4倍</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 正確な応募日時はGOV.UK公式アナウンスで毎年告知されるため、必ず最新情報を確認。
            </p>
          </section>

          {/* 応募手順 */}
          <section id="how-to-apply" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募手順5ステップ</h2>
            <div className="space-y-3">
              {APPLY_STEPS.map((s) => (
                <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {s.step}: {s.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="UK YMSビザの全体像も合わせて"
            description="ビザ手続き全体・必要費用・滞在準備まで網羅したガイド。"
            primaryHref="/uk-yms-visa-guide"
            primaryLabel="UK YMSビザ完全ガイド"
            secondaryHref="/agent-comparison"
            secondaryLabel="エージェント必要？"
          />

          {/* 当選率 */}
          <section id="rate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">当選率と倍率の実態</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">応募回</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">枠</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">推定応募者</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">推定倍率</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-3 py-2">1月応募回</td>
                    <td className="border border-gray-200 px-3 py-2">1,000枠</td>
                    <td className="border border-gray-200 px-3 py-2">約2,500〜3,000人</td>
                    <td className="border border-gray-200 px-3 py-2 text-primary-700">2.5〜3倍</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-3 py-2">7月応募回</td>
                    <td className="border border-gray-200 px-3 py-2">500枠</td>
                    <td className="border border-gray-200 px-3 py-2">約1,500〜2,000人</td>
                    <td className="border border-gray-200 px-3 py-2 text-primary-700">3〜4倍</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 公式倍率発表はない。SNS応募者数集計・代理店データを参考に推定。年により変動あり。
            </p>
          </section>

          {/* 当選コツ */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">当選率を上げる7つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 不当選後 */}
          <section id="after-lose" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">不当選後の選択肢</h2>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 space-y-3 text-sm text-gray-800">
              <p className="leading-relaxed">
                <strong>選択肢1: 次回応募回を待って再応募</strong>
                <br />
                1月落選→7月応募、7月落選→翌年1月応募。30歳になる前まで諦めずに再応募。3回挑戦で当選率約7割。
              </p>
              <p className="leading-relaxed">
                <strong>選択肢2: 別ビザでイギリス入国</strong>
                <br />
                Student Visa（語学学校）・Short-term Study Visa等で6-11ヶ月先に渡英。後述代替プラン参照。
              </p>
              <p className="leading-relaxed">
                <strong>選択肢3: 渡航先変更</strong>
                <br />
                オーストラリア・カナダ・ニュージーランドは抽選なし。同時並行で準備すると保険になる。
              </p>
            </div>
          </section>

          {/* 代替プラン */}
          <section id="alternative" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">YMS以外でUKに住む方法</h2>
            <div className="space-y-3">
              {ALTERNATIVES.map((a, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{a.option}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{a.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                イギリス渡航者の体験談 <strong>n={ukExperiences.length}件</strong>。
                YMS・ビザ関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ ビザ要件・応募スケジュール・倍率データは2026年5月時点の情報です。最新の応募日時・ルールは GOV.UK 公式（gov.uk/youth-mobility）で必ず確認を。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/uk-yms-visa-guide" className="text-primary-600 hover:underline">→ UK YMSビザ完全ガイド</Link></li>
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ</Link></li>
              <li><Link href="/agent-comparison" className="text-primary-600 hover:underline">→ エージェント必要？</Link></li>
              <li><Link href="/countries/united-kingdom" className="text-primary-600 hover:underline">→ イギリス国別ガイド</Link></li>
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト</Link></li>
              <li><Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">→ 不安解消ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
