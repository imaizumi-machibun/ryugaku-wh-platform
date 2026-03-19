import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/lib/microcms/client';
import { reviewSubmitSchema } from '@/lib/utils/validation';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 3;

  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: '投稿回数の上限に達しました。1時間後に再度お試しください。' },
        { status: 429 }
      );
    }

    const body = await request.json();

    const result = reviewSubmitSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const data = result.data;

    if (data._hp) {
      return NextResponse.json({ error: 'スパムと判定されました' }, { status: 400 });
    }

    const content: Record<string, unknown> = {
      school: data.schoolId,
      country: data.countryId,
      nickname: data.nickname,
      attendedYear: data.attendedYear,
      ratingOverall: data.ratingOverall,
      title: data.title,
      body: data.body,
    };

    if (data.ratingTeaching) content.ratingTeaching = data.ratingTeaching;
    if (data.ratingFacilities) content.ratingFacilities = data.ratingFacilities;
    if (data.ratingLocation) content.ratingLocation = data.ratingLocation;
    if (data.ratingCostPerf) content.ratingCostPerf = data.ratingCostPerf;
    if (data.pros) content.pros = data.pros;
    if (data.cons) content.cons = data.cons;

    await writeClient.create({
      endpoint: 'reviews',
      content,
      isDraft: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Review submit error:', error);
    return NextResponse.json(
      { error: '投稿の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
