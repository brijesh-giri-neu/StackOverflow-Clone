import "./answerView.css";
import VoteButtons from "../../voteButton/voteButtonView";
import { PostType } from "../../../../types/entityTypes";

// The type definition for the props of the Answer component
interface AnswerProps {
  userId?: string;
  ansId: string;
  text: string;
  ansBy: string;
  meta: string;
  vote_score: number;
}

/**
 * The component to render an answer in the answer page
 * @param props containing the answer text, the author of the answer and the meta data of the answer 
 * @returns the Answer component
 */
const Answer = ({ userId, ansId, text, ansBy, meta, vote_score }: AnswerProps) => {
  return (
    <div className="answer right_padding">
      <VoteButtons
          userId = {userId}
          voteScore={vote_score}
          postType={PostType.Answer}
          initialVote={undefined}
          postId = {ansId}
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
