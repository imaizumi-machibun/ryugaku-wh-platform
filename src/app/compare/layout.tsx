import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: '国比較',
  description: 'ワーキングホリデー対象国を最大3カ国まで並べて比較。ビザ条件・費用・生活環境などを一覧で確認できます。',
  path: '/compare',
});

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
