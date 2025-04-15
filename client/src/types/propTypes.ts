/**
 * Props for the Pagination component.
 */
export interface PaginationProps {
  /**
   * The current active page number (1-based).
   */
  currentPage: number;

  /**
   * Total number of available pages.
   */
  totalPages: number;

  /**
   * Number of items per page.
   */
  pageSize: number;

  /**
   * Function to be called when changing pages.
   * @param page - The new page number to fetch.
   * @param pageSize - The number of items per page.
   */
  setPage: (page: number, pageSize: number) => void;
}
