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

const PAGE_PATH = '/english-resume-guide';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '英文レジュメ（Resume）の書き方｜セクション別テンプレと国別の違い',
  description: 'ワーホリ・留学先で仕事を見つけるための英文レジュメ（Resume）の書き方を完全解説。日本の履歴書との違い、セクション別の書き方、Action Verbsの使い方、国別ルール（豪・加・英・米）の違い、カバーレターとの違いまで実例ベースで解説。',
  path: PAGE_PATH,
  keywords: [
    '英文 レジュメ 書き方',
    'Resume 書き方',
    '英語 履歴書 書き方',
    'ワーホリ レジュメ',
    'Resume サンプル',
    '英文 履歴書 ワーホリ',
    'カバーレター 違い',
  ],
});

const TOC_HEADINGS = [
  { id: 'difference', label: '日本の履歴書との5つの違い' },
  { id: 'sections', label: 'Resumeのセクション構成（標準8項目）' },
  { id: 'action-verbs', label: 'Action Verbsで職務経歴を強くする' },
  { id: 'country-rules', label: '国別ルール（豪・加・英・米）の違い' },
  { id: 'common-mistakes', label: 'よくある間違い10選' },
  { id: 'cover-letter', label: 'カバーレターとの違いと使い分け' },
  { id: 'experiences', label: '体験談から見るResume活用の実態' },
  { id: 'faq', label: 'よくある質問' },
];

const DIFFERENCES = [
  {
    point: '① 写真は載せない',
    detail: '日本の履歴書とは違い、Resumeに写真は載せません。年齢・性別・人種による差別を防ぐためです。',
  },
  {
    point: '② 生年月日・性別・既婚未婚は書かない',
    detail: '個人情報の差別を避けるため、これらの情報は記載NG。',
  },
  {
    point: '③ A4縦・1〜2ページに収める',
    detail: '日本のA4横とは違い、A4縦が標準。職務経歴が多くても2ページ以内に絞る。',
  },
  {
    point: '④ 学歴より職歴を上に',
    detail: '逆三角形構造（最新の職歴を上に）。学歴は職歴の下、または併記。',
  },
  {
    point: '⑤ 自己PRは「Summary」として冒頭3行で',
    detail: '冒頭に「Profile」または「Summary」セクションで自己PRを3行程度で要約。',
  },
];

const SECTIONS = [
  {
    title: '1. Personal Information（個人情報）',
    detail: '名前・メール・電話・LinkedIn・滞在都市。住所は番地まで書かず「Sydney, NSW」で十分。',
    sample: 'John Tanaka | john.tanaka@email.com | +61 412 345 678 | Sydney, NSW | linkedin.com/in/johntanaka',
  },
  {
    title: '2. Professional Summary（自己PR・3行）',
    detail: '冒頭で「あなたは何ができる人か」を3行で要約。職歴の長さ、得意分野、応募職種への意欲。',
    sample: 'Experienced barista with 3+ years in specialty coffee shops in Tokyo, seeking a full-time position in Sydney to leverage my latte art skills and customer service experience.',
  },
  {
    title: '3. Work Experience（職務経歴）',
    detail: '逆時系列（最新が上）。各職務は「会社名・職位・期間・3〜5の成果」。数字を入れる。',
    sample: 'Barista, Starbucks Tokyo (2022.4 - 2024.3)\n• Served 150+ customers per day during peak hours\n• Trained 5 new staff members on espresso techniques\n• Achieved 98% customer satisfaction score',
  },
  {
    title: '4. Education（学歴）',
    detail: '大学名・学位・卒業年。最終学歴のみで十分（中高は不要）。',
    sample: 'Bachelor of Arts in Economics, Waseda University (Tokyo, Japan), 2018 - 2022',
  },
  {
    title: '5. Skills（スキル）',
    detail: '言語スキル（Native/Fluent/Intermediate/Basic）、PCスキル（Excel・Photoshop等）、専門スキル。',
    sample: 'Languages: Japanese (Native), English (Intermediate, IELTS 6.5)\nTechnical: MS Office, POS systems, latte art',
  },
  {
    title: '6. Certifications（資格）',
    detail: 'RSA（豪）、Barista Certificate、Food Handler、IELTS/TOEICスコア。発行機関・取得年も。',
    sample: 'RSA (Responsible Service of Alcohol), NSW Liquor & Gaming, 2024\nIELTS Academic 6.5, British Council, 2024',
  },
  {
    title: '7. Languages（言語スキル）',
    detail: 'Skillsとは別セクションで強調。レベルは Native / Fluent / Intermediate / Basic で表現。',
    sample: 'Japanese: Native\nEnglish: Intermediate (IELTS 6.5)\nMandarin: Basic',
  },
  {
    title: '8. References（推薦人）',
    detail: '「Available on request」のみ書くのが慣例。具体的な推薦人情報は面接後に提示。',
    sample: 'Available on request',
  },
];

const ACTION_VERBS = [
  { category: '達成・成果', verbs: ['Achieved', 'Delivered', 'Exceeded', 'Generated', 'Increased', 'Improved'] },
  { category: 'マネジメント', verbs: ['Managed', 'Led', 'Supervised', 'Coordinated', 'Organized', 'Directed'] },
  { category: 'クリエイティブ', verbs: ['Created', 'Designed', 'Developed', 'Established', 'Initiated', 'Launched'] },
  { category: 'コミュニケーション', verbs: ['Presented', 'Negotiated', 'Collaborated', 'Communicated', 'Trained', 'Mentored'] },
  { category: '分析・改善', verbs: ['Analyzed', 'Identified', 'Optimized', 'Streamlined', 'Resolved', 'Implemented'] },
];

const COUNTRY_RULES = [
  {
    country: '🇦🇺 オーストラリア',
    pageCount: '1〜2ページ',
    photo: '不要',
    address: '都市・州（Sydney, NSW）まで',
    note: 'カジュアル系職場では「Hobbies」セクションも好まれる。RSA資格は必須レベル。',
  },
  {
    country: '🇨🇦 カナダ',
    pageCount: '1ページ推奨',
    photo: '不要',
    address: '都市のみ（Vancouver, BC）',
    note: '簡潔さ重視。1ページに収める文化。州別の労働許可（IEC番号）も記載。',
  },
  {
    country: '🇬🇧 イギリス',
    pageCount: 'CV（2〜3ページOK）',
    photo: '不要',
    address: '都市まで',
    note: 'Resumeではなく「CV（Curriculum Vitae）」と呼ぶ。より詳細な職務経歴が好まれる。',
  },
  {
    country: '🇺🇸 アメリカ',
    pageCount: '1ページ厳守',
    photo: '不要',
    address: '都市・州（New York, NY）',
    note: '極めて簡潔。USAでは「Resume」と呼び、1ページに収めるのが鉄則。',
  },
];

const COMMON_MISTAKES = [
  '日本式の自己PRを長文で書く（→3行に圧縮）',
  '写真・年齢・性別を載せる（→差別防止のため削除）',
  '「Achieved success」など曖昧表現（→数字で具体化）',
  '受動態・形容詞多用（→Action Verbsで能動表現）',
  '日本の住所をフル記載（→都市・州まででOK）',
  '英語名と日本名の表記混在（→統一）',
  '3ページ以上（→1〜2ページに圧縮）',
  'スペルミス・文法ミス（→Grammarly等で必ずチェック）',
  '応募職種ごとにカスタマイズしない（→1社1版作る）',
  'メールアドレスがフォーマルでない（→nickname@ではなくfullname@に）',
];

const FAQS = [
  {
    question: 'ResumeとCVの違いは？',
    answer:
      '北米（米・加）では「Resume」=簡潔な1ページ、欧州（英・愛・独）では「CV」=詳細な2〜3ページ、オーストラリア・NZでは両方OKだが「Resume」呼びが一般的。応募する国に合わせて呼び方も意識しましょう。',
  },
  {
    question: '日本の職歴が活かせる職種に応募する場合、どこまで詳しく書く？',
    answer:
      '直接関連する経験は具体的に（数字＋成果＋使ったスキル）、関連が薄いものは「Other Experience」として2行程度に圧縮。応募職種ごとにResumeを調整する「カスタマイズ」が、採用率を大きく上げます。',
  },
  {
    question: 'TOEIC/IELTSのスコアは必ず書く？',
    answer:
      '書いたほうが有利。特にカフェ・接客系では「英語力の証明」として有効。スコアを書くなら受験日と受験機関も併記。最新スコア（2年以内）を推奨。スコアが低い場合は「English: Intermediate」のみで可。',
  },
  {
    question: '英語が完璧でない私のレジュメ、誰にチェックしてもらえる？',
    answer:
      '語学学校のキャリアサポート（無料）、Fiverrやネイティブ友人（有料/無料）、Grammarly Premium（年間1万円）が定番。最低でもGrammarlyの文法・スペルチェックは必須。',
  },
  {
    question: 'Photoshop・Wordどっちで作るべき？',
    answer:
      'Canva（無料）が現在の主流。プロっぽいテンプレートが豊富で、PDF出力もできる。Wordでもよいが、ATS（採用管理システム）対策で「シンプルな1カラム」が好まれる。Canvaの「Resume」テンプレートから選ぶのがおすすめ。',
  },
];

export default async function EnglishResumeGuidePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(レジュメ|履歴書|Resume|CV|職務経歴|面接|応募|採用)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(レジュメ|履歴書|Resume|CV|職務経歴|面接|応募|採用)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '英文レジュメ書き方ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '英文レジュメ書き方ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              英文レジュメ（Resume）の書き方｜セクション別テンプレと国別の違い
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ワーホリ・留学先で仕事を探す方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              英文レジュメ（Resume）は、海外で仕事を見つけるための「最初の関門」。
              <br />
              日本の履歴書とは構成・書き方・ルールがまったく違うため、日本式で書くと採用率が下がります。
              <br />
              この記事では、セクション別の書き方、Action Verbsの使い方、国別ルール（豪・加・英・米）の違い、よくある間違いまで、実例付きで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '日本の履歴書との5つの違い（写真・生年月日・形式・順序・自己PR）',
              'Resumeの標準8セクションと、各セクションのサンプル英文',
              '国別ルール（豪・加・英・米）の違いとAction Verbsで強くする技術',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 日本との違い */}
          <section id="difference" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">日本の履歴書との5つの違い</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              まず「日本式の感覚で書かない」ことが鉄則。下記5つの違いを押さえましょう。
            </p>
            <div className="space-y-3">
              {DIFFERENCES.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base text-primary-700">{d.point}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* セクション構成 */}
          <section id="sections" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Resumeのセクション構成（標準8項目）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              上から下へ「個人情報 → Summary → 職歴 → 学歴 → スキル → 資格 → 言語 → References」の順序が標準。各セクションのサンプル英文を見ながら作りましょう。
            </p>
            <div className="space-y-4">
              {SECTIONS.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg">{s.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.detail}</p>
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs sm:text-sm text-gray-800 whitespace-pre-wrap font-mono overflow-x-auto">{s.sample}</pre>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="国別の仕事の探し方も合わせてチェック"
            description="Resumeを準備したら、次は応募先探し。オーストラリア・カナダの仕事事情ガイドを。"
            primaryHref="/australia-jobs"
            primaryLabel="オーストラリア仕事探し方"
            secondaryHref="/no-english"
            secondaryLabel="英語ゼロでも始められる仕事"
          />

          {/* Action Verbs */}
          <section id="action-verbs" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Action Verbsで職務経歴を強くする</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              職務経歴は「Action Verb（動詞）+ 数字 + 成果」のフォーマットが鉄則。例えば「I was responsible for sales」より「Achieved 120% sales target by leading a team of 5」の方が圧倒的に強い。下記カテゴリ別のAction Verbsから選んで使いましょう。
            </p>
            <div className="space-y-3">
              {ACTION_VERBS.map((g) => (
                <div key={g.category} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm text-primary-700 mb-2">{g.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.verbs.map((v) => (
                      <span key={v} className="bg-primary-50 text-primary-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-sm font-bold text-amber-900 mb-2">💡 強い職務経歴の例</p>
              <p className="text-xs text-amber-900 mb-2">❌ Before: I worked as a barista at Starbucks.</p>
              <p className="text-xs text-amber-900">⭕ After: <strong>Served 150+ customers per day during peak hours at Starbucks Tokyo, achieving 98% customer satisfaction score and training 5 new staff members on espresso techniques.</strong></p>
            </div>
          </section>

          {/* 国別ルール */}
          <section id="country-rules" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別ルール（豪・加・英・米）の違い</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              基本構造は共通ですが、ページ数・呼び方・細かい慣習に違いがあります。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">国</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">ページ数</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">写真</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">住所</th>
                    <th className="px-3 py-3 font-semibold">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRY_RULES.map((c) => (
                    <tr key={c.country} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium whitespace-nowrap">{c.country}</td>
                      <td className="px-3 py-3 text-xs">{c.pageCount}</td>
                      <td className="px-3 py-3 text-xs">{c.photo}</td>
                      <td className="px-3 py-3 text-xs">{c.address}</td>
                      <td className="px-3 py-3 text-xs">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* よくある間違い */}
          <section id="common-mistakes" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくある間違い10選</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              下記10個は、日本人が英文レジュメを書くときにやりがちなミス。提出前にチェック。
            </p>
            <ol className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-100 rounded-xl p-5">
              {COMMON_MISTAKES.map((m, i) => (
                <li key={i} className="flex items-start gap-3 leading-relaxed">
                  <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 bg-rose-600 text-white rounded-full text-xs font-bold">
                    {i + 1}
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* カバーレター */}
          <section id="cover-letter" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">カバーレターとの違いと使い分け</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              ResumeとCover Letter（カバーレター）は別物。両方提出するのが標準的です。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-base text-primary-700">📄 Resume（履歴書）</h3>
                <ul className="text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                  <li>客観的な「事実」を箇条書きで列挙</li>
                  <li>職歴・学歴・スキル・資格を時系列で</li>
                  <li>1〜2ページ、テーブル形式・箇条書き中心</li>
                  <li>標準テンプレートで使い回し可</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-2 text-base text-primary-700">✉️ Cover Letter（カバーレター）</h3>
                <ul className="text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                  <li>主観的な「志望動機」を文章で</li>
                  <li>「なぜこの会社・職種か」をストーリーで</li>
                  <li>1ページ、3〜4段落の英文ビジネスレター形式</li>
                  <li>応募先ごとにカスタマイズが必須</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 飲食・カジュアル職ではCover Letter省略可。オフィスワーク・専門職では必須。
            </p>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るResume活用の実態</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{mentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {mentions.containsCount}件</strong>
                （{mentions.percentage}%）が「レジュメ・履歴書・面接・応募」について言及していました。
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

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/australia-jobs" className="text-primary-600 hover:underline">
                  → オーストラリア仕事探し方
                </Link>
              </li>
              <li>
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語話せなくてもワーホリできる？
                </Link>
              </li>
              <li>
                <Link href="/after-wh" className="text-primary-600 hover:underline">
                  → 帰国後の就活完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/engineer-wh" className="text-primary-600 hover:underline">
                  → エンジニア ワーホリ戦略
                </Link>
              </li>
              <li>
                <Link href="/fresh-grad-wh" className="text-primary-600 hover:underline">
                  → 新卒ワーホリ就活ガイド
                </Link>
              </li>
              <li>
                <Link href="/agent-comparison" className="text-primary-600 hover:underline">
                  → エージェント vs 自力比較
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
