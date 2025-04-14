import { PaginatedResult, PaginationMetadata } from "../types/types";

/**
 * Parses a string or number input into a positive integer.
 * Falls back to the provided default if input is invalid.
 *
 * @param value - The input value to parse.
 * @param fallback - The fallback value to use if parsing fails.
 * @returns A valid positive integer.
 */
function parsePositiveInt(value: string, fallback: number): number {
  const parsed = parseInt(value);
  return isNaN(parsed) || parsed <= 0 ? fallback : parsed;
}

/**
 * Paginates an array of items and returns the paginated subset along with metadata.
 *
 * @template T - The type of items in the array.
 * @param items - The full array of items to paginate.
 * @param page - The current page number (1-based index).
 * @param limit - The number of items per page.
 * @returns An object containing the paginated items and pagination metadata.
 */
export function paginate<T>(
  items: T[],
  page: string,
  limit: string
): PaginatedResult<T> {
  const parsedPage = parsePositiveInt(page, 1);
  const parsedLimit = parsePositiveInt(limit, 10);

  const totalItems = items.length;
  const totalPages = Math.max(Math.ceil(totalItems / parsedLimit), 1);
  const currentPage = Math.min(parsedPage, totalPages);
  const startIndex = (currentPage - 1) * parsedLimit;

  const paginatedItems = items.slice(startIndex, startIndex + parsedLimit);

  const pagination: PaginationMetadata = {
    totalItems,
    totalPages,
    currentPage,
    pageSize: parsedLimit,
  };

  return {
    paginatedItems,
    pagination,
  };
}
