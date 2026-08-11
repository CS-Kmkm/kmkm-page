"use client";

import React, { useMemo } from 'react';
import { TechIconGridProps, TechItem } from '@/types';
import TechIcon from './TechIcon';
import { useI18n } from '@/lib/i18n';

/**
 * TechIconGrid component displays a responsive grid of technology icons
 * sorted by proficiency and experience years
 */
const TechIconGrid: React.FC<TechIconGridProps> = ({
  techItems,
  onTechSelect
}) => {
  const { messages } = useI18n();
  // Sort tech items with custom order for languages, then by proficiency and experience years
  const sortedTechItems = useMemo(() => {
    const proficiencyOrder = {
      expert: 4,
      advanced: 3,
      intermediate: 2,
      beginner: 1
    };

    // Custom order for languages
    const languageOrder: Record<string, number> = {
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
        <div className="text-gray-500 text-lg mb-2">{messages.techNotFound}</div>
        <div className="text-gray-400 text-sm">
          {messages.techDataMissing}
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid w-full grid-cols-2 gap-2.5 animate-fade-in sm:grid-cols-3 sm:gap-3 lg:grid-cols-4"
      role="list"
      aria-label={messages.techStackList}
    >
      {sortedTechItems.map((tech, index) => (
        <div
          key={tech.id}
          role="listitem"
          className="min-w-0 animate-fade-in"
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
