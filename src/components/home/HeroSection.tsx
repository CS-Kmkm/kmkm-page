import { ProfileInfo } from '@/types';
import ProfileSection from '@/components/ui/ProfileSection';
import SocialLinks from '@/components/ui/SocialLinks';

interface HeroSectionProps {
  profile: ProfileInfo;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 transition-colors duration-200">
      <ProfileSection
        profile={profile}
        showBio={true}
        showLocation={true}
        className="mb-4 sm:mb-6"
      />

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 mt-4 sm:mt-6">
        <SocialLinks
          socialLinks={profile.socialLinks}
          showLabels={true}
          orientation="horizontal"
        />
      </div>
    </section>
  );
}
