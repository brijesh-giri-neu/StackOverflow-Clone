import "./headerView.css";
import { VoidFunctionType } from "../../../../types/functionTypes";

// The props for the AnswerHeader component
interface AnswerHeaderProps {
  title: string;
  userId?: string;
  handleNewQuestion: VoidFunctionType;
}

/**
 * The header of the answer page
 * @param props contains the number of answers, the title of the question and the function to post a new question 
 * @returns the AnswerHeader component
 */
const AnswerHeader = ({ title, userId, handleNewQuestion }: AnswerHeaderProps) => {
  return (
    <div id="answersHeader" className="space_between right_padding">
      <div className="bold_title answer_question_title">{title}</div>
      <div className="button_container">
        {userId && (
          <button
            className="btn btn-primary"
            onClick={() => {
              handleNewQuestion();
            }}
          >
            Ask a Question
          </button>
        )}
      </div>
    </div>
  );
};

export default AnswerHeader;
