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

/**
 * Extended CareerEntry with branch structure support for Git-style timeline
 */
export interface MergeTarget {
  type: 'main' | 'entry';
  id?: string;               // Target entry ID when type is 'entry'
  at?: 'start' | 'end';      // Merge reference point
}

export interface ExtendedCareerEntry extends CareerEntry {
  parentId?: string | null;      // Parent entry ID (null = branch from main)
  branchColor?: string;          // Branch color (auto-assigned)
  branchLevel?: number;          // Hierarchy level (0=main, 1=branch, 2=sub-branch)
  mergeTargets?: MergeTarget[];  // Optional merge destinations
}

/**
 * Branch node in the career timeline tree structure
 */
export interface BranchNode {
  entry: ExtendedCareerEntry;
  parent: BranchNode | null;
  children: BranchNode[];
  level: number;
  color: string;
}

/**
 * Complete branch tree structure
 */
export interface BranchTree {
  mainBranch: BranchNode | null;
  allBranches: Map<string, BranchNode>;
}

/**
 * Computed branch data with layout information
 */
export interface ComputedBranch {
  id: string;
  entry: ExtendedCareerEntry;
  color: string;
  level: number;
  xOffset: number;           // Horizontal offset (branch position)
  yPosition: number;         // Vertical position (timeline position)
  parentBranch?: ComputedBranch;
  childBranches: ComputedBranch[];
  startY: number;            // Branch start position
  endY: number;              // Merge end position
}

/**
 * Validation error for career data
 */
export interface ValidationError {
  type: 'missing_field' | 'invalid_date' | 'circular_reference' | 'invalid_parent' | 'invalid_merge_target';
  entryId: string;
  message: string;
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
  date?: string;            // 発表・公開日（YYYY-MM-DD形式）
  doi?: string;
  url?: string;
  isFirstAuthor: boolean;
  isPeerReviewed: boolean;
  publicationType: 'journal' | 'conference' | 'workshop' | 'preprint' | 'other';
  abstract?: string;        // 論文の抄録
  imageUrl?: string;        // 説明用画像のURL
  imageAlt?: string;        // 画像の代替テキスト
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
  showScrollable?: boolean;
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

export interface PublicationFilters {
  authorshipType: 'all' | 'first-author' | 'co-author';
  publicationTypes: string[];  // 選択された論文タイプの配列
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: PublicationFilters) => void;
  currentFilters: PublicationFilters;
  availableTypes: string[];
}

export interface PublicationDetailModalProps {
  publication: PublicationEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface PublicationItemProps {
  publication: PublicationEntry;
  onClick: () => void;
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

// Dev Experience component prop interfaces
export interface TechIconProps {
  tech: TechItem;
  onClick: () => void;
}

export interface TechIconGridProps {
  techItems: TechItem[];
  onTechSelect: (tech: TechItem) => void;
}

export interface TechHeaderProps {
  tech: TechItem;
}

export interface TechDescriptionProps {
  description: string;
}

export interface ProjectListItemProps {
  project: ProjectDetail;
  onClick: () => void;
}

export interface ProjectListProps {
  projects: ProjectDetail[];
  onProjectSelect: (project: ProjectDetail) => void;
}

export interface TechDetailViewProps {
  tech: TechItem;
  projects: ProjectDetail[];
  relatedFrameworks?: TechItem[];
  relatedLanguages?: TechItem[];
  onBack: () => void;
  onProjectSelect: (project: ProjectDetail) => void;
  onRelatedTechSelect?: (tech: TechItem) => void;
}

// View state enum for Dev Experience page
export enum ViewState {
  ICON_GRID = 'icon_grid',
  LANGUAGE_DETAIL = 'language_detail'
}