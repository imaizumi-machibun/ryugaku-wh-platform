import Link from 'next/link';
import A8TextAd from '@/components/affiliate/A8TextAd';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { AFFILIATE_INTENTS, getProgramsByIntent } from '@/lib/affiliate-programs';
import { generatePageMetadata } from '@/lib/seo/metadata';

const PATH = '/services';

export const metadata = generatePageMetadata({
  title: '留学・語学学習サービスの広告案内',
  description:
    'Study Work Hubに広告掲載中の英会話、海外Wi-Fi、留学サポートを目的別に案内します。掲載順は広告報酬やEPCで決まりません。',
  path: PATH,
});

export default function ServicesPage() {
  return (
    <div className="container-custom py-8 sm:py-12">
      <Breadcrumb
        items={[
          { label: 'ホーム', href: '/' },
          { label: '広告掲載サービス' },
        ]}
      />

      <main className="mx-auto max-w-4xl">
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          <strong>広告（PR）</strong>
          <span className="ml-2">
            本ページにはアフィリエイト広告が含まれます。申込みが成立すると当サイトが報酬を受け取る場合があります。
          </span>
        </div>

        <header className="mb-8">
          <h1 className="mb-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            留学・語学学習サービスの広告案内
          </h1>
          <p className="leading-7 text-gray-700">
            編集記事の比較・評価とは分け、広告掲載中のサービスを利用目的ごとにまとめています。カテゴリ内はプログラムID順で、成果報酬額やEPCは掲載順に使っていません。料金・対象者・提供条件は、申込前に各広告主ページで最新情報をご確認ください。
          </p>
        </header>

        <nav aria-label="サービスカテゴリ" className="mb-10 flex flex-wrap gap-2">
          {AFFILIATE_INTENTS.map((intent) => (
            <Link
              key={intent.id}
              href={`#${intent.id}`}
              className="rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800 hover:bg-primary-100"
            >
              {intent.title}
            </Link>
          ))}
        </nav>

        <div className="space-y-12">
          {AFFILIATE_INTENTS.map((intent) => {
            const programs = getProgramsByIntent(intent.id);
            return (
              <section key={intent.id} id={intent.id} className="scroll-mt-24">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">{intent.title}</h2>
                <p className="mb-5 text-sm leading-6 text-gray-600">{intent.description}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {programs.map((program) => (
                    <article
                      key={program.programId}
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <h3 className="mb-3 text-lg font-bold text-gray-900">
                        {program.brandName}
                      </h3>
                      <A8TextAd
                        html={program.textHtml}
                        programId={program.programId}
                        brandName={program.brandName}
                        placementId={`services:${intent.id}:card`}
                      />
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm leading-6 text-gray-700">
          広告の表示文言は広告主が提供した素材です。当サイトがサービスの効果や成果を保証するものではありません。契約期間、解約・返金条件、対応国、受取方法などをご自身で確認してからお申し込みください。
        </div>
      </main>
    </div>
  );
}
