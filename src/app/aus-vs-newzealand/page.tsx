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

const PAGE_PATH = '/aus-vs-newzealand';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーストラリアvsニュージーランド徹底比較｜気候・物価・治安・ビザ｜どっち？',
  description: 'オセアニア2大ワーホリ国の豪vs NZを8項目で徹底比較。気候・物価・治安・ビザ・仕事・自然までを網羅。タイプ別おすすめ診断付き。',
  path: PAGE_PATH,
  keywords: [
    'オーストラリア NZ 比較',
    'オーストラリア ニュージーランド どっち',
    '豪 NZ ワーホリ',
    'NZ vs オーストラリア',
    'オセアニア ワーホリ 比較',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '一目で分かる8項目比較表' },
  { id: 'climate', label: '気候・季節の違い' },
  { id: 'cost', label: '物価・生活費' },
  { id: 'salary-job', label: '時給・仕事のチャンス' },
  { id: 'safety', label: '治安・自然・住みやすさ' },
  { id: 'visa', label: 'ビザ取得の違い' },
  { id: 'nature-activity', label: '自然・アクティビティ' },
  { id: 'who-for', label: 'あなたはどっち向き？診断' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COMPARISON_TABLE = [
  { item: '時給（最低）', au: 'AUD 24.10', nz: 'NZD 23.15', winner: '豪わずか上' },
  { item: '月生活費', au: 'AUD 2,000-2,800', nz: 'NZD 1,500-2,200', winner: 'NZ 20%安' },
  { item: '気候', au: '亜熱帯-温帯', nz: '温帯', winner: '豪夏暖か' },
  { item: 'ビザ取得', au: '先着・無制限', nz: '先着・無制限', winner: '同等' },
  { item: '治安', au: '◎', nz: '◎', winner: 'NZわずか上' },
  { item: '仕事数', au: '多（人口2,600万）', nz: '少なめ（人口500万）', winner: '豪有利' },
  { item: '自然体験', au: 'ビーチ・砂漠多', nz: 'フィヨルド・氷河・山', winner: 'NZ世界遺産級' },
  { item: '日本人比率', au: '中', nz: '少', winner: 'NZ英語環境◎' },
];

const COST_DETAIL = [
  { item: '家賃（シェア）', au: 'AUD 800-1,300', nz: 'NZD 600-1,000' },
  { item: '食費', au: 'AUD 400-500', nz: 'NZD 350-450' },
  { item: '交通', au: 'AUD 150-180', nz: 'NZD 120-150' },
  { item: '通信', au: 'AUD 30-45', nz: 'NZD 30-40' },
  { item: '娯楽', au: 'AUD 400-600', nz: 'NZD 300-500' },
];

const NATURE_AU = [
  'グレートバリアリーフ（世界最大のサンゴ礁）',
  'ウルル（エアーズロック）の砂漠',
  'ゴールドコースト・バイロンベイのビーチ',
  'タスマニアの大自然',
  'カンガルー・コアラ・ウォンバット等の固有種',
];

const NATURE_NZ = [
  'ミルフォードサウンド（フィヨルド・世界遺産）',
  'マウントクック・氷河ハイキング',
  'クイーンズタウン（バンジー・スカイダイビング発祥）',
  'ロード・オブ・ザ・リングのロケ地',
  'ロトルアの温泉・マオリ文化',
];

const WHO_FOR = [
  {
    type: 'オーストラリア向き',
    profile: '稼ぎたい・温暖な気候好き・都市生活＋ビーチ・3年滞在希望',
    reason: '時給高・先着ビザ・セカンド+3rdで3年滞在可・大都市の仕事多',
  },
  {
    type: 'ニュージーランド向き',
    profile: '大自然好き・ゆったり生活・コスパ重視・英語没頭',
    reason: 'NZ 20%安・治安世界トップ・自然世界遺産級・日本人少',
  },
  {
    type: '両方検討すべき人',
    profile: 'オセアニアでワーホリしたい一般的志望者',
    reason: '両国とも治安◎・気候良・仕事◎。1年豪→次1年NZのハイブリッドも',
  },
];

const FAQS = [
  {
    question: '初めての海外ならどっち？',
    answer:
      'NZ推奨。治安世界トップ・物価安・日本人少なく英語環境◎。慣れたら豪に移動して稼ぐ、というステップアップも。一方で「最初から都市生活＋稼ぎ」を求めるなら豪も有り。',
  },
  {
    question: '稼ぎたいなら豪？',
    answer:
      'はい、豪が圧倒的。時給はほぼ同じですが、仕事数・カジュアル雇用機会・選択肢の幅で豪が上。NZは観光業・接客中心、豪はオフィスワーク・専門職まで含めた多様な仕事あり。',
  },
  {
    question: '自然体験ならNZ？',
    answer:
      '質ではNZ圧勝。フィヨルド・氷河・温泉・マウントクック等の世界遺産級の自然。豪はビーチ・砂漠・グレートバリアリーフ・カンガルー等のオセアニア色強い体験。両方とも独自の魅力。',
  },
  {
    question: 'ビザはどっち取りやすい？',
    answer:
      'ほぼ同等。両国ともWHV先着順・年齢18-30歳・1年（NZは追加可）。豪はセカンド+3rdで最大3年、NZは追加ビザで最大23ヶ月。長期滞在重視なら豪、短期で集中体験ならNZ。',
  },
  {
    question: '日本食材・コミュニティどっち豊富？',
    answer:
      '豪（特にシドニー）。日系コミュニティが大きく、日本食材店・日系企業多。NZは小規模、特に南島・地方は限定的。日本食大好き・日本人ネットワーク重視なら豪、英語没頭ならNZ。',
  },
];

export default async function AusVsNewzealandPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const ausNzExperiences = all.filter(
    (e) => e.country?.id === 'australia' || e.country?.id === 'new-zealand'
  );
  const mentions = countMentions(all, /(オーストラリア|Australia|ニュージーランド|NZ)/i);
  const sample = ausNzExperiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(オーストラリア|Australia|ニュージーランド|NZ)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーストラリアvsニュージーランド徹底比較', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーストラリアvsニュージーランド徹底比較' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーストラリアvsニュージーランド徹底比較｜あなたはどっち向き？
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="オセアニアでワーホリ・留学先を迷う方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              オセアニア2大ワーホリ国のオーストラリアとニュージーランド。どちらも英語圏・治安◎・自然豊か・親日的ですが、気候・物価・仕事数・自然体験には明確な違いがあります。
              <br />
              この記事では8項目で徹底比較、自分に合うのはどちらか診断します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '稼ぎ・都市派なら豪、自然・コスパ・英語没頭ならNZ',
              'NZの方が物価約20%安、治安はわずかに上',
              '両国とも先着ビザで取りやすい',
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
                    <th className="border border-gray-200 px-2 py-2 text-left">NZ</th>
                    <th className="border border-gray-200 px-2 py-2 text-left">優位</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-2 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.au}</td>
                      <td className="border border-gray-200 px-2 py-2">{c.nz}</td>
                      <td className="border border-gray-200 px-2 py-2 text-primary-700 text-xs">{c.winner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 気候 */}
          <section id="climate" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">気候・季節の違い</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-amber-800">🇦🇺 豪</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・亜熱帯〜温帯気候</li>
                  <li>・夏25-35度、冬5-20度</li>
                  <li>・南北で気候差大（北部熱帯・南部温帯）</li>
                  <li>・年中ビーチアクセス可能（北部）</li>
                </ul>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-sky-800">🇳🇿 NZ</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・温帯海洋性気候</li>
                  <li>・夏15-25度、冬5-15度</li>
                  <li>・年較差小、安定的</li>
                  <li>・南島はスキー場あり</li>
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
                    <th className="border border-gray-200 px-3 py-2 text-left">NZ</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_DETAIL.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.item}</td>
                      <td className="border border-gray-200 px-3 py-2">{c.au}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700">{c.nz}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 全体的にNZの方が約20%安。為替も影響するため、最新レートで再計算を。
            </p>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他の比較・各国詳細も合わせて"
            description="シドニーvsメルボルン、NZ語学留学等、より細かい比較情報も。"
            primaryHref="/au-vs-canada"
            primaryLabel="豪vsカナダ比較"
            secondaryHref="/nz-language-school"
            secondaryLabel="NZ語学留学完全ガイド"
          />

          {/* 時給・仕事 */}
          <section id="salary-job" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">時給・仕事のチャンス</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇦🇺 豪</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  最低時給AUD 24.10、カジュアル平均AUD 28-34。仕事数が圧倒的に多く、オフィスワーク・専門職・カジュアル多様。バリスタはメルボルン世界一。
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇳🇿 NZ</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  最低時給NZD 23.15、カジュアル平均NZD 25-30。観光業・接客が中心、オフィスワーク機会少なめ。クイーンズタウンの観光業＋スキー場が稼ぎ場所。
                </p>
              </div>
            </div>
          </section>

          {/* 治安 */}
          <section id="safety" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">治安・自然・住みやすさ</h2>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                両国とも世界の住みやすい国ランキング上位。NZは「Global Peace Index」2位、豪は10位以内常連。
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・<strong>NZ:</strong> 全体的に超安全、夜の一人歩きも比較的OK</li>
                <li>・<strong>豪:</strong> 大都市の歓楽街の深夜のみ警戒</li>
                <li>・<strong>銃規制:</strong> 両国とも厳格、銃犯罪極めて少ない</li>
                <li>・<strong>住みやすさ:</strong> NZの方が「ゆったり」、豪の方が「便利・刺激的」</li>
              </ul>
            </div>
          </section>

          {/* ビザ */}
          <section id="visa" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ビザ取得の違い</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇦🇺 オーストラリアWHV</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>・先着・無制限</li>
                  <li>・年齢18-30歳</li>
                  <li>・1年（セカンド+1年、3rd+1年で最大3年）</li>
                  <li>・申請料AUD 685</li>
                  <li>・申請から2-4週間で発行</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-base mb-2 text-primary-700">🇳🇿 NZ WHV</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>・先着・無制限</li>
                  <li>・年齢18-30歳</li>
                  <li>・12ヶ月（条件で23ヶ月まで延長）</li>
                  <li>・申請料NZD 595</li>
                  <li>・申請から1-3週間で発行</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 自然 */}
          <section id="nature-activity" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">自然・アクティビティ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-amber-800">🇦🇺 豪の自然</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {NATURE_AU.map((n, i) => (
                    <li key={i} className="leading-relaxed">・{n}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-emerald-800">🇳🇿 NZの自然</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {NATURE_NZ.map((n, i) => (
                    <li key={i} className="leading-relaxed">・{n}</li>
                  ))}
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
                豪・NZ渡航者の体験談 <strong>n={ausNzExperiences.length}件</strong>。
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
            ※ 物価・給与・ビザ要件は2026年5月時点の情報です。最新情報は各国公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/au-vs-canada" className="text-primary-600 hover:underline">→ 豪vsカナダ比較</Link></li>
              <li><Link href="/nz-language-school" className="text-primary-600 hover:underline">→ NZ語学留学</Link></li>
              <li><Link href="/sydney-vs-melbourne" className="text-primary-600 hover:underline">→ シドニーvsメルボルン</Link></li>
              <li><Link href="/melbourne-barista" className="text-primary-600 hover:underline">→ メルボルンでバリスタ</Link></li>
              <li><Link href="/au-second-year-visa" className="text-primary-600 hover:underline">→ 豪WHセカンドビザ</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 自分に合う留学診断</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
