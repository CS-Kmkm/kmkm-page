import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: '開発経験',
  path: '/dev-experience',
  description: '利用技術、関連プロジェクト、技術スタックをまとめた開発経験ページです。',
  keywords: ['開発経験', 'プログラミング言語', 'フレームワーク', 'プロジェクト', '技術スタック'],
});

export default function DevExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
