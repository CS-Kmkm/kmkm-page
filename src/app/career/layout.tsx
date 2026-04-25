import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: '経歴',
  path: '/career',
  description: '学歴、研究活動、開発活動、イベント参加履歴を時系列でまとめた経歴ページです。',
  keywords: ['経歴', '学歴', '研究活動', '開発活動', 'イベント'],
});

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
