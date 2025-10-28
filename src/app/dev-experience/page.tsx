'use client';

import { useState, useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TechCategorySection from '@/components/dev-experience/TechCategorySection';
import LanguageDetailView from '@/components/dev-experience/LanguageDetailView';
import ProjectModal from '@/components/ui/ProjectModal';
import { getTechExperience, getProjectDetails } from '@/data';
import { TechItem, ProjectDetail } from '@/types';


export default function DevExperiencePage() {
  const allTechItems = getTechExperience();
  const allProjects = getProjectDetails();
  
  // Page state
  const [selectedLanguage, setSelectedLanguage] = useState<TechItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Categorize tech items
  const categorizedTech = useMemo(() => {
    const languages = allTechItems.filter(item => item.category === 'language');
    const frameworks = allTechItems.filter(item => item.category === 'framework');
    const tools = allTechItems.filter(item => item.category === 'tool');
    const databases = allTechItems.filter(item => item.category === 'database');

    return { languages, frameworks, tools, databases };
  }, [allTechItems]);

  // Get related frameworks for a language based on shared projects
  const getRelatedFrameworks = (language: TechItem) => {
    const languageProjects = new Set(language.projects);
    return categorizedTech.frameworks.filter(framework =>
      framework.projects.some(projectId => languageProjects.has(projectId))
    );
  };

  // Get projects for selected tech
  const selectedTechProjects = useMemo(() => {
    if (!selectedLanguage) return [];
    
    return selectedLanguage.projects
      .map(projectId => allProjects.find(p => p.id === projectId))
      .filter((project): project is ProjectDetail => project !== undefined);
  }, [selectedLanguage, allProjects]);

  // Get related frameworks for selected language
  const relatedFrameworks = useMemo(() => {
    if (!selectedLanguage || selectedLanguage.category !== 'language') return [];
    return getRelatedFrameworks(selectedLanguage);
  }, [selectedLanguage]);

  // Event handlers
  const handleLanguageSelect = (language: TechItem) => {
    setSelectedLanguage(language);
  };

  const handleBackToGrid = () => {
    setSelectedLanguage(null);
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
      <div className="space-y-8">
        {/* Page header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            開発経験
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            使用している技術スタック（言語、フレームワーク、ツール、データベース）と、それらを使った開発経験をご覧いただけます。
            {!selectedLanguage && 'アイコンをクリックして詳細を表示してください。'}
          </p>
        </div>

        {/* Main Content */}
        {!selectedLanguage ? (
          // Category Sections View
          <div className="space-y-12">
            <TechCategorySection
              title="プログラミング言語"
              description="使用しているプログラミング言語"
              techItems={categorizedTech.languages}
              onTechSelect={handleLanguageSelect}
            />

            <TechCategorySection
              title="フレームワーク・ライブラリ"
              description="Webアプリケーション開発に使用しているフレームワーク"
              techItems={categorizedTech.frameworks}
              onTechSelect={handleLanguageSelect}
            />

            <TechCategorySection
              title="ツール・プラットフォーム"
              description="開発環境やインフラに使用しているツール"
              techItems={categorizedTech.tools}
              onTechSelect={handleLanguageSelect}
            />

            <TechCategorySection
              title="データベース"
              description="データ管理に使用しているデータベース"
              techItems={categorizedTech.databases}
              onTechSelect={handleLanguageSelect}
            />
          </div>
        ) : (
          // Tech Detail View
          <LanguageDetailView
            language={selectedLanguage}
            projects={selectedTechProjects}
            relatedFrameworks={relatedFrameworks}
            onBack={handleBackToGrid}
            onProjectSelect={handleProjectSelect}
            onFrameworkSelect={handleLanguageSelect}
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