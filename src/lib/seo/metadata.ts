import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '../utils/constants';

type MetadataParams = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
};

export function generatePageMetadata({
  title,
  description,
  path,
  ogImage,
  noindex,
}: MetadataParams): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'ja_JP',
      type: 'website',
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}

export function generateArticleMetadata({
  title,
  description,
  path,
  ogImage,
  publishedTime,
  modifiedTime,
}: MetadataParams & { publishedTime?: string; modifiedTime?: string }): Metadata {
  const base = generatePageMetadata({ title, description, path, ogImage });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
  };
}
