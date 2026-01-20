import { Metadata } from 'next';
import { getProfile, getRecentUpdates } from '@/data';
import PageLayout from '@/components/layout/PageLayout';
import { HeroSection, UpdatesSection, NavigationSection } from '@/components/home';

export const metadata: Metadata = {
  title: '茂木光志 - 個人ポートフォリオ',
  description: '名古屋大学大学院情報学研究科知能システム学専攻松原研究室の茂木光志の個人ポートフォリオサイトです。自然言語処理の研究活動、論文投稿履歴をご紹介しています。',
  keywords: ['茂木光志', 'Koshi Motegi', '自然言語処理', 'NLP', '名古屋大学', '松原研究室', '機械学習', '研究'],
  authors: [{ name: '茂木光志' }],
  openGraph: {
    title: '茂木光志 - 個人ポートフォリオ',
    description: '名古屋大学大学院情報学研究科知能システム学専攻松原研究室の茂木光志の個人ポートフォリオサイト',
    type: 'website',
    locale: 'ja_JP',
  },
};

export default function Home() {
  const profile = getProfile();
  const recentUpdates = getRecentUpdates(15);

  return (
    <PageLayout title="トップページ">
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <HeroSection profile={profile} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <UpdatesSection updates={recentUpdates} />
            <NavigationSection />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
