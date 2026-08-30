import type { Metadata } from 'next';
import Link from 'next/link';
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

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリのメンタルヘルス完全ガイド｜ホームシック・帰国後うつ・心の整え方',
  description: 'ワーホリ中のホームシック、孤独感、文化ショック、帰国後のリエントリーショック（逆カルチャーショック）の乗り越え方を実体験ベースで解説。困った時の相談先・サポートリソースも紹介。',
  path: '/wh-mental-health',
  keywords: [
    'ワーホリ メンタル',
    'ワーホリ ホームシック',
    'ワーホリ 帰国 うつ',
    'ワーホリ 孤独',
    'リエントリーショック',
    'ワーホリ しんどい',
    'ワーホリ 鬱',
  ],
});

const TOC_HEADINGS = [
  { id: 'phases', label: 'メンタル不調が起きやすい3つの時期' },
  { id: 'homesick', label: 'ホームシック（到着後1〜3ヶ月）' },
  { id: 'culture-shock', label: '文化ショック（3〜6ヶ月）' },
  { id: 'reentry', label: '帰国後のリエントリーショック' },
  { id: 'resources', label: '相談先・サポートリソース' },
  { id: 'experiences', label: '体験談から見るメンタルの実態' },
  { id: 'faq', label: 'よくある質問' },
];

const PHASES = [
  {
    title: 'フェーズ1: 到着後1〜3ヶ月「ホームシック期」',
    symptoms: '家族・友人が恋しい・日本食が食べたい・言葉が通じないストレス・寂しさ',
    causes: '生活立ち上げの疲労＋環境変化＋慣れない言語＋一人の時間',
    actions: [
      'WhatsApp・LINEで家族と週1回ビデオ通話',
      '同じ語学学校・シェアハウスの友達を意識的に作る',
      '日本食材店で慣れた味を確保',
      '日本の音楽・動画で安心感を保つ',
      '無理しない、寝る、食べる、運動するの基本を守る',
    ],
  },
  {
    title: 'フェーズ2: 3〜6ヶ月「文化ショック・自己嫌悪期」',
    symptoms: '英語が伸びない焦り・思ったほど稼げない・周りと比較・自己評価低下',
    causes: '初期のワクワクが落ち着き、現実と理想のギャップに気づく時期',
    actions: [
      '「3ヶ月の壁」を知識として持つ：誰にでも起きる',
      '日本の家族・友人に弱音を吐く（カッコつけない）',
      '小さな成功体験を意識的に作る（英語で1分会話できた等）',
      '住居や職場を変えるリセットも選択肢',
      '日本人カウンセラーのオンライン相談を利用',
    ],
  },
  {
    title: 'フェーズ3: 帰国後1〜3ヶ月「リエントリーショック期」',
    symptoms: '日本社会への違和感・無気力・「帰ってこなければよかった」感覚・友達との温度差',
    causes: '海外生活の刺激と日本の日常のギャップ、再適応の心理ストレス',
    actions: [
      '帰国前から「逆カルチャーショック」を知っておく',
      '帰国直後は無理に元の生活に戻さない（1〜2週間ゆっくり）',
      '同じワーホリ経験者と会って話す',
      '転職活動・新しい挑戦に集中することで気持ちを前向きに',
      '長引く場合（1ヶ月以上）はメンタルクリニックへ',
    ],
  },
];

const RESOURCES = [
  {
    name: '日本人カウンセラーのオンライン相談',
    detail: 'cotree、Pinto Mind、ココロ ノ ハナシ などのサービスで日本人カウンセラーと相談可。海外からも利用可能。',
  },
  {
    name: 'よりそいホットライン',
    detail: '24時間無料、外国語対応もあり。電話: 0120-279-338',
  },
  {
    name: '在外公館（大使館・領事館）',
    detail: '深刻な状況の場合は管轄の日本大使館・領事館に連絡。日本人スタッフが対応。',
  },
  {
    name: 'ワーホリ・留学エージェントのサポート',
    detail: '出発時のエージェントに相談すると、現地の日本語カウンセラーを紹介してもらえる場合あり。',
  },
  {
    name: '現地の日本人コミュニティ',
    detail: '日本人会・教会・Facebook グループ。深刻でなくても日本語で話せる場として活用。',
  },
];

const FAQS = [
  {
    question: 'ワーホリで本当にうつになる人はいる？',
    answer:
      'います。誰にでも起こりうる現象です。特に「英語が伸びない焦り」「期待していたほど稼げない現実」「孤独感」が重なる3〜6ヶ月目が要注意期間。早めの対策（休む・話す・場所を変える）が重要です。',
  },
  {
    question: '帰国後のリエントリーショックはどのくらい続く？',
    answer:
      '個人差はありますが、3週間〜3ヶ月が標準的。長くても半年でほぼ収まります。ただし1ヶ月以上続いて生活に支障が出る場合は、メンタルクリニックへ相談しましょう。',
  },
  {
    question: '途中帰国するべきか迷ったときは？',
    answer:
      '「数日休んで考える」が鉄則。即決はNG。一時的な落ち込みなら3〜7日で回復することが多いです。それでも回復しない・心身に支障が出る場合は、無理せず帰国も選択肢。',
  },
  {
    question: 'メンタル悪化を防ぐ予防策は？',
    answer:
      '出発前の準備として、(1) 帰国後のキャリア仮決め、(2) 現地の友人作り計画、(3) 日本との連絡頻度の合意、(4) 「3ヶ月の壁」の知識、(5) サポートリソースのブックマーク——この5つを準備しておくと、不調を最小化できます。',
  },
  {
    question: '海外で精神科にかかれる？',
    answer:
      'かかれます。海外旅行保険のメンタルヘルス対応の有無を事前に確認。「Japanese-speaking psychiatrist + 都市名」でGoogle検索すると日本人医師が見つかります。',
  },
];

export default async function WhMentalHealthPage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(ホームシック|孤独|寂し|辛|つら|しんどい|メンタル|うつ|疲れ|帰りたい)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.cons?.map((c) => c.text).join(' ') ?? ''}`,
        /(ホームシック|孤独|寂し|辛|つら|しんどい|メンタル|うつ|疲れ|帰りたい)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリのメンタルヘルス完全ガイド', url: '/wh-mental-health' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリのメンタルヘルス完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリのメンタルヘルス完全ガイド｜ホームシック・帰国後うつの乗り越え方
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="ワーホリ中・帰国前後の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリ中・帰国後のメンタル不調は、誰にでも起こりうる現象です。
              <br />
              この記事では、起きやすい3つの時期（ホームシック・文化ショック・リエントリーショック）と、それぞれの乗り越え方、相談先まで解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'メンタル不調は3つの時期（1〜3ヶ月・3〜6ヶ月・帰国後）に起きやすい',
              '「3ヶ月の壁」を知識として持つだけで乗り越えやすくなる',
              '困ったら日本人カウンセラーのオンライン相談を活用',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* フェーズ */}
          <section id="phases" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">メンタル不調が起きやすい3つの時期</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              ワーホリ前後で、メンタルが揺らぎやすい時期は3つに分けられます。事前に知っておくと、自分の状態を客観視できます。
            </p>
            <div className="space-y-6">
              {PHASES.map((p, i) => (
                <div key={i} id={['homesick', 'culture-shock', 'reentry'][i]} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-3 text-base sm:text-lg text-rose-700">{p.title}</h3>
                  <div className="bg-rose-50 border-l-4 border-rose-300 px-4 py-3 mb-3 rounded-r">
                    <p className="text-xs font-bold text-rose-900 mb-1">主な症状</p>
                    <p className="text-sm text-rose-900 leading-relaxed">{p.symptoms}</p>
                  </div>
                  <div className="bg-sky-50 border-l-4 border-sky-300 px-4 py-3 mb-3 rounded-r">
                    <p className="text-xs font-bold text-sky-900 mb-1">原因</p>
                    <p className="text-sm text-sky-900 leading-relaxed">{p.causes}</p>
                  </div>
                  <div className="bg-emerald-50 border-l-4 border-emerald-400 px-4 py-3 rounded-r">
                    <p className="text-xs font-bold text-emerald-900 mb-2">対策</p>
                    <ul className="text-sm text-emerald-900 space-y-1 list-disc pl-5">
                      {p.actions.map((a, j) => (
                        <li key={j}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="後悔しないためのワーホリ準備"
            description="出発前の準備でメンタル不調のリスクは大きく下げられます。"
            primaryHref="/regret"
            primaryLabel="ワーホリで後悔しないための7つの教訓"
            secondaryHref="/wh-anxiety-and-persuasion"
            secondaryLabel="不安と親説得ガイド"
          />

          {/* リソース */}
          <section id="resources" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">相談先・サポートリソース</h2>
            <div className="space-y-3">
              {RESOURCES.map((r, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-1 text-base">{r.name}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るメンタルの実態</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{mentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {mentions.containsCount}件</strong>
                （{mentions.percentage}%）が「ホームシック・孤独・辛さ」について言及していました。
              </p>
              <p className="text-xs text-gray-500">
                ※ advice/pros/cons から関連キーワードを含む体験談を抽出（参考値）。
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

          <p className="text-xs text-gray-500 mb-8">
            ※ 本記事は一般的な情報です。深刻な症状が続く場合は、必ず医療機関へご相談ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための教訓
                </Link>
              </li>
              <li>
                <Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">
                  → ワーホリの不安と親説得
                </Link>
              </li>
              <li>
                <Link href="/after-wh" className="text-primary-600 hover:underline">
                  → 帰国後就活完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/wh-connections" className="text-primary-600 hover:underline">
                  → ワーホリでの出会い・人間関係
                </Link>
              </li>
              <li>
                <Link href="/women" className="text-primary-600 hover:underline">
                  → 女性一人ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="text-primary-600 hover:underline">
                  → 全77件の体験談を読む
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
