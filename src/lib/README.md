# Metadata Utility

This directory contains utility functions for generating metadata in Next.js App Router pages.

## Usage

In your page files, use the `generatePageMetadata` function to create SEO-friendly metadata:

```typescript
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Career',
  description: 'My professional career timeline and experience.',
  path: '/career',
});

export default function CareerPage() {
  return (
    <PageLayout title="Career">
      {/* Page content */}
    </PageLayout>
  );
}
```

The metadata utility provides:
- Open Graph tags for social media sharing
- Twitter Card metadata
- Canonical URLs
- Proper title formatting
- SEO-optimized meta tags
- Accessibility considerations