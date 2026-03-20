/**
 * 国マスタデータをmicroCMSに登録するスクリプト
 *
 * Usage:
 *   npx tsx scripts/import-countries.ts --dry-run   # データ確認のみ
 *   npx tsx scripts/import-countries.ts              # 本番登録
 */

import * as path from 'path';
import { createClient } from 'microcms-js-sdk';
import * as dotenv from 'dotenv';

import type { Region, ProgramStatus } from '../src/lib/microcms/types';

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
const DRY_RUN = args.includes('--dry-run');

// ============================================================
// 定数
// ============================================================
const REQUEST_DELAY_MS = 300;
const MAX_RETRIES = 3;

// ============================================================
// 国データ定義（53カ国）
// ============================================================
type CountryEntry = {
  id: string;
  nameJp: string;
  nameEn: string;
  flagEmoji: string;
  region: Region;
  programStatus: ProgramStatus;
};

const COUNTRIES: CountryEntry[] = [
  // オセアニア
  { id: 'australia', nameJp: 'オーストラリア', nameEn: 'Australia', flagEmoji: '🇦🇺', region: 'オセアニア', programStatus: 'open' },
  { id: 'new-zealand', nameJp: 'ニュージーランド', nameEn: 'New Zealand', flagEmoji: '🇳🇿', region: 'オセアニア', programStatus: 'open' },
  { id: 'fiji', nameJp: 'フィジー', nameEn: 'Fiji', flagEmoji: '🇫🇯', region: 'オセアニア', programStatus: 'open' },

  // ヨーロッパ
  { id: 'united-kingdom', nameJp: 'イギリス', nameEn: 'United Kingdom', flagEmoji: '🇬🇧', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'ireland', nameJp: 'アイルランド', nameEn: 'Ireland', flagEmoji: '🇮🇪', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'france', nameJp: 'フランス', nameEn: 'France', flagEmoji: '🇫🇷', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'germany', nameJp: 'ドイツ', nameEn: 'Germany', flagEmoji: '🇩🇪', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'spain', nameJp: 'スペイン', nameEn: 'Spain', flagEmoji: '🇪🇸', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'italy', nameJp: 'イタリア', nameEn: 'Italy', flagEmoji: '🇮🇹', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'portugal', nameJp: 'ポルトガル', nameEn: 'Portugal', flagEmoji: '🇵🇹', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'netherlands', nameJp: 'オランダ', nameEn: 'Netherlands', flagEmoji: '🇳🇱', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'austria', nameJp: 'オーストリア', nameEn: 'Austria', flagEmoji: '🇦🇹', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'switzerland', nameJp: 'スイス', nameEn: 'Switzerland', flagEmoji: '🇨🇭', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'sweden', nameJp: 'スウェーデン', nameEn: 'Sweden', flagEmoji: '🇸🇪', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'poland', nameJp: 'ポーランド', nameEn: 'Poland', flagEmoji: '🇵🇱', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'czech-republic', nameJp: 'チェコ', nameEn: 'Czech Republic', flagEmoji: '🇨🇿', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'greece', nameJp: 'ギリシャ', nameEn: 'Greece', flagEmoji: '🇬🇷', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'hungary', nameJp: 'ハンガリー', nameEn: 'Hungary', flagEmoji: '🇭🇺', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'malta', nameJp: 'マルタ', nameEn: 'Malta', flagEmoji: '🇲🇹', region: 'ヨーロッパ', programStatus: 'open' },
  { id: 'russia', nameJp: 'ロシア', nameEn: 'Russia', flagEmoji: '🇷🇺', region: 'ヨーロッパ', programStatus: 'open' },

  // 北米
  { id: 'united-states', nameJp: 'アメリカ', nameEn: 'United States', flagEmoji: '🇺🇸', region: '北米', programStatus: 'open' },
  { id: 'canada', nameJp: 'カナダ', nameEn: 'Canada', flagEmoji: '🇨🇦', region: '北米', programStatus: 'open' },
  { id: 'mexico', nameJp: 'メキシコ', nameEn: 'Mexico', flagEmoji: '🇲🇽', region: '北米', programStatus: 'open' },

  // アジア
  { id: 'japan', nameJp: '日本', nameEn: 'Japan', flagEmoji: '🇯🇵', region: 'アジア', programStatus: 'open' },
  { id: 'south-korea', nameJp: '韓国', nameEn: 'South Korea', flagEmoji: '🇰🇷', region: 'アジア', programStatus: 'open' },
  { id: 'china', nameJp: '中国', nameEn: 'China', flagEmoji: '🇨🇳', region: 'アジア', programStatus: 'open' },
  { id: 'taiwan', nameJp: '台湾', nameEn: 'Taiwan', flagEmoji: '🇹🇼', region: 'アジア', programStatus: 'open' },
  { id: 'philippines', nameJp: 'フィリピン', nameEn: 'Philippines', flagEmoji: '🇵🇭', region: 'アジア', programStatus: 'open' },
  { id: 'thailand', nameJp: 'タイ', nameEn: 'Thailand', flagEmoji: '🇹🇭', region: 'アジア', programStatus: 'open' },
  { id: 'vietnam', nameJp: 'ベトナム', nameEn: 'Vietnam', flagEmoji: '🇻🇳', region: 'アジア', programStatus: 'open' },
  { id: 'malaysia', nameJp: 'マレーシア', nameEn: 'Malaysia', flagEmoji: '🇲🇾', region: 'アジア', programStatus: 'open' },
  { id: 'singapore', nameJp: 'シンガポール', nameEn: 'Singapore', flagEmoji: '🇸🇬', region: 'アジア', programStatus: 'open' },
  { id: 'india', nameJp: 'インド', nameEn: 'India', flagEmoji: '🇮🇳', region: 'アジア', programStatus: 'open' },
  { id: 'hong-kong', nameJp: '香港', nameEn: 'Hong Kong', flagEmoji: '🇭🇰', region: 'アジア', programStatus: 'open' },

  // 南米・中米・カリブ
  { id: 'brazil', nameJp: 'ブラジル', nameEn: 'Brazil', flagEmoji: '🇧🇷', region: '南米', programStatus: 'open' },
  { id: 'argentina', nameJp: 'アルゼンチン', nameEn: 'Argentina', flagEmoji: '🇦🇷', region: '南米', programStatus: 'open' },
  { id: 'chile', nameJp: 'チリ', nameEn: 'Chile', flagEmoji: '🇨🇱', region: '南米', programStatus: 'open' },
  { id: 'colombia', nameJp: 'コロンビア', nameEn: 'Colombia', flagEmoji: '🇨🇴', region: '南米', programStatus: 'open' },
  { id: 'peru', nameJp: 'ペルー', nameEn: 'Peru', flagEmoji: '🇵🇪', region: '南米', programStatus: 'open' },
  { id: 'ecuador', nameJp: 'エクアドル', nameEn: 'Ecuador', flagEmoji: '🇪🇨', region: '南米', programStatus: 'open' },
  { id: 'bolivia', nameJp: 'ボリビア', nameEn: 'Bolivia', flagEmoji: '🇧🇴', region: '南米', programStatus: 'open' },
  { id: 'uruguay', nameJp: 'ウルグアイ', nameEn: 'Uruguay', flagEmoji: '🇺🇾', region: '南米', programStatus: 'open' },
  { id: 'costa-rica', nameJp: 'コスタリカ', nameEn: 'Costa Rica', flagEmoji: '🇨🇷', region: '南米', programStatus: 'open' },
  { id: 'panama', nameJp: 'パナマ', nameEn: 'Panama', flagEmoji: '🇵🇦', region: '南米', programStatus: 'open' },
  { id: 'guatemala', nameJp: 'グアテマラ', nameEn: 'Guatemala', flagEmoji: '🇬🇹', region: '南米', programStatus: 'open' },
  { id: 'honduras', nameJp: 'ホンジュラス', nameEn: 'Honduras', flagEmoji: '🇭🇳', region: '南米', programStatus: 'open' },
  { id: 'cuba', nameJp: 'キューバ', nameEn: 'Cuba', flagEmoji: '🇨🇺', region: '南米', programStatus: 'open' },
  { id: 'dominican-republic', nameJp: 'ドミニカ共和国', nameEn: 'Dominican Republic', flagEmoji: '🇩🇴', region: '南米', programStatus: 'open' },
  { id: 'el-salvador', nameJp: 'エルサルバドル', nameEn: 'El Salvador', flagEmoji: '🇸🇻', region: '南米', programStatus: 'open' },

  // 中東・アフリカ
  { id: 'uae', nameJp: 'アラブ首長国連邦', nameEn: 'United Arab Emirates', flagEmoji: '🇦🇪', region: '中東', programStatus: 'open' },
  { id: 'egypt', nameJp: 'エジプト', nameEn: 'Egypt', flagEmoji: '🇪🇬', region: '中東', programStatus: 'open' },
  { id: 'morocco', nameJp: 'モロッコ', nameEn: 'Morocco', flagEmoji: '🇲🇦', region: '中東', programStatus: 'open' },
  { id: 'south-africa', nameJp: '南アフリカ', nameEn: 'South Africa', flagEmoji: '🇿🇦', region: '中東', programStatus: 'open' },
  { id: 'kenya', nameJp: 'ケニア', nameEn: 'Kenya', flagEmoji: '🇰🇪', region: '中東', programStatus: 'open' },
  { id: 'ghana', nameJp: 'ガーナ', nameEn: 'Ghana', flagEmoji: '🇬🇭', region: '中東', programStatus: 'open' },
  { id: 'tanzania', nameJp: 'タンザニア', nameEn: 'Tanzania', flagEmoji: '🇹🇿', region: '中東', programStatus: 'open' },
];

// ============================================================
// microCMSクライアント
// ============================================================
function createClients() {
  if (!MICROCMS_SERVICE_DOMAIN) throw new Error('MICROCMS_SERVICE_DOMAIN is required');
  if (!MICROCMS_API_KEY) throw new Error('MICROCMS_API_KEY is required');

  if (!DRY_RUN) {
    if (!MICROCMS_WRITE_API_KEY) throw new Error('MICROCMS_WRITE_API_KEY is required');
  }

  const writeClient = createClient({
    serviceDomain: MICROCMS_SERVICE_DOMAIN,
    apiKey: MICROCMS_WRITE_API_KEY || '',
  });

  return { writeClient };
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
// メイン処理
// ============================================================
async function main(): Promise<void> {
  console.log('=== Country Master Data Import ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE IMPORT'}`);
  console.log(`Countries: ${COUNTRIES.length}`);
  console.log();

  // 地域別サマリー
  const regionCounts = new Map<string, number>();
  for (const c of COUNTRIES) {
    regionCounts.set(c.region, (regionCounts.get(c.region) || 0) + 1);
  }
  console.log('Region summary:');
  for (const [region, count] of Array.from(regionCounts)) {
    console.log(`  ${region}: ${count}`);
  }
  console.log();

  // ドライラン: 全データを表示して終了
  if (DRY_RUN) {
    console.log('Country list:');
    for (const c of COUNTRIES) {
      console.log(`  ${c.flagEmoji} ${c.id.padEnd(22)} ${c.nameJp.padEnd(10)} ${c.nameEn.padEnd(24)} ${c.region}`);
    }
    console.log(`\n✅ Dry run complete. ${COUNTRIES.length} countries ready to import.`);
    return;
  }

  // 本番登録
  const { writeClient } = createClients();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < COUNTRIES.length; i++) {
    const c = COUNTRIES[i];

    let success = false;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        await writeClient.create({
          endpoint: 'countries',
          contentId: c.id,
          content: {
            nameJp: c.nameJp,
            nameEn: c.nameEn,
            flagEmoji: c.flagEmoji,
            region: [c.region],
            programStatus: [c.programStatus],
          },
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

    printProgress(i + 1, COUNTRIES.length, success ? `✓ ${c.id}` : `✗ ${c.id}`);
    await sleep(REQUEST_DELAY_MS);
  }

  // 結果サマリー
  console.log('\nImport complete');
  console.log(`  ✓ Success: ${successCount}`);
  if (failCount > 0) {
    console.log(`  ✗ Failed:  ${failCount}`);
  } else {
    console.log(`\n✅ All ${successCount} countries imported successfully!`);
  }
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
