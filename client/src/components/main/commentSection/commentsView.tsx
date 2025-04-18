import { PostType } from "../../../types/entityTypes";
import CommentForm from "./form/commentFormView";
import CommentList from "./list/commentListView";
import { useCommentSection } from "../../../hooks/useCommentSection";

/**
 * Props for the CommentSection component.
 * Includes post ID, post type (question or answer), and optional user ID.
 */
interface Props {
  postId: string;
  postType: PostType;
  userId?: string;
}

/**
 * Displays the comment section for a given post, including a list of comments
 * and a form for adding or editing comments if the user is logged in.
 */
const CommentSection = ({ postId, postType, userId }: Props) => {
  const {
    comments,
    editTarget,
    setEditTarget,
    submitComment,
    deleteComment,
    cancelEdit,
    loading,
  } = useCommentSection(postId, postType, userId);

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <>
          <CommentList
            comments={comments}
            currentUserId={userId}
            onEdit={setEditTarget}
            onDelete={deleteComment}
          />
          {userId && (
            <CommentForm
              initialText={editTarget?.text}
              isEditing={!!editTarget}
              onSubmit={submitComment}
              onCancel={cancelEdit}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
