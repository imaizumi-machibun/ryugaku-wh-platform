'use client';

import { useAffiliateMeasurement } from '@/components/affiliate/useAffiliateMeasurement';

type Props = {
  html: string;
  programId: string;
  brandName: string;
  placementId: string;
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-VHFZBP0192';

export default function A8TextAd({
  html,
  programId,
  brandName,
  placementId,
}: Props) {
  const affiliateMeasurement = useAffiliateMeasurement<HTMLElement>({
    measurementId: GA_MEASUREMENT_ID,
    siteId: '025',
    programId,
    placementId,
    materialType: 'text',
  });

  return (
    <aside
      ref={affiliateMeasurement.elementRef}
      onClickCapture={affiliateMeasurement.onClickCapture}
      aria-label={`${brandName}の広告`}
      data-affiliate-network="a8net"
      data-affiliate-site-id="025"
      data-affiliate-program-id={programId}
      data-affiliate-placement-id={placementId}
      data-affiliate-material-type="text"
      className="rounded-xl border border-gray-200 bg-white p-4"
    >
      <p className="mb-2 text-xs font-bold text-gray-500">広告（PR）</p>
      <div
        className="[&_a]:inline-flex [&_a]:min-h-11 [&_a]:w-full [&_a]:items-center [&_a]:justify-center [&_a]:rounded-xl [&_a]:bg-primary-700 [&_a]:px-5 [&_a]:py-3 [&_a]:text-center [&_a]:text-sm [&_a]:font-bold [&_a]:text-white [&_a]:no-underline [&_a]:transition-colors hover:[&_a]:bg-primary-800"
        // A8.net生成コードはリンク属性・文言・空白・計測imgを含めて無改変で描画する。
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </aside>
  );
}
