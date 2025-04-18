import "./paginationView.css";
import { PaginationProps } from "../../types/propTypes";
import { usePagination } from "../../hooks/usePagination";
import PageSizeSelector from "./selector/pageSizeSelectorView";
import PaginationButtons from "./buttons/buttonsView";

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

    return (
        <div className="pagination-wrapper">
            <div className="pagination">
                <PaginationButtons
                    pageNumber={pageNumber}
                    totalPages={total}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    showPrev={showPrev}
                />
                <PageSizeSelector
                    value={localPageSize}
                    onChange={handlePageSizeChange}
                />
            </div>
        </div>
    );
};

export default Pagination;