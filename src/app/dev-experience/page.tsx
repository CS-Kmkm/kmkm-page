'use client';

import { useState, useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TechCategorySection from '@/components/dev-experience/TechCategorySection';
import TechDetailView from '@/components/dev-experience/TechDetailView';
import ProficiencyFilter from '@/components/dev-experience/ProficiencyFilter';
import ProjectModal from '@/components/ui/ProjectModal';
import { getTechExperience, getProjectDetails } from '@/data';
import { TechItem, ProjectDetail } from '@/types';


export default function DevExperiencePage() {
  const allTechItems = getTechExperience();
  const allProjects = getProjectDetails();
  
  // Page state
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // Filter states
  const [showHigh, setShowHigh] = useState(true);
  const [showMedium, setShowMedium] = useState(true);
  const [showLow, setShowLow] = useState(true);

  // Filter tech items by proficiency level
  const filteredTechItems = useMemo(() => {
    return allTechItems.filter(item => {
      if (item.proficiencyLevel === '高' && !showHigh) return false;
      if (item.proficiencyLevel === '中' && !showMedium) return false;
      if (item.proficiencyLevel === '低' && !showLow) return false;
      return true;
    });
  }, [allTechItems, showHigh, showMedium, showLow]);

  // Categorize tech items
  const categorizedTech = useMemo(() => {
    const languages = filteredTechItems.filter(item => item.category === 'language');
    const frameworks = filteredTechItems.filter(item => item.category === 'framework');
    const tools = filteredTechItems.filter(item => item.category === 'tool');
    const databases = filteredTechItems.filter(item => item.category === 'database');

    return { languages, frameworks, tools, databases };
  }, [filteredTechItems]);

  // Get related frameworks for a language based on explicit relationships
  const getRelatedFrameworks = (tech: TechItem) => {
    if (!tech.relatedFrameworks) return [];
    return categorizedTech.frameworks.filter(framework =>
      tech.relatedFrameworks!.includes(framework.name)
    );
  };

  // Get related languages for a framework based on explicit relationships
  const getRelatedLanguages = (tech: TechItem) => {
    if (!tech.relatedLanguages) return [];
    return categorizedTech.languages.filter(language =>
      tech.relatedLanguages!.includes(language.name)
    );
  };

  // Get projects for selected tech
  const selectedTechProjects = useMemo(() => {
    if (!selectedTech) return [];
    
    return selectedTech.projects
      .map(projectId => allProjects.find(p => p.id === projectId))
      .filter((project): project is ProjectDetail => project !== undefined);
  }, [selectedTech, allProjects]);

  // Get related frameworks for selected tech (if it's a language)
  const relatedFrameworks = useMemo(() => {
    if (!selectedTech || selectedTech.category !== 'language') return [];
    return getRelatedFrameworks(selectedTech);
  }, [selectedTech]);

  // Get related languages for selected tech (if it's a framework)
  const relatedLanguages = useMemo(() => {
    if (!selectedTech || selectedTech.category !== 'framework') return [];
    return getRelatedLanguages(selectedTech);
  }, [selectedTech]);

  // Event handlers
  const handleTechSelect = (tech: TechItem) => {
    setSelectedTech(tech);
  };

  const handleBackToGrid = () => {
    setSelectedTech(null);
  };

  const handleProjectSelect = (project: ProjectDetail) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  // Filter handlers
  const handleToggleHigh = () => setShowHigh(!showHigh);
  const handleToggleMedium = () => setShowMedium(!showMedium);
  const handleToggleLow = () => setShowLow(!showLow);
  
  const handleClearFilters = () => {
    setShowHigh(true);
    setShowMedium(true);
    setShowLow(true);
  };
  
  const hasActiveFilters = !showHigh || !showMedium || !showLow;

  return (
    <PageLayout
      title="Development Experience"
      className="max-w-6xl mx-auto"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Page header */}
        <div className="text-center space-y-3 sm:space-y-4 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            開発経験
          </h1>
        </div>

        {/* Proficiency Filter */}
        {!selectedTech && (
          <ProficiencyFilter
            showHigh={showHigh}
            showMedium={showMedium}
            showLow={showLow}
            onToggleHigh={handleToggleHigh}
            onToggleMedium={handleToggleMedium}
            onToggleLow={handleToggleLow}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
            resultCount={filteredTechItems.length}
            totalCount={allTechItems.length}
          />
        )}

        {/* Main Content */}
        {!selectedTech ? (
          // Category Sections View
          <div className="space-y-8 sm:space-y-12 px-4">
            <TechCategorySection
              title="プログラミング言語"
              description="使用しているプログラミング言語"
              techItems={categorizedTech.languages}
              onTechSelect={handleTechSelect}
            />

            <TechCategorySection
              title="フレームワーク・ライブラリ"
              description="Webアプリケーション開発に使用しているフレームワーク"
              techItems={categorizedTech.frameworks}
              onTechSelect={handleTechSelect}
            />

            <TechCategorySection
              title="ツール・プラットフォーム"
              description="開発環境やインフラに使用しているツール"
              techItems={categorizedTech.tools}
              onTechSelect={handleTechSelect}
            />

            <TechCategorySection
              title="データベース"
              description="データ管理に使用しているデータベース"
              techItems={categorizedTech.databases}
              onTechSelect={handleTechSelect}
            />
          </div>
        ) : (
          // Tech Detail View
          <TechDetailView
            tech={selectedTech}
            projects={selectedTechProjects}
            relatedFrameworks={relatedFrameworks}
            relatedLanguages={relatedLanguages}
            onBack={handleBackToGrid}
            onProjectSelect={handleProjectSelect}
            onRelatedTechSelect={handleTechSelect}
          />
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={handleCloseModal}
      />
    </PageLayout>
  );
}