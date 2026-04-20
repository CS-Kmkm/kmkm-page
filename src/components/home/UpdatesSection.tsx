import { UpdateItem } from '@/types';
import UpdatesList from '@/components/ui/UpdatesList';

interface UpdatesSectionProps {
  updates: UpdateItem[];
}

export default function UpdatesSection({ updates }: UpdatesSectionProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 lg:p-5 transition-colors duration-200">
        <UpdatesList
          updates={updates}
          maxItems={3}
          showScrollable={false}
        />
      </div>
    </div>
  );
}
