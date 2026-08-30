'use client';

import { usePathname } from 'next/navigation';

type Props = {
  header: React.ReactNode;
  footer: React.ReactNode;
  sticky: React.ReactNode;
  children: React.ReactNode;
};

/**
 * 通常ページではヘッダー・フッター・スマホCTAを表示し、
 * 埋め込み用ルート（/embed 配下）ではそれらを出さず本文のみ表示する。
 * header/footer/sticky は layout（Server）側で render したものを
 * JSX として受け取るため、クライアント境界の問題は起きない。
 */
export default function SiteChrome({ header, footer, sticky, children }: Props) {
  const pathname = usePathname();
  const bare = pathname?.startsWith('/embed');

  if (bare) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
      {footer}
      {sticky}
    </>
  );
}
