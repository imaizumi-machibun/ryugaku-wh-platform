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

const PAGE_PATH = '/vancouver-language-school';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'バンクーバーの語学学校おすすめ10選と選び方｜エリア・費用・日本人比率比較',
  description: 'バンクーバーの語学学校を「エリア・費用・日本人比率・認定」で比較。ILAC・ILSC・Kaplan等のメジャー校から、ガスタウン・キツラノなどエリア別の選び方、Languages Canada認定の重要性まで解説。',
  path: PAGE_PATH,
  keywords: [
    'バンクーバー 語学学校',
    'バンクーバー 留学',
    'バンクーバー 英語',
    'ILAC バンクーバー',
    'ILSC バンクーバー',
    'カナダ 語学学校 おすすめ',
  ],
});

const TOC_HEADINGS = [
  { id: 'why-vancouver', label: 'バンクーバーで語学学校を選ぶメリット' },
  { id: 'major-schools', label: 'メジャー校10選と特徴' },
  { id: 'area-guide', label: 'エリア別の学校選び' },
  { id: 'cost', label: '費用相場（週・月・3ヶ月）' },
  { id: 'how-to-choose', label: '失敗しない選び方5つの軸' },
  { id: 'accreditation', label: 'Languages Canada認定の重要性' },
  { id: 'experiences', label: '体験談から見る実態' },
  { id: 'faq', label: 'よくある質問' },
];

const SCHOOLS = [
  { name: 'ILAC（International Language Academy of Canada）', size: '大規模（生徒2,000+）', cost: 'CAD 380〜520/週', feature: '世界中の生徒で多国籍。大学進学パスウェイ充実', area: 'ダウンタウン' },
  { name: 'ILSC（International Language Schools of Canada）', size: '大規模（生徒1,500+）', cost: 'CAD 360〜500/週', feature: '選択式カリキュラム、初心者向けクラス充実', area: 'ガスタウン' },
  { name: 'Kaplan International（カナダ校）', size: '中規模', cost: 'CAD 400〜550/週', feature: '世界40都市展開、転校可', area: 'ダウンタウン' },
  { name: 'EC Vancouver', size: '中規模', cost: 'CAD 380〜520/週', feature: '英語のみポリシー厳格、国際色豊か', area: 'ダウンタウン' },
  { name: 'Stafford House Vancouver', size: '中規模', cost: 'CAD 350〜480/週', feature: '英国伝統校のカナダ校、アカデミック', area: 'ガスタウン' },
  { name: 'inlingua Vancouver', size: '小規模', cost: 'CAD 320〜450/週', feature: '会話メソッド独自開発、少人数制', area: 'ダウンタウン' },
  { name: 'Tamwood Career College', size: '小規模', cost: 'CAD 340〜470/週', feature: 'キャリア重視、Co-opプログラム強い', area: 'ダウンタウン' },
  { name: 'VanWest College', size: '中規模', cost: 'CAD 360〜500/週', feature: 'IELTS対策・ビジネス英語に強い', area: 'ダウンタウン' },
  { name: 'Sprott Shaw Language College', size: '中規模', cost: 'CAD 340〜470/週', feature: 'カナダ歴100年以上の老舗校', area: 'ダウンタウン' },
  { name: 'Global College', size: '小規模', cost: 'CAD 300〜420/週', feature: 'コスパ◎、初心者向けケア充実', area: 'ダウンタウン' },
];

const AREA_GUIDE = [
  { area: 'ダウンタウン（Downtown）', detail: '語学学校の集積地。レストラン・カフェ・SkyTrain至近。家賃高め', schools: '90%以上の語学学校がここに集中' },
  { area: 'ガスタウン（Gastown）', detail: '歴史的エリア、おしゃれカフェ・ブティック多数', schools: 'ILSC・Stafford House等' },
  { area: 'イェールタウン（Yaletown）', detail: '高級住宅街・水辺の散歩道。学校少なめ', schools: '小規模・専門校のみ' },
  { area: 'キツラノ（Kitsilano）', detail: 'ビーチエリア。サーフ・ヨガ文化。中心地から離れる', schools: '少数（短期コース中心）' },
];

const FAQS = [
  {
    question: 'バンクーバーとトロント、語学学校はどちらがおすすめ？',
    answer:
      'バンクーバー：自然豊か・日本人比率やや高い・気候穏やか。トロント：多国籍・日本人比率低い・冬寒い。「日本人少なめ・英語環境ガチ」ならトロント、「自然と都市のバランス・快適生活」ならバンクーバーを選ぶ人が多いです。',
  },
  {
    question: 'バンクーバーの語学学校の日本人比率は？',
    answer:
      '学校・時期により大きく異なります。大規模校（ILAC等）の上級クラスは10〜15%、初級クラスは20〜30%。日本人比率を抑えたいなら、入学前に学校に「現在のクラス別日本人比率」を必ず確認しましょう。',
  },
  {
    question: 'Languages Canada認定校とは？',
    answer:
      'カナダ政府認定の語学学校品質保証制度。授業時間・教師資格・施設基準が満たされている証明。学生ビザ申請時は認定校が原則必須。本記事掲載校はすべて認定校です。',
  },
  {
    question: 'バンクーバーの語学学校、何ヶ月通うのが標準？',
    answer:
      '3ヶ月が最も人気。1ヶ月では効果限定的、6ヶ月以上は飽きと費用負担。長期割引が効くのは12週（3ヶ月）以上の学校が多いです。',
  },
  {
    question: 'パスウェイ（大学進学）プログラムって何？',
    answer:
      '語学学校で一定レベルに到達すると、提携カナダ大学・カレッジへIELTS免除で進学できる仕組み。ILAC・ILSC等の大手校が強い。長期キャリアを視野に入れる人向け。',
  },
];

export default async function VancouverLanguageSchoolPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const vanExperiences = all.filter((e) =>
    e.country?.id === 'canada' && /バンクーバー|Vancouver/i.test(e.cityPrimary ?? '')
  );

  const mentions = countMentions(vanExperiences, /(語学学校|学校|授業|クラス|ILAC|ILSC|Kaplan)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(語学学校|学校|授業|クラス)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'バンクーバーの語学学校おすすめ10選', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'バンクーバーの語学学校おすすめ10選' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              バンクーバーの語学学校おすすめ10選と選び方｜エリア・費用・日本人比率比較
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="バンクーバー留学を検討中の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              バンクーバーは、世界中の留学生が集まるカナダ西海岸の都市。語学学校の選択肢が豊富すぎて「どれを選べばいいか分からない」という方のために、メジャー10校の特徴・費用・エリア別の選び方を完全解説します。
            </p>
            <p className="text-xs text-gray-500 mt-3">
              ※ どの学校とも提携していない中立メディアとして、業界で広く知られたメジャー校を例示しています。アフィリエイトリンクは含まれません。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'バンクーバーの語学学校10校の特徴・費用・エリアを一覧比較',
              'エリア別の学校選び（ダウンタウン・ガスタウン・キツラノ）',
              '失敗しない選び方5つの軸とLanguages Canada認定の重要性',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* なぜバンクーバー */}
          <section id="why-vancouver" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">バンクーバーで語学学校を選ぶメリット</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <li>・温暖な気候（冬も0度前後、夏は涼しい）</li>
              <li>・自然と都市のバランス（山・海・公園が至近）</li>
              <li>・治安が世界トップクラス</li>
              <li>・多文化都市で多国籍生徒との交流</li>
              <li>・カナダ大学進学パスウェイが豊富</li>
              <li>・日本人コミュニティが大きく初心者にも安心</li>
              <li>・卒業後のワーホリ→技術ビザ→永住権ルートが見える</li>
            </ul>
          </section>

          {/* メジャー10校 */}
          <section id="major-schools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">メジャー校10選と特徴</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              業界で広く知られたメジャー10校を、規模・費用・特徴・エリアで一覧化しました。すべてLanguages Canada認定校です。
            </p>
            <div className="space-y-3">
              {SCHOOLS.map((s, i) => (
                <div key={s.name} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded">{i + 1}</span>
                    <h3 className="font-bold text-base sm:text-lg">{s.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs mb-2">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{s.size}</span>
                    <span className="bg-amber-50 text-amber-800 font-semibold px-2 py-1 rounded">{s.cost}</span>
                    <span className="bg-sky-50 text-sky-800 px-2 py-1 rounded">{s.area}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="他都市・他校とも比較したい方へ"
            description="945校データベースで国別・特徴別に検索可能。語学学校ランキングも合わせて。"
            primaryHref="/language-school-ranking"
            primaryLabel="語学学校ランキング2026"
            secondaryHref="/schools"
            secondaryLabel="945校DBで検索"
          />

          {/* エリアガイド */}
          <section id="area-guide" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">エリア別の学校選び</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              バンクーバーの語学学校は90%以上がダウンタウンに集中。エリアの特性を理解して選びましょう。
            </p>
            <div className="space-y-3">
              {AREA_GUIDE.map((a) => (
                <div key={a.area} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base">{a.area}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{a.detail}</p>
                  <p className="text-xs text-primary-700 bg-primary-50 px-3 py-2 rounded">📍 {a.schools}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 費用 */}
          <section id="cost" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">費用相場（週・月・3ヶ月）</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold">期間</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">学費目安</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">日本円換算</th>
                    <th className="px-3 py-3 font-semibold">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { period: '1週間', cad: 'CAD 350〜500', jpy: '4〜5.5万円', note: '入学金・教材費別途' },
                    { period: '1ヶ月（4週）', cad: 'CAD 1,400〜2,000', jpy: '15〜22万円', note: '短期キャンペーン適用可' },
                    { period: '3ヶ月（12週）', cad: 'CAD 3,800〜5,500', jpy: '42〜60万円', note: '長期割引適用（5〜10%）' },
                    { period: '6ヶ月（24週）', cad: 'CAD 7,200〜10,500', jpy: '80〜115万円', note: '長期割引（10〜15%）' },
                  ].map((r) => (
                    <tr key={r.period} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium">{r.period}</td>
                      <td className="px-3 py-3 text-xs">{r.cad}</td>
                      <td className="px-3 py-3 text-xs">{r.jpy}</td>
                      <td className="px-3 py-3 text-xs">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ CAD 1 = 約110円換算（2026年5月時点）。入学金CAD 150〜200、教材費CAD 80〜150が別途。
            </p>
          </section>

          {/* 選び方の軸 */}
          <section id="how-to-choose" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">失敗しない選び方5つの軸</h2>
            <ol className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              <li className="flex items-start gap-3 leading-relaxed">
                <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold">1</span>
                <span><strong>日本人比率</strong>：入学前にクラス別比率を必ず確認。10〜15%以下が英語環境のラインです</span>
              </li>
              <li className="flex items-start gap-3 leading-relaxed">
                <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold">2</span>
                <span><strong>授業形式</strong>：一般英語 / IELTS / ビジネス / Co-op（インターン込）から目的別に選ぶ</span>
              </li>
              <li className="flex items-start gap-3 leading-relaxed">
                <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold">3</span>
                <span><strong>クラスサイズ</strong>：平均15人以下が発言機会の目安</span>
              </li>
              <li className="flex items-start gap-3 leading-relaxed">
                <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold">4</span>
                <span><strong>宿泊サポート</strong>：ホームステイ斡旋・寮の有無・初回滞在パッケージ</span>
              </li>
              <li className="flex items-start gap-3 leading-relaxed">
                <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold">5</span>
                <span><strong>長期割引・キャンセル規定</strong>：12週以上で5〜15%割引、キャンセル時の返金条件</span>
              </li>
            </ol>
          </section>

          {/* 認定 */}
          <section id="accreditation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Languages Canada認定の重要性</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              Languages Canada（LC）はカナダ政府公認の語学学校品質保証制度。授業時間・教師資格・施設基準・カリキュラム品質が満たされている証明です。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・学生ビザ申請時に必須（一部例外あり）</li>
              <li>・授業の質が一定担保されている安心材料</li>
              <li>・問題発生時の苦情申立て先がある</li>
              <li>・本記事掲載10校はすべてLanguages Canada認定校</li>
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見る実態</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                バンクーバー渡航者の体験談 <strong>n={vanExperiences.length}件</strong> から学校・授業関連を集計。
                <strong className="text-primary-700">{mentions.containsCount}件</strong> が言及していました。
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

          <p className="text-xs text-gray-500 mb-8">
            ※ 学校の費用・カリキュラム・認定情報は各校公式サイトでご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/countries/canada" className="text-primary-600 hover:underline">→ カナダ国別ガイド</Link></li>
              <li><Link href="/canada-iec-visa" className="text-primary-600 hover:underline">→ カナダIECビザ申請</Link></li>
              <li><Link href="/language-school-ranking" className="text-primary-600 hover:underline">→ 語学学校ランキング2026</Link></li>
              <li><Link href="/schools" className="text-primary-600 hover:underline">→ 945校DBで検索</Link></li>
              <li><Link href="/agent-comparison" className="text-primary-600 hover:underline">→ エージェント vs 自力比較</Link></li>
              <li><Link href="/matching" className="text-primary-600 hover:underline">→ 5問で診断：あなたに合う国</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
