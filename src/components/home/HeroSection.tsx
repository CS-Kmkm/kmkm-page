import { ProfileInfo } from '@/types';
import ProfileSection from '@/components/ui/ProfileSection';
import SocialLinks from '@/components/ui/SocialLinks';

interface HeroSectionProps {
  profile: ProfileInfo;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="py-4 sm:py-6 lg:py-7">
      {/* The country is the one profile field left out: it repeats what the affiliation already
          says and would cost the compact hero a whole line on a phone. */}
      <ProfileSection
        profile={profile}
        showLocation={false}
        className="mb-0 sm:mb-1"
      >
        <SocialLinks
          socialLinks={profile.socialLinks}
          showLabels={true}
          orientation="horizontal"
          className="mt-2 sm:mt-3"
        />
      </ProfileSection>
    </section>
  );
}
