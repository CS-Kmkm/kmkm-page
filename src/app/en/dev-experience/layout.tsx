import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  locale: 'en',
  title: 'Development Experience',
  path: '/en/dev-experience',
  description: 'Technologies, related projects, and software development experience.',
  keywords: ['development experience', 'programming languages', 'frameworks', 'projects', 'technology stack'],
});

export default function EnglishDevExperienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
