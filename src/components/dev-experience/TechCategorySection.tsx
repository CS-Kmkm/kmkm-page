"use client";

import React from 'react';
import { TechItem } from '@/types';
import TechIconGrid from './TechIconGrid';

interface TechCategorySectionProps {
  title: string;
  description?: string;
  techItems: TechItem[];
  onTechSelect: (tech: TechItem) => void;
}

/**
 * TechCategorySection component displays a section for a specific tech category
 */
const TechCategorySection: React.FC<TechCategorySectionProps> = ({
  title,
  description,
  techItems,
  onTechSelect
}) => {
  if (techItems.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {techItems.length}件
        </p>
      </div>

      {/* Tech Grid */}
      <TechIconGrid
        techItems={techItems}
        onTechSelect={onTechSelect}
      />
    </section>
  );
};

export default TechCategorySection;
