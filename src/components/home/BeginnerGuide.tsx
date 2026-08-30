import Link from 'next/link';

const STEPS = [
  { step: '01', title: '国を選ぶ', description: '行きたい国の情報をチェック。ビザ・費用・条件を比較できます', href: '/countries' },
  { step: '02', title: '体験談を読む', description: '先輩たちのリアルな体験談から生活のイメージをつかもう', href: '/experiences' },
  { step: '03', title: '学校を探す', description: '口コミ・評価で語学学校を比較。あなたに合った学校が見つかる', href: '/schools' },
  { step: '04', title: '準備を始める', description: 'ビザ申請・保険・持ち物など、お役立ち記事で準備をしよう', href: '/articles' },
];

export default function BeginnerGuide() {
  return (
    <section className="bg-gray-50 py-24 md:py-32">
      <div className="container-custom">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-primary-600">How to start</p>
        <h2 className="max-w-3xl text-display font-black text-gray-900">はじめての方へ</h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
          4つのステップで、留学・ワーホリの準備をはじめましょう。
        </p>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <Link key={item.step} href={item.href} className="group border-t-2 border-gray-900 pt-5">
              <span className="block text-4xl font-black tabular-nums text-gray-200 transition-colors group-hover:text-primary-300 md:text-5xl">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-700">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
