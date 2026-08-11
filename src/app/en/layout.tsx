import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  locale: 'en',
  path: '/en',
  keywords: [
    'Koshi Motegi',
    'natural language processing',
    'scholarly communication',
    'Nagoya University',
    'software development',
    'publications',
  ],
});

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return children;
}
