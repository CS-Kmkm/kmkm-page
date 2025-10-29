"use client";

import React from 'react';
import { ProjectListProps } from '@/types';
import ProjectListItem from './ProjectListItem';

/**
 * ProjectList component displays a list of projects
 */
const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectSelect }) => {
  if (projects.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-500">関連プロジェクトがありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        関連プロジェクト ({projects.length})
      </h3>

      <div
        className="space-y-3 max-h-[500px] overflow-y-auto pr-2"
        role="list"
        aria-label="Related projects"
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
  );
};

export default ProjectList;
