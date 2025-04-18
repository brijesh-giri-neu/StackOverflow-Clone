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
  return (
    <div
      className="question right_padding"
      onClick={() => {
        handleAnswer(q._id);
      }}
    >
      <div className="postStats">
        <div>{q.answers.length || 0} answers</div>
        <div>{q.views} views</div>
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
        <div>&nbsp;</div>
        <div className="question_meta">
          asked {getMetaData(new Date(q.ask_date_time))}
        </div>
      </div>
    </div>
  );
};

export default Question;
