export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function paginateArray<T>(
  array: T[],
  options: PaginationOptions,
): PaginationResult<T> {
  const { page, pageSize } = options;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = array.slice(start, end);
  const total = array.length;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}
