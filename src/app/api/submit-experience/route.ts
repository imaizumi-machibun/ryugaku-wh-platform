import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/lib/microcms/client';
import { experienceSubmitSchema } from '@/lib/utils/validation';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

    const classificationPayload = {
      primaryPurpose: data.primaryPurpose,
      secondaryPurposes: data.secondaryPurposes,
      studyType: data.studyType,
      visaOrPermit: data.visaOrPermit,
      classificationStatus: 'needs-review',
      classificationNote: '投稿者入力。編集部による本文・ビザ記述の確認待ち',
    } as const;
    const safeParagraphs = data.content
      .split(/\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join('');

    // Build microCMS content. CMSスキーマ移行前でも分類値を失わないよう、
    // 読み取り可能なコメントを本文先頭へ埋める（公開画面には表示されない）。
    const content: Record<string, unknown> = {
      title: data.title,
      country: data.countryId,
      cityPrimary: data.cityPrimary,
      content: `<!-- swh:experience-classification ${encodeURIComponent(JSON.stringify(classificationPayload))} -->${safeParagraphs}`,
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

    // microCMS側に新フィールドを作成した後だけ有効化する。
    // 未作成環境で未知フィールドを送って投稿自体を失敗させないための明示フラグ。
    if (process.env.MICROCMS_EXPERIENCE_PURPOSE_FIELDS_ENABLED === 'true') {
      content.primaryPurpose = [data.primaryPurpose];
      content.secondaryPurposes = data.secondaryPurposes;
      if (data.studyType) content.studyType = [data.studyType];
      content.visaOrPermit = data.visaOrPermit;
      content.classificationStatus = ['needs-review'];
      content.classificationNote = '投稿者入力。編集部による本文・ビザ記述の確認待ち';
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
