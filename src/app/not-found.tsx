import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          404 - ページが見つかりません
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          お探しのページは移動したか、現在は公開されていない可能性があります。
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            トップへ戻る
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            次のページもご覧いただけます
          </div>

          <div className="space-y-2 text-sm">
            <Link
              href="/career"
              className="block text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
            >
              経歴
            </Link>
            <Link
              href="/dev-experience"
              className="block text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
            >
              開発経験
            </Link>
            <Link
              href="/publications"
              className="block text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
            >
              論文・発表
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
