import { ProfileInfo } from '@/types';
import ProfileSection from '@/components/ui/ProfileSection';
import SocialLinks from '@/components/ui/SocialLinks';

interface HeroSectionProps {
  profile: ProfileInfo;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-soft p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 transition-all duration-300">
      <ProfileSection
        profile={profile}
        showBio={true}
        showLocation={true}
        className="mb-6 sm:mb-8"
      />

      <div className="border-t border-gray-200/80 dark:border-gray-700/50 pt-6 sm:pt-8">
        <SocialLinks
          socialLinks={profile.socialLinks}
          showLabels={true}
          orientation="horizontal"
        />
      </div>
    </section>
  );
}
