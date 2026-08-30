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

const PAGE_PATH = '/vancouver-vs-melbourne';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'バンクーバーvsメルボルン徹底比較｜生活費・気候・仕事・治安・どっちが自分向き？',
  description: 'カナダのバンクーバーとオーストラリアのメルボルンを8項目で徹底比較。生活費・気候・仕事・治安・日本人比率・英語環境まで網羅。自分に合うのはどっちか診断付き。',
  path: PAGE_PATH,
  keywords: [
    'バンクーバー メルボルン 比較',
    'バンクーバー vs メルボルン',
    'カナダ オーストラリア 比較',
    'バンクーバー メルボルン どっち',
    'ワーホリ どこ',
    '留学 都市 比較',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '一目で分かる8項目比較表' },
  { id: 'livecost', label: '生活費の違い' },
  { id: 'climate', label: '気候・季節の違い' },
  { id: 'jobs', label: '仕事・給与水準の違い' },
  { id: 'safety', label: '治安・日本人比率' },
  { id: 'language', label: '英語環境（訛り・通用度）' },
  { id: 'who-for', label: 'あなたはどっち向き？診断' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COMPARISON_TABLE = [
  { item: '月生活費', vancouver: 'CAD 1,800〜2,500', melbourne: 'AUD 2,000〜2,800', winner: 'バンクーバーやや安' },
  { item: '家賃（シェア）', vancouver: 'CAD 800〜1,200', melbourne: 'AUD 800〜1,300', winner: '同等' },
  { item: '時給（カジュアル）', vancouver: 'CAD 17〜22', melbourne: 'AUD 28〜34', winner: 'メルボルン圧勝' },
  { item: '気候', vancouver: '温暖湿潤（冬5度・夏22度）', melbourne: '四季明瞭（冬10度・夏25度）', winner: 'メルボルン快適' },
  { item: '日本人比率', vancouver: '高い（多い）', melbourne: '低い（少ない）', winner: 'メルボルン英語環境◎' },
  { item: '治安', vancouver: '◎', melbourne: '◎', winner: '同等（共に高水準）' },
  { item: '英語訛り', vancouver: '北米英語（標準）', melbourne: '豪英語（独特訛り）', winner: 'バンクーバー慣れやすい' },
  { item: '日本食材入手', vancouver: '◎（中華街・ニチエイ）', melbourne: '○（一部店舗）', winner: 'バンクーバー有利' },
];

const LIVECOST_DETAIL = [
  { item: '家賃（シェア）', vancouver: 'CAD 800〜1,200', melbourne: 'AUD 800〜1,300' },
  { item: '食費（自炊中心）', vancouver: 'CAD 300〜400', melbourne: 'AUD 350〜450' },
  { item: '交通（月パス）', vancouver: 'CAD 100〜130', melbourne: 'AUD 150〜180' },
  { item: '通信（携帯）', vancouver: 'CAD 35〜50', melbourne: 'AUD 30〜45' },
  { item: '保険（公的不可）', vancouver: 'CAD 60〜90', melbourne: 'AUD 50〜80' },
  { item: '娯楽・その他', vancouver: 'CAD 300〜500', melbourne: 'AUD 400〜600' },
];

const JOB_COMPARE = [
  {
    city: 'バンクーバー',
    minWage: 'CAD 17.40',
    avg: 'CAD 19〜22',
    jobs: 'カフェ、レストラン、リテール、観光業',
    feature: '日本食レストラン多、日本語OK求人あり',
  },
  {
    city: 'メルボルン',
    minWage: 'AUD 24.10',
    avg: 'AUD 28〜34',
    jobs: 'カフェ（バリスタ）、レストラン、ファーム',
    feature: '時給世界トップクラス、週末1.25〜2倍',
  },
];

const WHO_FOR = [
  {
    type: 'バンクーバー向き',
    profile: '北米英語に憧れ・日本人コミュニティ重視・自然好き・標準的な暮らし重視',
    reason: '日本食材豊富・日本人多い安心感・北米英語通用度・温暖な気候',
  },
  {
    type: 'メルボルン向き',
    profile: '高時給で稼ぎたい・カフェ文化好き・英語に没頭したい・治安重視',
    reason: '時給世界一・日本人少・カフェ密度世界一・気候快適',
  },
  {
    type: '両方向く人',
    profile: '英語上達＋海外生活経験を積みたい一般的なワーホリ志望者',
    reason: 'どちらも治安◎・英語環境◎・観光大都市。好みで選んでOK',
  },
];

const FAQS = [
  {
    question: '結局どっちが住みやすい？',
    answer:
      '一概に言えませんが、稼ぎたいならメルボルン、暮らしやすさならバンクーバー。メルボルンは時給世界トップクラスで貯金しやすく、カフェ文化に魅了されますが家賃と物価が高い。バンクーバーは日本人が多く生活インフラ充実、自然も豊かで暮らしやすい。あなたの優先順位次第です。',
  },
  {
    question: 'ワーホリビザはどちらが取りやすい？',
    answer:
      '取りやすさはほぼ同じ。オーストラリアWHは年齢制限30歳まで、定員無し（先着順実質なし）。カナダIECは年齢30歳まで、年間6,500枠で抽選式。カナダの方が応募タイミングが限定されるため、すぐ行きたい人はオーストラリアが楽。',
  },
  {
    question: '日本食材の入手しやすさは？',
    answer:
      'バンクーバーが圧勝。中華街・コリアンタウン・日本食材店（Konbiniya、フジヤ、ニチエイ）が複数あり、ほぼ全ての和食材が手に入る。メルボルンは小規模なアジア食材店中心で、種類は限定的。日本食大好きならバンクーバー。',
  },
  {
    question: 'IELTS留学先としてはどちらがいい？',
    answer:
      'メルボルンが「英語環境」では有利。日本人が少ない、現地校との交流機会多、訛りはあるもの留学業界ではメルボルンの英語は通用。バンクーバーは日本人多くマンツーマンスタイル校もあるが、英語に没頭したいなら少し物足りない可能性。',
  },
  {
    question: '初めての海外生活ならどっち？',
    answer:
      '初心者ならバンクーバー推奨。日本人コミュニティが充実、英語が初心者でも乗り切れる環境、北米英語の標準性。慣れたらメルボルンに転戦するのも有り。一方でリスクを取ってでも英語力を伸ばしたい人はメルボルンに最初から飛び込むのもアリ。',
  },
];

export default async function VancouverVsMelbournePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const vanMelbExperiences = all.filter(
    (e) =>
      (e.country?.id === 'canada' && /バンクーバー|Vancouver/i.test(e.cityPrimary ?? '')) ||
      (e.country?.id === 'australia' && /メルボルン|Melbourne/i.test(e.cityPrimary ?? ''))
  );
  const mentions = countMentions(all, /(バンクーバー|Vancouver|メルボルン|Melbourne)/i);
  const sample = vanMelbExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(バンクーバー|Vancouver|メルボルン|Melbourne|カナダ|オーストラリア)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'バンクーバーvsメルボルン徹底比較', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'バンクーバーvsメルボルン徹底比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              バンクーバーvsメルボルン徹底比較｜どっちが自分向き？
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="ワーホリ・留学先で都市選びに迷っている方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              カナダのバンクーバーとオーストラリアのメルボルンは、共にワーホリ・留学先として人気No.1〜2を争う2大都市。どちらも治安◎・英語環境◎・観光都市ですが、生活費・気候・仕事・日本人比率には明確な違いがあります。
              <br />
              この記事では8項目で徹底比較、あなたに合うのはどっちか診断します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '稼ぎたいならメルボルン（時給世界トップ）',
              '生活しやすさならバンクーバー（日本食材・コミュニティ）',
              '気候はほぼ同等、両方とも治安は超優秀',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 比較表 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">一目で分かる8項目比較表</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-2 py-2 text-left">項目</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">バンクーバー</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">メルボルン</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">優位</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.vancouver}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.melbourne}</td>
                      <td className="border border-gray-200 px-2 py-2 text-primary-700 text-xs">{c.winner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 生活費 */}
          <section id="livecost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">生活費の違い</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              月間生活費の内訳を項目別で比較（1CAD=110円・1AUD=100円換算）。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">項目</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">バンクーバー</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">メルボルン</th>
                  </tr>
                </thead>
                <tbody>
                  {LIVECOST_DETAIL.map((l, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{l.item}</td>
                      <td className="border border-gray-200 px-3 py-2">{l.vancouver}</td>
                      <td className="border border-gray-200 px-3 py-2">{l.melbourne}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 月総額：バンクーバー約20〜28万円、メルボルン約22〜30万円（為替により変動）
            </p>
          </section>

          {/* 気候 */}
          <section id="climate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">気候・季節の違い</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-sky-800">🌧️ バンクーバー</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・温暖湿潤気候、冬は雨多い</li>
                  <li>・冬5度、夏22度、年較差小</li>
                  <li>・雪は稀、スキー場は山岳部</li>
                  <li>・10月〜4月は雨季、要レインコート</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-amber-800">☀️ メルボルン</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・「1日4回季節が変わる」と言われる変動気候</li>
                  <li>・冬10度、夏25度、四季明瞭</li>
                  <li>・降水量はバンクーバーの半分</li>
                  <li>・南半球で日本と逆季節</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他都市との比較も"
            description="トロント vs バンクーバー、メルボルンでのバリスタ職、それぞれの詳細も合わせて。"
            primaryHref="/toronto-vs-vancouver"
            primaryLabel="トロントvsバンクーバー比較"
            secondaryHref="/melbourne-barista"
            secondaryLabel="メルボルンでバリスタ"
          />

          {/* 仕事 */}
          <section id="jobs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">仕事・給与水準の違い</h2>
            <div className="space-y-3">
              {JOB_COMPARE.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{j.city}</p>
                  <div className="text-sm space-y-1">
                    <p><strong>最低時給:</strong> {j.minWage}</p>
                    <p><strong>カジュアル平均:</strong> {j.avg}</p>
                    <p><strong>定番職種:</strong> {j.jobs}</p>
                    <p className="text-xs text-gray-600 leading-relaxed mt-2">{j.feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 治安 */}
          <section id="safety" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">治安・日本人比率</h2>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                両都市とも世界の「住みやすい都市ランキング」常連で治安は世界トップクラス。差は微妙な点に：
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・<strong>バンクーバー:</strong> 中心部一部にホームレス問題（Downtown Eastside）、夜の通り選びに注意</li>
                <li>・<strong>メルボルン:</strong> 全体的に治安◎、観光地のスリ・置き引きには警戒</li>
                <li>・<strong>日本人比率:</strong> バンクーバー約2-3万人、メルボルン約1-1.5万人（人口比でバンクーバーが3倍）</li>
              </ul>
            </div>
          </section>

          {/* 英語 */}
          <section id="language" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語環境（訛り・通用度）</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-1 text-primary-700">バンクーバー</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  北米英語（カナダ英語）。米国英語に近く標準的、日本人にとって聞き取りやすい。
                  ただし日本人多のため英語を使わなくても生活OK→英語力UPの環境作りには工夫必要。
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-1 text-primary-700">メルボルン</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  オーストラリア英語。独特の訛り（「mate」「g&apos;day」等）と母音発音差あり。
                  日本人少のため英語に没頭できる環境、TOEIC・IELTS でも通用するレベルに到達しやすい。
                </p>
              </div>
            </div>
          </section>

          {/* 診断 */}
          <section id="who-for" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">あなたはどっち向き？診断</h2>
            <div className="space-y-3">
              {WHO_FOR.map((w, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="font-bold text-base mb-2 text-primary-700">{w.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2"><strong>こんな人:</strong> {w.profile}</p>
                  <p className="text-xs text-gray-500"><strong>理由:</strong> {w.reason}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                バンクーバー・メルボルン渡航者の体験談 <strong>n={vanMelbExperiences.length}件</strong>。
                両都市関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 物価・給与・為替は2026年5月時点の情報です。最新情報は現地公式情報をご参照ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/toronto-vs-vancouver" className="text-primary-600 hover:underline">→ トロントvsバンクーバー比較</Link></li>
              <li><Link href="/melbourne-barista" className="text-primary-600 hover:underline">→ メルボルンでバリスタ</Link></li>
              <li><Link href="/vancouver-language-school" className="text-primary-600 hover:underline">→ バンクーバー語学学校</Link></li>
              <li><Link href="/sydney-sharehouse" className="text-primary-600 hover:underline">→ シドニーシェアハウス</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
