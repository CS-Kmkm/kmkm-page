import { UpdateItem } from '@/types';
import UpdatesList from '@/components/ui/UpdatesList';

interface UpdatesSectionProps {
  updates: UpdateItem[];
}

export default function UpdatesSection({ updates }: UpdatesSectionProps) {
  return (
    <div className="lg:col-span-2">
      <div className="border-t border-gray-200/80 py-4 dark:border-gray-700/60 sm:py-5">
        <UpdatesList
          updates={updates}
          maxItems={1}
          showScrollable={false}
          autoFitToViewport
          moreItemsHref="/career?view=list#list-heading"
        />
      </div>
    </div>
  );
}
