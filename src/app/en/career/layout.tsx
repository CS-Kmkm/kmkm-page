import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  locale: 'en',
  title: 'Career',
  path: '/en/career',
  description: 'A chronological overview of education, research, development activities, and event participation.',
  keywords: ['career', 'education', 'research', 'software development', 'events'],
});

export default function EnglishCareerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
