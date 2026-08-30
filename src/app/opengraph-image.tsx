import { ImageResponse } from 'next/og';

export const alt = 'Study Work Hub｜留学・ワーキングホリデーのリアル情報';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TITLE = 'Study Work Hub';
const TAGLINE = '留学・ワーキングホリデーの、\nリアルな情報。';
const SUB = '費用・体験談・学校情報を、実際に行った人のデータから。';
const STATS = '53カ国 ・ 945校 ・ 体験談';

// Google Fonts から「使う文字だけ」サブセット取得（日本語フォントを軽量に読み込む）
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format/);
  if (!match) throw new Error('font url not found');
  const res = await fetch(match[1]);
  return res.arrayBuffer();
}

export default async function Image() {
  const subset = TITLE + TAGLINE + SUB + STATS;
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
          justifyContent: 'center',
          padding: '92px',
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

        {/* 新芽マーク＋ブランド名 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 30 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#2F6B4F',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 12,
            }}
          >
            <div style={{ width: 22, height: 26, background: '#8BBF9F', borderRadius: '11px 11px 11px 0', display: 'flex' }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#ffffff', display: 'flex' }}>{TITLE}</div>
        </div>

        {/* 見出し */}
        <div style={{ fontSize: 68, fontWeight: 900, color: '#ffffff', lineHeight: 1.25, whiteSpace: 'pre-wrap', display: 'flex' }}>
          {TAGLINE}
        </div>

        {/* サブ */}
        <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.82)', marginTop: 30, display: 'flex' }}>{SUB}</div>

        {/* スタッツ */}
        <div style={{ fontSize: 27, fontWeight: 700, color: '#F4B740', marginTop: 46, display: 'flex' }}>{STATS}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Noto', data: bold, weight: 700, style: 'normal' },
        { name: 'Noto', data: black, weight: 900, style: 'normal' },
      ],
    }
  );
}
