import "./answerView.css";
import VoteButtons from "../../voteButton/voteButtonView";

// The type definition for the props of the Answer component
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
}

/**
 * The component to render an answer in the answer page
 * @param props containing the answer text, the author of the answer and the meta data of the answer 
 * @returns the Answer component
 */
const Answer = ({ text, ansBy, meta }: AnswerProps) => {
  return (
    <div className="answer right_padding">
      <VoteButtons
          score={0}
          onUpvote={undefined}
          onDownvote={undefined}
          isUpVoted={true}
          isDownVoted={false}
        />
      <div id="answerText" className="answerText">
        {text}
      </div>
      <div className="answerAuthor">
        <div className="answer_author">{ansBy}</div>
        <div className="answer_question_meta">{meta}</div>
      </div>
    </div>
  );
};

export default Answer;
