import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ExperienceCard from '@/components/experience/ExperienceCard';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import QuoteFromExperience from '@/components/article/QuoteFromExperience';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { getExperiences } from '@/lib/microcms/experiences';
import { getCountries } from '@/lib/microcms/countries';
import type { Experience } from '@/lib/microcms/types';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '30代でも行けるワーホリ国と準備のコツ｜35歳まで申請可能な国一覧',
  description: '30代でもワーホリは行けます。35歳まで申請可能な国一覧、30代特有のキャリア・お金・健康・パートナー問題への対策、30代渡航者の成功事例まで実体験ベースで解説。20代との違いを踏まえた現実的なプランを紹介します。',
  path: '/30s-guide',
  keywords: [
    '30代 ワーホリ',
    '30代 ワーホリ 後悔',
    '30代 ワーホリ できる 国',
    '35歳 ワーホリ',
    '30代 留学',
    '30代 海外',
    '30代 ワーホリ 仕事',
  ],
});

const TOC_HEADINGS = [
  { id: 'countries', label: '30代でも申請できるワーホリ国（年齢上限35歳以上）' },
  { id: 'challenges', label: '30代特有の4つの課題と対策' },
  { id: 'experiences', label: '30代渡航者の体験談' },
  { id: 'success-patterns', label: '30代ワーホリの成功パターン3例' },
  { id: 'faq', label: 'よくある質問' },
];

const FAQS = [
  {
    question: '30代でもワーホリビザは取れますか？',
    answer:
      '取れる国があります。オーストラリアは2024年以降35歳まで（一部条件付き）、アイルランドは申請時31歳までOK、カナダやニュージーランドは30歳までです。30歳になる前に申請しておけば、ビザの有効期間中は30歳を超えても渡航できる国もあります。',
  },
  {
    question: '30代でワーホリに行くのは遅すぎる？',
    answer:
      '遅くありません。むしろ20代より仕事のスキルや社会人経験を活かせるので、現地での職種選択肢が広がるケースもあります。特にIT・看護・接客・教育などのスキルがあれば、英語環境で実務経験を積める貴重なチャンスになります。一方で、貯金・キャリア・健康・パートナーの4つは20代より入念に準備しておきましょう。',
  },
  {
    question: '30代ワーホリで後悔した人の共通点は？',
    answer:
      '「目的が曖昧なまま出発した」「貯金が足りずに途中帰国」「20代の若い渡航者の輪に馴染めなかった」の3つが典型的です。逆に成功している人は「現地での専門スキル獲得」「英語で実務経験」など明確な目標を持って、30代同士のコミュニティを意識的に作っています。',
  },
  {
    question: '30代の貯金はいくらあれば安心？',
    answer:
      '20代より厚めに用意するのが安心。最低200万円、できれば300万円が推奨ラインです。20代より日本での生活コストが高い場合があり、帰国後の転職活動期間（3〜6ヶ月）の生活費も含めて計算しましょう。',
  },
  {
    question: '30代ワーホリ後の転職は不利になる？',
    answer:
      '業界や職種によって大きく差があります。外資系・IT・ヘルスケア・教育・観光業では「30代＋英語＋海外実務」は高評価。一方、年齢や勤続年数を重視する伝統的な日本企業では「ブランク」扱いされやすいので注意。出発前に「帰国後どの業界に戻るか」を仮で決めておくと安心です。',
  },
];

const CHALLENGES = [
  {
    emoji: '💼',
    title: 'キャリア：「ブランク」を「投資期間」に変える',
    description: '30代の1年は20代の1年より「市場での重み」が大きいです。出発前に帰国後の職種を仮決めし、現地ではその職種に活かせるスキルや経験を積むことで、ブランクではなく武器になります。',
    actions: [
      '出発前に転職エージェントと面談して、30代の市場価値を把握する',
      '現地でTOEIC/IELTSを再受験して、数字で証明できる証拠を作る',
      'LinkedInプロフィールを英語化しておく',
      '帰国後の職務経歴書に「Working Holiday」を独立した職歴として書く',
    ],
  },
  {
    emoji: '💰',
    title: 'お金：貯金200〜300万円＋帰国後の生活費',
    description: '20代より高い生活水準に慣れている30代は、現地でも「節約に慣れていない」傾向があります。最初の3ヶ月は無職前提で生活費を計算して、現地収入はあくまでボーナス扱いに。',
    actions: [
      '出発前に最低200万円（できれば300万円）を確保',
      '帰国後3〜6ヶ月の生活費を別途キープ',
      'クレジットカードは年会費が低いものを2枚確保',
      'Wiseなどの海外送金サービスを事前に登録',
    ],
  },
  {
    emoji: '❤️',
    title: '健康：30代特有の予防・治療準備',
    description: '20代より体力面・健康面のリスクが上がります。海外保険のカバー範囲を入念にチェックして、持病がある場合は出発前に主治医と相談しておきましょう。',
    actions: [
      '海外旅行保険は「歯科」「婦人科（女性）」「メンタル」もカバーされるか確認',
      '持病がある場合は英文の処方箋・診断書を取得',
      '常備薬は多めに持参（現地で同じ成分の薬がない場合がある）',
      '健康診断結果（英文）を持参すると現地の病院で安心',
    ],
  },
  {
    emoji: '💏',
    title: 'パートナー：結婚・出産タイミングとの折り合い',
    description: '30代は結婚・出産・パートナーシップの転換期と重なりやすいです。パートナーがいる場合は「行く・行かない」「同行する」「待つ」を事前に話し合って、合意を取っておくことが大事。',
    actions: [
      'パートナーとは「期間・出費・帰国後のキャリア計画」を合意する',
      '出産希望年齢から逆算して渡航時期を決める',
      'パートナーも同行する場合はビザの一緒申請を計画',
      '帰国時期を厳守する仕組み（不動産・家族イベントなど）を作る',
    ],
  },
];

function extract30sQuote(exp: Experience): string | null {
  const advice = exp.advice ?? '';
  const sentences = advice.split(/[。．！!?？]/);
  for (const s of sentences) {
    const trimmed = s.trim();
    if (trimmed.length > 20 && trimmed.length < 120) {
      return trimmed + '。';
    }
  }
  return null;
}

export default async function ThirtyPage() {
  const [experiencesData, countriesData] = await Promise.all([
    getExperiences({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getCountries({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
  ]);

  // 30代以上の体験談
  const thirtyAll = experiencesData.contents.filter((e) => e.ageAtDeparture && e.ageAtDeparture >= 30);
  const thirtyExperiences = thirtyAll.slice(0, 9);

  // 30代体験談からアドバイスを抽出
  const thirtyQuotes = thirtyAll
    .map((e) => ({ exp: e, quote: extract30sQuote(e) }))
    .filter((x): x is { exp: Experience; quote: string } => x.quote !== null)
    .slice(0, 2);

  // visaAgeMax >= 35 の国
  const olderApplicantCountries = countriesData.contents
    .filter((c) => c.visaAgeMax != null && c.visaAgeMax >= 35)
    .sort((a, b) => (b.visaAgeMax ?? 0) - (a.visaAgeMax ?? 0))
    .slice(0, 8);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '30代ワーホリ完全ガイド', url: '/30s-guide' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '30代ワーホリ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              30代でも行けるワーホリ国と、準備のコツ
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="30代でワーホリを検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              30代でもワーホリは行けます。オーストラリアは35歳まで、アイルランドは31歳まで申請できます。
              <br />
              この記事では、30代特有のキャリア・お金・健康・パートナー問題への対策と、実際に30代で渡航した方の成功事例を具体的にまとめました。
              「もう遅いかな」と諦める前に、できることを確認してみてください。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '35歳まで申請できる国の一覧と、ビザの取り方',
              '30代特有の4つの課題（キャリア・お金・健康・パートナー）への対策',
              '30代渡航者の成功パターン3例と、実体験データ',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 35歳まで申請可能な国 */}
          {olderApplicantCountries.length > 0 && (
            <section id="countries" className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                30代でも申請できるワーホリ国（年齢上限35歳以上）
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                ビザの年齢上限が35歳以上に設定されている国を、上限が高い順に並べました。30代の方はまずこれらを候補に。
              </p>
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-semibold">国</th>
                      <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">年齢上限</th>
                      <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">ビザ期間</th>
                      <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">月生活費</th>
                    </tr>
                  </thead>
                  <tbody>
                    {olderApplicantCountries.map((c) => (
                      <tr key={c.id} className="border-t border-gray-100">
                        <td className="px-4 py-3">
                          <Link
                            href={`/countries/${c.id}`}
                            className="text-primary-600 hover:underline font-medium"
                          >
                            {c.flagEmoji} {c.nameJp}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right">{c.visaAgeMax}歳</td>
                        <td className="px-4 py-3 text-right">
                          {c.visaDurationMonths ? `${c.visaDurationMonths}ヶ月` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {c.livingCostMonthJpy
                            ? `${Math.round(c.livingCostMonthJpy / 10000)}万円`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                ※ ビザの年齢計算は「申請時」が一般的。30歳超え前に申請しておけば、ビザの有効期間中は渡航できる国も多くあります。
              </p>
            </section>
          )}

          {/* 中段CTA */}
          <MidCTA
            title="30代のあなたに合う国を5問で診断"
            description="目的・期間・予算・治安・言語の希望から、相性スコア付きで推薦します。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/age/30s"
            secondaryLabel="30代の体験談を絞り込む"
          />

          {/* 30代特有の4課題 */}
          <section id="challenges" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">30代特有の4つの課題と対策</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              20代と比べて、30代のワーホリには「キャリア」「お金」「健康」「パートナー」の4つで追加の準備が必要です。それぞれの課題と具体的な対策をまとめました。
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {CHALLENGES.map((c, i) => (
                <article key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-base sm:text-lg font-bold mb-2 flex items-center gap-2">
                    <span aria-hidden="true">{c.emoji}</span>
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{c.description}</p>
                  <ul className="text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                    {c.actions.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            {thirtyQuotes[0] && (
              <QuoteFromExperience
                text={thirtyQuotes[0].quote}
                experience={thirtyQuotes[0].exp}
                truncated
              />
            )}
          </section>

          {/* 30代体験談 */}
          {thirtyExperiences.length > 0 && (
            <section id="experiences" className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                30代渡航者の体験談（{thirtyExperiences.length}件）
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                30歳以上で出発した渡航者の体験談を抽出しました。国・期間・職種別のリアルな実体験を参考にしてください。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {thirtyExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            </section>
          )}

          {/* 成功パターン */}
          <section
            id="success-patterns"
            className="mb-12 bg-emerald-50 border border-emerald-100 rounded-xl p-5 sm:p-6"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-3 text-emerald-900">
              30代ワーホリの成功パターン3例
            </h2>
            <div className="space-y-4 text-sm text-emerald-900">
              <div>
                <p className="font-bold mb-1">① 専門スキル × 英語環境で「国際的な即戦力」</p>
                <p className="leading-relaxed">日本でのIT・看護・エンジニアの経験を活かして、現地で同じ職種に就職。帰国後は外資系に転職するルート。</p>
              </div>
              <div>
                <p className="font-bold mb-1">② 短期語学留学＋海外就職活動で永住権ルート</p>
                <p className="leading-relaxed">フィリピンやマルタで3ヶ月英語を強化→オーストラリア・カナダで現地企業に就職→技術者ビザに切り替え。</p>
              </div>
              <div>
                <p className="font-bold mb-1">③ パートナー同行ワーホリで二人三脚</p>
                <p className="leading-relaxed">夫婦・カップルで同時申請。経済負担を分担して、帰国後の貯金目減りを最小化。</p>
              </div>
            </div>
            {thirtyQuotes[1] && (
              <div className="mt-4">
                <QuoteFromExperience
                  text={thirtyQuotes[1].quote}
                  experience={thirtyQuotes[1].exp}
                  truncated
                />
              </div>
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

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">30代ワーホリで合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/age/30s" className="text-primary-600 hover:underline">
                  → 30代の体験談を年代別に絞り込む
                </Link>
              </li>
              <li>
                <Link href="/age/20s-late" className="text-primary-600 hover:underline">
                  → 社会人ワーホリ完全ガイド（20代後半）
                </Link>
              </li>
              <li>
                <Link href="/after-wh" className="text-primary-600 hover:underline">
                  → 帰国後就活完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合うワーホリ国
                </Link>
              </li>
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための7つの教訓
                </Link>
              </li>
              <li>
                <Link href="/couple-wh" className="text-primary-600 hover:underline">
                  → カップル・夫婦でワーホリ
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
