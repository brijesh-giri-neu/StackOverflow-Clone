import "./questionView.css";
import { getMetaData } from "../../../../utils";
import {
  ClickTagFunctionType,
  IdFunctionType,
} from "../../../../types/functionTypes";
import { Tag, AnswerResponseType } from "../../../../types/entityTypes";

/**
 * Props for the Question component.
 * Includes question data and handlers for tag clicks and answer navigation.
 */
interface QuestionProps {
  q: {
    _id: string;
    answers: AnswerResponseType[];
    views: number;
    title: string;
    tags: Tag[];
    asked_by: string;
    ask_date_time: string;
    vote_score?: number;
  };
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
}


/**
 * Renders a question preview card with title, tags, stats, and author info.
 *
 * @param q - The question object containing title, tags, answers, and metadata.
 * @param clickTag - Handler for when a tag is clicked.
 * @param handleAnswer - Handler for when the question is clicked (to view/answer it).
 */
const Question = ({ q, clickTag, handleAnswer }: QuestionProps) => {
  const answerCount = q.answers.length || 0;
  const voteCount = q.vote_score ?? 0;
  
  return (
    <div
      className="question right_padding"
      onClick={() => {
        handleAnswer(q._id);
      }}
    >
      <div className="postStats">
        <div className="stat-item votes-stat">
          <div className="stat-number">{voteCount}</div>
          <div className="stat-label">votes</div>
        </div>
        <div className={`stat-item answers-stat ${answerCount > 0 ? 'has-answers' : ''}`}>
          <div className="stat-number">{answerCount}</div>
          <div className="stat-label">{answerCount === 1 ? 'answer' : 'answers'}</div>
        </div>
        <div className="stat-item views-stat">
          <div className="stat-number">{q.views}</div>
          <div className="stat-label">{q.views === 1 ? 'view' : 'views'}</div>
        </div>
      </div>
      <div className="question_mid">
        <div className="postTitle">{q.title}</div>
        <div className="question_tags">
          {q.tags.map((tag, idx) => {
            return (
              <button
                key={idx}
                className="question_tag_button"
                onClick={(e) => {
                  e.stopPropagation();
                  clickTag(tag.name);
                }}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="lastActivity">
        <div className="question_author">{q.asked_by}</div>
        <div className="question_meta">
          asked {getMetaData(new Date(q.ask_date_time))}
        </div>
      </div>
    </div>
  );
};

export default Question;
