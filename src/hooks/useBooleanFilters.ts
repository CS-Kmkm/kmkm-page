import { useCallback, useState } from 'react';

const createFilterState = <FilterKey extends string>(
  keys: readonly FilterKey[]
): Record<FilterKey, boolean> =>
  Object.fromEntries(keys.map(key => [key, false])) as Record<FilterKey, boolean>;

export const useBooleanFilters = <FilterKey extends string>(
  keys: readonly FilterKey[]
) => {
  const [filters, setFilters] = useState<Record<FilterKey, boolean>>(() =>
    createFilterState(keys)
  );

  const toggleFilter = useCallback((key: FilterKey) => {
    setFilters(current => ({
      ...current,
      [key]: !current[key]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(createFilterState(keys));
  }, [keys]);

  return {
    filters,
    hasActiveFilters: Object.values(filters).some(Boolean),
    toggleFilter,
    clearFilters
  };
};
