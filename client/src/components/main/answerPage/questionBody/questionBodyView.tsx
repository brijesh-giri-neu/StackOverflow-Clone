import "./questionBodyView.css";
import VoteButtons from "../../voteButton/voteButtonView";
import { PostType, VoteValueType, Tag } from "../../../../types/entityTypes";
import CommentSection from "../../commentSection/commentsView";

// The type definition for the props of the QuestionBody component
interface QuestionBodyProps {
  userId?: string
  qId: string,
  views: number;
  answersCount: number;
  tags: Tag[];
  text: string;
  askby: string;
  meta: string;
  vote_score: number;
  initial_vote: VoteValueType;
}

/**
 * The component renders the meta data of the question displaying all answers of a question.
 * @param props containing the views, text, askby and meta data of the question 
 * @returns the question body component
 */
const QuestionBody = ({ qId, userId, vote_score, views, answersCount, tags, text, askby, meta, initial_vote }: QuestionBodyProps) => {
  return (
    <div className="answer right_padding">
      <VoteButtons
        userId = {userId}
        voteScore={vote_score}
        postType={PostType.Question}
        initialVote={initial_vote}
        postId = {qId}
      />
      <div className="answer_question_content">
        <div className="answer_question_text">{text}</div>
        <div className="answer_question_footer">
          <span className="answer_question_view">{views} views</span>
          <span className="answer_question_answers">
            {answersCount} {answersCount === 1 ? "answer" : "answers"}
          </span>
        </div>
        {!!tags.length && (
          <div className="answer_question_tags">
            {tags.map((tag, idx) => (
              <span key={idx} className="question_tag_button">
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <CommentSection postId={qId} postType={PostType.Question} userId={userId}/>
      </div>
      <div className="answerAuthor">
        <div className="question_author">{askby}</div>
        <div className="answer_question_meta">
          <span className="answer_question_meta_label">asked on</span>
          <span className="answer_question_meta_value">{meta}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionBody;
