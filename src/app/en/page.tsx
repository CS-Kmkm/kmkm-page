import PageLayout from '@/components/layout/PageLayout';
import { HeroSection, UpdatesSection } from '@/components/home';
import { getLocalizedProfile, getLocalizedUpdates } from '@/data/localized';

export default function EnglishHome() {
  const profile = getLocalizedProfile('en');
  const updates = getLocalizedUpdates('en');

  return (
    <PageLayout title="Home" locale="en" className="pt-0 bg-gray-50 dark:bg-gray-900">
      <div className="transition-colors duration-200">
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 lg:pt-3 pb-6 sm:pb-8 lg:pb-10">
          <HeroSection profile={profile} />
          <div className="mt-2 sm:mt-3">
            <UpdatesSection updates={updates} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
