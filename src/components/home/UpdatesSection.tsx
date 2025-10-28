import { UpdateItem } from '@/types';
import UpdatesList from '@/components/ui/UpdatesList';

interface UpdatesSectionProps {
  updates: UpdateItem[];
}

export default function UpdatesSection({ updates }: UpdatesSectionProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
        <UpdatesList
          updates={updates}
          maxItems={3}
          showScrollable={true}
        />
      </div>
    </div>
  );
}
