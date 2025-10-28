import { Metadata } from 'next';
import { getProfile, getRecentUpdates } from '@/data';
import PageLayout from '@/components/layout/PageLayout';
import ProfileSection from '@/components/ui/ProfileSection';
import SocialLinks from '@/components/ui/SocialLinks';
import UpdatesList from '@/components/ui/UpdatesList';
import {
  CareerNavigationCard,
  DevExperienceNavigationCard,
  PublicationsNavigationCard
} from '@/components/ui/NavigationCard';

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
  const recentUpdates = getRecentUpdates(10);

  return (
    <PageLayout title="トップページ">
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Hero Section with Profile and Social Links */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <ProfileSection
              profile={profile}
              showBio={true}
              showLocation={true}
              className="mb-4 sm:mb-6"
            />

            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <SocialLinks
                socialLinks={profile.socialLinks}
                showLabels={true}
                orientation="horizontal"
              />
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Updates */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <UpdatesList
                  updates={recentUpdates}
                  maxItems={3}
                  showScrollable={true}
                />
              </div>
            </div>

            {/* Right Column - Navigation Cards */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  コンテンツ
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <CareerNavigationCard />
                  <DevExperienceNavigationCard />
                  <PublicationsNavigationCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
