import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExperienceBySlug, getExperienceSlugs, getExperiencesByCountry } from '@/lib/microcms/experiences';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CostBreakdown from '@/components/experience/CostBreakdown';
import RadarChart from '@/components/country/RadarChart';
import JsonLd from '@/components/seo/JsonLd';
import { generateExperienceMetadata } from '@/lib/seo/metadata';
import { generateExperienceJsonLd, generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { buildExperienceRelatedSections } from '@/lib/seo/relations';
import { formatDuration, formatDate } from '@/lib/utils/format';
import { LANGUAGE_LEVELS, GENDERS } from '@/lib/utils/constants';
import ShareButtons from '@/components/ui/ShareButtons';
import {
  getPurposePath,
  PURPOSE_LABELS,
  STUDY_TYPE_LABELS,
} from '@/lib/experiences/classification';
import { buildExperienceBreadcrumb, toVisibleBreadcrumbItems } from '@/lib/seo/breadcrumbs';
import { extractFaqFromArticleBody } from '@/lib/utils/article-faq';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getExperienceSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const exp = await getExperienceBySlug(params.slug);
    return generateExperienceMetadata(exp, `/experiences/${params.slug}`);
  } catch {
    return {};
  }
}

export default async function ExperienceDetailPage({ params }: Props) {
  let experience;
  try {
    experience = await getExperienceBySlug(params.slug);
  } catch {
    notFound();
  }

  // 関連体験談を取得
  const sameCountryData = experience.country?.id
    ? await getExperiencesByCountry(experience.country.id, 8).catch(() => ({
        contents: [], totalCount: 0, offset: 0, limit: 0,
      }))
    : { contents: [], totalCount: 0, offset: 0, limit: 0 };
  const sameCountry = sameCountryData.contents.filter((e) => e.id !== experience.id);
  const samePurpose = experience.classificationStatus === 'verified'
    ? sameCountry.filter((e) => e.classificationStatus === 'verified' && e.primaryPurpose === experience.primaryPurpose)
    : sameCountry;
  const sameCity = samePurpose.filter((e) => e.cityPrimary === experience.cityPrimary);
  const purposePath = getPurposePath(experience);
  const purposeLabel =
    experience.primaryPurpose === 'working-holiday' || experience.primaryPurpose === 'study-abroad'
      ? PURPOSE_LABELS[experience.primaryPurpose]
      : null;
  const purposeBreadcrumb = buildExperienceBreadcrumb(experience);

  const ratingLabels = ['治安', '仕事', 'コスパ', '充実度', '語学上達'];
  const ratingValues = [
    experience.ratingSafety || 0,
    experience.ratingJob || 0,
    experience.ratingCost || 0,
    experience.ratingLifestyle || 0,
    experience.ratingLanguage || 0,
  ];
  const hasRatings = ratingValues.some((v) => v > 0);

  const genderLabel = GENDERS.find((g) => g.value === experience.gender)?.label;
  const langBeforeLabel = LANGUAGE_LEVELS.find((l) => l.value === experience.languageBefore)?.label;
  const langAfterLabel = LANGUAGE_LEVELS.find((l) => l.value === experience.languageAfter)?.label;
  const faqs = extractFaqFromArticleBody(experience.content);

  return (
    <>
      <JsonLd data={generateExperienceJsonLd(experience)} />
      <JsonLd
        data={generateBreadcrumbJsonLd(purposeBreadcrumb)}
      />
      {faqs.length > 0 && <JsonLd data={generateFAQJsonLd(faqs)} />}

      <div className="container-custom py-8">
        <Breadcrumb
          items={toVisibleBreadcrumbItems(purposeBreadcrumb)}
        />

        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Link href={`/countries/${experience.country?.id}`}>
                <Badge variant="primary">
                  {experience.country?.flagEmoji} {experience.country?.nameJp}
                </Badge>
              </Link>
              <Badge>{experience.cityPrimary}</Badge>
              {purposeLabel && <Badge variant="info">{purposeLabel}</Badge>}
              {experience.studyType && <Badge>{STUDY_TYPE_LABELS[experience.studyType]}</Badge>}
              {experience.durationMonths && (
                <Badge variant="info">{formatDuration(experience.durationMonths)}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-3">{experience.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <StarRating rating={experience.ratingOverall} />
              {experience.ageAtDeparture && <span>{experience.ageAtDeparture}歳で出発</span>}
              {genderLabel && <span>{genderLabel}</span>}
              <span>{formatDate(experience.publishedAt || experience.createdAt)}</span>
            </div>
            <div className="mt-3">
              <ShareButtons url={`/experiences/${params.slug}`} title={experience.title} />
            </div>
          </header>

          {/* 基本情報テーブル */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">基本情報</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-200">
                {experience.ageAtDeparture && (
                  <tr>
                    <th className="py-2 pr-4 text-left text-gray-500 font-medium w-1/3">出発時の年齢</th>
                    <td className="py-2">{experience.ageAtDeparture}歳</td>
                  </tr>
                )}
                {genderLabel && (
                  <tr>
                    <th className="py-2 pr-4 text-left text-gray-500 font-medium">性別</th>
                    <td className="py-2">{genderLabel}</td>
                  </tr>
                )}
                <tr>
                  <th className="py-2 pr-4 text-left text-gray-500 font-medium">渡航先</th>
                  <td className="py-2">
                    <Link href={`/countries/${experience.country?.id}`} className="text-primary-600 hover:underline">
                      {experience.country?.flagEmoji} {experience.country?.nameJp}
                    </Link>
                  </td>
                </tr>
                {experience.cityPrimary && (
                  <tr>
                    <th className="py-2 pr-4 text-left text-gray-500 font-medium">主な滞在都市</th>
                    <td className="py-2">{experience.cityPrimary}</td>
                  </tr>
                )}
                {experience.school && (
                  <tr>
                    <th className="py-2 pr-4 text-left text-gray-500 font-medium">通った学校</th>
                    <td className="py-2">
                      <Link href={`/schools/${experience.school.id}`} className="text-primary-600 hover:underline">
                        {experience.school.name}
                      </Link>
                    </td>
                  </tr>
                )}
                {experience.durationMonths && (
                  <tr>
                    <th className="py-2 pr-4 text-left text-gray-500 font-medium">滞在期間</th>
                    <td className="py-2">{formatDuration(experience.durationMonths)}</td>
                  </tr>
                )}
                {purposeLabel && (
                  <tr>
                    <th className="py-2 pr-4 text-left text-gray-500 font-medium">主な渡航目的</th>
                    <td className="py-2">
                      {purposePath ? <Link href={purposePath} className="text-primary-600 hover:underline">{purposeLabel}</Link> : purposeLabel}
                    </td>
                  </tr>
                )}
                {experience.studyType && (
                  <tr>
                    <th className="py-2 pr-4 text-left text-gray-500 font-medium">留学種別</th>
                    <td className="py-2">{STUDY_TYPE_LABELS[experience.studyType]}</td>
                  </tr>
                )}
                {experience.visaOrPermit && (
                  <tr>
                    <th className="py-2 pr-4 text-left text-gray-500 font-medium">本人記載のビザ・許可</th>
                    <td className="py-2">{experience.visaOrPermit}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Body */}
              <div
                className="prose-custom mb-8"
                dangerouslySetInnerHTML={{ __html: experience.content }}
              />

              {/* Pros & Cons */}
              {(experience.pros?.length || experience.cons?.length) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {experience.pros && experience.pros.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-5">
                      <h3 className="font-bold text-green-800 mb-3">良かった点</h3>
                      <ul className="space-y-2">
                        {experience.pros.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                            <span className="mt-0.5">&#10003;</span>
                            <span>{p.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {experience.cons && experience.cons.length > 0 && (
                    <div className="bg-red-50 rounded-xl p-5">
                      <h3 className="font-bold text-red-800 mb-3">大変だった点</h3>
                      <ul className="space-y-2">
                        {experience.cons.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                            <span className="mt-0.5">&#10005;</span>
                            <span>{c.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Advice */}
              {experience.advice && (
                <div className="bg-yellow-50 rounded-xl p-5 mb-8">
                  <h3 className="font-bold text-yellow-800 mb-2">これから行く人へのアドバイス</h3>
                  <p className="text-sm text-yellow-900">{experience.advice}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Radar Chart */}
              {hasRatings && (
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h3 className="font-bold mb-3 text-center">6軸評価</h3>
                  <RadarChart labels={ratingLabels} values={ratingValues} />
                </div>
              )}

              {/* Cost Breakdown */}
              <CostBreakdown experience={experience} />

              {/* Language Progress */}
              {langBeforeLabel && langAfterLabel && (
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-3">語学力の変化</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-center flex-1">
                      <p className="text-xs text-gray-500">出発前</p>
                      <p className="font-medium mt-1">{langBeforeLabel}</p>
                    </div>
                    <span className="text-gray-400 text-xl">→</span>
                    <div className="text-center flex-1">
                      <p className="text-xs text-gray-500">帰国後</p>
                      <p className="font-medium mt-1 text-primary-600">{langAfterLabel}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Related links */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold mb-3">関連リンク</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={`/countries/${experience.country?.id}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      {experience.country?.nameJp}の詳細情報 →
                    </Link>
                  </li>
                  {experience.school && (
                    <li>
                      <Link
                        href={`/schools/${experience.school.id}`}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        {experience.school.name}の詳細 →
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* SEO関連リンク（ハブ&スポーク） */}
          <RelatedLinks
            sections={buildExperienceRelatedSections(experience, {
              sameCountry: samePurpose,
              sameCity,
            })}
          />
        </article>
      </div>
    </>
  );
}
