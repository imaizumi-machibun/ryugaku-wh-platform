import { getCountries } from '@/lib/microcms/countries';
import CompareSelector from '@/components/compare/CompareSelector';

export const revalidate = 3600;

export default async function ComparePage() {
  const data = await getCountries({
    limit: 100,
    fields: [
      'id',
      'nameJp',
      'nameEn',
      'flagEmoji',
      'region',
      'programStatus',
      'costLevel',
      'capital',
      'officialLanguage',
      'currency',
      'timeDifferenceJapan',
      'flightTimeHours',
      'visaAgeMin',
      'visaAgeMax',
      'visaDurationMonths',
      'visaCostJpy',
      'livingCostMonthJpy',
      'avgRentMonthlyJpy',
      'minimumWageLocal',
    ],
  });

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-2">国を比較する</h1>
      <p className="text-gray-600 mb-8">
        最大3カ国まで選んでビザ・費用・条件を比較できます
      </p>

      <CompareSelector countries={data.contents} />
    </div>
  );
}
