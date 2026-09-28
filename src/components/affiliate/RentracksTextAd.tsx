'use client';

import { useAffiliateMeasurement } from '@/components/affiliate/useAffiliateMeasurement';

// Rentracksで2026-09-28に取得。Study Work Hub専用のHTTPS素材を無改変で表示。
const HTML = '<img src="https://www.rentracks.jp/adx/p.gifx?idx=0.75558.388535.8756.12408&dna=145985" border="0" height="1" width="1"><a href="https://www.rentracks.jp/adx/r.html?idx=0.75558.388535.8756.12408&dna=145985" rel="nofollow noopener" target="_blank">【留学情報館】</a>';

export default function RentracksTextAd() {
  const measurement = useAffiliateMeasurement<HTMLElement>({
    measurementId: process.env.NEXT_PUBLIC_GA_ID || 'G-VHFZBP0192',
    affiliateNetwork: 'rentracks', siteId: '025', programId: '12408',
    placementId: 'services:study-counseling:card', materialType: 'text',
  });
  return (
    <aside ref={measurement.elementRef} onClickCapture={measurement.onClickCapture}
      aria-label="留学情報館の広告" data-affiliate-network="rentracks"
      data-affiliate-site-id="025" data-affiliate-program-id="12408"
      data-affiliate-placement-id="services:study-counseling:card" data-affiliate-material-type="text"
      className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="mb-2 text-xs font-bold text-gray-500">広告（PR）</p>
      <div className="[&_a]:inline-flex [&_a]:min-h-11 [&_a]:w-full [&_a]:items-center [&_a]:justify-center [&_a]:rounded-xl [&_a]:bg-primary-700 [&_a]:px-5 [&_a]:py-3 [&_a]:text-center [&_a]:text-sm [&_a]:font-bold [&_a]:text-white [&_a]:no-underline hover:[&_a]:bg-primary-800"
        dangerouslySetInnerHTML={{ __html: HTML }} />
    </aside>
  );
}
