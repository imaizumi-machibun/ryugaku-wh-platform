import type { MetadataRoute } from 'next';
import { getCountrySlugs } from '@/lib/microcms/countries';
import { getSchoolSlugs } from '@/lib/microcms/schools';
import { getExperienceSlugs } from '@/lib/microcms/experiences';
import { getArticleSlugs } from '@/lib/microcms/articles';
import { getGuideSlugs } from '@/lib/microcms/guides';
import { SITE_URL } from '@/lib/utils/constants';
import { GUIDE_PHASES } from '@/lib/utils/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [countrySlugs, schoolSlugs, experienceSlugs, articleSlugs, guideSlugs] =
    await Promise.all([
      getCountrySlugs(),
      getSchoolSlugs(),
      getExperienceSlugs(),
      getArticleSlugs(),
      getGuideSlugs(),
    ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/countries`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/schools`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/experiences`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const countryPages: MetadataRoute.Sitemap = countrySlugs.map((slug) => ({
    url: `${SITE_URL}/countries/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const schoolPages: MetadataRoute.Sitemap = schoolSlugs.map((slug) => ({
    url: `${SITE_URL}/schools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const experiencePages: MetadataRoute.Sitemap = experienceSlugs.map((slug) => ({
    url: `${SITE_URL}/experiences/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${SITE_URL}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const guideStaticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...GUIDE_PHASES.map((p) => ({
      url: `${SITE_URL}/guide/${p.value}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  const guidePages: MetadataRoute.Sitemap = guideSlugs.map((s) => ({
    url: `${SITE_URL}/guide/${s.phase}/${s.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...guideStaticPages,
    ...countryPages,
    ...schoolPages,
    ...experiencePages,
    ...articlePages,
    ...guidePages,
  ];
}
