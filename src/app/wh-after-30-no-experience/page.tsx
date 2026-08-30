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

const PAGE_PATH = '/wh-after-30-no-experience';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '30代社会人未経験ワーホリ完全ガイド｜キャリアブランク・英語ゼロからの挑戦',
  description: '30代社会人で海外未経験・英語苦手でもワーホリに挑戦する完全ガイド。退職タイミング、キャリアブランクの説明、英語ゼロからの上達法、帰国後の進路まで実例ベースで網羅。',
  path: PAGE_PATH,
  keywords: [
    '30代 社会人 ワーホリ',
    '30代 未経験 ワーホリ',
    'キャリアブランク ワーホリ',
    '30代 英語ゼロ',
    '30代 海外 挑戦',
    '社会人 ワーホリ 退職',
  ],
});

const TOC_HEADINGS = [
  { id: 'reality', label: '30代未経験ワーホリのリアル' },
  { id: 'concerns', label: '5大不安と解消法' },
  { id: 'preparation', label: '準備期間と退職タイミング' },
  { id: 'english-zero', label: '英語ゼロからの上達戦略' },
  { id: 'where-to-go', label: '30代未経験におすすめ国' },
  { id: 'career-blank', label: 'キャリアブランクの説明方法' },
  { id: 'after-return', label: '帰国後の進路選択肢' },
  { id: 'success-tips', label: '成功させる7つのコツ' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const CONCERNS = [
  {
    concern: '①「30代で未経験＝遅い」と思う',
    answer: '30代ワーホリ参加者は年々増加、特にコロナ後はキャリアチェンジ目的の30代社会人が急増。「もう遅い」ではなく「今だからこそ」の選択肢',
  },
  {
    concern: '②英語ゼロでビビっている',
    answer: '英語ゼロからスタートする30代も多。フィリピン語学留学（3ヶ月）→英語圏でWHのステップアップが王道。現地6ヶ月で日常会話、1年でビジネス基礎レベル到達例多',
  },
  {
    concern: '③退職してキャリアブランクが怖い',
    answer: '外資系・海外関連企業ではむしろプラス評価。1年のブランクは「グローバル経験」として転職市場で武器に',
  },
  {
    concern: '④貯金不足、お金が心配',
    answer: '100-150万円スタート可能（豪・NZ・独）。現地で時給高い仕事に就けば月20-40万円稼げる、生活費との差額で貯金維持・追加貯金も',
  },
  {
    concern: '⑤帰国後の就活が不安',
    answer: '帰国2-3ヶ月前から準備、リモート面接で帰国前内定獲得も可。外資・グローバル企業・インバウンド業界は30代海外経験者を積極採用',
  },
];

const PREPARATION = [
  { phase: '退職決断〜1ヶ月後', detail: '退職交渉開始、目標渡航国選定、貯金開始（月10-20万円ペース）' },
  { phase: '退職後1-2ヶ月', detail: '英語学習集中、住民票・年金等の手続き、ビザ申請開始' },
  { phase: '退職3-4ヶ月後', detail: 'ビザ取得、航空券・保険・住居の手配' },
  { phase: '退職4-5ヶ月後', detail: '渡航、現地生活立ち上げ、最初の仕事探し' },
  { phase: '渡航3-6ヶ月後', detail: '安定した仕事、英語上達、現地ネットワーク構築' },
];

const ENGLISH_ZERO_STRATEGY = [
  'Step 1: 出発前6ヶ月オンライン英会話毎日30分（DMM・レアジョブ）',
  'Step 2: 出発前3ヶ月で基本フレーズ500個暗記（旅行・面接・接客）',
  'Step 3: フィリピン語学留学3ヶ月（マンツーマンで集中）',
  'Step 4: 英語圏WHで日本食レストラン→ローカル接客にステップアップ',
  'Step 5: 現地英会話アプリ＋日本人少ない環境積極選択',
  'Step 6: 帰国前にIELTSorTOEIC受験で具体スコア化',
];

const WHERE_TO_GO = [
  {
    country: 'オーストラリア',
    feature: '時給世界一・先着ビザ・温暖気候・治安◎、30代未経験に最適',
    reason: '稼ぎながら英語上達、生活費補填しやすい',
  },
  {
    country: 'カナダ',
    feature: '北米英語・PR取得しやすい・治安◎、長期視野の30代に',
    reason: 'IEC抽選があるが、安定キャリア構築',
  },
  {
    country: 'ニュージーランド',
    feature: '物価安・治安世界トップ・ゆったり生活、英語没頭環境',
    reason: '初心者・コスパ重視・大自然好き',
  },
  {
    country: 'マルタ',
    feature: '欧州雰囲気・治安◎・物価中程度・3ヶ月ビザ不要',
    reason: '欧州体験＋英語＋コスパ＋治安重視',
  },
];

const CAREER_BLANK_TEMPLATES = [
  '「30代でのキャリア転機として、英語＋海外経験を取得するための計画的渡航」',
  '「日本での○年の経験を踏まえ、グローバル人材としての次フェーズへ」',
  '「業界知識＋現場対応力を、英語環境で再構築するための1年」',
  '「現地での○○業務経験により、日本では得られないスキルセットを獲得」',
  '「キャリアダウンではなく、長期キャリアのためのアップデート」',
];

const AFTER_RETURN = [
  '外資系企業・グローバル企業（英語要件職）への転職',
  '日系商社・メーカーの海外事業部、駐在員候補',
  'インバウンド観光・ホテル・空港接客',
  '留学・語学関連業界（自身の経験を商品知識として）',
  '海外関連スタートアップ',
  'フリーランス独立（海外取引・翻訳・通訳）',
  '元の業界に戻る場合も英語・海外経験で差別化',
];

const SUCCESS_TIPS = [
  '「30代だから」と引け目を感じず堂々と振る舞う',
  '英語コンプレックスを早期に乗り越える（最初の3ヶ月が勝負）',
  '現地で日本人と固まりすぎず、多国籍コミュニティに飛び込む',
  '健康管理・体力作り（30代以降の体力低下対策）',
  'お金管理を厳格に、毎月の収支を記録',
  '帰国後のビジョンを明確に持つ（漫然と過ごさない）',
  'SNS発信＋ブログで自分の経験を価値化',
];

const FAQS = [
  {
    question: '30代未経験で本当に大丈夫？',
    answer:
      '大丈夫。30代ワーホリは年々増加、特にコロナ後はキャリアチェンジ・人生再考の30代が急増。専門学校・職場のシニア層と仲良くなりやすい、若者向けクラブ・パーティ等の若者向け環境を避ければ問題なし。「30代だから」と引け目を感じず、自分のペースで楽しむ姿勢が大事。',
  },
  {
    question: '英語ゼロでも行ける？',
    answer:
      '行ける。フィリピン語学留学3ヶ月→英語圏WHのステップアップで、3ヶ月で日常会話、1年でビジネス基礎レベルに到達。日本食レストラン等の日本人スタッフ多い職場でスタート→ローカル接客にステップアップが定番。最初の3ヶ月の英語コンプレックス克服が成功の鍵。',
  },
  {
    question: '退職決断はいつする？',
    answer:
      '渡航4-5ヶ月前が標準。退職→英語学習集中→ビザ取得→渡航のスケジュール。早すぎると貯金切り崩し過剰、遅すぎると準備不足。会社の退職規定（30日前通告等）も確認、計画的に。',
  },
  {
    question: '帰国後の就活、本当に大丈夫？',
    answer:
      '業界選び次第で十分可能。外資系・グローバル企業・インバウンド業界は30代海外経験者を積極採用、年収UP事例多。一方、保守的日系大手・公務員等は厳しい。狙う業界を絞り、「海外経験＋業界知識＋英語力」セットでアピールできる転職先を選択。',
  },
  {
    question: '貯金100万円でも30代ワーホリ可能？',
    answer:
      'タイトだが可能。豪・NZ・独でシェアハウス＋自炊＋即就職の3点セットで実現可。最初の2-3ヶ月で仕事確保＋安定生活到達が鍵。30代の落ち着いた振る舞いはむしろ採用面接で有利、20代より高単価職に就ける可能性も。',
  },
];

export default async function WhAfter30NoExperiencePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const over30Experiences = all.filter((e) => e.ageAtDeparture && e.ageAtDeparture >= 28);
  const mentions = countMentions(all, /(30代|社会人|未経験|英語ゼロ|キャリアブランク)/);
  const sample = over30Experiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(30代|社会人|未経験|英語ゼロ|キャリアブランク)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '30代社会人未経験ワーホリ完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '30代社会人未経験ワーホリ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              30代社会人未経験ワーホリ完全ガイド｜英語ゼロからの挑戦
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="30代社会人で海外未経験・英語苦手でもワーホリ挑戦したい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「30代＋社会人＋海外未経験＋英語苦手」の四重苦でもワーホリは十分可能。実は最も増えているのが30代キャリアチェンジ層、不安を乗り越えた成功例多。
              <br />
              この記事では5大不安解消、英語ゼロからの上達法、退職タイミング、キャリアブランク説明、帰国後の進路まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '30代未経験WHは年々増加、不安解消法あり',
              'フィリピン3ヶ月→英語圏WHのステップアップが王道',
              '帰国後は外資系・グローバル企業で年収UP事例多',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* リアル */}
          <section id="reality" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">30代未経験ワーホリのリアル</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              「30代＝遅い」は思い込み。実際にWH参加者の20-30%は28歳以上、特にコロナ後はキャリア再考の30代社会人が急増。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed">
                <strong>むしろ30代の強み:</strong>社会人経験＋落ち着いた振る舞い＋金銭感覚＋目的意識。
                これらは20代未経験より採用面接・現地生活で有利に働きます。「人生100年時代」の中盤戦、「もう遅い」より「今しかない」マインドが成功の鍵。
              </p>
            </div>
          </section>

          {/* 不安解消 */}
          <section id="concerns" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">5大不安と解消法</h2>
            <div className="space-y-3">
              {CONCERNS.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-rose-700">{c.concern}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 準備 */}
          <section id="preparation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">準備期間と退職タイミング</h2>
            <div className="space-y-3">
              {PREPARATION.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{p.phase}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 英語ゼロ戦略 */}
          <section id="english-zero" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語ゼロからの上達戦略</h2>
            <ol className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5 list-none">
              {ENGLISH_ZERO_STRATEGY.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="30歳ギリギリWH・帰国後就活も合わせて"
            description="30歳前後の年齢制限ルール、帰国後の就活戦略も確認を。"
            primaryHref="/wh-after-30"
            primaryLabel="30歳ギリギリWHガイド"
            secondaryHref="/wh-job-hunting-japan"
            secondaryLabel="帰国後就活完全ガイド"
          />

          {/* おすすめ国 */}
          <section id="where-to-go" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">30代未経験におすすめ国</h2>
            <div className="space-y-3">
              {WHERE_TO_GO.map((w, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{w.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{w.feature}</p>
                  <p className="text-xs text-gray-500"><strong>理由:</strong> {w.reason}</p>
                </div>
              ))}
            </div>
          </section>

          {/* キャリアブランク */}
          <section id="career-blank" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">キャリアブランクの説明方法</h2>
            <ul className="space-y-3 text-sm sm:text-base text-gray-800">
              {CAREER_BLANK_TEMPLATES.map((t, i) => (
                <li key={i} className="bg-sky-50 border border-sky-100 rounded-xl p-4 leading-relaxed">
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* 帰国後 */}
          <section id="after-return" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">帰国後の進路選択肢</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {AFTER_RETURN.map((a, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">→</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 成功のコツ */}
          <section id="success-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">成功させる7つのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {SUCCESS_TIPS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                28歳以上で渡航した方の体験談 <strong>n={over30Experiences.length}件</strong>。
                30代・社会人・未経験関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
              <li><Link href="/30s-guide" className="text-primary-600 hover:underline">→ 30代からの留学</Link></li>
              <li><Link href="/wh-job-hunting-japan" className="text-primary-600 hover:underline">→ 帰国後就活</Link></li>
              <li><Link href="/quit-job-wh" className="text-primary-600 hover:underline">→ 社会人ワーホリ退職</Link></li>
              <li><Link href="/no-english" className="text-primary-600 hover:underline">→ 英語ゼロでも留学</Link></li>
              <li><Link href="/cebu-study-real-cost" className="text-primary-600 hover:underline">→ セブ留学リアルコスト</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
