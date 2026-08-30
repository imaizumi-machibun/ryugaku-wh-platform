import type { Country, Region } from '@/lib/microcms/types';

// ============================================================
// 同言語圏マップ（手動定義）
// 同地域フォールバックでも空のときに使う追加フォールバック
// ============================================================
export const LANGUAGE_GROUPS: Record<string, string[]> = {
  spanish: [
    'spain',
    'argentina',
    'chile',
    'mexico',
    'colombia',
    'peru',
    'bolivia',
    'uruguay',
    'paraguay',
    'ecuador',
    'venezuela',
    'costa-rica',
    'cuba',
    'dominican-republic',
  ],
  french: ['france', 'belgium', 'switzerland', 'canada'],
  german: ['germany', 'austria', 'switzerland'],
  portuguese: ['portugal', 'brazil'],
  chinese: ['china', 'taiwan', 'hong-kong', 'singapore'],
  korean: ['south-korea'],
  japanese: ['japan'],
  english: [
    'united-kingdom',
    'united-states',
    'australia',
    'canada',
    'new-zealand',
    'ireland',
    'malta',
    'singapore',
    'philippines',
    'south-africa',
  ],
};

export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  spanish: 'スペイン語圏',
  french: 'フランス語圏',
  german: 'ドイツ語圏',
  portuguese: 'ポルトガル語圏',
  chinese: '中国語圏',
  korean: '韓国語圏',
  japanese: '日本語圏',
  english: '英語圏',
};

export const REGION_DISPLAY_NAMES: Record<Region, string> = {
  オセアニア: 'オセアニア',
  ヨーロッパ: 'ヨーロッパ',
  北米: '北米',
  アジア: 'アジア',
  南米: '南米',
  中東: '中東・アフリカ',
};

// ============================================================
// 当国の所属言語グループ（最初に見つかった1つ）
// ============================================================
export function getLanguageGroup(slug: string): string | null {
  for (const [lang, slugs] of Object.entries(LANGUAGE_GROUPS)) {
    if (slugs.includes(slug)) return lang;
  }
  return null;
}

// ============================================================
// 同言語圏の他国 slug 配列（自国を除く）
// ============================================================
export function getLanguageGroupSlugs(slug: string): string[] {
  const group = getLanguageGroup(slug);
  if (!group) return [];
  return LANGUAGE_GROUPS[group].filter((s) => s !== slug);
}

// ============================================================
// 言語グループの日本語表示名
// ============================================================
export function getLanguageDisplayName(slug: string): string | null {
  const group = getLanguageGroup(slug);
  if (!group) return null;
  return LANGUAGE_DISPLAY_NAMES[group] ?? null;
}

// ============================================================
// 当国と同地域の他国 slug 配列（自国を除く）
// allCountries はページ側で getCountries() の結果を渡す
// ============================================================
export function getRegionalCountrySlugs(slug: string, allCountries: Country[]): string[] {
  const target = allCountries.find((c) => c.id === slug);
  if (!target?.region) return [];
  return allCountries
    .filter((c) => c.region === target.region && c.id !== slug && c.programStatus !== 'closed')
    .map((c) => c.id);
}

// ============================================================
// 当国と同地域の Country オブジェクト配列（自国を除く、上位N件）
// ============================================================
export function getRegionalCountries(
  slug: string,
  allCountries: Country[],
  limit = 6
): Country[] {
  const target = allCountries.find((c) => c.id === slug);
  if (!target?.region) return [];
  return allCountries
    .filter((c) => c.region === target.region && c.id !== slug && c.programStatus !== 'closed')
    .slice(0, limit);
}

// ============================================================
// 当国の地域の日本語表示名
// ============================================================
export function getRegionDisplayName(slug: string, allCountries: Country[]): string | null {
  const target = allCountries.find((c) => c.id === slug);
  if (!target?.region) return null;
  return REGION_DISPLAY_NAMES[target.region] ?? target.region;
}
