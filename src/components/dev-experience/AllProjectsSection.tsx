"use client";

import React from 'react';
import { ProjectDetail } from '@/types';
import ProjectListItem from './ProjectListItem';
import { getProjectListStyle } from '@/utils/projectList';

interface AllProjectsSectionProps {
  projects: ProjectDetail[];
  onProjectSelect: (project: ProjectDetail) => void;
}

/**
 * AllProjectsSection component displays all projects with scrollable list
 */
const AllProjectsSection: React.FC<AllProjectsSectionProps> = ({
  projects,
  onProjectSelect,
}) => {
  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            全プロジェクト (0)
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">プロジェクトがありません</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          全プロジェクト ({projects.length})
        </h3>
        <div
          className="space-y-3 overflow-y-auto pr-2 custom-scrollbar"
          style={getProjectListStyle(projects.length)}
          role="list"
          aria-label="All projects"
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
    </div>
  );
};

export default AllProjectsSection;