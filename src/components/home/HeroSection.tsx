import { ProfileInfo } from '@/types';
import ProfileSection from '@/components/ui/ProfileSection';
import SocialLinks from '@/components/ui/SocialLinks';

interface HeroSectionProps {
  profile: ProfileInfo;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="py-4 sm:py-6 lg:py-7">
      <ProfileSection
        profile={profile}
        showBio={false}
        showLocation={false}
        className="mb-0 sm:mb-1"
      >
        <SocialLinks
          socialLinks={profile.socialLinks.filter((link) => link.platform !== 'website')}
          showLabels={true}
          orientation="horizontal"
          className="mt-2 sm:mt-3"
        />
      </ProfileSection>
    </section>
  );
}
