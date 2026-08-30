import type { Metadata } from 'next';

import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StickyMobileCTA from '@/components/layout/StickyMobileCTA';
import SiteChrome from '@/components/layout/SiteChrome';
import { SITE_NAME, SITE_URL } from '@/lib/utils/constants';

// 全体を Noto Sans JP に統一。可変フォントなので 100〜900 の全ウェイトが使える
// （見出しは 900/700、本文は 400、補助は 300/500 で「振り幅」を作る）
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

// 本番デプロイ時のみ計測（ローカル開発・プレビューのアクセスは計測データに混ぜない）。
// 環境変数が設定されていればそちらを優先し、未設定でも本番では既定の測定IDを使う。
const GA_ID =
  process.env.NEXT_PUBLIC_GA_ID ||
  (process.env.VERCEL_ENV === 'production' ? 'G-VHFZBP0192' : undefined);
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - 留学・ワーキングホリデー体験談・学校口コミ`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    '留学・ワーキングホリデーの体験談や学校口コミを集約。国・語学・費用から留学先や学校を比較検索できるデータベースサイト。',
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: `${SITE_NAME} 新着記事` }],
    },
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  ...(GSC_VERIFICATION && {
    verification: {
      google: GSC_VERIFICATION,
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <SiteChrome
          header={<Header />}
          footer={<Footer />}
          sticky={<StickyMobileCTA />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
