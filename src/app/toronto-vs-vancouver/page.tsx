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
import ServiceHubLink from '@/components/affiliate/ServiceHubLink';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { getExperiences } from '@/lib/microcms/experiences';
import { countMentions, extractMatchingSentence } from '@/lib/stats/experiences-cross';
import { isPublished } from '@/lib/publish/schedule';

const PAGE_PATH = '/toronto-vs-vancouver';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'トロント vs バンクーバー｜ワーホリ・留学先どっち？8項目で徹底比較',
  description: 'カナダ二大都市トロントとバンクーバーを「気候・家賃・仕事・治安・日本人比率・自然・物価・コミュニティ」の8項目で徹底比較。あなたのライフスタイル・目的に合うのはどちらか、実体験ベースで解説。',
  path: PAGE_PATH,
  keywords: [
    'トロント バンクーバー どっち',
    'トロント バンクーバー 比較',
    'カナダ どちら ワーホリ',
    'バンクーバー トロント 違い',
    'カナダ 都市 比較',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '一目でわかる：8項目比較表' },
  { id: 'climate', label: '気候：温暖な西海岸 vs 厳寒の東部' },
  { id: 'rent', label: '家賃・物価' },
  { id: 'jobs', label: '仕事事情：業界別の違い' },
  { id: 'japanese', label: '日本人比率と多文化度' },
  { id: 'safety', label: '治安・安全性' },
  { id: 'nature', label: '自然・週末アクティビティ' },
  { id: 'who-for', label: 'どんな人に向いている？' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COMPARISON = [
  { item: '気候', toronto: '⚠️ 冬-20℃も、夏30℃超', vancouver: '⭕ 冬0℃、夏25℃。温暖' },
  { item: '家賃（シェア個室）', toronto: 'CAD 900〜1,300', vancouver: 'CAD 1,000〜1,500' },
  { item: '物価', toronto: '中', vancouver: 'やや高' },
  { item: '仕事の選択肢', toronto: '⭕ 金融・IT・メディア・大手企業集積', vancouver: '⭕ 観光・IT・映画・スタートアップ' },
  { item: '日本人比率', toronto: '中（10〜15%）', vancouver: '高（15〜25%）' },
  { item: '治安', toronto: '⭕ 良好', vancouver: '⭕ 非常に良好' },
  { item: '自然アクセス', toronto: '△ ナイアガラまで2時間', vancouver: '⭕ 山・海・公園が至近' },
  { item: '時差', toronto: '日本-14時間（東部時間）', vancouver: '日本-17時間（西部時間）' },
  { item: '日本食材', toronto: '⭕ 充実（多数の日系スーパー）', vancouver: '⭕ 充実（リッチモンド地区）' },
  { item: 'コミュニティ', toronto: '多国籍・チャイナタウン・コリアタウン', vancouver: 'アジア系強い・温和な雰囲気' },
];

const TORONTO_FOR = [
  '都市的なライフスタイルが好き',
  '金融・IT・大企業でキャリアを積みたい',
  '日本人少なめの環境で英語を伸ばしたい',
  '多国籍コミュニティに飛び込みたい',
  'スポーツ・コンサート・ナイトライフを楽しみたい',
  '比較的家賃を抑えたい（バンクーバーより安め）',
];

const VANCOUVER_FOR = [
  '自然と都市のバランスを求める',
  '穏やかな気候で生活したい（冬が苦手）',
  '山・海・スキー・ハイキングが好き',
  '映画・スタートアップ業界興味あり',
  'アジア系コミュニティに安心感を求める',
  '治安最高クラスの都市で過ごしたい',
];

const FAQS = [
  {
    question: '結局、どちらがワーホリにおすすめ？',
    answer:
      '「都市派・キャリア志向・日本人少なめ希望」ならトロント。「自然派・気候重視・安心感重視」ならバンクーバー。日本人渡航者の数はバンクーバーがやや多いですが、トロントも近年人気上昇中。',
  },
  {
    question: 'どちらが英語環境にいい？',
    answer:
      'トロントの方が「日本人少なめ」「多国籍」で英語環境を作りやすい傾向。ただしバンクーバーでも語学学校・住居選び次第で英語環境は十分作れます。「日本人比率10〜15%以下」を意識して学校・シェアハウスを選びましょう。',
  },
  {
    question: '物価はどちらが高い？',
    answer:
      'バンクーバーがやや高い（特に家賃・外食）。トロントの方が選択肢が広く節約しやすい傾向。ただし両都市ともカナダ国内で1〜2位の高物価都市なので、ワーホリ予算は多めに見積もるのが安心。',
  },
  {
    question: '冬の寒さは本当にトロントの方が厳しい？',
    answer:
      'はい、明確に違います。トロントは1〜2月に-15〜-25℃になることも。バンクーバーは0〜5℃で雪は少ない（雨が多い）。寒さが苦手・初めての海外冬を経験する方はバンクーバーが安心。',
  },
  {
    question: '両方住むのもあり？',
    answer:
      'あり。ワーホリ1年で前半トロント・後半バンクーバー、または逆のパターンも体験できます。長距離移動は航空券CAD 200〜400、Greyhound（バス）でCAD 150〜300の旅も人気。',
  },
];

export default async function TorontoVsVancouverPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const canadaExperiences = all.filter((e) => e.country?.id === 'canada');
  const torontoExp = canadaExperiences.filter((e) => /トロント|Toronto/i.test(e.cityPrimary ?? ''));
  const vancouverExp = canadaExperiences.filter((e) => /バンクーバー|Vancouver/i.test(e.cityPrimary ?? ''));

  const mentions = countMentions(canadaExperiences, /(トロント|バンクーバー|Toronto|Vancouver)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(トロント|バンクーバー|Toronto|Vancouver|都市|住んで)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'トロント vs バンクーバー徹底比較', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'トロント vs バンクーバー徹底比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              トロント vs バンクーバー｜ワーホリ・留学先どっち？8項目で徹底比較
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="カナダの都市選びで悩んでいる方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「カナダはトロントとバンクーバー、どっちにすればいい？」
              <br />
              気候・家賃・仕事・治安・日本人比率・自然・物価・コミュニティの8項目で徹底比較。あなたのライフスタイル・目的に合うのはどちらかを、実体験ベースで解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '都市派・キャリア志向ならトロント、自然派・気候重視ならバンクーバー',
              '家賃は両都市とも高め、バンクーバーがやや高い',
              '冬の厳しさはトロント圧勝（バンクーバーは温暖で雪少ない）',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 比較表 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">一目でわかる：8項目比較表</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold">項目</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">🍁 トロント</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">🌊 バンクーバー</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((r) => (
                    <tr key={r.item} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium whitespace-nowrap">{r.item}</td>
                      <td className="px-3 py-3 text-xs">{r.toronto}</td>
                      <td className="px-3 py-3 text-xs">{r.vancouver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 気候 */}
          <section id="climate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">気候：温暖な西海岸 vs 厳寒の東部</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-sky-900">🍁 トロント</h3>
                <ul className="text-sm text-sky-900 space-y-1.5 list-disc pl-5">
                  <li>冬：-15〜-25℃（1〜2月厳しい）</li>
                  <li>夏：25〜32℃（湿度高め）</li>
                  <li>雪：1〜3月に多い</li>
                  <li>春・秋：気持ち良い気候</li>
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-emerald-900">🌊 バンクーバー</h3>
                <ul className="text-sm text-emerald-900 space-y-1.5 list-disc pl-5">
                  <li>冬：0〜5℃（雪少なく、雨多い）</li>
                  <li>夏：20〜25℃（湿度低め）</li>
                  <li>雨：11〜2月に集中</li>
                  <li>春・秋：晴天続き</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 家賃 */}
          <section id="rent" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">家賃・物価</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold">住居タイプ</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">🍁 トロント</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">🌊 バンクーバー</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'シェアハウス相部屋', t: 'CAD 600〜800/月', v: 'CAD 700〜900/月' },
                    { type: 'シェアハウス個室', t: 'CAD 900〜1,300/月', v: 'CAD 1,000〜1,500/月' },
                    { type: 'スタジオアパート', t: 'CAD 1,800〜2,500/月', v: 'CAD 2,000〜2,800/月' },
                    { type: '外食（ランチ）', t: 'CAD 15〜25', v: 'CAD 18〜30' },
                    { type: 'カフェのコーヒー', t: 'CAD 4〜6', v: 'CAD 4.5〜7' },
                  ].map((r) => (
                    <tr key={r.type} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium text-xs">{r.type}</td>
                      <td className="px-3 py-3 text-xs">{r.t}</td>
                      <td className="px-3 py-3 text-xs">{r.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="カナダIECビザの申請も忘れずに"
            description="トロント・バンクーバーどちらでもIECビザが必要。申請手順を確認。"
            primaryHref="/canada-iec-visa"
            primaryLabel="カナダIECビザ申請ガイド"
            secondaryHref="/canada-sim-card"
            secondaryLabel="カナダSIMカード"
          />

          {/* 仕事 */}
          <section id="jobs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">仕事事情：業界別の違い</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-base">🍁 トロント</h3>
                <ul className="text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                  <li>金融（カナダ最大の金融街）</li>
                  <li>IT（大手企業・スタートアップ）</li>
                  <li>メディア・広告</li>
                  <li>ホスピタリティ（観光・大手チェーン）</li>
                  <li>大手企業の本社が集中</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-base">🌊 バンクーバー</h3>
                <ul className="text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                  <li>映画・映像（ハリウッドのロケ地）</li>
                  <li>IT（中堅スタートアップ多数）</li>
                  <li>観光（クルーズ・スキー）</li>
                  <li>環境・サステナビリティ系</li>
                  <li>アジア系企業の北米拠点</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 日本人比率 */}
          <section id="japanese" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">日本人比率と多文化度</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              バンクーバーは伝統的に日本人渡航者が多く、語学学校での日本人比率は15〜25%。トロントは10〜15%とやや少なめで、より多国籍な環境です。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>💡 英語環境を作るコツ</strong>：どちらの都市でも、語学学校の上級クラス・日本人比率10%以下のシェアハウス・地元のMeetupを意識的に選べば、十分英語環境を構築できます。
              </p>
            </div>
          </section>

          {/* 治安 */}
          <section id="safety" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">治安・安全性</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              両都市ともカナダ国内・世界的に見ても治安は良好。バンクーバーがやや上位で、世界の住みたい都市ランキング常連です。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・<strong>トロント</strong>：CBDダウンタウンは安全。Jane and Finchエリアなど一部地区は要注意</li>
              <li>・<strong>バンクーバー</strong>：全体的に安全。Downtown Eastside（DTES）地区は治安問題あり要回避</li>
              <li>・両都市とも夜の一人歩きの注意は欧米基準で必要</li>
            </ul>
          </section>

          {/* 自然 */}
          <section id="nature" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">自然・週末アクティビティ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-base">🍁 トロント</h3>
                <ul className="text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                  <li>ナイアガラの滝（車2時間）</li>
                  <li>マスコーカ湖水地方（夏のリゾート）</li>
                  <li>アルゴンキン州立公園（紅葉）</li>
                  <li>都市公園は限定的</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-base">🌊 バンクーバー</h3>
                <ul className="text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                  <li>スタンレーパーク（市内大規模公園）</li>
                  <li>グラウスマウンテン（スキー・夜景）</li>
                  <li>ウィスラー（世界トップのスキー場、車2時間）</li>
                  <li>ビクトリア島（フェリー1.5時間）</li>
                  <li>イングリッシュベイ・キツラノビーチ</li>
                </ul>
              </div>
            </div>
          </section>

          {/* どんな人向け */}
          <section id="who-for" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">どんな人に向いている？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <h3 className="font-bold text-sky-900 mb-3">🍁 トロントが向いている人</h3>
                <ul className="text-sm text-sky-900 space-y-2 list-disc pl-5">
                  {TORONTO_FOR.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <h3 className="font-bold text-emerald-900 mb-3">🌊 バンクーバーが向いている人</h3>
                <ul className="text-sm text-emerald-900 space-y-2 list-disc pl-5">
                  {VANCOUVER_FOR.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <ServiceHubLink
            intent="canada-support"
            title="カナダ留学サポートの広告サービス"
            description="都市を選んだ後の学校申込や現地サポートを検討する方向けに、広告掲載中のサービスを案内しています。"
          />

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                カナダ渡航者の体験談 <strong>n={canadaExperiences.length}件</strong> 内訳：
                トロント <strong>{torontoExp.length}件</strong>、バンクーバー <strong>{vancouverExp.length}件</strong>。
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

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/countries/canada" className="text-primary-600 hover:underline">→ カナダ国別ガイド</Link></li>
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ申請</Link></li>
              <li><Link href="/canada-sim-card" className="text-primary-600 hover:underline">→ カナダSIMカード</Link></li>
              <li><Link href="/vancouver-language-school" className="text-primary-600 hover:underline">→ バンクーバー語学学校</Link></li>
              <li><Link href="/compare/countries" className="text-primary-600 hover:underline">→ 国別比較ランキング</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 5問で診断：あなたに合う国</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
