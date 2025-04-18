import "./buttonsView.css";

interface PaginationButtonsProps {
  pageNumber: number;
  totalPages: number;
  handlePrev: () => void;
  handleNext: () => void;
  showPrev: boolean;
}

/**
 * A component to render Prev/Next buttons and page info.
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
