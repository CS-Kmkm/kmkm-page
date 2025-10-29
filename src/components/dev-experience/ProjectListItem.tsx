"use client";

import React from 'react';
import { ProjectListItemProps } from '@/types';

/**
 * ProjectListItem component displays a clickable project list item
 * with project name, duration, and role
 */
const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, onClick }) => {
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
      className="
        w-full text-left p-4 rounded-lg border border-gray-200
        transition-all duration-150
        hover:bg-gray-50 hover:border-blue-300 hover:shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        active:scale-[0.98]
      "
      aria-label={`View details for ${project.name}`}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-grow min-w-0">
          {/* Project Name */}
          <h4 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
            {project.name}
          </h4>

          {/* Duration and Role */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 flex-shrink-0"
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

            <span className="hidden sm:inline text-gray-400">•</span>

            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 flex-shrink-0"
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
        </div>

        {/* Arrow Icon */}
        <div className="flex-shrink-0 text-gray-400 mt-1">
          <svg
            className="w-5 h-5"
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
