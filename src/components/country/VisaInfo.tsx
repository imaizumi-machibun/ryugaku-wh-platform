import type { Country } from '@/lib/microcms/types';
import Badge from '@/components/ui/Badge';
import { PROGRAM_STATUSES } from '@/lib/utils/constants';
import { formatJPY, formatDuration } from '@/lib/utils/format';

type Props = { country: Country };

export default function VisaInfo({ country }: Props) {
  const status = PROGRAM_STATUSES.find((s) => s.value === country.programStatus);

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">ビザ情報</h2>
        {status && <Badge variant={status.value === 'open' ? 'success' : 'warning'}>{status.label}</Badge>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3 text-sm text-gray-500">ビザ概要</h3>
          <dl className="space-y-2">
            {country.visaAgeMin != null && country.visaAgeMax != null && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">年齢制限</dt>
                <dd className="font-medium">{country.visaAgeMin}〜{country.visaAgeMax}歳</dd>
              </div>
            )}
            {country.visaDurationMonths && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">滞在期間</dt>
                <dd className="font-medium">{formatDuration(country.visaDurationMonths)}</dd>
              </div>
            )}
            {country.visaCostJpy != null && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">ビザ費用</dt>
                <dd className="font-medium">{formatJPY(country.visaCostJpy)}</dd>
              </div>
            )}
            {country.visaRenewable != null && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">延長可能</dt>
                <dd className="font-medium">{country.visaRenewable ? 'はい' : 'いいえ'}</dd>
              </div>
            )}
            {country.visaQuota && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">年間定員</dt>
                <dd className="font-medium">{country.visaQuota}</dd>
              </div>
            )}
          </dl>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-sm text-gray-500">就労・就学制限</h3>
          <dl className="space-y-2">
            {country.visaWorkLimit && (
              <div className="py-2 border-b border-gray-100">
                <dt className="text-gray-600 mb-1">就労制限</dt>
                <dd className="text-sm">{country.visaWorkLimit}</dd>
              </div>
            )}
            {country.visaStudyLimit && (
              <div className="py-2 border-b border-gray-100">
                <dt className="text-gray-600 mb-1">就学制限</dt>
                <dd className="text-sm">{country.visaStudyLimit}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      {country.applicationSteps && country.applicationSteps.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">申請手順</h3>
          <ol className="space-y-3">
            {country.applicationSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <div>
                  <p className="font-medium">{step.stepTitle}</p>
                  {step.stepDescription && <p className="text-sm text-gray-600 mt-1">{step.stepDescription}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
      {country.requiredDocuments && country.requiredDocuments.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">必要書類</h3>
          <ul className="space-y-2">
            {country.requiredDocuments.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary-600 mt-0.5">&#10003;</span>
                <div>
                  <span className="font-medium">{doc.docName}</span>
                  {doc.docNote && <span className="text-gray-500 ml-2">({doc.docNote})</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        {country.applicationUrl && (
          <a href={country.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
            公式申請ページ →
          </a>
        )}
        {country.embassyUrl && (
          <a href={country.embassyUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
            大使館ページ →
          </a>
        )}
      </div>
    </section>
  );
}
