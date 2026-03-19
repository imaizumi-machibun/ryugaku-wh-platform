import type { Metadata } from 'next';
import Script from 'next/script';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StickyMobileCTA from '@/components/layout/StickyMobileCTA';
import { SITE_NAME, SITE_URL } from '@/lib/utils/constants';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - 留学・ワーキングホリデー体験談・学校口コミ`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    '留学・ワーキングホリデーの体験談や学校口コミを集約。国・語学・費用から留学先や学校を比較検索できるデータベースサイト。',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: SITE_NAME,
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VHFZBP0192"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VHFZBP0192');
          `}
        </Script>
      </head>
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
        <Footer />
        <StickyMobileCTA />
      </body>
    </html>
  );
}
