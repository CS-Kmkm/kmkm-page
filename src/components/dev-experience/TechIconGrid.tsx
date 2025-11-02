"use client";

import React, { useMemo } from 'react';
import { TechIconGridProps, TechItem } from '@/types';
import TechIcon from './TechIcon';

/**
 * TechIconGrid component displays a responsive grid of technology icons
 * sorted by proficiency and experience years
 */
const TechIconGrid: React.FC<TechIconGridProps> = ({
  techItems,
  onTechSelect
}) => {
  // Sort tech items with custom order for languages, then by proficiency and experience years
  const sortedTechItems = useMemo(() => {
    const proficiencyOrder = {
      expert: 4,
      advanced: 3,
      intermediate: 2,
      beginner: 1
    };

    // Custom order for languages
    const languageOrder = {
      'Python': 1,
      'TypeScript': 2,
      'JavaScript': 3,
      'C': 4,
      'C++': 5,
      'C#': 6,
      'R': 7,
      'Haskell': 8,
      'HTML': 9,
      'SQL': 10
    };

    return [...techItems].sort((a, b) => {
      // If both are languages, use custom language order
      if (a.category === 'language' && b.category === 'language') {
        const aOrder = languageOrder[a.name] || 999;
        const bOrder = languageOrder[b.name] || 999;
        return aOrder - bOrder;
      }

      // For non-languages, sort by proficiency then experience years
      const aProficiency = proficiencyOrder[a.proficiency];
      const bProficiency = proficiencyOrder[b.proficiency];

      if (aProficiency !== bProficiency) {
        return bProficiency - aProficiency;
      }

      return b.experienceYears - a.experienceYears;
    });
  }, [techItems]);

  const handleTechClick = (tech: TechItem) => {
    onTechSelect(tech);
  };

  if (sortedTechItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">技術データが見つかりません</div>
        <div className="text-gray-400 text-sm">
          技術スタックのデータが存在しません
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 animate-fade-in"
      role="list"
      aria-label="Technology stack"
    >
      {sortedTechItems.map((tech, index) => (
        <div
          key={tech.id}
          role="listitem"
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 50}ms`
          }}
        >
          <TechIcon
            tech={tech}
            onClick={() => handleTechClick(tech)}
          />
        </div>
      ))}
    </div>
  );
};

export default TechIconGrid;
