import type { Metadata } from 'next';
import { getCountries } from '@/lib/microcms/countries';
import { getSchools } from '@/lib/microcms/schools';
import ExperienceForm from '@/components/form/ExperienceForm';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: '体験談を投稿',
  description: 'あなたの留学・ワーキングホリデーの体験談を投稿して、これから留学する人の参考にしましょう。',
  path: '/submit/experience',
  noindex: true,
});

export default async function SubmitExperiencePage() {
  const [countriesData, schoolsData] = await Promise.all([
    getCountries({ limit: 100 }),
    getSchools({ limit: 200 }),
  ]);

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: '体験談を投稿' }]} />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">体験談を投稿</h1>
        <p className="text-gray-600">
          あなたの留学・ワーホリ経験をシェアしてください
        </p>
      </div>

      <ExperienceForm
        countries={countriesData.contents}
        schools={schoolsData.contents}
      />
    </div>
  );
}
