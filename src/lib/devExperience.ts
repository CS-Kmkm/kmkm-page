import type { TechCategoryLookup, TechItem } from '@/types';

export const TECH_CATEGORY_ORDER: Readonly<Record<TechItem['category'], number>> = {
  language: 1,
  framework: 2,
  database: 3,
  tool: 4,
};

export function createTechCategoryLookup(
  techItems: ReadonlyArray<Pick<TechItem, 'name' | 'category'>>,
): TechCategoryLookup {
  return Object.fromEntries(
    techItems.map((item) => [item.name, item.category]),
  );
}

export function sortTechnologyNames(
  technologyNames: string[],
  categoryByName: TechCategoryLookup,
): string[] {
  return technologyNames
    .map((name, index) => ({
      name,
      index,
      order: TECH_CATEGORY_ORDER[categoryByName[name]] ?? 5,
    }))
    .sort((left, right) => left.order - right.order || left.index - right.index)
    .map(({ name }) => name);
}
