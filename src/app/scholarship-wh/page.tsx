import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: '奨学金返済しながらワーホリは可能？猶予制度と資金計画の完全ガイド',
  description: '日本学生支援機構（JASSO）の奨学金を返済しながらワーホリに行く方法を完全解説。海外居住中の猶予制度・減額返還制度、資金計画の立て方、帰国後の返済再開までを実例ベースで紹介。',
  path: '/scholarship-wh',
  keywords: [
    'ワーホリ 奨学金 返済',
    '奨学金 猶予 海外',
    'JASSO 海外 猶予',
    '奨学金 海外 返済',
    'ワーホリ 資金 貯める',
  ],
});

const TOC_HEADINGS = [
  { id: 'is-possible', label: '奨学金返済しながらワーホリは可能？' },
  { id: 'deferral', label: '海外居住中の返還猶予制度' },
  { id: 'reduce', label: '減額返還制度の活用' },
  { id: 'plan', label: '資金計画の立て方' },
  { id: 'after-return', label: '帰国後の返済再開' },
  { id: 'faq', label: 'よくある質問' },
];

const FAQS = [
  {
    question: '奨学金があってもワーホリに行けますか？',
    answer:
      '行けます。JASSO（日本学生支援機構）の奨学金は「海外居住」を理由に返還猶予を申請可能。手続きをきちんとすれば、ワーホリ中の返済を一時停止できます。',
  },
  {
    question: '返還猶予はいくらまで延ばせる？',
    answer:
      '海外居住を理由とした場合、原則として帰国までの期間が猶予対象。ただし通算10年までの上限があります。海外居住中は毎年度の継続申請が必要。',
  },
  {
    question: '減額返還制度とは？',
    answer:
      '月々の返済額を半額にして返済期間を延ばす制度。年収が一定以下（給与所得者で年収300万円以下など）の場合に申請可。帰国後すぐ申請も可能。',
  },
  {
    question: '海外居住中の手続きは誰がやる？',
    answer:
      '基本は自分でオンライン申請。JASSOのスカラネット・パーソナルから「在学届」や「返還猶予願」を提出できます。日本の家族を「連絡担当者」にする方法も。',
  },
  {
    question: 'ワーホリの資金は何ヶ月で貯められる？',
    answer:
      '月10万円貯金できれば、1年で120万円。最低限のワーホリ費用（100〜150万円）に到達できます。奨学金返済中は、まず返済額を削減してから貯金に回すのがコツ。',
  },
];

export default function ScholarshipWhPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '奨学金返済しながらワーホリ', url: '/scholarship-wh' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: '奨学金返済しながらワーホリ' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              奨学金返済しながらワーホリは可能？猶予制度と資金計画
            </h1>
            <ArticleMetaBadge
              readingMinutes={7}
              updatedAt="2026年5月"
              targetAudience="奨学金返済中だがワーホリしたい方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              「奨学金を返済中だけど、ワーホリに行きたい」という方は意外と多いです。
              <br />
              結論から言うと、行けます。JASSO（日本学生支援機構）の返還猶予制度を使えば、ワーホリ中の返済を一時停止できます。
              <br />
              この記事では、手続き方法と帰国後の返済再開、資金計画までまとめました。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'JASSO奨学金の海外居住中の返還猶予制度',
              '減額返還制度を使った月額返済の負担軽減',
              'ワーホリ資金100万円を貯めるための逆算プラン',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* 結論 */}
          <section id="is-possible" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">奨学金返済しながらワーホリは可能？</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              可能です。JASSO（日本学生支援機構）の奨学金は「海外居住」を理由に返還猶予を申請できます。
              ワーホリ中は返済を一時停止して、帰国後に再開するパターンが定番。
            </p>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="text-sm text-emerald-900 leading-relaxed">
                <strong>💡 押さえるべきポイント</strong>: 返済を「踏み倒す」ことはできませんが、「適切な手続きで一時停止」することは可能。手続きを忘れると延滞料が発生するので、出発前に必ず申請を。
              </p>
            </div>
          </section>

          {/* 返還猶予 */}
          <section id="deferral" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">海外居住中の返還猶予制度</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              JASSO第一種・第二種ともに、海外居住を理由とした返還猶予を申請できます。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・<strong>申請方法</strong>: スカラネット・パーソナルからオンライン申請</li>
              <li>・<strong>必要書類</strong>: 海外居住証明（パスポートのコピー・ビザのコピーなど）</li>
              <li>・<strong>猶予期間</strong>: 1年ごとに更新、最長通算10年まで</li>
              <li>・<strong>利息</strong>: 猶予中は利息も停止（第二種利息ありの場合は要確認）</li>
              <li>・<strong>出発前手続き</strong>: 出発の1ヶ月前までに申請が安心</li>
            </ul>
          </section>

          {/* 減額返還 */}
          <section id="reduce" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">減額返還制度の活用</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              ワーホリの資金を貯める段階で、月々の返済額を半額にして手元資金を増やす方法もあります。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・年収300万円以下（給与所得者）または基準所得以下が条件</li>
              <li>・月々の返済額が1/2 or 1/3に減額（返済期間は延長）</li>
              <li>・帰国後に正規返済額に戻す手続きも可能</li>
              <li>・申請はJASSOのスカラネット・パーソナルから</li>
            </ul>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="ワーホリ全体の費用を確認したい方へ"
            description="国別の総費用と予算別プランをチェックしておきましょう。"
            primaryHref="/budget"
            primaryLabel="ワーホリ費用 比較ガイド"
            secondaryHref="/wh-saving-tips"
            secondaryLabel="現地での節約術20選"
          />

          {/* 資金計画 */}
          <section id="plan" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">資金計画の立て方</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              奨学金の月返済を減額しつつ、ワーホリ資金を計画的に貯める手順です。
            </p>
            <ol className="space-y-3">
              {[
                { title: '1. ワーホリ予算を決める', detail: '渡航国・期間で総額を算出。最低100万円、余裕を持って150万円が目安。' },
                { title: '2. 奨学金の減額返還を申請', detail: '月返済を半額にすれば、その分をワーホリ貯金に回せる。' },
                { title: '3. 出発までの月数で逆算', detail: '例：150万円÷12ヶ月＝月12.5万円の貯金。難しければ出発を半年延ばす。' },
                { title: '4. 出発1ヶ月前に返還猶予申請', detail: 'ワーホリ中の返済は完全停止に。' },
                { title: '5. 帰国後に返済再開', detail: '日本での就職・収入確定後、減額返還 or 通常返還を継続。' },
              ].map((step, i) => (
                <li key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-1 text-base">{step.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{step.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* 帰国後 */}
          <section id="after-return" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">帰国後の返済再開</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              ワーホリから帰国したら、返還猶予の解除＋返済再開の手続きをします。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・帰国後すぐに「猶予終了願」をJASSOに提出</li>
              <li>・日本での就職先が決まったら、給与天引きの手続き</li>
              <li>・収入が低い間は減額返還の継続申請も可能</li>
              <li>・帰国後3〜6ヶ月の生活費を確保してから返済再開を</li>
            </ul>
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
            ※ 本記事は2026年5月時点の一般情報です。手続き詳細はJASSO公式サイトでご確認ください。
          </p>

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
                <Link href="/wh-saving-tips" className="text-primary-600 hover:underline">
                  → ワーホリ節約術20選
                </Link>
              </li>
              <li>
                <Link href="/quit-job-wh" className="text-primary-600 hover:underline">
                  → 社会人ワーホリの退職と手続き
                </Link>
              </li>
              <li>
                <Link href="/tax-return" className="text-primary-600 hover:underline">
                  → ワーホリの確定申告ガイド
                </Link>
              </li>
              <li>
                <Link href="/wise-payment-guide" className="text-primary-600 hover:underline">
                  → Wise・クレカ・両替ガイド
                </Link>
              </li>
              <li>
                <Link href="/matching" className="text-primary-600 hover:underline">
                  → 5問で診断：あなたに合う国
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
