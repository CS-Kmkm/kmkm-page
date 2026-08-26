import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: '論文',
  path: '/ja/publications',
  description: '投稿した論文一覧です。著者区分や査読の有無で絞り込みながら閲覧できます。',
  keywords: ['論文', '発表', '研究', '国外', 'ジャーナル'],
});

export { default } from '@/app/publications/page';
