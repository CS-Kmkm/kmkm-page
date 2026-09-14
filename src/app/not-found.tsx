import NotFoundContent from '@/components/common/NotFoundContent';

// This boundary answers every unmatched URL of both locale trees. A prerendered 404 shell would
// freeze the copy and the document language to the build-time pathname, so it renders per request.
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return <NotFoundContent />;
}
