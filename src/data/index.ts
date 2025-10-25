import { UpdateItem, CareerEntry, TechItem, ProjectDetail, PublicationEntry, ProfileInfo } from '@/types';

// Import JSON data with error handling
let publicationsData: { publications: PublicationEntry[] } | null = null;
let techExperienceData: { technologies: TechItem[]; projects: ProjectDetail[] } | null = null;
let careerData: { entries: CareerEntry[] } | null = null;
let updatesData: { updates: UpdateItem[] } | null = null;
let profileData: ProfileInfo | null = null;

// Helper function to safely load JSON data
function safeLoadData<T>(loader: () => T, fallback: T): T {
  try {
    return loader();
  } catch (error) {
    console.error('Error loading data:', error);
    return fallback;
  }
}

// Import JSON data directly
import publicationsJson from './publications.json';
import techExperienceJson from './tech-experience.json';
import careerJson from './career.json';
import updatesJson from './updates.json';
import profileJson from './profile.json';

// Lazy loading functions with error handling
function loadPublicationsData() {
  if (!publicationsData) {
    publicationsData = safeLoadData(
      () => publicationsJson as unknown as { publications: PublicationEntry[] },
      { publications: [] }
    );
  }
  return publicationsData;
}

function loadTechExperienceData() {
  if (!techExperienceData) {
    techExperienceData = safeLoadData(
      () => techExperienceJson as unknown as { technologies: TechItem[]; projects: ProjectDetail[] },
      { technologies: [], projects: [] }
    );
  }
  return techExperienceData;
}

function loadCareerData() {
  if (!careerData) {
    careerData = safeLoadData(
      () => careerJson as unknown as { entries: CareerEntry[] },
      { entries: [] }
    );
  }
  return careerData;
}

function loadUpdatesData() {
  if (!updatesData) {
    updatesData = safeLoadData(
      () => updatesJson as unknown as { updates: UpdateItem[] },
      { updates: [] }
    );
  }
  return updatesData;
}

function loadProfileData() {
  if (!profileData) {
    profileData = safeLoadData(
      () => profileJson as unknown as ProfileInfo,
      {
        name: '',
        currentAffiliation: '',
        currentPosition: '',
        socialLinks: []
      } as ProfileInfo
    );
  }
  return profileData;
}

// Export data loading functions
export const getPublications = (): PublicationEntry[] => {
  const data = loadPublicationsData();
  return data?.publications || [];
};

export const getTechExperience = (): TechItem[] => {
  const data = loadTechExperienceData();
  return data?.technologies || [];
};

export const getProjectDetails = (): ProjectDetail[] => {
  const data = loadTechExperienceData();
  return data?.projects || [];
};

export const getCareerEntries = (): CareerEntry[] => {
  const data = loadCareerData();
  return data?.entries || [];
};

export const getUpdates = (): UpdateItem[] => {
  const data = loadUpdatesData();
  return data?.updates || [];
};

export const getProfile = (): ProfileInfo => {
  const profile = loadProfileData();
  return profile || {
    name: '',
    currentAffiliation: '',
    currentPosition: '',
    socialLinks: []
  } as ProfileInfo;
};

// Utility functions for project and technology relationships
export const getProjectById = (id: string): ProjectDetail | undefined => {
  const projects = getProjectDetails();
  return projects.find(project => project.id === id);
};

export const getProjectsForTech = (techId: string): ProjectDetail[] => {
  const technologies = getTechExperience();
  const tech = technologies.find(t => t.id === techId);

  if (!tech) {
    console.warn(`Technology with id "${techId}" not found`);
    return [];
  }

  const projects = tech.projects
    .map(projectId => getProjectById(projectId))
    .filter((project): project is ProjectDetail => project !== undefined);

  if (projects.length !== tech.projects.length) {
    console.warn(`Some projects for technology "${techId}" were not found`);
  }

  return projects;
};

// Additional utility functions for data filtering and sorting
export const getPublicationsByType = (type: PublicationEntry['publicationType']): PublicationEntry[] => {
  return getPublications().filter(pub => pub.publicationType === type);
};

export const getFirstAuthorPublications = (): PublicationEntry[] => {
  return getPublications().filter(pub => pub.isFirstAuthor);
};

export const getPeerReviewedPublications = (): PublicationEntry[] => {
  return getPublications().filter(pub => pub.isPeerReviewed);
};

export const getRecentUpdates = (limit: number = 5): UpdateItem[] => {
  return getUpdates()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const getUpdatesByCategory = (category: UpdateItem['category']): UpdateItem[] => {
  return getUpdates().filter(update => update.category === category);
};

export const getTechByCategory = (category: TechItem['category']): TechItem[] => {
  return getTechExperience().filter(tech => tech.category === category);
};

export const getTechByProficiency = (proficiency: TechItem['proficiency']): TechItem[] => {
  return getTechExperience().filter(tech => tech.proficiency === proficiency);
};

// Data validation helpers
export const validateDataIntegrity = (): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  try {
    // Check if all referenced projects exist
    const technologies = getTechExperience();
    const projects = getProjectDetails();
    const projectIds = new Set(projects.map(p => p.id));

    technologies.forEach(tech => {
      tech.projects.forEach(projectId => {
        if (!projectIds.has(projectId)) {
          errors.push(`Technology "${tech.name}" references non-existent project "${projectId}"`);
        }
      });
    });

    // Check if profile data is complete
    const profile = getProfile();
    if (!profile.name || !profile.currentAffiliation || !profile.currentPosition) {
      errors.push('Profile data is incomplete (missing name, affiliation, or position)');
    }

    // Check if social links are valid
    profile.socialLinks.forEach(link => {
      if (!link.url || !link.platform) {
        errors.push(`Invalid social link: ${JSON.stringify(link)}`);
      }
    });

  } catch (error) {
    errors.push(`Data validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};