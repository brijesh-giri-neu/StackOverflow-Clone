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
import Pagination from "../../pagination";

export interface QuestionPageProps {
  title_text?: string;
  order: string;
  search: string;
  page: number;
  limit: number;
  setQuestionOrder: OrderFunctionType;
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
  handleNewQuestion: VoidFunctionType;
  setQuestionPage: SetQuestionPageFunctionType
}

const QuestionPage = ({
  title_text = "All Questions",
  order,
  search,
  page,
  limit,
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
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <div id="question_list" className="question_list">
        {qlist.map((q, idx) => (
          <Question
            q={q}
            key={idx}
            clickTag={clickTag}
            handleAnswer={handleAnswer}
          />
        ))}
      </div>
      {title_text === "Search Results" && !qlist.length && (
        <div className="bold_title right_padding">No Questions Found</div>
      )}
      <div className="pagination-wrapper">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          setPage={(newPage, pageSize) => setQuestionPage(search, title_text, newPage, pageSize)}
        />
      </div>
    </>
  );
};

export default QuestionPage;
