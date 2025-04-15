import "./tagPageView.css";
import Tag from "./tag/tagView";
import { useTagPage } from "../../../hooks/useTagPage";
import {
  VoidFunctionType,
  ClickTagFunctionType,
  SetTagPageFunctionType,
} from "../../../types/functionTypes";
import Pagination from "../../pagination";

// The type definition for the props of the TagPage component
interface TagPageProps {
  page: number;
  limit: number;
  userId?: string;
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
  setTagPage: SetTagPageFunctionType;
}

/**
 * The component that renders all the tags in the application.
 * It composed of Tag components.
 * @param param0 containing the functions to render the questions of a tag and to add a new question
 * @returns the TagPage component
 */
const TagPage = ({ page, limit, userId, clickTag, handleNewQuestion, setTagPage }: TagPageProps) => {
  const { tlist, pagination } = useTagPage({page, limit});
  return (
    <>
      <div className="space_between right_padding">
        <div className="bold_title">{pagination.totalItems} Tags</div>
        <div className="bold_title">All Tags</div>
        <div className="button_container">
          {userId && (
            <button className="bluebtn" onClick={handleNewQuestion}>
              Ask a Question
            </button>
          )}
        </div>
      </div>
      <div className="tag_list right_padding">
        {tlist.map((t, idx) => (
          <Tag key={idx} t={t} clickTag={clickTag} />
        ))}
      </div>
      <div className="pagination-wrapper">
        <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            setPage={(newPage, pageSize) => setTagPage(newPage, pageSize)}
          />
      </div>
    </>
  );
};

export default TagPage;
