"use client";

import React from 'react';
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
  if (projects.length === 0) {
    return (
      <section className="h-full" aria-label="全プロジェクト">
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            全プロジェクト (0)
          </h3>
          <div className="rounded-lg bg-gray-50/80 p-4 text-center dark:bg-gray-800/60">
            <p className="text-gray-500 dark:text-gray-400 text-sm">プロジェクトがありません</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full" aria-label="全プロジェクト">
      <div className={sectionClasses}>
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            全プロジェクト <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({projects.length}件)</span>
          </h3>
        </div>
        <div
          className={listClasses}
          style={getProjectListStyle()}
          role="list"
          aria-label="全プロジェクト一覧"
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
