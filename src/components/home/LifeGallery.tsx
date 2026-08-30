import Image from 'next/image';
import Link from 'next/link';

// 留学・ワーホリの「リアルな毎日」を伝える写真。働く姿（work）と暮らし（life）。
const PHOTOS = [
  { src: '/home/work-1.jpg', alt: '海外のカフェで働く様子' },
  { src: '/home/work-2.jpg', alt: '海外のお店で働く様子' },
  { src: '/home/work-3.jpg', alt: 'ワーキングホリデーで働く様子' },
  { src: '/home/life-1.jpg', alt: '海外で仲間と過ごす休日の様子' },
  { src: '/home/life-2.jpg', alt: '海外の街で暮らす様子' },
];

export default function LifeGallery() {
  return (
    <section className="bg-gray-50 py-24 md:py-32">
      <div className="container-custom">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* 左：テキスト */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-primary-600">
              Real Life
            </p>
            <h2 className="text-display font-black text-gray-900">
              世界で、働きながら、
              <br className="hidden sm:block" />
              暮らす。
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-gray-600">
              海外のカフェやお店、ファームで働いたり、現地の仲間と休日を過ごしたり。留学・ワーホリの毎日は、想像よりずっと自由で、鮮やかだ。
            </p>
            <Link
              href="/experiences"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 transition-opacity hover:opacity-80"
            >
              みんなの体験談を読む
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* 右：非対称モザイク（先頭1枚を縦長大、残り4枚を小さく敷き詰め） */}
          <div className="grid aspect-[4/5] grid-cols-2 grid-rows-3 gap-3 sm:gap-4">
            {PHOTOS.map((photo, i) => (
              <div
                key={photo.src}
                className={`group relative overflow-hidden rounded-2xl shadow-soft ${
                  i === 0 ? 'row-span-2' : ''
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[700ms] ease-smooth group-hover:scale-[1.05]"
                />
                {/* ホバー時にうっすらグリーンを乗せ、サイトのトーンに馴染ませる */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
