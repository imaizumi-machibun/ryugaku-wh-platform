import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-microcms-signature') ||
      request.nextUrl.searchParams.get('secret');

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json();
    const { api, id } = body;

    switch (api) {
      case 'countries':
        revalidatePath('/countries');
        revalidatePath(`/countries/${id}`);
        revalidatePath('/');
        break;
      case 'schools':
        revalidatePath('/schools');
        revalidatePath(`/schools/${id}`);
        revalidatePath('/');
        break;
      case 'experiences':
        revalidatePath('/experiences');
        revalidatePath(`/experiences/${id}`);
        revalidatePath('/countries');
        revalidatePath('/');
        break;
      case 'reviews':
        revalidatePath('/schools');
        // Review doesn't have its own page, but revalidate the school it belongs to
        break;
      case 'articles':
        revalidatePath('/articles');
        revalidatePath(`/articles/${id}`);
        revalidatePath('/guide');
        revalidatePath('/guide', 'layout');
        revalidatePath('/');
        break;
      default:
        // Revalidate everything if unknown API
        revalidatePath('/');
    }

    return NextResponse.json({ revalidated: true, api, id });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
