import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// 旧purpose URLはmiddlewareで、検証済みの統合先だけ301、その他は410にする。
// middlewareを通さない静的解析環境でも旧ページ本文を再生成しないためのfail-closed route。
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LegacyPurposePage() {
  notFound();
}
