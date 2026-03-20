/**
 * microCMSから全学校データをCSVにエクスポートするスクリプト
 *
 * Usage:
 *   npx tsx scripts/export-schools.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from 'microcms-js-sdk';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const MICROCMS_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const MICROCMS_API_KEY = process.env.MICROCMS_API_KEY;
if (!MICROCMS_SERVICE_DOMAIN || !MICROCMS_API_KEY) {
  throw new Error('MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY are required');
}

const client = createClient({
  serviceDomain: MICROCMS_SERVICE_DOMAIN,
  apiKey: MICROCMS_API_KEY,
});

const OUTPUT_PATH = path.resolve(__dirname, '..', 'data', 'schools_export.csv');
const REQUEST_DELAY_MS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** CSV用にエスケープ（カンマや改行を含む場合はダブルクォート） */
function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function main(): Promise<void> {
  console.log('=== Export Schools from microCMS ===\n');

  // 国マスタ取得（ID → nameJp の逆引き用）
  console.log('[1/3] Fetching countries...');
  const countryMap = new Map<string, string>(); // id → nameJp
  let offset = 0;
  while (true) {
    const res = await client.getList<{ nameJp: string }>({
      endpoint: 'countries',
      queries: { fields: ['id', 'nameJp'], limit: 100, offset },
    });
    for (const c of res.contents) {
      countryMap.set(c.id, c.nameJp);
    }
    if (offset + 100 >= res.totalCount) break;
    offset += 100;
  }
  console.log(`  Found ${countryMap.size} countries`);

  // 全学校取得
  console.log('[2/3] Fetching all schools...');
  type SchoolRecord = {
    id: string;
    name: string;
    country: { id: string } | string;
    city: string;
    description?: string;
    courseTypes?: string[];
    costRange?: string[];
    weeklyFeeLow?: number;
    weeklyFeeHigh?: number;
    features?: string[];
    website?: string;
    address?: string;
    isFeatured?: boolean;
    foundedYear?: number;
    totalStudents?: number;
    averageClassSize?: number;
    japaneseRatio?: number;
    nationalityCount?: number;
    minimumAge?: number;
    classroomCount?: number;
    email?: string;
    phone?: string;
    nearestStation?: string;
    latitude?: number;
    longitude?: number;
    languages?: string[];
    accreditations?: string[];
    facilities?: string[];
    accommodationTypes?: string[];
    airportPickup?: boolean;
    minimumWeeks?: number;
  };

  const schools: SchoolRecord[] = [];
  offset = 0;
  const limit = 100;
  while (true) {
    const res = await client.getList<SchoolRecord>({
      endpoint: 'schools',
      queries: { limit, offset, depth: 1 },
    });
    schools.push(...res.contents);
    console.log(`  Fetched ${schools.length}/${res.totalCount}...`);
    if (offset + limit >= res.totalCount) break;
    offset += limit;
    await sleep(REQUEST_DELAY_MS);
  }
  console.log(`  Total: ${schools.length} schools`);

  // CSV生成
  console.log('[3/3] Writing CSV...');
  const headers = [
    'slug', 'name', 'country', 'city', 'description', 'courseTypes', 'costRange',
    'weeklyFeeLow', 'weeklyFeeHigh', 'features', 'website', 'address',
    'isFeatured', 'foundedYear', 'totalStudents', 'averageClassSize',
    'japaneseRatio', 'nationalityCount', 'minimumAge', 'classroomCount',
    'email', 'phone', 'nearestStation', 'latitude', 'longitude',
    'languages', 'accreditations', 'facilities', 'accommodationTypes',
    'airportPickup', 'minimumWeeks',
  ];

  const rows: string[] = [headers.join(',')];

  for (const s of schools) {
    const countryId = typeof s.country === 'object' ? s.country.id : s.country;
    const countryName = countryMap.get(countryId) || countryId;

    // microCMSのセレクトフィールドは配列で返されるので、先頭要素を取るか結合
    const normalize = (val: string[] | string | undefined): string => {
      if (val === undefined || val === null) return '';
      if (Array.isArray(val)) return val.join(',');
      return String(val);
    };

    const row = [
      s.id,
      s.name,
      countryName,
      s.city,
      s.description || '',
      normalize(s.courseTypes),
      normalize(s.costRange),
      s.weeklyFeeLow?.toString() || '',
      s.weeklyFeeHigh?.toString() || '',
      normalize(s.features),
      s.website || '',
      s.address || '',
      s.isFeatured === true ? 'TRUE' : s.isFeatured === false ? 'FALSE' : '',
      s.foundedYear?.toString() || '',
      s.totalStudents?.toString() || '',
      s.averageClassSize?.toString() || '',
      s.japaneseRatio?.toString() || '',
      s.nationalityCount?.toString() || '',
      s.minimumAge?.toString() || '',
      s.classroomCount?.toString() || '',
      s.email || '',
      s.phone || '',
      s.nearestStation || '',
      s.latitude?.toString() || '',
      s.longitude?.toString() || '',
      normalize(s.languages),
      normalize(s.accreditations),
      normalize(s.facilities),
      normalize(s.accommodationTypes),
      s.airportPickup === true ? 'TRUE' : s.airportPickup === false ? 'FALSE' : '',
      s.minimumWeeks?.toString() || '',
    ];

    rows.push(row.map(csvEscape).join(','));
  }

  fs.writeFileSync(OUTPUT_PATH, rows.join('\n') + '\n', 'utf-8');
  console.log(`\n  Exported ${schools.length} schools to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
