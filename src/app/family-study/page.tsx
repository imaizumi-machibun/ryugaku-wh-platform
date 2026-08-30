import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import MidCTA from '@/components/article/MidCTA';
import ServiceHubLink from '@/components/affiliate/ServiceHubLink';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '親子留学完全ガイド｜子連れで行ける国・費用・学校の選び方【2026年版】',
  description: '子連れで親子留学を実現するための完全ガイド。子供と一緒に行けるおすすめ国、必要な費用、子供向けプログラム対応校の選び方、親と子のビザ手続き、滞在中のスケジュール例まで解説。',
  path: '/family-study',
  keywords: [
    '親子留学',
    '子連れ 留学',
    '子供 と 留学',
    '親子留学 費用',
    '親子留学 おすすめ 国',
    'ママ 留学',
    '幼児 留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '親子留学とは？ワーホリとの違い' },
  { id: 'countries', label: 'おすすめ国5選' },
  { id: 'cost', label: '費用の目安' },
  { id: 'school', label: '学校選びの3つのポイント' },
  { id: 'visa', label: 'ビザの種類と親のステータス' },
  { id: 'schedule', label: '1日のスケジュール例' },
  { id: 'faq', label: 'よくある質問' },
];

const COUNTRIES = [
  {
    flag: '🇲🇾',
    name: 'マレーシア',
    reason: '物価が安く治安も良好。日本食材が手に入りやすく、子供を連れた日本人家族のコミュニティが大きい。',
    cost: '月25〜35万円（親子）',
    schoolFee: '子供インター校 月8〜15万円',
  },
  {
    flag: '🇨🇦',
    name: 'カナダ',
    reason: '英語圏で治安最高クラス。多文化社会で子供への偏見が少ない。バンクーバー・トロントが定番。',
    cost: '月40〜60万円（親子）',
    schoolFee: '子供 公立校 無料〜（条件あり）',
  },
  {
    flag: '🇦🇺',
    name: 'オーストラリア',
    reason: '気候が穏やかで子育てしやすい。シドニー・メルボルンに日本人家族コミュニティあり。',
    cost: '月45〜65万円（親子）',
    schoolFee: '子供 月15〜30万円（私立）',
  },
  {
    flag: '🇳🇿',
    name: 'ニュージーランド',
    reason: '自然豊かで子育てに最適。学校教育の質が高く、英語圏でも費用控えめ。',
    cost: '月35〜50万円（親子）',
    schoolFee: '子供 月10〜25万円',
  },
  {
    flag: '🇵🇭',
    name: 'フィリピン（セブ・マニラ）',
    reason: '物価最安。マンツーマン英語授業で子供の英語が伸びる。短期1〜3ヶ月が定番。',
    cost: '月25〜40万円（親子）',
    schoolFee: '親子留学プランあり 月20〜35万円',
  },
];

const SCHOOL_TIPS = [
  {
    title: '子供向けプログラムの有無',
    detail: '幼児向け（3〜6歳）、児童向け（7〜12歳）、ティーン向け（13歳〜）で対応校が異なる。事前に年齢別プログラムを確認。',
  },
  {
    title: '親子で同時通学できるか',
    detail: '親は午前、子供は午後など時間帯がずれる学校が便利。送迎の手間を最小化できる。',
  },
  {
    title: '送迎・ナニーサービス',
    detail: '学校の送迎バスや、英語ネイティブのナニー（保育サービス）が利用できるかチェック。フィリピンでは比較的安価。',
  },
];

const VISA_TYPES = [
  {
    type: '親: 学生ビザ + 子: 保護者同行ビザ',
    detail: '親が長期で学校に通う場合の定番。子供は親と同じ期間滞在可。学校が子供のビザ申請をサポートしてくれる場合あり。',
  },
  {
    type: '親: 観光ビザ + 子: 観光ビザ',
    detail: '3ヶ月以内の短期留学なら観光ビザで対応可。語学学校に通うことは可能（フルタイム不可な国もあるので要確認）。',
  },
  {
    type: '親: ワーホリビザ + 子: 同行ビザ',
    detail: 'カナダなど一部の国では、ワーホリビザ保有者の同行家族向けビザを発行。子連れワーホリも可能。',
  },
];

const SCHEDULE_EXAMPLE = [
  { time: '07:00', activity: '親子で朝食・登校準備' },
  { time: '08:30', activity: '子供を学校・幼稚園へ送る' },
  { time: '09:00〜13:00', activity: '親は語学学校（マンツーマンや小グループ）' },
  { time: '13:00', activity: '子供をピックアップ・親子でランチ' },
  { time: '14:00〜17:00', activity: '子供の宿題・親は自己学習 or 観光' },
  { time: '18:00', activity: '夕食' },
  { time: '20:00', activity: '親子で映画・読書・就寝準備' },
];

const FAQS = [
  {
    question: '何歳から親子留学できますか？',
    answer:
      '0歳から可能ですが、現実的には3歳以上が一般的。3歳未満は子供向けプログラムの選択肢が限られるため、ナニーサービスや保育園併設の学校を探すことになります。小学生（7〜12歳）が最も選択肢が豊富。',
  },
  {
    question: '親子留学の最短期間と最長期間は？',
    answer:
      '最短は1週間、最長は1年以上の長期も可能。短期（1〜4週間）はサマースクール、中期（1〜3ヶ月）が最も人気、長期（半年〜1年）は親が学生ビザを取得して子供は同行ビザというパターン。',
  },
  {
    question: '夫を日本に置いて、母と子だけで行けますか？',
    answer:
      '可能です。実際に「母＋子」のパターンが親子留学では最も多いです。父親は日本で仕事を続けて、夏休みや年末年始に合流するスタイル。離婚を疑われる心配はありません（よくある質問なので）。',
  },
  {
    question: '子供は学校生活についていけますか？',
    answer:
      '最初の2〜4週間は戸惑うことが多いですが、子供は適応力が高いので3ヶ月もすれば現地の友達ができます。ESL（英語が母語でない子供向けクラス）が充実している国・学校を選ぶと安心。',
  },
  {
    question: 'ワーホリと親子留学はどっちがいい？',
    answer:
      '親が30歳以下で子供を連れて行きたいなら、ワーホリビザ＋同行家族ビザのパターンが費用面で有利。30代以上、または子供の教育を最優先したいなら、親子留学（親が学生ビザ＋子供が保護者同行）が定番です。',
  },
];

export default function FamilyStudyPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '親子留学完全ガイド', url: '/family-study' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '親子留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              親子留学完全ガイド｜子連れで行ける国・費用・学校の選び方
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="子連れで留学を検討中のママ・パパ"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「子供と一緒に海外で英語環境に身を置きたい」「子供のインターナショナル体験を作りたい」
              <br />
              親子留学は、ここ数年で家族でできるライフチェンジ体験として注目されています。
              <br />
              この記事では、おすすめ国・費用・学校選び・ビザ手続き・1日のスケジュールまで、はじめての親子留学に必要な情報を全部まとめました。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '親子留学に向いている5カ国（マレーシア・カナダ・豪・NZ・フィリピン）の費用比較',
              '学校選びの3つのポイント（子供向けプログラム・同時通学・送迎）',
              'ビザの3パターンと家族構成別の選び方',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 概要 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">親子留学とは？ワーホリとの違い</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              親子留学は「親と子供が同時に海外で学ぶスタイル」のこと。親は語学学校に通い、子供は現地校や子供向け語学プログラムに通います。
            </p>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              ワーホリと違い、年齢制限がありません（ワーホリは30〜35歳まで）。30代以上のママ・パパが多く、短期1〜3ヶ月のスタイルが人気です。
            </p>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
              <p className="text-sm text-sky-900 leading-relaxed">
                <strong>💡 親子留学が選ばれる理由</strong>: (1) 子供への英語環境提供、(2) 家族のライフチェンジ体験、(3) 親自身の英語学習、(4) 日本社会から離れて子育てを見直す機会、の4点が定番。
              </p>
            </div>
          </section>

          {/* おすすめ国 */}
          <section id="countries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">おすすめ国5選</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              親子留学の人気5カ国を、費用・特徴・学校料金で比較しました。
            </p>
            <div className="space-y-3">
              {COUNTRIES.map((c) => (
                <div key={c.name} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg">
                    <span aria-hidden="true">{c.flag}</span> {c.name}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{c.reason}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-amber-50 text-amber-800 font-semibold px-2 py-1 rounded">
                      💰 親子費用: {c.cost}
                    </span>
                    <span className="bg-sky-50 text-sky-800 font-semibold px-2 py-1 rounded">
                      🏫 学校: {c.schoolFee}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="国別の生活費・治安を比較したい方へ"
            description="9カ国の費用・治安・稼ぎやすさを横並びで比較できます。"
            primaryHref="/compare/countries"
            primaryLabel="国別比較ランキング"
            secondaryHref="/budget"
            secondaryLabel="予算別プラン"
          />

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用の目安</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              親子留学の費用は「親の語学学校代＋子供の教育費＋親子の生活費＋航空券」の合算。3ヶ月で総額150〜300万円が目安です。
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-bold mb-3">3ヶ月親子留学の費用内訳（オーストラリア・親子2人の場合）</p>
              <ul className="text-sm text-gray-800 space-y-2">
                <li>・親の語学学校（3ヶ月）: 30〜50万円</li>
                <li>・子供のインター校 or プログラム（3ヶ月）: 45〜90万円</li>
                <li>・親子の住居（3ヶ月、シェア or 家族向けホームステイ）: 60〜90万円</li>
                <li>・食費（3ヶ月、親子2人）: 30〜50万円</li>
                <li>・航空券（往復、親子2人）: 30〜50万円</li>
                <li>・保険・雑費: 15〜25万円</li>
                <li className="pt-2 font-bold border-t border-gray-300">合計: 210〜355万円</li>
              </ul>
            </div>
          </section>

          {/* 学校選び */}
          <section id="school" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">学校選びの3つのポイント</h2>
            <div className="space-y-3">
              {SCHOOL_TIPS.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base">{t.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{t.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <ServiceHubLink
            intent="kids-english"
            title="子ども向けオンライン英語の広告サービス"
            description="親子留学前の語学準備として検討できる子ども向けサービスを、編集記事とは分けた広告ページに掲載しています。"
          />

          {/* ビザ */}
          <section id="visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザの種類と親のステータス</h2>
            <div className="space-y-3">
              {VISA_TYPES.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-sm sm:text-base text-primary-700">{v.type}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{v.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* スケジュール例 */}
          <section id="schedule" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">1日のスケジュール例</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              親子留学の典型的な1日（オーストラリア・親子2人・短期1ヶ月の場合）。
            </p>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {SCHEDULE_EXAMPLE.map((s) => (
                <div key={s.time} className="flex items-start gap-4 p-4">
                  <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded whitespace-nowrap shrink-0">
                    {s.time}
                  </span>
                  <p className="text-sm text-gray-800 leading-relaxed">{s.activity}</p>
                </div>
              ))}
            </div>
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

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/countries/philippines" className="text-primary-600 hover:underline">
                  → フィリピン留学・ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/30s-guide" className="text-primary-600 hover:underline">
                  → 30代ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/agent-comparison" className="text-primary-600 hover:underline">
                  → エージェント vs 自力比較
                </Link>
              </li>
              <li>
                <Link href="/jobs/mom" className="text-primary-600 hover:underline">
                  → 主婦・ママの留学ガイド
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合う国
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
