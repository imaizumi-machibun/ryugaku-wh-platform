import { NextRequest, NextResponse } from 'next/server';
import { getCountries } from '@/lib/microcms/countries';
import { getSchools } from '@/lib/microcms/schools';
import { getExperiences } from '@/lib/microcms/experiences';
import { getArticles } from '@/lib/microcms/articles';

type SearchResult = {
  type: 'country' | 'school' | 'experience' | 'article';
  id: string;
  title: string;
  subtitle?: string;
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [countries, schools, experiences, articles] = await Promise.all([
      getCountries({ q, limit: 5 }).catch(() => ({ contents: [] })),
      getSchools({ q, limit: 5 }).catch(() => ({ contents: [] })),
      getExperiences({ q, limit: 5 }).catch(() => ({ contents: [] })),
      getArticles({ q, limit: 5 }).catch(() => ({ contents: [] })),
    ]);

    const results: SearchResult[] = [
      ...countries.contents.map((c) => ({
        type: 'country' as const,
        id: c.id,
        title: `${c.flagEmoji || ''} ${c.nameJp}`,
        subtitle: c.region,
      })),
      ...schools.contents.map((s) => ({
        type: 'school' as const,
        id: s.id,
        title: s.name,
        subtitle: `${s.country?.nameJp || ''} / ${s.city}`,
      })),
      ...experiences.contents.map((e) => ({
        type: 'experience' as const,
        id: e.id,
        title: e.title,
        subtitle: `${e.country?.nameJp || ''} ${e.cityPrimary}`,
      })),
      ...articles.contents.map((a) => ({
        type: 'article' as const,
        id: a.id,
        title: a.title,
        subtitle: a.category || undefined,
      })),
    ];

    return NextResponse.json({ results: results.slice(0, 15) });
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
