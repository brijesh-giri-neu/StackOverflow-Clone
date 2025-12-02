import "./answerView.css";
import VoteButtons from "../../voteButton/voteButtonView";
import { PostType, VoteValueType } from "../../../../types/entityTypes";
import CommentSection from "../../commentSection/commentsView";

// The type definition for the props of the Answer component
interface AnswerProps {
  userId?: string;
  ansId: string;
  text: string;
  ansBy: string;
  meta: string;
  vote_score: number;
  initial_vote: VoteValueType;
}

/**
 * The component to render an answer in the answer page
 * @param props containing the answer text, the author of the answer and the meta data of the answer 
 * @returns the Answer component
 */
const Answer = ({ userId, ansId, text, ansBy, meta, vote_score, initial_vote }: AnswerProps) => {
  return (
    <div className="answer right_padding">
      <VoteButtons
          userId = {userId}
          voteScore={vote_score}
          postType={PostType.Answer}
          initialVote={initial_vote}
          postId = {ansId}
        />
      <div className="answer_question_content">
        <div id="answerText" className="answerText">
          {text}
        </div>
        <CommentSection postId={ansId} postType={PostType.Answer} userId={userId}/>
      </div>
      <div className="answerAuthor">
        <div className="answer_author">{ansBy}</div>
        <div className="answer_question_meta">
          <span className="answer_question_meta_value">{meta}</span>
        </div>
      </div>
    </div>
  );
};

export default Answer;
