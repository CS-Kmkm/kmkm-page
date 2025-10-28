"use client";

import React, { useMemo } from 'react';
import { LanguageIconGridProps, TechItem } from '@/types';
import LanguageIcon from './LanguageIcon';

/**
 * LanguageIconGrid component displays a responsive grid of tech icons
 * sorted by proficiency and experience years
 */
const LanguageIconGrid: React.FC<LanguageIconGridProps> = ({
  languages,
  onLanguageSelect
}) => {
  // Sort languages by proficiency (expert > advanced > intermediate > beginner)
  // then by experience years (descending)
  const sortedLanguages = useMemo(() => {
    const proficiencyOrder = {
      expert: 4,
      advanced: 3,
      intermediate: 2,
      beginner: 1
    };

    return [...languages].sort((a, b) => {
      const aProficiency = proficiencyOrder[a.proficiency];
      const bProficiency = proficiencyOrder[b.proficiency];

      if (aProficiency !== bProficiency) {
        return bProficiency - aProficiency;
      }

      return b.experienceYears - a.experienceYears;
    });
  }, [languages]);

  const handleLanguageClick = (language: TechItem) => {
    onLanguageSelect(language);
  };

  if (sortedLanguages.length === 0) {
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
      className="
        grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8
        gap-3 sm:gap-4
        animate-fade-in
      "
      role="list"
      aria-label="Technology stack"
    >
      {sortedLanguages.map((language, index) => (
        <div
          key={language.id}
          role="listitem"
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 50}ms`
          }}
        >
          <LanguageIcon
            language={language}
            onClick={() => handleLanguageClick(language)}
          />
        </div>
      ))}
    </div>
  );
};

export default LanguageIconGrid;
