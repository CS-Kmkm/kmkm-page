import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: '利用条件',
  path: '/ja/terms',
  description: '個人ポートフォリオサイトの利用条件です。',
});

export { default } from '@/app/terms/page';
