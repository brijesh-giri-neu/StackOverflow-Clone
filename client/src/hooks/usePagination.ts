import { useCallback, useRef, useState } from "react";
import { PaginationProps } from "../types/propTypes";

/**
 * Custom hook to handle server-side pagination logic.
 *
 * @param {PaginationProps} props - The props for controlling pagination.
 * @returns {object} - An object containing:
 *   - handleNext: Function to go to the next page.
 *   - handlePrev: Function to go to the previous page.
 *   - showPrev: Boolean indicating whether the "Prev" button should be shown.
 *   - pageNumber: The current page number (1-indexed).
 *   - totalPages: Total number of available pages.
 */
export const usePagination = ({
    currentPage,
    totalPages,
    pageSize,
    setPage,
  }: PaginationProps) => {
    const pageRef = useRef(currentPage);
    const [localPageSize, setLocalPageSize] = useState(pageSize);
  
    /**
     * Navigate to the next page, if not on the last one.
     */
    const handleNext = useCallback(() => {
      if (pageRef.current < totalPages) {
        const next = pageRef.current + 1;
        pageRef.current = next;
        setPage(next, localPageSize);
      }
    }, [totalPages, localPageSize, setPage]);
  
    /**
     * Navigate to the previous page, if not on the first one.
     */
    const handlePrev = useCallback(() => {
      if (pageRef.current > 1) {
        const prev = pageRef.current - 1;
        pageRef.current = prev;
        setPage(prev, localPageSize);
      }
    }, [localPageSize, setPage]);

    /**
     * Handle a change in items per page.
     */
    const handlePageSizeChange = useCallback(
        (newSize: number) => {
        setLocalPageSize(newSize);
        setPage(1, newSize); // Reset to first page
        pageRef.current = 1;
        },
        [setPage]
    );
  
    /**
     * Whether to show the "Prev" button.
     */
    const showPrev = pageRef.current > 1;
  
    return {
      handleNext,
      handlePrev,
      handlePageSizeChange,
      showPrev,
      pageNumber: pageRef.current,
      totalPages,
      localPageSize
    };
  };
  