import type { CountryPurposeGuidePurpose } from '@/lib/microcms/types';

export type CountryPurposeVisual = Readonly<{
  src: `https://images.unsplash.com/${string}`;
  alt: string;
  width: number;
  height: number;
  location: string;
  caption: string;
  photographerName: string;
  photographerProfileUrl: `https://unsplash.com/@${string}`;
  sourceUrl: `https://unsplash.com/photos/${string}`;
}>;

export type CountryPurposeVisualSet = Readonly<{
  hero: CountryPurposeVisual;
  inline: readonly CountryPurposeVisual[];
}>;

type CountryPurposeVisualKey = `${string}:${CountryPurposeGuidePurpose}`;

/**
 * Unsplashの写真ページで、作者・撮影地・元画像URLを確認した素材だけを置く。
 * width / height は各写真ページのレスポンシブ画像メタデータに記載された原寸。
 */
export const COUNTRY_PURPOSE_VISUALS = {
  'argentina:working-holiday': {
    hero: {
      src: 'https://images.unsplash.com/photo-1578453223871-970d2d15b57a?auto=format&fit=crop&w=2400&q=82',
      alt: 'アルゼンチン・パタゴニア地方エル・ボルソンの湖と山並み',
      width: 5008,
      height: 4272,
      location: 'El Bolsón, Río Negro, Argentina',
      caption: 'パタゴニア地方のエル・ボルソン。都市生活とは異なる、アルゼンチンの雄大な自然を感じられる風景です。',
      photographerName: 'Hector Ramon Perez',
      photographerProfileUrl: 'https://unsplash.com/@argentinanatural',
      sourceUrl: 'https://unsplash.com/photos/landscape-photography-of-blue-body-of-water-viewing-mountain-under-blue-and-white-sky-FIlMQrXb7ig',
    },
    inline: [
      {
        src: 'https://images.unsplash.com/photo-1755302732178-fb586e6cf81e?auto=format&fit=crop&w=1800&q=82',
        alt: 'ブエノスアイレスの街角で信号を待つ人々と市街地の建物',
        width: 3822,
        height: 5733,
        location: 'Buenos Aires, Argentina',
        caption: 'ブエノスアイレスの街角。歩いて暮らす日常の距離感や、市街地の雰囲気をイメージできます。',
        photographerName: 'Guilherme Ramos',
        photographerProfileUrl: 'https://unsplash.com/@theguilhermeramos',
        sourceUrl: 'https://unsplash.com/photos/people-wait-at-a-street-corner-with-buildings-around-2ruhHAaIOcw',
      },
      {
        src: 'https://images.unsplash.com/photo-1697380685897-35e6b3ed622d?auto=format&fit=crop&w=1800&q=82',
        alt: 'ブエノスアイレスの屋外カフェで過ごす人々',
        width: 2375,
        height: 3994,
        location: 'Buenos Aires, Argentina',
        caption: 'ブエノスアイレスのカフェ風景。飲食店や屋外席で人が集まる、現地の日常の一場面です。',
        photographerName: 'Sebastián Agarrayúa',
        photographerProfileUrl: 'https://unsplash.com/@sebaagarrayua',
        sourceUrl: 'https://unsplash.com/photos/a-couple-of-people-that-are-sitting-at-some-tables-uvLnuIcTirg',
      },
    ],
  },
} as const satisfies Readonly<Partial<Record<CountryPurposeVisualKey, CountryPurposeVisualSet>>>;

export function getCountryPurposeVisuals(
  countrySlug: string,
  purpose: CountryPurposeGuidePurpose
): CountryPurposeVisualSet | undefined {
  const key: CountryPurposeVisualKey = `${countrySlug}:${purpose}`;
  return COUNTRY_PURPOSE_VISUALS[key as keyof typeof COUNTRY_PURPOSE_VISUALS];
}
