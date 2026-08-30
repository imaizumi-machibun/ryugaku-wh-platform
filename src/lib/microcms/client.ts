import { createClient } from 'microcms-js-sdk';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}
if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

const rawClient = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// 429 や一時エラーに対する指数バックオフ・リトライ
async function withRetry<T>(fn: () => Promise<T>, label = 'microcms'): Promise<T> {
  const maxRetries = 5;
  let lastErr: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      const isRateLimit = msg.includes('429') || msg.toLowerCase().includes('rate');
      const isTransient = isRateLimit || msg.includes('5');
      if (!isTransient || i === maxRetries - 1) break;
      const wait = Math.min(8000, 800 * Math.pow(2, i)) + Math.floor(Math.random() * 400);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[${label}] retry ${i + 1}/${maxRetries} after ${wait}ms: ${msg.slice(0, 120)}`);
      }
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// プロキシ風ラッパー: 主要メソッドだけリトライを差し込む
export const client = {
  getList: <T>(args: Parameters<typeof rawClient.getList>[0]) =>
    withRetry(() => rawClient.getList<T>(args), 'getList'),
  getListDetail: <T>(args: Parameters<typeof rawClient.getListDetail>[0]) =>
    withRetry(() => rawClient.getListDetail<T>(args), 'getListDetail'),
};

// 書き込み用クライアント（投稿API用、リトライ不要）
export const writeClient = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_WRITE_API_KEY || '',
});
