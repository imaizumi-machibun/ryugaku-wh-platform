import Link from 'next/link';
import Image from 'next/image';
import type { Country } from '@/lib/microcms/types';
import Badge from '@/components/ui/Badge';
import { PROGRAM_STATUSES, COST_LEVELS } from '@/lib/utils/constants';

type Props = { country: Country };

export default function CountryCard({ country }: Props) {
  const status = PROGRAM_STATUSES.find((s) => s.value === country.programStatus);
  const costLabel = COST_LEVELS.find((c) => c.value === country.costLevel)?.label;

  return (
    <Link href={`/countries/${country.id}`}>
      <div className="group relative rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200">
        {country.heroImage ? (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={country.heroImage.url}
              alt={country.nameJp}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                {country.flagEmoji && <span className="text-2xl">{country.flagEmoji}</span>}
                <h3 className="font-bold text-lg drop-shadow-sm">{country.nameJp}</h3>
              </div>
              <p className="text-sm text-white/80">{country.region}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white">
            <div className="flex items-center gap-2 mb-2">
              {country.flagEmoji && <span className="text-2xl">{country.flagEmoji}</span>}
              <h3 className="font-bold text-lg">{country.nameJp}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">{country.region}</p>
          </div>
        )}
        <div className="bg-white px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {status && (
              <Badge variant={status.value === 'open' ? 'success' : status.value === 'closed' ? 'danger' : 'warning'}>
                {status.label}
              </Badge>
            )}
            {costLabel && <Badge>{costLabel}</Badge>}
          </div>
        </div>
      </div>
    </Link>
  );
}
