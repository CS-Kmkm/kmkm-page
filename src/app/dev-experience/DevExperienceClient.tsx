'use client';

import { useMemo, useState, type KeyboardEvent } from 'react';
import TechCategorySection from '@/components/dev-experience/TechCategorySection';
import TechDetailView from '@/components/dev-experience/TechDetailView';
import AllProjectsSection from '@/components/dev-experience/AllProjectsSection';
import ProjectModal from '@/components/ui/ProjectModal';
import PageHeading from '@/components/layout/PageHeading';
import { useTechExperience } from '@/hooks/useTechExperience';
import type { ProjectDetail, TechItem } from '@/types';
import { useI18n } from '@/lib/i18n';

type OverviewSection = 'technologies' | 'projects';

const tabClassName = (isActive: boolean) => [
  'relative min-h-10 px-0.5 pb-2 text-xs font-semibold transition-colors sm:min-h-11 sm:px-1 sm:pb-3 sm:text-sm',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
  isActive
    ? 'text-blue-700 after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-blue-600 dark:text-blue-300 dark:after:bg-blue-400'
    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
].join(' ');

interface DevExperienceClientProps {
  allTechItems: TechItem[];
  allProjects: ProjectDetail[];
}

export default function DevExperienceClient({
  allTechItems,
  allProjects,
}: DevExperienceClientProps) {
  const { locale } = useI18n();
  const pageTitle = locale === 'en' ? 'Development Experience' : '開発経験';
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
  const [activeSection, setActiveSection] = useState<OverviewSection>('technologies');

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

  const handleTechSelect = (tech: TechItem) => {
    setSelectedTech(tech);
  };

  const handleBackToOverview = () => {
    const selectedTechId = selectedTech?.id;
    setSelectedTech(null);

    if (selectedTechId) {
      requestAnimationFrame(() => {
        document.getElementById(`tech-card-${selectedTechId}`)?.focus();
      });
    }
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const nextSection: OverviewSection = event.key === 'ArrowLeft' || event.key === 'Home'
      ? 'technologies'
      : 'projects';
    setActiveSection(nextSection);
    requestAnimationFrame(() => {
      document.getElementById(`${nextSection}-tab`)?.focus();
    });
  };

  return (
    <>
      <div className="space-y-8 sm:space-y-10">
        <header className="flex items-center justify-between gap-4">
          <PageHeading>{pageTitle}</PageHeading>
          {!selectedTech && (
            <div
              className="flex flex-shrink-0 gap-3 border-b border-gray-200 dark:border-gray-700 sm:gap-6"
              role="tablist"
              aria-label={locale === 'en' ? 'Content view' : '表示内容'}
            >
              <button
                id="technologies-tab"
                type="button"
                role="tab"
                aria-selected={activeSection === 'technologies'}
                aria-controls="technologies-panel"
                tabIndex={activeSection === 'technologies' ? 0 : -1}
                className={tabClassName(activeSection === 'technologies')}
                onClick={() => setActiveSection('technologies')}
                onKeyDown={handleTabKeyDown}
              >
                {locale === 'en' ? 'Technology Stack' : '技術スタック'}
              </button>
              <button
                id="projects-tab"
                type="button"
                role="tab"
                aria-selected={activeSection === 'projects'}
                aria-controls="projects-panel"
                tabIndex={activeSection === 'projects' ? 0 : -1}
                className={tabClassName(activeSection === 'projects')}
                onClick={() => setActiveSection('projects')}
                onKeyDown={handleTabKeyDown}
              >
                {locale === 'en' ? 'Projects' : 'プロジェクト'}
              </button>
            </div>
          )}
        </header>

        {!selectedTech ? (
          <div className="space-y-8">
            <div
              id="technologies-panel"
              role="tabpanel"
              aria-labelledby="technologies-tab"
              hidden={activeSection !== 'technologies'}
            >
              <section
                className="min-w-0 space-y-5 overflow-visible"
                aria-label={locale === 'en' ? 'Technology categories' : '技術カテゴリ一覧'}
              >
                <div className="space-y-4 sm:space-y-5">
                  <TechCategorySection
                    title={locale === 'en' ? 'Programming Languages' : 'プログラミング言語'}
                    techItems={categorizedTech.languages}
                    onTechSelect={handleTechSelect}
                  />
                  <TechCategorySection
                    title={locale === 'en' ? 'Frameworks and Libraries' : 'フレームワーク・ライブラリ'}
                    techItems={categorizedTech.frameworks}
                    onTechSelect={handleTechSelect}
                  />
                  <TechCategorySection
                    title={locale === 'en' ? 'Tools and Platforms' : 'ツール・プラットフォーム'}
                    techItems={categorizedTech.tools}
                    onTechSelect={handleTechSelect}
                  />
                  <TechCategorySection
                    title={locale === 'en' ? 'Databases' : 'データベース'}
                    techItems={categorizedTech.databases}
                    onTechSelect={handleTechSelect}
                  />
                </div>
              </section>
            </div>

            <div
              id="projects-panel"
              role="tabpanel"
              aria-labelledby="projects-tab"
              hidden={activeSection !== 'projects'}
            >
              <AllProjectsSection
                projects={allProjects}
                technologyCategories={techCategoryByName}
                onProjectSelect={handleProjectSelect}
              />
            </div>
          </div>
        ) : (
          <TechDetailView
            tech={selectedTech}
            projects={selectedTechProjects}
            technologyCategories={techCategoryByName}
            relatedFrameworks={relatedFrameworks}
            relatedLanguages={relatedLanguages}
            onBack={handleBackToOverview}
            onProjectSelect={handleProjectSelect}
            onRelatedTechSelect={handleTechSelect}
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
