import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clearWageFilterParams,
  filterCountriesByWage,
  HOURLY_WAGE_MINIMUMS,
  MONTHLY_WAGE_MINIMUMS,
  parseWageFilter,
  type WageSearchParams,
} from './wage-filter';

test('公開する最低賃金の選択肢を固定する', () => {
  assert.deepEqual(HOURLY_WAGE_MINIMUMS, [1000, 1500, 2000, 2500]);
  assert.deepEqual(MONTHLY_WAGE_MINIMUMS, [150000, 200000, 250000, 300000, 400000]);
});

test('許可された時給・月給の組み合わせだけを解析する', () => {
  assert.deepEqual(parseWageFilter({ wageUnit: 'hourly', wageMin: '1500' }), {
    unit: 'hourly',
    min: 1500,
  });
  assert.deepEqual(parseWageFilter({ wageUnit: 'monthly', wageMin: '300000' }), {
    unit: 'monthly',
    min: 300000,
  });
});

test('URLSearchParamsを直接解析でき、重複パラメータは拒否する', () => {
  assert.deepEqual(
    parseWageFilter(new URLSearchParams('wageUnit=hourly&wageMin=2000')),
    { unit: 'hourly', min: 2000 }
  );
  assert.equal(
    parseWageFilter(
      new URLSearchParams('wageUnit=hourly&wageUnit=monthly&wageMin=2000')
    ),
    null
  );
});

test('片方だけ・不正単位・負数・未対応額・配列値は無効にする', () => {
  const invalidQueries: WageSearchParams[] = [
    { wageUnit: 'hourly' },
    { wageMin: '1000' },
    { wageUnit: 'weekly', wageMin: '1000' },
    { wageUnit: 'hourly', wageMin: '-1000' },
    { wageUnit: 'hourly', wageMin: '1200' },
    { wageUnit: 'monthly', wageMin: '1000' },
    { wageUnit: ['hourly'], wageMin: '1000' },
    { wageUnit: 'hourly', wageMin: ['1000', '1500'] },
  ];

  for (const query of invalidQueries) {
    assert.equal(parseWageFilter(query), null);
  }
});

test('単位切替では収入条件だけを解除し、他条件と元のparamsを保持する', () => {
  const currentParams = new URLSearchParams(
    'region=ヨーロッパ&cost=medium&q=英語&wageUnit=hourly&wageMin=1500'
  );
  const nextParams = clearWageFilterParams(currentParams);

  assert.equal(nextParams.get('region'), 'ヨーロッパ');
  assert.equal(nextParams.get('cost'), 'medium');
  assert.equal(nextParams.get('q'), '英語');
  assert.equal(nextParams.has('wageUnit'), false);
  assert.equal(nextParams.has('wageMin'), false);
  assert.equal(parseWageFilter(nextParams), null);

  assert.equal(currentParams.get('wageUnit'), 'hourly');
  assert.equal(currentParams.get('wageMin'), '1500');
});

const countries = [
  {
    id: 'boundary',
    programStatus: 'open',
    minimumWageHourlyJpy: 1500,
    minWageMonthlyJpy: 250000,
  },
  {
    id: 'above',
    programStatus: 'open',
    minimumWageHourlyJpy: 2500,
    minWageMonthlyJpy: 400000,
  },
  {
    id: 'below',
    programStatus: 'open',
    minimumWageHourlyJpy: 1499,
    minWageMonthlyJpy: 249999,
  },
  {
    id: 'closed',
    programStatus: 'closed',
    minimumWageHourlyJpy: 3000,
    minWageMonthlyJpy: 500000,
  },
  { id: 'missing', programStatus: 'open' },
  {
    id: 'invalid-number',
    programStatus: 'open',
    minimumWageHourlyJpy: Number.NaN,
    minWageMonthlyJpy: Number.POSITIVE_INFINITY,
  },
  {
    id: 'array-open',
    programStatus: ['open'],
    minimumWageHourlyJpy: 1500,
    minWageMonthlyJpy: 250000,
  },
  {
    id: 'array-closed',
    programStatus: ['closed'],
    minimumWageHourlyJpy: 5000,
    minWageMonthlyJpy: 800000,
  },
];

test('時給は受付中・数値あり・指定額以上をAND条件で絞り込む', () => {
  const result = filterCountriesByWage(countries, { unit: 'hourly', min: 1500 });
  assert.deepEqual(
    result.map((country) => country.id),
    ['boundary', 'above', 'array-open']
  );
});

test('月給は月給フィールドを使い、境界値を含める', () => {
  const result = filterCountriesByWage(countries, { unit: 'monthly', min: 250000 });
  assert.deepEqual(
    result.map((country) => country.id),
    ['boundary', 'above', 'array-open']
  );
});

test('収入条件が無効・未指定なら通常一覧を変更しない', () => {
  const result = filterCountriesByWage(countries, null);
  assert.deepEqual(result, countries);
  assert.notEqual(result, countries);
});
