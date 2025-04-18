import "./buttonsView.css";

interface PaginationButtonsProps {
  /** Current page number being displayed */
  pageNumber: number;
  /** Total number of pages available */
  totalPages: number;
  /** Function to handle going to the previous page */
  handlePrev: () => void;
  /** Function to handle going to the next page */
  handleNext: () => void;
  /** Whether to show the "Prev" button */
  showPrev: boolean;
}

/**
 * A component to render Prev/Next buttons and page info.
 *
 * @param pageNumber - The current page number
 * @param totalPages - The total number of pages
 * @param handlePrev - Handler for clicking the "Prev" button
 * @param handleNext - Handler for clicking the "Next" button
 * @param showPrev - Whether to display the "Prev" button
 */
const PaginationButtons = ({
  pageNumber,
  totalPages,
  handlePrev,
  handleNext,
  showPrev,
}: PaginationButtonsProps) => {
  return (
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
        Page {pageNumber} of {totalPages}
      </span>
      <button
        className="next-btn pagination-button"
        onClick={handleNext}
        disabled={pageNumber >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationButtons;
