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

const PAGE_PATH = '/sydney-vs-melbourne';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'シドニーvsメルボルン徹底比較｜生活費・気候・仕事・治安｜あなたはどっち？',
  description: 'オーストラリア2大都市シドニーとメルボルンを8項目で徹底比較。生活費・気候・仕事・治安・日本人比率・カルチャーまで網羅。タイプ別おすすめ診断付き。',
  path: PAGE_PATH,
  keywords: [
    'シドニー メルボルン 比較',
    'シドニー vs メルボルン',
    'オーストラリア どこ',
    'シドニー メルボルン どっち',
    'ワーホリ オーストラリア 都市',
    '留学 シドニー メルボルン',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '一目で分かる8項目比較表' },
  { id: 'livecost', label: '生活費の違い' },
  { id: 'climate', label: '気候・季節の違い' },
  { id: 'jobs', label: '仕事・カフェ文化の違い' },
  { id: 'safety', label: '治安・日本人比率' },
  { id: 'culture', label: 'カルチャー・夜遊び' },
  { id: 'who-for', label: 'あなたはどっち向き？診断' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COMPARISON_TABLE = [
  { item: '月生活費', sydney: 'AUD 2,500〜3,500', melbourne: 'AUD 2,000〜2,800', winner: 'メルボルン安' },
  { item: '家賃（シェア）', sydney: 'AUD 1,000〜1,600', melbourne: 'AUD 800〜1,300', winner: 'メルボルン安' },
  { item: '時給', sydney: 'AUD 28〜34', melbourne: 'AUD 28〜34', winner: '同等' },
  { item: '気候', sydney: '夏暑い・冬温暖', melbourne: '四季明瞭・変動激', winner: 'シドニー安定' },
  { item: '日本人比率', sydney: '中（最多）', melbourne: '中〜少', winner: 'メルボルン英語環境' },
  { item: '治安', sydney: '◎', melbourne: '◎', winner: '同等' },
  { item: 'カフェ文化', sydney: '○（観光地系）', melbourne: '◎（世界一）', winner: 'メルボルン圧勝' },
  { item: 'ビーチアクセス', sydney: '◎（Bondiまで30分）', melbourne: '○（St Kildaまで40分）', winner: 'シドニー圧勝' },
];

const LIVECOST_DETAIL = [
  { item: '家賃（シェア）', sydney: 'AUD 1,000〜1,600', melbourne: 'AUD 800〜1,300' },
  { item: '食費（自炊中心）', sydney: 'AUD 400〜500', melbourne: 'AUD 350〜450' },
  { item: '交通（月パス）', sydney: 'AUD 180〜220', melbourne: 'AUD 150〜180' },
  { item: '通信（携帯）', sydney: 'AUD 30〜45', melbourne: 'AUD 30〜45' },
  { item: '保険・娯楽', sydney: 'AUD 450〜700', melbourne: 'AUD 400〜600' },
];

const JOB_CULTURE = [
  {
    city: 'シドニー',
    feature: '観光業・ホスピタリティ・オフィスワーク多。日系企業多数',
    cafe: 'スペシャルティコーヒー文化あるが観光地中心、求人はメルボルンより少',
  },
  {
    city: 'メルボルン',
    feature: 'カフェ業界が世界トップクラス。バリスタ職の聖地',
    cafe: '人口比カフェ密度世界5位。バリスタ求人数千件、給与水準も高い',
  },
];

const WHO_FOR = [
  {
    type: 'シドニー向き',
    profile: 'ビーチ＆都市が両立した暮らし好き・観光地的雰囲気重視・日系企業就職希望',
    reason: 'Bondi/Manly等のビーチアクセス神・象徴的なオペラハウス・気候安定',
  },
  {
    type: 'メルボルン向き',
    profile: 'カフェ文化好き・アート/音楽愛好家・コスパ良く稼ぎたい人',
    reason: 'カフェ密度世界トップ・家賃15-20%安・カルチャーシーン充実',
  },
  {
    type: '両方検討すべき人',
    profile: '英語上達＋オーストラリア生活を経験したい一般的なワーホリ志望者',
    reason: '両都市とも治安◎・時給◎・英語環境◎。好み次第',
  },
];

const FAQS = [
  {
    question: '結局どっちが住みやすい？',
    answer:
      '個人の優先順位次第ですが、コスパならメルボルン、ビーチ＆観光ならシドニー。家賃が約15-20%安いメルボルンの方が貯金しやすい一方、シドニーはBondiビーチへのアクセス・国際的雰囲気が圧倒的。「自然＋都市」を求めるならシドニー、「カルチャー＋稼ぎ」ならメルボルン。',
  },
  {
    question: '仕事はどちらが見つかりやすい？',
    answer:
      'ほぼ同等ですが、メルボルンの方がカフェ・バリスタ求人が圧倒的に多い。シドニーはホテル・観光・接客系が豊富、日系企業オフィスワーク求人もシドニーが多い。バリスタ希望ならメルボルン、ホスピタリティならシドニー。',
  },
  {
    question: '日本人が少ないのはどっち？',
    answer:
      'メルボルンの方が日本人比率が低い傾向（人口比で約半分）。シドニーは古くからの日系コミュニティが大きく、日本食材店・日系企業・日本語サポートが充実。英語に没頭したいならメルボルン、日本人ネットワーク重視ならシドニー。',
  },
  {
    question: '気候はどっちが過ごしやすい？',
    answer:
      '体感的にはシドニー。年間を通して温暖（冬10度、夏25度）で安定。メルボルンは「1日4回季節が変わる」と言われ、変動が激しい（冬5度、夏35度に達することも）。シドニーは年中半袖いける日多い、メルボルンは厚着＋薄着の両方が必要。',
  },
  {
    question: '初めての海外生活ならどっち？',
    answer:
      'シドニー推奨。日系コミュニティ充実・気候安定・観光地的雰囲気で初心者の心理的ハードルが低い。慣れたらメルボルンに引っ越して英語環境に没頭、というルートを取る人も多い。一方で「最初から英語に振り切りたい」ならメルボルンスタートも有り。',
  },
];

export default async function SydneyVsMelbournePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const sydMelbExperiences = all.filter(
    (e) =>
      e.country?.id === 'australia' &&
      /シドニー|Sydney|メルボルン|Melbourne/i.test(e.cityPrimary ?? '')
  );
  const mentions = countMentions(all, /(シドニー|Sydney|メルボルン|Melbourne)/i);
  const sample = sydMelbExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(シドニー|Sydney|メルボルン|Melbourne|オーストラリア)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'シドニーvsメルボルン徹底比較', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'シドニーvsメルボルン徹底比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              シドニーvsメルボルン徹底比較｜あなたはどっち？
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="オーストラリアでワーホリ・留学先の都市を決めたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              オーストラリア2大都市のシドニーとメルボルン。どちらもワーホリ・留学者に大人気ですが、生活費・気候・カフェ文化・日本人比率に明確な違いがあります。
              <br />
              この記事では8項目で徹底比較、自分に合う都市はどちらか診断します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '家賃はメルボルンが約15-20%安い、月20-30万円の生活費差',
              'ビーチアクセスならシドニー、カフェ文化ならメルボルン',
              '日本人比率はメルボルンの方が低く英語環境◎',
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
                    <th className="border border-gray-200 px-2 py-2 text-left">シドニー</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">メルボルン</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">優位</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.sydney}</td>
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
              月間生活費の内訳を項目別に比較。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">項目</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">シドニー</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">メルボルン</th>
                  </tr>
                </thead>
                <tbody>
                  {LIVECOST_DETAIL.map((l, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{l.item}</td>
                      <td className="border border-gray-200 px-3 py-2">{l.sydney}</td>
                      <td className="border border-gray-200 px-3 py-2">{l.melbourne}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 月総額：シドニー約25〜35万円、メルボルン約20〜28万円（1AUD=100円換算）
            </p>
          </section>

          {/* 気候 */}
          <section id="climate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">気候・季節の違い</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-sky-800">🌞 シドニー</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・温暖湿潤気候、年中暖かい</li>
                  <li>・冬10度、夏25度、安定的</li>
                  <li>・降水量年1,200mm、雨季は1-3月</li>
                  <li>・ビーチアクセス神（Bondiまで30分）</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-amber-800">🌤️ メルボルン</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・「1日4回季節が変わる」と言われる変動気候</li>
                  <li>・冬5度、夏35度、振れ幅大</li>
                  <li>・降水量年650mm（シドニーの半分）</li>
                  <li>・ビーチは少し遠い（St Kildaまで40分）</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他都市との比較も"
            description="バンクーバーとの比較、メルボルンでのバリスタ職、シドニーのシェアハウス情報も合わせて。"
            primaryHref="/vancouver-vs-melbourne"
            primaryLabel="バンクーバーvsメルボルン"
            secondaryHref="/sydney-sharehouse"
            secondaryLabel="シドニーのシェアハウス"
          />

          {/* 仕事 */}
          <section id="jobs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">仕事・カフェ文化の違い</h2>
            <div className="space-y-3">
              {JOB_CULTURE.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{j.city}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2"><strong>業界傾向:</strong> {j.feature}</p>
                  <p className="text-sm text-gray-700 leading-relaxed"><strong>カフェ:</strong> {j.cafe}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 治安 */}
          <section id="safety" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">治安・日本人比率</h2>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                両都市とも世界の「住みやすい都市ランキング」常連で治安は世界トップクラス。
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・<strong>シドニー:</strong> 全体的に安全、Kings Cross等の歓楽街は深夜のみ警戒</li>
                <li>・<strong>メルボルン:</strong> 同様に安全、駅周辺の置き引きには注意</li>
                <li>・<strong>日本人比率:</strong> シドニー約3-4万人、メルボルン約1.5-2万人</li>
              </ul>
            </div>
          </section>

          {/* カルチャー */}
          <section id="culture" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">カルチャー・夜遊び</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">シドニー</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  オペラハウス・ハーバーブリッジを中心とした世界的観光都市。ビーチ文化（Bondi、Manly）と都会の融合。
                  夜遊びはKings Cross・Newtown中心、ライブミュージックシーン充実。
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">メルボルン</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  アート・音楽・カフェ文化の中心。Fitzroy・Brunswick等のヒップエリアが若者の聖地。
                  Laneway（路地裏のバー・カフェ群）独特の魅力、ライブミュージックシーン全豪トップ。
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
                シドニー・メルボルン渡航者の体験談 <strong>n={sydMelbExperiences.length}件</strong>。
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
              <li><Link href="/vancouver-vs-melbourne" className="text-primary-600 hover:underline">→ バンクーバーvsメルボルン</Link></li>
              <li><Link href="/toronto-vs-vancouver" className="text-primary-600 hover:underline">→ トロントvsバンクーバー</Link></li>
              <li><Link href="/melbourne-barista" className="text-primary-600 hover:underline">→ メルボルンでバリスタ</Link></li>
              <li><Link href="/sydney-sharehouse" className="text-primary-600 hover:underline">→ シドニーのシェアハウス</Link></li>
              <li><Link href="/australia-jobs" className="text-primary-600 hover:underline">→ オーストラリア仕事探し方</Link></li>
              <li><Link href="/countries/australia" className="text-primary-600 hover:underline">→ オーストラリア国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
