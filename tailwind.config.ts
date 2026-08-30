import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── 新緑の成長 ──────────────────────────────
        // primary: フォレストグリーン（地・構造色・濃緑面・リンク）
        primary: {
          50: '#F1F7F2',
          100: '#DBEBE0',
          200: '#B7D7C2',
          300: '#8BBF9F',
          400: '#57A076',
          500: '#3A8560',
          600: '#2F6B4F',
          700: '#275842',
          800: '#214736',
          900: '#1A3A2C',
        },
        // accent: ハニーイエロー〜ゴールド（暗い面の上で線・点・数字として）
        accent: {
          50: '#FEF8EA',
          100: '#FBEDC8',
          200: '#F8DD96',
          300: '#F5CB63',
          400: '#F4B740',
          500: '#E59E22',
          600: '#C17E18',
          700: '#9A6219',
          800: '#7B4E1B',
          900: '#663F18',
        },
        // warm: アプリコット（装飾専用）
        warm: {
          100: '#FBE3D4',
          300: '#F0B492',
          400: '#E08A5B',
          500: '#CF7644',
        },
        // gray: 青みを除いた温かいニュートラル（墨=900 #243029）
        gray: {
          50: '#FAF8F2',
          100: '#F2EFE7',
          200: '#E5E1D6',
          300: '#D2CDBF',
          400: '#A8A294',
          500: '#7C786C',
          600: '#5E5B51',
          700: '#46443D',
          800: '#33322C',
          900: '#243029',
        },
      },
      fontFamily: {
        // Noto Sans JP に一本化
        sans: ['var(--font-noto-sans-jp)', 'sans-serif'],
      },
      fontSize: {
        // ヒーロー用の特大ディスプレイサイズ（巨大ジャンプ率）
        hero: ['clamp(2.75rem, 6vw, 5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display': ['clamp(2rem, 4vw, 2.5rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        'stat': ['clamp(3rem, 7vw, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      transitionTimingFunction: {
        // 上品な減速（最初に速く、最後に吸い付くように止まる）
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(26,58,44,0.04), 0 2px 8px rgba(26,58,44,0.06)',
        'soft-md': '0 2px 4px rgba(26,58,44,0.05), 0 6px 16px rgba(26,58,44,0.08)',
        'soft-lg': '0 4px 8px rgba(26,58,44,0.06), 0 12px 28px rgba(26,58,44,0.10)',
        'glow-accent': '0 6px 24px rgba(244,183,64,0.35)',
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scale-in 0.4s ease-out both',
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
