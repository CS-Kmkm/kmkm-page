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
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        概要
      </h3>
      <p className="text-gray-700 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default TechDescription;
