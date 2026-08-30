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

const PAGE_PATH = '/wh-female-safety';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '女性ワーホリ安全完全ガイド｜国別治安・注意エリア・デート安全・防犯対策',
  description: '女性一人ワーホリの安全対策を完全解説。国別治安ランキング、注意エリア、深夜の移動、デート・マッチングアプリの安全、性被害防止策、緊急時対応まで網羅。',
  path: PAGE_PATH,
  keywords: [
    'ワーホリ 女性 安全',
    '女性 一人 ワーホリ',
    'ワーホリ 治安',
    '女性 ワーホリ 注意',
    '女性 海外 防犯',
    'ワーホリ 性被害',
  ],
});

const TOC_HEADINGS = [
  { id: 'safety-ranking', label: '国別治安ランキング（女性視点）' },
  { id: 'high-risk-areas', label: '注意すべきエリア・時間帯' },
  { id: 'night-travel', label: '深夜の移動・帰宅安全' },
  { id: 'sharehouse', label: 'シェアハウス選びの安全基準' },
  { id: 'dating-safety', label: 'デート・マッチングアプリ安全' },
  { id: 'harassment', label: 'ハラスメント・性被害対処' },
  { id: 'emergency', label: '緊急時の対応・連絡先' },
  { id: 'prevention', label: '日常で実践する10の防犯習慣' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const SAFETY_RANKING = [
  { country: 'カナダ', score: '◎', detail: '世界トップクラス治安、女性一人安心。冬の夜道は要注意' },
  { country: 'ニュージーランド', score: '◎', detail: '小さな町ほど安全、女性一人留学者多数' },
  { country: 'オーストラリア', score: '◎', detail: '基本安全、シドニーKings Cross・メルボルン駅周辺の深夜のみ警戒' },
  { country: 'アイルランド', score: '○', detail: 'ダブリン市内は若干注意、地方は非常に安全' },
  { country: 'ドイツ', score: '○', detail: '基本安全、ベルリン東部一部に注意' },
  { country: 'イギリス', score: '○', detail: 'ロンドンは大都市治安、地方は安全' },
  { country: 'アメリカ', score: '△', detail: '州・都市格差大、NY/SF Tenderloin等要注意' },
  { country: 'フランス', score: '△', detail: 'パリのスリ多発、地方は安全' },
  { country: '韓国', score: '◎', detail: '世界でも非常に安全な国、女性一人深夜OK' },
  { country: 'フィリピン', score: '△', detail: '注意必要、特定エリア避ける、夜の一人歩き避ける' },
];

const HIGH_RISK_AREAS = [
  { type: '深夜のクラブ街', detail: 'シドニーKings Cross、ロンドンSoho、パリPigalleなど。深夜2時以降は避ける' },
  { type: '駅周辺（深夜）', detail: 'メルボルン中央駅、トロントUnion駅周辺は深夜避ける' },
  { type: '人口密度低い夜道', detail: '住宅街の路地、公園、駐車場の夜の単独歩行' },
  { type: '観光地のスリ多発エリア', detail: 'パリ・ローマ・バルセロナの観光名所、リュック前掛けで対応' },
  { type: 'シェアハウスの男性多数物件', detail: '男性多数のシェアハウスは事前に避ける' },
];

const NIGHT_TRAVEL_TIPS = [
  'Uber/Lyftを必ず利用（深夜のバス・電車は避ける）',
  '友人・ホストファミリーに到着連絡',
  'スマホ位置情報を信頼できる人と共有（Find My Friends等）',
  '深夜の駅・空港から自宅まではUber一直線',
  '一人で歩くなら大通り＋人通り多いルート選択',
  'ヘッドフォン両耳装着しない（周囲音聞こえる状態）',
  'お酒は適量、酔った状態で一人で帰らない',
  '深夜のATM利用避ける（強盗ターゲット）',
];

const SHAREHOUSE_SAFETY = [
  '内見必須、ビデオ通話だけで決めない',
  '住人の性別・年齢構成を確認、女性多めの家を選ぶ',
  '個室に鍵がかかる物件を選ぶ',
  '玄関・窓のセキュリティ（オートロック等）確認',
  '近隣の治安・交通アクセス確認',
  '不快な雰囲気を感じたら即引っ越し（保証金より安全優先）',
];

const DATING_SAFETY = [
  '初対面は必ず公共の場（カフェ・レストラン）',
  '夜のクラブ・バーで会わない',
  '友人にその夜の予定共有（誰と・どこ・何時まで）',
  '相手の本名・SNS事前確認',
  '飲み物を一瞬でも目を離さない（ドラッグ混入防止）',
  '初対面で相手の車に乗らない、自宅に行かない',
  '違和感を感じたら即帰宅、トイレ等で電話・通報',
  'マッチングアプリは「写真連動・本人確認済み」のもの選ぶ（Hinge、Bumble等）',
];

const HARASSMENT_RESPONSE = [
  '小さなセクハラ：その場で「Stop」「No」と明確に言う',
  '職場ハラスメント：HR・上司・Fair Work（豪）等に相談',
  'シェアハウス内のハラスメント：即引っ越し＋警察相談',
  'ストーカー被害：警察に被害届、SNS情報削除、引越し',
  '性被害：警察（性犯罪課）通報、医療機関で証拠保全、海外保険でカウンセリング',
  '日本人女性向け相談窓口：在外日本大使館の女性相談ダイヤル',
];

const EMERGENCY_CONTACTS = [
  { country: 'カナダ', police: '911', women: '在加日本大使館 (613) 241-8541' },
  { country: 'NZ', police: '111', women: '在NZ日本大使館 (04) 473-1540' },
  { country: 'オーストラリア', police: '000', women: '在豪日本大使館 (02) 6273 3244' },
  { country: 'イギリス', police: '999/112', women: '在英日本大使館 (020) 7465-6500' },
  { country: 'アメリカ', police: '911', women: '在米日本大使館 (202) 238-6700' },
];

const PREVENTION_HABITS = [
  '常に状況把握、歩きスマホしない',
  '貴重品は3ヶ所分散、目立たないバッグ',
  '緊急時のホイッスル（防犯ブザー）携帯',
  '夜の単独行動を最小限に',
  '飲酒は信頼できる人と一緒の場のみ',
  '住所・スケジュールをSNSで広めない',
  '不快な相手は即ブロック、躊躇しない',
  '危険を感じたら近くの店舗に逃げ込む',
  '正当防衛の意識、過度に従順にならない',
  '帰国時まで「私は被害者にならない」マインドセット',
];

const FAQS = [
  {
    question: '女性一人ワーホリは危険？',
    answer:
      '渡航先・心構え次第。カナダ・NZ・豪・韓国は世界トップクラスに安全で女性一人留学者多数。逆にアメリカ大都市・フランス都市部は注意必要。「危険＝行かない」ではなく、「リスク認識＋予防策」で十分対応可能。被害体験談より「特に問題なかった」体験談の方が圧倒的多数です。',
  },
  {
    question: '夜の外出は禁物？',
    answer:
      '一概に禁物ではない。グループ・友人と一緒なら問題なし。深夜の一人移動はUber/Lyft利用が必須。バー・クラブ後の帰宅は必ず友人と一緒、または事前にUber予約。「飲み過ぎ＋一人＋深夜」の組み合わせが最も危険な状態。',
  },
  {
    question: 'シェアハウスは女性のみが安全？',
    answer:
      '女性のみは安全度高いが、選択肢狭まる。男女混合でも「個室に鍵」「玄関オートロック」「住人の年齢層バランス」を確認すれば安心。内見時に住人の様子・雰囲気を観察、違和感あれば見送り。最初は短期契約（1-2ヶ月）で様子見もアリ。',
  },
  {
    question: 'マッチングアプリは使っていい？',
    answer:
      '使える、ただし安全意識必須。Hinge・Bumble等の本人確認システムがあるアプリ選択。初対面は必ず昼の公共の場、友人に予定共有、相手の本名・SNS事前確認。違和感あれば即帰宅、相手と連絡断つ。多くの留学生が現地で出会いを楽しんでいます。',
  },
  {
    question: '万一性被害に遭ったら？',
    answer:
      '①その場から安全な場所に逃げる、②警察（性犯罪課）に通報、③医療機関で証拠保全と治療、④在外日本大使館に相談、⑤海外保険でカウンセリング受診。被害者は悪くない、自分を責めない。日本人女性向けの相談窓口（大使館・カウンセラー）も活用を。',
  },
];

export default async function WhFemaleSafetyPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(治安|安全|危険|ハラスメント|被害|女性|犯罪)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.cons?.map((c) => c.text).join(' ') ?? ''}`,
        /(治安|安全|危険|ハラスメント|被害|女性)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '女性ワーホリ安全完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '女性ワーホリ安全完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              女性ワーホリ安全完全ガイド｜国別治安・注意エリア・デート安全・防犯対策
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="女性一人でワーホリ・留学予定の方／親御さん"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「女性一人でワーホリは危険？」最大の不安。実は適切な予防策を取れば、多くの女性が安全に楽しい1年を過ごしています。
              <br />
              この記事では国別治安、注意エリア、夜の移動、シェアハウス選び、デート安全、緊急時対応まで完全解説。リスクを正しく知って、安心して挑戦しましょう。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'カナダ・NZ・豪・韓国は世界トップクラスに安全',
              '深夜の単独移動はUber必須、シェアハウスは内見必須',
              'デート・マッチングアプリは安全意識＋友人共有がカギ',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 国別治安 */}
          <section id="safety-ranking" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別治安ランキング（女性視点）</h2>
            <div className="space-y-3">
              {SAFETY_RANKING.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-bold text-base text-primary-700">{s.country}</p>
                    <p className="text-2xl font-bold text-emerald-700">{s.score}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 注意エリア */}
          <section id="high-risk-areas" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">注意すべきエリア・時間帯</h2>
            <div className="space-y-3">
              {HIGH_RISK_AREAS.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-rose-700">{h.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{h.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 夜の移動 */}
          <section id="night-travel" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">深夜の移動・帰宅安全</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {NIGHT_TRAVEL_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">🌙</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* シェアハウス */}
          <section id="sharehouse" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">シェアハウス選びの安全基準</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {SHAREHOUSE_SAFETY.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">🔑</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="詐欺・犯罪被害対処も合わせて"
            description="詐欺手口10選、被害時の連絡先、大使館対応まで完全解説。"
            primaryHref="/wh-scam-crime-response"
            primaryLabel="詐欺・犯罪被害対処"
            secondaryHref="/overseas-hospital-guide"
            secondaryLabel="海外で病院"
          />

          {/* デート */}
          <section id="dating-safety" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">デート・マッチングアプリ安全</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {DATING_SAFETY.map((d, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">💑</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ハラスメント */}
          <section id="harassment" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ハラスメント・性被害対処</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {HARASSMENT_RESPONSE.map((h, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">🚨</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 緊急 */}
          <section id="emergency" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">緊急時の対応・連絡先</h2>
            <div className="space-y-3">
              {EMERGENCY_CONTACTS.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{c.country}</p>
                  <div className="text-sm space-y-1">
                    <p><strong>警察・救急:</strong> <span className="text-rose-700 font-bold">{c.police}</span></p>
                    <p><strong>大使館:</strong> {c.women}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 防犯習慣 */}
          <section id="prevention" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">日常で実践する10の防犯習慣</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {PREVENTION_HABITS.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「治安・安全・女性関連」の言及を集計。
                該当言及は <strong className="text-primary-700">{mentions.containsCount}件</strong>。
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
            ※ 治安情報は2026年5月時点の情報です。最新情報は外務省「海外安全ホームページ」「在外公館」ページで必ずご確認ください。緊急時は躊躇せず警察・大使館に連絡を。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-scam-crime-response" className="text-primary-600 hover:underline">→ 詐欺・犯罪被害対処</Link></li>
              <li><Link href="/overseas-hospital-guide" className="text-primary-600 hover:underline">→ 海外で病院</Link></li>
              <li><Link href="/women" className="text-primary-600 hover:underline">→ 女性向け留学・WHガイド</Link></li>
              <li><Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">→ 不安解消ガイド</Link></li>
              <li><Link href="/housing-comparison" className="text-primary-600 hover:underline">→ 住居タイプ比較</Link></li>
              <li><Link href="/wh-mental-health" className="text-primary-600 hover:underline">→ ワーホリのメンタルヘルス</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
