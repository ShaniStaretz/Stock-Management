import {
  SORTING_CONSTANTS,
  SortField,
  SortOrder,
} from '../constants/sorting.constants';

export interface SortableItem {
  symbol?: string;
  name?: string;
  exchangeShortName?: string;
  [key: string]: any;
}

export function sortArray<T extends SortableItem>(
  array: T[],
  field: SortField = SORTING_CONSTANTS.DEFAULT_SORT_FIELD,
  order: SortOrder = SORTING_CONSTANTS.DEFAULT_SORT_ORDER,
): T[] {
  return [...array].sort((a, b) => {
    const valueA = (a[field] || '').toString().toLowerCase();
    const valueB = (b[field] || '').toString().toLowerCase();

    const comparison = valueA.localeCompare(valueB);

    return order === 'asc' ? comparison : -comparison;
  });
}
