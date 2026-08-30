import { NextRequest, NextResponse } from 'next/server';

import {
  buildBlockedRobotsTxt,
  isCanonicalHostname,
  isNonIndexablePath,
  ROBOTS_HEADER_VALUE,
} from '@/lib/seo/crawl-control';
import {
  findRedirectTarget,
  resolveLegacyPurposePath,
} from '@/lib/country-purpose/registry';

const LEGACY_PURPOSE_SITEMAP = /^\/sitemap-purpose-(working-holiday|language|university|parent-child|internship)\.xml\/?$/;
const LEGACY_PURPOSE_PATH = /^\/countries\/([^/]+)\/purpose\/([^/]+)\/?$/;

export function middleware(request: NextRequest) {
  // next devではnextUrl.hostnameが接続先へ固定されるため、実際のHostを優先する。
  // Vercelではx-forwarded-hostが存在する場合にそちらを正とする。
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',', 1)[0];
  const requestHost = forwardedHost || request.headers.get('host') || request.nextUrl.hostname;
  const isCanonicalHost = isCanonicalHostname(requestHost);

  // 正規URLの統合は明示的な301で行い、既存記事の評価を新ハイブリッドページへ集約する。
  const articleTarget = findRedirectTarget(request.nextUrl.pathname.replace(/\/$/, ''));
  if (articleTarget) {
    return NextResponse.redirect(new URL(articleTarget, request.url), 301);
  }

  const purposeMatch = request.nextUrl.pathname.match(LEGACY_PURPOSE_PATH);
  if (purposeMatch) {
    const target = resolveLegacyPurposePath(purposeMatch[1], purposeMatch[2]);
    if (target) return NextResponse.redirect(new URL(target, request.url), 301);
    // 吸収先を検証できない旧目的ページを国ページへ一括転送しない。
    return new NextResponse('Gone', {
      status: 410,
      headers: { 'X-Robots-Tag': ROBOTS_HEADER_VALUE },
    });
  }

  if (LEGACY_PURPOSE_SITEMAP.test(request.nextUrl.pathname)) {
    return new NextResponse('Gone', {
      status: 410,
      headers: { 'X-Robots-Tag': ROBOTS_HEADER_VALUE },
    });
  }

  // Preview・開発・旧デプロイのホストでは、HTMLを検索結果に出さず、
  // robots.txtでもホスト全体のクロールを拒否する。
  if (!isCanonicalHost && request.nextUrl.pathname === '/robots.txt') {
    return new NextResponse(buildBlockedRobotsTxt(), {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=3600',
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': ROBOTS_HEADER_VALUE,
      },
    });
  }

  const response = NextResponse.next();

  // API・投稿・埋め込み画面は本番ホストでも検索対象にしない。
  // 非本番ホストはページ種別を問わず二重にnoindexを付ける。
  if (!isCanonicalHost || isNonIndexablePath(request.nextUrl.pathname)) {
    response.headers.set('X-Robots-Tag', ROBOTS_HEADER_VALUE);
  }

  return response;
}

export const config = {
  // 本番ページの描画に必要なJS/CSS・画像はGooglebotから遮断しない。
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|apple-icon|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|mjs|woff|woff2)$).*)',
  ],
};
