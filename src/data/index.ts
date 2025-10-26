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
    // Helper function to validate date format (YYYY-MM-DD)
    const isValidDate = (dateStr: string | null): boolean => {
      if (dateStr === null) return true; // null is valid for endDate
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateStr)) return false;
      const date = new Date(dateStr);
      return date instanceof Date && !isNaN(date.getTime());
    };

    // Helper function to validate URL format
    const isValidUrl = (urlStr: string): boolean => {
      try {
        new URL(urlStr);
        return true;
      } catch {
        return false;
      }
    };

    // 1. Validate Profile Data
    const profile = getProfile();
    
    // Check required fields
    if (!profile.name) {
      errors.push('Profile: Missing required field "name"');
    }
    if (!profile.currentAffiliation) {
      errors.push('Profile: Missing required field "currentAffiliation"');
    }
    if (!profile.currentPosition) {
      errors.push('Profile: Missing required field "currentPosition"');
    }

    // Validate social links
    profile.socialLinks.forEach((link, index) => {
      if (!link.id) {
        errors.push(`Profile: Social link at index ${index} missing required field "id"`);
      }
      if (!link.platform) {
        errors.push(`Profile: Social link "${link.id || index}" missing required field "platform"`);
      }
      if (!link.url) {
        errors.push(`Profile: Social link "${link.id || index}" missing required field "url"`);
      } else if (!isValidUrl(link.url)) {
        errors.push(`Profile: Social link "${link.id}" has invalid URL format: "${link.url}"`);
      }
      if (!link.username) {
        errors.push(`Profile: Social link "${link.id || index}" missing required field "username"`);
      }
    });

    // 2. Validate Career Data
    const careerEntries = getCareerEntries();
    
    careerEntries.forEach((entry, index) => {
      if (!entry.id) {
        errors.push(`Career: Entry at index ${index} missing required field "id"`);
      }
      if (!entry.organization) {
        errors.push(`Career: Entry "${entry.id || index}" missing required field "organization"`);
      }
      if (!entry.role) {
        errors.push(`Career: Entry "${entry.id || index}" missing required field "role"`);
      }
      if (!entry.startDate) {
        errors.push(`Career: Entry "${entry.id || index}" missing required field "startDate"`);
      } else if (!isValidDate(entry.startDate)) {
        errors.push(`Career: Entry "${entry.id}" has invalid startDate format: "${entry.startDate}" (expected YYYY-MM-DD)`);
      }
      
      if (entry.endDate !== undefined && entry.endDate !== null && !isValidDate(entry.endDate)) {
        errors.push(`Career: Entry "${entry.id}" has invalid endDate format: "${entry.endDate}" (expected YYYY-MM-DD or null)`);
      }

      // Check date logic
      if (entry.startDate && entry.endDate) {
        const start = new Date(entry.startDate);
        const end = new Date(entry.endDate);
        if (start > end) {
          errors.push(`Career: Entry "${entry.id}" has startDate after endDate`);
        }
      }
    });

    // 3. Validate Publications Data
    const publications = getPublications();
    
    publications.forEach((pub, index) => {
      if (!pub.id) {
        errors.push(`Publication: Entry at index ${index} missing required field "id"`);
      }
      if (!pub.title) {
        errors.push(`Publication: Entry "${pub.id || index}" missing required field "title"`);
      }
      if (!pub.authors || pub.authors.length === 0) {
        errors.push(`Publication: Entry "${pub.id || index}" missing required field "authors" or authors array is empty`);
      }
      if (!pub.venue) {
        errors.push(`Publication: Entry "${pub.id || index}" missing required field "venue"`);
      }
      if (!pub.year) {
        errors.push(`Publication: Entry "${pub.id || index}" missing required field "year"`);
      }
      if (pub.isFirstAuthor === undefined) {
        errors.push(`Publication: Entry "${pub.id || index}" missing required field "isFirstAuthor"`);
      }
      if (pub.isPeerReviewed === undefined) {
        errors.push(`Publication: Entry "${pub.id || index}" missing required field "isPeerReviewed"`);
      }
      if (!pub.publicationType) {
        errors.push(`Publication: Entry "${pub.id || index}" missing required field "publicationType"`);
      }

      // Validate optional URL fields
      if (pub.url && !isValidUrl(pub.url)) {
        errors.push(`Publication: Entry "${pub.id}" has invalid URL format: "${pub.url}"`);
      }
      if (pub.doi && typeof pub.doi !== 'string') {
        errors.push(`Publication: Entry "${pub.id}" has invalid DOI format`);
      }
    });

    // 4. Validate Tech Experience Data
    const technologies = getTechExperience();
    const projects = getProjectDetails();
    const projectIds = new Set(projects.map(p => p.id));

    technologies.forEach((tech, index) => {
      if (!tech.id) {
        errors.push(`Technology: Entry at index ${index} missing required field "id"`);
      }
      if (!tech.name) {
        errors.push(`Technology: Entry "${tech.id || index}" missing required field "name"`);
      }
      if (!tech.category) {
        errors.push(`Technology: Entry "${tech.id || index}" missing required field "category"`);
      }
      if (!tech.proficiency) {
        errors.push(`Technology: Entry "${tech.id || index}" missing required field "proficiency"`);
      }
      if (tech.experienceYears === undefined) {
        errors.push(`Technology: Entry "${tech.id || index}" missing required field "experienceYears"`);
      }
      if (!tech.projects) {
        errors.push(`Technology: Entry "${tech.id || index}" missing required field "projects"`);
      }

      // Check reference integrity
      if (tech.projects) {
        tech.projects.forEach(projectId => {
          if (!projectIds.has(projectId)) {
            errors.push(`Technology: "${tech.name}" (${tech.id}) references non-existent project "${projectId}"`);
          }
        });
      }
    });

    // 5. Validate Projects Data
    projects.forEach((project, index) => {
      if (!project.id) {
        errors.push(`Project: Entry at index ${index} missing required field "id"`);
      }
      if (!project.name) {
        errors.push(`Project: Entry "${project.id || index}" missing required field "name"`);
      }
      if (!project.description) {
        errors.push(`Project: Entry "${project.id || index}" missing required field "description"`);
      }
      if (!project.technologies || project.technologies.length === 0) {
        errors.push(`Project: Entry "${project.id || index}" missing required field "technologies" or technologies array is empty`);
      }
      if (!project.duration) {
        errors.push(`Project: Entry "${project.id || index}" missing required field "duration"`);
      }
      if (!project.role) {
        errors.push(`Project: Entry "${project.id || index}" missing required field "role"`);
      }

      // Validate optional URL fields
      if (project.url && !isValidUrl(project.url)) {
        errors.push(`Project: Entry "${project.id}" has invalid URL format: "${project.url}"`);
      }
      if (project.githubUrl && !isValidUrl(project.githubUrl)) {
        errors.push(`Project: Entry "${project.id}" has invalid githubUrl format: "${project.githubUrl}"`);
      }
    });

    // 6. Validate Updates Data
    const updates = getUpdates();
    
    updates.forEach((update, index) => {
      if (!update.id) {
        errors.push(`Update: Entry at index ${index} missing required field "id"`);
      }
      if (!update.date) {
        errors.push(`Update: Entry "${update.id || index}" missing required field "date"`);
      } else if (!isValidDate(update.date)) {
        errors.push(`Update: Entry "${update.id}" has invalid date format: "${update.date}" (expected YYYY-MM-DD)`);
      }
      if (!update.title) {
        errors.push(`Update: Entry "${update.id || index}" missing required field "title"`);
      }
      if (!update.description) {
        errors.push(`Update: Entry "${update.id || index}" missing required field "description"`);
      }
      if (!update.category) {
        errors.push(`Update: Entry "${update.id || index}" missing required field "category"`);
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