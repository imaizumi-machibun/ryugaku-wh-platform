import assert from 'node:assert/strict';
import test from 'node:test';
import { formatCurrencyLabel } from './format';

test('通貨コードが既に含まれる場合は重複して付けない', () => {
  assert.equal(formatCurrencyLabel('ユーロ（EUR）', 'EUR'), 'ユーロ（EUR）');
  assert.equal(formatCurrencyLabel('US Dollar (USD)', 'usd'), 'US Dollar (USD)');
});

test('通貨コードがない通貨名にはISOコードを付ける', () => {
  assert.equal(formatCurrencyLabel('南アフリカランド', 'ZAR'), '南アフリカランド（ZAR）');
});

test('通貨名またはコードが空の場合を安全に扱う', () => {
  assert.equal(formatCurrencyLabel(undefined, 'EUR'), undefined);
  assert.equal(formatCurrencyLabel('ユーロ', undefined), 'ユーロ');
});
