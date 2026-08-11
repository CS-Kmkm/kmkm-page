"use client";

import React, { useId, useState } from 'react';
import type { ProjectDetail, TechCategoryLookup } from '@/types';
import ProjectListItem from './ProjectListItem';
import { getProjectListStyle } from '@/utils/projectList';

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
  const [isExpanded, setIsExpanded] = useState(true);
  const contentId = useId();

  const header = (
    <div className="mb-5">
      <h2>
        <button
          type="button"
          className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-lg text-left text-xl font-bold text-gray-900 transition-colors duration-150 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-100 dark:hover:text-blue-300 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900 sm:text-2xl"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          <span className="min-w-0">全プロジェクト</span>
          <svg
            className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </h2>
    </div>
  );

  if (projects.length === 0) {
    return (
      <section aria-label="全プロジェクト">
        <div>
          {header}
          <div
            id={contentId}
            className="rounded-lg bg-gray-50/80 p-4 text-center dark:bg-gray-800/60"
            hidden={!isExpanded}
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm">プロジェクトがありません</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="全プロジェクト">
      <div>
        {header}
        <div
          id={contentId}
          className={listClasses}
          style={getProjectListStyle()}
          role="list"
          aria-label="全プロジェクト一覧"
          hidden={!isExpanded}
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
      </div>
    </section>
  );
};

export default AllProjectsSection;
