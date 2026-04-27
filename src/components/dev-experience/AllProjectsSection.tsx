"use client";

import React, { useId, useState } from 'react';
import { ProjectDetail } from '@/types';
import ProjectListItem from './ProjectListItem';
import { getProjectListStyle } from '@/utils/projectList';

interface AllProjectsSectionProps {
  projects: ProjectDetail[];
  onProjectSelect: (project: ProjectDetail) => void;
}

const sectionClasses = 'xl:h-[var(--experience-panel-height)] xl:flex xl:flex-col';
const listClasses = 'space-y-3 overflow-visible custom-scrollbar xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-2';

/**
 * AllProjectsSection component displays all projects.
 */
const AllProjectsSection: React.FC<AllProjectsSectionProps> = ({
  projects,
  onProjectSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const contentId = useId();

  const header = (
    <div className="mb-4 border-b border-gray-200 pb-3 dark:border-gray-700">
      <h3>
        <button
          type="button"
          className="group flex min-h-10 w-full items-center justify-between gap-3 rounded-md text-left text-lg font-semibold text-gray-900 transition-colors duration-150 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-100 dark:hover:text-blue-300 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          <span className="min-w-0">
            全プロジェクト <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({projects.length}件)</span>
          </span>
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
      </h3>
    </div>
  );

  if (projects.length === 0) {
    return (
      <section className="h-full" aria-label="全プロジェクト">
        <div className={sectionClasses}>
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
    <section className="h-full" aria-label="全プロジェクト">
      <div className={sectionClasses}>
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
                onClick={() => onProjectSelect(project)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllProjectsSection;
