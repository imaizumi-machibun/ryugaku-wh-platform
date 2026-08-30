import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1A3A2C',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', width: 96, height: 110 }}>
          {/* 茎 */}
          <div
            style={{
              position: 'absolute',
              left: 45,
              top: 40,
              width: 6,
              height: 64,
              background: '#F4B740',
              borderRadius: 3,
              display: 'flex',
            }}
          />
          {/* 左の葉 */}
          <div
            style={{
              position: 'absolute',
              left: 8,
              top: 30,
              width: 44,
              height: 44,
              background: '#57A076',
              borderRadius: '44px 44px 44px 0',
              transform: 'rotate(8deg)',
              display: 'flex',
            }}
          />
          {/* 右の葉 */}
          <div
            style={{
              position: 'absolute',
              left: 46,
              top: 18,
              width: 44,
              height: 44,
              background: '#8BBF9F',
              borderRadius: '44px 44px 0 44px',
              transform: 'rotate(-8deg)',
              display: 'flex',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
