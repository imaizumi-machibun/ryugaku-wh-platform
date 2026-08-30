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

const PAGE_PATH = '/wh-after-japan-tax';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ帰国後の税金完全ガイド｜住民税・所得税・確定申告・二重課税回避',
  description: 'ワーホリ・留学帰国後の日本での税金処理を完全解説。住民税の取扱、所得税・確定申告のタイミング、海外所得の扱い、二重課税回避、年金・健康保険の復帰手続き。',
  path: PAGE_PATH,
  keywords: [
    'ワーホリ 帰国後 税金',
    'ワーホリ 確定申告',
    'ワーホリ 住民税',
    '海外所得 確定申告',
    'ワーホリ 年金 復帰',
    'ワーホリ 帰国後 手続き',
  ],
});

const TOC_HEADINGS = [
  { id: 'overview', label: '帰国後の手続き全体像' },
  { id: 'transfer-back', label: '転入届と住民登録' },
  { id: 'income-tax', label: '所得税・確定申告のタイミング' },
  { id: 'resident-tax', label: '住民税の取扱' },
  { id: 'foreign-income', label: '海外所得の申告ルール' },
  { id: 'double-taxation', label: '二重課税回避（外国税額控除）' },
  { id: 'pension-insurance', label: '年金・健康保険の復帰' },
  { id: 'common-mistakes', label: 'よくあるトラブル' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const TIMELINE = [
  { period: '帰国当日〜14日以内', activity: '転入届（住民登録）提出、住民票復活' },
  { period: '帰国2-3週間以内', activity: '国民健康保険・国民年金の再加入手続き' },
  { period: '帰国1ヶ月以内', activity: 'マイナンバー再交付（住所変更）' },
  { period: '帰国年の翌年2-3月', activity: '海外所得の確定申告（必要に応じて）' },
  { period: '帰国年の翌年6月', activity: '住民税通知到着、納付開始（前年所得基準）' },
];

const RESIDENT_TAX_RULES = [
  '住民税は「前年1月1日時点の住所地」で課税',
  '出国時に転出届を出していれば、海外滞在中は住民税なし',
  '帰国年に転入届→翌年1月1日時点で住民税対象に',
  '帰国年の翌年6月から住民税通知到着（前年所得ベース）',
  '海外で稼いだ所得は、確定申告すれば日本住民税課税対象に',
];

const FOREIGN_INCOME_RULES = [
  '原則：日本居住者は全世界所得が日本所得税の対象',
  '海外滞在中（非居住者）は海外所得は日本で課税されない',
  '帰国した年に「居住者」に戻った場合、帰国後の海外所得は日本で課税',
  '帰国前の海外所得（非居住者期間中）は日本で非課税',
  'ただし住民税は前年所得ベースなので、海外時代の所得は対象外（転出届有り）',
];

const DOUBLE_TAX_AVOIDANCE = [
  '日本と渡航先が「租税条約」を結んでいる場合、二重課税回避可',
  '主要国（米・英・加・豪・独・仏等）は租税条約あり',
  '海外で源泉徴収された税金 → 日本の確定申告で「外国税額控除」適用',
  '控除額 = 海外で課された税額（日本所得税の範囲内）',
  '申告には海外の源泉徴収票（T4等）が必要',
];

const PENSION_INSURANCE_BACK = [
  '国民健康保険：転入届と同時に再加入、加入日から保険適用',
  '国民年金：転入届時に再加入、未納期間あれば追納可（2年以内）',
  '健康保険の海外療養費請求：帰国72時間以内に保険会社相談',
  'マイナンバー再発行：転入届時に同時申請',
  '会社員→ワーホリ→会社員のケース：転職先で社会保険加入し直し',
];

const COMMON_MISTAKES = [
  '転入届を14日以内に提出しない→過料5万円',
  '海外所得を申告せず後日税務署から指摘→延滞税＋ペナルティ',
  '住民税納付通知を無視→督促状＋滞納処分',
  '外国税額控除を申請せず二重課税のまま',
  '健康保険再加入を忘れ、医療費全額自己負担',
  '年金未納期間が将来の受給額減少につながる',
];

const FAQS = [
  {
    question: 'ワーホリ帰国後、すぐ確定申告必要？',
    answer:
      '必要なケース：①帰国後の海外所得（個人事業主等）、②帰国後すぐの日本での所得、③配当・利子等の所得あり。多くのワーホリ生は帰国時に「給与所得なし」状態、確定申告不要。ただし海外で源泉徴収された税金の還付申請（外国税額控除）したい場合は申告必須。',
  },
  {
    question: '住民税はいくら払うことになる？',
    answer:
      '転出届を出していれば海外滞在中は無税。帰国年の翌年から、前年所得ベース（帰国年所得）で課税開始。帰国直後で日本所得少なければ、翌年住民税も低額。例：帰国年の日本所得200万円なら、翌年住民税約15-20万円。',
  },
  {
    question: '海外で稼いだお金は日本で課税される？',
    answer:
      '転出届を出して非居住者期間に稼いだ所得は、日本では課税対象外。ただし帰国後（居住者復帰後）に受領した海外所得は課税対象。例：豪WHV中に稼いだ給与は日本非課税、帰国後に受領した豪Super還付は受領タイミングで判定。',
  },
  {
    question: '外国税額控除はどう申請する？',
    answer:
      '確定申告時に「外国税額控除に関する明細書」を添付。海外の源泉徴収票（T4等）・確定申告書（Tax Return等）を保管。控除額は海外で課された税額の範囲内、複雑なため税理士相談推奨。',
  },
  {
    question: '年金・健康保険の空白期間どうする？',
    answer:
      '海外転出届を出していた期間は、年金は任意加入扱い、健康保険は脱退扱いで保険料発生なし。帰国時に転入届→再加入で、加入日から再開。年金未納期間は将来の受給額に影響、2年以内なら追納可能。',
  },
];

export default async function WhAfterJapanTaxPage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(税金|確定申告|住民税|所得税|年金|健康保険)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(税金|確定申告|住民税|所得税|年金|健康保険)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ帰国後の税金完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ帰国後の税金完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリ帰国後の税金完全ガイド｜住民税・所得税・確定申告・二重課税回避
            </h1>
            <ArticleMetaBadge
              readingMinutes={10}
              updatedAt="2026年5月"
              targetAudience="ワーホリ帰国予定・帰国直後の方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              ワーホリ帰国後に意外と複雑なのが「日本での税金処理」。住民税・所得税・確定申告・二重課税回避・年金/健康保険復帰など、知らないと損するポイント多数。
              <br />
              この記事では帰国後の手続きタイムライン、税金ルール、二重課税回避、よくあるトラブルまで完全解説します。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '帰国14日以内に転入届提出、住民税は翌年6月開始',
              '海外所得は転出届ありなら非居住期間中は日本非課税',
              '租税条約活用で二重課税回避（外国税額控除）',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 全体像 */}
          <section id="overview" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">帰国後の手続き全体像</h2>
            <div className="space-y-3">
              {TIMELINE.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">{t.period}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{t.activity}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 転入届 */}
          <section id="transfer-back" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">転入届と住民登録</h2>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                <strong>帰国14日以内に転入届提出が法的義務</strong>。住民票復活＝マイナンバー・健康保険・年金等の各種手続き起点。
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・住居地の市区町村役場で手続き、所要30-60分</li>
                <li>・必要書類：パスポート、転出届控え、マイナンバー通知書</li>
                <li>・住民票復活＝住民税・国民健康保険・国民年金の課税起点</li>
                <li>・14日超過は過料5万円リスク</li>
              </ul>
            </div>
          </section>

          {/* 所得税 */}
          <section id="income-tax" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">所得税・確定申告のタイミング</h2>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 space-y-2 text-sm text-gray-800">
              <p>・<strong>申告期間:</strong> 翌年2月16日〜3月15日</p>
              <p>・<strong>対象所得:</strong> 帰国年の1月1日〜12月31日の全所得</p>
              <p>・<strong>給与所得のみ（会社員）:</strong> 年末調整で完結、確定申告不要</p>
              <p>・<strong>海外所得あり:</strong> 外国税額控除のため確定申告推奨</p>
              <p>・<strong>個人事業主・フリーランス:</strong> 確定申告必須</p>
            </div>
          </section>

          {/* 住民税 */}
          <section id="resident-tax" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">住民税の取扱</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {RESIDENT_TAX_RULES.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="海外滞在中の税金処理も合わせて"
            description="豪TFN・カナダTax Return・豪Super還付など、海外滞在中の税金処理も確認を。"
            primaryHref="/tax-return"
            primaryLabel="ワーホリ確定申告"
            secondaryHref="/wh-pension-refund-australia"
            secondaryLabel="豪Super還付DASP"
          />

          {/* 海外所得 */}
          <section id="foreign-income" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">海外所得の申告ルール</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {FOREIGN_INCOME_RULES.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0">📋</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 二重課税 */}
          <section id="double-taxation" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">二重課税回避（外国税額控除）</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-amber-50 border border-amber-100 rounded-xl p-5">
              {DOUBLE_TAX_AVOIDANCE.map((d, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">💰</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 年金保険 */}
          <section id="pension-insurance" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">年金・健康保険の復帰</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              {PENSION_INSURANCE_BACK.map((p, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">🏥</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* よくあるミス */}
          <section id="common-mistakes" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくあるトラブル</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {COMMON_MISTAKES.map((m, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-700 font-bold shrink-0">⚠️</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「税金・確定申告・住民税・年金」関連の言及を集計。
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
            ※ 税制度は2026年5月時点の情報です。最新情報・個別ケースは国税庁・住民税担当市区町村・税理士へご相談を。本記事は一般的なガイドであり、個別の税務判断ではありません。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/tax-return" className="text-primary-600 hover:underline">→ ワーホリ確定申告</Link></li>
              <li><Link href="/wh-pension-refund-australia" className="text-primary-600 hover:underline">→ 豪Super還付DASP</Link></li>
              <li><Link href="/canada-tax-return" className="text-primary-600 hover:underline">→ カナダTax Return</Link></li>
              <li><Link href="/australia-tfn-guide" className="text-primary-600 hover:underline">→ 豪TFN取得</Link></li>
              <li><Link href="/wh-job-hunting-japan" className="text-primary-600 hover:underline">→ 帰国後就活</Link></li>
              <li><Link href="/quit-job-wh" className="text-primary-600 hover:underline">→ 社会人ワーホリ退職</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
