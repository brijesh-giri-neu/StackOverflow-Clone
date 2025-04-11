import "./questionBodyView.css";
import VoteButtons from "../../voteButton/voteButtonView";
import { PostType } from "../../../../types/entityTypes";

// The type definition for the props of the QuestionBody component
interface QuestionBodyProps {
  userId?: string
  qId: string,
  views: number;
  text: string;
  askby: string;
  meta: string;
  vote_score: number;
}

/**
 * The component renders the meta data of the question displaying all answers of a question.
 * @param props containing the views, text, askby and meta data of the question 
 * @returns the question body component
 */
const QuestionBody = ({ qId, userId, vote_score, views, text, askby, meta }: QuestionBodyProps) => {
  return (
    <div id="questionBody" className="questionBody right_padding">
      <div className="question_body_container">
        <VoteButtons
          userId = {userId}
          voteScore={vote_score}
          postType={PostType.Question}
          initialVote={undefined}
          postId = {qId}
        />
        <div className="bold_title answer_question_view">{views} views</div>
        <div className="answer_question_text">{text}</div>
        <div className="answer_question_right">
          <div className="question_author">{askby}</div>
          <div className="answer_question_meta">asked {meta}</div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBody;
