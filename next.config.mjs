/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // JS/CSSはページ描画のためクロールを許可したまま、検索結果の
        // 独立URLとしては登録させない。
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, noarchive',
          },
        ],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
