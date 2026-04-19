import { getProfile, getRecentUpdates } from '@/data';
import PageLayout from '@/components/layout/PageLayout';
import { HeroSection, UpdatesSection } from '@/components/home';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata();

export default function Home() {
  const profile = getProfile();
  const recentUpdates = getRecentUpdates(3);

  return (
    <PageLayout title="トップページ">
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
          <HeroSection profile={profile} />

          <div className="mt-8">
            <UpdatesSection updates={recentUpdates} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
