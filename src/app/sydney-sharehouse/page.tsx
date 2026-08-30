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

const PAGE_PATH = '/sydney-sharehouse';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'シドニーのシェアハウス完全ガイド｜エリア別家賃相場と探し方【2026年版】',
  description: 'シドニーでシェアハウスを探す完全ガイド。エリア別の家賃相場（CBD・Bondi・Surry Hills等）、定番の探し方（Flatmates・Gumtree・日系サイト）、内見のチェックポイント、ボンドの仕組み、トラブル対処まで実例ベースで解説。',
  path: PAGE_PATH,
  keywords: [
    'シドニー シェアハウス',
    'シドニー 家賃',
    'シドニー 住居',
    'シドニー シェアハウス 探し方',
    'シドニー Flatmates',
    'シドニー 家賃 相場',
    'ワーホリ シドニー 住居',
  ],
});

const TOC_HEADINGS = [
  { id: 'rent-by-area', label: 'エリア別の家賃相場（10エリア）' },
  { id: 'how-to-find', label: 'シェアハウスの探し方5選' },
  { id: 'inspection', label: '内見でチェックすべき10項目' },
  { id: 'contract', label: 'ボンド・契約の仕組み' },
  { id: 'special-types', label: '女性専用・カップル可など特殊オプション' },
  { id: 'troubles', label: 'よくあるトラブルと対処法' },
  { id: 'experiences', label: '体験談から見るシドニー住居の実態' },
  { id: 'faq', label: 'よくある質問' },
];

const AREA_RENT = [
  { area: 'CBD（中心地）', sharedRoom: 'AUD 250〜350/週', privateRoom: 'AUD 350〜500/週', feature: 'オフィス・観光地に至近。通勤・観光しやすいが家賃高い。' },
  { area: 'Bondi（東部・ビーチ）', sharedRoom: 'AUD 280〜380/週', privateRoom: 'AUD 380〜550/週', feature: 'ビーチ徒歩圏内。サーフィン・観光業者に人気。' },
  { area: 'Surry Hills（CBD南東）', sharedRoom: 'AUD 230〜320/週', privateRoom: 'AUD 320〜450/週', feature: 'カフェ・レストラン多数。クリエイティブ業界系。' },
  { area: 'Newtown（CBD南西）', sharedRoom: 'AUD 200〜280/週', privateRoom: 'AUD 280〜400/週', feature: '学生街、多文化。コスパ重視ワーホリに人気。' },
  { area: 'Parramatta（西部）', sharedRoom: 'AUD 180〜250/週', privateRoom: 'AUD 250〜350/週', feature: 'CBDまで電車30分。家賃を抑えたい人に最適。' },
  { area: 'Bondi Junction', sharedRoom: 'AUD 250〜350/週', privateRoom: 'AUD 350〜480/週', feature: 'Bondiビーチとショッピングモール至近。バランス◎。' },
  { area: 'Chatswood（北部）', sharedRoom: 'AUD 220〜300/週', privateRoom: 'AUD 300〜420/週', feature: 'アジア系コミュニティ、日本食材店多数。' },
  { area: 'Manly（北部ビーチ）', sharedRoom: 'AUD 250〜350/週', privateRoom: 'AUD 350〜480/週', feature: 'フェリーでCBD直結。ビーチライフ重視。' },
  { area: 'Hurstville（南部）', sharedRoom: 'AUD 170〜240/週', privateRoom: 'AUD 240〜340/週', feature: '中華系コミュニティ。アジア食材・物価安め。' },
  { area: 'Marrickville（CBD南）', sharedRoom: 'AUD 200〜280/週', privateRoom: 'AUD 280〜380/週', feature: 'ベトナム・ギリシャ系。日本人少なめで英語環境◎。' },
];

const FIND_METHODS = [
  {
    name: 'Flatmates.com.au',
    detail: 'オーストラリア最大級のシェアハウス検索サイト。物件数最多、検索性◎。英語サイトだが直感的に使える。',
    pro: '物件数最多・写真豊富・連絡が直接できる',
    con: '人気物件は競争激しい',
  },
  {
    name: 'Gumtree',
    detail: 'オーストラリアのクラシファイド広告サイト。シェアハウス以外の家具・中古品も検索可。',
    pro: '幅広い物件・即入居可の物件多い',
    con: '詐欺物件が紛れている。要内見必須',
  },
  {
    name: '日豪プレス・JAMS.TV',
    detail: '日本語のクラシファイドサイト。日本人向けシェアハウス情報あり。',
    pro: '日本語で安心・日本人ホスト多い',
    con: '日本人比率高い物件が多い・英語環境にはなりにくい',
  },
  {
    name: 'Facebookグループ',
    detail: 'Sydney Sharehouse、Japanese in Sydney等のFBグループ。リアルタイム情報。',
    pro: '無料・スピード感ある・直接連絡可',
    con: '詐欺リスクあり・写真少なめ',
  },
  {
    name: '現地不動産業者（Real Estate）',
    detail: '長期滞在向け。アパート1室を契約してルームメイトを募集するパターン。',
    pro: '契約が安定・トラブル少',
    con: '初期費用が高い（4週間分のボンド＋家賃前払い）',
  },
];

const INSPECTION_CHECKLIST = [
  '家賃に何が含まれるか（光熱費・WiFi・洗濯機）',
  '部屋の鍵・玄関の防犯（複数施錠か）',
  'ベッド・机・収納の設備',
  'シャワー・トイレの清潔さと混み具合（住人数で計算）',
  '台所の使用ルール（食材保管・洗い物当番）',
  '住人の年齢層・職業・国籍構成',
  '門限・パーティー・友人訪問のルール',
  '退去通知の期間（多くは2〜4週間前）',
  '近隣の治安（特に夜間の帰り道）',
  '最寄り駅・バス停・スーパーまでの距離',
];

const FAQS = [
  {
    question: 'シドニーのシェアハウスは何ヶ月前に探すべき？',
    answer:
      '渡航前にネットで物件目星をつけ、到着後すぐに内見というパターンが定番。出発1〜2週間前から Flatmates・Gumtree で検索開始。短期Airbnb 2週間予約→現地で本格的に物件探しが王道。',
  },
  {
    question: 'ボンド（敷金）はいくら？',
    answer:
      'シェアハウスは家賃の2〜4週間分が標準。CBDの個室で1,000〜2,000豪ドル相当。退去時に部屋を綺麗に保てば全額返却。トラブルがあると差し引かれる可能性あり。',
  },
  {
    question: '内見せず契約しても大丈夫？',
    answer:
      '絶対にNG。「写真と全然違う」「ホストが詐欺」のリスクが高い。必ず内見してから契約金を払いましょう。出発前にネットで連絡だけ取り、到着後すぐ内見の流れがおすすめ。',
  },
  {
    question: '英語環境にしたいなら、どのエリアがおすすめ？',
    answer:
      'Marrickville（多文化系）、Newtown（学生・若者）、Manly（オージー多め）、Bondi（観光業者）あたりは英語環境を作りやすい。逆にChatswoodはアジア系多い、Hurstvilleは中華系コミュニティが集中。',
  },
  {
    question: 'シェアハウスでトラブルがあったらどうすればいい？',
    answer:
      'まずホストに直接相談。それでも改善されない場合、2〜4週間の退去通知期間を経て退去。ボンド返却を巡るトラブルは NSW Civil and Administrative Tribunal（NCAT）に相談可。証拠（写真・領収書）を必ず保管。',
  },
];

export default async function SydneySharehousePage() {
  if (!isPublished(PAGE_PATH)) notFound();

  const experiencesData = await getExperiences({ limit: 100 }).catch(() => ({
    contents: [], totalCount: 0, offset: 0, limit: 0,
  }));
  const all = experiencesData.contents;

  const sydneyExperiences = all.filter((e) =>
    e.country?.id === 'australia' && /シドニー|Sydney/i.test(e.cityPrimary ?? '')
  );

  const mentions = countMentions(sydneyExperiences, /(シェアハウス|住居|家賃|ルームメイト|内見|Flatmates|Gumtree|ボンド)/);
  const sample = mentions.samples[0];
  const quoteText = sample
    ? extractMatchingSentence(
        `${sample.advice ?? ''} ${sample.pros?.map((p) => p.text).join(' ') ?? ''}`,
        /(シェアハウス|住居|家賃|ルームメイト|内見|Flatmates|Gumtree|ボンド)/
      )
    : null;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'シドニーのシェアハウス完全ガイド', url: PAGE_PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'シドニーのシェアハウス完全ガイド' }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              シドニーのシェアハウス完全ガイド｜エリア別家賃相場と探し方
            </h1>
            <ArticleMetaBadge
              readingMinutes={9}
              updatedAt="2026年5月"
              targetAudience="シドニーで住居を探す方"
            />
            <p className="text-gray-700 leading-relaxed text-base">
              シドニーは家賃が世界トップクラスに高い都市。エリア選びを間違えると、家計が破綻します。
              <br />
              この記事では、10エリアの家賃相場（CBD・Bondi・Surry Hills等）、定番の探し方5選、内見のチェック10項目、ボンドの仕組み、トラブル対処まで、シドニーで失敗しない住居選びの全てをまとめました。
            </p>
          </header>

          <KeyTakeaway
            items={[
              'シドニー10エリアの家賃相場：相部屋AUD 170〜380/週、個室AUD 240〜550/週',
              '定番の探し方5選（Flatmates・Gumtree・日系・FB・不動産業者）',
              '内見でチェックすべき10項目とボンド契約の仕組み',
            ]}
          />

          <InPageTOC headings={TOC_HEADINGS} />

          {/* エリア別家賃 */}
          <section id="rent-by-area" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">エリア別の家賃相場（10エリア）</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              シドニーは「都心 ↔ ビーチエリア ↔ 郊外」で家賃が大きく変わります。あなたのライフスタイルに合うエリアを選びましょう。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">エリア</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">相部屋</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">個室</th>
                    <th className="px-3 py-3 font-semibold">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {AREA_RENT.map((a) => (
                    <tr key={a.area} className="border-t border-gray-100">
                      <td className="px-3 py-3 font-medium whitespace-nowrap">{a.area}</td>
                      <td className="px-3 py-3 text-xs">{a.sharedRoom}</td>
                      <td className="px-3 py-3 text-xs">{a.privateRoom}</td>
                      <td className="px-3 py-3 text-xs">{a.feature}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 2026年5月時点の相場目安。光熱費・WiFi込みかは物件ごとに要確認。AUD 1 = 約100〜110円。
            </p>
          </section>

          {/* 探し方 */}
          <section id="how-to-find" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">シェアハウスの探し方5選</h2>
            <div className="space-y-3">
              {FIND_METHODS.map((m, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-base sm:text-lg text-primary-700">{m.name}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{m.detail}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-50 rounded p-2">
                      <strong className="text-emerald-900">⭕ メリット：</strong>
                      <span className="text-emerald-900 ml-1">{m.pro}</span>
                    </div>
                    <div className="bg-rose-50 rounded p-2">
                      <strong className="text-rose-900">⚠️ 注意：</strong>
                      <span className="text-rose-900 ml-1">{m.con}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 中段CTA */}
          <MidCTA
            title="オーストラリアでの仕事の探し方も合わせて確認"
            description="住居が決まったら次は仕事探し。オーストラリア完全ガイドを。"
            primaryHref="/australia-jobs"
            primaryLabel="オーストラリア仕事探し方"
            secondaryHref="/housing-comparison"
            secondaryLabel="住居タイプ比較（ホームステイ含む）"
          />

          {/* 内見 */}
          <section id="inspection" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">内見でチェックすべき10項目</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              内見せず契約は絶対NG。下記10項目を必ず確認してから契約金を払いましょう。
            </p>
            <ol className="space-y-2 text-sm sm:text-base text-gray-800 bg-sky-50 border border-sky-100 rounded-xl p-5">
              {INSPECTION_CHECKLIST.map((c, i) => (
                <li key={i} className="flex items-start gap-3 leading-relaxed">
                  <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold">
                    {i + 1}
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ボンド・契約 */}
          <section id="contract" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">ボンド・契約の仕組み</h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
              シドニーのシェアハウス契約には、家賃の2〜4週間分のボンド（敷金）が必要。退去時に部屋の状態が問題なければ返却されます。
            </p>
            <ul className="space-y-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl p-5">
              <li>・<strong>ボンド額</strong>: 家賃の2〜4週間分。CBD個室で1,000〜2,000豪ドル相当</li>
              <li>・<strong>家賃前払い</strong>: 入居時に2〜4週間分の家賃を先払いするケースが多い</li>
              <li>・<strong>契約期間</strong>: 最低3ヶ月の物件が多いが、月単位契約もあり</li>
              <li>・<strong>退去通知</strong>: 2〜4週間前に書面 or メッセージで通知</li>
              <li>・<strong>ボンド返却</strong>: 退去後1〜2週間で全額返却（部屋状態次第で減額あり）</li>
              <li>・<strong>領収書・契約書</strong>: 必ず受け取り保管。トラブル時の証拠になる</li>
            </ul>
          </section>

          {/* 特殊オプション */}
          <section id="special-types" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">女性専用・カップル可など特殊オプション</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">👩 Female Only（女性専用）</h3>
                <p className="text-sm text-gray-700">女性住人のみ受け入れる物件。防犯面で安心。家賃は通常物件と同等〜やや高め。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">💑 Couple Friendly（カップル可）</h3>
                <p className="text-sm text-gray-700">2人で1部屋シェア可能な物件。家賃は1人分の1.3〜1.5倍。Flatmatesで「Couple OK」フィルタ可。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">🐾 Pet Friendly（ペット可）</h3>
                <p className="text-sm text-gray-700">ペット同居可能な物件。少数派なため探すのに時間かかる。家賃は通常より高め。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-1 text-base">🚭 Non-Smoker（禁煙）</h3>
                <p className="text-sm text-gray-700">物件内禁煙のみ受け入れる物件。多くの物件が禁煙。喫煙者はベランダ・庭利用が条件のケース多い。</p>
              </div>
            </div>
          </section>

          {/* トラブル対処 */}
          <section id="troubles" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">よくあるトラブルと対処法</h2>
            <div className="space-y-3">
              {[
                {
                  title: '騒音・生活リズムの違い',
                  detail: 'まずホストに相談。ルール明文化を提案。改善されない場合は退去通知。',
                },
                {
                  title: '光熱費の追加請求',
                  detail: '契約時に「家賃に光熱費込みか」を必ず文書で確認。後出し追加請求はNCATに相談可。',
                },
                {
                  title: 'ボンド返却拒否・減額',
                  detail: '入居時・退去時の部屋写真を必ず撮影。NCAT（NSW Civil and Administrative Tribunal）に申立て可。',
                },
                {
                  title: '盗難・無断侵入',
                  detail: '即座に警察（131-444）と物件オーナーに連絡。Police Report取得。海外保険でカバーされる可能性あり。',
                },
              ].map((t, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold mb-1 text-base text-rose-700">{t.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{t.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 体験談 */}
          <section id="experiences" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">体験談から見るシドニー住居の実態</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                シドニー渡航者の体験談 <strong>n={sydneyExperiences.length}件</strong> から住居関連の言及を集計。
                <strong className="text-primary-700">{mentions.containsCount}件</strong>
                （{sydneyExperiences.length > 0 ? Math.round((mentions.containsCount / sydneyExperiences.length) * 100) : 0}%）が住居について言及していました。
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
            ※ 本記事は2026年5月時点の情報です。家賃相場・契約条件は変動します。実際の物件詳細は各サイト・物件オーナーへご確認ください。
          </p>

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
                <Link href="/countries/australia" className="text-primary-600 hover:underline">
                  → オーストラリア国別ガイド
                </Link>
              </li>
              <li>
                <Link href="/housing-comparison" className="text-primary-600 hover:underline">
                  → 住居タイプ比較
                </Link>
              </li>
              <li>
                <Link href="/women" className="text-primary-600 hover:underline">
                  → 女性一人ワーホリ完全ガイド
                </Link>
              </li>
              <li>
                <Link href="/wh-saving-tips" className="text-primary-600 hover:underline">
                  → ワーホリ節約術20選
                </Link>
              </li>
              <li>
                <Link href="/wise-payment-guide" className="text-primary-600 hover:underline">
                  → Wise・送金・両替ガイド
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
