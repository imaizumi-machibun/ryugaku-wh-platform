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

const PAGE_PATH = '/wh-japanese-restaurant';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外日本食レストランで働く完全ガイド｜求人探し・面接・時給・キャリアパス',
  description: 'ワーホリ・留学生に人気の海外日本食レストラン勤務。求人サイト、応募の流れ、面接対策、時給水準、キャリアパス、メリットデメリットを実例ベースで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'ワーホリ 日本食レストラン',
    '海外 日本食 仕事',
    '日本食レストラン 求人 海外',
    'ワーホリ 日本人向け 仕事',
    '海外 寿司職人',
    '海外 ラーメン店 求人',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-japanese', label: 'なぜ日本食レストランは人気か' },
  { id: 'pros-cons', label: 'メリット・デメリット' },
  { id: 'how-to-find', label: '求人の探し方5選' },
  { id: 'apply-flow', label: '応募から採用までの流れ' },
  { id: 'interview-tips', label: '面接で聞かれる5つの質問' },
  { id: 'salary-by-position', label: 'ポジション別時給' },
  { id: 'career-path', label: '日本食レストランからのキャリアパス' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const PROS = [
  '英語ハードル低、入国直後でも採用率高',
  '日本人スタッフ多、初日から馴染みやすい',
  '時給はローカル並み or やや低、Tip込みで悪くない',
  'まかない（無料食事）付きで食費節約',
  '日本人ネットワーク作りやすい',
  '労働ビザ要件も柔軟、フレキシブルなシフト',
  '日本食材・調理スキルが上がる',
];

const CONS = [
  '英語環境はゼロに近い、英語力UP目的なら不向き',
  '日本人客対応中心、現地文化接点少',
  '日系企業特有の上下関係・残業文化が残ることも',
  'チェーン店は時給安め、個人店はオーナー次第',
  '寿司・天ぷら職人は資格・経験必須、入りにくい',
];

const HOW_TO_FIND = [
  {
    method: 'JpCanada.com（カナダ）',
    detail: '日系最大級求人サイト、トロント・バンクーバー中心',
  },
  {
    method: 'JAMS.tv（オーストラリア）',
    detail: '日系コミュニティ最大、シドニー・メルボルン中心の求人',
  },
  {
    method: 'mixb（カナダ・米国・豪）',
    detail: '北米日系コミュニティの掲示板、信頼性高',
  },
  {
    method: '日系新聞・タウン誌',
    detail: 'トロント・バンクーバー・シドニー等の日系紙、現地配布',
  },
  {
    method: 'ウォークイン・店舗直接訪問',
    detail: '履歴書持参で直接訪問、即採用も。最も効果的',
  },
];

const APPLY_FLOW = [
  { step: 1, title: 'Resume・Cover Letter準備', detail: '日本食レストラン経験・接客経験を強調、英文＋日本語両方準備' },
  { step: 2, title: '求人サイト or ウォークイン', detail: 'オンライン応募 or 直接店舗訪問（午後2-4時の空き時間が狙い目）' },
  { step: 3, title: '電話・面接予約', detail: 'マネージャー・オーナーから電話、面接日程調整' },
  { step: 4, title: '対面面接（15-30分）', detail: '基本的な英語＋日本語両方、簡単なロールプレイあり' },
  { step: 5, title: 'トライアル勤務（1-3日）', detail: '時給付与のことが多い、実際の業務体験' },
  { step: 6, title: '採用通知・勤務開始', detail: '通常1週間以内に開始、シフト相談' },
];

const INTERVIEW_QA = [
  {
    q: 'なぜここで働きたい？',
    a: '回答例：「日本食を通じて現地の人々と日本文化を共有したい。御店の○○の評判を聞き、ここで働きたいと思った」',
  },
  {
    q: 'いつまで働けますか？',
    a: '回答例：「ワーホリビザは○月までです。最低3-6ヶ月は続けたい」と具体期間を提示',
  },
  {
    q: '日本食レストラン経験は？',
    a: '回答例：未経験でも「日本での飲食店アルバイト経験」「接客好き」「日本料理に詳しい」をアピール',
  },
  {
    q: 'シフトは何曜日入れる？',
    a: '回答例：「週末＋平日3日OK、週20-30時間希望」など柔軟性を示す',
  },
  {
    q: '英語はどれくらい話せる？',
    a: '回答例：「日常会話はOK、料理用語は学習中。お客様対応のメニュー説明はできる」と正直に',
  },
];

const SALARY_POSITIONS = [
  { position: 'ホール（接客）', australia: 'AUD 22-28＋Tip', canada: 'CAD 15-19＋Tip', detail: 'ワーホリの定番、英会話力少しでOK' },
  { position: 'キッチンアシスタント', australia: 'AUD 20-24', canada: 'CAD 14-17', detail: '皿洗い・盛り付け、英語ほぼ不要' },
  { position: '寿司ヘルパー', australia: 'AUD 22-28', canada: 'CAD 16-20', detail: '寿司職人補助、軍艦巻き等' },
  { position: '寿司職人', australia: 'AUD 28-40', canada: 'CAD 22-32', detail: '経験・資格必要、PR取得ルートにも' },
  { position: 'ラーメン職人', australia: 'AUD 25-32', canada: 'CAD 17-25', detail: 'スープ作り・麺茹で、即戦力歓迎' },
  { position: 'マネージャー', australia: 'AUD 30-40＋ボーナス', canada: 'CAD 22-32＋ボーナス', detail: '英語＋日本語必須、長期雇用前提' },
];

const CAREER_PATH = [
  'ホール→寿司ヘルパー→寿司職人にステップアップ（PR取得ルート）',
  'スタッフ→マネージャー昇格、雇用主スポンサーでPR申請',
  '海外日本食経験→帰国後の外資系レストラン就職',
  '寿司・ラーメン職人として欧米各国渡り歩き',
  '独立して自分の店オープン（バンクーバー・シドニーで多数の成功例）',
  '日系コミュニティの繋がりで観光・教育業界転身',
];

const FAQS = [
  {
    question: 'なぜワーホリで日本食レストランが人気？',
    answer:
      '①英語ゼロでも採用される、②日本人スタッフ多くて即馴染める、③即収入確保（入国1週間で勤務開始可能）、④まかない付きで食費節約、⑤日本人ネットワーク作れる、の5つが理由。一方で英語力UPには不向きなので、目的次第。',
  },
  {
    question: '時給はローカル仕事より安い？',
    answer:
      'やや安い傾向。豪の場合、ローカルカフェ時給AUD 28-34に対し日本食レストランAUD 22-28。ただしTipやまかない（無料食事）込みで考えると差は小さい。最低賃金は両国とも法律で保護されているので、極端に安い場合は違法。',
  },
  {
    question: '寿司職人として働きたい、経験ないけど？',
    answer:
      '寿司ヘルパー（軍艦巻き・盛り付け等）からスタート、半年-1年でアシスタント寿司職人にステップアップが一般的。日本で寿司学校（1-3ヶ月コース）を出てから渡航するルートも。PR取得目指すなら経験積みやすい職種。',
  },
  {
    question: 'チェーン店と個人店、どっちがいい？',
    answer:
      '一長一短。チェーン店（ワサビ寿司、Genki Sushi等）は時給安定・労働条件明確・トレーニング充実。個人店はオーナー次第で時給・シフト・人間関係に差大、当たり外れあり。最初はチェーン店で基礎学んでから個人店、というルートも。',
  },
  {
    question: '日本食レストランで働きながら英語上達できる？',
    answer:
      '可能、ただし工夫必要。同僚との会話は日本語中心になりがち、英語環境作りには「お客様対応積極的に」「他の英語環境（友人・コミュニティ）併用」「英会話アプリ毎日継続」が必要。完全英語環境を求めるならローカル店を狙う。',
  },
];

export default async function WhJapaneseRestaurantPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(日本食|寿司|ラーメン|レストラン|日系|和食)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(日本食|寿司|ラーメン|レストラン|日系|和食)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外日本食レストランで働く完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外日本食レストランで働く完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外日本食レストランで働く完全ガイド｜求人・面接・時給・キャリアパス
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ワーホリ・留学で日本食レストランで働きたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              海外ワーホリ・留学生に最も人気の働き先の一つが日本食レストラン。英語ゼロでもOK・即収入確保・まかない付きで、特に渡航初期の鉄板の選択肢です。
              <br />
              この記事では求人探し、応募の流れ、面接対策、ポジション別時給、キャリアパス、メリデメまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '英語ゼロでも入国1週間で勤務開始可能、即収入確保',
              '時給はローカル比やや安、Tip＋まかない付き',
              '寿司職人ルートはPR取得への王道、長期キャリア狙える',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-japanese" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ日本食レストランは人気か</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              海外日本食人気の急上昇で、求人数は年々増加。ワーホリ・留学生にとって最もアクセスしやすい就労先の一つです。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・海外日本食レストランは世界に約160,000店（2024年）</li>
              <li>・トロント・バンクーバー・シドニー・メルボルン・LAは特に多</li>
              <li>・ワーホリ・留学生求人需要安定</li>
              <li>・英語ゼロでも入国1週間以内に採用率高</li>
              <li>・PR取得ルート（寿司職人スポンサー）も存在</li>
            </ul>
          </section>

          {/* メリデメ */}
          <section id="pros-cons" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">メリット・デメリット</h2>
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

          {/* 探し方 */}
          <section id="how-to-find" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">求人の探し方5選</h2>
            <div className="space-y-3">
              {HOW_TO_FIND.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{h.method}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{h.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他の仕事探し方法も合わせて"
            description="ローカルカフェ・接客・ファームジョブ等、他の選択肢も比較検討を。"
            primaryHref="/australia-jobs"
            primaryLabel="オーストラリア仕事探し方"
            secondaryHref="/melbourne-barista"
            secondaryLabel="メルボルンでバリスタ"
          />

          {/* 応募フロー */}
          <section id="apply-flow" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募から採用までの流れ</h2>
            <div className="space-y-3">
              {APPLY_FLOW.map((f) => (
                <div key={f.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {f.step}: {f.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{f.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 面接 */}
          <section id="interview-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">面接で聞かれる5つの質問</h2>
            <div className="space-y-3">
              {INTERVIEW_QA.map((qa, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-2 text-primary-700">Q{i + 1}: {qa.q}</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded">{qa.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 時給 */}
          <section id="salary-by-position" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ポジション別時給</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-2 py-2 text-left">ポジション</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">豪</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">加</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {SALARY_POSITIONS.map((s, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{s.position}</td>
                      <td className="border border-gray-200 px-2 py-2 text-primary-700">{s.australia}</td>
                      <td className="border border-gray-200 px-2 py-2">{s.canada}</td>
                      <td className="border border-gray-200 px-2 py-2 text-xs">{s.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* キャリアパス */}
          <section id="career-path" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">日本食レストランからのキャリアパス</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {CAREER_PATH.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">→</span>
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
                体験談 <strong>n={all.length}件</strong> から「日本食・寿司・ラーメン・レストラン」関連の言及を集計。
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
            ※ 時給は2026年5月時点の参考値です。最新の最低賃金・労働条件は各国公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/australia-jobs" className="text-primary-600 hover:underline">→ オーストラリア仕事探し方</Link></li>
              <li><Link href="/melbourne-barista" className="text-primary-600 hover:underline">→ メルボルンでバリスタ</Link></li>
              <li><Link href="/english-resume-guide" className="text-primary-600 hover:underline">→ 英文レジュメ書き方</Link></li>
              <li><Link href="/wh-budget-100man" className="text-primary-600 hover:underline">→ 100万円WH実現</Link></li>
              <li><Link href="/no-english" className="text-primary-600 hover:underline">→ 英語ゼロでもWH</Link></li>
              <li><Link href="/wh-labor-rights" className="text-primary-600 hover:underline">→ ワーホリ労働権利</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
