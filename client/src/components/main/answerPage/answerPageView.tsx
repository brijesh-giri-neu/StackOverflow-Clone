import { getMetaData } from "../../../utils";
import Answer from "./answer/answerView";
import AnswerHeader from "./header/headerView";
import "./answerPageView.css";
import QuestionBody from "./questionBody/questionBodyView";
import { VoidFunctionType } from "../../../types/functionTypes";
import { useAnswerPage } from "../../../hooks/useAnswerPage";

// The type of the props for the AnswerPage component
interface AnswerPageProps {
  userId?: string;
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
}

/**
 * The component renders all the answers for a question.
 * It uses a hook to fetch the question and its answers.
 * @param props contains the qid, handleNewQuestion and handleNewAnswer functions 
 * which are used by the new question and anwer forms 
 * @returns the AnswerPage component
 */
const AnswerPage = ({
  userId,
  qid,
  handleNewQuestion,
  handleNewAnswer,
}: AnswerPageProps) => {
  const { question } = useAnswerPage(qid);

  if (!question) {
    return null;
  }

  return (
    <>
      <AnswerHeader
        title={question.title}
        handleNewQuestion={handleNewQuestion}
        userId={userId}
      />
      <QuestionBody
        qId={question._id}
        userId={userId}
        views={question.views}
        answersCount={question.answers.length}
        tags={question.tags}
        text={question.text}
        askby={question.asked_by}
        meta={getMetaData(new Date(question.ask_date_time))}
        vote_score={question.vote_score}
        initial_vote={question.currentUserVote}
      />
      {question.answers.map((a, idx) => (
        <Answer
          key={idx}
          userId={userId}
          ansId={a._id}
          text={a.text}
          ansBy={a.ans_by}
          meta={getMetaData(new Date(a.ans_date_time))}
          vote_score={a.vote_score}
          initial_vote={a.currentUserVote}
        />
      ))}
      {userId && (
        <button
          className="btn btn-primary ansButton"
          onClick={() => {
            handleNewAnswer();
          }}
        >
          Answer Question
        </button>
      )}
    </>
  );
};

export default AnswerPage;
