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

const PAGE_PATH = '/malta-study';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'マルタ留学完全ガイド｜費用・治安・気候・学校選び｜英国留学の半額で英語圏',
  description: '地中海に浮かぶマルタは「英語圏で安く、ヨーロッパに住む」が叶う隠れた留学先。学費は英国の半額、治安は欧州トップクラス、年間300日晴天。費用・学校・ビザ・他国比較まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    'マルタ 留学',
    'マルタ 語学留学',
    'マルタ 留学 費用',
    'マルタ 治安',
    'マルタ 英語留学',
    'マルタ 留学 学校',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-malta', label: 'なぜマルタ留学が注目されるのか' },
  { id: 'cost', label: 'マルタ留学の費用シミュレーション' },
  { id: 'safety-climate', label: '治安・気候・生活環境' },
  { id: 'school-choice', label: '語学学校の選び方5つの軸' },
  { id: 'visa-info', label: 'ビザ・滞在情報' },
  { id: 'vs-other-countries', label: '他英語圏との比較（豪・加・英・比）' },
  { id: 'pros-cons', label: 'マルタ留学のメリット・デメリット' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COST_SIMULATION = [
  { period: '1ヶ月', school: '€800〜1,200', living: '€800〜1,200', total: '約25〜38万円' },
  { period: '3ヶ月', school: '€2,200〜3,300', living: '€2,400〜3,600', total: '約75〜110万円' },
  { period: '6ヶ月', school: '€4,000〜6,000', living: '€4,800〜7,200', total: '約140〜200万円' },
  { period: '1年', school: '€7,500〜11,000', living: '€9,600〜14,400', total: '約260〜380万円' },
];

const SCHOOL_AXES = [
  { axis: '①規模・国籍比率', detail: '大規模校（200〜500名）は国籍多様、小規模校（30〜80名）は日本人少なめ' },
  { axis: '②立地（北部 vs 中部）', detail: 'Sliema・St. Julian\'sは観光地で賑やか、Valletta・Mostaは落ち着いた雰囲気' },
  { axis: '③学校種別', detail: '一般英語・ビジネス英語・IELTS対策・親子留学・50+専門コース' },
  { axis: '④価格帯', detail: 'EUR 150〜400/週で幅広い。長期割引で20〜40%安くなる' },
  { axis: '⑤宿泊形態', detail: 'ホームステイ・学校寮・シェアアパート。学校手配が安心' },
];

const VISA_INFO = [
  { duration: '90日以内', visa: 'ビザ不要（観光ビザ）', detail: 'EU加盟国シェンゲン圏。日本人は90日まで滞在可能' },
  { duration: '90日超〜1年', visa: '長期学生ビザ（National Visa）', detail: '入学許可書＋資金証明＋保険必要。3〜6ヶ月前申請推奨' },
  { duration: '就労', visa: 'Stay Permit + Work Permit', detail: '長期学生ビザ保持者は週20時間まで就労可（13週後から）' },
];

const COUNTRY_COMPARE = [
  { country: 'マルタ', school: '€800〜1,200/月', living: '€800〜1,200/月', annual: '260〜380万円', feature: '欧州唯一の英語公用語国・治安◎・€弱で割安' },
  { country: 'イギリス', school: '£1,200〜1,800/月', living: '£1,200〜1,800/月', annual: '450〜700万円', feature: '本場英語・物価高・ビザ厳しい' },
  { country: 'オーストラリア', school: 'AUD 1,500〜2,000/月', living: 'AUD 1,500〜2,000/月', annual: '350〜500万円', feature: '時給高・働きやすい・治安◎' },
  { country: 'カナダ', school: 'CAD 1,400〜1,800/月', living: 'CAD 1,200〜1,800/月', annual: '320〜450万円', feature: '北米英語・多文化・冬寒い' },
  { country: 'フィリピン（セブ）', school: '$500〜800/月', living: '$500〜800/月', annual: '120〜200万円', feature: 'マンツーマン中心・最安・治安△' },
];

const PROS = [
  '英国留学の約半額で英語が学べる',
  '治安が欧州トップクラス（人口比犯罪率EU内最低レベル）',
  '年間300日以上が晴天、地中海性気候で過ごしやすい',
  'EU加盟国なのでヨーロッパ周遊が安く・簡単',
  '日本人が少なく英語環境に没頭できる',
  '英語＋イタリア語/フランス語のバイリンガル環境',
  '学校手配のホームステイ・アパートが豊富',
];

const CONS = [
  '日本からの直行便なし（イタリア・トルコ等で乗継）',
  '夏（7-8月）は観光客多くアパート確保が困難',
  '英語は「マルタ訛り」あり（インド英語に近い）',
  '物価上昇中（特に家賃、近年欧州マネー流入で）',
  '90日超の滞在はビザ申請必須、手続きやや煩雑',
  '冬は意外と寒い（6-12℃）、暖房弱い建物多い',
];

const FAQS = [
  {
    question: 'マルタ留学の総額はどれくらい？',
    answer:
      '1ヶ月25〜38万円、3ヶ月75〜110万円、6ヶ月140〜200万円、1年260〜380万円が目安。イギリスの約半額、オーストラリアの約7割で英語圏留学が叶います。€（ユーロ）はGBP/AUD/USDより為替的にも有利。',
  },
  {
    question: 'マルタの英語は本物？訛りは強い？',
    answer:
      '公用語は英語（マルタ語と並ぶ）。商店・学校・行政すべて英語通用。ただしマルタ人の英語はイタリア語訛りがあり、独特のイントネーション。語学学校の講師は標準英語が多いので問題なし。卒業後はIELTS・TOEFLでも通用するレベルに到達。',
  },
  {
    question: '治安はどう？女性一人で行ける？',
    answer:
      '欧州トップクラスに安全。人口比犯罪率はEU内最低レベル、夜道一人歩きも比較的安心。ただし観光地（Sliema・Paceville）の深夜のスリ・置き引きには注意。女性一人留学者も多く、女性向けシェアハウスも充実しています。',
  },
  {
    question: 'ワーホリ協定はある？',
    answer:
      'マルタは日本とワーキングホリデー協定なし。ただし「長期学生ビザ＋週20時間就労（13週後から）」のスキームで実質ワーホリ的な滞在は可能。また「Nomad Residency Permit」（リモートワーカー向け1年滞在ビザ）もあり。',
  },
  {
    question: 'いつ行くのがベスト？',
    answer:
      '4-6月、9-10月がベスト。気候が穏やかで観光客もそれほど多くない。7-8月は気温30度超え＋観光客でアパート争奪戦。11-3月は雨が増え、暖房弱いため寒く感じる。長期留学なら春・秋スタートがおすすめ。',
  },
];

export default async function MaltaStudyPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const maltaExperiences = all.filter((e) => e.country?.id === 'malta');
  const mentions = countMentions(all, /(マルタ|Malta|地中海|欧州)/i);
  const sample = maltaExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(マルタ|Malta|地中海|欧州|英語)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'マルタ留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'マルタ留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              マルタ留学完全ガイド｜費用・治安・気候・学校選び｜英国留学の半額で英語圏
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="費用を抑えて欧州で英語留学したい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              地中海に浮かぶ島国マルタは、日本人にはまだ知名度が低いものの、ヨーロッパでは英語留学先として急速に人気上昇中。
              <br />
              費用はイギリスの約半額、治安は欧州トップクラス、年間300日が晴天、英語が公用語。この記事ではマルタ留学のすべてを完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '英国留学の約半額（年260〜380万円）で英語圏留学が可能',
              '治安は欧州トップクラス、女性一人留学者も多数',
              '長期学生ビザで週20時間まで就労OK（実質ワーホリ的）',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜマルタ */}
          <section id="why-malta" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜマルタ留学が注目されるのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              マルタは地中海中央に位置する島国（人口約50万人）。1964年にイギリスから独立し、英語が公用語の一つ。「英語圏で安く、ヨーロッパに住む」を同時に叶える、知る人ぞ知る留学先です。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・欧州唯一の英語公用語国（マルタ語と並列）</li>
              <li>・EU加盟国でユーロ圏、ヨーロッパ周遊の拠点に最適</li>
              <li>・人口比犯罪率がEU内最低レベル、治安抜群</li>
              <li>・地中海性気候で年間300日以上が晴天、温暖</li>
              <li>・物価がイギリス・フランスの約60-70%</li>
              <li>・日本人留学生が少なく英語環境に没頭可能</li>
            </ul>
          </section>

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">マルタ留学の費用シミュレーション</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              学費＋生活費＋滞在費を含めた目安。€（ユーロ）建てで記載、為替により円換算は変動します（1€=160円換算）。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">期間</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">学費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">生活費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">合計（円換算）</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_SIMULATION.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.period}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.school}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.living}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ※ 航空券・保険・ビザ・お小遣いは別途。長期割引で20-40%安くなる学校多数。
            </p>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他の英語圏留学先と比較したい方へ"
            description="セブ・オーストラリア・カナダ等と比較して、自分に合う渡航先を見つけましょう。"
            primaryHref="/cebu-study-real-cost"
            primaryLabel="セブ留学リアルコスト"
            secondaryHref="/matching"
            secondaryLabel="自分に合う留学診断"
          />

          {/* 治安・気候 */}
          <section id="safety-climate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">治安・気候・生活環境</h2>
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <p className="font-bold text-sm mb-2 text-emerald-800">🛡️ 治安</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  欧州トップクラスの安全国家。人口比凶悪犯罪率はEU加盟国内で最低レベル。夜道の一人歩きも比較的安全（観光地のスリ・置き引きには注意）。
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <p className="font-bold text-sm mb-2 text-amber-800">☀️ 気候</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  地中海性気候。夏（7-8月）は最高30度超え、冬（12-2月）は6-12度。年間300日以上が晴天。雪は降らないが冬は意外と寒く、室内暖房が弱い建物多い。
                </p>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <p className="font-bold text-sm mb-2 text-sky-800">🏠 生活環境</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  バス網が充実（€26で月パス）。日用品は欧州ブランドが手頃な価格で手に入る。日本食材は小さな専門店で入手可、Amazon直送もOK。Wi-Fi速度・5G共に良好。
                </p>
              </div>
            </div>
          </section>

          {/* 学校選び */}
          <section id="school-choice" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">語学学校の選び方5つの軸</h2>
            <div className="space-y-3">
              {SCHOOL_AXES.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{s.axis}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ビザ */}
          <section id="visa-info" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザ・滞在情報</h2>
            <div className="space-y-3">
              {VISA_INFO.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{v.duration}</p>
                  <p className="text-sm text-gray-800 mb-1"><strong>必要ビザ:</strong> {v.visa}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{v.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 他国比較 */}
          <section id="vs-other-countries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">他英語圏との比較</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-2 py-2 text-left">国</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">学費</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">生活費</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">年間総額</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRY_COMPARE.map((c, i) => (
                    <tr key={i} className={c.country === 'マルタ' ? 'bg-amber-50' : 'bg-white'}>
                      <td className="border border-gray-200 px-2 py-2 font-bold">{c.country}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.school}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.living}</td>
                      <td className="border border-gray-200 px-2 py-2 text-primary-700">{c.annual}</td>
                      <td className="border border-gray-200 px-2 py-2 text-xs">{c.feature}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* メリデメ */}
          <section id="pros-cons" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">マルタ留学のメリット・デメリット</h2>
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

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                マルタ渡航者の体験談 <strong>n={maltaExperiences.length}件</strong>。
                マルタ・欧州留学関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
              </p>
              <p className="text-xs text-gray-500">
                ※ サンプル数が少ないため参考値として捉えてください。
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
            ※ ビザ・費用は2026年5月時点の情報です。最新情報は在マルタ日本大使館・マルタ移民局公式サイトでご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/cebu-study-real-cost" className="text-primary-600 hover:underline">→ セブ留学リアルコスト</Link></li>
              <li><Link href="/vancouver-language-school" className="text-primary-600 hover:underline">→ バンクーバー語学学校</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
              <li><Link href="/language-school-ranking" className="text-primary-600 hover:underline">→ 語学学校ランキング</Link></li>
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト</Link></li>
              <li><Link href="/no-english" className="text-primary-600 hover:underline">→ 英語ゼロでも留学</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
