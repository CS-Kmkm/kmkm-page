import { ProfileInfo } from '@/types';
import ProfileSection from '@/components/ui/ProfileSection';
import SocialLinks from '@/components/ui/SocialLinks';

interface HeroSectionProps {
  profile: ProfileInfo;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-soft p-5 sm:p-6 lg:p-7 mb-5 sm:mb-6 transition-all duration-300">
      <ProfileSection
        profile={profile}
        showBio={true}
        showLocation={true}
        className="mb-1 sm:mb-2"
      />

      <div className="border-t border-gray-200/80 dark:border-gray-700/50 pt-2 sm:pt-3">
        <SocialLinks
          socialLinks={profile.socialLinks.filter((link) => link.platform !== 'website')}
          showLabels={true}
          orientation="horizontal"
        />
      </div>
    </section>
  );
}
