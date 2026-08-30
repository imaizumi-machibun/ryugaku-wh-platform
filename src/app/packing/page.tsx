import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import InPageTOC from '@/components/article/InPageTOC';
import MidCTA from '@/components/article/MidCTA';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateItemListJsonLd } from '@/lib/seo/jsonld';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ持ち物チェックリスト【2026年版】国別の注意点・現地調達できるもの',
  description: 'ワーキングホリデーの持ち物を完全網羅。書類・電子機器・衣類・薬・お金のカテゴリ別チェックリスト、現地で買えるもの・日本から持参すべきもの、国別の入国注意点まで実体験ベースでまとめました。',
  path: '/packing',
  keywords: [
    'ワーホリ 持ち物',
    'ワーホリ 持ち物 チェックリスト',
    'ワーホリ 必需品',
    'ワーホリ 持って行くもの',
    'ワーホリ オーストラリア 持ち物',
    'ワーホリ カナダ 持ち物',
    'ワーホリ 現地調達',
  ],
});

type ChecklistCategory = {
  emoji: string;
  title: string;
  description: string;
  items: { text: string; note?: string; mustHave?: boolean }[];
};

const CHECKLIST: ChecklistCategory[] = [
  {
    emoji: '📄',
    title: '書類・証明書',
    description: '紛失すると現地で困る最重要グループ。原本＋コピー＋クラウド保存の3重バックアップを推奨。',
    items: [
      { text: 'パスポート（残存期間6ヶ月以上）', mustHave: true, note: '帰国時まで有効期間が残っていることが必須' },
      { text: 'ワーホリビザの許可書（プリント＋PDF）', mustHave: true },
      { text: '航空券（往復／片道）の控え', mustHave: true, note: '入国審査で提示を求められる場合あり' },
      { text: '海外旅行保険証券（英文）', mustHave: true },
      { text: '国際運転免許証', note: 'オーストラリア・ニュージーランドなどでは1年間有効' },
      { text: '英文残高証明書', note: '入国審査で財政証明を求められる国向け' },
      { text: '英文の健康診断書・予防接種証明', note: '一部の国・専門学校で必要' },
      { text: '証明写真（複数枚）', note: '現地でのID申請に使用' },
      { text: 'クレジットカードのコピー（紛失時の連絡先含む）', note: 'パスポートとは別の場所に保管' },
    ],
  },
  {
    emoji: '💻',
    title: '電子機器・充電グッズ',
    description: '国により電圧・プラグ形状が異なるため、変換プラグは国別で確認。',
    items: [
      { text: 'スマートフォン本体・充電ケーブル', mustHave: true },
      { text: 'ノートPC・タブレット', note: '仕事探し・遠隔ワーク・語学学習に必須' },
      { text: '変換プラグ（渡航先に合わせる）', mustHave: true, note: 'オセアニア=O型、北米=A型、欧州=C/G型' },
      { text: '変圧器', note: '100V専用機器を持参する場合のみ。多くのスマホ・PC充電器は不要' },
      { text: 'モバイルバッテリー（10000mAh前後）', note: '機内持ち込みのみ可、預け荷物NG' },
      { text: 'SIMフリースマホ／eSIM対応端末', mustHave: true, note: '現地SIMで通信費を大幅節約' },
      { text: 'イヤホン・ヘッドフォン', note: '機内・シェアハウスでの必須アイテム' },
      { text: 'ポータブルWi-Fiルーター（オプション）', note: '渡航直後のみレンタル利用が一般的' },
    ],
  },
  {
    emoji: '👕',
    title: '衣類・身の回り品',
    description: '荷物のかさを左右する最大カテゴリ。「現地で買えないもの」優先で厳選するのが鉄則。',
    items: [
      { text: '季節に合わせた服（到着季節基準）', mustHave: true, note: '南半球は日本と季節が逆' },
      { text: '羽織もの・薄手の上着', note: '機内・冷房対策' },
      { text: '下着・靴下（1〜2週間分）', mustHave: true, note: '現地で買えるが日本サイズが安心' },
      { text: 'スーツ・ワンピース（1着）', note: '面接・フォーマルな場面に備えて' },
      { text: 'スニーカー・サンダル', mustHave: true },
      { text: '雨具（折りたたみ傘・レインコート）' },
      { text: 'タオル（速乾性のもの）', note: '初期滞在用に1〜2枚' },
      { text: 'パジャマ・ルームウェア' },
    ],
  },
  {
    emoji: '💊',
    title: '薬・衛生用品',
    description: '日本の市販薬は現地で入手困難。慣れた薬を必要分持参するのが安全。',
    items: [
      { text: '常備薬（解熱鎮痛剤・胃腸薬・風邪薬）', mustHave: true },
      { text: '処方薬（英文の処方箋とセットで）', note: '量によっては税関申告が必要' },
      { text: '絆創膏・消毒液' },
      { text: '生理用品（最初の1ヶ月分）', note: '海外品が合わない場合に備えて' },
      { text: 'マスク（数枚）', note: '機内・初期滞在用' },
      { text: '日焼け止め（高SPF）', mustHave: true, note: 'オセアニアは紫外線が日本の数倍' },
      { text: '虫除けスプレー（オセアニア・東南アジア）' },
      { text: 'コンタクトレンズ（予備＋洗浄液）' },
    ],
  },
  {
    emoji: '💳',
    title: 'お金・カード',
    description: '現金・クレジット・デビットの3パターンを使い分けるのが安全。',
    items: [
      { text: '現地通貨（最低1週間分）', mustHave: true, note: '現地ATMが使えない場合の保険' },
      { text: '日本円（緊急帰国用に2〜3万円）' },
      { text: 'クレジットカード（VISA／Mastercard 2枚以上）', mustHave: true, note: '異なるブランドで2枚持つと安心' },
      { text: 'デビットカード（海外ATM対応）', mustHave: true, note: 'Wise・Revolut等は手数料が圧倒的に安い' },
      { text: 'パスポートのコピー（カード紛失時の本人確認用）' },
      { text: '緊急連絡先メモ（大使館・カード会社）' },
    ],
  },
];

const LOCAL_BUY_GUIDE = [
  {
    title: '日本から必ず持参するべきもの',
    description: '現地での入手が困難・割高・品質が劣るもの。',
    items: [
      '日本語の医薬品（市販薬・処方薬）',
      '日本サイズの下着・靴下',
      '使い慣れた化粧品（特に日本人の肌に合うもの）',
      '日本語の本・電子書籍リーダー',
      '日本食調味料（特に味噌・醤油の小瓶）',
      '日本のお土産（ホストファミリー・職場用）',
    ],
  },
  {
    title: '現地スーパー・100円ショップで安く買えるもの',
    description: '荷物を減らすために、現地調達を優先したい消耗品。',
    items: [
      'シャンプー・リンス・ボディソープ',
      '歯ブラシ・歯磨き粉',
      '洗濯洗剤・柔軟剤',
      'タオル類（追加分）',
      '食器・調理器具',
      'ハンガー・収納ケース',
      '文房具（ノート・ペン）',
    ],
  },
  {
    title: '国別の入手難易度メモ',
    description: '主要ワーホリ国別の現地調達難易度（執筆時点）。',
    items: [
      'オーストラリア：日本食材は中華系スーパーで入手可。アジア系コスメは限定的',
      'カナダ：トロント・バンクーバーは日系スーパーあり。地方は持参推奨',
      'ニュージーランド：人口少なく日本製品の選択肢狭い。常備薬は多めに',
      'アイルランド：日本食材は高価。お米・調味料は持参が経済的',
      'マルタ：日系コミュニティ小規模。日本食材ほぼ入手不可',
      'フィリピン：日系スーパーあるが郊外校では入手困難',
    ],
  },
];

const FAQS = [
  {
    question: 'ワーホリの荷物はスーツケース何個持っていけますか？',
    answer:
      '航空会社の規定により異なりますが、エコノミークラスでは預け荷物1個（23kg以内）＋機内持ち込み1個（7〜10kg）が一般的です。長期滞在の場合は別便で郵送する手も。重量超過は1kgあたり3,000〜5,000円かかるため事前確認が必須です。',
  },
  {
    question: '日本食や調味料は持参した方がいいですか？',
    answer:
      '基本的には現地で入手可能ですが、価格は日本の2〜3倍。お米・味噌・醤油・出汁系の小瓶を1〜2本持参すると、最初の1ヶ月の食事ストレスを大きく減らせます。液体物は預け荷物に入れて漏れ対策を。',
  },
  {
    question: '変圧器や変換プラグは必要ですか？',
    answer:
      '現代のスマートフォン・PC充電器のほとんどは「100-240V」対応のため変圧器は不要です。変換プラグ（コンセント形状の変換）のみ国別に必要。オーストラリア=O型、北米=A型、欧州=C/G型、イギリス=BF型を渡航国に合わせて準備しましょう。',
  },
  {
    question: 'クレジットカードは何枚持参すべきですか？',
    answer:
      '最低2枚（異なるブランド／異なる発行会社）を推奨します。万一1枚が紛失・盗難・不正利用された際のバックアップになります。加えてWise・Revolutなどの海外ATM手数料が安いデビットカードを1枚持つと、現地通貨の引き出しコストを最小化できます。',
  },
  {
    question: '保険証書はコピーで大丈夫ですか？',
    answer:
      'コピーでも問題ありませんが、英文の保険証書（原本またはPDF）を必ず持参してください。現地での通院・入院時に提示を求められます。スマホとクラウドの2箇所に保存し、紙の控えも別バッグに分けて保管すると安心です。',
  },
];

export default function PackingPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ持ち物チェックリスト', url: '/packing' },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />
      <JsonLd
        data={generateItemListJsonLd({
          name: 'ワーホリ持ち物チェックリスト',
          items: CHECKLIST.map((c) => ({ name: c.title, url: `/packing#${encodeURIComponent(c.title)}` })),
        })}
      />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ持ち物チェックリスト' }]} />

        <article className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            忘れると困る持ち物40点｜国別チェックリスト【2026年版】
          </h1>
          <ArticleMetaBadge
            readingMinutes={7}
            updatedAt="2026年5月"
            targetAudience="出発前の準備中の方"
          />
          <p className="text-gray-700 leading-relaxed text-base">
            「ワーホリって、結局何を持っていけばいいの？」
            <br />
            出発が近づくと一番焦るのが荷造りです。忘れて困る物・現地で買えない物・逆に持って行きすぎな物——カテゴリ別のチェックリストで、必要な物だけを効率よく揃えましょう。
          </p>
        </header>

        <KeyTakeaway
          items={[
            '5カテゴリ（書類・電子機器・衣類・薬・お金）の必須チェックリスト',
            '「日本でしか手に入らないもの」と「現地で買えるもの」の仕分け',
            'オーストラリア・カナダなど主要国の入手難易度メモ',
          ]}
        />

        <InPageTOC
          headings={[
            ...CHECKLIST.map((c) => ({ id: c.title, label: `${c.emoji} ${c.title}` })),
            { id: 'local-buy', label: '現地で買える・持参すべきものの仕分け' },
            { id: 'faq', label: 'よくある質問' },
          ]}
        />

        {/* チェックリスト本体 */}
        <section className="mb-12 space-y-8">
          {CHECKLIST.map((cat) => (
            <div
              key={cat.title}
              id={cat.title}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span aria-hidden="true">{cat.emoji}</span>
                {cat.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{cat.description}</p>
              <ul className="space-y-2">
                {cat.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 bg-gray-50 rounded-lg px-3 py-2.5"
                  >
                    <span className="mt-0.5 inline-block w-4 h-4 border-2 border-gray-300 rounded shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{item.text}</span>
                        {item.mustHave && (
                          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            必須
                          </span>
                        )}
                      </div>
                      {item.note && (
                        <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* 中段CTA */}
        <MidCTA
          title="持ち物の前に「行く国」が決まっていない方へ"
          description="国によって持ち物の優先順位が変わります。5問の診断で、自分に合うワーホリ国を1分で見つけられます。"
          primaryHref="/matching"
          primaryLabel="国診断をはじめる"
          secondaryHref="/compare/countries"
          secondaryLabel="国を比較する"
        />

        {/* 現地調達ガイド */}
        <section id="local-buy" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">現地で買えるもの・日本から持参すべきもの</h2>
          <p className="text-sm text-gray-600 mb-6">
            荷物を最小化するために、現地調達できるものは現地で買うのが鉄則です。逆に「日本でしか手に入らないもの」「現地だと割高になるもの」は出発前に揃えておきましょう。
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {LOCAL_BUY_GUIDE.map((guide) => (
              <div key={guide.title} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold mb-2">{guide.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{guide.description}</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {guide.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 inline-block w-1.5 h-1.5 bg-primary-400 rounded-full shrink-0" aria-hidden="true" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">ワーホリ持ち物に関するよくある質問</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 内部リンク */}
        <section className="mb-8 bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">合わせて読みたい</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <li>
              <Link href="/guide/departure-prep" className="text-primary-600 hover:underline">
                → 出発準備フェーズの完全ガイド
              </Link>
            </li>
            <li>
              <Link href="/guide/visa-cost" className="text-primary-600 hover:underline">
                → ビザ申請と費用準備のフェーズ
              </Link>
            </li>
            <li>
              <Link href="/budget" className="text-primary-600 hover:underline">
                → ワーホリ費用 比較ガイド
              </Link>
            </li>
            <li>
              <Link href="/compare/countries" className="text-primary-600 hover:underline">
                → ワーホリ国 比較ランキング
              </Link>
            </li>
            <li>
              <Link href="/countries" className="text-primary-600 hover:underline">
                → 53カ国の詳細情報を見る
              </Link>
            </li>
            <li>
              <Link href="/experiences" className="text-primary-600 hover:underline">
                → 実渡航者の体験談を読む
              </Link>
            </li>
          </ul>
        </section>
        </article>
      </div>
    </>
  );
}
