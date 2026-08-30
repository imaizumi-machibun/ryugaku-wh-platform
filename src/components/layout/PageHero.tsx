type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

/**
 * ハブ・一覧ページ共通の濃緑ヒーロー。
 * パンくずは各ページでこのコンポーネントの前（白背景）に置く。
 */
export default function PageHero({ title, description }: Props) {
  return (
    <section className="section-dark grain relative mt-6 overflow-hidden text-white">
      <div className="container-custom relative z-10 py-14 md:py-20">
        <h1 className="max-w-4xl text-hero font-black text-white">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
