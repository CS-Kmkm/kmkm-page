import { UpdateItem, CareerEntry, ExtendedCareerEntry, TechItem, ProjectDetail, PublicationEntry, ProfileInfo, EventEntry, EventFilters, EventCategory } from '@/types';

// Import JSON data with error handling
let publicationsData: { publications: PublicationEntry[] } | null = null;
let techExperienceData: { technologies: TechItem[]; projects: ProjectDetail[] } | null = null;
let careerData: { entries: CareerEntry[] } | null = null;
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
  const projects = data?.projects || [];
  
  // Sort projects by duration (most recent first)
  return projects.sort((a, b) => {
    // Extract year from duration string (e.g., "2025年9月" -> 2025)
    const getYear = (duration: string): number => {
      const match = duration.match(/(\d{4})/);
      return match ? parseInt(match[1]) : 0;
    };
    
    const getMonth = (duration: string): number => {
      const match = duration.match(/(\d{4})年(\d{1,2})月/);
      return match ? parseInt(match[2]) : 0;
    };
    
    const aYear = getYear(a.duration);
    const bYear = getYear(b.duration);
    const aMonth = getMonth(a.duration);
    const bMonth = getMonth(b.duration);
    
    // Sort by year first, then by month (most recent first)
    if (aYear !== bYear) {
      return bYear - aYear;
    }
    return bMonth - aMonth;
  });
};

export const getCareerEntries = (): CareerEntry[] => {
  const data = loadCareerData();
  return data?.entries || [];
};

export const getUpdates = (): UpdateItem[] => {
  // Generate updates from events data
  const events = getEvents();
  
  return events.map(event => ({
    id: event.id,
    date: event.date,
    title: event.title,
    description: event.description,
    category: mapEventCategoryToUpdateCategory(event.category)
  }));
};

// Helper function to map event categories to update categories
function mapEventCategoryToUpdateCategory(eventCategory: EventCategory): UpdateItem['category'] {
  switch (eventCategory) {
    case EventCategory.AFFILIATION:
      return 'career';
    case EventCategory.PUBLICATION:
      return 'publication';
    case EventCategory.EVENT:
    case EventCategory.INTERNSHIP:
    case EventCategory.AWARD:
      return 'development';
    case EventCategory.OTHER:
    default:
      return 'other';
  }
}

export const getProfile = (): ProfileInfo => {
  const profile = loadProfileData();
  return profile || {
    name: '',
    currentAffiliation: '',
    currentPosition: '',
    socialLinks: []
  } as ProfileInfo;
};

export const getEvents = (): EventEntry[] => {
  // Generate events from existing data sources
  const events: EventEntry[] = [];
  
  // 1. Generate events from career data (affiliation changes)
  const careerEntries = getCareerEntries();
  careerEntries.forEach(career => {
    // Only include main career entries (not sub-entries with parentId)
    const extendedCareer = career as ExtendedCareerEntry;
    if (!extendedCareer.parentId) {
      const startYear = new Date(career.startDate).getFullYear();
      
      // Generate start event (入学/着任)
      let startTitle = '';
      let startDescription = career.description || '';
      
      if (career.organization.includes('小学校') || career.organization.includes('中学校') || career.organization.includes('高等学校')) {
        startTitle = `${career.organization} ${career.role === '生徒' ? '入学' : '着任'}`;
      } else if (career.organization.includes('大学')) {
        startTitle = `${career.organization} ${career.role === '学部学生' ? '入学' : career.role.includes('大学院生') ? '入学' : '着任'}`;
      } else {
        startTitle = `${career.organization} ${career.role} 着任`;
      }
      
      const location = career.organization.includes('名古屋大学') ? '名古屋大学' : 
                      career.organization.includes('岐阜') ? '岐阜県' : undefined;
      
      events.push({
        id: `career-start-${career.id}`,
        title: startTitle,
        description: startDescription,
        date: career.startDate,
        year: startYear,
        category: EventCategory.AFFILIATION,
        location,
        tags: ['education', 'career', 'start']
      });
      
      // Generate end event (卒業/退職) if endDate exists
      if (career.endDate) {
        const endYear = new Date(career.endDate).getFullYear();
        let endTitle = '';
        let endDescription = '';
        
        if (career.organization.includes('小学校') || career.organization.includes('中学校') || career.organization.includes('高等学校')) {
          endTitle = `${career.organization} ${career.role === '生徒' ? '卒業' : '退職'}`;
          endDescription = `${career.organization}を卒業`;
        } else if (career.organization.includes('大学')) {
          if (career.role === '学部学生') {
            endTitle = `${career.organization} 卒業`;
            endDescription = `${career.organization}を卒業`;
          } else if (career.role.includes('大学院生')) {
            endTitle = `${career.organization} 修了`;
            endDescription = `${career.organization}を修了`;
          } else {
            endTitle = `${career.organization} ${career.role} 退職`;
            endDescription = `${career.organization}での${career.role}を終了`;
          }
        } else {
          endTitle = `${career.organization} ${career.role} 退職`;
          endDescription = `${career.organization}での${career.role}を終了`;
        }
        
        events.push({
          id: `career-end-${career.id}`,
          title: endTitle,
          description: endDescription,
          date: career.endDate,
          year: endYear,
          category: EventCategory.AFFILIATION,
          location,
          tags: ['education', 'career', 'end']
        });
      }
    }
  });
  
  // 2. Generate events from publications data
  const publications = getPublications();
  publications.forEach(pub => {
    if (pub.date) {
      const pubYear = new Date(pub.date).getFullYear();
      const authorshipType = pub.isFirstAuthor ? 'first-author' : 'co-author';
      const reviewType = pub.isPeerReviewed ? 'peer-reviewed' : 'non-peer-reviewed';
      
      events.push({
        id: `pub-${pub.id}`,
        title: `${pub.venue} 論文発表`,
        description: `「${pub.title}」を${pub.isFirstAuthor ? '第一著者として' : '共著者として'}発表`,
        date: pub.date,
        year: pubYear,
        category: EventCategory.PUBLICATION,
        location: pub.venue,
        relatedLinks: pub.url ? [pub.url] : undefined,
        tags: ['research', 'publication', authorshipType, reviewType, pub.publicationType]
      });
    }
  });
  
  // 3. Generate events from tech experience projects (internships and events)
  const projects = getProjectDetails();
  projects.forEach(project => {
    // Extract year from duration string
    const yearMatch = project.duration.match(/(\d{4})/);
    if (yearMatch) {
      const projectYear = parseInt(yearMatch[1]);
      const monthMatch = project.duration.match(/(\d{1,2})月/);
      const dayMatch = project.duration.match(/(\d{1,2})日/);
      const projectMonth = monthMatch ? monthMatch[1].padStart(2, '0') : '01';
      const projectDay = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
      const projectDate = `${projectYear}-${projectMonth}-${projectDay}`;
      
      let category: EventCategory = EventCategory.OTHER;
      let title = project.name;
      
      // Skip personal development projects and coursework (except portfolio site)
      if ((project.name.includes('個人開発') && !project.name.includes('ポートフォリオ')) || 
          project.name.includes('Webスクレイピング') ||
          project.name.includes('Chrome拡張機能') ||
          project.name.includes('競技プログラミング') ||
          project.name.includes('データ分析・実験') ||
          project.name.includes('PBL') ||
          project.name.includes('生成AIチャットボット開発')) {
        return;
      }
      
      // Categorize based on project name
      if (project.name.includes('インターンシップ')) {
        category = EventCategory.INTERNSHIP;
      } else if (project.name.includes('JPHACKS') || project.name.includes('技育祭')) {
        category = EventCategory.EVENT;
        if (project.name.includes('JPHACKS')) {
          title = `${project.name} 参加`;
        } else if (project.name.includes('技育祭')) {
          title = project.name;
        }
      } else if (project.name.includes('ポートフォリオサイト')) {
        category = EventCategory.OTHER;
        title = project.name;
      } else if (project.name.includes('アルバイト')) {
        // Include work projects as 'other' category instead of skipping
        category = EventCategory.OTHER;
        title = project.name;
      }
      
      // Determine location
      let location = undefined;
      if (project.name.includes('SmartHR')) {
        location = 'SmartHR';
      } else if (project.name.includes('トヨタシステムズ')) {
        location = 'トヨタシステムズ';
      } else if (project.name.includes('ラクスル')) {
        location = 'ラクスル';
      } else if (project.name.includes('JPHACKS')) {
        location = 'ハッカソン会場';
      }
      
      events.push({
        id: `project-${project.id}`,
        title,
        description: project.description,
        date: projectDate,
        year: projectYear,
        category,
        location,
        duration: project.duration,
        relatedLinks: project.githubUrl ? [project.githubUrl] : undefined,
        tags: ['development', ...project.technologies.slice(0, 3)]
      });
    }
  });
  
  // Sort events by date in descending order (most recent first)
  const sortedEvents = events.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  

  
  return sortedEvents;
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

// Event utility functions
export const filterEvents = (events: EventEntry[], filters: EventFilters): EventEntry[] => {
  return events.filter(event => {
    // If no filters are active, show all events
    const hasActiveFilters = Object.values(filters).some(filter => filter);
    if (!hasActiveFilters) {
      return true;
    }

    // Check if event matches any active filter
    switch (event.category) {
      case 'affiliation':
        return filters.showAffiliation;
      case 'publication':
        return filters.showPublication;
      case 'event':
        return filters.showEvent;
      case 'internship':
        return filters.showInternship;
      case 'award':
        return filters.showAward;
      case 'other':
        return filters.showOther;
      default:
        return false;
    }
  });
};

export const getEventsByCategory = (category: EventEntry['category']): EventEntry[] => {
  return getEvents().filter(event => event.category === category);
};

export const getEventsByYear = (year: number): EventEntry[] => {
  return getEvents().filter(event => event.year === year);
};

export const getRecentEvents = (limit: number = 5): EventEntry[] => {
  return getEvents().slice(0, limit);
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

    // 6. Validate Updates Data (dynamically generated from events)
    try {
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
    } catch (updateError) {
      errors.push(`Update generation error: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`);
    }

    // 7. Validate Events Data (dynamically generated)
    try {
      const events = getEvents();
      
      events.forEach((event, index) => {
        if (!event.id) {
          errors.push(`Event: Entry at index ${index} missing required field "id"`);
        }
        if (!event.title) {
          errors.push(`Event: Entry "${event.id || index}" missing required field "title"`);
        }
        if (!event.description) {
          errors.push(`Event: Entry "${event.id || index}" missing required field "description"`);
        }
        if (!event.date) {
          errors.push(`Event: Entry "${event.id || index}" missing required field "date"`);
        } else if (!isValidDate(event.date)) {
          errors.push(`Event: Entry "${event.id}" has invalid date format: "${event.date}" (expected YYYY-MM-DD)`);
        }
        if (!event.year) {
          errors.push(`Event: Entry "${event.id || index}" missing required field "year"`);
        }
        if (!event.category) {
          errors.push(`Event: Entry "${event.id || index}" missing required field "category"`);
        }

        // Validate year consistency with date
        if (event.date && event.year) {
          const dateYear = new Date(event.date).getFullYear();
          if (dateYear !== event.year) {
            errors.push(`Event: Entry "${event.id}" has inconsistent year (date: ${dateYear}, year field: ${event.year})`);
          }
        }

        // Validate optional URL fields
        if (event.relatedLinks) {
          event.relatedLinks.forEach((link, linkIndex) => {
            if (!isValidUrl(link)) {
              errors.push(`Event: Entry "${event.id}" has invalid URL format in relatedLinks[${linkIndex}]: "${link}"`);
            }
          });
        }
      });
    } catch (eventError) {
      errors.push(`Event generation error: ${eventError instanceof Error ? eventError.message : 'Unknown error'}`);
    }

  } catch (error) {
    errors.push(`Data validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};