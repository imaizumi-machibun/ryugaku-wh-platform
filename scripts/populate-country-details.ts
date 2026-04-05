/**
 * 国ページ基本情報を一括更新するスクリプト
 *
 * Usage:
 *   npx tsx scripts/populate-country-details.ts --dry-run          # プレビュー
 *   npx tsx scripts/populate-country-details.ts                    # 全国更新
 *   npx tsx scripts/populate-country-details.ts --region=oceania   # リージョン指定
 */

import * as path from 'path';
import * as fs from 'fs';
import { createClient } from 'microcms-js-sdk';
import * as dotenv from 'dotenv';
import { z } from 'zod';

// ============================================================
// .env.local 読み込み
// ============================================================
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const MICROCMS_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const MICROCMS_WRITE_API_KEY = process.env.MICROCMS_WRITE_API_KEY;

// ============================================================
// CLI引数
// ============================================================
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const regionArg = args.find((a) => a.startsWith('--region='));
const REGION_FILTER = regionArg ? regionArg.split('=')[1] : null;

// ============================================================
// 定数
// ============================================================
const REQUEST_DELAY_MS = 300;
const MAX_RETRIES = 3;
const DATA_DIR = path.resolve(__dirname, '..', 'data', 'countries');

// ============================================================
// Zod スキーマ
// ============================================================
const PopularCitySchema = z.object({
  fieldId: z.literal('popularCity'),
  cityName: z.string(),
  cityDescription: z.string().optional(),
});

const ApplicationStepSchema = z.object({
  fieldId: z.literal('applicationStep'),
  stepTitle: z.string(),
  stepDescription: z.string().optional(),
});

const RequiredDocumentSchema = z.object({
  fieldId: z.literal('requiredDocument'),
  docName: z.string(),
  docNote: z.string().optional(),
});

const SourceUrlSchema = z.object({
  fieldId: z.literal('sourceUrl'),
  label: z.string(),
  url: z.string().url(),
});

const CostLevelSchema = z.enum(['low', 'medium', 'high', 'very-high']);

const CountryDataSchema = z.object({
  id: z.string(),
  description: z.string(),
  capital: z.string(),
  officialLanguage: z.string(),
  currency: z.string(),
  currencyCode: z.string(),
  timeDifferenceJapan: z.string(),
  flightTimeHours: z.number(),
  bestSeason: z.string(),
  livingCostMonthJpy: z.number(),
  avgRentMonthlyJpy: z.number(),
  minimumWageLocal: z.string(),
  costLevel: CostLevelSchema,
  popularCities: z.array(PopularCitySchema).min(2).max(3),
  // ワーホリ協定国のみ
  visaAgeMin: z.number().optional(),
  visaAgeMax: z.number().optional(),
  visaDurationMonths: z.number().optional(),
  visaCostJpy: z.number().optional(),
  visaWorkLimit: z.string().optional(),
  visaStudyLimit: z.string().optional(),
  visaRenewable: z.boolean().optional(),
  visaQuota: z.string().optional(),
  applicationSteps: z.array(ApplicationStepSchema).optional(),
  requiredDocuments: z.array(RequiredDocumentSchema).optional(),
  applicationUrl: z.string().url().optional(),
  embassyUrl: z.string().url().optional(),
  sourceUrls: z.array(SourceUrlSchema).optional(),
});

type CountryData = z.infer<typeof CountryDataSchema>;

// ============================================================
// リージョンマッピング
// ============================================================
const REGION_FILE_MAP: Record<string, string> = {
  oceania: '01-oceania.json',
  europe: '02-europe.json',
  'north-america': '03-north-america.json',
  asia: '04-asia.json',
  'south-america': '05-south-america.json',
  'middle-east-africa': '06-middle-east-africa.json',
};

// ============================================================
// microCMSクライアント
// ============================================================
function createWriteClient() {
  if (!MICROCMS_SERVICE_DOMAIN) throw new Error('MICROCMS_SERVICE_DOMAIN is required');
  if (!MICROCMS_WRITE_API_KEY) throw new Error('MICROCMS_WRITE_API_KEY is required');

  return createClient({
    serviceDomain: MICROCMS_SERVICE_DOMAIN,
    apiKey: MICROCMS_WRITE_API_KEY,
  });
}

// ============================================================
// ユーティリティ
// ============================================================
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printProgress(current: number, total: number, label: string): void {
  const pct = Math.floor((current / total) * 100);
  const barLen = 30;
  const filled = Math.floor((current / total) * barLen);
  const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);
  process.stdout.write(`\r  ${bar} ${pct}% (${current}/${total}) ${label}`);
  if (current === total) process.stdout.write('\n');
}

// ============================================================
// データ読み込み
// ============================================================
function loadCountryData(): CountryData[] {
  const files = REGION_FILTER
    ? [REGION_FILE_MAP[REGION_FILTER]].filter(Boolean)
    : Object.values(REGION_FILE_MAP);

  if (REGION_FILTER && files.length === 0) {
    console.error(`Unknown region: ${REGION_FILTER}`);
    console.error(`Available regions: ${Object.keys(REGION_FILE_MAP).join(', ')}`);
    process.exit(1);
  }

  const allData: CountryData[] = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const entries: unknown[] = Array.isArray(raw) ? raw : raw.countries || [];

    for (const entry of entries) {
      const result = CountryDataSchema.safeParse(entry);
      if (!result.success) {
        const id = (entry as { id?: string })?.id || 'unknown';
        console.error(`\nValidation error for "${id}" in ${file}:`);
        for (const issue of result.error.issues) {
          console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
        }
        process.exit(1);
      }
      allData.push(result.data);
    }
  }

  // japan をスキップ
  return allData.filter((c) => c.id !== 'japan');
}

// ============================================================
// microCMS 送信用ペイロード変換
// ============================================================
function toMicroCMSPayload(data: CountryData): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    description: data.description,
    capital: data.capital,
    officialLanguage: data.officialLanguage,
    currency: data.currency,
    currencyCode: data.currencyCode,
    timeDifferenceJapan: data.timeDifferenceJapan,
    flightTimeHours: data.flightTimeHours,
    bestSeason: data.bestSeason,
    livingCostMonthJpy: data.livingCostMonthJpy,
    avgRentMonthlyJpy: data.avgRentMonthlyJpy,
    minimumWageLocal: data.minimumWageLocal,
    costLevel: [data.costLevel], // select フィールドは配列
    popularCities: data.popularCities,
  };

  // ワーホリ協定国のビザ情報
  if (data.visaAgeMin != null) payload.visaAgeMin = data.visaAgeMin;
  if (data.visaAgeMax != null) payload.visaAgeMax = data.visaAgeMax;
  if (data.visaDurationMonths != null) payload.visaDurationMonths = data.visaDurationMonths;
  if (data.visaCostJpy != null) payload.visaCostJpy = data.visaCostJpy;
  if (data.visaWorkLimit) payload.visaWorkLimit = data.visaWorkLimit;
  if (data.visaStudyLimit) payload.visaStudyLimit = data.visaStudyLimit;
  if (data.visaRenewable != null) payload.visaRenewable = data.visaRenewable;
  if (data.visaQuota) payload.visaQuota = data.visaQuota;
  if (data.applicationSteps) payload.applicationSteps = data.applicationSteps;
  if (data.requiredDocuments) payload.requiredDocuments = data.requiredDocuments;
  if (data.applicationUrl) payload.applicationUrl = data.applicationUrl;
  if (data.embassyUrl) payload.embassyUrl = data.embassyUrl;
  if (data.sourceUrls) payload.sourceUrls = data.sourceUrls;

  return payload;
}

// ============================================================
// メイン処理
// ============================================================
async function main(): Promise<void> {
  console.log('=== Country Details Population ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE UPDATE'}`);
  if (REGION_FILTER) console.log(`Region filter: ${REGION_FILTER}`);
  console.log();

  const countries = loadCountryData();
  console.log(`Countries to update: ${countries.length}`);
  console.log();

  // ドライラン
  if (DRY_RUN) {
    for (const c of countries) {
      const payload = toMicroCMSPayload(c);
      const hasVisa = c.visaAgeMin != null;
      const cityNames = c.popularCities.map((p) => p.cityName).join(', ');
      console.log(`  ${c.id.padEnd(24)} costLevel=${c.costLevel.padEnd(9)} cities=[${cityNames}] visa=${hasVisa ? 'yes' : 'no'}`);

      // descriptionのプレビュー（最初の80文字）
      const descPreview = c.description.replace(/<[^>]+>/g, '').slice(0, 80);
      console.log(`    desc: ${descPreview}...`);
    }
    console.log(`\n✅ Dry run complete. ${countries.length} countries ready to update.`);
    return;
  }

  // 本番更新
  const writeClient = createWriteClient();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < countries.length; i++) {
    const c = countries[i];
    const payload = toMicroCMSPayload(c);

    let success = false;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        await writeClient.update({
          endpoint: 'countries',
          contentId: c.id,
          content: payload,
        });
        success = true;
        break;
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 429) {
          const backoff = Math.pow(2, attempt) * 1000;
          console.log(`\n  ⚠ Rate limited on ${c.id}, retrying in ${backoff}ms...`);
          await sleep(backoff);
        } else {
          console.error(`\n  ✗ ${c.id}: ${err instanceof Error ? err.message : err}`);
          break;
        }
      }
    }

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    printProgress(i + 1, countries.length, success ? `✓ ${c.id}` : `✗ ${c.id}`);
    await sleep(REQUEST_DELAY_MS);
  }

  // 結果サマリー
  console.log('\nUpdate complete');
  console.log(`  ✓ Success: ${successCount}`);
  if (failCount > 0) {
    console.log(`  ✗ Failed:  ${failCount}`);
  } else {
    console.log(`\n✅ All ${successCount} countries updated successfully!`);
  }
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
