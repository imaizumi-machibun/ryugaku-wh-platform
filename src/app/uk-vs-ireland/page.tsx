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

const PAGE_PATH = '/uk-vs-ireland';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'イギリスvsアイルランド徹底比較｜ビザ・物価・気候・英語｜どっち？',
  description: '英語圏ヨーロッパ2大国の英vs愛を8項目で徹底比較。ビザ取得・物価・気候・治安・英語・PR取得まで網羅。タイプ別おすすめ診断付き。',
  path: PAGE_PATH,
  keywords: [
    'イギリス アイルランド 比較',
    'UK vs Ireland',
    'ロンドン ダブリン',
    'YMS WHV 比較',
    '英 愛 ワーホリ',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '一目で分かる8項目比較表' },
  { id: 'visa', label: 'ビザ取得（YMS vs WHV）' },
  { id: 'cost', label: '物価・生活費' },
  { id: 'climate', label: '気候・季節' },
  { id: 'english', label: '英語環境（訛り）' },
  { id: 'culture', label: '文化・治安・人柄' },
  { id: 'pr-route', label: 'PR取得ルート' },
  { id: 'who-for', label: 'あなたはどっち向き？診断' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COMPARISON_TABLE = [
  { item: 'WHビザ', uk: 'YMS抽選（年1,500枠）', ie: 'WHV先着（年800枠）', winner: '愛先着易' },
  { item: '物価', uk: 'ロンドン高、地方安', ie: 'ダブリン高、地方安', winner: 'やや愛安' },
  { item: '気候', uk: '曇り多・冷涼', ie: '雨多・冷涼', winner: 'ほぼ同等' },
  { item: '治安', uk: '◎', ie: '◎', winner: '同等' },
  { item: '英語', uk: 'クイーンズイングリッシュ', ie: 'アイリッシュアクセント', winner: 'UK標準' },
  { item: '日本人比率', uk: '中（ロンドン多）', ie: '少（隠れた留学先）', winner: '愛英語環境◎' },
  { item: 'EU内移動', uk: '不可（Brexit）', ie: '可（EU加盟）', winner: '愛圧勝' },
  { item: 'PR取得', uk: 'Skilled Worker 5年', ie: 'Stamp 4 5年', winner: 'ほぼ同等' },
];

const VISA_COMPARE = [
  {
    country: 'UK YMS',
    quota: '年1,500人（抽選）',
    age: '18-30歳',
    duration: '2年',
    cost: '£298＋IHS£940/年',
    feature: '抽選、当選率2.5-4倍',
  },
  {
    country: 'Ireland WHV',
    quota: '年800人（先着）',
    age: '18-30歳',
    duration: '1年',
    cost: '€345',
    feature: '先着、応募時期限定（年2-3回受付）',
  },
];

const COST_DETAIL = [
  { item: '家賃（シェア・首都）', uk: '£800-1,500（Zone 2-3）', ie: '€700-1,200（ダブリン中心部）' },
  { item: '食費', uk: '£250-400', ie: '€300-450' },
  { item: '交通', uk: '£100-180（Zone 1-3）', ie: '€100-150' },
  { item: '通信', uk: '£10-25', ie: '€20-35' },
  { item: '娯楽', uk: '£300-500', ie: '€300-500' },
];

const ENGLISH_COMPARE = [
  {
    country: 'UK英語',
    detail: 'クイーンズイングリッシュ＝世界標準英語の本場。学校・ビジネスは標準英語、地方訛り（コックニー・スコティッシュ）あり',
    forWho: 'IELTS・標準英語学習者、本場英語志望',
  },
  {
    country: 'Ireland英語',
    detail: 'アイリッシュアクセント、独特のリズム。慣れれば味があるが、最初は聞き取り難。スピーキング独特',
    forWho: 'アクセント面白さ重視、英語環境没頭希望',
  },
];

const WHO_FOR = [
  {
    type: 'イギリス向き',
    profile: '本場英語＋大都市生活＋欧州周遊（経由）希望',
    reason: 'クイーンズイングリッシュ本場・ロンドン都市生活・歴史文化',
  },
  {
    type: 'アイルランド向き',
    profile: '隠れた留学先＋日本人少＋EU内自由移動希望',
    reason: 'WHV先着・日本人少・EU加盟で欧州自由移動・温かい人柄',
  },
  {
    type: '両方検討すべき人',
    profile: '英語圏ヨーロッパでWH志望者',
    reason: 'UK YMS抽選＋Ireland WHVのハイブリッド戦略',
  },
];

const FAQS = [
  {
    question: 'YMS抽選に外れたらアイルランド？',
    answer:
      '十分な選択肢。アイルランドWHVは年800人の先着順、応募タイミング合えば確実取得。物価はUKより安、英語環境は同等以上、EU内自由移動も可。UK YMS抽選＋Ireland WHV両方準備するハイブリッド戦略がおすすめ。',
  },
  {
    question: 'アイルランド英語は聞き取り難しい？',
    answer:
      '最初の1-2ヶ月は戸惑う、3ヶ月で慣れる。アイリッシュアクセントは独特のリズム＋アクセント、英国英語に親しんだ人でも初対面は難しい。一方、学校・ビジネスは比較的標準英語、ローカルとの会話で訛り習得。卒業後は世界で通用するレベルに。',
  },
  {
    question: 'BrexitでUKとEUの行き来は？',
    answer:
      'YMS保持者でもEU入国時はパスポート審査必須。長期滞在は別ビザ必要。アイルランドはEU加盟継続、WHV保持者は欧州周遊が自由。週末欧州旅行・長期滞在等を考えるならアイルランドがメリット大。',
  },
  {
    question: '日本人少ないのはどっち？',
    answer:
      'アイルランド圧倒的に少ない。日本人比率はUK（ロンドン中心）の1/5程度、英語環境に没頭しやすい。一方UKは日本人ネットワーク充実、日本食材店・日系企業多。英語学習目的なら愛、安心感重視なら英。',
  },
  {
    question: 'PR取得のルートは？',
    answer:
      '両国とも5年のスキルワーカー就労後にPR申請（UK ILR、Ireland Stamp 4）。年収要件はUK £26,200、Ireland €30,000+。雇用主スポンサー確保＋英語要件＋職種選定が必要、5年計画で挑戦するキャリア構築の道。',
  },
];

export default async function UkVsIrelandPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ukIeExperiences = all.filter(
    (e) => e.country?.id === 'united-kingdom' || e.country?.id === 'ireland'
  );
  const mentions = countMentions(all, /(イギリス|UK|アイルランド|Ireland|ロンドン|ダブリン)/i);
  const sample = ukIeExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(イギリス|UK|アイルランド|Ireland|ロンドン|ダブリン)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'イギリスvsアイルランド徹底比較', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'イギリスvsアイルランド徹底比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              イギリスvsアイルランド徹底比較｜あなたはどっち向き？
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="英語圏ヨーロッパでWH/留学先を迷う方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              英語圏ヨーロッパ2大国のイギリスとアイルランド。同じ英語圏でも、ビザ取得・物価・英語の訛り・EU内自由移動などには明確な違いがあります。
              <br />
              この記事では8項目で徹底比較、自分に合うのはどちらか診断します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'UK YMS抽選で外れたらアイルランドWHVが選択肢',
              'アイルランドはEU加盟継続、欧州周遊有利',
              '本場英語ならUK、隠れた留学先＋英語没頭ならIreland',
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
                    <th className="border border-gray-200 px-2 py-2 text-left">UK</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">Ireland</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">優位</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.uk}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.ie}</td>
                      <td className="border border-gray-200 px-2 py-2 text-primary-700 text-xs">{c.winner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ビザ */}
          <section id="visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザ取得（YMS vs WHV）</h2>
            <div className="space-y-3">
              {VISA_COMPARE.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{v.country}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>定員:</strong> <span className="text-rose-700 font-bold">{v.quota}</span></p>
                    <p><strong>年齢:</strong> {v.age}</p>
                    <p><strong>滞在:</strong> {v.duration}</p>
                    <p><strong>費用:</strong> {v.cost}</p>
                    <p className="text-xs text-gray-500 mt-2">{v.feature}</p>
                  </div>
                </div>
              ))}
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
                    <th className="border border-gray-200 px-3 py-2 text-left">UK</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Ireland</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_DETAIL.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.uk}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.ie}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="UK YMS・アイルランドWH詳細も合わせて"
            description="各国のビザ取得詳細、生活費・働き方も確認を。"
            primaryHref="/uk-yms-visa-guide"
            primaryLabel="UK YMSビザ完全ガイド"
            secondaryHref="/ireland-wh"
            secondaryLabel="アイルランドワーホリ"
          />

          {/* 気候 */}
          <section id="climate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">気候・季節</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-sky-800">🇬🇧 UK</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・曇り多、雨も多</li>
                  <li>・冬2-7度、夏15-22度</li>
                  <li>・四季感じる、冬は日照時間短</li>
                  <li>・ロンドンは降雨頻度高</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-amber-800">🇮🇪 Ireland</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・雨多、緑豊か（エメラルド島）</li>
                  <li>・冬3-8度、夏15-20度</li>
                  <li>・年較差小、安定的</li>
                  <li>・天気変動激（1日4パターン）</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 英語 */}
          <section id="english" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語環境（訛り）</h2>
            <div className="space-y-3">
              {ENGLISH_COMPARE.map((e, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{e.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{e.detail}</p>
                  <p className="text-xs text-gray-500"><strong>こんな人向き:</strong> {e.forWho}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 文化 */}
          <section id="culture" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">文化・治安・人柄</h2>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                両国とも治安世界トップクラス、文化的にも豊か。
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・<strong>UK:</strong> 多文化・国際都市ロンドン、上品で堅実な国民性、パブ文化</li>
                <li>・<strong>Ireland:</strong> 温かく陽気な国民性、ギネスビール文化、音楽・祭典豊富</li>
                <li>・<strong>日本人への対応:</strong> 両国とも友好的、アイルランドは特に親しみやすい</li>
              </ul>
            </div>
          </section>

          {/* PR */}
          <section id="pr-route" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">PR取得ルート</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇬🇧 UK</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Skilled Worker Visa→5年勤務→ILR（PR）。年収£26,200+・指定職種・英語要件あり。
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇮🇪 Ireland</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Critical Skills Employment Permit→2年→Stamp 4（PR相当）。
                  年収€30,000+・職種リスト多、UKよりやや取りやすい印象。
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
                UK・愛渡航者の体験談 <strong>n={ukIeExperiences.length}件</strong>。
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
            ※ ビザ・物価は2026年5月時点の情報です。最新情報は各国公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/uk-yms-visa-guide" className="text-primary-600 hover:underline">→ UK YMSビザ完全ガイド</Link></li>
              <li><Link href="/countries/ireland/working-holiday" className="text-primary-600 hover:underline">→ アイルランドワーホリ</Link></li>
              <li><Link href="/uk-london-cost" className="text-primary-600 hover:underline">→ ロンドン生活費</Link></li>
              <li><Link href="/au-vs-uk" className="text-primary-600 hover:underline">→ 豪vs英比較</Link></li>
              <li><Link href="/europe-budget-travel" className="text-primary-600 hover:underline">→ 欧州周遊予算術</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
