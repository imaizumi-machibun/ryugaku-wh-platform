export const HOURLY_WAGE_MINIMUMS = [1000, 1500, 2000, 2500] as const;
export const MONTHLY_WAGE_MINIMUMS = [150000, 200000, 250000, 300000, 400000] as const;

export type WageUnit = 'hourly' | 'monthly';

export type WageFilter = {
  unit: WageUnit;
  min: number;
};

export type SearchParamValue = string | string[] | undefined;

export type WageSearchParams = {
  wageUnit?: SearchParamValue;
  wageMin?: SearchParamValue;
};

type URLSearchParamsLike = {
  get(name: string): string | null;
  getAll?(name: string): string[];
};

type SerializableSearchParams = {
  toString(): string;
};

type WageFilterCountry = {
  programStatus: string | readonly string[];
  minimumWageHourlyJpy?: number | null;
  minWageMonthlyJpy?: number | null;
};

function isURLSearchParamsLike(
  searchParams: WageSearchParams | URLSearchParamsLike
): searchParams is URLSearchParamsLike {
  return 'get' in searchParams && typeof searchParams.get === 'function';
}

function readSingleValue(
  searchParams: WageSearchParams | URLSearchParamsLike,
  key: keyof WageSearchParams
): string | undefined {
  if (isURLSearchParamsLike(searchParams)) {
    const values = searchParams.getAll?.(key);
    if (values && values.length !== 1) return undefined;
    return searchParams.get(key) ?? undefined;
  }

  const value = searchParams[key];
  return typeof value === 'string' ? value : undefined;
}

function isWageUnit(value: string | undefined): value is WageUnit {
  return value === 'hourly' || value === 'monthly';
}

function isAllowedMinimum(unit: WageUnit, value: string | undefined): boolean {
  if (value === undefined) return false;
  const minimums: readonly number[] =
    unit === 'hourly' ? HOURLY_WAGE_MINIMUMS : MONTHLY_WAGE_MINIMUMS;
  return minimums.some((minimum) => String(minimum) === value);
}

/**
 * URLの収入条件を許可リストで検証する。
 * 単位と金額のどちらか一方だけ、重複値、不正値はすべて無効として扱う。
 */
export function parseWageFilter(
  searchParams: WageSearchParams | URLSearchParamsLike
): WageFilter | null {
  const unit = readSingleValue(searchParams, 'wageUnit');
  const minimum = readSingleValue(searchParams, 'wageMin');

  if (!isWageUnit(unit) || !isAllowedMinimum(unit, minimum)) return null;

  return { unit, min: Number(minimum) };
}

/**
 * 単位切替時に既存の収入条件だけを外した新しいURLSearchParamsを返す。
 * 入力と地域・費用・キーワードなどの他条件は変更しない。
 */
export function clearWageFilterParams(
  searchParams: SerializableSearchParams
): URLSearchParams {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.delete('wageUnit');
  nextParams.delete('wageMin');
  return nextParams;
}

/**
 * 有効な収入条件がある場合だけ、受付中のワーホリ協定国を最低賃金で絞り込む。
 * 条件が無効・未指定なら通常一覧をそのまま返す。
 */
export function filterCountriesByWage<T extends WageFilterCountry>(
  countries: readonly T[],
  wageFilter: WageFilter | null
): T[] {
  if (!wageFilter) return Array.from(countries);

  const wageKey =
    wageFilter.unit === 'hourly' ? 'minimumWageHourlyJpy' : 'minWageMonthlyJpy';

  return countries.filter((country) => {
    const wage = country[wageKey];
    const isOpen = Array.isArray(country.programStatus)
      ? country.programStatus.includes('open')
      : country.programStatus === 'open';
    return (
      isOpen &&
      typeof wage === 'number' &&
      Number.isFinite(wage) &&
      wage >= wageFilter.min
    );
  });
}

export function hasNonEmptySearchParams(
  searchParams: Record<string, SearchParamValue>
): boolean {
  return Object.values(searchParams).some((value) =>
    Array.isArray(value)
      ? value.some((item) => item.length > 0)
      : typeof value === 'string' && value.length > 0
  );
}
