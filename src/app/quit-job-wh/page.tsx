import type { Metadata } from 'next';
import Link from 'next/link';
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

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '社会人ワーホリの退職タイミングと手続き｜住民票・年金・健康保険の完全解説',
  description: '社会人がワーホリに行く前の退職タイミング、住民票・国民年金・健康保険・住民税の手続きを完全解説。退職前6ヶ月〜出発までの逆算スケジュール、退職交渉のコツ、出発前チェックリスト付き。',
  path: '/quit-job-wh',
  keywords: [
    '社会人 ワーホリ 退職',
    'ワーホリ 退職 タイミング',
    '住民票 抜く ワーホリ',
    'ワーホリ 国民年金',
    'ワーホリ 健康保険',
    'ワーホリ 住民税',
    'ワーホリ 海外転出届',
  ],
});

const TOC_HEADINGS = [
  { id: 'timing', label: '退職タイミングの逆算（6ヶ月前から）' },
  { id: 'negotiation', label: '会社への退職交渉のコツ' },
  { id: 'transfer-form', label: '海外転出届：住民票を抜くか抜かないか' },
  { id: 'pension', label: '国民年金の手続き（任意加入・免除）' },
  { id: 'health', label: '健康保険・海外保険の切り替え' },
  { id: 'tax', label: '住民税・所得税の節税ポイント' },
  { id: 'checklist', label: '出発前チェックリスト' },
  { id: 'experiences', label: '体験談から見る退職〜出発のリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TIMELINE_PHASES = [
  {
    when: '出発6ヶ月前',
    title: '上司に意思表示・転職エージェント登録',
    detail: '退職の意思を非公式に上司に伝える。同時に転職エージェントに登録して帰国後の市場感を把握。',
  },
  {
    when: '出発4ヶ月前',
    title: '正式に退職届提出・引き継ぎ計画作成',
    detail: '人事に退職届を提出。退職日・有給消化を確定。後任への引き継ぎ計画を作成・進行。',
  },
  {
    when: '出発3ヶ月前',
    title: 'ビザ申請・航空券予約',
    detail: 'ワーホリビザ申請（国により審査期間が違う）、航空券（早めの方が安い）、海外保険を予約。',
  },
  {
    when: '出発2ヶ月前',
    title: '住居・SIM・銀行カード手配',
    detail: '初期滞在先（ホームステイ・ホステル）の予約、Wiseデビットカード申請、現地SIMの調査。',
  },
  {
    when: '出発1ヶ月前',
    title: '役所手続き（住民票・年金・健康保険）',
    detail: '海外転出届の提出（出発の14日前以降）、国民年金の任意加入/免除申請、健康保険の脱退手続き。',
  },
  {
    when: '出発2週間前',
    title: '銀行・クレジット・通信・公共料金の解約',
    detail: '銀行口座は維持、ネット銀行に切替推奨。クレカは継続。通信は休止、公共料金は解約。',
  },
];

const NEGOTIATION_TIPS = [
  '退職理由は「ワーホリ・留学のため」と正直に伝える（誤魔化すと信用を失う）',
  '退職時期は「会社の繁忙期を避ける」配慮を見せる',
  '後任への引き継ぎ計画を自分から提案する',
  '退職交渉は3〜4ヶ月前から（最低でも2ヶ月前）',
  '有給消化を計画的に進める（最終出社日の2〜3週間前まで）',
];

const PENSION_OPTIONS = [
  {
    title: '任意加入（推奨）',
    detail: '月16,520円（2024年度）を払い続けることで、将来の年金受給額に反映。長期間（1年以上）の海外滞在なら検討価値あり。',
  },
  {
    title: '免除申請',
    detail: '海外居住中は強制加入対象外なので、何もしなければ自動的に免除（未加入扱い）。将来の年金受給額が減ることに留意。',
  },
];

const FAQS = [
  {
    question: '退職を上司に伝えるベストなタイミングは？',
    answer:
      '出発5〜6ヶ月前が標準。非公式な意思表示（雑談形式）から始めて、4ヶ月前に正式な退職届提出が円満退社のセオリー。突然伝えると引き継ぎ計画が組めず信用を失います。',
  },
  {
    question: '住民票を抜くべきか抜かないべきか？',
    answer:
      '1年以上の海外滞在なら抜くのが基本。住民税・健康保険料が翌年度から発生しなくなり、年間で20〜40万円の節約に。短期（半年以下）なら抜かなくても問題ありません。',
  },
  {
    question: '国民年金を払い続けるべきか？',
    answer:
      '将来の年金受給を考えれば任意加入推奨。1年で約20万円の出費ですが、未納だと将来の受給額が減ります。家計に余裕があれば加入、無理なら免除でもOK。後から追納も可能。',
  },
  {
    question: 'クレジットカードと銀行口座は解約すべき？',
    answer:
      '解約せずに維持しましょう。日本のクレジットカード履歴がなくなると、帰国後の住宅ローン審査などで不利になります。銀行口座も日本円の保管・年金受給用に維持を。',
  },
  {
    question: '退職後にすぐ出発しないとお金がもったいない？',
    answer:
      '退職〜出発まで1〜2ヶ月の準備期間は普通。役所手続き・荷造り・実家挨拶などで意外と時間が消える。退職金や有給消化分で生活費は賄えるので、焦らず準備期間を設けましょう。',
  },
];

export default async function QuitJobWhPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(退職|仕事辞|住民票|年金|健康保険|社会人)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(退職|仕事辞|住民票|年金|健康保険|社会人)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '社会人ワーホリの退職と手続き', url: '/quit-job-wh' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '社会人ワーホリの退職と手続き' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              社会人ワーホリの退職タイミングと手続き｜住民票・年金・健康保険の完全解説
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="社会人で会社を辞めてワーホリへ行く方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              社会人がワーホリに行くとき、最大の壁は「退職」と「役所手続き」です。
              <br />
              退職を上司に伝えるタイミング、住民票・年金・健康保険・住民税の処理を間違えると、帰国後に余計な出費が発生します。
              <br />
              この記事では、出発6ヶ月前から逆算したスケジュールと、それぞれの手続きの正解を完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '出発6ヶ月前から逆算する退職スケジュール（6段階）',
              '住民票を抜くと年間20〜40万円節約できる仕組み',
              '国民年金・健康保険・住民税の正解と落とし穴',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* タイムライン */}
          <section id="timing" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">退職タイミングの逆算（6ヶ月前から）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              退職〜出発までは最低3ヶ月、できれば6ヶ月の準備期間を見るのがベスト。各時期の標準的なアクションをまとめました。
            </p>
            <ol className="space-y-3">
              {TIMELINE_PHASES.map((p, i) => (
                <li key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-32 shrink-0">
                    <span className="inline-block text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded">
                      {p.when}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1 text-base">{p.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{p.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="退職前に「行く国」を決めたい方へ"
            description="社会人向けの5問診断で、9カ国の中から相性スコア付きでTOP3を提案します。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/age/20s-late"
            secondaryLabel="社会人ワーホリ完全ガイド"
          />

          {/* 退職交渉 */}
          <section id="negotiation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">会社への退職交渉のコツ</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              円満退社できれば、帰国後の人脈・推薦状・場合によっては再雇用にもつながります。下記5つを押さえましょう。
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              {NEGOTIATION_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-primary-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 海外転出届 */}
          <section id="transfer-form" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">海外転出届：住民票を抜くか抜かないか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              海外転出届を提出して住民票を抜くと、その時点で「非居住者」となり、翌年度の住民税・国民健康保険の支払いが不要になります。
            </p>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-4">
              <p className="text-sm font-bold text-emerald-900 mb-2">⭕ 抜くべきケース</p>
              <ul className="text-sm text-emerald-900 space-y-1 list-disc pl-5">
                <li>1年以上の海外滞在予定</li>
                <li>住民税が高額（年収400万円以上の方は年間20〜30万円が浮く）</li>
                <li>国民健康保険を脱退して海外保険に切り替えたい</li>
              </ul>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
              <p className="text-sm font-bold text-rose-900 mb-2">⚠️ 抜かない方がいいケース</p>
              <ul className="text-sm text-rose-900 space-y-1 list-disc pl-5">
                <li>半年以内の短期渡航</li>
                <li>住宅ローン審査が控えている</li>
                <li>マイナンバーカードの更新が必要</li>
              </ul>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 提出は出発の14日前から受付。住民票がある市区町村役所で「海外転出届」を提出します。
            </p>
          </section>

          {/* 国民年金 */}
          <section id="pension" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国民年金の手続き（任意加入・免除）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              住民票を抜くと、国民年金の強制加入対象外になります。2つの選択肢があります。
            </p>
            <div className="space-y-3">
              {PENSION_OPTIONS.map((o) => (
                <div key={o.title} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-sm sm:text-base">{o.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{o.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 健康保険 */}
          <section id="health" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">健康保険・海外保険の切り替え</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              住民票を抜くと、国民健康保険を脱退できます。代わりに「海外旅行保険」に加入して、現地での医療をカバーします。
            </p>
            <ul className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-2">
              <li>・年間の海外保険料は15〜25万円（プランによる）</li>
              <li>・歯科・婦人科・メンタル・救援者費用がカバーされるか確認</li>
              <li>・クレジットカードの付帯保険を併用すると、合計補償額を増やせる</li>
              <li>・帰国後は住民票を戻して国民健康保険に再加入（または再就職先の健康保険）</li>
            </ul>
          </section>

          {/* 住民税 */}
          <section id="tax" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">住民税・所得税の節税ポイント</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              住民税は「1月1日時点で住民票がある人」に翌年度の税金がかかります。1月1日前に海外転出届を出せば、翌年度の住民税はゼロに。
            </p>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
              <p className="text-sm text-sky-900 leading-relaxed mb-2">
                <strong>💰 節税ポイント</strong>
              </p>
              <ul className="text-sm text-sky-900 space-y-1 list-disc pl-5">
                <li>12月中に出発できれば、翌年度の住民税が免除（年20〜30万円相当）</li>
                <li>退職した年の所得税は確定申告で還付されることが多い（10〜20万円相当）</li>
                <li>確定申告は出発前に行うか、納税管理人を立てて代理申告</li>
              </ul>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 詳しくは <Link href="/tax-return" className="text-primary-600 hover:underline">ワーホリの確定申告ガイド</Link> をご覧ください。
            </p>
          </section>

          {/* チェックリスト */}
          <section id="checklist" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">出発前チェックリスト</h2>
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
              <ul className="space-y-2 text-sm sm:text-base text-gray-800">
                {[
                  '退職日・最終出社日が確定している',
                  '会社の社会保険・厚生年金の脱退手続き完了',
                  '海外転出届を市区町村役所に提出（14日前以降）',
                  '国民年金の任意加入 or 免除申請を完了',
                  '国民健康保険の脱退手続き完了',
                  '海外旅行保険に加入済み',
                  '退職金・最終給与の振込確認',
                  '退職前の確定申告 or 納税管理人指定',
                  '銀行口座・クレジットカードは継続維持',
                  'マイナンバー通知カードを保管（帰国後の手続き用）',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary-600 font-bold shrink-0 mt-0.5">☐</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見る退職〜出発のリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{mentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {mentions.containsCount}件</strong>
                （{mentions.percentage}%）が退職・社会人手続きについて言及していました。
              </p>
              <p className="text-xs text-gray-500">
                ※ advice/pros/cons から「退職/仕事辞/住民票/年金/健康保険/社会人」のいずれかを含む体験談（参考値）。
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

          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            ※ 本記事は2026年5月時点の一般的な情報です。手続きの詳細は最寄りの市区町村役所または社会保険労務士へご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/age/20s-late" className="text-primary-600 hover:underline">
                  → 社会人ワーホリ完全ガイド（20代後半）
                </Link>
              </li>
              <li>
                <Link href="/fresh-grad-wh" className="text-primary-600 hover:underline">
                  → 新卒ワーホリと就職の両立ガイド
                </Link>
              </li>
              <li>
                <Link href="/tax-return" className="text-primary-600 hover:underline">
                  → ワーホリの確定申告ガイド
                </Link>
              </li>
              <li>
                <Link href="/after-wh" className="text-primary-600 hover:underline">
                  → 帰国後の就活ガイド
                </Link>
              </li>
              <li>
                <Link href="/30s-guide" className="text-primary-600 hover:underline">
                  → 30代ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/departure-timing" className="text-primary-600 hover:underline">
                  → ワーホリ出発時期おすすめ月
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
