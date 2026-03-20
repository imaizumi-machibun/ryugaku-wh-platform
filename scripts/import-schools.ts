/**
 * CSV学校データをmicroCMSにインポートするスクリプト（レジストリベース）
 *
 * Usage:
 *   npx tsx scripts/import-schools.ts --init-registry  # レジストリ初期構築
 *   npx tsx scripts/import-schools.ts --sync            # 同期（更新・新規作成）
 *   npx tsx scripts/import-schools.ts --sync --dry-run  # プレビュー（API呼び出しなし）
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from 'microcms-js-sdk';
import { z } from 'zod';
import * as dotenv from 'dotenv';

// ============================================================
// .env.local 読み込み
// ============================================================
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const MICROCMS_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const MICROCMS_API_KEY = process.env.MICROCMS_API_KEY;
const MICROCMS_WRITE_API_KEY = process.env.MICROCMS_WRITE_API_KEY;

// ============================================================
// CLI引数
// ============================================================
const args = process.argv.slice(2);
const INIT_REGISTRY = args.includes('--init-registry');
const SYNC = args.includes('--sync');
const DRY_RUN = args.includes('--dry-run');

if (!INIT_REGISTRY && !SYNC) {
  console.error('Usage:');
  console.error('  npx tsx scripts/import-schools.ts --init-registry');
  console.error('  npx tsx scripts/import-schools.ts --sync [--dry-run]');
  process.exit(1);
}

// ============================================================
// 定数
// ============================================================
const CSV_PATH = path.resolve(__dirname, '..', 'data', 'schools_data_new.csv');
const REGISTRY_PATH = path.resolve(__dirname, '..', 'data', 'school-registry.json');
const PROGRESS_PATH = path.resolve(__dirname, '.import-progress.json');
const REQUEST_DELAY_MS = 300;
const MAX_RETRIES = 3;
const SAVE_INTERVAL = 10;

// ============================================================
// レジストリ型定義・読み書き
// ============================================================
type Registry = Record<string, string>; // "name|city" → slug

function registryKey(name: string, city: string): string {
  return `${name}|${city}`;
}

function loadRegistry(): Registry {
  if (fs.existsSync(REGISTRY_PATH)) {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  }
  return {};
}

function saveRegistry(registry: Registry): void {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n');
}

// ============================================================
// microCMSクライアント
// ============================================================
function createClients() {
  if (!MICROCMS_SERVICE_DOMAIN) throw new Error('MICROCMS_SERVICE_DOMAIN is required');
  if (!MICROCMS_API_KEY) throw new Error('MICROCMS_API_KEY is required');

  const readClient = createClient({
    serviceDomain: MICROCMS_SERVICE_DOMAIN,
    apiKey: MICROCMS_API_KEY,
  });

  if (!DRY_RUN && !INIT_REGISTRY) {
    if (!MICROCMS_WRITE_API_KEY) throw new Error('MICROCMS_WRITE_API_KEY is required');
  }

  const writeClient = createClient({
    serviceDomain: MICROCMS_SERVICE_DOMAIN,
    apiKey: MICROCMS_WRITE_API_KEY || '',
  });

  return { readClient, writeClient };
}

// ============================================================
// microCMS全学校取得（ページネーション付き）
// ============================================================
async function fetchAllSchools(
  readClient: ReturnType<typeof createClient>
): Promise<{ id: string; name: string; city: string }[]> {
  const schools: { id: string; name: string; city: string }[] = [];
  const limit = 100;
  let offset = 0;

  while (true) {
    const res = await readClient.getList<{ name: string; city: string }>({
      endpoint: 'schools',
      queries: { fields: ['id', 'name', 'city'], limit, offset },
    });
    for (const s of res.contents) {
      schools.push({ id: s.id, name: s.name, city: s.city });
    }
    console.log(`  Fetched ${schools.length}/${res.totalCount} schools...`);
    if (offset + limit >= res.totalCount) break;
    offset += limit;
    await sleep(REQUEST_DELAY_MS);
  }

  return schools;
}

// ============================================================
// Zodスキーマ（microCMS School型に合わせたバリデーション）
// ============================================================
const courseTypeEnum = z.enum(['general', 'business', 'exam-prep', 'conversation', 'intensive']);
const costRangeEnum = z.enum(['budget', 'standard', 'premium']);
const featureEnum = z.enum([
  'small-class', 'online-support', 'japanese-staff', 'certificate', 'activities', 'accommodation',
]);
const languageEnum = z.enum([
  'english', 'french', 'spanish', 'german', 'korean', 'chinese', 'italian', 'portuguese', 'arabic',
  'japanese', 'thai', 'vietnamese', 'dutch', 'czech', 'greek',
]);
const accreditationEnum = z.enum([
  'british-council', 'cambridge-english', 'ialc', 'eaquals', 'neas',
  'languages-canada', 'celta', 'acels', 'nzqa', 'other',
]);
const facilityEnum = z.enum([
  'wifi', 'study-room', 'cafe', 'library', 'computer-lab', 'lounge', 'kitchen', 'garden', 'gym', 'prayer-room',
]);
const accommodationTypeEnum = z.enum([
  'homestay', 'student-residence', 'shared-apartment', 'studio', 'hotel', 'hostel',
]);

const schoolContentSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1), // microCMS content ID
  city: z.string().min(1),
  description: z.string().optional(),
  courseTypes: z.array(courseTypeEnum).optional(),
  costRange: costRangeEnum.optional(),
  weeklyFeeLow: z.number().int().positive().optional(),
  weeklyFeeHigh: z.number().int().positive().optional(),
  features: z.array(featureEnum).optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  isFeatured: z.boolean().optional(),
  foundedYear: z.number().int().min(1800).max(2030).optional(),
  totalStudents: z.number().int().positive().optional(),
  averageClassSize: z.number().int().positive().optional(),
  japaneseRatio: z.number().min(0).max(100).optional(),
  nationalityCount: z.number().int().positive().optional(),
  minimumAge: z.number().int().min(1).max(99).optional(),
  classroomCount: z.number().int().positive().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  nearestStation: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  languages: z.array(languageEnum).optional(),
  accreditations: z.array(accreditationEnum).optional(),
  facilities: z.array(facilityEnum).optional(),
  accommodationTypes: z.array(accommodationTypeEnum).optional(),
  airportPickup: z.boolean().optional(),
  minimumWeeks: z.number().int().positive().optional(),
});

type SchoolContent = z.infer<typeof schoolContentSchema>;

// ============================================================
// ユーティリティ
// ============================================================

/** 文字列からURL安全なスラッグを生成 */
function toSlug(name: string, city: string): string {
  const raw = `${name} ${city}`;
  return raw
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // diacritics除去
    .replace(/[^a-z0-9\s-]/g, '')    // 英数字・スペース・ハイフン以外除去
    .replace(/\s+/g, '-')            // スペースをハイフンに
    .replace(/-+/g, '-')             // 連続ハイフンを1つに
    .replace(/^-|-$/g, '')           // 先頭・末尾のハイフン除去
    .slice(0, 50);                   // microCMS ID制約: 最大50文字
}

/** 重複スラッグにサフィックスを付与 */
function deduplicateSlug(slug: string, usedSlugs: Set<string>): string {
  if (!usedSlugs.has(slug)) {
    usedSlugs.add(slug);
    return slug;
  }
  let suffix = 2;
  while (usedSlugs.has(`${slug}-${suffix}`)) {
    suffix++;
  }
  const deduped = `${slug}-${suffix}`;
  usedSlugs.add(deduped);
  return deduped;
}

/** カンマ区切り文字列を配列に変換（空文字列ならundefined） */
function splitCsv(value: string): string[] | undefined {
  if (!value || value.trim() === '') return undefined;
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

/** TRUE/FALSE文字列をbooleanに変換 */
function toBool(value: string): boolean | undefined {
  if (value === 'TRUE') return true;
  if (value === 'FALSE') return false;
  return undefined;
}

/** 数値文字列をnumberに変換（空文字列ならundefined） */
function toNum(value: string): number | undefined {
  if (!value || value.trim() === '') return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
}

/** メール文字列をバリデーションして返す（無効ならundefined） */
function toEmail(value: string): string | undefined {
  if (!value || value.trim() === '') return undefined;
  // 基本的なメール形式チェック（ドメイン部分がドットで始まらない）
  if (!/^[^\s@]+@[a-zA-Z0-9][^\s@]*\.[^\s@]+$/.test(value)) return undefined;
  return value;
}

/** 数値文字列をintegerに変換 */
function toInt(value: string): number | undefined {
  const n = toNum(value);
  return n !== undefined ? Math.round(n) : undefined;
}

/** 遅延 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** microCMSセレクトフィールドを配列形式に変換 */
function wrapSelectFields(content: Record<string, unknown>): Record<string, unknown> {
  const selectFields = ['costRange', 'courseTypes', 'features', 'languages', 'accreditations', 'facilities', 'accommodationTypes'];
  const result = { ...content };
  for (const field of selectFields) {
    if (result[field] !== undefined && !Array.isArray(result[field])) {
      result[field] = [result[field]];
    }
  }
  return result;
}

/** undefinedのプロパティを除去 */
function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result as Partial<T>;
}

// ============================================================
// 進捗ファイル管理
// ============================================================
type Progress = {
  completedSlugs: string[];
  failedRows: number[];
};

function loadProgress(): Progress {
  if (fs.existsSync(PROGRESS_PATH)) {
    return JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf-8'));
  }
  return { completedSlugs: [], failedRows: [] };
}

function saveProgress(progress: Progress): void {
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
}

// ============================================================
// プログレスバー
// ============================================================
function printProgress(current: number, total: number, label: string): void {
  const pct = Math.floor((current / total) * 100);
  const barLen = 30;
  const filled = Math.floor((current / total) * barLen);
  const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);
  process.stdout.write(`\r  ${bar} ${pct}% (${current}/${total}) ${label}`);
  if (current === total) process.stdout.write('\n');
}

// ============================================================
// CSV読み込み
// ============================================================
function readCsv(): Record<string, string>[] {
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  return parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

// ============================================================
// 国マッピング取得
// ============================================================
async function fetchCountryMap(
  readClient: ReturnType<typeof createClient>
): Promise<Map<string, string>> {
  const countryMap = new Map<string, string>(); // nameJp → id
  let offset = 0;
  const limit = 100;
  while (true) {
    const res = await readClient.getList<{ nameJp: string }>({
      endpoint: 'countries',
      queries: { fields: ['id', 'nameJp'], limit, offset },
    });
    for (const c of res.contents) {
      countryMap.set(c.nameJp, c.id);
    }
    if (offset + limit >= res.totalCount) break;
    offset += limit;
  }
  return countryMap;
}

// ============================================================
// CSVレコードをSchoolContentに変換
// ============================================================
function transformRecord(
  r: Record<string, string>,
  countryMap: Map<string, string>
): SchoolContent {
  return omitUndefined({
    name: r.name,
    country: countryMap.get(r.country)!,
    city: r.city,
    description: r.description || undefined,
    courseTypes: splitCsv(r.courseTypes) as SchoolContent['courseTypes'],
    costRange: (r.costRange || undefined) as SchoolContent['costRange'],
    weeklyFeeLow: toInt(r.weeklyFeeLow),
    weeklyFeeHigh: toInt(r.weeklyFeeHigh),
    features: splitCsv(r.features) as SchoolContent['features'],
    website: r.website || undefined,
    address: r.address || undefined,
    isFeatured: toBool(r.isFeatured),
    foundedYear: toInt(r.foundedYear),
    totalStudents: toInt(r.totalStudents),
    averageClassSize: toInt(r.averageClassSize),
    japaneseRatio: toNum(r.japaneseRatio),
    nationalityCount: toInt(r.nationalityCount),
    minimumAge: toInt(r.minimumAge),
    classroomCount: toInt(r.classroomCount),
    email: toEmail(r.email),
    phone: r.phone || undefined,
    nearestStation: r.nearestStation || undefined,
    latitude: toNum(r.latitude),
    longitude: toNum(r.longitude),
    languages: splitCsv(r.languages) as SchoolContent['languages'],
    accreditations: splitCsv(r.accreditations) as SchoolContent['accreditations'],
    facilities: splitCsv(r.facilities) as SchoolContent['facilities'],
    accommodationTypes: splitCsv(r.accommodationTypes) as SchoolContent['accommodationTypes'],
    airportPickup: toBool(r.airportPickup),
    minimumWeeks: toInt(r.minimumWeeks),
  }) as SchoolContent;
}

// ============================================================
// --init-registry モード
// ============================================================
async function initRegistry(): Promise<void> {
  console.log('=== Init Registry ===\n');

  // 1. CSV読み込み
  console.log('[1/4] Reading CSV...');
  const records = readCsv();
  console.log(`  Found ${records.length} records`);

  // 2. microCMSから全学校取得
  console.log('[2/4] Fetching all schools from microCMS...');
  const { readClient } = createClients();
  const existingSchools = await fetchAllSchools(readClient);
  console.log(`  Found ${existingSchools.length} schools in microCMS`);

  // microCMSの学校を slug → {name, city} のマップに
  const cmsSlugMap = new Map<string, { name: string; city: string }>();
  for (const s of existingSchools) {
    cmsSlugMap.set(s.id, { name: s.name, city: s.city });
  }

  // 既存slugの集合（重複排除用）
  const existingSlugs = new Set(existingSchools.map((s) => s.id));

  // 3. CSVとmicroCMSのマッチング
  console.log('[3/4] Matching CSV rows to microCMS entries...');
  const registry: Registry = {};
  const usedSlugs = new Set<string>();
  let matchCount = 0;
  let unmatchedCount = 0;

  for (const r of records) {
    const key = registryKey(r.name, r.city);
    const slug = deduplicateSlug(toSlug(r.name, r.city), usedSlugs);

    if (existingSlugs.has(slug)) {
      // slug がmicroCMSに存在 → マッチ
      registry[key] = slug;
      matchCount++;
    } else {
      // slugが見つからない場合、name+cityでmicroCMS側を検索
      let found = false;
      const cmsEntries = Array.from(cmsSlugMap.entries());
      for (const [cmsSlug, cms] of cmsEntries) {
        if (cms.name === r.name && cms.city === r.city && !Object.values(registry).includes(cmsSlug)) {
          registry[key] = cmsSlug;
          matchCount++;
          found = true;
          break;
        }
      }
      if (!found) {
        // マッチなし → 生成したslugをレジストリに登録
        registry[key] = slug;
        unmatchedCount++;
      }
    }
  }

  // 4. レジストリ保存
  console.log('[4/4] Saving registry...');
  saveRegistry(registry);

  console.log(`\n  Matched:   ${matchCount}`);
  console.log(`  Unmatched: ${unmatchedCount}`);
  console.log(`  Total:     ${Object.keys(registry).length}`);
  console.log(`\n  Registry saved to ${REGISTRY_PATH}`);
}

// ============================================================
// --sync モード
// ============================================================
async function sync(): Promise<void> {
  console.log('=== School Data Sync ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE SYNC'}`);
  console.log();

  // 1. レジストリ読み込み
  console.log('[1/6] Loading registry...');
  const registry = loadRegistry();
  const registrySize = Object.keys(registry).length;
  if (registrySize === 0) {
    console.error('  Registry is empty. Run --init-registry first.');
    process.exit(1);
  }
  console.log(`  Loaded ${registrySize} entries`);

  // 2. CSV読み込み
  console.log('[2/6] Reading CSV...');
  const records = readCsv();
  console.log(`  Found ${records.length} records`);

  // 3. 国マッピング取得
  console.log('[3/6] Fetching countries from microCMS...');
  const { readClient, writeClient } = createClients();
  const countryMap = await fetchCountryMap(readClient);
  console.log(`  Found ${countryMap.size} countries`);

  // CSV内の国名を検証
  const csvCountries = new Set(records.map((r) => r.country));
  const missingCountries = Array.from(csvCountries).filter((c) => !countryMap.has(c));
  if (missingCountries.length > 0) {
    console.error('\n  Missing countries in microCMS:');
    for (const c of missingCountries) {
      console.error(`    - ${c}`);
    }
    process.exit(1);
  }

  // 4. データ変換・分類
  console.log('[4/6] Transforming and classifying data...');
  const updates: { slug: string; content: SchoolContent; rowIndex: number }[] = [];
  const creates: { slug: string; content: SchoolContent; rowIndex: number }[] = [];
  const usedSlugs = new Set<string>(Object.values(registry));

  const validationErrors: { rowIndex: number; key: string; errors: string[] }[] = [];

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const key = registryKey(r.name, r.city);
    const rowIndex = i + 2; // 1-indexed + header

    const content = transformRecord(r, countryMap);

    // バリデーション
    const result = schoolContentSchema.safeParse(content);
    if (!result.success) {
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      );
      validationErrors.push({ rowIndex, key, errors });
      continue;
    }

    if (registry[key]) {
      // レジストリにある → UPDATE
      updates.push({ slug: registry[key], content, rowIndex });
    } else {
      // レジストリにない → CREATE（新規学校）
      const slug = deduplicateSlug(toSlug(r.name, r.city), usedSlugs);
      creates.push({ slug, content, rowIndex });
    }
  }

  if (validationErrors.length > 0) {
    console.error(`\n  Validation failed for ${validationErrors.length} records:`);
    for (const { rowIndex, key, errors } of validationErrors) {
      console.error(`\n  Row ${rowIndex} (${key}):`);
      for (const err of errors) {
        console.error(`    - ${err}`);
      }
    }
    process.exit(1);
  }
  console.log(`  All ${records.length} records valid`);
  console.log(`  Updates: ${updates.length}, Creates: ${creates.length}`);

  // 5. DRY RUNならプレビューして終了
  if (DRY_RUN) {
    console.log('\n[5/6] Dry run - skipping API calls');
    console.log('[6/6] Done\n');
    console.log('[DRY RUN] Result:');
    console.log(`  Updates: ${updates.length}`);
    console.log(`  Creates: ${creates.length}`);

    if (creates.length > 0) {
      console.log('\n  New schools:');
      for (const { slug, content } of creates) {
        console.log(`    + ${slug} (${content.name}, ${content.city})`);
      }
    }
    if (updates.length > 0 && updates.length <= 20) {
      console.log('\n  Updates:');
      for (const { slug, content } of updates) {
        console.log(`    ~ ${slug} (${content.name}, ${content.city})`);
      }
    }
    return;
  }

  // 6. microCMS書き込み
  console.log('[5/6] Syncing to microCMS...');
  const allRecords = [
    ...creates.map((c) => ({ ...c, action: 'create' as const })),
    ...updates.map((u) => ({ ...u, action: 'update' as const })),
  ];
  const progress = loadProgress();
  const completedSet = new Set(progress.completedSlugs);
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < allRecords.length; i++) {
    const { slug, content, rowIndex, action } = allRecords[i];

    // 既に完了済みならスキップ
    if (completedSet.has(slug)) {
      skipCount++;
      printProgress(i + 1, allRecords.length, `Skipped: ${slug}`);
      continue;
    }

    let success = false;
    const apiContent = wrapSelectFields(content as unknown as Record<string, unknown>);

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        if (action === 'create') {
          await writeClient.create({
            endpoint: 'schools',
            contentId: slug,
            content: apiContent,
          });
        } else {
          await writeClient.update({
            endpoint: 'schools',
            contentId: slug,
            content: apiContent,
          });
        }
        success = true;
        break;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('status: 429')) {
          const backoff = Math.pow(2, attempt) * 1000;
          console.log(`\n  Rate limited on row ${rowIndex}, retrying in ${backoff}ms...`);
          await sleep(backoff);
        } else if (action === 'create' && msg.includes('status: 400')) {
          // 既に存在する場合 → updateにフォールバック
          try {
            await writeClient.update({
              endpoint: 'schools',
              contentId: slug,
              content: apiContent,
            });
            success = true;
          } catch (updateErr: unknown) {
            console.error(`\n  Update fallback failed for ${slug}: ${updateErr instanceof Error ? updateErr.message : updateErr}`);
          }
          break;
        } else {
          console.error(`\n  Row ${rowIndex} (${slug}): ${msg}`);
          break;
        }
      }
    }

    if (success) {
      successCount++;
      progress.completedSlugs.push(slug);
      completedSet.add(slug);
    } else {
      failCount++;
      progress.failedRows.push(rowIndex);
    }

    printProgress(i + 1, allRecords.length, success ? `${action === 'create' ? '+' : '~'} ${slug}` : `x ${slug}`);

    if ((i + 1) % SAVE_INTERVAL === 0) {
      saveProgress(progress);
    }

    await sleep(REQUEST_DELAY_MS);
  }

  // 最終進捗保存
  saveProgress(progress);

  // 7. レジストリ更新（新規作成分を追加）
  console.log('\n[6/6] Updating registry...');
  for (const { slug, content } of creates) {
    const key = registryKey(content.name, content.city);
    registry[key] = slug;
  }
  saveRegistry(registry);

  // 結果サマリー
  console.log('\n  Result:');
  console.log(`    Success: ${successCount}`);
  if (skipCount > 0) console.log(`    Skipped: ${skipCount}`);
  if (failCount > 0) {
    console.log(`    Failed:  ${failCount}`);
    console.log(`    Failed rows: ${progress.failedRows.join(', ')}`);
  }

  // 全件成功したら進捗ファイルを削除
  if (failCount === 0) {
    if (fs.existsSync(PROGRESS_PATH)) {
      fs.unlinkSync(PROGRESS_PATH);
    }
    console.log(`\n  All ${successCount} schools synced successfully!`);
  }
}

// ============================================================
// メイン
// ============================================================
async function main(): Promise<void> {
  if (INIT_REGISTRY) {
    await initRegistry();
  } else if (SYNC) {
    await sync();
  }
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
