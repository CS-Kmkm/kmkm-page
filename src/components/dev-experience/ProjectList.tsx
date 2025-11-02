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
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-500 text-sm">関連プロジェクトがありません</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-3 overflow-y-auto pr-2 custom-scrollbar"
      style={{ maxHeight: `${Math.min(10, projects.length) * 120}px` }}
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
  );
};

export default ProjectList;
