/**
 * ワーホリ完全ガイド記事をmicroCMSに登録するスクリプト
 *
 * Usage:
 *   npx tsx scripts/import-guides.ts --dry-run   # データ確認のみ
 *   npx tsx scripts/import-guides.ts              # 本番登録
 */

import * as path from 'path';
import * as fs from 'fs';
import { createClient } from 'microcms-js-sdk';
import * as dotenv from 'dotenv';

// .env.local 読み込み
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const MICROCMS_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const MICROCMS_WRITE_API_KEY = process.env.MICROCMS_WRITE_API_KEY;

// CLI引数
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const RESUME_FROM = args.find(a => a.startsWith('--resume='))?.split('=')[1];

// 定数
const REQUEST_DELAY_MS = 500;
const MAX_RETRIES = 3;
const ENDPOINT = 'articles';

// microCMS Write Client
const writeClient = createClient({
  serviceDomain: MICROCMS_SERVICE_DOMAIN || '',
  apiKey: MICROCMS_WRITE_API_KEY || '',
});

// ============================================================
// ガイド記事データ型
// ============================================================
type GuidePhase =
  | 'info-gathering' | 'visa-cost' | 'departure-prep' | 'arrival'
  | 'work' | 'housing' | 'language-life' | 'safety-mental' | 'return-career';

type GuideEntry = {
  id: string;
  title: string;
  description: string;
  phase: GuidePhase;
  orderInPhase: number;
  body: string;
  estimatedMinutes: number;
  keyPoints?: { fieldId: 'keyPoint'; text: string }[];
  checklist?: { fieldId: 'checklistItem'; text: string; note?: string }[];
  tips?: { fieldId: 'tipItem'; type: 'tip' | 'warning' | 'important'; text: string }[];
};

// ============================================================
// ガイド記事データ（データファイルから読み込み）
// ============================================================
function loadGuideArticles(): GuideEntry[] {
  const dataPath = path.resolve(__dirname, '..', 'data', 'guides');
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ data/guides/ ディレクトリが見つかりません。`);
    console.log(`   先に記事データファイルを data/guides/ に配置してください。`);
    process.exit(1);
  }

  const files = fs.readdirSync(dataPath)
    .filter(f => f.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    console.error(`❌ data/guides/ にJSONファイルが見つかりません。`);
    process.exit(1);
  }

  const articles: GuideEntry[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(dataPath, file), 'utf-8');
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      articles.push(...data);
    } else {
      articles.push(data);
    }
  }

  return articles;
}

// ============================================================
// ユーティリティ
// ============================================================
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function upsertGuide(entry: GuideEntry, retries = MAX_RETRIES): Promise<void> {
  const payload: Record<string, unknown> = {
    title: entry.title,
    description: entry.description,
    phase: [entry.phase],           // selectフィールドは配列で送る
    orderInPhase: entry.orderInPhase,
    body: entry.body,
    estimatedMinutes: entry.estimatedMinutes,
  };

  if (entry.keyPoints) payload.keyPoints = entry.keyPoints;
  if (entry.checklist) payload.checklist = entry.checklist;
  if (entry.tips) payload.tips = entry.tips;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await writeClient.create({
        endpoint: ENDPOINT,
        contentId: entry.id,
        content: payload,
      });
      return;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 409) {
        // Already exists, try update
        await writeClient.update({
          endpoint: ENDPOINT,
          contentId: entry.id,
          content: payload,
        });
        return;
      }
      if (err.response?.status === 429 && attempt < retries) {
        console.log(`   ⏳ Rate limited. Waiting 5s...`);
        await sleep(5000);
        continue;
      }
      if (attempt < retries) {
        console.log(`   ⚠️ Attempt ${attempt} failed. Retrying...`);
        await sleep(1000);
        continue;
      }
      throw error;
    }
  }
}

// ============================================================
// メイン
// ============================================================
async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  ワーホリ完全ガイド インポートスクリプト   ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log();

  if (!MICROCMS_SERVICE_DOMAIN || !MICROCMS_WRITE_API_KEY) {
    console.error('❌ 環境変数が不足しています。');
    console.error('   MICROCMS_SERVICE_DOMAIN, MICROCMS_WRITE_API_KEY を設定してください。');
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log('🏃 DRY RUN モード（microCMSへの書き込みなし）');
    console.log();
  }

  const articles = loadGuideArticles();
  console.log(`📚 ${articles.length}件の記事を読み込みました。`);
  console.log();

  // Phase別サマリー
  const phaseMap = new Map<string, number>();
  for (const a of articles) {
    phaseMap.set(a.phase, (phaseMap.get(a.phase) || 0) + 1);
  }
  phaseMap.forEach((count, phase) => {
    console.log(`  ${phase}: ${count}記事`);
  });
  console.log();

  // Resume対応
  let startIndex = 0;
  if (RESUME_FROM) {
    startIndex = articles.findIndex(a => a.id === RESUME_FROM);
    if (startIndex === -1) {
      console.error(`❌ --resume=${RESUME_FROM} のIDが見つかりません。`);
      process.exit(1);
    }
    console.log(`⏩ ${RESUME_FROM} から再開（${startIndex + 1}/${articles.length}）`);
  }

  let successCount = 0;
  let errorCount = 0;
  const errors: { id: string; error: string }[] = [];

  for (let i = startIndex; i < articles.length; i++) {
    const article = articles[i];
    const progress = `[${i + 1}/${articles.length}]`;

    if (DRY_RUN) {
      console.log(`${progress} ✅ ${article.id} — ${article.title} (${article.phase} #${article.orderInPhase})`);
      successCount++;
      continue;
    }

    try {
      process.stdout.write(`${progress} ${article.id}...`);
      await upsertGuide(article);
      console.log(` ✅ ${article.title}`);
      successCount++;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.log(` ❌ ${msg}`);
      errorCount++;
      errors.push({ id: article.id, error: msg });
    }

    await sleep(REQUEST_DELAY_MS);
  }

  console.log();
  console.log('════════════════════════════════════════════');
  console.log(`✅ 成功: ${successCount}件`);
  if (errorCount > 0) {
    console.log(`❌ 失敗: ${errorCount}件`);
    for (const e of errors) {
      console.log(`   - ${e.id}: ${e.error}`);
    }
  }
  console.log('════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
