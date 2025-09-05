export interface PaginationResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationOptions {
  page?: number;
  itemsPerPage?: number;
}

/**
 * Paginate an array of items
 */
export function paginate<T>(items: T[], options: PaginationOptions = {}): PaginationResult<T> {
  const { page = 1, itemsPerPage = 9 } = options;

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

/**
 * Get pagination info for display
 */
export function getPaginationInfo(result: PaginationResult<any>) {
  const { currentPage, totalPages, totalItems, itemsPerPage } = result;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return {
    startItem,
    endItem,
    totalItems,
    currentPage,
    totalPages,
  };
}

/**
 * Parse page number from URL params (for dynamic routes)
 */
export function parsePageFromParams(params: Record<string, string | undefined>): number {
  const pageParam = params.page;
  if (!pageParam) return 1;

  const page = parseInt(pageParam, 10);
  return isNaN(page) || page < 1 ? 1 : page;
}

/**
 * Parse page number from query string
 */
export function parsePageFromQuery(url: URL): number {
  const pageParam = url.searchParams.get('page');
  if (!pageParam) return 1;

  const page = parseInt(pageParam, 10);
  return isNaN(page) || page < 1 ? 1 : page;
}
