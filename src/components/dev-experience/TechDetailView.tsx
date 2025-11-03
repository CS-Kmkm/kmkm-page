"use client";

import React, { useEffect } from 'react';
import { TechDetailViewProps } from '@/types';
import TechHeader from './TechHeader';
import TechDescription from './TechDescription';
import ProjectList from './ProjectList';
import RelatedFrameworks from './RelatedFrameworks';
import RelatedLanguages from './RelatedLanguages';

/**
 * TechDetailView component displays detailed information about a technology
 * including header, description, related frameworks/languages, and related projects
 */
const TechDetailView: React.FC<TechDetailViewProps> = ({
  tech,
  projects,
  relatedFrameworks = [],
  relatedLanguages = [],
  onBack,
  onProjectSelect,
  onRelatedTechSelect
}) => {
  // Handle Escape key to go back
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onBack();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onBack]);

  // Focus on back button when view is mounted
  useEffect(() => {
    const backButton = document.getElementById('tech-detail-back-button');
    if (backButton) {
      backButton.focus();
    }
  }, []);

  return (
    <div
      className="animate-slide-in-right fixed inset-0 z-50 bg-gray-50 overflow-y-auto lg:static lg:z-auto lg:bg-transparent lg:overflow-visible"
      role="region"
      aria-label={`${tech.name}の詳細`}
    >
      <div className="min-h-screen lg:min-h-0 p-4 sm:p-6 lg:p-0">
        {/* Back Button */}
        <button
          id="tech-detail-back-button"
          onClick={onBack}
          className="
            inline-flex items-center gap-2 mb-6
            px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300
            transition-all duration-150
            hover:bg-gray-50 hover:border-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            min-h-[44px]
          "
          aria-label="技術一覧に戻る"
          type="button"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">戻る</span>
        </button>

        {/* Content - Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8 xl:items-stretch">
          {/* Left Column - Tech Information */}
          <div className="space-y-6">
            {/* Tech Header */}
            <TechHeader tech={tech} />

            {/* Tech Description */}
            {tech.description && (
              <TechDescription description={tech.description} />
            )}

            {/* Related Frameworks (only for languages) */}
            {tech.category === 'language' && relatedFrameworks.length > 0 && (
              <RelatedFrameworks
                frameworks={relatedFrameworks}
                onFrameworkSelect={onRelatedTechSelect}
              />
            )}

            {/* Related Languages (only for frameworks) */}
            {tech.category === 'framework' && relatedLanguages.length > 0 && (
              <RelatedLanguages
                languages={relatedLanguages}
                onLanguageSelect={onRelatedTechSelect}
              />
            )}
          </div>

          {/* Right Column - Project List */}
          <div className="xl:h-full">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 xl:h-full xl:flex xl:flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 xl:flex-shrink-0">
                関連プロジェクト ({projects.length})
              </h3>
              <div className="xl:flex-1 xl:overflow-y-auto custom-scrollbar">
                <ProjectList
                  projects={projects}
                  onProjectSelect={onProjectSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechDetailView;
