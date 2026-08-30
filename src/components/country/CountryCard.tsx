import Link from 'next/link';
import Image from 'next/image';
import type { Country } from '@/lib/microcms/types';
import type { WageUnit } from '@/lib/countries/wage-filter';
import Badge from '@/components/ui/Badge';
import { PROGRAM_STATUSES, COST_LEVELS } from '@/lib/utils/constants';
import { getPurposeGuideDefinition } from '@/lib/country-purpose/registry';

type Props = {
  country: Country;
  activeWageUnit?: WageUnit;
};

function formatWageEstimate(country: Country, unit?: WageUnit) {
  if (unit === 'hourly' && typeof country.minimumWageHourlyJpy === 'number') {
    return `最低時給目安 約${country.minimumWageHourlyJpy.toLocaleString('ja-JP')}円`;
  }

  if (unit === 'monthly' && typeof country.minWageMonthlyJpy === 'number') {
    const amountInTenThousands = country.minWageMonthlyJpy / 10_000;
    const formattedAmount = amountInTenThousands.toLocaleString('ja-JP', {
      maximumFractionDigits: 1,
    });
    return `最低月給目安 約${formattedAmount}万円`;
  }

  return null;
}

export default function CountryCard({ country, activeWageUnit }: Props) {
  const status = PROGRAM_STATUSES.find((s) => s.value === country.programStatus);
  const costLabel = COST_LEVELS.find((c) => c.value === country.costLevel)?.label;
  const wageEstimate = formatWageEstimate(country, activeWageUnit);
  const purposeQuickLink = getPurposeGuideDefinition(country.id, 'working-holiday')
    ? { href: `/countries/${country.id}/working-holiday`, label: 'ワーホリ完全ガイド' }
    : getPurposeGuideDefinition(country.id, 'study-abroad')
      ? { href: `/countries/${country.id}/study-abroad`, label: '留学完全ガイド' }
      : null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-soft-lg">
      <Link href={`/countries/${country.id}`} className="block">
        {country.heroImage ? (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={country.heroImage.url}
              alt={country.nameJp}
              fill
              className="object-cover transition-transform duration-[600ms] ease-smooth group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <div className="mb-1 flex items-center gap-2">
                {country.flagEmoji && <span className="text-2xl">{country.flagEmoji}</span>}
                <h3 className="text-lg font-bold drop-shadow-sm">{country.nameJp}</h3>
              </div>
              <p className="text-sm text-white/80">{country.region}</p>
            </div>
          </div>
        ) : (
          // アイキャッチ画像がない国は、色面グラデ＋国旗で「カードの顔」を作る
          <div className="relative flex h-32 w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50">
            {country.flagEmoji && <span className="mb-1 text-4xl">{country.flagEmoji}</span>}
            <h3 className="text-lg font-bold text-gray-900">{country.nameJp}</h3>
            <p className="text-xs text-gray-500">{country.region}</p>
          </div>
        )}
        <div className="bg-white px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {status && (
              <Badge variant={status.value === 'open' ? 'success' : status.value === 'closed' ? 'default' : 'warning'}>
                {status.label}
              </Badge>
            )}
            {costLabel && <Badge>{costLabel}</Badge>}
          </div>
          {wageEstimate && (
            <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
              {wageEstimate}
            </p>
          )}
        </div>
      </Link>
      <div className="flex items-center gap-3 border-t border-gray-100 bg-white px-4 py-2 text-xs">
        <Link
          href={`/countries/${country.id}/cost`}
          className="font-medium text-primary-700 hover:underline"
        >
          費用ガイド
        </Link>
        {purposeQuickLink && (
          <>
            <span aria-hidden className="text-gray-300">|</span>
            <Link href={purposeQuickLink.href} className="font-medium text-primary-700 hover:underline">
              {purposeQuickLink.label}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
