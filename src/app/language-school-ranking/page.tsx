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
import { getSchools } from '@/lib/microcms/schools';
import { getExperiences } from '@/lib/microcms/experiences';
import { countMentions, extractMatchingSentence } from '@/lib/stats/experiences-cross';
import { isPublished } from '@/lib/publish/schedule';

const PAGE_PATH = '/language-school-ranking';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '語学学校ランキング2026｜目的別おすすめ＆945校DBの統計分析',
  description: '語学学校を「目的別」「予算別」「期間別」「国別」の4軸で比較。945校データベースから集計した「国別校数」「認定別校数」「費用相場」と、目的別おすすめ校（英語ガチ・コスパ・初心者・長期・短期）、自分に合う学校を選ぶ7つの基準を編集部が中立的に解説します。',
  path: PAGE_PATH,
  keywords: [
    '語学学校 ランキング',
    '語学学校 おすすめ',
    '語学学校 比較',
    '語学学校 選び方',
    'おすすめ 語学学校',
    'フィリピン 語学学校',
    'カナダ 語学学校',
    'オーストラリア 語学学校',
  ],
});

const TOC_HEADINGS = [
  { id: 'how-to-rank', label: '「ランキング」を鵜呑みにしないために' },
  { id: 'stats', label: '945校DBの統計：国別・認定別・費用帯' },
  { id: 'criteria-7', label: '自分に合う学校を選ぶ7つの基準' },
  { id: 'by-purpose', label: '目的別おすすめ5パターン' },
  { id: 'by-country', label: '国別の語学学校選びの軸' },
  { id: 'check-points', label: '失敗しないチェックポイント10項目' },
  { id: 'experiences', label: '体験談から見るリアルな評価' },
  { id: 'faq', label: 'よくある質問' },
];

// 編集部キュレーション：目的別TOP3（メジャー校から中立的に選定）
const PURPOSE_RANKING = [
  {
    purpose: '🎯 とにかく英語を伸ばしたい（ガチ勢）',
    detail: '日本人比率が低く、英語環境にどっぷり浸かれる学校。マンツーマンが多いフィリピン or 多国籍欧州校を選ぶ',
    recommendations: [
      { name: 'EC English（マルタ・カナダ・オーストラリア）', reason: '多国籍比率高い・国際展開' },
      { name: 'Embassy English（カナダ・米・英）', reason: '英語のみポリシーが厳格' },
      { name: 'QQ English（セブ）', reason: 'マンツーマン1日6コマで英語浸透' },
    ],
    avg_cost: '月20〜30万円（オセアニア・欧米）/ 月12〜18万円（フィリピン）',
  },
  {
    purpose: '💰 コスパ重視（費用を最大限抑える）',
    detail: '同じ授業時間・サポートで、月額が安い学校を選ぶ。フィリピン・マルタが2強',
    recommendations: [
      { name: 'Genius English（バギオ・セブ）', reason: 'スパルタ系で月10万円台から' },
      { name: 'EV Academy（セブ）', reason: '学費・寮費込みで月13〜15万円' },
      { name: 'Sprachcaffe（マルタ・他）', reason: 'EU圏の中ではコスパ良好' },
    ],
    avg_cost: '月10〜18万円',
  },
  {
    purpose: '🌱 英語ゼロ初心者（日本人スタッフあり）',
    detail: '初海外・英語ゼロでも安心。日本人スタッフが在籍する学校。生活立ち上げをサポート',
    recommendations: [
      { name: 'CPI（フィリピン・セブ）', reason: '日本人スタッフ常駐・初心者向けカリキュラム' },
      { name: 'Kaplan International（カナダ・豪・米・英）', reason: '日本人マーケットあり・サポート充実' },
      { name: 'ILSC（カナダ・オーストラリア）', reason: '初心者向けクラスが充実' },
    ],
    avg_cost: '月13〜25万円',
  },
  {
    purpose: '⏰ 長期滞在（6ヶ月〜1年）',
    detail: '長期割引・キャリアサポート・進学準備プログラム（パスウェイ）がある学校',
    recommendations: [
      { name: 'ILAC（カナダ・トロント/バンクーバー）', reason: '長期割引・大学進学パスウェイ' },
      { name: 'Hawthorn-Melbourne（オーストラリア）', reason: 'メルボルン大学系列・アカデミック' },
      { name: 'St Giles International（英・米・加）', reason: '世界5カ国で校舎間転校可' },
    ],
    avg_cost: '月18〜28万円（長期割引適用後）',
  },
  {
    purpose: '🚀 短期集中（1ヶ月〜3ヶ月）',
    detail: '短期間で集中的に伸ばしたい人向け。集中コース・パワーコースがある学校',
    recommendations: [
      { name: 'EF International Language Campuses（世界20都市）', reason: '短期集中コース・観光と両立' },
      { name: 'LSI（英・米・加・豪・仏・独）', reason: '8カ国14都市・転校可' },
      { name: 'Stafford House（米・英・加）', reason: '英国伝統校・短期高評価' },
    ],
    avg_cost: '1ヶ月20〜35万円',
  },
];

// 自分に合う学校を「決める」ための判断軸（10チェックは候補校の最終確認用）
const SELECTION_CRITERIA = [
  {
    title: '目的タイプを1つに絞る',
    axis: '英語ガチ / コスパ / 初心者安心 / 長期キャリア / 短期集中',
    tip: 'すべてを満たす学校はありません。「いちばん譲れない目的」を1つ決めると、候補が一気に絞れます。下の「目的別おすすめ5パターン」が出発点です。',
  },
  {
    title: '国と都市から学ぶ環境を選ぶ',
    axis: '言語環境 / 気候 / 治安 / 物価',
    tip: '同じ国でも都市で雰囲気は変わります。リゾート系のセブか、スパルタ系のバギオか。学びたい言語と生活コストのバランスで決めましょう。',
  },
  {
    title: '授業形式と1日のコマ数を確認する',
    axis: 'マンツーマン（フィリピン）/ グループ（欧米）',
    tip: '話す量を最大化したいならマンツーマン。多国籍の中で揉まれたいならグループ。1日4〜5コマが標準、6〜8コマはスパルタ系です。',
  },
  {
    title: '日本人比率のトレードオフを理解する',
    axis: '10%以下＝英語漬け / 高め＝初心者安心',
    tip: '比率が低いほど英語環境ですが、初海外・英語ゼロには負担も大。「英語を伸ばす」のか「まず安心して立ち上げる」のか、目的で選びます。',
  },
  {
    title: '費用は「込み」か「別」かで比べる',
    axis: '学費 / 宿泊費 / 食費の含み方',
    tip: '月額の見かけだけで比べると失敗します。フィリピンは宿泊・食費込みが多く、欧米は学費のみが多い。総額ベースで並べ直しましょう。',
  },
  {
    title: '認定スキームの有無をチェックする',
    axis: 'British Council / NEAS / Languages Canada 等',
    tip: '長期滞在や学生ビザ申請では実質必須。短期でも、認定校は授業・施設・教師の基準が一定担保されている安心材料になります。',
  },
  {
    title: 'サポート体制と卒業生の声を見る',
    axis: '日本人スタッフ / 到着サポート / 口コミ',
    tip: '初心者ほどサポートの厚さが満足度を左右します。学校HPだけでなく、Google・SNS・体験談など第三者の声も必ず確認しましょう。',
  },
];

const CHECK_POINTS = [
  '日本人比率：英語環境を重視するなら10%以下が目安（多国籍校）',
  '授業形式：マンツーマン（フィリピン）/ グループ（欧米）/ ハイブリッド',
  '1日の授業時間：4〜5コマが標準、6〜8コマはスパルタ系',
  'クラス人数：最大8人以下なら発言機会が多い',
  '認定スキーム：British Council（英）/ NEAS（豪）/ Languages Canada（加）/ CEA（米）等',
  '日本人スタッフ・サポート体制（初心者は必須）',
  '通学エリア（都市部 vs 郊外、治安、家賃）',
  '宿泊オプション（学校寮 / ホームステイ / 自己手配）',
  '長期割引・キャンセル規定の柔軟性',
  '卒業生のレビュー（Google・口コミサイト・SNS）',
];

const FAQS = [
  {
    question: '結局、どの語学学校が一番おすすめですか？',
    answer:
      '「一番」は存在しません。目的・予算・期間によって最適校が変わります。例えば「コスパ重視ならフィリピン」「英語環境ならマルタ」「キャリア重視ならカナダ大手」というように、自分の優先順位で選ぶのが正解。本記事の「目的別おすすめ5パターン」を参考に絞り込んでください。',
  },
  {
    question: 'エージェントが勧める学校だけ選んで大丈夫？',
    answer:
      '注意が必要です。無料エージェントは提携校から手数料を受け取るモデルのため、提携校だけを勧める傾向あり。複数エージェントに相談 or 自分でも本記事のような中立サイトで情報収集を。「自分で選んだ学校でも対応可能か」を必ず聞きましょう。',
  },
  {
    question: 'フィリピン留学は本当にコスパいい？',
    answer:
      '1ヶ月10〜15万円で「学費＋宿泊費＋食費込み」の学校が多く、欧米の1/2〜1/3のコスト。マンツーマン授業中心で集中して英語が伸びます。ただし発音はアメリカ英語ではなくフィリピン系英語に近い点、生活インフラが日本ほど整っていない点に留意。',
  },
  {
    question: '日本人比率が高い学校はダメ？',
    answer:
      'ダメではありません。日本人比率が高い＝サポート体制が整っている可能性も。「英語ゼロから始める」「初海外で不安」な方は日本人スタッフのいる学校が安心。逆に「英語をガチで伸ばしたい」なら日本人10%以下を狙う、と目的別で判断を。',
  },
  {
    question: '認定スキーム（NEAS・British Council等）は重要？',
    answer:
      '長期滞在・学生ビザ申請時は必須。短期（ワーホリの数ヶ月通学）なら必須ではないが、認定校は授業の質・施設・教師基準が一定担保されているシグナルとして安心材料に。HPに認定マークが表示されているか確認を。',
  },
];

function getTopN<T extends { count: number }>(arr: T[], n: number): T[] {
  return [...arr].sort((a, b) => b.count - a.count).slice(0, n);
}

export default async function LanguageSchoolRankingPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const [schoolsData, experiencesData] = await Promise.all([
    getSchools({ limit: 100, depth: 2 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getExperiences({ limit: 100 }).catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
  ]);
  const schools = schoolsData.contents;
  const totalSchoolCount = schoolsData.totalCount;

  // 国別校数（先頭100校サンプル）
  const countByCountry = new Map<string, { name: string; flag?: string; count: number }>();
  for (const s of schools) {
    if (!s.country?.id) continue;
    const entry = countByCountry.get(s.country.id) ?? {
      name: s.country.nameJp,
      flag: s.country.flagEmoji,
      count: 0,
    };
    entry.count++;
    countByCountry.set(s.country.id, entry);
  }
  const topCountries = getTopN(
    Array.from(countByCountry.values()).map((v) => ({ label: `${v.flag ?? ''} ${v.name}`, count: v.count })),
    10
  );

  // 認定スキーム別校数
  const accreditationCount = new Map<string, number>();
  for (const s of schools) {
    if (!s.accreditations) continue;
    for (const acc of s.accreditations) {
      accreditationCount.set(acc, (accreditationCount.get(acc) ?? 0) + 1);
    }
  }
  const ACC_LABELS: Record<string, string> = {
    'british-council': 'British Council（英）',
    'cambridge-english': 'Cambridge English',
    'ialc': 'IALC（国際校連盟）',
    'eaquals': 'EAQUALS（欧州）',
    'neas': 'NEAS（豪）',
    'languages-canada': 'Languages Canada',
    'celta': 'CELTA',
    'acels': 'ACELS（アイルランド）',
    'nzqa': 'NZQA（NZ）',
    'other': 'その他',
  };
  const topAccreditations = getTopN(
    Array.from(accreditationCount.entries()).map(([k, count]) => ({ label: ACC_LABELS[k] ?? k, count })),
    5
  );

  // 週費用の中央値（weeklyFeeLow基準）
  const weeklyFees = schools
    .map((s) => s.weeklyFeeLow)
    .filter((v): v is number => v != null)
    .sort((a, b) => a - b);
  const medianWeeklyFee = weeklyFees.length > 0
    ? weeklyFees[Math.floor(weeklyFees.length / 2)]
    : null;

  // 日本人スタッフ対応校（features に japanese-staff を含む）の比率
  const jpStaffCount = schools.filter((s) => s.features?.includes('japanese-staff')).length;
  const jpStaffRate = schools.length > 0 ? Math.round((jpStaffCount / schools.length) * 100) : 0;

  // 体験談から学校・授業関連の言及
  const mentions = countMentions(experiencesData.contents, /(語学学校|学校|授業|クラス|先生|講師|レッスン|マンツーマン|グループ)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(語学学校|学校|授業|クラス|先生|講師|レッスン|マンツーマン|グループ)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '語学学校ランキング2026', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '語学学校ランキング2026' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              語学学校ランキング2026｜目的別おすすめ＆945校DBの統計分析
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="語学学校を選ぶ前の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「語学学校 ランキング」で検索すると、サイトによって順位がバラバラ。実はそれは、各サイトの提携先・収益構造で順位が変わるからです。
              <br />
              本記事は<strong>どの学校とも提携していない中立メディア</strong>として、目的別の選び方の軸を5パターンに整理し、945校データベースから集計した「国別校数」「認定別」「費用相場」の統計を組み合わせて、自分に合う1校を選ぶための判断材料を提供します。
            </p>
            <p className="text-xs text-gray-500 mt-3">
              ※ 本記事に特定校への推薦・アフィリエイトは含まれません。掲載した学校名は編集部が業界で広く知られたメジャー校から中立的に例示しています。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '「ランキング」は鵜呑みにせず、目的別・予算別で選ぶのが正解',
              '945校DBから集計：国別校数TOP10・認定別TOP5・費用相場',
              '目的別おすすめ5パターン（ガチ・コスパ・初心者・長期・短期）',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* ランキングを鵜呑みにしないために */}
          <section id="how-to-rank" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">「ランキング」を鵜呑みにしないために</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              ネット上の「語学学校ランキング」の多くは、エージェントや比較サイトの提携先・送客手数料率で順位が決まっています。同じ学校でも、サイトによって「1位」と「ランク外」が同居するのはそのためです。
            </p>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              本当に必要なのは「ランキング」ではなく「自分の目的に合う学校を選ぶ判断軸」です。本記事では下記の3軸で整理します。
            </p>
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
              <ul className="space-y-2 text-sm sm:text-base text-primary-900">
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="font-bold text-primary-700 shrink-0">①</span>
                  <span><strong>945校DBの統計データ</strong>で「国・認定・費用」の市場感を把握</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="font-bold text-primary-700 shrink-0">②</span>
                  <span><strong>選ぶ7つの基準</strong>であなたの優先順位を決める</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="font-bold text-primary-700 shrink-0">③</span>
                  <span><strong>目的別5パターン</strong>から近いタイプの推薦校を起点にする</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="font-bold text-primary-700 shrink-0">④</span>
                  <span><strong>失敗しない10チェックポイント</strong>で個別校を最終確認</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 統計 */}
          <section id="stats" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">945校DBの統計：国別・認定別・費用帯</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              当サイト掲載校 <strong>{totalSchoolCount}校</strong> から先頭100校をサンプル抽出して集計した、業界の「市場感」です。
            </p>

            {/* 国別校数 */}
            {topCountries.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-base sm:text-lg mb-3">📍 国別校数 TOP10（n=100サンプル）</h3>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="space-y-2">
                    {topCountries.map((c, i) => {
                      const max = topCountries[0].count;
                      const widthPercent = (c.count / max) * 100;
                      return (
                        <div key={c.label} className="flex items-center gap-3">
                          <span className="w-6 text-xs text-gray-500 font-medium">{i + 1}</span>
                          <span className="w-32 sm:w-40 text-xs sm:text-sm text-gray-800">{c.label}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${widthPercent}%` }}
                              aria-hidden="true"
                            />
                          </div>
                          <span className="w-10 text-xs text-gray-700 text-right">{c.count}校</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ※ 当サイト掲載校の先頭100校をサンプル集計（参考値）。実際の市場全体の校数比率とは異なる場合があります。
                </p>
              </div>
            )}

            {/* 認定別 */}
            {topAccreditations.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-base sm:text-lg mb-3">🏅 認定スキーム別校数 TOP5</h3>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <ul className="space-y-2">
                    {topAccreditations.map((a, i) => (
                      <li key={a.label} className="flex items-baseline justify-between text-sm">
                        <span>
                          <span className="text-gray-500 mr-2">{i + 1}.</span>
                          <strong>{a.label}</strong>
                        </span>
                        <span className="text-primary-700 font-bold">{a.count}校</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ※ 認定スキームは学校の授業品質・施設基準を国際的に保証する制度。学生ビザ申請にも有利。
                </p>
              </div>
            )}

            {/* 費用相場と日本人スタッフ率 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {medianWeeklyFee && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                  <p className="text-xs font-semibold text-amber-900 mb-1">週費用の中央値</p>
                  <p className="text-2xl font-bold text-amber-900">¥{medianWeeklyFee.toLocaleString()}</p>
                  <p className="text-xs text-amber-800 mt-2">
                    {weeklyFees.length}校の週費用低価格帯から算出。月換算で約¥{(medianWeeklyFee * 4).toLocaleString()}〜
                  </p>
                </div>
              )}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <p className="text-xs font-semibold text-emerald-900 mb-1">日本人スタッフ対応校率</p>
                <p className="text-2xl font-bold text-emerald-900">{jpStaffRate}%</p>
                <p className="text-xs text-emerald-800 mt-2">
                  {jpStaffCount}校／{schools.length}校が日本人スタッフ常駐。初心者向け選択肢として活用可能。
                </p>
              </div>
            </div>
          </section>

          {/* 自分に合う学校を選ぶ7つの基準 */}
          <section id="criteria-7" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">自分に合う語学学校を選ぶ7つの基準</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-2">
              「どこがいいか」ではなく「あなたに合うか」で選ぶと、後悔がぐっと減ります。下の7つの基準を、自分の目的に照らして優先順位をつけてください。
            </p>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              ※ ここは「決めるための判断軸」です。候補校を絞ったあとの最終確認は、後半の「失敗しないチェックポイント10項目」を使ってください。
            </p>
            <ol className="space-y-3">
              {SELECTION_CRITERIA.map((c, i) => (
                <li key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                  <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 bg-primary-600 text-white rounded-full text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-base sm:text-lg mb-1">{c.title}</h3>
                    <p className="text-xs text-primary-700 bg-primary-50 inline-block px-2 py-1 rounded mb-2">
                      軸：{c.axis}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.tip}</p>
                    {i === 0 && (
                      <a href="#by-purpose" className="text-sm text-primary-600 hover:underline mt-2 inline-block">
                        → 目的別おすすめ5パターンを見る
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="まず行く国を決めたい方へ"
            description="9カ国の中から、目的・予算・治安の希望に合う国を1分の診断で提案します。"
            primaryHref="/matching"
            primaryLabel="国診断をはじめる"
            secondaryHref="/schools"
            secondaryLabel="945校を検索する"
          />

          {/* 目的別おすすめ */}
          <section id="by-purpose" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">目的別おすすめ5パターン</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              「あなたが何を最優先にしたいか」で、選ぶべき学校タイプは変わります。下記5パターンから最も近いものを選び、推薦校を起点に検索しましょう。
            </p>
            <div className="space-y-4">
              {PURPOSE_RANKING.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg">{p.purpose}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{p.detail}</p>
                  <p className="text-xs font-semibold text-gray-500 mb-2">推薦校（編集部キュレーション）</p>
                  <ul className="space-y-1.5 text-sm text-gray-800 mb-3">
                    {p.recommendations.map((r, j) => (
                      <li key={j} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-primary-600 font-bold shrink-0">▸</span>
                        <span><strong>{r.name}</strong> — {r.reason}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-primary-700 bg-primary-50 px-3 py-2 rounded">
                    💰 費用目安：{p.avg_cost}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              ※ 推薦校は業界で広く知られたメジャー校から編集部が中立的に例示。最終的な選定は、各校のHP・口コミ・無料カウンセリング等で必ず確認してください。
            </p>
          </section>

          {/* 国別の選び方 */}
          <section id="by-country" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別の語学学校選びの軸</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              国によって、学校選びで重視すべき軸が変わります。
            </p>
            <div className="space-y-3">
              {[
                { country: '🇵🇭 フィリピン（セブ・バギオ・マニラ）', point: 'マンツーマン授業の比率、宿泊込み料金、地域（リゾート系セブ vs スパルタ系バギオ）' },
                { country: '🇨🇦 カナダ（トロント・バンクーバー）', point: '長期割引・大学進学パスウェイ・冬の通学距離' },
                { country: '🇦🇺 オーストラリア（シドニー・メルボルン・ブリスベン）', point: 'NEAS認定の有無・観光業との両立可能性' },
                { country: '🇲🇹 マルタ', point: '多国籍比率の高さ・夏期繁忙期の早期予約' },
                { country: '🇮🇪 アイルランド（ダブリン）', point: 'ACELS認定校・31歳までのワーホリと組み合わせ可' },
                { country: '🇬🇧 イギリス（ロンドン）', point: 'British Council認定校・YMSビザとの相性' },
              ].map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1">{c.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* チェックポイント10項目 */}
          <section id="check-points" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">失敗しないチェックポイント10項目</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              候補校を絞ったら、下記10項目を必ずチェック。これだけで「行ってみたら違った」を大幅に防げます。
            </p>
            <ol className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {CHECK_POINTS.map((p, i) => (
                <li key={i} className="flex items-start gap-3 leading-relaxed">
                  <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold">
                    {i + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアルな評価</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{mentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {mentions.containsCount}件</strong>
                （{mentions.percentage}%）が「語学学校・授業・クラス・先生」について言及していました。
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

          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            ※ 本記事は2026年5月時点の情報です。各校の最新の費用・カリキュラム・認定状況は必ず各校公式サイトでご確認ください。
          </p>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/schools" className="text-primary-600 hover:underline">
                  → 945校データベースで検索
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合う国
                </Link>
              </li>
              <li>
                <Link href="/agent-comparison" className="text-primary-600 hover:underline">
                  → エージェント比較（無料vs有料vs自力）
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/no-english" className="text-primary-600 hover:underline">
                  → 英語話せなくてもワーホリできる？
                </Link>
              </li>
              <li>
                <Link href="/homestay-guide" className="text-primary-600 hover:underline">
                  → ホームステイ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/countries/philippines" className="text-primary-600 hover:underline">
                  → フィリピン留学完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/countries/canada" className="text-primary-600 hover:underline">
                  → カナダ留学完全ガイド
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
