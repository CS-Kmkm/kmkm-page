/**
 * TypeScript type definitions for the personal portfolio application
 */

export interface UpdateItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'career' | 'development' | 'publication' | 'other';
}

export interface CareerEntry {
  id: string;
  year: string;
  organization: string;
  role: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  duration: string;
  role: string;
  url?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export interface TechItem {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experienceYears: number;
  projects: string[]; // ProjectDetail IDs
  description?: string;
  logoUrl?: string;
  logoAlt?: string;
}

export interface PublicationEntry {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string;
  url?: string;
  isFirstAuthor: boolean;
  isPeerReviewed: boolean;
  publicationType: 'journal' | 'conference' | 'workshop' | 'preprint' | 'other';
}

export interface SocialLink {
  id: string;
  platform: 'twitter' | 'github' | 'linkedin' | 'orcid' | 'researchgate' | 'email' | 'website';
  url: string;
  username?: string;
  iconUrl?: string;
}

export interface ProfileInfo {
  name: string;
  nameEn?: string; // English name (optional)
  nameJa?: string; // Japanese reading (optional)
  currentAffiliation: string;
  currentPosition: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  socialLinks: SocialLink[];
}

// Component prop interfaces
export interface HeaderProps {
  currentPath?: string;
}

export interface FooterProps {
  className?: string;
}

export interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

export interface UpdatesListProps {
  updates: UpdateItem[];
  maxItems?: number;
}

export interface TimelineProps {
  entries: CareerEntry[];
  className?: string;
}

export interface TechGridProps {
  techItems: TechItem[];
  projectDetails: ProjectDetail[];
  showProjects?: boolean;
}

export interface PublicationListProps {
  publications: PublicationEntry[];
  showFilters?: boolean;
}

export interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface ProjectModalProps {
  project: ProjectDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface TechBadgeProps {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database';
  experienceYears: number;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  logoUrl?: string;
  logoAlt?: string;
  onClick?: () => void;
  className?: string;
}

export interface ProfileSectionProps {
  profile: ProfileInfo;
  showBio?: boolean;
  showLocation?: boolean;
  className?: string;
}

export interface SocialLinksProps {
  socialLinks: SocialLink[];
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}