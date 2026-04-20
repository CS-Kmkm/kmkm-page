import { getProfile, getRecentUpdates } from '@/data';
import PageLayout from '@/components/layout/PageLayout';
import { HeroSection, UpdatesSection } from '@/components/home';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata();

export default function Home() {
  const profile = getProfile();
  const recentUpdates = getRecentUpdates(3);

  return (
    <PageLayout title="トップページ" className="pt-1 sm:pt-2 lg:pt-3">
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 lg:pt-6 pb-8 sm:pb-10 lg:pb-14">
          <HeroSection profile={profile} />

          <div className="mt-4 sm:mt-5">
            <UpdatesSection updates={recentUpdates} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
