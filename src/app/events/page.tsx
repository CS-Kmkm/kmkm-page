'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Events page redirect
 * This page has been merged with the Career page.
 * Redirects to /career where users can toggle between timeline and list views.
 */
export default function EventsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/career');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting to Career page...
        </p>
      </div>
    </div>
  );
}