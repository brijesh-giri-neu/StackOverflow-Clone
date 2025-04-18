import "./headerView.css";
import OrderButton from "./orderButton/orderButtonView";
import {
  VoidFunctionType,
  MessageFunctionType,
} from "../../../../types/functionTypes";

/**
 * Props for the QuestionHeader component.
 * Includes title text, question count, user ID, and handlers for ordering and asking a question.
 */
interface QuestionHeaderProps {
  title_text: string;
  qcnt: number;
  userId?: string;
  setQuestionOrder: MessageFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 * Displays the header for the question page with a title, question count,
 * sort buttons, and an "Ask a Question" button (if user is logged in).
 */
const QuestionHeader = ({
  title_text,
  qcnt,
  userId,
  setQuestionOrder,
  handleNewQuestion,
}: QuestionHeaderProps) => {
  return (
    <div>
      <div className="space_between right_padding">
        <div className="bold_title">{title_text}</div>
        {userId && (
          <button className="bluebtn"
            onClick={() => {
              handleNewQuestion();
            }}
          >
            Ask a Question
          </button>
        )}
      </div>
      <div className="space_between right_padding">
        <div id="question_count">{qcnt} questions</div>
        <div className="btns">
          {["Newest", "Active", "Unanswered"].map((m, idx) => (
            <OrderButton
              key={idx}
              message={m}
              setQuestionOrder={setQuestionOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
