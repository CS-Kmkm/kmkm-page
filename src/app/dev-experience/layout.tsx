import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Development Experience | Portfolio',
  description: 'Programming languages, frameworks, tools, and development projects showcase',
  keywords: ['development', 'programming', 'technologies', 'projects', 'skills'],
};

export default function DevExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}