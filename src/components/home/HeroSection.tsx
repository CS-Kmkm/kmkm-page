import { ProfileInfo } from '@/types';
import ProfileSection from '@/components/ui/ProfileSection';
import SocialLinks from '@/components/ui/SocialLinks';

interface HeroSectionProps {
  profile: ProfileInfo;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-soft p-4 sm:p-5 lg:p-5 mb-2 sm:mb-3 transition-all duration-300">
      <ProfileSection
        profile={profile}
        showBio={false}
        showLocation={false}
        className="mb-0 sm:mb-1"
      />

      <div className="border-t border-gray-200/80 dark:border-gray-700/50 pt-1.5 sm:pt-2">
        <SocialLinks
          socialLinks={profile.socialLinks.filter((link) => link.platform !== 'website')}
          showLabels={true}
          orientation="horizontal"
        />
      </div>
    </section>
  );
}
