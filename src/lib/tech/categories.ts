import type { TechItem } from '@/types';

export interface TechnologyCategoryMetadata {
  icon: string;
  label: string;
}

const TECHNOLOGY_CATEGORY_METADATA: Record<TechItem['category'], TechnologyCategoryMetadata> = {
  language: { icon: '💻', label: 'language' },
  framework: { icon: '🔧', label: 'framework' },
  tool: { icon: '⚙️', label: 'tool' },
  database: { icon: '🗄️', label: 'database' },
};

export const getTechnologyCategoryMetadata = (
  category: TechItem['category'],
): TechnologyCategoryMetadata => TECHNOLOGY_CATEGORY_METADATA[category] ?? {
  icon: '📦',
  label: String(category),
};
