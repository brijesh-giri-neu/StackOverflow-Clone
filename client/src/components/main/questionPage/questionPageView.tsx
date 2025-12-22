import "./questionPageView.css";
import QuestionHeader from "./header/headerView";
import Question from "./question/questionView";
import { useQuestionPage } from "../../../hooks/useQuestionPage";
import {
  ClickTagFunctionType,
  VoidFunctionType,
  IdFunctionType,
  OrderFunctionType,
  SetQuestionPageFunctionType,
} from "../../../types/functionTypes";
import Pagination from "../../pagination/paginationView";

export interface QuestionPageProps {
  title_text?: string;
  order: string;
  search: string;
  page: number;
  limit: number;
  userId?: string;
  setQuestionOrder: OrderFunctionType;
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
  handleNewQuestion: VoidFunctionType;
  setQuestionPage: SetQuestionPageFunctionType;
}

/**
 * Displays a paginated list of questions with filtering, search, and tag click support.
 *
 * @param title_text - The heading shown above the question list.
 * @param order - The selected sorting order (e.g., "newest", "active").
 * @param search - Search term to filter questions.
 * @param page - Current page number.
 * @param limit - Number of questions per page.
 * @param userId - ID of the logged-in user (optional).
 * @param setQuestionOrder - Function to update the question order.
 * @param clickTag - Handler for clicking on a tag.
 * @param handleAnswer - Handler to answer a specific question.
 * @param handleNewQuestion - Handler to ask a new question.
 * @param setQuestionPage - Function to navigate between question pages.
 * 
 * @returns A React component showing question header, list, and pagination.
 */
const QuestionPage = ({
  title_text = "All Questions",
  order,
  search,
  page,
  limit,
  userId,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
  setQuestionPage
}: QuestionPageProps) => {
  const { qlist, pagination } = useQuestionPage({ order, search, page, limit });

  return (
    <>
      <QuestionHeader
        title_text={title_text}
        qcnt={pagination.totalItems}
        userId={userId}
        order={order}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <div id="question_list" className="question_list">
        {qlist.map((q, idx) => (
          <Question
            q={{
              ...q,
              vote_score: q.vote_score ?? 0
            }}
            key={idx}
            clickTag={clickTag}
            handleAnswer={handleAnswer}
          />
        ))}
      </div>
      {title_text === "Search Results" && !qlist.length && (
        <div className="bold_title right_padding">No Questions Found</div>
      )}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        pageSize={pagination.pageSize}
        setPage={(newPage, pageSize) => setQuestionPage(search, title_text, newPage, pageSize)}
      />
    </>
  );
};

export default QuestionPage;
