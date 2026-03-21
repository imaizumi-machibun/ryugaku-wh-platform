import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSchoolBySlug, getSchoolSlugs } from '@/lib/microcms/schools';
import { getReviewsBySchool } from '@/lib/microcms/reviews';
import ReviewCard from '@/components/review/ReviewCard';
import ReviewSummary from '@/components/review/ReviewSummary';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateSchoolJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { aggregateReviewRatings } from '@/lib/utils/aggregation';
import { COST_RANGES, COURSE_TYPES, SCHOOL_FEATURES, SCHOOL_LANGUAGES, ACCREDITATIONS, FACILITIES, ACCOMMODATION_TYPES } from '@/lib/utils/constants';
import { formatJPY } from '@/lib/utils/format';
import ShareButtons from '@/components/ui/ShareButtons';

export const revalidate = 1800;

export async function generateStaticParams() {
  const slugs = await getSchoolSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const school = await getSchoolBySlug(params.slug);
    return generatePageMetadata({
      title: `${school.name}の口コミ・評価`,
      description: `${school.name}（${school.country?.nameJp}・${school.city}）の口コミ・評価・コース情報。`,
      path: `/schools/${params.slug}`,
      ogImage: school.heroImage?.url,
    });
  } catch {
    return {};
  }
}

export default async function SchoolDetailPage({ params }: Props) {
  let school;
  try {
    school = await getSchoolBySlug(params.slug);
  } catch {
    notFound();
  }

  const reviewsData = await getReviewsBySchool(params.slug);
  const reviews = reviewsData.contents;
  const agg = aggregateReviewRatings(reviews);
  const costLabel = COST_RANGES.find((c) => c.value === school.costRange)?.label;

  return (
    <>
      <JsonLd
        data={generateSchoolJsonLd(
          school,
          agg ? { average: agg.ratingOverall, count: agg.count } : undefined
        )}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'ホーム', url: '/' },
          { name: '学校から探す', url: '/schools' },
          { name: school.country?.nameJp || '', url: `/countries/${school.country?.id}` },
          { name: school.name, url: `/schools/${params.slug}` },
        ])}
      />

      <div className="container-custom py-8">
        <Breadcrumb
          items={[
            { label: '学校から探す', href: '/schools' },
            { label: school.country?.nameJp || '', href: `/countries/${school.country?.id}` },
            { label: school.name },
          ]}
        />

        {/* Hero */}
        {school.heroImage && (
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
            <Image
              src={school.heroImage.url}
              alt={school.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{school.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Link
                  href={`/countries/${school.country?.id}`}
                  className="hover:text-primary-600"
                >
                  {school.country?.flagEmoji} {school.country?.nameJp}
                </Link>
                <span>/</span>
                <span>{school.city}</span>
              </div>
              <div className="mb-3">
                <ShareButtons url={`/schools/${params.slug}`} title={school.name} />
              </div>
              <div className="flex flex-wrap gap-2">
                {costLabel && <Badge variant="info">{costLabel}</Badge>}
                {school.courseTypes?.map((ct) => {
                  const label = COURSE_TYPES.find((c) => c.value === ct)?.label;
                  return label ? <Badge key={ct}>{label}</Badge> : null;
                })}
                {school.features?.map((f) => {
                  const label = SCHOOL_FEATURES.find((sf) => sf.value === f)?.label;
                  return label ? (
                    <Badge key={f} variant="success">
                      {label}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {/* Description */}
            {school.description && (
              <div
                className="prose-custom mb-8"
                dangerouslySetInnerHTML={{ __html: school.description }}
              />
            )}

            {/* 学校基本情報 */}
            {(school.foundedYear || school.totalStudents || school.averageClassSize || school.japaneseRatio != null || school.nationalityCount || school.minimumAge || school.classroomCount) && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">学校基本情報</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {school.foundedYear && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <dt className="text-xs text-gray-500 mb-1">設立年</dt>
                      <dd className="text-lg font-bold">{school.foundedYear}年</dd>
                    </div>
                  )}
                  {school.totalStudents && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <dt className="text-xs text-gray-500 mb-1">生徒数</dt>
                      <dd className="text-lg font-bold">{school.totalStudents.toLocaleString()}人</dd>
                    </div>
                  )}
                  {school.averageClassSize && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <dt className="text-xs text-gray-500 mb-1">平均クラス人数</dt>
                      <dd className="text-lg font-bold">{school.averageClassSize}人</dd>
                    </div>
                  )}
                  {school.japaneseRatio != null && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <dt className="text-xs text-gray-500 mb-1">日本人比率</dt>
                      <dd className="text-lg font-bold">{school.japaneseRatio}%</dd>
                    </div>
                  )}
                  {school.nationalityCount && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <dt className="text-xs text-gray-500 mb-1">国籍数</dt>
                      <dd className="text-lg font-bold">{school.nationalityCount}ヶ国</dd>
                    </div>
                  )}
                  {school.minimumAge && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <dt className="text-xs text-gray-500 mb-1">受入年齢</dt>
                      <dd className="text-lg font-bold">{school.minimumAge}歳〜</dd>
                    </div>
                  )}
                  {school.classroomCount && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <dt className="text-xs text-gray-500 mb-1">教室数</dt>
                      <dd className="text-lg font-bold">{school.classroomCount}室</dd>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Fee Info */}
            {(school.weeklyFeeLow || school.weeklyFeeHigh) && (
              <div className="bg-gray-50 rounded-xl p-5 mb-8">
                <h2 className="font-bold mb-2">費用</h2>
                <p className="text-lg">
                  週額：{formatJPY(school.weeklyFeeLow)} 〜 {formatJPY(school.weeklyFeeHigh)}
                </p>
              </div>
            )}

            {/* 学習環境・設備 */}
            {(school.languages?.length || school.accreditations?.length || school.facilities?.length || school.accommodationTypes?.length || school.airportPickup != null || school.minimumWeeks) && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">学習環境・設備</h2>
                <div className="space-y-4">
                  {school.languages && school.languages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">対応言語</h3>
                      <div className="flex flex-wrap gap-2">
                        {school.languages.map((lang) => {
                          const label = SCHOOL_LANGUAGES.find((l) => l.value === lang)?.label;
                          return label ? <Badge key={lang}>{label}</Badge> : null;
                        })}
                      </div>
                    </div>
                  )}
                  {school.accreditations && school.accreditations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">認定資格</h3>
                      <div className="flex flex-wrap gap-2">
                        {school.accreditations.map((acc) => {
                          const label = ACCREDITATIONS.find((a) => a.value === acc)?.label;
                          return label ? <Badge key={acc} variant="info">{label}</Badge> : null;
                        })}
                      </div>
                    </div>
                  )}
                  {school.facilities && school.facilities.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">設備</h3>
                      <div className="flex flex-wrap gap-2">
                        {school.facilities.map((fac) => {
                          const label = FACILITIES.find((f) => f.value === fac)?.label;
                          return label ? <Badge key={fac} variant="success">{label}</Badge> : null;
                        })}
                      </div>
                    </div>
                  )}
                  {school.accommodationTypes && school.accommodationTypes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">宿泊タイプ</h3>
                      <div className="flex flex-wrap gap-2">
                        {school.accommodationTypes.map((acc) => {
                          const label = ACCOMMODATION_TYPES.find((a) => a.value === acc)?.label;
                          return label ? <Badge key={acc}>{label}</Badge> : null;
                        })}
                      </div>
                    </div>
                  )}
                  {(school.airportPickup != null || school.minimumWeeks) && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                      {school.airportPickup != null && (
                        <span>空港送迎：{school.airportPickup ? 'あり' : 'なし'}</span>
                      )}
                      {school.minimumWeeks && (
                        <span>最小受講期間：{school.minimumWeeks}週〜</span>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Gallery */}
            {school.gallery && school.gallery.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">ギャラリー</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {school.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={img.url}
                        alt={`${school.name} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews List */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">口コミ（{reviews.length}件）</h2>
                <Link
                  href={`/submit/review?school=${params.slug}`}
                  className="bg-accent-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors"
                >
                  口コミを書く
                </Link>
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-8 text-center">
                  まだ口コミがありません。最初の口コミを投稿してみましょう。
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Sticky CTA card */}
            <div className="bg-accent-50 border border-accent-200 rounded-xl p-5">
              <h3 className="font-bold text-accent-800 mb-2">この学校について投稿する</h3>
              <p className="text-sm text-accent-700 mb-4">
                通学経験がある方の口コミを募集しています
              </p>
              <Link
                href={`/submit/review?school=${params.slug}`}
                className="block w-full bg-accent-500 text-white text-center py-2.5 rounded-lg hover:bg-accent-600 transition-colors font-semibold text-sm"
              >
                口コミを書く
              </Link>
            </div>

            {/* Review Summary */}
            {agg && <ReviewSummary reviews={reviews} />}

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold mb-3">学校情報</h3>
              <dl className="space-y-3 text-sm">
                {school.address && (
                  <div>
                    <dt className="text-gray-500">住所</dt>
                    <dd className="mt-1">{school.address}</dd>
                  </div>
                )}
                {school.nearestStation && (
                  <div>
                    <dt className="text-gray-500">最寄り駅</dt>
                    <dd className="mt-1">{school.nearestStation}</dd>
                  </div>
                )}
                {school.phone && (
                  <div>
                    <dt className="text-gray-500">電話番号</dt>
                    <dd className="mt-1">
                      <a href={`tel:${school.phone}`} className="text-primary-600 hover:underline">
                        {school.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {school.email && (
                  <div>
                    <dt className="text-gray-500">メール</dt>
                    <dd className="mt-1">
                      <a href={`mailto:${school.email}`} className="text-primary-600 hover:underline break-all">
                        {school.email}
                      </a>
                    </dd>
                  </div>
                )}
                {school.website && (
                  <div>
                    <dt className="text-gray-500">ウェブサイト</dt>
                    <dd className="mt-1">
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        公式サイト →
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Map Link */}
            {school.latitude && school.longitude && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold mb-3">地図</h3>
                <a
                  href={`https://www.google.com/maps?q=${school.latitude},${school.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Google Maps で開く →
                </a>
              </div>
            )}

            {/* Related Links */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold mb-3">関連リンク</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/countries/${school.country?.id}`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    {school.country?.nameJp}の詳細情報 →
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/schools?country=${school.country?.id}`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    {school.country?.nameJp}の他の学校 →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
