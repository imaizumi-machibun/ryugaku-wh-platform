import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';

const PATH = '/contact';
const CONTACT_EMAIL = 'yuki.imaizumi@machibun.co.jp';

export const metadata: Metadata = generatePageMetadata({
  title: '無料相談・お問い合わせ｜留学・ワーホリの個別シミュレーション',
  description:
    '留学・ワーキングホリデーの予算プラン、進路選択、学校選び、ビザ手続きについて、無料で個別相談を承ります。経験豊富な編集部スタッフが、希望条件に合わせた現実的なプランをご提案します。',
  path: PATH,
  keywords: [
    '留学 相談 無料',
    'ワーホリ 相談 無料',
    '留学エージェント 比較',
    'MBA 留学 相談',
    '大学院留学 相談',
    '正規留学 相談',
  ],
});

const FAQS = [
  {
    question: '相談は本当に無料ですか？',
    answer:
      'はい、初回相談は完全無料です。Study Work Hub編集部が運営する一次情報ベースのサポートで、特定エージェントへの送客や強引な勧誘は行いません。',
  },
  {
    question: 'どんな相談ができますか？',
    answer:
      '予算プランの個別シミュレーション、進路選択（語学留学・専門・大学・大学院・MBA）、奨学金・教育ローン、国・都市選び、ビザ要件、出願準備、現地生活など、留学・ワーホリ全般のご相談に対応します。',
  },
  {
    question: '相談の返答までどのくらいかかりますか？',
    answer:
      '通常2営業日以内にメールでお返事します。込み入った内容や繁忙期は5営業日いただく場合があります。',
  },
  {
    question: '電話やビデオ通話での相談はできますか？',
    answer:
      'メール相談で詳細を伺った後、必要に応じてZoom等でのビデオ相談を設定します（無料・要事前予約）。',
  },
];

export default function ContactPage() {
  const subject = encodeURIComponent('【Study Work Hub】留学・ワーホリ相談');
  const body = encodeURIComponent(
    [
      '▼お名前',
      '',
      '',
      '▼ご連絡先メールアドレス（編集部からの返信先）',
      '',
      '',
      '▼ご連絡先電話番号（任意）',
      '',
      '',
      '──────────────',
      '',
      '▼ご相談内容',
      '',
      '',
      '▼希望の渡航時期（例：2027年4月）',
      '',
      '▼検討している国（複数可）',
      '',
      '▼想定予算（万円）',
      '',
      '▼期間（例：1年）',
      '',
      '▼目的（語学／ワーホリ／専門／大学／大学院／MBA など）',
      '',
      '▼ご年齢・職業（任意）',
      '',
      '',
    ].join('\n')
  );
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '無料相談・お問い合わせ', url: PATH },
        ])}
      />
      <JsonLd data={generateFAQJsonLd(FAQS)} />

      <div className="container-custom py-8 max-w-3xl">
        <Breadcrumb items={[{ label: '無料相談・お問い合わせ' }]} />

        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">無料相談・お問い合わせ</h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            留学・ワーキングホリデーの個別シミュレーションを無料で承ります。Study Work Hub編集部が、希望条件・予算・時期に合わせた現実的なプランをご提案します。
          </p>
        </header>

        <section className="bg-primary-50 border border-primary-100 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-lg text-primary-900 mb-3">メールで相談する</h2>
          <p className="text-sm text-primary-800 mb-4 leading-relaxed">
            下のボタンを押すと、お名前・連絡先・ご相談内容のテンプレ入りメールが開きます。必要な項目を埋めて送信してください。通常2営業日以内に編集部からお返事します。
          </p>
          <a
            href={mailto}
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            メールで相談する
          </a>
          <p className="text-xs text-primary-700 mt-3">
            メーラーが起動しない環境の方は、下の「国・進路を診断する」もしくはページ下部の連絡先からご相談ください。
          </p>
        </section>

        <section className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-lg text-amber-900 mb-3">まずは診断ツールで自己分析</h2>
          <p className="text-sm text-amber-800 mb-4 leading-relaxed">
            「何から相談していいかわからない」「とりあえず自分に合う国を知りたい」という方は、6問の診断ツールが便利です。
          </p>
          <Link
            href="/matching"
            className="inline-block bg-white text-amber-800 border border-amber-300 font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-100"
          >
            国・進路を診断する →
          </Link>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">こんな相談に対応しています</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              '予算別の現実的なプラン作成（30万円〜500万円超）',
              'MBA・大学院・正規留学の出願戦略',
              '奨学金・教育ローンの併用設計',
              'ビザ要件・必要書類の事前確認',
              '国・都市選びと学校選定',
              'ワーホリの就労収入見込み',
              '社会人留学のキャリアブランク対策',
              '帰国後のキャリア相談',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-800">
                <span className="text-primary-600 font-bold shrink-0 mt-0.5">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">よくある質問</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group border border-gray-200 rounded-lg overflow-hidden"
              >
                <summary className="cursor-pointer list-none px-4 py-3 bg-white hover:bg-gray-50 flex items-start gap-3">
                  <span className="text-primary-600 font-bold shrink-0 mt-0.5">Q.</span>
                  <span className="font-semibold text-sm text-gray-900 flex-1">{faq.question}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">
                    ▼
                  </span>
                </summary>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-800 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="text-xs text-gray-500 border-t border-gray-200 pt-6">
          <p className="mb-2">運営: 株式会社街中文学 / Study Work Hub編集部</p>
          <p className="mb-2">
            メーラーが起動しない環境の方は、お手数ですが下記までメールでお問い合わせください。
            <br />
            連絡先: <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-700 hover:underline">{CONTACT_EMAIL}</a>
          </p>
          <p>個人情報の取り扱いについては <Link href="/privacy" className="text-primary-700 hover:underline">プライバシーポリシー</Link> をご覧ください。</p>
        </section>
      </div>
    </>
  );
}
