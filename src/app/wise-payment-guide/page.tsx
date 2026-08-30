import type { Metadata } from 'next';
import Link from 'next/link';
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

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリの送金・両替・クレカ完全ガイド｜Wise・デビットカード活用法',
  description: 'ワーキングホリデーの送金・両替・決済を最も得にする方法を解説。Wise（ワイズ）の使い方、おすすめクレジットカード・デビットカード、現金との使い分け、海外ATMの手数料まで実体験ベースでまとめました。',
  path: '/wise-payment-guide',
  keywords: [
    'Wise 使い方 ワーホリ',
    'ワーホリ 送金 方法',
    'ワーホリ 両替 おすすめ',
    'ワーホリ クレジットカード',
    '海外 デビットカード ワーホリ',
    'ワーホリ お金 管理',
    'Wise デビット カード',
  ],
});

const TOC_HEADINGS = [
  { id: 'three-tools', label: '海外でのお金の管理：3つの手段を組み合わせる' },
  { id: 'wise', label: 'Wise（ワイズ）の使い方完全ガイド' },
  { id: 'credit-card', label: 'クレジットカードの選び方' },
  { id: 'cash', label: '現金・両替・海外ATMの使い方' },
  { id: 'experiences', label: '体験談から見るお金のトラブル' },
  { id: 'faq', label: 'よくある質問' },
];

const PAYMENT_TOOLS = [
  {
    emoji: '💳',
    title: 'Wise（ワイズ）— マルチカレンシー口座＋デビットカード',
    role: 'メイン口座',
    pros: ['実勢レートで両替（銀行より格段に安い）', '海外送金の手数料が業界最安級', 'デビットカード機能で現地ATM出金可', '50通貨以上対応'],
    cons: ['初回はカード発行に2〜3週間', 'ATM出金は月3万円超で手数料発生'],
  },
  {
    emoji: '💼',
    title: 'クレジットカード（VISA / Mastercard 2枚以上）',
    role: '緊急時バックアップ＋大型出費',
    pros: ['海外旅行保険が自動付帯（年会費無料カードも）', 'ホテル・航空券の予約に必須', 'ポイント・マイル蓄積'],
    cons: ['海外利用手数料1.6〜2.0%', '為替レート上乗せで意外と高い', '紛失時の停止が手間'],
  },
  {
    emoji: '💴',
    title: '現金（初期分のみ）',
    role: '到着直後の最低限',
    pros: ['ATMが使えない地域でも使える', '小額決済（バス・チップ等）に便利'],
    cons: ['盗難・紛失リスク', '多額持ち込みは申告対象（豪：1万豪ドル以上）'],
  },
];

const WISE_STEPS = [
  {
    step: 'Step 1',
    title: 'アカウント作成（日本で完結）',
    detail: 'wise.com から無料登録。本人確認書類（パスポート・運転免許証）をアップロード。1〜2営業日で完了します。',
  },
  {
    step: 'Step 2',
    title: 'デビットカードを申請',
    detail: '日本国内の住所に2〜3週間で届きます。出発1ヶ月前には申請しておきましょう。発行手数料1,200円。',
  },
  {
    step: 'Step 3',
    title: '日本円を入金して現地通貨に両替',
    detail: 'マイページから「両替」を選び、AUD・CAD・USD等に変換。レートが実勢に近く、銀行両替より圧倒的に得です。',
  },
  {
    step: 'Step 4',
    title: '現地で使う',
    detail: 'デビットカードでお店で決済、または現地のATMで現地通貨を引き出し。月3万円相当までATM手数料無料。',
  },
  {
    step: 'Step 5',
    title: '現地口座を作って給与受取に活用',
    detail: 'Wise の現地口座番号機能で、現地の雇用主から給与をWiseに振り込んでもらえます。後で日本円に両替して日本の口座に戻すことも可能。',
  },
];

const CREDIT_CARDS = [
  {
    name: 'エポスカード',
    type: '年会費無料',
    insurance: '海外旅行保険 自動付帯（最高500万円）',
    detail: 'ワーホリ・留学の定番。海外旅行保険が自動付帯（条件なし）なのが最大の強み。VISA',
  },
  {
    name: 'セゾンブルー・アメックス',
    type: '年会費 初年度無料',
    insurance: '海外旅行保険 自動付帯（最高3000万円）',
    detail: '海外旅行保険が手厚い。Amex なので使えない店もあるが、保険目的で持つ価値あり',
  },
  {
    name: '楽天プレミアムカード',
    type: '年会費11,000円',
    insurance: '海外旅行保険 自動付帯＋プライオリティパス',
    detail: '空港ラウンジ無料。長期渡航者で空港利用が多い方向け。VISA / Mastercard / JCB / Amex',
  },
  {
    name: 'JCBカード',
    type: '年会費無料〜',
    insurance: '海外旅行保険 利用付帯（条件あり）',
    detail: 'オーストラリア・北米では使える店が少ない。アジア向けには強い',
  },
];

const FAQS = [
  {
    question: 'Wise・クレジットカード・現金の使い分けは？',
    answer:
      'メインはWiseデビットカード（日常の決済・ATM出金）、緊急時用にクレジットカード2枚（VISA+Mastercard推奨）、現金は到着直後の数日〜1週間分のみ、が基本の使い分けです。これで両替の損失を最小化しつつ、トラブル時の備えも万全になります。',
  },
  {
    question: 'Wiseのデビットカードはどれくらい前に申請すべき？',
    answer:
      '出発1ヶ月前に申請するのがベスト。本人確認・カード発行・到着まで2〜3週間かかるためです。日本の住所にしか発行されないため、出発後の海外住所での申請はできません。',
  },
  {
    question: '日本のクレジットカードは現地でそのまま使えますか？',
    answer:
      'VISA・Mastercardは世界中ほぼどこでも使えます。Amex・JCBは使える店が限られる（特にオセアニア・北米）ので、メインはVISAかMastercardにしましょう。海外利用には手数料（1.6〜2.0%）と為替レートの上乗せがかかります。',
  },
  {
    question: '現地で日本円を両替するのは損ですか？',
    answer:
      '空港の両替所は最悪のレート（実勢-5〜10%）です。市中の両替所でも-3〜5%。Wiseで両替すれば実勢-0.5%程度に抑えられます。現金は最低限にして、Wiseか現地ATMで引き出すのが鉄則です。',
  },
  {
    question: '現地で銀行口座は作る必要がありますか？',
    answer:
      'カフェ・レストランなど現地で働く場合は必須です。給与の振込先として要求されます。Commonwealth Bank（豪）・TD Canada Trust（加）等が手続きしやすく、パスポートとビザ書類で開設できます。Wiseの現地口座番号でも給与受取できる場合があります。',
  },
];

export default async function WisePaymentGuidePage() {
  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  // お金・両替・送金関連の言及をカウント
  const moneyMentions = countMentions(all, /(両替|送金|Wise|ATM|為替|クレジット|デビット|お金|現金|銀行口座)/);
  const sample = moneyMentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.cons?.map((c) => c.text).join(' ') ?? ''}`,
        /(両替|送金|Wise|ATM|為替|クレジット|デビット|お金|現金|銀行口座)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリの送金・両替・クレカガイド', url: '/wise-payment-guide' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリの送金・両替・クレカガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              ワーホリの送金・両替・クレカ完全ガイド｜Wise活用と決済のベストな組み合わせ
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="ワーホリのお金管理を最適化したい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              海外でのお金の管理を間違えると、年間で5〜10万円分の手数料・為替損が発生します。
              <br />
              この記事では、最も得する組み合わせとして「Wise（ワイズ）デビットカード＋クレジットカード2枚＋少額現金」を解説します。
              出発前にやるべき準備と現地での使い分けをまとめました。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'Wise・クレカ・現金の3つを役割分担して使うのが正解',
              'Wise デビットカードは出発1ヶ月前に申請（発行に2〜3週間）',
              'クレジットカードは保険目的でエポスカード（年会費無料・自動付帯）が定番',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 3つの手段 */}
          <section id="three-tools" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">海外でのお金の管理：3つの手段を組み合わせる</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              「Wiseだけ」「クレカだけ」では足りません。それぞれの強みを組み合わせるのが、損しないコツです。
            </p>
            <div className="space-y-4">
              {PAYMENT_TOOLS.map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg flex items-center gap-2">
                    <span aria-hidden="true">{t.emoji}</span>
                    {t.title}
                  </h3>
                  <p className="text-xs text-primary-700 font-semibold mb-3">役割: {t.role}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                      <p className="text-xs font-bold text-emerald-900 mb-1">メリット</p>
                      <ul className="text-xs text-emerald-900 space-y-1">
                        {t.pros.map((p, j) => (
                          <li key={j}>・{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 rounded-lg p-3">
                      <p className="text-xs font-bold text-rose-900 mb-1">注意点</p>
                      <ul className="text-xs text-rose-900 space-y-1">
                        {t.cons.map((c, j) => (
                          <li key={j}>・{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Wise */}
          <section id="wise" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Wise（ワイズ）の使い方完全ガイド</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              Wise はワーホリ渡航者の定番ツール。実勢に近いレートで両替でき、送金手数料も最安級です。準備〜活用までを5ステップで解説します。
            </p>
            <ol className="space-y-3">
              {WISE_STEPS.map((s, i) => (
                <li
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4"
                >
                  <div className="sm:w-24 shrink-0">
                    <span className="inline-block text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded">
                      {s.step}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1 text-base sm:text-lg">{s.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="費用全体を確認したい方へ"
            description="国別の総費用、予算別プランも合わせて確認しておきましょう。"
            primaryHref="/budget"
            primaryLabel="ワーホリ費用 比較ガイド"
            secondaryHref="/wh-saving-tips"
            secondaryLabel="現地での節約術（準備中）"
          />

          {/* クレジットカード */}
          <section id="credit-card" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">クレジットカードの選び方</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ワーホリでは「保険」「ホテル・航空券予約」「緊急時バックアップ」の3つの理由でクレジットカードが必要。最低2枚を準備しましょう。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">カード名</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">年会費</th>
                    <th className="px-4 py-3 font-semibold">保険</th>
                    <th className="px-4 py-3 font-semibold">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {CREDIT_CARDS.map((c, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{c.type}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{c.insurance}</td>
                      <td className="px-4 py-3 text-gray-700">{c.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ カード情報は2026年5月時点。最新の年会費・保険内容は各カード公式サイトでご確認ください。
            </p>
          </section>

          {/* 現金 */}
          <section id="cash" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">現金・両替・海外ATMの使い方</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              現金は到着直後の数日〜1週間分のみで十分。それ以上は盗難リスクが高くなります。
            </p>
            <div className="space-y-3 text-sm sm:text-base text-gray-800">
              <p className="leading-relaxed">
                <strong>到着日に必要な現金の目安</strong>: 5〜10万円相当（空港〜宿の交通費＋初日食事＋緊急予備）。
              </p>
              <p className="leading-relaxed">
                <strong>両替場所のおすすめ順</strong>:
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Wise（実勢-0.5%程度／最もお得）</li>
                <li>日本国内の金券ショップ・チケットセンター（実勢-1〜2%）</li>
                <li>日本国内の銀行・両替所（実勢-3%）</li>
                <li>現地の市中両替所（実勢-3〜5%）</li>
                <li>空港の両替所（実勢-5〜10%／最終手段）</li>
              </ol>
              <p className="leading-relaxed mt-3">
                <strong>現地ATMの使い方</strong>: Wiseデビットカードを差し込み、暗証番号を入力。「現地通貨で引き出す」を選ぶこと（「日本円で計算」を選ぶと不利なレートになる）。月3万円超で2%手数料。
              </p>
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るお金のトラブル</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              実渡航者の体験談から、お金関連のトラブル・気づきを集計しました。
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                体験談 <strong>{moneyMentions.totalChecked}件</strong> のうち、
                <strong className="text-primary-700"> {moneyMentions.containsCount}件</strong>
                （{moneyMentions.percentage}%）がお金管理・両替・送金について言及していました。
              </p>
              <p className="text-xs text-gray-500">
                ※ advice/pros/cons から「両替/送金/Wise/ATM/為替/クレジット/デビット/お金/現金/銀行口座」のいずれかを含む体験談を抽出（参考値）。
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
                <Link href="/budget" className="text-primary-600 hover:underline">
                  → ワーホリ費用 比較ガイド
                </Link>
              </li>
              <li>
                <Link href="/packing" className="text-primary-600 hover:underline">
                  → ワーホリ持ち物チェックリスト
                </Link>
              </li>
              <li>
                <Link href="/tax-return" className="text-primary-600 hover:underline">
                  → ワーホリの確定申告ガイド
                </Link>
              </li>
              <li>
                <Link href="/guide/departure-prep" className="text-primary-600 hover:underline">
                  → 出発準備フェーズの完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/regret" className="text-primary-600 hover:underline">
                  → ワーホリで後悔しないための7つの教訓
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合うワーホリ国
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
