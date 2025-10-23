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
  title: '山田太郎 - 個人ポートフォリオ',
  description: '○○大学情報学部准教授の山田太郎の個人ポートフォリオサイトです。研究活動、開発経験、論文投稿履歴をご紹介しています。',
  keywords: ['山田太郎', '機械学習', 'Web開発', 'Next.js', '自然言語処理', '深層学習'],
  authors: [{ name: '山田太郎' }],
  openGraph: {
    title: '山田太郎 - 個人ポートフォリオ',
    description: '○○大学情報学部准教授の山田太郎の個人ポートフォリオサイト',
    type: 'website',
    locale: 'ja_JP',
  },
};

export default function Home() {
  const profile = getProfile();
  const recentUpdates = getRecentUpdates(5);

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
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                ソーシャルメディア
              </h2>
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
                  maxItems={5}
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

          {/* Additional Information Section */}
          <section className="mt-8 sm:mt-12 bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                ポートフォリオサイトについて
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
                このサイトは、私の研究活動、開発経験、論文投稿履歴をまとめた個人ポートフォリオです。
                Next.js 16.0とTailwind CSS v4を使用して構築され、レスポンシブデザインとアクセシビリティに配慮しています。
                各セクションでは、詳細な情報をご覧いただけます。
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
