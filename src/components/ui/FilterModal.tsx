'use client';

import React, { useState } from 'react';
import { FilterModalProps, PublicationFilters } from '@/types';
import { Modal } from './Modal';

const getFilterStateKey = (filters: PublicationFilters) =>
  `${filters.authorshipType}:${filters.publicationTypes.join(',')}`;

const FilterModalContent: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  availableTypes
}) => {
  const [localFilters, setLocalFilters] = useState<PublicationFilters>(currentFilters);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleCancel = () => {
    setLocalFilters(currentFilters);
    onClose();
  };

  const handleAuthorshipChange = (type: 'all' | 'first-author' | 'co-author') => {
    setLocalFilters(prev => ({ ...prev, authorshipType: type }));
  };

  const handleTypeToggle = (type: string) => {
    setLocalFilters(prev => {
      const types = prev.publicationTypes.includes(type)
        ? prev.publicationTypes.filter(t => t !== type)
        : [...prev.publicationTypes, type];
      return { ...prev, publicationTypes: types };
    });
  };

  const getPublicationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      journal: 'Journal',
      conference: 'Conference',
      workshop: 'Workshop',
      preprint: 'Preprint',
      other: 'Other'
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Filter Publications"
      footer={
        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:justify-end sm:gap-3">
          <button
            onClick={handleCancel}
            className="min-h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800 sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="min-h-11 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-offset-gray-800 sm:w-auto"
          >
            Apply Filters
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Authorship
          </legend>
          <div className="space-y-1">
            <label className="flex min-h-11 cursor-pointer items-center">
              <input
                type="radio"
                name="authorship"
                checked={localFilters.authorshipType === 'all'}
                onChange={() => handleAuthorshipChange('all')}
                className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All Publications</span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-center">
              <input
                type="radio"
                name="authorship"
                checked={localFilters.authorshipType === 'first-author'}
                onChange={() => handleAuthorshipChange('first-author')}
                className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">First Author Only</span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-center">
              <input
                type="radio"
                name="authorship"
                checked={localFilters.authorshipType === 'co-author'}
                onChange={() => handleAuthorshipChange('co-author')}
                className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Co-author Only</span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Publication Type
          </legend>
          <div className="space-y-1">
            {availableTypes.map(type => (
              <label key={type} className="flex min-h-11 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={localFilters.publicationTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {getPublicationTypeLabel(type)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </Modal>
  );
};

const FilterModal: React.FC<FilterModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <FilterModalContent
      key={getFilterStateKey(props.currentFilters)}
      {...props}
    />
  );
};

export default FilterModal;
