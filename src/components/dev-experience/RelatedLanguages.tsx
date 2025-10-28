"use client";

import React from 'react';
import Image from 'next/image';
import { TechItem } from '@/types';

interface RelatedLanguagesProps {
  languages: TechItem[];
  onLanguageSelect?: (language: TechItem) => void;
}

/**
 * RelatedLanguages component displays languages related to a framework
 */
const RelatedLanguages: React.FC<RelatedLanguagesProps> = ({
  languages,
  onLanguageSelect
}) => {
  if (languages.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'language':
        return '💻';
      case 'framework':
        return '🔧';
      case 'tool':
        return '⚙️';
      case 'database':
        return '🗄️';
      default:
        return '📦';
    }
  };

  return (
    <div className="p-6 bg-green-50 rounded-lg border border-green-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        関連言語
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        このフレームワークと一緒に使用した言語
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {languages.map((language) => (
          <button
            key={language.id}
            onClick={() => onLanguageSelect?.(language)}
            className="
              flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200
              transition-all duration-150
              hover:shadow-md hover:border-green-400
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            "
            type="button"
          >
            {/* Logo */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              {language.logoUrl ? (
                <Image
                  src={language.logoUrl}
                  alt={language.logoAlt || `${language.name} logo`}
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                />
              ) : (
                <span className="text-xl" role="img" aria-label={`${language.name} icon`}>
                  {getCategoryIcon(language.category)}
                </span>
              )}
            </div>

            {/* Name */}
            <div className="flex-grow text-left min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {language.name}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedLanguages;
