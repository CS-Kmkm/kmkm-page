'use client';

import { useState, useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TechGrid from '@/components/ui/TechGrid';
import { getTechExperience, getProjectDetails } from '@/data';


export default function DevExperiencePage() {
  const allTechItems = getTechExperience();
  const projectDetails = getProjectDetails();
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProficiency, setSelectedProficiency] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'proficiency' | 'experience'>('proficiency');

  // Get unique categories and proficiency levels
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allTechItems.map(item => item.category)));
    return cats.sort();
  }, [allTechItems]);

  const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

  // Filter and sort tech items
  const filteredTechItems = useMemo(() => {
    let filtered = allTechItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by proficiency
    if (selectedProficiency !== 'all') {
      filtered = filtered.filter(item => item.proficiency === selectedProficiency);
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return b.experienceYears - a.experienceYears;
        case 'proficiency':
        default:
          const proficiencyOrder = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 };
          const aProficiency = proficiencyOrder[a.proficiency];
          const bProficiency = proficiencyOrder[b.proficiency];
          if (aProficiency !== bProficiency) {
            return bProficiency - aProficiency;
          }
          return b.experienceYears - a.experienceYears;
      }
    });

    return filtered;
  }, [allTechItems, selectedCategory, selectedProficiency, sortBy]);

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'language':
        return 'Programming Languages';
      case 'framework':
        return 'Frameworks & Libraries';
      case 'tool':
        return 'Tools & Platforms';
      case 'database':
        return 'Databases';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <PageLayout
      title="Development Experience"
      className="max-w-6xl mx-auto"
    >
      <div className="space-y-8">
        {/* Page header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Development Experience
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Technologies, frameworks, and tools I work with, along with the projects where I've applied them. 
            Click on any technology to see related project details.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {filteredTechItems.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {filteredTechItems.length === allTechItems.length ? 'Technologies' : `of ${allTechItems.length} Technologies`}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {projectDetails.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">
              {filteredTechItems.filter(tech => tech.proficiency === 'expert' || tech.proficiency === 'advanced').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Advanced+</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">
              {filteredTechItems.length > 0 ? Math.round(filteredTechItems.reduce((sum, tech) => sum + tech.experienceYears, 0) / filteredTechItems.length) : 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Avg. Years</div>
          </div>
        </div>

        {/* Filtering and Sorting Controls */}
        <div className="space-y-4">
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                Category:
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                aria-label="Filter technologies by category"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="proficiency-filter" className="text-sm font-medium text-gray-700">
                Proficiency:
              </label>
              <select
                id="proficiency-filter"
                value={selectedProficiency}
                onChange={(e) => setSelectedProficiency(e.target.value)}
                className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                aria-label="Filter technologies by proficiency level"
              >
                <option value="all">All Levels</option>
                {proficiencyLevels.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'proficiency' | 'experience')}
                className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                aria-label="Sort technologies by criteria"
              >
                <option value="proficiency">Proficiency</option>
                <option value="experience">Experience Years</option>
                <option value="name">Name</option>
              </select>
            </div>

            {/* Clear filters button */}
            {(selectedCategory !== 'all' || selectedProficiency !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedProficiency('all');
                }}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                aria-label="Clear all applied filters"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Legend and Instructions */}
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Proficiency Legend:</span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs" role="list" aria-label="Proficiency level indicators">
                <span className="px-2 py-1 bg-green-100 text-green-900 border border-green-200 rounded-full" role="listitem">Expert</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-900 border border-blue-200 rounded-full" role="listitem">Advanced</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-900 border border-yellow-200 rounded-full" role="listitem">Intermediate</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-900 border border-gray-200 rounded-full" role="listitem">Beginner</span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Click on technologies with projects to view details
            </div>
          </div>
        </div>

        {/* Technology grid */}
        {filteredTechItems.length > 0 ? (
          <TechGrid
            techItems={filteredTechItems}
            projectDetails={projectDetails}
            showProjects={true}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No technologies found</div>
            <div className="text-gray-400 text-sm">
              Try adjusting your filters to see more results
            </div>
          </div>
        )}

        {/* Additional info */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            About My Development Experience
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              My development journey spans multiple domains, from web development with modern frameworks 
              like React and Next.js to machine learning research using Python and PyTorch.
            </p>
            <p>
              I focus on building scalable, maintainable solutions with strong emphasis on type safety, 
              accessibility, and user experience. Each project represents hands-on experience with 
              real-world challenges and continuous learning.
            </p>
            <p>
              The proficiency levels reflect my current comfort and expertise with each technology, 
              while the experience years indicate how long I've been actively using them in projects.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}