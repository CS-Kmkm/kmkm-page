"use client";

import React from 'react';
import type { ProjectDetail, TechCategoryLookup } from '@/types';
import ProjectListItem from './ProjectListItem';
import { getProjectListStyle } from '@/utils/projectList';
import { useI18n } from '@/lib/i18n';

interface AllProjectsSectionProps {
  projects: ProjectDetail[];
  technologyCategories: TechCategoryLookup;
  onProjectSelect: (project: ProjectDetail) => void;
}

const listClasses = 'grid grid-cols-1 gap-3 overflow-visible lg:grid-cols-2';

/**
 * AllProjectsSection component displays all projects.
 */
const AllProjectsSection: React.FC<AllProjectsSectionProps> = ({
  projects,
  technologyCategories,
  onProjectSelect,
}) => {
  const { messages } = useI18n();

  if (projects.length === 0) {
    return (
      <section aria-label={messages.allProjects}>
        <div className="rounded-lg bg-gray-50/80 p-4 text-center dark:bg-gray-800/60">
          <p className="text-gray-500 dark:text-gray-400 text-sm">{messages.noProjects}</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={messages.allProjects}>
      <div
        className={listClasses}
        style={getProjectListStyle()}
        role="list"
        aria-label={messages.allProjectsList}
      >
        {projects.map((project) => (
          <div key={project.id} role="listitem">
            <ProjectListItem
              project={project}
              technologyCategories={technologyCategories}
              onClick={() => onProjectSelect(project)}
              headingLevel="h3"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllProjectsSection;
