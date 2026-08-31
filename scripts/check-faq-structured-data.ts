import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const appRoot = resolve(process.cwd(), 'src/app');
const failures: string[] = [];

function collectPageFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return collectPageFiles(path);
    return entry === 'page.tsx' ? [path] : [];
  });
}

for (const file of collectPageFiles(appRoot)) {
  const source = readFileSync(file, 'utf8');
  const route = relative(process.cwd(), file);
  const rendersFaq =
    /<SegmentFAQ\b/.test(source) ||
    /\bFAQS\.map\s*\(/.test(source) ||
    /<h[1-6][^>]*>[^<]*(?:よくある質問|FAQ)[^<]*<\/h[1-6]>/i.test(source);

  if (rendersFaq && !/generateFAQJsonLd\s*\(|buildSegmentJsonLdBundle\s*\(/.test(source)) {
    failures.push(`${route}: 表示FAQはあるがFAQPage生成処理がありません`);
  }

  if (/\bFAQS\.map\s*\(/.test(source) && !/generateFAQJsonLd\s*\(\s*FAQS\s*\)/.test(source)) {
    failures.push(`${route}: 表示FAQとFAQPageが同じFAQSを参照していません`);
  }

  if (/<SegmentFAQ\b[^>]*\bfaqs=\{faqs\}/.test(source)) {
    const bundleReceivesFaqs = /buildSegmentJsonLdBundle\s*\(\{[\s\S]*?\bfaqs\s*,[\s\S]*?\}\)/.test(source);
    if (!bundleReceivesFaqs) {
      failures.push(`${route}: SegmentFAQのfaqsがJSON-LDバンドルへ渡されていません`);
    }
  }
}

const sharedRenderers = [
  {
    file: resolve(process.cwd(), 'src/app/articles/[slug]/page.tsx'),
    rules: [
      /extractFaqFromArticleBody\s*\(\s*article\.body\s*\)/,
      /faqs\.length\s*>\s*0\s*&&\s*<JsonLd\s+data=\{generateFAQJsonLd\(faqs\)\}/,
    ],
  },
  {
    file: resolve(process.cwd(), 'src/app/guide/[phase]/[slug]/page.tsx'),
    rules: [
      /extractFaqFromArticleBody\s*\(\s*guide\.body\s*\)/,
      /faqs\.length\s*>\s*0\s*&&\s*<JsonLd\s+data=\{generateFAQJsonLd\(faqs\)\}/,
    ],
  },
  {
    file: resolve(process.cwd(), 'src/app/schools/[slug]/page.tsx'),
    rules: [
      /extractFaqFromArticleBody\s*\(\s*school\.description\s*\)/,
      /faqs\.length\s*>\s*0\s*&&\s*<JsonLd\s+data=\{generateFAQJsonLd\(faqs\)\}/,
    ],
  },
  {
    file: resolve(process.cwd(), 'src/app/experiences/[slug]/page.tsx'),
    rules: [
      /extractFaqFromArticleBody\s*\(\s*experience\.content\s*\)/,
      /faqs\.length\s*>\s*0\s*&&\s*<JsonLd\s+data=\{generateFAQJsonLd\(faqs\)\}/,
    ],
  },
  {
    file: resolve(process.cwd(), 'src/components/country-purpose/CountryPurposePage.tsx'),
    rules: [
      /extractFaqFromArticleBody\s*\(\s*readerGuideBody\s*\)/,
      /faqs\.length\s*>\s*0\s*&&\s*<JsonLd\s+data=\{generateFAQJsonLd\(faqs\)\}/,
    ],
  },
  {
    file: resolve(process.cwd(), 'src/lib/segments/jsonld-bundle.ts'),
    rules: [
      /faqs\s*&&\s*faqs\.length\s*>\s*0/,
      /generateFAQJsonLd\s*\(\s*faqs\s*\)/,
    ],
  },
];

for (const { file, rules } of sharedRenderers) {
  const source = readFileSync(file, 'utf8');
  for (const rule of rules) {
    if (!rule.test(source)) {
      failures.push(`${relative(process.cwd(), file)}: FAQPage連動契約 ${rule} を満たしていません`);
    }
  }
}

if (failures.length > 0) {
  console.error('FAQ構造化データの絶対ルールに違反しています:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('FAQ構造化データ監査: PASS（表示FAQとFAQPageの連動を確認）');
}
