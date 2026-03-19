import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/lib/microcms/client';
import { experienceSubmitSchema } from '@/lib/utils/validation';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
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
    // Rate limit check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: '投稿回数の上限に達しました。1時間後に再度お試しください。' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const result = experienceSubmitSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const data = result.data;

    // Honeypot check
    if (data._hp) {
      return NextResponse.json({ error: 'スパムと判定されました' }, { status: 400 });
    }

    // Build microCMS content
    const content: Record<string, unknown> = {
      title: data.title,
      country: data.countryId,
      cityPrimary: data.cityPrimary,
      content: `<p>${data.content.replace(/\n/g, '</p><p>')}</p>`,
      ratingOverall: data.ratingOverall,
    };

    if (data.schoolId) content.school = data.schoolId;
    if (data.durationMonths) content.durationMonths = data.durationMonths;
    if (data.monthlyLivingJpy) content.monthlyLivingJpy = data.monthlyLivingJpy;
    if (data.monthlyRentJpy) content.monthlyRentJpy = data.monthlyRentJpy;
    if (data.monthlyFoodJpy) content.monthlyFoodJpy = data.monthlyFoodJpy;
    if (data.monthlyIncomeJpy) content.monthlyIncomeJpy = data.monthlyIncomeJpy;
    if (data.ratingSafety) content.ratingSafety = data.ratingSafety;
    if (data.ratingJob) content.ratingJob = data.ratingJob;
    if (data.ratingCost) content.ratingCost = data.ratingCost;
    if (data.ratingLifestyle) content.ratingLifestyle = data.ratingLifestyle;
    if (data.ratingLanguage) content.ratingLanguage = data.ratingLanguage;
    if (data.advice) content.advice = data.advice;
    if (data.wouldRecommend != null) content.wouldRecommend = data.wouldRecommend;
    if (data.ageAtDeparture) content.ageAtDeparture = data.ageAtDeparture;
    if (data.gender) content.gender = [data.gender];
    if (data.languageBefore) content.languageBefore = [data.languageBefore];
    if (data.languageAfter) content.languageAfter = [data.languageAfter];

    if (data.pros && data.pros.length > 0) {
      content.pros = data.pros.map((text) => ({ fieldId: 'proConItem', text }));
    }
    if (data.cons && data.cons.length > 0) {
      content.cons = data.cons.map((text) => ({ fieldId: 'proConItem', text }));
    }

    // Create as draft in microCMS
    await writeClient.create({
      endpoint: 'experiences',
      content,
      isDraft: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Experience submit error:', error);
    return NextResponse.json(
      { error: '投稿の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
