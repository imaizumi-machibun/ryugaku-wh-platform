const CANONICAL_HOSTS = new Set(['study-work-hub.com', 'www.study-work-hub.com']);

const NON_INDEXABLE_PATH_PREFIXES = [
  '/api/',
  '/submit/',
  '/embed/',
  '/_vercel/',
  '/_next/webpack-hmr',
  '/__nextjs_',
] as const;

export const ROBOTS_HEADER_VALUE = 'noindex, nofollow, noarchive';

export function normalizeHostname(hostname: string): string {
  const normalized = hostname.trim().toLowerCase();

  if (normalized.startsWith('[')) {
    const closingBracket = normalized.indexOf(']');
    return closingBracket >= 0 ? normalized.slice(1, closingBracket) : normalized;
  }

  return normalized.split(':', 1)[0].replace(/\.$/, '');
}

export function isCanonicalHostname(hostname: string): boolean {
  return CANONICAL_HOSTS.has(normalizeHostname(hostname));
}

export function isNonIndexablePath(pathname: string): boolean {
  if (pathname === '/api' || pathname === '/submit' || pathname === '/embed') {
    return true;
  }

  return NON_INDEXABLE_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function buildBlockedRobotsTxt(): string {
  return ['User-agent: *', 'Disallow: /', ''].join('\n');
}
