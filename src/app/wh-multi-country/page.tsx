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

const PAGE_PATH = '/wh-multi-country';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '複数国ワーホリ完全ガイド｜豪→加→英→独の連続WH戦略',
  description: '複数国ワーホリ完全ガイド。豪→加→英→独等の連続WH、ビザの組み合わせ、年齢制限管理、計画の立て方、メリットデメリットを完全解説。',
  path: PAGE_PATH,
  keywords: [
    '複数国 ワーホリ',
    'ワーホリ 連続',
    '2回目 ワーホリ',
    'ワーホリ 何カ国',
    '複数 WH ビザ',
    'ワーホリ 渡り歩く',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-multi', label: 'なぜ複数国WHが人気か' },
  { id: 'visa-rules', label: 'WHビザのルール（重複不可？）' },
  { id: 'sample-routes', label: 'おすすめ連続WHルート4選' },
  { id: 'planning', label: '計画の立て方（年齢逆算）' },
  { id: 'cost-strategy', label: '費用戦略（稼ぎながら移動）' },
  { id: 'language-progression', label: '英語力アップの設計' },
  { id: 'pros-cons', label: 'メリット・デメリット' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const SAMPLE_ROUTES = [
  {
    route: '①豪→加→英 3ヶ国・最大6年',
    detail: '豪WHV 1年（+セカンド+3rd で最大3年）→IEC 1-2年→UK YMS 2年',
    age: '25歳前半スタート→30歳前後完了',
    feature: '英語圏3大国、北米・欧州・オセアニア全制覇',
  },
  {
    route: '②豪→NZ 2ヶ国・最大4年',
    detail: '豪WHV 1年（+セカンド+3rd で最大3年）→NZ WHV 1年',
    age: '20代後半スタート向け',
    feature: 'オセアニア集中、移動コスト安、文化近い',
  },
  {
    route: '③加→英→独 欧州周遊型',
    detail: 'IEC 1-2年→UK YMS 2年→Germany WHV 1年',
    age: '20代前半-中盤スタート向け',
    feature: '北米英語＋欧州英語＋ドイツ語、欧州周遊',
  },
  {
    route: '④フィリピン→豪→加 アジア＋英語圏',
    detail: 'フィリピン語学留学3-6ヶ月→豪WHV 1-3年→IEC 1-2年',
    age: '英語ゼロからスタート向け',
    feature: '英語基礎→実践→キャリア構築の三段階',
  },
];

const PLANNING_TIPS = [
  '年齢逆算：30歳前半までに何ヶ国完了したいか目標設定',
  '最初の国は確実取得可能な豪・NZ（先着）から',
  '抽選国（カナダIEC・UK YMS）は早めに応募',
  '各国WH間に1-3ヶ月の移動・休息期間を計画',
  '貯金は最初の国で集中、移動費＋次の初期費用確保',
  '健康保険・年金等の日本手続きを各国移動時に処理',
];

const COST_STRATEGY = [
  '最初の国（豪・NZ）で月20-40万円稼いで貯金',
  '移動費：航空券＋初期生活費で20-50万円必要',
  '次の国到着後、最初の1-2ヶ月で仕事確保',
  '物価安国（独・ニュージーランド）の方が貯金率高',
  '高物価国（英・米・カナダ）は短期集中で勝負',
  '帰国費用＋日本帰国直後の3ヶ月生活費を確保',
];

const LANGUAGE_PROGRESSION = [
  'Step 1: フィリピン3-6ヶ月で英語基礎（TOEIC 500→700）',
  'Step 2: 豪・NZでローカル仕事＋英語実践（TOEIC 700→850）',
  'Step 3: カナダ・英でビジネス英語＋専門スキル（TOEIC 850→950）',
  'Step 4: 独・仏で第二外国語＋多文化体験',
  '結果：英語ペラペラ＋複数言語ベーシック＋多文化対応力',
];

const PROS = [
  '複数国の文化・人脈・経験を獲得',
  '英語＋他言語の習得機会',
  '柔軟性・適応力の習得',
  'グローバル人材として転職市場で差別化',
  '飽きない・新鮮な体験継続',
  'PR候補国を比較検討できる',
];

const CONS = [
  '各国の住居・口座・友人関係を都度リセット',
  '移動費・初期費用が複数回かかる',
  '長期キャリア構築には不利（連続移動で蓄積されない）',
  '年齢制限内に複数国行く必要、時間管理タイト',
  'PR取得から遠ざかる（1ヶ国に長期滞在する方が有利）',
  '帰国後のブランクが長くなる',
];

const FAQS = [
  {
    question: '複数国WHは年齢的に何ヶ国行ける？',
    answer:
      '一般的に20代前半スタートで3-4ヶ国、20代後半スタートで2-3ヶ国が現実的。年齢制限18-30歳で、各国1-3年滞在＋移動期間を考慮。豪セカンド+3rd（3年）＋カナダIEC（1-2年）＋UK YMS（2年）の組み合わせで最大6-7年も理論的に可能。',
  },
  {
    question: '同じ国に2回WHできる？',
    answer:
      '原則不可。WHVは一国一回が基本。例外：豪WHVはセカンド・3rdビザで延長可、加IECは2回目チャレンジ可能（特定条件）。同じ国で長期滞在したい場合は、WH→学生ビザ→就労ビザの切替で対応。',
  },
  {
    question: 'PR取得目標なら複数国はマイナス？',
    answer:
      'マイナス。PR取得には1ヶ国での長期就労（4-5年）＋雇用主スポンサーが必要。複数国移動はキャリア蓄積されず不利。PR目標なら1ヶ国に集中、複数国WHは「人生経験重視」「PR後の海外生活基盤作り」目的。',
  },
  {
    question: '貯金はどれくらい必要？',
    answer:
      '最初の国スタート時150-200万円、各国移動時に追加100-150万円必要。連続WHは初期費用が複数回かかるため、最初の国で月20-40万円ペースで貯金＋稼いで次の国の資金確保が王道。',
  },
  {
    question: '日本での年金・健康保険は？',
    answer:
      '海外転出届を出していれば、海外滞在中は年金任意・健康保険脱退。複数国WH中も一度も日本に住民登録しなければ、その期間は無税・保険料なし。帰国時に転入届→各種再加入のシンプルなフロー。',
  },
];

export default async function WhMultiCountryPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(複数国|連続|2回目|何カ国|渡り歩|複数のワーホリ)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(複数国|連続|2回目|何カ国|渡り歩)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '複数国ワーホリ完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '複数国ワーホリ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              複数国ワーホリ完全ガイド｜豪→加→英→独の連続WH戦略
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="20代で複数国の海外生活経験したい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              1ヶ国のWHでは物足りない、複数国を渡り歩いて世界中の文化・言語を体験したい人向けの「連続WH戦略」。30歳までに3-4ヶ国制覇も理論的に可能。
              <br />
              この記事ではビザのルール、おすすめ連続WHルート、計画の立て方、費用戦略、メリデメまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '20代前半スタートで3-4ヶ国、後半スタートで2-3ヶ国が目安',
              '豪→加→英 3ヶ国ルートは英語圏全制覇のゴールデンルート',
              'PR取得目標なら1ヶ国集中、人生経験重視なら複数国',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜ */}
          <section id="why-multi" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">なぜ複数国WHが人気か</h2>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・1ヶ国WHでは体験しきれない多様な文化</li>
              <li>・複数言語学習の機会（英語＋仏・独・伊等）</li>
              <li>・複数国で人脈構築、グローバルネットワーク</li>
              <li>・PR候補国を比較検討してから決められる</li>
              <li>・新鮮な体験継続、飽きない海外生活</li>
              <li>・グローバル人材として転職市場で差別化</li>
            </ul>
          </section>

          {/* ビザルール */}
          <section id="visa-rules" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">WHビザのルール（重複不可？）</h2>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・<strong>原則:</strong> WHVは一国一回（同国で複数回取得不可）</p>
              <p>・<strong>例外1:</strong> 豪WHVはセカンド・3rdビザで最大3年延長可</p>
              <p>・<strong>例外2:</strong> カナダIEC、特定条件で2回目チャレンジ可</p>
              <p>・<strong>異なる国:</strong> 何ヶ国でもWHV取得可（年齢制限内）</p>
              <p>・<strong>年齢制限:</strong> ほぼ全国18-30歳、申請時の年齢が基準</p>
              <p>・<strong>同時保有:</strong> 1人で複数国WHV同時保有可、ただし1ヶ国ずつ滞在</p>
            </div>
          </section>

          {/* ルート */}
          <section id="sample-routes" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">おすすめ連続WHルート4選</h2>
            <div className="space-y-3">
              {SAMPLE_ROUTES.map((r, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{r.route}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>詳細:</strong> {r.detail}</p>
                    <p><strong>年齢:</strong> {r.age}</p>
                    <p className="text-xs text-gray-500 mt-2">{r.feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="30歳ギリギリWH・各国詳細も合わせて"
            description="年齢制限ルール、各国のWH詳細情報も確認を。"
            primaryHref="/wh-after-30"
            primaryLabel="30歳ギリギリWHガイド"
            secondaryHref="/au-vs-canada"
            secondaryLabel="豪vsカナダ比較"
          />

          {/* 計画 */}
          <section id="planning" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">計画の立て方（年齢逆算）</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PLANNING_TIPS.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 費用戦略 */}
          <section id="cost-strategy" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用戦略（稼ぎながら移動）</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {COST_STRATEGY.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">💰</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 英語進化 */}
          <section id="language-progression" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語力アップの設計</h2>
            <ol className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5 list-none">
              {LANGUAGE_PROGRESSION.map((l, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">→</span>
                  <span>{l}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* メリデメ */}
          <section id="pros-cons" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">メリット・デメリット</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-emerald-800">✓ メリット</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {PROS.map((p, i) => (
                    <li key={i} className="leading-relaxed">・{p}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                <p className="font-bold text-base mb-3 text-rose-800">✗ デメリット</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  {CONS.map((c, i) => (
                    <li key={i} className="leading-relaxed">・{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「複数国・連続WH・2回目」関連の言及を集計。
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

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/wh-after-30" className="text-primary-600 hover:underline">→ 30歳ギリギリWHガイド</Link></li>
              <li><Link href="/au-vs-canada" className="text-primary-600 hover:underline">→ 豪vsカナダ比較</Link></li>
              <li><Link href="/au-vs-uk" className="text-primary-600 hover:underline">→ 豪vs英比較</Link></li>
              <li><Link href="/aus-vs-newzealand" className="text-primary-600 hover:underline">→ 豪vs NZ比較</Link></li>
              <li><Link href="/europe-budget-travel" className="text-primary-600 hover:underline">→ 欧州周遊予算術</Link></li>
              <li><Link href="/au-second-year-visa" className="text-primary-600 hover:underline">→ 豪WHセカンドビザ</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
