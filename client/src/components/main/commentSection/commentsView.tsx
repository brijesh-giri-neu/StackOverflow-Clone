import "./commentsView.css";
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

  // Don't show anything if there are no comments and no user to add comments
  if (!loading && comments.length === 0 && !userId) {
    return null;
  }

  // If there are no comments but the user can add one, just show the form without extra spacing/border
  if (!loading && comments.length === 0 && userId) {
    return (
      <CommentForm
        initialText={editTarget?.text}
        isEditing={!!editTarget}
        onSubmit={submitComment}
        onCancel={cancelEdit}
      />
    );
  }

  return (
    <div className="comment-section">
      {comments.length > 0 && <h4>Comments</h4>}
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <>
          {comments.length > 0 && (
            <CommentList
              comments={comments}
              currentUserId={userId}
              onEdit={setEditTarget}
              onDelete={deleteComment}
            />
          )}
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
