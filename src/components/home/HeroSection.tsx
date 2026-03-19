import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white overflow-hidden">
      {/* Decorative SVG wave */}
      <svg
        className="absolute bottom-0 left-0 w-full text-white"
        viewBox="0 0 1440 100"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        <path d="M0,60 C360,100 1080,0 1440,60 L1440,100 L0,100 Z" />
      </svg>

      <div className="container-custom py-20 md:py-28 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight whitespace-pre-line">
            {'留学・ワーホリの\nリアルな情報を探す'}
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 whitespace-pre-line">
            体験談・学校口コミ・費用情報を一つのプラットフォームで
          </p>

          {/* Search Bar */}
          <div className="mb-8 max-w-xl">
            <SearchBar variant="hero" />
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/countries"
              className="bg-accent-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-accent-600 transition-colors w-full sm:w-auto text-center shadow-lg"
            >
              国から探す
            </Link>
            <Link
              href="/experiences"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
              体験談を読む
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
