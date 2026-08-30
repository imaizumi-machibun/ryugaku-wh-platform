import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ExperienceCard from '@/components/experience/ExperienceCard';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { getExperiences } from '@/lib/microcms/experiences';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ帰国後の就活完全ガイド｜転職活動の進め方と成功事例【2026年版】',
  description: 'ワーホリ帰国後の就活は不利？転職活動の始め方、履歴書の書き方、ワーホリ経験が評価される業界、実際に内定を獲得した体験談まで、帰国前から準備すべきことを一気にまとめました。',
  path: '/after-wh',
  keywords: [
    'ワーホリ 帰国後 就活',
    'ワーホリ 帰国後 転職',
    'ワーホリ 帰国後 仕事',
    'ワーホリ 履歴書 書き方',
    'ワーホリ 就職活動',
    'ワーホリ キャリア',
    'ワーホリ 経験 評価',
  ],
});

const FAQS = [
  {
    question: 'ワーホリ帰国後、就活のブランク期間はどう説明すればいいですか？',
    answer:
      '「英語力を実務レベルまで引き上げ、海外で◯ヶ月就労した」と具体的なアウトカム（語学スコア・業務経験・成果数値）でブランクを意味のある投資期間として再定義しましょう。「自分探し」「リフレッシュ」のような表現は避け、能動的なキャリア形成として伝えるのがコツです。',
  },
  {
    question: 'ワーホリ経験は履歴書にどう書けばいいですか？',
    answer:
      '職務経歴書には「Working Holiday in （国名）（YYYY年MM月〜YYYY年MM月）」として独立した職歴として記載。現地での就労内容・使用言語・チーム規模・達成成果を職務経歴と同じフォーマットで書きます。語学スコア（TOEIC・IELTS）は出発前/帰国後の2回分を併記すると伸びが伝わります。',
  },
  {
    question: '帰国後すぐに転職活動を始めるべきですか？それとも休んでから？',
    answer:
      '帰国前から動くのが最適です。海外滞在中にオンラインで転職エージェント面談を済ませ、帰国2〜3週間以内に対面面接を入れられる状態を作っておきましょう。完全帰国後に休んでから動くと、貯金の減少＋焦りで条件交渉が不利になりやすいです。',
  },
  {
    question: 'ワーホリ経験者が採用されやすい業界はどこですか？',
    answer:
      '外資系（IT・コンサル・金融）、グローバル展開している事業会社（メーカー・商社）、観光・ホスピタリティ、教育・語学スクール、英語が必要なBtoB SaaS営業などが評価されやすい業界です。逆に内資のみで完結している伝統業界は経験年数重視で、ワーホリ単独では差別化が難しいケースもあります。',
  },
  {
    question: 'ワーホリ中に取っておくべき資格・語学スコアはありますか？',
    answer:
      'TOEIC 800以上、IELTS 6.5以上が転職市場で「実務英語あり」と認知される最低ライン。加えて現地で取得できる資格（オーストラリアのバリスタ資格、TESOL、Web系資格など）は職種転換時の武器になります。帰国直前に必ず受験して、最新スコアで応募できる状態を作っておきましょう。',
  },
];

const TIMELINE = [
  {
    phase: '帰国3〜4ヶ月前',
    title: 'オンライン情報収集と転職エージェント登録',
    description: '日本の転職市場の現状把握、エージェント（リクルート・doda・JAC Recruitment・ビズリーチ等）にオンライン登録、業界トレンドのリサーチ。',
  },
  {
    phase: '帰国2ヶ月前',
    title: '履歴書・職務経歴書の作成・添削',
    description: 'ワーホリ経験を含めた職務経歴書を作成し、エージェントに添削依頼。語学スコアの最新版を取得（IELTS・TOEIC再受験）。',
  },
  {
    phase: '帰国1ヶ月前',
    title: 'オンライン1次面接の開始',
    description: '可能な企業から順次オンライン面接を入れ、帰国後すぐに2次・最終面接へ進める状態を作る。日本時間の業務時間に合わせる必要あり。',
  },
  {
    phase: '帰国直後〜1ヶ月',
    title: '対面面接ラッシュ',
    description: '時差ボケ・環境変化に注意しつつ、対面面接を集中投入。スーツ・革靴・面接用の身だしなみを事前準備。',
  },
  {
    phase: '帰国1〜3ヶ月',
    title: '内定獲得・条件交渉・入社',
    description: '複数内定を比較して条件交渉。ワーホリ経験のアウトカムを軸に年収・職種・勤務地で希望条件を提示。',
  },
];

const EVALUATED_FIELDS = [
  {
    industry: '外資系IT・SaaS',
    points: '英語でのチームコミュニケーション、グローバル本社との連携、ドキュメント英語化対応',
  },
  {
    industry: '商社・メーカー海外営業',
    points: '海外取引先との交渉経験、現地ビジネス慣習への理解、駐在候補としての適性',
  },
  {
    industry: '観光・ホスピタリティ',
    points: '海外接客経験、多言語対応、訪日インバウンド客への共感',
  },
  {
    industry: '教育・語学スクール',
    points: '英語学習者としての実体験、教材開発・カウンセリング経験への活用',
  },
  {
    industry: 'コンサルティング',
    points: '異文化下での問題解決経験、英語プレゼン、グローバル案件参画の可能性',
  },
  {
    industry: 'スタートアップ',
    points: '不確実性への耐性、英語での海外パートナー対応、海外展開時の即戦力性',
  },
];

export default async function AfterWhPage() {
  // adviceフィールドに「転職」「就活」「キャリア」「帰国」のいずれかを含む体験談を抽出
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const careerExperiences = experiencesData.contents.filter((e) => {
    const text = `${e.advice ?? ''} ${e.content ?? ''}`;
    return /転職|就活|キャリア|帰国/.test(text);
  }).slice(0, 6);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ帰国後の就活ガイド', url: '/after-wh' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ帰国後の就活ガイド' }]} />

        <article className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            帰国後の転職を有利にする、5つの準備
          </h1>
          <ArticleMetaBadge
            readingMinutes={9}
            updatedAt="2026年5月"
            targetAudience="ワーホリ帰国後の就活が不安な方"
          />
          <p className="text-gray-700 leading-relaxed text-base">
            「ワーホリ帰国後の就活って、不利になるって本当？」
            <br />
            その不安は、出発前から戦略を立てることで「ワーホリ経験を強みにした転職」に変えられます。
            <br />
            この記事では、帰国3〜4ヶ月前から始める準備の進め方、実際に転職を成功させた渡航者の事例を時系列でまとめました。
          </p>
        </header>

        <KeyTakeaway
          items={[
            'ワーホリ帰国後の就活「不利」と言われる理由と実態の乖離',
            '帰国3〜4ヶ月前から始める転職活動のタイムライン',
            'ワーホリ経験が評価されやすい業界・職種と、履歴書の書き方',
          ]}
        />

        <InPageTOC
          headings={[
            { id: 'reality', label: 'ワーホリ帰国後の就活、実態は？' },
            { id: 'timeline', label: '帰国〜内定までの標準タイムライン' },
            { id: 'fields', label: 'ワーホリ経験が評価されやすい業界・職種' },
            { id: 'experiences', label: 'キャリアに言及している体験談' },
            { id: 'resume', label: '履歴書・職務経歴書の書き方ポイント' },
            { id: 'faq', label: 'よくある質問' },
          ]}
        />

        {/* 実態セクション */}
        <section id="reality" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">ワーホリ帰国後の就活、実態は？</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
              <h3 className="font-bold mb-2 text-rose-900">「不利」と言われる主な理由</h3>
              <ul className="text-sm text-rose-800 space-y-2 list-disc pl-5">
                <li>新卒一括採用や経験年数重視の伝統的な日本企業では評価されにくい</li>
                <li>ワーホリ＝「観光・休暇」のイメージを持つ採用担当者がいる</li>
                <li>帰国直後の応募は焦りが伝わり条件交渉が不利になりがち</li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <h3 className="font-bold mb-2 text-emerald-900">実際には「強み」になる要素</h3>
              <ul className="text-sm text-emerald-800 space-y-2 list-disc pl-5">
                <li>英語スコアの大幅な向上（出発前→帰国後の差分が定量証拠）</li>
                <li>異文化下での就労経験・問題解決スキル</li>
                <li>自立力・適応力・グローバル感覚（外資系では強い武器）</li>
                <li>採用ニーズの高い「英語×〇〇」のスキル組み合わせ</li>
              </ul>
            </div>
          </div>
        </section>

        {/* タイムライン */}
        <section id="timeline" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">帰国〜内定までの標準タイムライン</h2>
          <p className="text-sm text-gray-600 mb-6">
            帰国前から準備を始めることで、帰国1〜3ヶ月以内の内定獲得が現実的な目標になります。
          </p>
          <div className="space-y-3">
            {TIMELINE.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4"
              >
                <div className="sm:w-44 shrink-0">
                  <span className="inline-block text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded">
                    {t.phase}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{t.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 中段CTA */}
        <MidCTA
          title="帰国前に体験談を投稿して、次の人の参考になりませんか？"
          description="あなたの体験談が、これからワーホリに行く後輩の判断材料になります。投稿は無料、5分で完了します。"
          primaryHref="/submit/experience"
          primaryLabel="体験談を投稿する"
          secondaryHref="/experiences"
          secondaryLabel="他の人の体験談を見る"
        />

        {/* 評価されやすい業界 */}
        <section id="fields" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">ワーホリ経験が評価されやすい業界・職種</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EVALUATED_FIELDS.map((f) => (
              <div key={f.industry} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-2">{f.industry}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{f.points}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            職種別の詳細は
            <Link href="/jobs" className="text-primary-600 hover:underline mx-1">
              職業別海外キャリアガイド
            </Link>
            から各業界別ページをご覧ください。
          </p>
        </section>

        {/* 体験談（キャリア言及） */}
        {careerExperiences.length > 0 && (
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              キャリアに言及している体験談（{careerExperiences.length}件）
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              実際にワーホリから帰国した方の「アドバイス」「本文」からキャリア・転職・就活に言及している体験談を抽出しています。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerExperiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </section>
        )}

        {/* 履歴書のヒント */}
        <section id="resume" className="mb-12 bg-sky-50 border border-sky-100 rounded-xl p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-sky-900">履歴書・職務経歴書の書き方ポイント</h2>
          <ul className="text-sm text-sky-900 space-y-2 list-disc pl-5">
            <li>「Working Holiday in（国名）」として独立した職歴ブロックを作る</li>
            <li>現地での就労内容（職種・期間・チーム規模）を職務経歴と同じフォーマットで記載</li>
            <li>語学スコア（出発前/帰国後の2回分）を併記して伸びを定量化</li>
            <li>取得した資格・スキル（バリスタ資格・TESOL・Web系資格など）を箇条書きで明記</li>
            <li>「自分探し」「リフレッシュ」など消極的表現は避け、能動的なキャリア投資として再定義</li>
          </ul>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">ワーホリ帰国後の就活に関するよくある質問</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 内部リンク */}
        <section className="mb-8 bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">合わせて読みたい</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <li>
              <Link href="/guide/return-career" className="text-primary-600 hover:underline">
                → ワーホリ完全ガイド：帰国後キャリアのフェーズ
              </Link>
            </li>
            <li>
              <Link href="/age/20s-late" className="text-primary-600 hover:underline">
                → 社会人ワーホリ完全ガイド（20代後半）
              </Link>
            </li>
            <li>
              <Link href="/age/30s" className="text-primary-600 hover:underline">
                → 30代のワーホリ・留学ガイド
              </Link>
            </li>
            <li>
              <Link href="/fresh-grad-wh" className="text-primary-600 hover:underline">
                → 新卒ワーホリと就職の両立ガイド
              </Link>
            </li>
            <li>
              <Link href="/jobs" className="text-primary-600 hover:underline">
                → 職業別 海外キャリアガイド
              </Link>
            </li>
            <li>
              <Link href="/submit/experience" className="text-primary-600 hover:underline">
                → 自分の体験談を投稿する
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
