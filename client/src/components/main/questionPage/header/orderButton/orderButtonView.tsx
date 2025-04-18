import "./orderButtonView.css";
import { MessageFunctionType } from "../../../../../types/functionTypes";

/**
 * Props for the OrderButton component.
 * Includes the label to display and a function to set the question order.
 */
interface OrderButtonProps {
  message: string;
  setQuestionOrder: MessageFunctionType;
}

/**
 * A button that updates the question sort order when clicked.
 *
 * @param message - The sort option label (e.g., "Newest", "Active").
 * @param setQuestionOrder - Function to update the sort order.
 */
const OrderButton = ({ message, setQuestionOrder }: OrderButtonProps) => {
  return (
    <button
      className="btn"
      onClick={() => {
        setQuestionOrder(message);
      }}
    >
      {message}
    </button>
  );
};

export default OrderButton;
