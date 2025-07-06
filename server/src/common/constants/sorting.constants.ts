export const SORTING_CONSTANTS = {
  DEFAULT_SORT_FIELD: 'symbol',
  DEFAULT_SORT_ORDER: 'asc',
  SORT_OPTIONS: {
    SYMBOL: 'symbol',
    NAME: 'name',
    EXCHANGE: 'exchangeShortName',
  },
} as const;

export type SortField =
  (typeof SORTING_CONSTANTS.SORT_OPTIONS)[keyof typeof SORTING_CONSTANTS.SORT_OPTIONS];
export type SortOrder = 'asc' | 'desc';
