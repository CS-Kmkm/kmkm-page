import {
  CareerNavigationCard,
  DevExperienceNavigationCard,
  PublicationsNavigationCard
} from '@/components/ui/NavigationCard';

export default function NavigationSection() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 px-1">
          コンテンツ
        </h2>
        <div className="space-y-3 sm:space-y-4">
          <CareerNavigationCard />
          <DevExperienceNavigationCard />
          <PublicationsNavigationCard />
        </div>
      </div>
    </div>
  );
}
