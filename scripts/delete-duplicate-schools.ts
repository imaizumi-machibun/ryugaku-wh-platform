/**
 * microCMS上の重複学校データを削除するスクリプト
 * レジストリに登録されていないslugを重複とみなして削除する
 *
 * Usage:
 *   npx tsx scripts/delete-duplicate-schools.ts --dry-run   # プレビュー
 *   npx tsx scripts/delete-duplicate-schools.ts --execute    # 実行
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from 'microcms-js-sdk';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const MICROCMS_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const MICROCMS_API_KEY = process.env.MICROCMS_API_KEY;
const MICROCMS_WRITE_API_KEY = process.env.MICROCMS_WRITE_API_KEY;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const EXECUTE = args.includes('--execute');

if (!DRY_RUN && !EXECUTE) {
  console.error('Usage:');
  console.error('  npx tsx scripts/delete-duplicate-schools.ts --dry-run');
  console.error('  npx tsx scripts/delete-duplicate-schools.ts --execute');
  process.exit(1);
}

const REGISTRY_PATH = path.resolve(__dirname, '..', 'data', 'school-registry.json');
const REQUEST_DELAY_MS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  if (!MICROCMS_SERVICE_DOMAIN || !MICROCMS_API_KEY) {
    throw new Error('MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY are required');
  }
  if (EXECUTE && !MICROCMS_WRITE_API_KEY) {
    throw new Error('MICROCMS_WRITE_API_KEY is required for --execute');
  }

  console.log(`=== Delete Duplicate Schools (${DRY_RUN ? 'DRY RUN' : 'EXECUTE'}) ===\n`);

  // 1. レジストリ読み込み
  console.log('[1/4] Loading registry...');
  const registry: Record<string, string> = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  const validSlugs = new Set(Object.values(registry));
  console.log(`  Valid slugs: ${validSlugs.size}`);

  // 2. microCMSから全学校slug取得
  console.log('[2/4] Fetching all schools from microCMS...');
  const readClient = createClient({
    serviceDomain: MICROCMS_SERVICE_DOMAIN,
    apiKey: MICROCMS_API_KEY,
  });

  const allSlugs: string[] = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const res = await readClient.getList<{ name: string; city: string }>({
      endpoint: 'schools',
      queries: { fields: ['id', 'name', 'city'], limit, offset },
    });
    for (const s of res.contents) {
      allSlugs.push(s.id);
    }
    console.log(`  Fetched ${allSlugs.length}/${res.totalCount}...`);
    if (offset + limit >= res.totalCount) break;
    offset += limit;
    await sleep(REQUEST_DELAY_MS);
  }

  // 3. 削除対象を特定
  console.log('[3/4] Identifying duplicates...');
  const toDelete = allSlugs.filter((slug) => !validSlugs.has(slug));
  const toKeep = allSlugs.filter((slug) => validSlugs.has(slug));

  console.log(`  Total in microCMS: ${allSlugs.length}`);
  console.log(`  Keep:   ${toKeep.length}`);
  console.log(`  Delete: ${toDelete.length}`);

  if (toDelete.length === 0) {
    console.log('\n  No duplicates found.');
    return;
  }

  // DRY RUN: サンプル表示して終了
  if (DRY_RUN) {
    console.log('\n[4/4] Dry run - no deletions');
    console.log(`\n  Sample slugs to delete (first 20):`);
    for (const slug of toDelete.slice(0, 20)) {
      console.log(`    - ${slug}`);
    }
    if (toDelete.length > 20) {
      console.log(`    ... and ${toDelete.length - 20} more`);
    }
    return;
  }

  // 4. 削除実行
  console.log('[4/4] Deleting duplicates...');
  const writeClient = createClient({
    serviceDomain: MICROCMS_SERVICE_DOMAIN,
    apiKey: MICROCMS_WRITE_API_KEY!,
  });

  let deleteCount = 0;
  let failCount = 0;

  for (let i = 0; i < toDelete.length; i++) {
    const slug = toDelete[i];
    try {
      await writeClient.delete({ endpoint: 'schools', contentId: slug });
      deleteCount++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('status: 429')) {
        console.log(`\n  Rate limited, waiting 3s...`);
        await sleep(3000);
        i--; // リトライ
        continue;
      }
      console.error(`\n  Failed to delete ${slug}: ${msg}`);
      failCount++;
    }

    const pct = Math.floor(((i + 1) / toDelete.length) * 100);
    const barLen = 30;
    const filled = Math.floor(((i + 1) / toDelete.length) * barLen);
    const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);
    process.stdout.write(`\r  ${bar} ${pct}% (${i + 1}/${toDelete.length})`);

    await sleep(REQUEST_DELAY_MS);
  }

  console.log('\n');
  console.log(`  Deleted: ${deleteCount}`);
  if (failCount > 0) console.log(`  Failed:  ${failCount}`);
  console.log(`  Remaining in microCMS: ${toKeep.length}`);
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
