import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  path: '/ja',
  keywords: [
    '茂木光志',
    '自然言語処理',
    '学術情報流通',
    '名古屋大学',
    '開発経験',
    '論文',
  ],
});

export default function JapaneseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
