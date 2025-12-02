import "./orderButtonView.css";
import { MessageFunctionType } from "../../../../../types/functionTypes";

/**
 * Props for the OrderButton component.
 * Includes the label to display, current order, and a function to set the question order.
 */
interface OrderButtonProps {
  message: string;
  order: string;
  setQuestionOrder: MessageFunctionType;
}

/**
 * A button that updates the question sort order when clicked.
 *
 * @param message - The sort option label (e.g., "Newest", "Active").
 * @param order - The current selected order (lowercase).
 * @param setQuestionOrder - Function to update the sort order.
 */
const OrderButton = ({ message, order, setQuestionOrder }: OrderButtonProps) => {
  const isSelected = order.toLowerCase() === message.toLowerCase();
  
  return (
    <button
      className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
      onClick={() => {
        setQuestionOrder(message);
      }}
    >
      {message}
    </button>
  );
};

export default OrderButton;
