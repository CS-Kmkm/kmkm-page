import { UpdateItem } from '@/types';
import UpdatesList from '@/components/ui/UpdatesList';

interface UpdatesSectionProps {
  updates: UpdateItem[];
}

export default function UpdatesSection({ updates }: UpdatesSectionProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 sm:p-2.5 lg:p-3 transition-colors duration-200">
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
