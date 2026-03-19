import { client } from './client';
import type { Review, MicroCMSListResponse, MicroCMSQueries } from './types';

const ENDPOINT = 'reviews';

export async function getReviews(
  queries?: MicroCMSQueries
): Promise<MicroCMSListResponse<Review>> {
  return client.getList<Review>({
    endpoint: ENDPOINT,
    queries: {
      limit: queries?.limit ?? 20,
      offset: queries?.offset,
      orders: queries?.orders ?? '-publishedAt',
      filters: queries?.filters,
      fields: queries?.fields,
      depth: queries?.depth ?? 2,
    },
  });
}

export async function getReviewBySlug(slug: string): Promise<Review> {
  return client.getListDetail<Review>({
    endpoint: ENDPOINT,
    contentId: slug,
    queries: { depth: 2 },
  });
}

export async function getReviewsBySchool(
  schoolId: string,
  limit = 50
): Promise<MicroCMSListResponse<Review>> {
  return getReviews({
    filters: `school[equals]${schoolId}`,
    limit,
    orders: '-publishedAt',
  });
}
