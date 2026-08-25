"use client";

import React from 'react';
import { TechDescriptionProps } from '@/types';
import { useI18n } from '@/lib/i18n';

/**
 * TechDescription component displays the description text for a technology
 */
const TechDescription: React.FC<TechDescriptionProps> = ({ description }) => {
  const { messages } = useI18n();
  if (!description) {
    return null;
  }

  return (
    <div className="min-w-full w-full border-t border-gray-200/80 py-5 dark:border-gray-700/60 sm:py-6 transition-colors duration-200 box-border overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {messages.overview}
      </h3>
      <div className="w-full overflow-hidden">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed block w-full overflow-hidden break-words">
          {description}
        </p>
      </div>
    </div>
  );
};

export default TechDescription;
