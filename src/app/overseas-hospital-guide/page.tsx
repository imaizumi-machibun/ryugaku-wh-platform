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

const PAGE_PATH = '/overseas-hospital-guide';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '海外で病院にかかる完全ガイド｜保険請求・英語問診・国別医療制度',
  description: '海外で病気や怪我をしたときの病院の探し方、予約方法、保険請求の流れ、英語問診フレーズ、国別医療制度の違いまで、留学・ワーホリ生に必要な情報を完全解説。',
  path: PAGE_PATH,
  keywords: [
    '海外 病院',
    '海外 病院 行き方',
    '海外 病院 英語',
    '海外保険 請求',
    'ワーホリ 病院',
    '留学 病気',
  ],
});

const TOC_HEADINGS = [
  { id: 'before-go', label: '受診前に必ずやること3つ' },
  { id: 'how-to-find', label: '病院・クリニックの探し方' },
  { id: 'how-to-visit', label: '受診の流れ8ステップ' },
  { id: 'insurance', label: '保険請求の2パターン' },
  { id: 'english-phrases', label: '英語問診フレーズ集' },
  { id: 'country-system', label: '国別医療制度の違い' },
  { id: 'emergency', label: '緊急時・救急車の呼び方' },
  { id: 'common-illness', label: 'よくある病気と対応' },
  { id: 'experiences', label: '体験談から見るリアル' },
  { id: 'faq', label: 'よくある質問' },
];

const BEFORE_STEPS = [
  { item: '保険会社の24時間日本語ヘルプラインに電話', detail: '保険証券に記載の番号。最寄りのキャッシュレス病院を案内してくれる' },
  { item: 'パスポート・保険証券・現金を持参', detail: '本人確認＋保険適用＋自己負担分の支払い用' },
  { item: '症状を英語でメモしておく', detail: '体温・痛みの場所・持続時間・服用中の薬を箇条書きで準備' },
];

const HOW_TO_FIND = [
  { method: '保険会社の指定病院', detail: 'キャッシュレス対応・日本語可・最も安心。保険会社サイト or 電話で確認' },
  { method: 'Googleマップで「Japanese clinic」検索', detail: '主要都市には日本人医師の在籍するクリニックあり' },
  { method: '在留邦人コミュニティのFB・LINEグループ', detail: '現地在住者がリアルな評判を共有' },
  { method: 'ホストファミリー・学校スタッフに相談', detail: 'ローカルでの評判が良いGP（家庭医）を紹介してもらえる' },
  { method: 'ホテルのコンシェルジュ・受付', detail: '英語対応可のクリニックを把握している' },
];

const VISIT_STEPS = [
  { step: 1, title: '電話 or オンラインで予約', detail: '飛び込み受付の国もあるが、予約必須の国が大半' },
  { step: 2, title: '予約時刻の15分前に到着', detail: '初診の場合は受付フォーム記入に10〜15分必要' },
  { step: 3, title: '受付でパスポート・保険証券を提示', detail: '英文情報があるとスムーズ' },
  { step: 4, title: '問診票記入', detail: '英語が不安な場合はGoogle翻訳でその場で対応' },
  { step: 5, title: '医師の診察', detail: '症状をメモを見せながら説明。聞き取れない場合は遠慮なく聞き返す' },
  { step: 6, title: '処方箋受領・支払い', detail: 'キャッシュレスなら$0、立替なら全額自己負担後に保険会社へ請求' },
  { step: 7, title: '薬局で薬を受け取る', detail: '院内処方の国と院外処方の国がある' },
  { step: 8, title: '領収書・診断書を必ず受領', detail: '保険請求に必須。失くすと保険適用不可' },
];

const INSURANCE_PATTERNS = [
  {
    type: 'キャッシュレス対応',
    detail: '保険会社の提携病院で受診。窓口で支払いゼロ。最も楽',
    pros: '自己負担なし・手続き簡単',
    cons: '提携病院が限られる・予約が取りにくい場合あり',
  },
  {
    type: '立替払い（後日請求）',
    detail: '自分で全額支払い後、領収書・診断書を保険会社に提出',
    pros: 'どの病院でも受診可能',
    cons: '初期費用大（$200〜500）・書類提出が手間',
  },
];

const ENGLISH_PHRASES = [
  { ja: '頭が痛いです', en: 'I have a headache.' },
  { ja: '熱があります', en: 'I have a fever.' },
  { ja: 'お腹が痛いです', en: 'I have a stomachache.' },
  { ja: '喉が痛いです', en: 'I have a sore throat.' },
  { ja: '咳が止まりません', en: 'I cannot stop coughing.' },
  { ja: 'アレルギーがあります', en: 'I am allergic to [food/drug name].' },
  { ja: '保険に入っています', en: 'I have travel insurance.' },
  { ja: '処方箋をください', en: 'Could I have a prescription?' },
  { ja: '英文の診断書をください', en: 'Could I have a medical certificate in English?' },
  { ja: '領収書をください', en: 'Could I have a receipt for insurance?' },
];

const COUNTRY_SYSTEMS = [
  { country: 'オーストラリア', system: 'Medicare（国民皆保険）あるが、ワーホリ・学生は対象外。海外保険必須' },
  { country: 'カナダ', system: '州ごとに公的保険あるが、3ヶ月待機期間あり。学生はuhip加入義務' },
  { country: 'イギリス', system: 'NHS（国民保健サービス）に学生・ワーホリも加入可。ただし長期渡航でIHS課金' },
  { country: 'アメリカ', system: '公的保険なし。海外保険必須、医療費が世界一高い（救急車だけで$2,000+）' },
  { country: 'ニュージーランド', system: 'ACC（事故補償制度）あり、傷害は無料。病気は海外保険' },
  { country: 'フィリピン', system: 'PhilHealthあるが外国人対象外。海外保険必須' },
];

const EMERGENCY_NUMBERS = [
  { country: 'オーストラリア', number: '000', detail: '警察・消防・救急' },
  { country: 'カナダ', number: '911', detail: '警察・消防・救急' },
  { country: 'イギリス', number: '999', detail: '警察・消防・救急（112も可）' },
  { country: 'アメリカ', number: '911', detail: '警察・消防・救急' },
  { country: 'ニュージーランド', number: '111', detail: '警察・消防・救急' },
  { country: 'フィリピン', number: '911', detail: '警察・消防・救急' },
];

const COMMON_ILLNESSES = [
  { illness: '風邪・インフルエンザ', advice: '市販薬で対処、3日以上続く場合GP受診' },
  { illness: '食中毒・下痢', advice: '水分補給、酷い場合は脱水危険のため早めに受診' },
  { illness: '虫歯・歯痛', advice: '歯科治療は保険対象外の国が多い、日本で済ませる' },
  { illness: 'スポーツ怪我', advice: '骨折疑いはすぐ救急、捻挫はRICE処置' },
  { illness: '皮膚炎・湿疹', advice: '気候・水質変化が原因の場合多、皮膚科クリニック' },
  { illness: '生理痛・婦人科', advice: '英語で症状説明難、Japanese clinicや女性医師指定可' },
  { illness: 'メンタル不調', advice: '日本語カウンセラーオンラインサービス併用、海外保険で対応' },
];

const FAQS = [
  {
    question: '海外で病院に行くといくらかかる？',
    answer:
      '国・症状により大きく異なります。アメリカは救急車だけで$2,000〜3,000、簡単な診察でも$200〜500。オーストラリア・カナダはGP診察$60〜120。イギリスはNHSなら無料、私立は$80〜200。海外保険でカバーできるので加入は必須です。',
  },
  {
    question: '保険会社にはどのタイミングで連絡する？',
    answer:
      '受診前に必ず電話。24時間日本語対応で、最寄りのキャッシュレス対応病院を案内してくれます。緊急時で連絡が間に合わない場合は、受診後すぐ連絡。一切連絡せずに帰国すると保険適用外になるケースもあります。',
  },
  {
    question: '英語が話せなくても病院に行ける？',
    answer:
      '行けます。①保険会社の通訳サービス（24時間）、②Japanese clinic（日本人医師）、③Google翻訳での筆談 の3つで対応可能。事前に症状を日本語＋英語でメモ作成しておくと安心。スマホ翻訳アプリは医療用語にも対応しています。',
  },
  {
    question: '日本の薬を持っていける？',
    answer:
      '一般用医薬品は3ヶ月分まで、処方薬は英文処方箋付きで1年分まで。睡眠薬・向精神薬は一部国で輸入禁止のため事前に大使館確認。常用薬は出発前にかかりつけ医に英文処方箋を依頼しておくのが安心。',
  },
  {
    question: '帰国後に体調不良が出たら？',
    answer:
      '保険会社の補償は通常「帰国後72時間以内」までカバー。それ以降は日本の健康保険で対応。海外での治療歴・診断書を持参して日本の医師に提示すると、適切な治療につながります。マラリア等の感染症は症状出現まで時間差があるため要注意。',
  },
];

export default async function OverseasHospitalGuidePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const mentions = countMentions(all, /(病院|医者|風邪|体調|怪我|医療|保険)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.cons?.map((c) => c.text).join(' ') ?? ''}`,
        /(病院|医者|風邪|体調|怪我|医療|保険)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '海外で病院にかかる完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '海外で病院にかかる完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              海外で病院にかかる完全ガイド｜保険請求・英語問診・国別医療制度
            </h1>
            <ArticleMetaBadge
              readingMinutes={11}
              updatedAt="2026年5月"
              targetAudience="留学・ワーホリ中に体調を崩した方／予防的に知りたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              海外で体調を崩したり怪我をしたりするのは、留学・ワーホリ中の最大の不安の一つ。言葉も医療制度も違う環境で、いざという時に動けるかは「事前準備」と「正しい知識」次第です。
              <br />
              この記事では病院の探し方・受診の流れ・保険請求・英語フレーズ・国別の医療制度を完全網羅。緊急時に即実行できる手順をまとめました。
            </p>
          </header>

          <KeyTakeaway
            items={[
              '受診前に必ず保険会社の24時間日本語ヘルプラインに電話',
              'キャッシュレス対応病院を選べば窓口支払いゼロ',
              '領収書・診断書を失くすと保険適用外、必ず受領',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 受診前 */}
          <section id="before-go" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">受診前に必ずやること3つ</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              体調を崩したら、慌てず下記の3ステップを順番に実行しましょう。
            </p>
            <div className="space-y-3">
              {BEFORE_STEPS.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{i + 1}. {s.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 探し方 */}
          <section id="how-to-find" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">病院・クリニックの探し方</h2>
            <div className="space-y-3">
              {HOW_TO_FIND.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{h.method}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{h.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 受診の流れ */}
          <section id="how-to-visit" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">受診の流れ8ステップ</h2>
            <div className="space-y-3">
              {VISIT_STEPS.map((s) => (
                <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-1 text-primary-700">STEP {s.step}: {s.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="出発前の準備リストで保険手続きも"
            description="出発前のチェックリストで保険・常備薬・英文処方箋まで漏れなく準備しましょう。"
            primaryHref="/pre-departure-checklist"
            primaryLabel="出発前チェックリスト60項目"
            secondaryHref="/wh-anxiety-and-persuasion"
            secondaryLabel="不安解消ガイド"
          />

          {/* 保険請求 */}
          <section id="insurance" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">保険請求の2パターン</h2>
            <div className="space-y-3">
              {INSURANCE_PATTERNS.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-base mb-2 text-primary-700">{p.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{p.detail}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <p className="text-emerald-700"><strong>メリット:</strong> {p.pros}</p>
                    <p className="text-rose-700"><strong>デメリット:</strong> {p.cons}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 英語フレーズ */}
          <section id="english-phrases" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">英語問診フレーズ集</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              受診時にそのまま使える基本フレーズ。スマホにスクショして持っていくと安心です。
            </p>
            <div className="space-y-2 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {ENGLISH_PHRASES.map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1 border-b border-sky-100 last:border-0">
                  <span className="text-sm text-gray-700 sm:w-1/3 shrink-0">{p.ja}</span>
                  <span className="text-sm text-sky-900 font-medium">{p.en}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 国別 */}
          <section id="country-system" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">国別医療制度の違い</h2>
            <div className="space-y-3">
              {COUNTRY_SYSTEMS.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{c.country}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.system}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 緊急 */}
          <section id="emergency" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">緊急時・救急車の呼び方</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              意識不明・大量出血・呼吸困難など命に関わる症状は迷わず救急番号へ。
            </p>
            <div className="space-y-2 bg-rose-50 border border-rose-200 rounded-xl p-5">
              {EMERGENCY_NUMBERS.map((e, i) => (
                <div key={i} className="flex items-baseline justify-between py-1 border-b border-rose-100 last:border-0">
                  <span className="text-sm text-gray-800 font-bold">{e.country}</span>
                  <span className="text-base text-rose-700 font-bold">{e.number}</span>
                  <span className="text-xs text-gray-600">{e.detail}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 救急車は有料の国が多い（米$1,000〜3,000、豪$400〜1,000）。海外保険でカバーされます。
            </p>
          </section>

          {/* よくある病気 */}
          <section id="common-illness" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくある病気と対応</h2>
            <div className="space-y-3">
              {COMMON_ILLNESSES.map((ill, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-sm mb-1 text-primary-700">{ill.illness}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{ill.advice}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るリアル</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>n={all.length}件</strong> から「病院・体調・医療」関連の言及を集計。
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
            ※ 本記事は一般的な情報提供を目的としており、医療的助言ではありません。具体的な症状・治療については医療機関にご相談ください。最新の医療制度・救急番号は各国大使館の公式情報でご確認ください。
          </div>

          {/* 内部リンク */}
          <section className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">合わせて読みたい</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li><Link href="/pre-departure-checklist" className="text-primary-600 hover:underline">→ 出発前チェックリスト60項目</Link></li>
              <li><Link href="/wh-mental-health" className="text-primary-600 hover:underline">→ ワーホリのメンタルヘルス</Link></li>
              <li><Link href="/wh-anxiety-and-persuasion" className="text-primary-600 hover:underline">→ 不安解消ガイド</Link></li>
              <li><Link href="/wh-saving-tips" className="text-primary-600 hover:underline">→ ワーホリ節約術</Link></li>
              <li><Link href="/wh-labor-rights" className="text-primary-600 hover:underline">→ ワーホリ労働権利</Link></li>
              <li><Link href="/regret" className="text-primary-600 hover:underline">→ ワーホリ後悔しないために</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
