'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FilterModalProps, PublicationFilters } from '@/types';

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  availableTypes
}) => {
  const [localFilters, setLocalFilters] = useState<PublicationFilters>(currentFilters);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLInputElement>(null);

  // Update local filters when currentFilters change
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus first element when modal opens
      firstFocusableRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 id="filter-modal-title" className="text-xl font-semibold text-gray-900">
            Filter Publications
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Authorship Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Authorship</h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  ref={firstFocusableRef}
                  type="radio"
                  name="authorship"
                  checked={localFilters.authorshipType === 'all'}
                  onChange={() => handleAuthorshipChange('all')}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">All Publications</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="authorship"
                  checked={localFilters.authorshipType === 'first-author'}
                  onChange={() => handleAuthorshipChange('first-author')}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">First Author Only</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="authorship"
                  checked={localFilters.authorshipType === 'co-author'}
                  onChange={() => handleAuthorshipChange('co-author')}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Co-author Only</span>
              </label>
            </div>
          </div>

          {/* Publication Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Publication Type</h3>
            <div className="space-y-2">
              {availableTypes.map(type => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.publicationTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {getPublicationTypeLabel(type)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
