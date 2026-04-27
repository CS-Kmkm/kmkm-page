"use client";

import React from 'react';
import { ProjectListProps } from '@/types';
import ProjectListItem from './ProjectListItem';
import { getProjectListStyle } from '@/utils/projectList';

const listClasses = 'space-y-3 overflow-visible custom-scrollbar lg:overflow-y-auto lg:pr-2 lg:max-h-[var(--project-list-max-height)]';

/**
 * ProjectList component displays related projects.
 */
const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectSelect }) => {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/60 p-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">関連プロジェクトがありません</p>
      </div>
    );
  }

  return (
    <div
      className={listClasses}
      style={getProjectListStyle()}
      role="list"
      aria-label="関連プロジェクト一覧"
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
  );
};

export default ProjectList;
