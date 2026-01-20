"use client";

import React from 'react';
import { TechDescriptionProps } from '@/types';

/**
 * TechDescription component displays the description text for a technology
 */
const TechDescription: React.FC<TechDescriptionProps> = ({ description }) => {
  if (!description) {
    return null;
  }

  return (
    <div className="min-w-full w-full p-6 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-200 box-border overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        概要
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
