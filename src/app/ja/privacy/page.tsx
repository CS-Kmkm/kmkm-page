import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'プライバシーポリシー',
  path: '/ja/privacy',
  description: '個人ポートフォリオサイトにおけるデータの取り扱い方針です。',
});

export { default } from '@/app/privacy/page';
