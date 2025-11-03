import { Metadata } from 'next';
import { PageLayout } from '@/components/common';
import EventList from '@/components/ui/EventList';
import { getEvents } from '@/data';

export const metadata: Metadata = {
  title: 'Events | Personal Portfolio',
  description: 'Academic and professional events including affiliation changes, publications, event participation, and internships.',
  keywords: ['events', 'timeline', 'career', 'academic events', 'professional activities', 'publications', 'internships'],
};

export default function EventsPage() {
  const events = getEvents();

  return (
    <PageLayout title="Events">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Events</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            学術・職業活動における重要なイベントを時系列で表示しています。所属の変化、論文の投稿、イベントへの参加、インターンシップなどの情報をカテゴリ別にフィルタリングできます。
          </p>
        </div>

        {/* Events List */}
        <div className="bg-white">
          {events.length > 0 ? (
            <EventList events={events} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M3 7h18M5 7h14l-1 14H6L5 7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Events Available
              </h3>
              <p className="text-gray-500">
                イベントが登録されていません。イベントが追加されると、ここに表示されます。
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}