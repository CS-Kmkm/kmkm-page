'use client';

import { useMemo, useState } from 'react';
import TechCategorySection from '@/components/dev-experience/TechCategorySection';
import TechDetailView from '@/components/dev-experience/TechDetailView';
import AllProjectsSection from '@/components/dev-experience/AllProjectsSection';
import ProjectModal from '@/components/ui/ProjectModal';
import PageHeading from '@/components/layout/PageHeading';
import { useTechExperience } from '@/hooks/useTechExperience';
import type { ProjectDetail, TechItem } from '@/types';

const PAGE_TITLE = '開発経験';

interface DevExperienceClientProps {
  allTechItems: TechItem[];
  allProjects: ProjectDetail[];
}

export default function DevExperienceClient({
  allTechItems,
  allProjects,
}: DevExperienceClientProps) {
  const {
    categorizedTech,
    techCategoryByName,
    getRelatedFrameworks,
    getRelatedLanguages,
    getProjectsForTech,
  } = useTechExperience(allTechItems, allProjects);

  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const selectedTechProjects = useMemo(
    () => selectedTech ? getProjectsForTech(selectedTech) : [],
    [selectedTech, getProjectsForTech],
  );

  const relatedFrameworks = useMemo(
    () => selectedTech?.category === 'language' ? getRelatedFrameworks(selectedTech) : [],
    [selectedTech, getRelatedFrameworks],
  );

  const relatedLanguages = useMemo(
    () => selectedTech?.category === 'framework' ? getRelatedLanguages(selectedTech) : [],
    [selectedTech, getRelatedLanguages],
  );

  const handleProjectSelect = (project: ProjectDetail) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <PageHeading>{PAGE_TITLE}</PageHeading>
          </div>
        </div>

        {!selectedTech ? (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_1px_minmax(320px,420px)] xl:items-stretch xl:[--experience-panel-height:min(76vh,58rem)]">
            <section
              className="min-w-0 xl:h-[var(--experience-panel-height)] xl:overflow-y-auto xl:pr-2 custom-scrollbar"
              aria-label="技術カテゴリ一覧"
            >
              <div className="space-y-6 sm:space-y-7">
                <TechCategorySection
                  title="プログラミング言語"
                  techItems={categorizedTech.languages}
                  onTechSelect={setSelectedTech}
                />
                <TechCategorySection
                  title="フレームワーク・ライブラリ"
                  techItems={categorizedTech.frameworks}
                  onTechSelect={setSelectedTech}
                />
                <TechCategorySection
                  title="ツール・プラットフォーム"
                  techItems={categorizedTech.tools}
                  onTechSelect={setSelectedTech}
                />
                <TechCategorySection
                  title="データベース"
                  techItems={categorizedTech.databases}
                  onTechSelect={setSelectedTech}
                />
              </div>
            </section>

            <div className="hidden w-px bg-gray-200 dark:bg-gray-700 xl:block" aria-hidden="true" />

            <AllProjectsSection
              projects={allProjects}
              technologyCategories={techCategoryByName}
              onProjectSelect={handleProjectSelect}
            />
          </div>
        ) : (
          <TechDetailView
            tech={selectedTech}
            projects={selectedTechProjects}
            technologyCategories={techCategoryByName}
            relatedFrameworks={relatedFrameworks}
            relatedLanguages={relatedLanguages}
            onBack={() => setSelectedTech(null)}
            onProjectSelect={handleProjectSelect}
            onRelatedTechSelect={setSelectedTech}
          />
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
