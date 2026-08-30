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

const PAGE_PATH = '/korea-study';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '韓国留学完全ガイド｜語学堂・大学・費用・ビザ・K-POP文化',
  description: '韓国留学の語学堂（延世・高麗・ソウル大）の選び方、費用シミュレーション、ビザ手続き、生活費、K-POP/K-Drama文化背景まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    '韓国 留学',
    '韓国 語学留学',
    '韓国 語学堂',
    '延世大学 語学堂',
    '韓国 留学 費用',
    'ソウル 留学',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-korea', label: 'なぜ韓国留学が人気なのか' },
  { id: 'school-types', label: '語学堂と大学の違い' },
  { id: 'top-schools', label: '主要語学堂5校比較' },
  { id: 'cost', label: '費用シミュレーション' },
  { id: 'visa', label: 'ビザの種類と手続き' },
  { id: 'life', label: 'ソウル生活費・暮らし' },
  { id: 'culture-tips', label: 'K-POP/K-Drama文化を活かす学習法' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TOP_SCHOOLS = [
  {
    name: '延世大学 韓国語学堂',
    feature: '韓国最大級・最も伝統あり。レベル分け細かく、文法・読解強い',
    cost: '1学期（10週）約1,800,000ウォン',
    students: '日本人含む多国籍。1学期350-400名',
  },
  {
    name: '高麗大学 国際語学院',
    feature: '文化授業多、会話重視。学生交流イベント充実',
    cost: '1学期（10週）約1,700,000ウォン',
    students: '日本人少なめ、中国人・米国人多',
  },
  {
    name: 'ソウル大学 言語教育院',
    feature: '韓国最高峰大学。学術志向、文法・上級者向け',
    cost: '1学期（10週）約1,750,000ウォン',
    students: '多国籍、上級者・研究者多',
  },
  {
    name: '梨花女子大学 言語教育院',
    feature: '女子大学運営。安全・温かい雰囲気、女性向け',
    cost: '1学期（10週）約1,750,000ウォン',
    students: '女性のみ、日本人含む多国籍',
  },
  {
    name: '建国大学 言語教育院',
    feature: 'コスパ良、会話重視、学生街立地で生活費安',
    cost: '1学期（10週）約1,500,000ウォン',
    students: '日本人含む多国籍、リラックスした雰囲気',
  },
];

const COST_SIMULATION = [
  { period: '1学期（10週）', tuition: '約16〜20万円', living: '約30〜40万円', total: '約46〜60万円' },
  { period: '2学期（20週・半年）', tuition: '約30〜40万円', living: '約60〜80万円', total: '約90〜120万円' },
  { period: '4学期（40週・1年）', tuition: '約60〜80万円', living: '約120〜160万円', total: '約180〜240万円' },
];

const VISA_TYPES = [
  { type: 'D-4-1（一般研修ビザ）', purpose: '語学堂留学（6ヶ月超）', detail: '入学許可書＋資金証明（700万ウォン以上）が必要' },
  { type: 'C-3-1（短期総合ビザ）', purpose: '90日以内の短期留学', detail: '日本人は90日まで観光ビザでOK、申請不要' },
  { type: 'D-2（学位ビザ）', purpose: '大学・大学院本科入学', detail: '4年制大学への正規入学者対象' },
  { type: 'D-10（求職ビザ）', purpose: '卒業後の就職活動', detail: '6ヶ月延長可、就職決定で就労ビザに切替' },
];

const LIVING_COSTS = [
  { item: '家賃（コシウォン）', cost: '30〜50万ウォン', detail: '韓国独特の狭い1人部屋、共用キッチン' },
  { item: '家賃（ワンルーム）', cost: '50〜80万ウォン', detail: '個室＋ミニキッチン、保証金300〜500万ウォン' },
  { item: '食費（自炊＋外食）', cost: '40〜60万ウォン', detail: '韓国食事は安、外食$5-10が一般的' },
  { item: '交通（地下鉄定期）', cost: '5〜6万ウォン', detail: '月55,000ウォン。バスも乗り換え無料' },
  { item: '通信（携帯）', cost: '2〜4万ウォン', detail: 'SKT/KT/LG U+のプリペイドプラン' },
  { item: '娯楽・その他', cost: '20〜30万ウォン', detail: 'カフェ・コスメ・K-POPライブ等' },
];

const CULTURE_TIPS = [
  'NetflixのK-Dramaを韓国語字幕で見る習慣をつける',
  'K-POPの歌詞を覚えて発音練習（BTS・BLACKPINK等）',
  '韓国の友人を作る「ハングルカフェ（言語交換）」アプリ活用',
  '弘大・梨大エリアの大学生イベント・サークル参加',
  '韓国ドラマの聖地巡礼で街歩き＋語学学習',
  'カフェ巡り（韓国はカフェ文化発達）でハングル読解練習',
];

const FAQS = [
  {
    question: '韓国留学の総額はどれくらい？',
    answer:
      '1学期（10週）約46〜60万円、半年90〜120万円、1年180〜240万円が目安。欧米留学の約半額で、コスパ抜群。語学堂学費は1学期16〜20万円、ソウルでの生活費は月15〜20万円が標準的。日本から近く航空券も安いため、費用面で挑戦しやすい留学先です。',
  },
  {
    question: 'ビザは必要？観光ビザでもいける？',
    answer:
      '90日以内なら観光ビザ（C-3-1相当、申請不要）でOK。90日超なら学生ビザ（D-4-1）必須。語学堂の入学許可書＋資金証明（700万ウォン以上）が必要。申請は最寄りの韓国大使館・領事館で2〜4週間かかります。',
  },
  {
    question: 'ハングルゼロでも留学できる？',
    answer:
      '可能です。多くの語学堂が「初心者レベル（1級）」から開講しています。延世・高麗・ソウル大は1〜6級のレベル分けがあり、ハングル文字の読み書きから始められます。出発前に「ハングル文字＋基本挨拶」だけ覚えておくとスタートがスムーズ。',
  },
  {
    question: '韓国でアルバイトはできる？',
    answer:
      'D-4-1ビザの場合、入学6ヶ月後から「資格外活動許可」を取れば週20時間まで就労可能。日本人向け塾講師・観光ガイド・ホテルフロント等の求人があります。時給は最低賃金約10,030ウォン（2024年）から。',
  },
  {
    question: '韓国留学に向く人は？',
    answer:
      'K-POPやK-Drama好きで韓国文化に深い興味がある人、欧米留学より低コストで海外経験したい人、日本から近く頻繁に帰国予定の人。逆に「英語を学びたい」「欧米生活経験を積みたい」目的なら韓国は向きません。',
  },
];

export default async function KoreaStudyPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const krExperiences = all.filter((e) => e.country?.id === 'south-korea');
  const mentions = countMentions(all, /(韓国|Korea|ソウル|Seoul|K-POP|語学堂)/i);
  const sample = krExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(韓国|Korea|ソウル|Seoul|語学堂)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '韓国留学完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '韓国留学完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              韓国留学完全ガイド｜語学堂・大学・費用・ビザ・K-POP文化
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="韓国留学を検討している方／K-POP/K-Drama好きの方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              K-POPやK-Drama人気で日本人留学生急増中の韓国。欧米留学の約半額のコスパ、日本から3時間の近さ、独特の文化体験で人気急上昇。
              <br />
              この記事では語学堂の選び方、主要5校比較、費用シミュレーション、ビザ手続き、K-POP文化を活かす学習法まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '欧米留学の約半額、1年で180〜240万円が目安',
              '主要語学堂は延世・高麗・ソウル大の3校が特に人気',
              '90日以内なら観光ビザOK、超えるなら学生ビザD-4-1必須',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ韓国 */}
          <section id="why-korea" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ韓国留学が人気なのか</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              K-POP・K-Drama・K-Beauty・韓国料理の世界的人気で、韓国は世界中から留学生が集まる人気留学先に。日本から近く、コストパフォーマンスも抜群です。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・欧米留学の約半額（1年180〜240万円）</li>
              <li>・日本から飛行機3時間、頻繁な帰国も可能</li>
              <li>・K-POP/K-Drama愛好家には聖地体験</li>
              <li>・韓国語＋韓国文化を本場で習得</li>
              <li>・トレンド最先端（コスメ・ファッション・カフェ）</li>
              <li>・治安が良く女性一人留学も安心</li>
            </ul>
          </section>

          {/* 語学堂 vs 大学 */}
          <section id="school-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">語学堂と大学の違い</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-sky-800">語学堂（言語教育院）</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・大学に併設の韓国語学習機関</li>
                  <li>・1学期10週・1日4時間授業</li>
                  <li>・初心者〜上級まで6レベル</li>
                  <li>・主に外国人向け、入学が比較的容易</li>
                  <li>・最も人気のルート</li>
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-emerald-800">大学（学部・大学院）</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・韓国の正規大学に入学</li>
                  <li>・TOPIK 5級以上必要（韓国語検定）</li>
                  <li>・1年8学期、4年で卒業</li>
                  <li>・学位取得＋就職にも有利</li>
                  <li>・本格的・長期的なルート</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 主要校 */}
          <section id="top-schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">主要語学堂5校比較</h2>
            <div className="space-y-3">
              {TOP_SCHOOLS.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{s.name}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{s.feature}</p>
                  <div className="text-xs space-y-1 text-gray-600">
                    <p><strong>費用:</strong> {s.cost}</p>
                    <p><strong>学生構成:</strong> {s.students}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用シミュレーション</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">期間</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">学費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">生活費</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">合計</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_SIMULATION.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.period}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.tuition}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.living}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他のアジア留学先と比較"
            description="フィリピン・台湾等のコスパ留学先と比較して、最適な選択肢を見つけよう。"
            primaryHref="/cebu-study-real-cost"
            primaryLabel="セブ留学リアルコスト"
            secondaryHref="/matching"
            secondaryLabel="自分に合う留学診断"
          />

          {/* ビザ */}
          <section id="visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザの種類と手続き</h2>
            <div className="space-y-3">
              {VISA_TYPES.map((v, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{v.type}</p>
                  <p className="text-sm text-gray-800 mb-1"><strong>用途:</strong> {v.purpose}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{v.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 生活費 */}
          <section id="life" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ソウル生活費・暮らし</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              月15〜20万円が標準的な生活費。家賃の選択（コシウォン or ワンルーム）で大きく変わります。
            </p>
            <div className="space-y-3">
              {LIVING_COSTS.map((l, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-sm text-primary-700">{l.item}</p>
                    <p className="text-sm font-bold text-amber-700">{l.cost}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{l.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* K-POP/K-Drama学習法 */}
          <section id="culture-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">K-POP/K-Drama文化を活かす学習法</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {CULTURE_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                韓国渡航者の体験談 <strong>n={krExperiences.length}件</strong>。
                韓国・ソウル・語学堂関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 学費・ビザ・物価は2026年5月時点の情報です。最新情報は各語学堂・在韓日本大使館でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/cebu-study-real-cost" className="text-primary-600 hover:underline">→ セブ留学リアルコスト</Link></li>
              <li><Link href="/malta-study" className="text-primary-600 hover:underline">→ マルタ留学完全ガイド</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
              <li><Link href="/no-english" className="text-primary-600 hover:underline">→ 英語ゼロでも留学</Link></li>
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト</Link></li>
              <li><Link href="/countries/south-korea" className="text-primary-600 hover:underline">→ 韓国国別ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
