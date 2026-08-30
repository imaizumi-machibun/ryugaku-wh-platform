import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ArticleMetaBadge from '@/components/article/ArticleMetaBadge';
import KeyTakeaway from '@/components/article/KeyTakeaway';
import ShareButtons from '@/components/ui/ShareButtons';
import EmbedCodeBox from '@/components/embed/EmbedCodeBox';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateWebApplicationJsonLd } from '@/lib/seo/jsonld';
import { SITE_URL } from '@/lib/utils/constants';
import MatchingFlow from '@/components/matching/MatchingFlow';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'ワーホリ国 診断｜5問の質問で自分にぴったりの渡航先がわかる【無料】',
  description: '目的・期間・予算・治安・言語の5問に答えるだけで、あなたにぴったりのワーホリ国TOP3を診断。オーストラリア・カナダなど人気9カ国から、相性スコアと理由付きでお知らせします。',
  path: '/matching',
  keywords: [
    'ワーホリ 診断',
    'ワーホリ 国 診断',
    'ワーホリ おすすめ 国',
    'ワーホリ 国 選び方',
    '自分に合った ワーホリ',
    'ワーホリ マッチング',
  ],
});

export default function MatchingPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: 'ワーホリ国 診断', url: '/matching' },
        ])}
      />
      <JsonLd
        data={generateWebApplicationJsonLd({
          name: 'ワーホリ国診断',
          description:
            '5問の質問で、人気9カ国からあなたに合うワーホリ国TOP3を相性スコア付きで提案する無料診断ツール。',
          url: '/matching',
        })}
      />

      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: 'ワーホリ国 診断' }]} />

        <article className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            5問でわかる、あなたにぴったりのワーホリ国
          </h1>
          <ArticleMetaBadge
            readingMinutes={1}
            updatedAt="2026年5月"
            targetAudience="国選びに迷っている方"
          />
          <p className="text-gray-700 leading-relaxed text-base">
            「どの国を選べばいいかわからない」「自分に合う国を直感的に知りたい」
            <br />
            そんな方のために、5問の質問に答えるだけで、人気9カ国の中からマッチスコア付きであなたに合う渡航先を提案する診断ツールを用意しました。所要時間は約1分。
          </p>
        </header>

        <KeyTakeaway
          items={[
            '目的・期間・予算・治安・言語の5問に答えるだけ',
            '人気9カ国の中から、相性スコア付きでTOP3を提案',
            '結果から各国の詳細ページや、比較・体験談に直接アクセス',
          ]}
        />

        <MatchingFlow />

        {/* 補足セクション */}
        <section className="mt-12 mb-8 bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">この診断について</h2>
          <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
            <li>診断は9カ国（オーストラリア・カナダ・ニュージーランド・アイルランド・イギリス・マルタ・フィリピン・台湾・韓国）の特性プロファイルに基づいています</li>
            <li>各国の特性は公式機関の発表・現地大使館情報・実渡航者の体験談をもとに編集部で評価</li>
            <li>診断結果は参考目的のため、最終判断は各国詳細ページの情報・複数の体験談・最新ビザ情報を必ずご確認ください</li>
            <li>診断データはサーバーに送信されません（ブラウザ内で完結）</li>
          </ul>
        </section>

        {/* シェア & 紹介（被リンク導線） */}
        <section className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4 bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700">この診断が役に立ったらシェア</p>
            <ShareButtons url="/matching" title="5問でわかる、あなたにぴったりのワーホリ国診断" />
          </div>
          <EmbedCodeBox
            embedPath="/embed/matching"
            canonicalPath="/matching"
            title="ワーホリ国診断"
            siteUrl={SITE_URL}
            height={640}
          />
        </section>

        <section className="mb-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">診断後におすすめのコンテンツ</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <li>
              <Link href="/compare/countries" className="text-primary-600 hover:underline">
                → ワーホリ国 比較ランキング（人気9カ国）
              </Link>
            </li>
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
              <Link href="/regret" className="text-primary-600 hover:underline">
                → ワーホリで後悔しないための7つの教訓
              </Link>
            </li>
            <li>
              <Link href="/women" className="text-primary-600 hover:underline">
                → 女性一人ワーホリ完全ガイド
              </Link>
            </li>
            <li>
              <Link href="/no-english" className="text-primary-600 hover:underline">
                → 英語話せなくてもワーホリできる？
              </Link>
            </li>
            <li>
              <Link href="/age/20s-late" className="text-primary-600 hover:underline">
                → 社会人ワーホリ完全ガイド（20代後半）
              </Link>
            </li>
            <li>
              <Link href="/30s-guide" className="text-primary-600 hover:underline">
                → 30代ワーホリ完全ガイド
              </Link>
            </li>
            <li>
              <Link href="/after-wh" className="text-primary-600 hover:underline">
                → 帰国後の就活ガイド
              </Link>
            </li>
            <li>
              <Link href="/experiences" className="text-primary-600 hover:underline">
                → 全77件の体験談を読む
              </Link>
            </li>
          </ul>
        </section>
        </article>
      </div>
    </>
  );
}
