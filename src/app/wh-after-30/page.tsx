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

const PAGE_PATH = '/wh-after-30';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '30歳ギリギリでワーホリ完全ガイド｜年齢制限ルール・国別・キャリア活用法',
  description: '30歳の年齢制限ギリギリでワーホリに行きたい方向け。年齢計算ルール、ビザ申請期限、35歳まで対象国、社会人経験を活かす渡航戦略まで完全解説。',
  path: PAGE_PATH,
  keywords: [
    '30歳 ワーホリ',
    'ワーホリ ギリギリ',
    'ワーホリ 年齢制限',
    '30歳 ワーホリ ビザ',
    'ワーホリ 31歳',
    '35歳 ワーホリ',
  ],
});

const TOC_HEADINGS = [
  { id: 'age-rules', label: '年齢制限の正確なルール' },
  { id: 'by-country', label: '国別の年齢制限一覧' },
  { id: '35-countries', label: '35歳まで対象の特別国' },
  { id: 'late-30s-strategy', label: '30歳ギリギリ申請のベスト戦略' },
  { id: 'career-strength', label: '社会人経験を活かす5つの方法' },
  { id: 'common-concerns', label: '30歳ワーホリのよくある不安' },
  { id: 'after-return', label: '帰国後のキャリア戦略' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const COUNTRY_AGES = [
  { country: 'オーストラリア', age: '18-30歳', special: '31歳の誕生日前日まで申請可（条件付き35歳まで延長中の協議あり）' },
  { country: 'カナダ', age: '18-30歳', special: '31歳の誕生日前日まで申請可、IEC抽選方式' },
  { country: 'ニュージーランド', age: '18-30歳', special: '31歳の誕生日前日まで申請可' },
  { country: 'イギリス', age: '18-30歳', special: '応募時点で30歳まで、YMS抽選方式' },
  { country: 'アイルランド', age: '18-30歳', special: '31歳の誕生日前日まで申請可' },
  { country: 'ドイツ', age: '18-30歳', special: '31歳の誕生日前日まで申請可' },
  { country: 'フランス', age: '18-29歳', special: '30歳の誕生日前日まで申請可（他国より1歳若い）' },
  { country: '韓国', age: '18-30歳', special: '31歳の誕生日前日まで申請可' },
  { country: '香港', age: '18-30歳', special: '31歳の誕生日前日まで申請可' },
  { country: '台湾', age: '18-30歳', special: '31歳の誕生日前日まで申請可' },
];

const SPECIAL_35_COUNTRIES = [
  {
    country: 'カナダ',
    detail: '日加二国間で年齢上限「30歳まで」（35歳延長は今のところなし、過去にカナダ側で議論あり）',
  },
  {
    country: 'チェコ',
    detail: '日チェコ間で年齢上限「26-35歳」（特殊）',
  },
  {
    country: 'アルゼンチン',
    detail: '日アルゼンチン間で年齢上限「30歳」、特例なし',
  },
  {
    country: 'スウェーデン・デンマーク・ノルウェー',
    detail: '日北欧諸国で年齢上限「30歳」、特例なし。一部国でも35歳延長の議論あるため最新情報を確認',
  },
];

const STRATEGY = [
  {
    phase: '出発前6ヶ月（30歳になる年）',
    detail: '応募開始時期に間に合うよう資金準備（100-150万円）、ビザ申請可能日チェック',
  },
  {
    phase: '出発前3ヶ月（30歳の年）',
    detail: '退職タイミング調整、健康診断（必要国）、住民票・年金・税金手続き計画',
  },
  {
    phase: '出発前1ヶ月（30歳の年）',
    detail: '住民票海外転出届、各種解約、英文職務経歴書準備（社会人スキルを活かす）',
  },
  {
    phase: '渡航時（30歳到達前）',
    detail: 'ビザ有効期限内に必ず入国、入国後は1〜2年滞在可能',
  },
];

const CAREER_STRENGTHS = [
  {
    point: '①英文職務経歴書で即戦力アピール',
    detail: '社会人経験を「Skills」「Experience」セクションで強調、新卒組より採用優位',
  },
  {
    point: '②オフィスワーク・専門職を狙う',
    detail: '英語＋専門スキル（IT・会計・看護等）あればローカル求人も対象に',
  },
  {
    point: '③日系企業の現地法人',
    detail: '海外日系企業は経験者を重宝、給与水準もアジア・欧州よりオーストラリア高い',
  },
  {
    point: '④リモートワーク（日本案件継続）',
    detail: '日本のフリーランス・正社員でリモート勤務可なら、現地時給＋日本給料の二重収入',
  },
  {
    point: '⑤Working Holidayから就労ビザへ',
    detail: '雇用主スポンサー獲得で就労ビザに切替可能、PR申請ルートにつながる',
  },
];

const COMMON_CONCERNS = [
  '体力面の不安 → 30代は40代より圧倒的に若い。新卒組と十分競争可能',
  '英語力の不安 → 社会人スキル＋専門知識で英語不足を補える',
  'キャリアブランクが怖い → 「海外経験」「英語力」を強みに転職時アピール',
  '同年代の少なさ → 30代ワーホリは増加中、専門学校・カフェ等で出会いあり',
  '結婚・出産ライフプラン → ワーホリ中に出会いも多い、長期視点で選択',
  '帰国後の就職不安 → 外資系・海外関連企業は経験を高評価',
];

const AFTER_RETURN = [
  '外資系企業・グローバル企業の英語要件職への転職（年収UP事例多）',
  '海外関連企業（観光・教育・貿易）への転職',
  '日本でフリーランス独立、海外取引案件中心',
  '英語スキル＋専門スキルで起業・副業',
  '海外駐在チャンスが回ってきやすい',
  '結婚・出産後の生き方視野が広がる',
];

const FAQS = [
  {
    question: '30歳になる年でもワーホリ行ける？',
    answer:
      '行けます。多くの国で「31歳の誕生日前日まで申請可能」。例えば1995年生まれの方は、2026年12月31日（30歳いっぱい）まで申請可。応募時点の年齢が基準なので、誕生日とビザ申請期限を逆算して計画を立てましょう。',
  },
  {
    question: 'ビザ申請から渡航までどれくらい余裕がある？',
    answer:
      '国によりますが、ビザ取得後12ヶ月以内に渡航必須が多い。31歳直前にビザ取得→渡航は31歳超でもOK。「30歳のうちに申請＋ビザ取得→31歳の年に渡航」のパターンも可能。',
  },
  {
    question: '35歳まで行ける国はある？',
    answer:
      '少数。チェコは「26-35歳」と特殊な年齢設定。オーストラリアは「31歳延長申請」の議論が過去にあったが、現状は30歳まで。アイルランド・ドイツ等の主要国も30歳までが基本。',
  },
  {
    question: '30歳ワーホリは現地で浮く？',
    answer:
      '浮かない。30代ワーホリは年々増加、特にカナダ・オーストラリアでは20%以上が25歳超。専門学校・職場のシニア・キャリアチェンジ層と仲良くなりやすい。ホステル住みより、職場・学校の社会人コミュニティに入ると自然。',
  },
  {
    question: '30歳ワーホリ後のキャリアは？',
    answer:
      '外資系・グローバル企業への転職で年収UP事例多。「海外経験＋英語力」を強みに、転職市場で評価される。ただ完全な未経験職種への転職は厳しいケースもあるため、社会人時代の経験を活かせる業界・職種に絞る戦略がベスト。',
  },
];

export default async function WhAfter30Page() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const over30Experiences = all.filter((e) => e.ageAtDeparture && e.ageAtDeparture >= 28);
  const mentions = countMentions(all, /(30歳|年齢|社会人|キャリア|退職)/);
  const sample = over30Experiences[0] ?? mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(30|年齢|社会人|キャリア|退職)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '30歳ギリギリでワーホリ完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '30歳ギリギリでワーホリ完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              30歳ギリギリでワーホリ完全ガイド｜年齢制限ルール・国別・キャリア活用法
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="30歳前後でワーホリを検討する社会人"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「30歳でワーホリは遅すぎる？」「ギリギリ申請できる年齢は？」社会人で30歳前後のワーホリ志望者の最大の不安。
              <br />
              実は多くの国で「31歳の誕生日前日まで申請可能」、社会人スキルを活かしてむしろ新卒組より採用優位なケースも。この記事で年齢制限ルール、国別差、キャリア活用法を完全解説。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '多くの国で「31歳の誕生日前日まで」申請可能',
              '社会人経験は英文職歴書で「即戦力」アピール可',
              '帰国後は外資系・海外関連企業で年収UP事例多',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 年齢制限ルール */}
          <section id="age-rules" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">年齢制限の正確なルール</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              ワーホリビザの年齢制限は「申請時の年齢」が基準です。「31歳の誕生日前日まで」申請可能な国が多く、誕生日まで余裕を持って申請しましょう。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・申請時の年齢が基準（渡航時ではない）</p>
              <p>・ビザ取得後12ヶ月以内に渡航義務</p>
              <p>・渡航後は1〜2年滞在可（31歳超もOK）</p>
              <p>・年齢計算は厳密、誕生日前日23:59までが申請可能</p>
            </div>
          </section>

          {/* 国別 */}
          <section id="by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別の年齢制限一覧</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">国</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">年齢制限</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">補足</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRY_AGES.map((c, i) => (
                    <tr key={i} className="bg-white">
                      <td className="border border-gray-200 px-3 py-2 font-bold">{c.country}</td>
                      <td className="border border-gray-200 px-3 py-2 text-primary-700">{c.age}</td>
                      <td className="border border-gray-200 px-3 py-2 text-xs text-gray-600">{c.special}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 35歳まで */}
          <section id="35-countries" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">35歳まで対象の特別国</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              一部国は通常の30歳制限と異なる年齢設定。31歳超でも諦めずに確認を。
            </p>
            <div className="space-y-3">
              {SPECIAL_35_COUNTRIES.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{s.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="社会人ワーホリの退職・税金手続きも"
            description="住民票・年金・健康保険・税金まで漏れなくチェック。"
            primaryHref="/quit-job-wh"
            primaryLabel="社会人ワーホリ退職ガイド"
            secondaryHref="/30s-guide"
            secondaryLabel="30代からの留学ガイド"
          />

          {/* 戦略 */}
          <section id="late-30s-strategy" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">30歳ギリギリ申請のベスト戦略</h2>
            <div className="space-y-3">
              {STRATEGY.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{s.phase}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* キャリア活用 */}
          <section id="career-strength" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">社会人経験を活かす5つの方法</h2>
            <div className="space-y-3">
              {CAREER_STRENGTHS.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{c.point}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 不安 */}
          <section id="common-concerns" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">30歳ワーホリのよくある不安</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {COMMON_CONCERNS.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">💭</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 帰国後 */}
          <section id="after-return" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">帰国後のキャリア戦略</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {AFTER_RETURN.map((a, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>{a}</span>
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
                30歳・年齢・社会人関連の言及は全体験談から <strong className="text-primary-700">{mentions.containsCount}件</strong> 抽出。
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
            ※ 年齢制限・ビザ要件は2026年5月時点の情報です。最新情報は各国大使館の公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/quit-job-wh" className="text-primary-600 hover:underline">→ 社会人ワーホリ退職ガイド</Link></li>
              <li><Link href="/30s-guide" className="text-primary-600 hover:underline">→ 30代からの留学ガイド</Link></li>
              <li><Link href="/engineer-wh" className="text-primary-600 hover:underline">→ エンジニアワーホリ</Link></li>
              <li><Link href="/agent-comparison" className="text-primary-600 hover:underline">→ エージェント必要？</Link></li>
              <li><Link href="/after-wh" className="text-primary-600 hover:underline">→ ワーホリ後の進路</Link></li>
              <li><Link href="/regret" className="text-primary-600 hover:underline">→ ワーホリ後悔しないために</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
