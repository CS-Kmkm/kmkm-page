'use client';

import { useState, useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TechCategorySection from '@/components/dev-experience/TechCategorySection';
import TechDetailView from '@/components/dev-experience/TechDetailView';
import AllProjectsSection from '@/components/dev-experience/AllProjectsSection';
import ProjectModal from '@/components/ui/ProjectModal';
import { useTechExperience } from '@/hooks/useTechExperience';
import { TechItem, ProjectDetail } from '@/types';

const PAGE_TITLE = '開発経験';

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
    <PageLayout title={PAGE_TITLE}>
      <div className="w-[90%] max-w-7xl mx-auto px-4">
        <div className="space-y-6 sm:space-y-8">
          {/* Page header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {PAGE_TITLE}
              </h1>
            </div>
          </div>

          {/* Main Content */}
          {!selectedTech ? (
            // Two Column Layout - Tech Categories and Projects
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_1px_minmax(320px,420px)] xl:items-stretch xl:[--experience-panel-height:min(76vh,58rem)]">
              {/* Left Column - Tech Categories */}
              <section
                className="min-w-0 xl:h-[var(--experience-panel-height)] xl:overflow-y-auto xl:pr-2 custom-scrollbar"
                aria-label="技術カテゴリ一覧"
              >
                <div className="space-y-6 sm:space-y-7">
                  <TechCategorySection
                    title="プログラミング言語"
                    techItems={categorizedTech.languages}
                    onTechSelect={handleTechSelect}
                  />

                  <TechCategorySection
                    title="フレームワーク・ライブラリ"
                    techItems={categorizedTech.frameworks}
                    onTechSelect={handleTechSelect}
                  />

                  <TechCategorySection
                    title="ツール・プラットフォーム"
                    techItems={categorizedTech.tools}
                    onTechSelect={handleTechSelect}
                  />

                  <TechCategorySection
                    title="データベース"
                    techItems={categorizedTech.databases}
                    onTechSelect={handleTechSelect}
                  />
                </div>
              </section>

              <div className="hidden w-px bg-gray-200 dark:bg-gray-700 xl:block" aria-hidden="true" />

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
      </div>
    </PageLayout>
  );
}
