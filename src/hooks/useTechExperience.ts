import { useMemo } from 'react';
import { getTechExperience, getProjectDetails } from '@/data';
import { TechItem, ProjectDetail } from '@/types';

/**
 * Custom hook for managing tech experience data and related logic
 */
export const useTechExperience = () => {
  const allTechItems = getTechExperience();
  const allProjects = getProjectDetails();

  // Categorize tech items
  const categorizedTech = useMemo(() => {
    const languages = allTechItems.filter(item => item.category === 'language');
    const frameworks = allTechItems.filter(item => item.category === 'framework');
    const tools = allTechItems.filter(item => item.category === 'tool');
    const databases = allTechItems.filter(item => item.category === 'database');

    return { languages, frameworks, tools, databases };
  }, [allTechItems]);

  // Get related frameworks for a language based on explicit relationships
  const getRelatedFrameworks = (tech: TechItem): TechItem[] => {
    if (!tech.relatedFrameworks) return [];
    return categorizedTech.frameworks.filter(framework =>
      tech.relatedFrameworks!.includes(framework.name)
    );
  };

  // Get related languages for a framework based on explicit relationships
  const getRelatedLanguages = (tech: TechItem): TechItem[] => {
    if (!tech.relatedLanguages) return [];
    return categorizedTech.languages.filter(language =>
      tech.relatedLanguages!.includes(language.name)
    );
  };

  // Get projects for selected tech
  const getProjectsForTech = (tech: TechItem): ProjectDetail[] => {
    return tech.projects
      .map(projectId => allProjects.find(p => p.id === projectId))
      .filter((project): project is ProjectDetail => project !== undefined);
  };

  return {
    allTechItems,
    allProjects,
    categorizedTech,
    getRelatedFrameworks,
    getRelatedLanguages,
    getProjectsForTech,
  };
};