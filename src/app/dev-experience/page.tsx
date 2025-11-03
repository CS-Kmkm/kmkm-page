'use client';

import { useState, useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TechCategorySection from '@/components/dev-experience/TechCategorySection';
import TechDetailView from '@/components/dev-experience/TechDetailView';
import AllProjectsSection from '@/components/dev-experience/AllProjectsSection';
import ProjectModal from '@/components/ui/ProjectModal';
import { useTechExperience } from '@/hooks/useTechExperience';
import { TechItem, ProjectDetail } from '@/types';

export default function DevExperiencePage() {
  const {
    allProjects,
    categorizedTech,
    getRelatedFrameworks,
    getRelatedLanguages,
    getProjectsForTech,
  } = useTechExperience();

  // Page state
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Get projects for selected tech
  const selectedTechProjects = useMemo(() => {
    if (!selectedTech) return [];
    return getProjectsForTech(selectedTech);
  }, [selectedTech, getProjectsForTech]);

  // Get related frameworks for selected tech (if it's a language)
  const relatedFrameworks = useMemo(() => {
    if (!selectedTech || selectedTech.category !== 'language') return [];
    return getRelatedFrameworks(selectedTech);
  }, [selectedTech, getRelatedFrameworks]);

  // Get related languages for selected tech (if it's a framework)
  const relatedLanguages = useMemo(() => {
    if (!selectedTech || selectedTech.category !== 'framework') return [];
    return getRelatedLanguages(selectedTech);
  }, [selectedTech, getRelatedLanguages]);

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

        {/* Main Content */}
        {!selectedTech ? (
          // Two Column Layout - Tech Categories and Projects
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8 px-4 xl:items-start">
            {/* Left Column - Tech Categories */}
            <div className="space-y-8 sm:space-y-12">
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

            {/* Right Column - All Projects */}
            <AllProjectsSection
              projects={allProjects}
              onProjectSelect={handleProjectSelect}
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