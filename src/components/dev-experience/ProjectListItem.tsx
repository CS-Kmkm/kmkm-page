"use client";

import React from 'react';
import { ProjectListItemProps } from '@/types';
import { getTechExperience } from '@/data';
import {
  getButtonListItemClasses,
  getTitleClasses,
  getMetaClasses,
  getTechBadgeClasses,
  getIconClasses,
} from '@/lib/ui/listItemStyles';

/**
 * ProjectListItem component displays a clickable project list item
 * with project name, duration, and role
 */
const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, onClick }) => {
  const allTechItems = getTechExperience();
  
  // Sort technologies by category priority
  const sortedTechs = React.useMemo(() => {
    const categoryOrder = {
      'language': 1,
      'framework': 2,
      'database': 3,
      'tool': 4
    };
    
    return project.technologies
      .map(techName => {
        const techItem = allTechItems.find(item => item.name === techName);
        return {
          name: techName,
          category: techItem?.category || 'tool',
          order: categoryOrder[techItem?.category as keyof typeof categoryOrder] || 5
        };
      })
      .sort((a, b) => a.order - b.order)
      .map(tech => tech.name);
  }, [project.technologies, allTechItems]);

  const handleClick = () => {
    onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={getButtonListItemClasses()}
      aria-label={`View details for ${project.name}`}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-grow min-w-0">
          {/* Project Name */}
          <h4 className={`${getTitleClasses()} mb-2 line-clamp-2`}>
            {project.name}
          </h4>

          {/* Duration and Role */}
          <div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 ${getMetaClasses()} mb-3`}>
            <span className="flex items-center gap-1.5">
              <svg
                className={`${getIconClasses('small')} flex-shrink-0`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {project.duration}
            </span>

            <span className="hidden sm:inline text-gray-400 dark:text-gray-500">•</span>

            <span className="flex items-center gap-1.5">
              <svg
                className={`${getIconClasses('small')} flex-shrink-0`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {project.role}
            </span>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5">
            {sortedTechs.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className={getTechBadgeClasses(true)}
              >
                {tech}
              </span>
            ))}
            {sortedTechs.length > 6 && (
              <span className={getTechBadgeClasses(false)}>
                +{sortedTechs.length - 6}
              </span>
            )}
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="flex-shrink-0 mt-1">
          <svg
            className={getIconClasses('medium')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default ProjectListItem;
