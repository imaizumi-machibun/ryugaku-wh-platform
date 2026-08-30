import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { SITE_URL } from '@/lib/utils/constants';

const SIZE = { width: 1200, height: 630 };
const BRAND = 'Study Work Hub';
const SUB = '留学・ワーホリのリアル情報｜体験談・費用・学校口コミ';

// Google Fonts から「使う文字だけ」サブセット取得（日本語フォントを軽量に読み込む）
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format/);
  if (!match) throw new Error('font url not found');
  const res = await fetch(match[1]);
  return res.arrayBuffer();
}

function titleFontSize(title: string): number {
  if (title.length <= 22) return 62;
  if (title.length <= 36) return 54;
  return 46;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') ?? BRAND).slice(0, 60);
  const cat = searchParams.get('cat')?.slice(0, 20);

  try {
    const subset = title + BRAND + SUB + (cat ?? '');
    const [bold, black] = await Promise.all([
      loadGoogleFont('Noto+Sans+JP', 700, subset),
      loadGoogleFont('Noto+Sans+JP', 900, subset),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 84px',
            background: 'linear-gradient(135deg, #275842 0%, #1A3A2C 55%, #214736 100%)',
            position: 'relative',
            fontFamily: 'Noto',
          }}
        >
          {/* 木漏れ日の光だまり */}
          <div
            style={{
              position: 'absolute',
              top: -140,
              right: -100,
              width: 480,
              height: 480,
              borderRadius: 9999,
              background: 'radial-gradient(circle, rgba(244,183,64,0.22), rgba(244,183,64,0))',
              display: 'flex',
            }}
          />

          {/* 新芽マーク＋ブランド名＋カテゴリ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 13,
                background: '#2F6B4F',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 11,
              }}
            >
              <div style={{ width: 20, height: 24, background: '#8BBF9F', borderRadius: '10px 10px 10px 0', display: 'flex' }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#ffffff', display: 'flex' }}>{BRAND}</div>
            {cat && (
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#1A3A2C',
                  background: '#F4B740',
                  borderRadius: 9999,
                  padding: '6px 22px',
                  marginLeft: 10,
                  display: 'flex',
                }}
              >
                {cat}
              </div>
            )}
          </div>

          {/* 記事タイトル */}
          <div
            style={{
              fontSize: titleFontSize(title),
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            {title}
          </div>

          {/* サブ */}
          <div style={{ fontSize: 25, fontWeight: 700, color: 'rgba(255,255,255,0.78)', display: 'flex' }}>{SUB}</div>
        </div>
      ),
      {
        ...SIZE,
        fonts: [
          { name: 'Noto', data: bold, weight: 700, style: 'normal' },
          { name: 'Noto', data: black, weight: 900, style: 'normal' },
        ],
        headers: {
          'Cache-Control': 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400',
        },
      }
    );
  } catch {
    // フォント取得等に失敗した場合はサイト共通のOG画像へ退避
    return Response.redirect(`${SITE_URL}/opengraph-image`, 302);
  }
}
