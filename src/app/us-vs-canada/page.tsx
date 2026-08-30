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

const PAGE_PATH = '/us-vs-canada';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'アメリカvsカナダ徹底比較｜ビザ・物価・年収・移民｜留学・キャリアどっち？',
  description: '北米2大国の米vs加を8項目で徹底比較。F-1/H-1B vs IEC、年収・物価・治安・PR取得難易度まで完全解説。タイプ別おすすめ診断付き。',
  path: PAGE_PATH,
  keywords: [
    'アメリカ カナダ 比較',
    '米 加 留学',
    'US vs Canada',
    'アメリカ vs カナダ 移民',
    '北米 留学',
    'PR 取得 米 加',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '一目で分かる8項目比較表' },
  { id: 'visa', label: 'ビザ・移民難易度' },
  { id: 'cost', label: '物価・生活費' },
  { id: 'salary', label: '年収・仕事のチャンス' },
  { id: 'climate', label: '気候・季節' },
  { id: 'safety', label: '治安・銃規制' },
  { id: 'culture-medical', label: '文化・医療制度' },
  { id: 'who-for', label: 'あなたはどっち向き？診断' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COMPARISON_TABLE = [
  { item: 'ワーホリ', us: 'なし', ca: 'IEC（抽選）', winner: '加圧勝' },
  { item: '学生ビザ', us: 'F-1（厳格）', ca: 'Study Permit', winner: '加易' },
  { item: '就労ビザ', us: 'H-1B（抽選）', ca: 'LMIA・PNP', winner: '加易' },
  { item: 'PR取得', us: 'Green Card 5-15年', ca: 'Express Entry 2-4年', winner: '加圧勝' },
  { item: '年収（IT）', us: '$130-300k', ca: 'CAD 80-150k', winner: '米高' },
  { item: '物価', us: '高（特に大都市）', ca: '中程度', winner: '加安' },
  { item: '治安', us: '州により差大', ca: '◎', winner: '加優' },
  { item: '医療制度', us: '自費・高額', ca: '公的保険', winner: '加圧勝' },
];

const VISA_COMPARE = [
  {
    country: 'アメリカ',
    options: 'F-1（学生）→ OPT → H-1B → Green Card',
    feature: 'H-1B年85,000枠の抽選必須、競争率3-5倍。Green Card 5-15年',
    workVisa: 'H-1B（雇用主スポンサー＋抽選当選）',
  },
  {
    country: 'カナダ',
    options: 'IEC/Study Permit → LMIA/PNP → Express Entry → PR',
    feature: 'Express EntryでPR 2-4年、職種・年齢・英語の点数制',
    workVisa: 'LMIA（雇用主証明）or PNP（州指名）',
  },
];

const COST_DETAIL = [
  { item: '家賃（シェア・大都市）', us: '$1,200-3,000', ca: 'CAD 800-2,000' },
  { item: '食費（自炊中心）', us: '$400-700', ca: 'CAD 350-550' },
  { item: '交通（月パス）', us: '$80-150', ca: 'CAD 100-160' },
  { item: '医療保険（私費）', us: '$300-800', ca: 'CAD 60-100（私的のみ）' },
  { item: '通信', us: '$50-100', ca: 'CAD 35-60' },
];

const SALARY_BY_JOB = [
  { job: 'ITエンジニア', us: '$130,000-300,000', ca: 'CAD 80,000-150,000' },
  { job: '看護師', us: '$75,000-130,000', ca: 'CAD 65,000-90,000' },
  { job: 'マーケター', us: '$60,000-150,000', ca: 'CAD 55,000-100,000' },
  { job: 'カスタマーサポート', us: '$40,000-65,000', ca: 'CAD 38,000-55,000' },
  { job: 'カフェ・接客', us: '$25,000-45,000', ca: 'CAD 32,000-48,000' },
];

const WHO_FOR = [
  {
    type: 'アメリカ向き',
    profile: '年収最大化・最先端テック・GAFA志望・H-1B抽選チャレンジOK',
    reason: '年収日本の3-5倍・シリコンバレー＋NY＋シアトル・GAFA本社',
  },
  {
    type: 'カナダ向き',
    profile: 'PR取得目標・移民歓迎・安定キャリア・医療充実・治安◎',
    reason: 'Express EntryでPR 2-4年・公的医療・治安世界トップ・移民国家',
  },
  {
    type: '両方検討すべき人',
    profile: '北米キャリア＋PRを目指す志望者',
    reason: 'カナダPR取得→米国転職という二段階ルートも一般的',
  },
];

const FAQS = [
  {
    question: '結局どっちが住みやすい？',
    answer:
      '個人の優先順位次第。年収最大化・最先端テック志向ならアメリカ、PR取得・安定生活・治安◎ならカナダ。アメリカは年収高いが医療費・物価高＋ビザの不確実性大。カナダは年収やや低いが医療無料・PR取りやすい・治安最良。「移民の国」感はカナダの方が強い。',
  },
  {
    question: '将来PR取りたいならカナダ？',
    answer:
      'はい、カナダ圧勝。Express Entry CRS点数制で2-4年で取得可、IT・看護等の指定職種は更に有利。一方米国Green Cardは5-15年、抽選＋雇用主の長期サポート必要。「確実にPR取りたい」ならカナダ。',
  },
  {
    question: '年収最大化ならアメリカ？',
    answer:
      'はい、年収はシリコンバレーが世界トップ。ITエンジニアで日本の3-5倍（$130-300k）、看護師2倍（$75-130k）。ただし家賃$2,500-4,000＋医療保険$300-800＋税金高で、可処分所得は1.5-2倍に縮小。トロントの「年収は米より低いが生活費安＋PR取りやすい」とトレードオフ。',
  },
  {
    question: '医療制度の差は大きい？',
    answer:
      '極めて大。アメリカは公的保険なし、雇用主提供 or 自費保険必須。救急車だけで$2,000-3,000、虫垂炎手術$50,000等。カナダは公的保険（Medicare）で無料、待ち時間長いが安心。「医療費破産」リスクはアメリカの大きな課題、留学・WHでは海外保険必須。',
  },
  {
    question: '英語環境の差は？',
    answer:
      'ほぼ同等。両国とも北米英語、アメリカ英語標準。カナダはわずかにイギリス英語の影響あるがほぼアメリカ式。日本人にとって聞き取りやすさはほぼ同じ。多文化体験はバンクーバー・トロントが豪トロント・ニューヨーク・ロサンゼルスと同レベル。',
  },
];

export default async function UsVsCanadaPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const usCanExperiences = all.filter(
    (e) => e.country?.id === 'united-states' || e.country?.id === 'canada'
  );
  const mentions = countMentions(all, /(アメリカ|US|Canada|カナダ|北米)/i);
  const sample = usCanExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(アメリカ|US|Canada|カナダ|北米)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'アメリカvsカナダ徹底比較', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'アメリカvsカナダ徹底比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              アメリカvsカナダ徹底比較｜ビザ・物価・年収・移民
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="北米でキャリア・PR取得を目指す方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              北米2大国のアメリカとカナダ。同じ英語圏でも、ビザ・物価・年収・移民のしやすさには大きな違いがあります。
              <br />
              この記事では8項目で徹底比較、自分に合うのはどちらか診断します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '年収最大化・最先端テックなら米、PR・安定・治安なら加',
              'PR取得は加が圧勝（2-4年）vs 米（5-15年）',
              '医療制度の差は致命的、米国はWH/留学で海外保険必須',
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
                    <th className="border border-gray-200 px-2 py-2 text-left">米</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">加</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">優位</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.us}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.ca}</td>
                      <td className="border border-gray-200 px-2 py-2 text-primary-700 text-xs">{c.winner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ビザ */}
          <section id="visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザ・移民難易度</h2>
            <div className="space-y-3">
              {VISA_COMPARE.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{v.country}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>ルート:</strong> {v.options}</p>
                    <p><strong>就労ビザ:</strong> {v.workVisa}</p>
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
                    <th className="border border-gray-200 px-3 py-2 text-left">米</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">加</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_DETAIL.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.us}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.ca}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="海外IT エンジニア・看護師など専門職も合わせて"
            description="北米でキャリア構築するなら、専門職での海外進出を視野に。"
            primaryHref="/wh-tech-engineer"
            primaryLabel="海外ITエンジニア"
            secondaryHref="/wh-nurse"
            secondaryLabel="海外で看護師"
          />

          {/* 年収 */}
          <section id="salary" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">年収・仕事のチャンス</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">職種</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">米</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">加</th>
                  </tr>
                </thead>
                <tbody>
                  {SALARY_BY_JOB.map((s, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{s.job}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700">{s.us}</td>
                      <td className="border border-gray-200 px-3 py-2">{s.ca}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 気候 */}
          <section id="climate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">気候・季節</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-sky-800">🇺🇸 米</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・州により大差（フロリダ亜熱帯〜アラスカ極寒）</li>
                  <li>・カリフォルニア年中温暖</li>
                  <li>・NY/シカゴ冬-10度、夏30度</li>
                  <li>・四季は東海岸明瞭</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-amber-800">🇨🇦 加</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・全体的に寒冷、冬-15度以下も</li>
                  <li>・バンクーバー温暖湿潤（冬5度）</li>
                  <li>・トロント・モントリオール厳冬</li>
                  <li>・夏短く、20-28度の快適期</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 治安 */}
          <section id="safety" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">治安・銃規制</h2>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                両国とも基本的に安全だが、銃規制の差で治安レベルに違いあり。
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・<strong>米:</strong> 銃所持合法州あり、銃犯罪率高、州・地域格差大。NY/SF Tenderloin等の治安悪化エリア要警戒</li>
                <li>・<strong>加:</strong> 銃規制厳格、銃犯罪極めて少、全体的に治安世界トップクラス</li>
                <li>・<strong>女性一人:</strong> カナダの方が安心、米国は地域選定重要</li>
              </ul>
            </div>
          </section>

          {/* 文化・医療 */}
          <section id="culture-medical" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">文化・医療制度</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇺🇸 米国の医療</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  公的保険なし、雇用主提供 or 自費保険必須。救急車$2,000-3,000、虫垂炎手術$50,000等。
                  「医療費破産」が大きなリスク、留学・WH中は海外保険必須＋十分な補償額確保。
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇨🇦 加の医療</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Medicare（公的保険）で基本無料、PR取得者・市民・長期留学生対象。
                  待ち時間長いが安心、緊急医療は即対応。WH/学生は私的保険必須（月CAD 60-100）。
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
                米・加渡航者の体験談 <strong>n={usCanExperiences.length}件</strong>。
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
            ※ ビザ・年収・物価は2026年5月時点の情報です。最新情報は各国公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/au-vs-canada" className="text-primary-600 hover:underline">→ 豪vsカナダ比較</Link></li>
              <li><Link href="/au-vs-uk" className="text-primary-600 hover:underline">→ 豪vs英比較</Link></li>
              <li><Link href="/us-language-school" className="text-primary-600 hover:underline">→ アメリカ語学留学</Link></li>
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ</Link></li>
              <li><Link href="/wh-tech-engineer" className="text-primary-600 hover:underline">→ 海外ITエンジニア</Link></li>
              <li><Link href="/wh-overseas-university" className="text-primary-600 hover:underline">→ 海外大学・大学院進学</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
