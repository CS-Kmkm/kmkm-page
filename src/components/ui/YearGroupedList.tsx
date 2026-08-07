import type { Key, ReactNode } from 'react';

interface YearGroupedListProps<Item, Year extends string | number> {
  items: readonly Item[];
  getKey: (item: Item) => Key;
  getYear: (item: Item) => Year;
  renderItem: (item: Item, index: number) => ReactNode;
}

export default function YearGroupedList<Item, Year extends string | number>({
  items,
  getKey,
  getYear,
  renderItem
}: YearGroupedListProps<Item, Year>) {
  let previousYear: Year | null = null;

  return items.map((item, index) => {
    const year = getYear(item);
    const showYear = index === 0 || previousYear !== year;
    previousYear = year;

    return (
      <div key={getKey(item)}>
        {showYear && (
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 min-w-[60px] sm:min-w-[80px]">
              {year}
            </div>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>
        )}
        <div className="ml-0 sm:ml-20 md:ml-24">{renderItem(item, index)}</div>
      </div>
    );
  });
}
