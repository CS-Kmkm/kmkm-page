"use client";

import React, { useState } from 'react';
import { TechGridProps, TechItem, ProjectDetail } from '@/types';
import TechBadge from './TechBadge';
import ProjectModal from './ProjectModal';

const TechGrid: React.FC<TechGridProps> = ({
  techItems,
  projectDetails,
  showProjects = true
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group technologies by category
  const groupedTech = techItems.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, TechItem[]>);

  // Sort categories in a logical order
  const categoryOrder = ['language', 'framework', 'tool', 'database'];
  const sortedCategories = categoryOrder.filter(category => groupedTech[category]);

  // If there's only one category or items are pre-sorted, show a simplified layout
  const isSimplified = sortedCategories.length === 1 || techItems.length <= 6;

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

  // Handle tech badge click
  const handleTechClick = (tech: TechItem) => {
    if (!showProjects || tech.projects.length === 0) return;

    // Find the first project for this technology
    const project = projectDetails.find(p => tech.projects.includes(p.id));
    if (project) {
      setSelectedProject(project);
      setIsModalOpen(true);
    } else {
      console.warn(`No project found for technology ${tech.name} with project IDs:`, tech.projects);
      console.warn('Available projects:', projectDetails.map(p => p.id));
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="space-y-8">
      {isSimplified ? (
        // Simplified layout for filtered results or small sets
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {techItems.map(tech => (
            <TechBadge
              key={tech.id}
              name={tech.name}
              category={tech.category}
              experienceYears={tech.experienceYears}
              proficiency={tech.proficiency}
              logoUrl={tech.logoUrl}
              logoAlt={tech.logoAlt}
              onClick={showProjects && tech.projects.length > 0 ? () => handleTechClick(tech) : undefined}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        // Grouped layout for full view
        sortedCategories.map(category => (
          <div key={category} className="space-y-3 sm:space-y-4">
            {/* Category header */}
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {getCategoryDisplayName(category)}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {groupedTech[category].length} technolog{groupedTech[category].length !== 1 ? 'ies' : 'y'}
              </p>
            </div>

            {/* Technology grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {groupedTech[category]
                .sort((a, b) => {
                  // Sort by proficiency level (expert first), then by experience years
                  const proficiencyOrder = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 };
                  const aProficiency = proficiencyOrder[a.proficiency];
                  const bProficiency = proficiencyOrder[b.proficiency];
                  
                  if (aProficiency !== bProficiency) {
                    return bProficiency - aProficiency;
                  }
                  
                  return b.experienceYears - a.experienceYears;
                })
                .map(tech => (
                  <TechBadge
                    key={tech.id}
                    name={tech.name}
                    category={tech.category}
                    experienceYears={tech.experienceYears}
                    proficiency={tech.proficiency}
                    logoUrl={tech.logoUrl}
                    logoAlt={tech.logoAlt}
                    onClick={showProjects && tech.projects.length > 0 ? () => handleTechClick(tech) : undefined}
                    className="h-full"
                  />
                ))}
            </div>
          </div>
        ))
      )}

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TechGrid;