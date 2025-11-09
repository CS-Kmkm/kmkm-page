/**
 * ProjectModal - Modal for displaying project details
 * Refactored to use the generic Modal component
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { ProjectModalProps } from '@/types';
import { Modal } from './Modal';
import { UI_LABELS, ARIA_LABELS } from '@/lib/constants/labels';
import { tokens } from '@/lib/theme/tokens';

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose
}) => {
  if (!isOpen || !project) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.name}
      description={project.description}
      size="xl"
      showCloseButton={true}
    >
      {/* Project image */}
      {project.imageUrl && (
        <div className="relative w-full h-48 sm:h-64 md:h-80 bg-gray-100 -mt-6 -mx-6 mb-6">
          <Image
            src={project.imageUrl}
            alt={`Screenshot of ${project.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      )}

      {/* Project metadata */}
      <div className="mb-6">
        <div className={`flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm ${tokens.text.muted}`}>
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
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
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
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

      {/* Description */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${tokens.text.primary} mb-3`}>
          {UI_LABELS.projectDescription}
        </h3>
        <p className={`${tokens.text.secondary} leading-relaxed`}>
          {project.description}
        </p>
      </div>

      {/* Technology stack */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${tokens.text.primary} mb-3`}>
          {UI_LABELS.technologyStack}
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className={`px-3 py-1 ${tokens.badge.blue.bg} ${tokens.badge.blue.text} ${tokens.radius.full} text-sm font-medium`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      {(project.url || project.githubUrl) && (
        <div className="flex flex-wrap gap-4">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 ${tokens.interactive.primaryText} ${tokens.interactive.primary} ${tokens.radius.lg} ${tokens.interactive.primaryHover} ${tokens.transition.colors} ${tokens.focus.ringFull}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              {UI_LABELS.viewLiveSite}
            </a>
          )}
          
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 text-white bg-gray-800 ${tokens.radius.lg} hover:bg-gray-900 ${tokens.transition.colors} ${tokens.focus.ringFull}`}
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              {UI_LABELS.viewOnGitHub}
            </a>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ProjectModal;
