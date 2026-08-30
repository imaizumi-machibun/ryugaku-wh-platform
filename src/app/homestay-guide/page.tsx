import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ホームステイ完全ガイド｜失敗しないホスト選びと合わなかった時の対処法',
  description: 'ワーホリ・留学のホームステイ選びの5つの基準、ホスト家族との上手な付き合い方、合わなかった時の変更手続き、ホームステイのメリット・デメリットを実例ベースで解説。',
  path: '/homestay-guide',
  keywords: [
    'ホームステイ 選び方',
    'ホームステイ 合わない',
    'ホームステイ 探し方',
    'ホームステイ 変更',
    'ホームステイ メリット デメリット',
    'ホームステイ ルール',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: 'ホームステイとは？基本の仕組み' },
  { id: 'pros-cons', label: 'メリット・デメリット' },
  { id: 'criteria', label: 'ホスト選びの5つの基準' },
  { id: 'rules', label: 'ホスト家族との上手な付き合い方' },
  { id: 'mismatch', label: '合わなかった時の対処法' },
  { id: 'faq', label: 'よくある質問' },
];

const PROS = [
  '英語に毎日触れる環境（家族との会話）',
  '食事・洗濯・掃除が提供される（生活立ち上げが楽）',
  '現地の文化・家庭料理を体験できる',
  '困ったとき家族が助けてくれる安心感',
  '初海外でも安心して滞在できる',
  '家族とのつながりが帰国後も続く場合あり',
];

const CONS = [
  '門限・食事時間など家族のルールに従う',
  'プライバシーが限られる',
  '家族との相性ガチャがある',
  '都市部から郊外の住宅地が多く通学時間長め',
  '食事が口に合わない場合のストレス',
  '長期になると自由度の低さが負担',
];

const CRITERIA = [
  {
    title: '① 立地（学校・職場までの通学時間）',
    detail: '通学60分以内が理想。1時間超えると毎日のストレス大。「最寄り駅から学校まで30分、最寄り駅まで徒歩10分」が標準。',
  },
  {
    title: '② 家族構成（子供・ペットの有無）',
    detail: '小さな子供・大型犬・猫アレルギーがある場合は事前に確認。「静かな大人家庭」か「賑やかな子供家庭」か希望を伝える。',
  },
  {
    title: '③ 食事内容（アレルギー・宗教対応）',
    detail: '朝夕食付きが基本。ベジタリアン・ハラール・アレルギー対応の可否を申請時に明記。日本食が恋しくなる場合の対応も。',
  },
  {
    title: '④ 部屋の設備（Wi-Fi・机・暖房）',
    detail: 'Wi-Fi無料か、勉強用の机があるか、冬季の暖房があるか確認。シャワー時間制限がある家庭も。',
  },
  {
    title: '⑤ 過去のホスト経験・評価',
    detail: '長年複数の留学生を受け入れている家庭は安心。学校側にレビュー履歴を聞ける場合も。',
  },
];

const RULES = [
  '到着初日に家族のルールを必ず質問（門限・食事時間・洗濯曜日など）',
  '部屋の片付け・ベッドメイキングは自分で',
  'シャワーは長すぎない（10〜15分目安）',
  '門限を守る、夜遅くなる時は事前連絡',
  '食事の好み・苦手なものを早めに伝える',
  '家族との会話を1日30分以上意識的に',
  '家族イベント・誕生日には参加 or 小さなお土産を',
];

const FAQS = [
  {
    question: 'ホームステイの料金はどれくらい？',
    answer:
      '英語圏で月13〜18万円（食事込み）が一般的。オーストラリアのシドニーは月15〜20万円、カナダのトロントは月14〜17万円、フィリピンは月10〜13万円。語学学校パッケージなら4週間で5〜8万円。',
  },
  {
    question: '家族と合わなかったらどうすればいい？',
    answer:
      'まず学校の留学コーディネーターに相談。深刻な場合（虐待・盗難・差別など）は即座にホスト変更可能。軽度な相性問題（食事・性格）でも、丁寧に説明すれば2〜4週間で変更可能。',
  },
  {
    question: 'ホームステイの期間はどれくらいがおすすめ？',
    answer:
      '1〜2ヶ月がベスト。最初の生活立ち上げに最適です。それ以上長くなると「自由度の低さ」がストレスになりがちで、シェアハウスへの移行を検討する人が多数。',
  },
  {
    question: 'ホストファミリーへのプレゼントは必要？',
    answer:
      '必須ではないが、日本の小さなお土産（お菓子・扇子・タオルなど）を持参すると喜ばれます。1,000〜3,000円の予算で十分。家族の人数分用意するとベター。',
  },
  {
    question: 'ホームステイで友達はできる？',
    answer:
      '家族との関係はできますが、同世代の友達は別途作る必要があります。語学学校や職場、Meetupでの友達作りと並行で。家族との時間と友達との時間のバランスが大事。',
  },
];

export default function HomestayGuidePage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ホームステイ完全ガイド', url: '/homestay-guide' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ホームステイ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ホームステイ完全ガイド｜ホスト選びと合わなかった時の対処法
            </h1>
            <ArticleMetaBadge
              readingMinutes={7}
              updatedAt="2026年5月"
              targetAudience="ワーホリ・留学初期のホームステイ希望者"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ホームステイは生活立ち上げが楽で、英語環境としても優秀。
              <br />
              でも家族との相性ガチャもあり、「合わない」と感じることも。
              <br />
              この記事では、失敗しないホスト選びの基準、家族との付き合い方、合わなかった時の変更手続きを解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'ホームステイのメリット・デメリットと向いている人',
              'ホスト選びの5つの基準（立地・家族構成・食事・設備・経験）',
              '合わなかった時の対処手順と家族変更の方法',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 概要 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ホームステイとは？基本の仕組み</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              ホームステイは、現地の家族の家に滞在し、家族の一員として生活するスタイル。語学学校や留学エージェントが斡旋することが多く、料金は学校パッケージに含まれる場合が多いです。
            </p>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
              個室＋朝夕食付きが基本。家族と共有のリビング・キッチン・バスルームで生活します。
            </p>
          </section>

          {/* メリデメ */}
          <section id="pros-cons" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">メリット・デメリット</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <h3 className="font-bold text-emerald-900 mb-3">⭕ メリット</h3>
                <ul className="text-sm text-emerald-900 space-y-2 list-disc pl-5">
                  {PROS.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                <h3 className="font-bold text-rose-900 mb-3">⚠️ デメリット</h3>
                <ul className="text-sm text-rose-900 space-y-2 list-disc pl-5">
                  {CONS.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="住居タイプを総合的に比較したい方へ"
            description="ホームステイ・シェアハウス・寮の3タイプを8項目で徹底比較しています。"
            primaryHref="/housing-comparison"
            primaryLabel="住居タイプ比較を見る"
            secondaryHref="/packing"
            secondaryLabel="ワーホリ持ち物リスト"
          />

          {/* 選び方 */}
          <section id="criteria" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ホスト選びの5つの基準</h2>
            <div className="space-y-3">
              {CRITERIA.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base text-primary-700">{c.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ルール */}
          <section id="rules" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ホスト家族との上手な付き合い方</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {RULES.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 合わなかった時 */}
          <section id="mismatch" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">合わなかった時の対処法</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              我慢は禁物。早めに対処すれば、変更できます。
            </p>
            <ol className="space-y-3">
              {[
                { title: 'Step 1: 問題の整理', detail: '何が合わないか具体的に書き出す（食事・ルール・家族の態度など）。' },
                { title: 'Step 2: 学校の留学コーディネーターに相談', detail: '無料で相談可能。客観的な意見をもらう。' },
                { title: 'Step 3: ホスト家族との対話の機会を持つ', detail: '改善で済む場合もある。直接話せない場合は学校経由でメッセージ。' },
                { title: 'Step 4: 変更を申請', detail: '改善されない・深刻な問題の場合は変更を申請。2〜4週間で新しいホストへ。' },
                { title: 'Step 5: シェアハウスへの移行も検討', detail: '2回目も合わない場合は、思い切ってシェアハウス移行を。' },
              ].map((s, i) => (
                <li key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-1 text-base">{s.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </li>
              ))}
            </ol>
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
              <li>
                <Link href="/housing-comparison" className="text-primary-600 hover:underline">
                  → 住居タイプ比較（ホームステイ vs シェア vs 寮）
                </Link>
              </li>
              <li>
                <Link href="/women" className="text-primary-600 hover:underline">
                  → 女性一人ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/packing" className="text-primary-600 hover:underline">
                  → ワーホリ持ち物チェックリスト
                </Link>
              </li>
              <li>
                <Link href="/family-study" className="text-primary-600 hover:underline">
                  → 親子留学完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語話せなくてもワーホリ
                </Link>
              </li>
              <li>
                <Link href="/wh-mental-health" className="text-primary-600 hover:underline">
                  → ワーホリのメンタルヘルス
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
