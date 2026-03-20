import { client } from './client';
import type { Guide, GuidePhase, MicroCMSListResponse, MicroCMSQueries } from './types';
import { GUIDE_PHASES } from '../utils/constants';

const ENDPOINT = 'articles';

// microCMS のセレクトフィールドは配列で返されるため正規化する
function normalizeGuide(guide: Guide): Guide {
  const phase = guide.phase;
  return {
    ...guide,
    phase: (Array.isArray(phase) ? phase[0] : phase) as GuidePhase,
  };
}

export async function getGuides(
  queries?: MicroCMSQueries
): Promise<MicroCMSListResponse<Guide>> {
  const baseFilter = 'phase[exists]';
  const filters = queries?.filters
    ? `${baseFilter}[and]${queries.filters}`
    : baseFilter;

  const data = await client.getList<Guide>({
    endpoint: ENDPOINT,
    queries: {
      limit: queries?.limit ?? 100,
      offset: queries?.offset,
      orders: queries?.orders ?? 'orderInPhase',
      filters,
      fields: queries?.fields,
      q: queries?.q,
      depth: queries?.depth ?? 2,
    },
  });
  return { ...data, contents: data.contents.map(normalizeGuide) };
}

export async function getGuidesByPhase(
  phase: GuidePhase
): Promise<Guide[]> {
  try {
    const data = await client.getList<Guide>({
      endpoint: ENDPOINT,
      queries: {
        limit: 100,
        filters: `phase[contains]${phase}`,
        orders: 'orderInPhase',
        depth: 2,
      },
    });
    return data.contents.map(normalizeGuide);
  } catch {
    return [];
  }
}

export async function getGuideBySlug(slug: string): Promise<Guide> {
  const guide = await client.getListDetail<Guide>({
    endpoint: ENDPOINT,
    contentId: slug,
    queries: { depth: 2 },
  });
  return normalizeGuide(guide);
}

export async function getGuideSlugs(): Promise<{ id: string; phase: GuidePhase }[]> {
  try {
    const data = await client.getList<Guide>({
      endpoint: ENDPOINT,
      queries: { limit: 100, fields: ['id', 'phase'], filters: 'phase[exists]' },
    });
    return data.contents.map((g) => {
      const normalized = normalizeGuide(g);
      return { id: normalized.id, phase: normalized.phase };
    });
  } catch {
    return [];
  }
}

export async function getGuidesGroupedByPhase(): Promise<
  { phase: GuidePhase; label: string; emoji: string; color: string; description: string; guides: Guide[] }[]
> {
  try {
    const data = await getGuides({ limit: 100, orders: 'orderInPhase' });

    return GUIDE_PHASES.map((p) => ({
      phase: p.value,
      label: p.label,
      emoji: p.emoji,
      color: p.color,
      description: p.description,
      guides: data.contents
        .filter((g) => g.phase === p.value)
        .sort((a, b) => a.orderInPhase - b.orderInPhase),
    }));
  } catch {
    return GUIDE_PHASES.map((p) => ({
      phase: p.value,
      label: p.label,
      emoji: p.emoji,
      color: p.color,
      description: p.description,
      guides: [],
    }));
  }
}
