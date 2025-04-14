import "./index.css";
import { PaginationProps } from "../../types/propTypes";
import { usePagination } from "../../hooks/usePagination";

/**
 * A component to render pagination controls ("Prev", "Next", and page info).
 * It supports generic navigation for lists like questions or tags.
 *
 * @param {PaginationProps} props - The props to configure pagination behavior.
 * @returns {JSX.Element} The pagination UI component.
 */
const Pagination = ({
    currentPage,
    totalPages,
    pageSize,
    setPage,
  }: PaginationProps): JSX.Element => {
    const {
      handleNext,
      handlePrev,
      handlePageSizeChange,
      showPrev,
      pageNumber,
      totalPages: total,
      localPageSize,
    } = usePagination({ currentPage, totalPages, pageSize, setPage });

    const pageSizeOptions = [5, 10, 20, 50];

    return (
        <div className="pagination">
            <div className="pagination-controls">
                {showPrev && (
                    <button 
                        className="prev-btn pagination-button" 
                        onClick={handlePrev}
                    >
                        Prev
                    </button>
                )}
                <span className="page-info">
                    Page {pageNumber} of {total}
                </span>
                <button 
                    className="next-btn pagination-button" 
                    onClick={handleNext}
                    disabled={pageNumber>=totalPages}
                >
                    Next
                </button>
            </div>
            <div className="page-size-selector">
                <label htmlFor="pageSize">Items per page:</label>
                <select
                    id="pageSize"
                    value={localPageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                    {opt}
                    </option>
                ))}
                </select>
            </div>
        </div>
    );
};

export default Pagination;