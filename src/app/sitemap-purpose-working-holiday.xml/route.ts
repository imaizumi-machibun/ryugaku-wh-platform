export async function GET() {
  return new Response('Gone', { status: 410, headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } });
}
