import type { Metadata } from 'next';
import { getSchools } from '@/lib/microcms/schools';
import ReviewForm from '@/components/form/ReviewForm';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: '口コミを投稿',
  description: '通った語学学校の口コミを投稿して、これから留学する人の参考にしましょう。',
  path: '/submit/review',
  noindex: true,
});

type Props = {
  searchParams: { school?: string };
};

export default async function SubmitReviewPage({ searchParams }: Props) {
  const schoolsData = await getSchools({ limit: 100 });

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: '口コミを投稿' }]} />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">口コミを投稿</h1>
        <p className="text-gray-600">
          通った語学学校の感想をシェアしてください
        </p>
      </div>

      <ReviewForm
        schools={schoolsData.contents}
        defaultSchoolId={searchParams.school}
      />
    </div>
  );
}
