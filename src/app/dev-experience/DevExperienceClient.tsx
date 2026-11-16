'use client';

import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import TechCategorySection from '@/components/dev-experience/TechCategorySection';
import TechDetailView from '@/components/dev-experience/TechDetailView';
import AllProjectsSection from '@/components/dev-experience/AllProjectsSection';
import ProjectModal from '@/components/ui/ProjectModal';
import PageHeading from '@/components/layout/PageHeading';
import { useTechExperience } from '@/hooks/useTechExperience';
import type { ProjectDetail, TechItem } from '@/types';
import { useI18n } from '@/lib/i18n';
import { getTabClasses } from '@/lib/theme/tokens';

type OverviewSection = 'technologies' | 'projects';


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
  const [hasVisitedProjects, setHasVisitedProjects] = useState(false);
  const [projectTrail, setProjectTrail] = useState<Array<{ project: ProjectDetail; tech: TechItem | null; name: string; trigger: HTMLElement | null }>>([]);
  const returnToProject = projectTrail.at(-1);
  const projectTriggerRef = useRef<HTMLElement | null>(null);

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
    projectTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
    requestAnimationFrame(() => {
      if (projectTriggerRef.current?.isConnected) projectTriggerRef.current.focus();
      else if (!selectedTech) document.getElementById(`project-card-${selectedProject?.id}`)?.focus();
    });
  };

  const handleProjectTechnologySelect = (name: string) => {
    const tech = allTechItems.find(item => item.name === name);
    if (!tech || !selectedProject) return;
    setProjectTrail(trail => [...trail, { project: selectedProject, tech: selectedTech, name, trigger: projectTriggerRef.current }]);
    setIsProjectModalOpen(false);
    setSelectedProject(null);
    setSelectedTech(tech);
    requestAnimationFrame(() => document.getElementById('tech-detail-back-button')?.focus());
  };

  const handleTechSelect = (tech: TechItem) => {
    setSelectedTech(tech);
  };

  const handleBackToOverview = () => {
    if (returnToProject) {
      setSelectedTech(returnToProject.tech);
      setSelectedProject(returnToProject.project);
      setIsProjectModalOpen(true);
      projectTriggerRef.current = returnToProject.trigger;
      setProjectTrail(trail => trail.slice(0, -1));
      requestAnimationFrame(() => document.getElementById(`project-tech-${returnToProject.name}`)?.focus());
      return;
    }
    const selectedTechId = selectedTech?.id;
    setSelectedTech(null);

    if (selectedTechId) {
      requestAnimationFrame(() => {
        document.getElementById(`tech-card-${selectedTechId}`)?.focus();
      });
    }
  };

  const handleSectionChange = (section: OverviewSection) => {
    if (section === 'projects') setHasVisitedProjects(true);
    setActiveSection(section);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const nextSection: OverviewSection = event.key === 'ArrowLeft' || event.key === 'Home'
      ? 'technologies'
      : 'projects';
    handleSectionChange(nextSection);
    requestAnimationFrame(() => {
      document.getElementById(`${nextSection}-tab`)?.focus();
    });
  };

  return (
    <>
      <div className="space-y-8 sm:space-y-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
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
                className={getTabClasses(activeSection === 'technologies')}
                onClick={() => handleSectionChange('technologies')}
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
                className={getTabClasses(activeSection === 'projects')}
                onClick={() => handleSectionChange('projects')}
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
              {/* Defer the unvisited tab, then retain it for fast, stateful revisits. */}
              {hasVisitedProjects && (
                <AllProjectsSection
                  projects={allProjects}
                  technologyCategories={techCategoryByName}
                  onProjectSelect={handleProjectSelect}
                />
              )}
            </div>
          </div>
        ) : (
          <TechDetailView
            backLabel={returnToProject ? (locale === 'en' ? `Back to ${returnToProject.project.name}` : `${returnToProject.project.name}に戻る`) : undefined}
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
        availableTechnologies={allTechItems.map(tech => tech.name)}
        onTechnologySelect={handleProjectTechnologySelect}
        isOpen={isProjectModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
