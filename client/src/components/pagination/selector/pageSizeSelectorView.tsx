import "./pageSizeSelectorView.css";

interface PageSizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
  options?: number[];
}

/**
 * A dropdown component to select number of items per page.
 *
 * @param value - Current selected page size
 * @param onChange - Handler for when a new size is selected
 * @param options - Optional array of page size choices
 */
const PageSizeSelector = ({
  value,
  onChange,
  options = [5, 10, 20, 50],
}: PageSizeSelectorProps) => {
  return (
    <div className="page-size-selector">
      <label htmlFor="pageSize">Items per page:</label>
      <select
        id="pageSize"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PageSizeSelector;
