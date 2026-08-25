import { getProfile, getUpdates } from '@/data';
import PageLayout from '@/components/layout/PageLayout';
import { HeroSection, UpdatesSection } from '@/components/home';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata();

export default function Home() {
  const profile = getProfile();
  const updates = getUpdates();

  return (
    <PageLayout title="トップページ" className="pt-0">
      <div className="transition-colors duration-200">
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 lg:pt-3 pb-6 sm:pb-8 lg:pb-10">
          <HeroSection profile={profile} />

          <div className="mt-3 sm:mt-5">
            <UpdatesSection updates={updates} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
