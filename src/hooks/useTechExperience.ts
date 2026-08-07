import { useCallback, useMemo } from 'react';
import { createTechCategoryLookup } from '@/lib/devExperience';
import type { ProjectDetail, TechItem } from '@/types';

/**
 * Builds the interactive development-experience view model from server-loaded data.
 */
export const useTechExperience = (
  allTechItems: TechItem[],
  allProjects: ProjectDetail[],
) => {
  const categorizedTech = useMemo(() => ({
    languages: allTechItems.filter((item) => item.category === 'language'),
    frameworks: allTechItems.filter((item) => item.category === 'framework'),
    tools: allTechItems.filter((item) => item.category === 'tool'),
    databases: allTechItems.filter((item) => item.category === 'database'),
  }), [allTechItems]);

  const projectsById = useMemo(
    () => new Map(allProjects.map((project) => [project.id, project])),
    [allProjects],
  );

  const techCategoryByName = useMemo(
    () => createTechCategoryLookup(allTechItems),
    [allTechItems],
  );

  const getRelatedFrameworks = useCallback((tech: TechItem): TechItem[] => {
    if (!tech.relatedFrameworks) return [];
    return categorizedTech.frameworks.filter((framework) =>
      tech.relatedFrameworks?.includes(framework.name),
    );
  }, [categorizedTech.frameworks]);

  const getRelatedLanguages = useCallback((tech: TechItem): TechItem[] => {
    if (!tech.relatedLanguages) return [];
    return categorizedTech.languages.filter((language) =>
      tech.relatedLanguages?.includes(language.name),
    );
  }, [categorizedTech.languages]);

  const getProjectsForTech = useCallback((tech: TechItem): ProjectDetail[] => (
    tech.projects
      .map((projectId) => projectsById.get(projectId))
      .filter((project): project is ProjectDetail => project !== undefined)
  ), [projectsById]);

  return {
    categorizedTech,
    techCategoryByName,
    getRelatedFrameworks,
    getRelatedLanguages,
    getProjectsForTech,
  };
};
