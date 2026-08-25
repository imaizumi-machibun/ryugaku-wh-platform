export type CountrySeoOverride = {
  title: string;
  description: string;
};

export type CountryEditorialLink = {
  label: string;
  href: string;
  description: string;
};

const COUNTRY_SEO_OVERRIDES: Record<string, CountrySeoOverride> = {
  denmark: {
    title: 'デンマークワーホリ・留学ガイド｜費用・ビザ・仕事',
    description:
      'デンマークのワーホリ・留学に必要な費用、ビザ、仕事、語学学校を整理。コペンハーゲンなどの都市情報、現地体験談、1年の費用ガイドを見比べながら渡航計画を立てられます。',
  },
  austria: {
    title: 'オーストリアワーホリ・留学ガイド｜費用・ビザ・都市',
    description:
      'オーストリアのワーホリ・留学に必要な費用、ビザ、仕事、語学学校を整理。ウィーンを中心とした都市情報や現地体験談も確認でき、渡航準備の全体像を一つのページでつかめます。',
  },
  estonia: {
    title: 'エストニア留学ガイド｜費用・ビザ・学校・タリン',
    description:
      'エストニア留学の費用、ビザ、語学学校、タリンでの暮らしを整理。国の基本情報と現地体験談を確認でき、ワーホリの条件・必要書類・保険は専用の申請ガイドで詳しく読めます。',
  },
  ireland: {
    title: 'アイルランド留学ガイド｜費用・語学学校・都市を比較',
    description:
      'アイルランド留学の費用、ビザ、語学学校、ダブリン・コーク・ゴールウェイの違いを整理。現地体験談と学校情報を見比べながら、自分に合う留学先を検討できます。ワーホリの申請手順は専用ガイドへ案内します。',
  },
};

const COUNTRY_EDITORIAL_LINKS: Record<string, CountryEditorialLink[]> = {
  denmark: [
    {
      label: 'デンマークワーホリの申請・仕事・暮らしを詳しく読む',
      href: '/articles/wh-denmark-complete-guide',
      description: '申請条件、必要書類、仕事探し、現地生活をまとめた実践ガイド',
    },
    {
      label: 'デンマークワーホリ1年の費用と必要な貯金を確認する',
      href: '/articles/wh-denmark-cost-guide',
      description: '初期費用、毎月の生活費、収入を前提別に試算',
    },
  ],
  austria: [
    {
      label: 'オーストリアワーホリの申請・費用・仕事を詳しく読む',
      href: '/articles/wh-austria-complete-guide',
      description: '渡航条件から現地生活までをまとめた実践ガイド',
    },
  ],
  estonia: [
    {
      label: 'エストニアワーホリの条件・必要書類・保険を確認する',
      href: '/articles/wh-estonia-complete-guide',
      description: '申請準備と1年の費用を一次情報ベースで整理',
    },
  ],
  ireland: [
    {
      label: 'アイルランドワーホリの申請手順と必要書類を確認する',
      href: '/articles/wh-ireland-complete-guide',
      description: '受付時期、申請の流れ、費用、仕事探しをまとめた実践ガイド',
    },
  ],
};

export function getCountrySeoOverride(slug: string): CountrySeoOverride | undefined {
  return COUNTRY_SEO_OVERRIDES[slug];
}

export function getCountryEditorialLinks(slug: string): CountryEditorialLink[] {
  return COUNTRY_EDITORIAL_LINKS[slug] ?? [];
}
