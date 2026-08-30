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

const PAGE_PATH = '/au-vs-canada';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーストラリアvsカナダ徹底比較｜気候・時給・ビザ・治安｜あなたはどっち向き？',
  description: 'ワーホリ2大人気国オーストラリアとカナダを8項目で徹底比較。気候・時給・ビザ・治安・日本人比率・PR取りやすさまで網羅。タイプ別おすすめ診断付き。',
  path: PAGE_PATH,
  keywords: [
    'オーストラリア カナダ 比較',
    'ワーホリ どこ',
    'ワーホリ オーストラリア カナダ',
    'カナダ vs オーストラリア',
    'ワーホリ 国 選び方',
    'ワーホリ おすすめ国',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '一目で分かる8項目比較表' },
  { id: 'visa', label: 'ビザの違い（先着 vs 抽選）' },
  { id: 'climate', label: '気候・季節の違い' },
  { id: 'salary', label: '時給・物価の違い' },
  { id: 'safety', label: '治安・日本人比率' },
  { id: 'language', label: '英語環境（訛り・通用度）' },
  { id: 'pr-path', label: 'PR取りやすさの違い' },
  { id: 'who-for', label: 'あなたはどっち向き？診断' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COMPARISON_TABLE = [
  { item: '時給（最低）', australia: 'AUD 24.10（約2,500円）', canada: 'CAD 17.40（約1,900円）', winner: '豪圧勝' },
  { item: '月生活費', australia: 'AUD 2,000-2,800', canada: 'CAD 1,800-2,500', winner: 'やや加安' },
  { item: '気候', australia: '温暖・四季なし（南半球）', canada: '冬厳しい・夏快適', winner: '豪有利' },
  { item: 'ビザ取得', australia: '先着＝確実', canada: 'IEC抽選式', winner: '豪圧勝' },
  { item: '滞在期間', australia: '最大3年（セカンド＋3rd）', canada: '最大2年（IEC満了）', winner: '豪有利' },
  { item: '日本人比率', australia: '中（特にシドニー）', canada: '高（バンクーバー多）', winner: 'やや豪英語◎' },
  { item: '治安', australia: '◎', canada: '◎', winner: '同等' },
  { item: 'PR取りやすさ', australia: '★★★（職種選定要）', canada: '★★★★（Express Entry）', winner: '加有利' },
];

const VISA_COMPARE = [
  {
    country: 'オーストラリア',
    visa: 'Working Holiday Visa（Subclass 417）',
    quota: '無制限・先着順',
    age: '18-30歳',
    duration: '1年（セカンド+1年、3rd+1年）',
    cost: 'AUD 685',
    detail: '申請から発行2-4週間、確実に取得可',
  },
  {
    country: 'カナダ',
    visa: 'IEC Working Holiday',
    quota: '年6,500枠・抽選式',
    age: '18-30歳',
    duration: '1〜2年（条件により）',
    cost: 'CAD 168',
    detail: '応募開始タイミング限定、3割の人は当選しない',
  },
];

const CLIMATE_COMPARE = [
  { city: 'シドニー', winter: '夏（12-2月）25-30度', summer: '冬（6-8月）10-15度', detail: '年中温暖、雪なし、ビーチアクセス◎' },
  { city: 'メルボルン', winter: '夏（12-2月）20-35度', summer: '冬（6-8月）5-12度', detail: '変動激、夏暑く冬寒い、四季感じる' },
  { city: 'バンクーバー', winter: '冬5度・雨多', summer: '夏15-22度', detail: '温暖湿潤、冬雨季、雪少なめ' },
  { city: 'トロント', winter: '冬-10度・雪多', summer: '夏20-28度', detail: '四季明瞭、冬厳しい、夏快適' },
];

const SALARY_COMPARE = [
  { item: '最低時給', australia: 'AUD 24.10（約2,500円）', canada: 'CAD 17.40（約1,900円）' },
  { item: 'カフェ・接客', australia: 'AUD 28-34', canada: 'CAD 17-22' },
  { item: 'バリスタ', australia: 'AUD 28-34＋週末1.5-2倍', canada: 'CAD 17-22＋チップ' },
  { item: 'ファーム', australia: 'AUD 25-32（出来高制で週$1,000-1,500）', canada: 'CAD 17-25' },
  { item: 'オフィスワーク', australia: 'AUD 32-50（年収50-90万豪ドル）', canada: 'CAD 22-35' },
];

const PR_COMPARE = [
  {
    country: 'オーストラリア',
    system: '点数制（GSM）＋雇用主スポンサー＋州指名',
    time: '4-5年が一般的',
    age: '申請時45歳未満',
    feature: 'IELTS 7+必須、職種限定、英語要件厳格',
  },
  {
    country: 'カナダ',
    system: 'Express Entry（点数制）＋PNP（州指名）＋雇用主LMIA',
    time: '2-4年と速い',
    age: '申請時45歳未満（年齢点数35歳まで最大）',
    feature: 'CRS点数制、英語IELTS 6+で十分なケース多、職歴重視',
  },
];

const WHO_FOR = [
  {
    type: 'オーストラリア向き',
    profile: '稼ぎたい・暖かい気候好き・確実にビザ取得したい・3年滞在希望',
    reason: '時給世界トップ・先着ビザ・セカンド+3rdで3年滞在可能・気候安定',
  },
  {
    type: 'カナダ向き',
    profile: 'PR取得目標・北米英語好み・冬の景色好き・多文化体験',
    reason: 'Express EntryでPR比較的速い・北米英語標準・多文化国家・自然絶景',
  },
  {
    type: '両方検討すべき人',
    profile: '英語上達＋海外経験＋稼ぎたい一般的なワーホリ志望者',
    reason: '両国とも治安◎・英語環境◎。1年豪→次1年加というハイブリッドも',
  },
];

const FAQS = [
  {
    question: 'どっちが先に行くべき？',
    answer:
      'ビザの取りやすさで決めるなら豪先。豪は無制限の先着順で確実、カナダは抽選で3割が落選するため。豪WH中にIEC応募→当選したら次にカナダ、というハイブリッドルートが理想。年齢ギリギリ（29-30歳）なら両国同時応募で保険を。',
  },
  {
    question: '時給高い豪の方が稼げる？',
    answer:
      '一般的には豪。最低時給がAUD 24.10（約2,500円）と世界トップクラス、週末・祝日は1.5-2倍。カナダは時給CAD 17.40（約1,900円）で、稼ぎ重視なら豪。ただし豪は物価も高めなので、貯金率では大差ないことも。',
  },
  {
    question: '将来PR取りたいならどっち？',
    answer:
      'カナダの方が取りやすい。Express Entry（CRS点数制）は2-4年でPR取得可能、英語要件もIELTS 6+で十分なケース多。豪は4-5年＋IELTS 7+必須＋職種限定＋競争激しい。「英語苦手でも長期滞在したい」ならカナダ有利。',
  },
  {
    question: '日本食材・コミュニティはどっち豊富？',
    answer:
      'カナダ（特にバンクーバー）。日本食材店（フジヤ、コンビニヤ）・日系企業・日本語サポートが充実。豪はシドニーが日系コミュニティ強いが、日本食材は限定的。日本食大好き・日本人コミュニティ重視ならカナダ、英語没頭重視なら豪。',
  },
  {
    question: '気候を重視するならどっち？',
    answer:
      '豪が圧勝。年中暖かく、シドニーは冬でも10-15度。カナダのトロント・モントリオールは冬-15度＋雪。寒さが苦手ならカナダのバンクーバー（冬5度）か豪のシドニー・ブリスベン。気候安定性なら豪、四季体験ならカナダ。',
  },
];

export default async function AuVsCanadaPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ausCanExperiences = all.filter(
    (e) => e.country?.id === 'australia' || e.country?.id === 'canada'
  );
  const mentions = countMentions(all, /(オーストラリア|Australia|カナダ|Canada)/i);
  const sample = ausCanExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(オーストラリア|Australia|カナダ|Canada)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーストラリアvsカナダ徹底比較', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーストラリアvsカナダ徹底比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーストラリアvsカナダ徹底比較｜あなたはどっち向き？
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ワーホリ先で2大人気国どちらに行くか迷っている方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリ2大人気国のオーストラリアとカナダ。どちらも治安◎・英語環境◎・観光大都市ですが、ビザ取得難易度・時給・気候・PR取りやすさには明確な違いがあります。
              <br />
              この記事では8項目で徹底比較、自分に合うのはどちらか診断します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '稼ぎたい＋確実に行きたいなら豪、PR目標＋多文化体験ならカナダ',
              '豪は時給世界トップ＋先着ビザ＋3年滞在可',
              'カナダはExpress EntryでPR比較的速い＋北米英語',
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
                    <th className="border border-gray-200 px-2 py-2 text-left">オーストラリア</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">カナダ</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">優位</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.australia}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.canada}</td>
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
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ビザ取得の難易度は天と地ほど違います。
            </p>
            <div className="space-y-3">
              {VISA_COMPARE.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{v.country}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>ビザ名:</strong> {v.visa}</p>
                    <p><strong>定員:</strong> <span className="text-rose-700 font-bold">{v.quota}</span></p>
                    <p><strong>年齢:</strong> {v.age}</p>
                    <p><strong>滞在期間:</strong> {v.duration}</p>
                    <p><strong>費用:</strong> {v.cost}</p>
                    <p className="text-xs text-gray-500 mt-2">{v.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 気候 */}
          <section id="climate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">気候・季節の違い</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">都市</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">夏</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">冬</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {CLIMATE_COMPARE.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.city}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.winter}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.summer}</td>
                      <td className="border border-gray-200 px-3 py-2 text-xs">{c.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="各国の都市比較も合わせて"
            description="シドニーvsメルボルン、トロントvsバンクーバー等、都市レベルの比較も。"
            primaryHref="/sydney-vs-melbourne"
            primaryLabel="シドニーvsメルボルン"
            secondaryHref="/toronto-vs-vancouver"
            secondaryLabel="トロントvsバンクーバー"
          />

          {/* 時給 */}
          <section id="salary" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">時給・物価の違い</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">職種</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">オーストラリア</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">カナダ</th>
                  </tr>
                </thead>
                <tbody>
                  {SALARY_COMPARE.map((s, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{s.item}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700">{s.australia}</td>
                      <td className="border border-gray-200 px-3 py-2">{s.canada}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 治安 */}
          <section id="safety" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">治安・日本人比率</h2>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                両国とも世界トップクラスの治安。差は微妙：
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・<strong>豪:</strong> シドニー・メルボルンの一部歓楽街の深夜のみ警戒</li>
                <li>・<strong>加:</strong> バンクーバーDowntown Eastside・トロント夜の地下鉄に注意</li>
                <li>・<strong>日本人比率:</strong> 豪3-5万人（人口比0.2%）、加5-7万人（人口比0.2%）。バンクーバーは特に多</li>
              </ul>
            </div>
          </section>

          {/* 英語 */}
          <section id="language" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語環境（訛り・通用度）</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-1 text-primary-700">オーストラリア英語</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  独特の訛り（「mate」「gday」等）と母音差。最初は聞き取り難、慣れれば味がある。
                  メルボルンは日本人少めで英語環境◎、シドニーは日本人多めで英語環境やや弱。
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-1 text-primary-700">カナダ英語</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  北米標準英語、米国英語に近い。日本人にとって聞き取りやすい。
                  バンクーバーは日本人多くマンツーマン環境、トロントは多文化で英語環境◎。
                </p>
              </div>
            </div>
          </section>

          {/* PR */}
          <section id="pr-path" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">PR取りやすさの違い</h2>
            <div className="space-y-3">
              {PR_COMPARE.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{p.country}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>システム:</strong> {p.system}</p>
                    <p><strong>所要期間:</strong> {p.time}</p>
                    <p><strong>年齢制限:</strong> {p.age}</p>
                    <p className="text-xs text-gray-500 mt-2">{p.feature}</p>
                  </div>
                </div>
              ))}
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
                豪・加渡航者の体験談 <strong>n={ausCanExperiences.length}件</strong>。
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
            ※ 時給・物価・ビザ要件は2026年5月時点の情報です。最新情報は各国公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/sydney-vs-melbourne" className="text-primary-600 hover:underline">→ シドニーvsメルボルン</Link></li>
              <li><Link href="/toronto-vs-vancouver" className="text-primary-600 hover:underline">→ トロントvsバンクーバー</Link></li>
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ</Link></li>
              <li><Link href="/au-second-year-visa" className="text-primary-600 hover:underline">→ 豪WHセカンドビザ</Link></li>
              <li><Link href="/au-pr-route" className="text-primary-600 hover:underline">→ 豪PR取得5ルート</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
