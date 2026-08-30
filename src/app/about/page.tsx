import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, generateOrganizationJsonLd } from '@/lib/seo/jsonld';

const PATH = '/about';
const CONTACT_EMAIL = 'yuki.imaizumi@machibun.co.jp';

export const metadata: Metadata = generatePageMetadata({
  title: '運営者情報｜Study Work Hub（株式会社街中文学）について',
  description:
    'Study Work Hub（運営: 株式会社街中文学）の運営者情報・編集方針・情報源についてご説明します。各国政府・大使館の一次情報と、渡航経験者へのアンケートをもとに、留学・ワーキングホリデー情報を提供しています。取材・データ提供のご依頼も承ります。',
  path: PATH,
  keywords: [
    'Study Work Hub 運営',
    '留学情報サイト 運営者',
    'ワーホリ 情報 信頼性',
    '株式会社街中文学',
  ],
});

const PRINCIPLES = [
  {
    title: '一次情報を起点にする',
    detail:
      '各国の政府・移民局・大使館・観光局など、公式の発表を一次情報として確認し、ビザ要件や費用の数字はできるだけ公的な出典に当たって記載します。',
  },
  {
    title: '体験は「実際の渡航者」から集める',
    detail:
      '体験談・口コミは、実際に留学・ワーホリを経験した方へのアンケートをもとに掲載しています。編集部が内容を確認・校正したうえで、統計集計にも利用しています。',
  },
  {
    title: '推測で断定しない',
    detail:
      '事実（公式情報）と、個人の体験・感想を明確に分けて記載します。サンプル数が少ないデータは件数（n）を必ず添え、過度な一般化を避けます。',
  },
  {
    title: '特定エージェントへ誘導しない',
    detail:
      '中立的な情報源であることを大切にしています。特定の留学エージェントへの送客を目的とした順位付けや、強引な勧誘は行いません。',
  },
];

const SOURCES = [
  '各国政府・移民局・大使館・観光局などの公式情報（ビザ要件・年齢条件・滞在期間など）',
  '53カ国の国別データ（費用・気候・治安・最低賃金など）',
  '945校の語学学校データ（コース・費用・所在地など）',
  '渡航経験者へのアンケートにもとづく体験談・口コミ',
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={generateOrganizationJsonLd()} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '運営者情報', url: PATH },
        ])}
      />

      <div className="container-custom py-8 max-w-3xl">
        <Breadcrumb items={[{ label: '運営者情報' }]} />

        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">運営者情報</h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Study Work Hub は、留学・ワーキングホリデーを検討する方が、信頼できる一次情報とリアルな体験談をもとに意思決定できることを目指す情報メディアです。
            このページでは、運営者・編集方針・情報源についてご説明します。
          </p>
        </header>

        {/* 運営会社 */}
        <section className="bg-primary-50 border border-primary-100 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-lg text-primary-900 mb-3">運営会社</h2>
          <dl className="text-sm text-gray-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <dt className="font-semibold sm:w-32 shrink-0">運営会社</dt>
              <dd>
                <a
                  href="https://machibun.co.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 hover:underline"
                >
                  株式会社街中文学（公式サイト）
                </a>
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <dt className="font-semibold sm:w-32 shrink-0">サイト名</dt>
              <dd>Study Work Hub（スタディ・ワーク・ハブ）</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <dt className="font-semibold sm:w-32 shrink-0">URL</dt>
              <dd>https://study-work-hub.com</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <dt className="font-semibold sm:w-32 shrink-0">編集</dt>
              <dd>Study Work Hub 編集部（留学・ワーホリ経験者と国内の編集・SEOチーム）</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <dt className="font-semibold sm:w-32 shrink-0">連絡先</dt>
              <dd>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-700 hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        {/* 編集方針 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">私たちが大切にしていること</h2>
          <div className="space-y-4">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-base mb-1 text-gray-900">{p.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 情報源 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">情報源</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            コンテンツは、主に次の情報をもとに作成しています。
          </p>
          <ul className="space-y-2 text-sm">
            {SOURCES.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-800">
                <span className="text-primary-600 font-bold shrink-0 mt-0.5">▸</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 独自調査 */}
        <section className="bg-sky-50 border border-sky-100 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-3 text-sky-900">独自調査・データの公開</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            渡航経験者へのアンケートと体験談をもとに、留学・ワーホリの費用相場や語学力の伸び、満足度などを集計した独自調査を公開しています。
            数値・グラフは、出典の明記とリンクを添えていただければ、報道・教育・研究目的を含め自由にご利用いただけます。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/research"
              className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              ワーホリ・留学実態調査を見る →
            </Link>
            <Link
              href="/survey"
              className="inline-block bg-white text-sky-800 border border-sky-300 font-semibold px-5 py-2.5 rounded-lg hover:bg-sky-100 transition-colors"
            >
              調査の方法について
            </Link>
          </div>
        </section>

        {/* お問い合わせ・取材 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">お問い合わせ・取材・データ提供について</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            留学・ワーホリに関する個別のご相談は、
            <Link href="/contact" className="text-primary-700 hover:underline">
              無料相談・お問い合わせ
            </Link>
            のページから承ります。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            報道機関・教育機関・自治体などからの取材、調査データの提供、専門家コメントのご依頼も歓迎します。
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-700 hover:underline">
              {CONTACT_EMAIL}
            </a>
            までお気軽にご連絡ください。
          </p>
        </section>

        {/* 関連リンク */}
        <section className="text-sm text-gray-500 border-t border-gray-200 pt-6">
          <p className="mb-2">
            個人情報の取り扱いについては{' '}
            <Link href="/privacy" className="text-primary-700 hover:underline">
              プライバシーポリシー
            </Link>{' '}
            をご覧ください。
          </p>
        </section>
      </div>
    </>
  );
}
