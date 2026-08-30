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

const PAGE_PATH = '/wh-au-pair';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'オーペア完全ガイド｜住み込みベビーシッター・対象国・応募・給与',
  description: '海外オーペア（住み込みベビーシッター）の完全ガイド。対象国（豪・米・欧）・応募手順・給与・休日・労働時間・メリットデメリット・トラブル対処までを完全解説。',
  path: PAGE_PATH,
  keywords: [
    'オーペア',
    'Au Pair',
    '海外 ベビーシッター',
    '住み込み 海外',
    'オーペア 給与',
    'オーペア 応募',
  ],
});

const TOC_HEADINGS = [
  { id: 'what-is-aupair', label: 'オーペアとは？' },
  { id: 'target-countries', label: '対象国とビザ要件' },
  { id: 'work-content', label: '労働内容・労働時間' },
  { id: 'salary-conditions', label: '給与・休日・滞在条件' },
  { id: 'how-to-apply', label: '応募〜マッチング〜渡航の流れ' },
  { id: 'matching-tips', label: 'ホストファミリー選びのコツ' },
  { id: 'pros-cons', label: 'メリット・デメリット' },
  { id: 'troubles', label: 'よくあるトラブルと対処' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TARGET_COUNTRIES = [
  {
    country: 'アメリカ',
    visa: 'J-1ビザ（Au Pair）',
    duration: '1年（最大2年）',
    salary: '週$195.75〜',
    detail: '政府認定エージェント経由必須、最も体系化',
  },
  {
    country: 'オーストラリア',
    visa: 'WHV経由（正式オーペアプログラムなし）',
    duration: '最大1年（WHV内）',
    salary: '週AUD 200-300＋住居食事',
    detail: 'WHV保持者がオーペアとして働く形',
  },
  {
    country: 'フランス',
    visa: 'Visiteur ou Etudiant',
    duration: '最大1年',
    salary: '€280-330/月＋住居食事',
    detail: '欧州オーペアの本場、フランス語学習者向け',
  },
  {
    country: 'ドイツ',
    visa: 'Au-pair-Visa',
    duration: '最大1年',
    salary: '€280/月＋住居食事',
    detail: 'ドイツ語学習＋ヨーロッパ文化体験',
  },
  {
    country: 'イギリス',
    visa: 'YMS経由（正式プログラムなし）',
    duration: 'YMS内（最大2年）',
    salary: '週£85-100＋住居食事',
    detail: 'YMS保持者がプライベートで応募',
  },
];

const WORK_CONTENT = [
  '子供の世話：朝の準備・送迎・遊び相手・宿題サポート',
  '家事補助：子供関連の洗濯・部屋掃除・簡単な料理',
  '週20-45時間労働（国・契約による）',
  '通常週1-2日休み、月単位の有給休暇',
  '言語サポート（日本語教育を望むホストも）',
];

const SALARY_DETAIL = [
  { country: '米国', weekly: '$195.75', perks: '住居・食事・年間$500教育費・健康保険' },
  { country: '豪', weekly: 'AUD 200-300', perks: '住居・食事のみ（健康保険は自分で）' },
  { country: '仏', weekly: '€70-80', perks: '住居・食事・交通費・語学コース' },
  { country: '独', weekly: '€65-75', perks: '住居・食事・語学コース・健康保険' },
  { country: '英', weekly: '£85-100', perks: '住居・食事のみ（YMSビザは健康保険IHS）' },
];

const APPLY_FLOW = [
  { step: 1, title: 'エージェント登録', detail: '米国は政府認定エージェント必須（Au Pair in America等）、欧州はAuPair.com等' },
  { step: 2, title: 'プロフィール作成', detail: '英文自己紹介・写真・動画・推薦状・子育て経験を提出' },
  { step: 3, title: 'ホスト家族マッチング', detail: 'ホスト家族とビデオ通話面接、相互合意' },
  { step: 4, title: '契約・ビザ申請', detail: '労働条件・期間・給与・休日を契約書化、ビザ申請' },
  { step: 5, title: '渡航・受け入れ', detail: '空港送迎、初日のオリエンテーション' },
];

const MATCHING_TIPS = [
  '子供の年齢・人数を確認、自分の経験と合うか',
  '家族の生活スタイル（食事・宗教・休日習慣）',
  '言語（家族の英語レベル、自分の語学力との相性）',
  '労働時間・自由時間のバランス',
  '住居（個室・トイレシャワー・Wi-Fi）',
  '土地（都市・郊外、最寄り公共交通）',
  '過去のオーペアのレビュー・期間',
];

const PROS = [
  '住居＋食事込みで生活費激減',
  '家族の一員として深い文化体験',
  '子供との触れ合いで現地語が早く上達',
  '休日に観光・周遊可能',
  '帰国後の保育・教育職に活かせる',
];

const CONS = [
  '労働時間長い、プライベート時間少',
  '家族との関係性が全てを決める（外れリスク）',
  '給与は他のアルバイトより低',
  '子供が好きでないと苦痛',
  '住み込みのストレス、逃げ場ない',
];

const TROUBLES = [
  'ホスト家族と合わない→エージェントに相談→マッチング変更',
  '労働時間契約超過→契約書を盾に交渉、エージェント介入依頼',
  '給与未払い→エージェント・大使館に通報',
  '言葉の壁で誤解→Google翻訳併用＋家族に学習意志示す',
  '孤独感・ホームシック→外部コミュニティ参加（Meetup等）',
];

const FAQS = [
  {
    question: 'オーペアは誰でもできる？',
    answer:
      '18-30歳の未婚女性が中心（一部男性も）、子育て・保育経験あれば有利。資格不要だが、英語＋簡単な家事スキルが必要。米国オーペアは200時間以上の子守経験＋運転免許が必須要件です。',
  },
  {
    question: 'オーペアとワーホリ、どっち？',
    answer:
      '英語学習＋低生活費なら オーペア、稼ぎ＋自由な働き方なら ワーホリ。オーペアは「家族の一員として住み込む」と「労働時間長い」がトレードオフ。ワーホリはアルバイト中心で高時給だが、住居・食事は自分で。',
  },
  {
    question: '給与はどれくらい？',
    answer:
      '国・契約により大きく異なる。米国週$195.75、豪AUD 200-300、仏€70-80、独€65-75。一見少額だが、住居＋食事＋保険等込み。お小遣い程度＋現地文化体験＋言語学習が目的。「お金稼ぎ」目的なら不向き。',
  },
  {
    question: 'ホスト家族と合わない場合は？',
    answer:
      'エージェント経由なら無料でマッチング変更可（米国は1-2週間以内に新家族紹介）。プライベート応募の場合は自己責任で次のホスト探し。事前のビデオ面接・複数候補比較が重要。「合わない」と感じたら早期相談を。',
  },
  {
    question: 'オーペア卒業後のキャリア活用は？',
    answer:
      '①現地で語学学校→大学進学、②保育・教育職への転身、③日本帰国後のグローバルファミリー対応の英会話講師、④子供向け国際教育コーディネーター等。「子育て×多文化×言語」の独特な経験は転職市場で評価される。',
  },
];

export default async function WhAuPairPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(オーペア|ベビーシッター|au pair|住み込み|チャイルドケア)/i);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(オーペア|ベビーシッター|au pair|住み込み|チャイルドケア)/i
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'オーペア完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'オーペア完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              オーペア完全ガイド｜住み込みベビーシッター・対象国・応募・給与
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="海外で住み込みベビーシッターとして働きたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              オーペア（Au Pair）は海外ホスト家族の住み込みベビーシッター。住居＋食事提供＋少額給与で、文化体験＋言語学習＋低生活費の三拍子。子育て経験者・保育志望者に人気の選択肢です。
              <br />
              この記事では対象国、ビザ、給与、応募の流れ、メリデメ、トラブル対処まで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '住居＋食事込み＋少額給与、生活費激減',
              '米国は政府認定エージェント必須、欧州は柔軟',
              '子供との触れ合いで現地語が早く上達',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* オーペアとは */}
          <section id="what-is-aupair" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">オーペアとは？</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              オーペア（Au Pair、仏語で「対等な人」）は、ホスト家族の住み込みベビーシッター＋家族の一員として暮らす制度。
              欧州・北米を中心に18-30歳の若者向けに展開、文化交流が主目的のプログラムです。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              <li>・住居＋食事＋少額給与で生活</li>
              <li>・週20-45時間労働（国・契約により差）</li>
              <li>・主な業務：子供の世話・送迎・家事補助</li>
              <li>・期間：通常1年（米国は最大2年延長可）</li>
              <li>・対象：18-30歳、保育・子守経験者優遇</li>
            </ul>
          </section>

          {/* 対象国 */}
          <section id="target-countries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">対象国とビザ要件</h2>
            <div className="space-y-3">
              {TARGET_COUNTRIES.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{c.country}</p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>ビザ:</strong> {c.visa}</p>
                    <p><strong>期間:</strong> {c.duration}</p>
                    <p><strong>給与:</strong> <span className="text-amber-700 font-bold">{c.salary}</span></p>
                    <p className="text-xs text-gray-500 mt-2">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 労働内容 */}
          <section id="work-content" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">労働内容・労働時間</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {WORK_CONTENT.map((w, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">👶</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 給与 */}
          <section id="salary-conditions" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">給与・休日・滞在条件</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">国</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">週給</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">付帯</th>
                  </tr>
                </thead>
                <tbody>
                  {SALARY_DETAIL.map((s, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{s.country}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700">{s.weekly}</td>
                      <td className="border border-gray-200 px-3 py-2 text-xs">{s.perks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他の住み込み・特殊な働き方も合わせて"
            description="ファームジョブ・ホームステイ・チャイルドケア専門職等の選択肢も。"
            primaryHref="/au-rural-job"
            primaryLabel="豪リージョナル仕事"
            secondaryHref="/homestay-guide"
            secondaryLabel="ホームステイガイド"
          />

          {/* 応募フロー */}
          <section id="how-to-apply" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">応募〜マッチング〜渡航の流れ</h2>
            <div className="space-y-3">
              {APPLY_FLOW.map((f) => (
                <div key={f.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {f.step}: {f.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{f.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* マッチングコツ */}
          <section id="matching-tips" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ホストファミリー選びのコツ</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {MATCHING_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
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

          {/* トラブル */}
          <section id="troubles" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくあるトラブルと対処</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {TROUBLES.map((t, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「オーペア・ベビーシッター・住み込み」関連の言及を集計。
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
            ※ プログラム条件・給与は2026年5月時点の情報です。最新情報はオーペアエージェント公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/au-rural-job" className="text-primary-600 hover:underline">→ 豪リージョナル仕事</Link></li>
              <li><Link href="/homestay-guide" className="text-primary-600 hover:underline">→ ホームステイガイド</Link></li>
              <li><Link href="/wh-volunteer" className="text-primary-600 hover:underline">→ 海外ボランティア</Link></li>
              <li><Link href="/family-study" className="text-primary-600 hover:underline">→ 親子留学</Link></li>
              <li><Link href="/wh-female-safety" className="text-primary-600 hover:underline">→ 女性WH安全</Link></li>
              <li><Link href="/no-english" className="text-primary-600 hover:underline">→ 英語ゼロでも留学</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
