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

const PAGE_PATH = '/wh-job-hunting-japan';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ帰国後の就活完全ガイド｜転職市場での評価・狙い目業界・英語アピール法',
  description: 'ワーホリ帰国後の就活戦略を完全解説。転職市場での評価ポイント、狙い目業界5選、英語力アピール法、職歴ブランクの説明テンプレートまで実例付きで網羅。',
  path: PAGE_PATH,
  keywords: [
    'ワーホリ 帰国後 就職',
    'ワーホリ 転職',
    'ワーホリ 就活',
    'ワーホリ 履歴書',
    'ワーホリ 評価',
    '帰国後 仕事',
  ],
});

const TOC_HEADINGS = [
  { id: 'reality', label: '転職市場での「ワーホリ評価」のリアル' },
  { id: 'target-industries', label: '狙い目業界5選' },
  { id: 'english-tips', label: '英語力をアピールする3つの方法' },
  { id: 'resume-tips', label: '履歴書・職務経歴書テンプレ' },
  { id: 'interview-tips', label: '面接で必ず聞かれる5つの質問と回答例' },
  { id: 'blank-explain', label: '職歴ブランクの説明テンプレ' },
  { id: 'salary-data', label: '帰国後の年収データ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TARGET_INDUSTRIES = [
  {
    industry: '①外資系企業（IT・金融・コンサル）',
    detail: '英語必須職、ワーホリ経験＋ビジネス英語で評価高。年収500-900万円',
    examples: 'Google、Amazon、外資金融、戦略コンサル、外資保険',
  },
  {
    industry: '②グローバル展開する日系企業',
    detail: '海外駐在候補、海外関連部門で経験活かせる。年収400-700万円',
    examples: '商社、メーカー海外事業部、Web系グローバル企業',
  },
  {
    industry: '③インバウンド観光・接客業',
    detail: '英語接客スキル直接活用、ホテル・観光・空港勤務',
    examples: '外資系ホテル、海外旅行会社、空港接客、訪日旅行プランナー',
  },
  {
    industry: '④留学・語学関連業界',
    detail: '自身の経験を商品知識として活用、留学カウンセラー・英語講師',
    examples: '留学エージェント、英会話スクール、Eラーニング企業',
  },
  {
    industry: '⑤海外関連業務のスタートアップ',
    detail: '柔軟な働き方＋海外経験を活かす、即戦力期待',
    examples: '海外進出支援、越境EC、Web3関連、海外マーケティング',
  },
];

const ENGLISH_TIPS = [
  {
    method: '①TOEIC受験で具体スコア提示',
    detail: 'ワーホリ前後の点数比較が最も説得力。730超で書類選考通過率UP',
  },
  {
    method: '②現地での就労経験を具体例で示す',
    detail: '「カフェで毎日100人接客」「現地企業でメール対応」等、具体的な英語使用シーン',
  },
  {
    method: '③英語面接対応の準備',
    detail: '志望動機・自己紹介・退職理由を英語で言えるよう準備。多くの外資系で英語面接あり',
  },
];

const RESUME_TIPS = [
  '職歴の「最新」にワーホリ期間を記載、空白にしない',
  '「Working Holiday in Australia (2024-2025)」と職歴扱いで明記',
  '現地での仕事（カフェ・接客等）も職歴として記載',
  '英語スキル：TOEICスコア＋実際の使用例を併記',
  '渡航目的・成果（スキル習得・人脈・文化理解）を1行で要約',
  '帰国後の応募業界との関連性を「Self PR」で繋げる',
];

const INTERVIEW_QA = [
  {
    q: 'なぜワーホリに行ったのですか？',
    a: 'キャリアの転機として、英語力＋多文化対応力を実地で身につけたかったから。日本の英会話学校では得られないリアルな環境で挑戦したかった。',
  },
  {
    q: 'ワーホリで何を得ましたか？',
    a: '英語コミュニケーション力、多文化チームでの仕事経験、自己解決力。例えば現地カフェでは多国籍チームと毎日協働し、トラブル時も自分で解決する姿勢が身についた。',
  },
  {
    q: 'なぜ帰国後弊社に応募？',
    a: '海外で得た英語力＋現場対応力を貴社の◯◯業務で活かせると考えた。御社が海外展開を強化している中、私のような海外経験者が貢献できると確信。',
  },
  {
    q: 'ブランク期間中のスキル維持は？',
    a: '現地で日常的に英語使用＋関連業界（カフェ・接客等）で実務。さらに○○の資格を取得、または○○の自己学習を継続。',
  },
  {
    q: '今後のキャリアプランは？',
    a: '海外経験を活かし、3年で◯◯のスペシャリスト、5年で○○のマネジメントを目指す。御社の海外事業に貢献しながらキャリアを伸ばしたい。',
  },
];

const BLANK_EXPLAIN_TEMPLATES = [
  '「キャリアの戦略的中断として、英語＋海外経験を取得するため計画的に渡航しました」',
  '「日本での3年の経験を踏まえ、グローバルキャリアの第二フェーズに進むためのワーホリでした」',
  '「業界知識＋現場対応力を、英語環境で再構築するための1年でした」',
  '「現地での○○業務経験により、日本では得られないスキルセットを獲得しました」',
];

const SALARY_DATA = [
  { stage: '帰国直後の転職', industry: '外資系IT・営業職', salary: '450-650万円' },
  { stage: '帰国直後の転職', industry: '日系商社・グローバル企業', salary: '380-550万円' },
  { stage: '帰国直後の転職', industry: 'インバウンド観光・接客', salary: '320-450万円' },
  { stage: '帰国3年後', industry: '外資系・グローバル企業', salary: '550-800万円' },
  { stage: '帰国5年後', industry: '外資系シニア・海外駐在', salary: '700-1,200万円' },
];

const FAQS = [
  {
    question: '本当にワーホリ経験は就活で評価される？',
    answer:
      '業界による。外資系・グローバル企業・インバウンド業界では強いプラス評価。一方で、保守的な日系企業（特に銀行・公務員系）では「遊んでいた」と見られることも。狙う業界を絞れば評価は確実に上がります。応募時点で「なぜワーホリだったか」を明確に説明できるかが鍵。',
  },
  {
    question: '帰国後すぐ就活すべき？',
    answer:
      '理想は帰国の2〜3ヶ月前から準備開始、帰国後1〜2ヶ月で内定。長引かせると「ブランク」が深刻化するため、帰国前にLinkedIn更新・転職エージェント登録・面接準備を進めるのがベスト。リモート面接で帰国前内定もあり得ます。',
  },
  {
    question: '英語力どれくらい必要？',
    answer:
      '業界・職種によりますが、外資系営業・コンサルならTOEIC 800以上が標準。インバウンド観光なら600-700。完全な英語環境で働く職種は TOEIC 900以上＋ビジネス英語必須。「英語ペラペラ」より「具体的なシーンで使える英語」が評価されます。',
  },
  {
    question: '30代でワーホリ帰国の就活は不利？',
    answer:
      '20代より門戸は狭まるが、社会人経験＋ワーホリ経験の組み合わせで「即戦力＋グローバル人材」として評価されるケース多。狙い目は、過去のキャリアの延長線上＋英語要件の職種。完全な未経験職種への転職は厳しいことも。',
  },
  {
    question: '転職エージェントは使うべき？',
    answer:
      'ワーホリ経験者なら強く推奨。海外帰国者向け・外資系特化の転職エージェント（JAC、ロバートウォルターズ、エンワールド等）が、英語要件のある求人を非公開で多数保有。複数登録（3〜4社）で機会最大化を。',
  },
];

export default async function WhJobHuntingJapanPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(就活|転職|帰国後|キャリア|仕事|職)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(就活|転職|帰国後|キャリア|仕事|職)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ帰国後の就活完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ帰国後の就活完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリ帰国後の就活完全ガイド｜転職市場での評価・狙い目業界・英語アピール法
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ワーホリ帰国予定の方／帰国後就活中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「ワーホリ後の就活はうまくいく？」「ブランクをどう説明する？」帰国後の最大の不安。
              <br />
              実は外資系・グローバル企業・インバウンド業界では強いプラス評価。狙う業界選定＋英語力の具体アピール＋面接対策の3点で、年収UP転職も十分可能です。この記事で完全網羅。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '外資系・グローバル企業・インバウンド業界はワーホリ経験を強く評価',
              '英語力は「具体的なシーンで使える」アピールが鍵',
              '帰国2-3ヶ月前から準備、帰国前内定も狙える',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 評価リアル */}
          <section id="reality" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">転職市場での「ワーホリ評価」のリアル</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              ワーホリ経験は「業界選び」次第で評価が180度変わります。狙う業界を見極めることが最重要。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-emerald-800">✓ プラス評価される業界</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・外資系企業全般</li>
                  <li>・グローバル展開する日系企業</li>
                  <li>・インバウンド観光・接客</li>
                  <li>・留学・語学関連</li>
                  <li>・海外関連スタートアップ</li>
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                <p className="font-bold text-base mb-2 text-rose-800">✗ 評価されにくい業界</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>・伝統的な日系銀行・証券</li>
                  <li>・公務員（30歳超制限あり）</li>
                  <li>・保守的な大手日系メーカー</li>
                  <li>・地方の中小企業</li>
                  <li>・新卒採用枠（30歳超不可）</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 狙い目業界 */}
          <section id="target-industries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">狙い目業界5選</h2>
            <div className="space-y-3">
              {TARGET_INDUSTRIES.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{t.industry}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{t.detail}</p>
                  <p className="text-xs text-gray-500"><strong>具体例:</strong> {t.examples}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="ワーホリ後の進路選択肢を広く検討"
            description="帰国就活以外にも、海外残留・PR申請・大学院進学等の選択肢も視野に入れて。"
            primaryHref="/after-wh"
            primaryLabel="ワーホリ後の進路"
            secondaryHref="/30s-guide"
            secondaryLabel="30代からのキャリア戦略"
          />

          {/* 英語アピール */}
          <section id="english-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語力をアピールする3つの方法</h2>
            <div className="space-y-3">
              {ENGLISH_TIPS.map((e, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{e.method}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{e.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 履歴書 */}
          <section id="resume-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">履歴書・職務経歴書テンプレ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {RESUME_TIPS.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">📝</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 面接 */}
          <section id="interview-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">面接で必ず聞かれる5つの質問と回答例</h2>
            <div className="space-y-3">
              {INTERVIEW_QA.map((qa, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-2 text-primary-700">Q{i + 1}: {qa.q}</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded"><strong>A:</strong> {qa.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ブランク説明 */}
          <section id="blank-explain" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">職歴ブランクの説明テンプレ</h2>
            <ul className="space-y-3 text-sm sm:text-base text-gray-800">
              {BLANK_EXPLAIN_TEMPLATES.map((t, i) => (
                <li key={i} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 leading-relaxed">
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* 年収 */}
          <section id="salary-data" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">帰国後の年収データ</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">タイミング</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">業界</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">年収目安</th>
                  </tr>
                </thead>
                <tbody>
                  {SALARY_DATA.map((s, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2">{s.stage}</td>
                      <td className="border border-gray-200 px-3 py-2 font-bold">{s.industry}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700 font-bold">{s.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「就活・転職・キャリア」関連の言及を集計。
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
            ※ 年収データは2026年5月時点の参考値です。業界・職種・スキルにより大きく変動します。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/after-wh" className="text-primary-600 hover:underline">→ ワーホリ後の進路</Link></li>
              <li><Link href="/english-resume-guide" className="text-primary-600 hover:underline">→ 英文レジュメ書き方</Link></li>
              <li><Link href="/wh-after-30" className="text-primary-600 hover:underline">→ 30歳ギリギリWHガイド</Link></li>
              <li><Link href="/regret" className="text-primary-600 hover:underline">→ ワーホリ後悔しないために</Link></li>
              <li><Link href="/30s-guide" className="text-primary-600 hover:underline">→ 30代からの留学</Link></li>
              <li><Link href="/quit-job-wh" className="text-primary-600 hover:underline">→ 社会人ワーホリ退職ガイド</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
