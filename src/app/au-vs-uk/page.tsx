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

const PAGE_PATH = '/au-vs-uk';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーストラリアvsイギリス徹底比較｜ビザ・物価・時給・気候｜どっち？',
  description: 'オーストラリアvsイギリスを8項目で徹底比較。ビザ取得難易度・物価・時給・気候・治安・英語まで網羅。タイプ別おすすめ診断付き。',
  path: PAGE_PATH,
  keywords: [
    'オーストラリア イギリス 比較',
    '豪 英 ワーホリ',
    'YMS WHV どっち',
    'オーストラリア vs UK',
    'ワーホリ 国 比較',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '一目で分かる8項目比較表' },
  { id: 'visa', label: 'ビザの違い（先着 vs 抽選）' },
  { id: 'cost', label: '物価・生活費' },
  { id: 'salary', label: '時給・仕事' },
  { id: 'climate', label: '気候・季節' },
  { id: 'english', label: '英語環境' },
  { id: 'travel', label: '周辺諸国へのアクセス' },
  { id: 'who-for', label: 'あなたはどっち向き？診断' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COMPARISON_TABLE = [
  { item: 'ビザ取得', au: '先着・無制限', uk: '抽選（年1,500枠）', winner: '豪圧勝' },
  { item: '時給（最低）', au: 'AUD 24.10', uk: '£11.44', winner: '豪わずか上' },
  { item: '月生活費', au: 'AUD 2,000-2,800', uk: '£1,200-2,000', winner: 'やや英安' },
  { item: '気候', au: '温暖・夏あり', uk: '冷涼・曇り多', winner: '豪有利' },
  { item: '治安', au: '◎', uk: '◎', winner: '同等' },
  { item: '英語', au: '独特訛り', uk: '本場標準', winner: 'UK圧勝' },
  { item: '周遊', au: 'オセアニア限定', uk: '欧州全域', winner: 'UK圧勝' },
  { item: '滞在期間', au: '最大3年（セカンド+3rd）', uk: '最大2年', winner: '豪有利' },
];

const COST_DETAIL = [
  { item: '家賃（シェア）', au: 'AUD 800-1,300', uk: '£600-1,200（ロンドン外）/ £900-1,500（ロンドン）' },
  { item: '食費', au: 'AUD 400-500', uk: '£250-400' },
  { item: '交通', au: 'AUD 150-180', uk: '£100-180（地方）/ £150-250（ロンドン）' },
  { item: '通信', au: 'AUD 30-45', uk: '£10-25' },
  { item: '娯楽', au: 'AUD 400-600', uk: '£300-500' },
];

const WHO_FOR = [
  {
    type: 'オーストラリア向き',
    profile: '確実にビザ取得・稼ぎたい・温暖な気候・3年滞在希望',
    reason: '先着ビザ・時給高・セカンド+3rdで3年滞在可・気候安定',
  },
  {
    type: 'イギリス向き',
    profile: '本場英語＋欧州周遊・歴史文化好き・抽選チャレンジOK',
    reason: '本場のクイーンズイングリッシュ・欧州周遊拠点・歴史的建造物',
  },
  {
    type: '両方検討すべき人',
    profile: '英語上達＋海外経験希望者',
    reason: '豪WHV確実取得→UK YMS抽選チャレンジのハイブリッドも',
  },
];

const FAQS = [
  {
    question: 'YMS抽選に外れたらどうする？',
    answer:
      '次回応募（1月/7月）で再挑戦＋豪WHVを保険で取得。または英語Student Visa（6ヶ月以内ビザ不要）で短期語学留学からスタート。豪WHV→UK YMS再挑戦のハイブリッドが現実的なルート。',
  },
  {
    question: '物価はどっちが高い？',
    answer:
      'ロンドンは豪都市より高、ロンドン外は豪より安。具体的にはロンドン家賃£1,000-1,500、シドニーAUD 1,500-1,800、マンチェスター・グラスゴーAUD 600-1,000。「ロンドン以外なら英安、ロンドンなら豪安」。',
  },
  {
    question: '本場の英語を学ぶならイギリス？',
    answer:
      'はい、英の方が「クイーンズイングリッシュ」本場。豪は独特の訛り（「mate」「gday」）。ただ豪英語も世界的に通用するため、上達後はどちらでもIELTS・TOEIC等で通用。学習効率はやや英の方が標準的。',
  },
  {
    question: '欧州周遊重視なら英？',
    answer:
      'はい、英は欧州周遊の最強拠点。Eurostar・LCC・夜行バスで欧州主要都市へ2-5時間。週末旅行で月1欧州他国可能。豪は遠いオセアニア・東南アジア中心、欧州遠征は高額航空券＋長時間。',
  },
  {
    question: 'PR取得目指すなら？',
    answer:
      '豪・英ともにPRルートあり。豪は雇用主スポンサー＋4年勤務、英はSkilled Worker Visa＋5年勤務。豪は職種選定厳しいがルート確立、英はBrexit以降変動中。長期計画なら豪の方が現実的。',
  },
];

export default async function AuVsUkPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ausUkExperiences = all.filter(
    (e) => e.country?.id === 'australia' || e.country?.id === 'united-kingdom'
  );
  const mentions = countMentions(all, /(オーストラリア|Australia|イギリス|UK|YMS)/i);
  const sample = ausUkExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(オーストラリア|Australia|イギリス|UK|YMS)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーストラリアvsイギリス徹底比較', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーストラリアvsイギリス徹底比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーストラリアvsイギリス徹底比較｜あなたはどっち向き？
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="ワーホリ先で英語圏先進国どちらに行くか迷っている方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              本場英語＋欧州周遊のイギリスと、稼げる＋温暖気候のオーストラリア。どちらも英語圏先進国の人気WH先ですが、ビザ取得難易度・物価・気候・周遊範囲に明確な違いがあります。
              <br />
              この記事では8項目で徹底比較、自分に合うのはどちらか診断します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'ビザ取得の確実性は豪（先着）、英は抽選で3割落選',
              '本場英語＋欧州周遊なら英、稼ぎ＋温暖気候なら豪',
              '豪WHVを保険＋英YMS抽選チャレンジのハイブリッド推奨',
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
                    <th className="border border-gray-200 px-2 py-2 text-left">豪</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">英</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">優位</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.au}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.uk}</td>
                      <td className="border border-gray-200 px-2 py-2 text-primary-700 text-xs">{c.winner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ビザ */}
          <section id="visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザの違い（先着 vs 抽選）</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇦🇺 オーストラリアWHV（417）</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>・<strong>定員:</strong> 無制限・先着順</li>
                  <li>・<strong>年齢:</strong> 18-30歳</li>
                  <li>・<strong>滞在:</strong> 1年（セカンド+1年、3rd+1年で最大3年）</li>
                  <li>・<strong>申請料:</strong> AUD 685</li>
                  <li>・<strong>発行:</strong> 2-4週間で確実</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇬🇧 UK YMS</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>・<strong>定員:</strong> 年1,500人（1月1,000＋7月500）</li>
                  <li>・<strong>年齢:</strong> 18-30歳</li>
                  <li>・<strong>滞在:</strong> 2年</li>
                  <li>・<strong>申請料:</strong> £298 + IHS£940/年</li>
                  <li>・<strong>当選率:</strong> 2.5-4倍の抽選</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 物価 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">物価・生活費</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">項目</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">豪</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">英</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_DETAIL.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.au}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.uk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="UK YMS抽選当選のコツも合わせて"
            description="抽選で3割落選するYMSの当選率を上げる7つのコツを完全解説。"
            primaryHref="/uk-yms-lottery-tips"
            primaryLabel="UK YMS抽選当選コツ"
            secondaryHref="/uk-yms-visa-guide"
            secondaryLabel="UK YMSビザ完全ガイド"
          />

          {/* 時給 */}
          <section id="salary" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">時給・仕事</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇦🇺 豪</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  最低時給AUD 24.10（約2,500円）、カジュアル平均AUD 28-34。世界トップクラス。週末・祝日は1.5-2倍。
                  仕事数多、特にカフェ・接客・ファーム求人豊富。
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇬🇧 英</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  最低時給£11.44（約2,200円）、カジュアル£12-18。
                  ロンドンの観光業・接客・小売中心、ファーム少。ホスピタリティに強み。
                </p>
              </div>
            </div>
          </section>

          {/* 気候 */}
          <section id="climate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">気候・季節</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-amber-800">🇦🇺 豪</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・年中温暖、冬5-15度</li>
                  <li>・夏25-35度、ビーチ満喫</li>
                  <li>・南半球で日本と逆季節</li>
                  <li>・年中アウトドア可能</li>
                </ul>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-sky-800">🇬🇧 英</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・冷涼・曇り多、冬2-7度</li>
                  <li>・夏15-22度、過ごしやすい</li>
                  <li>・北半球で日本と同季節</li>
                  <li>・冬は日照時間短い（鬱症状注意）</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 英語 */}
          <section id="english" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語環境</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇦🇺 豪英語</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  独特の訛り（「mate」「gday」、母音差）、最初は聞き取り難。
                  ただ世界的に通用、IELTS・TOEIC等の評価でも問題なし。
                  メルボルンは日本人少、シドニーは多。
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇬🇧 英国英語</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  「クイーンズイングリッシュ」本場、学校教育の標準英語。
                  ローカルは地方訛り（コックニー、スコティッシュ等）あり。
                  ロンドンは多文化で多様な英語に触れる。
                </p>
              </div>
            </div>
          </section>

          {/* 周遊 */}
          <section id="travel" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">周辺諸国へのアクセス</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-amber-800">🇦🇺 豪</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・NZ：3-4時間€</li>
                  <li>・東南アジア：6-8時間€</li>
                  <li>・日本：9-10時間€</li>
                  <li>・欧州：20時間超、高額</li>
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-emerald-800">🇬🇧 英</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・欧州主要都市：1-3時間€、LCC安</li>
                  <li>・パリ：Eurostar 2.5時間</li>
                  <li>・アイルランド：1時間€</li>
                  <li>・日本：12時間€</li>
                </ul>
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
                豪・英渡航者の体験談 <strong>n={ausUkExperiences.length}件</strong>。
                両国関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ ビザ要件・時給・物価は2026年5月時点の情報です。最新情報は各国公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/uk-yms-visa-guide" className="text-primary-600 hover:underline">→ UK YMSビザ完全ガイド</Link></li>
              <li><Link href="/uk-yms-lottery-tips" className="text-primary-600 hover:underline">→ UK YMS抽選当選コツ</Link></li>
              <li><Link href="/au-vs-canada" className="text-primary-600 hover:underline">→ 豪vsカナダ比較</Link></li>
              <li><Link href="/aus-vs-newzealand" className="text-primary-600 hover:underline">→ 豪vs NZ比較</Link></li>
              <li><Link href="/au-second-year-visa" className="text-primary-600 hover:underline">→ 豪WHセカンドビザ</Link></li>
              <li><Link href="/europe-budget-travel" className="text-primary-600 hover:underline">→ 欧州周遊予算術</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
