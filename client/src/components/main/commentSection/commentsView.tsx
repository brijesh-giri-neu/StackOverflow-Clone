import "./commentsView.css";
import { PostType } from "../../../types/entityTypes";
import CommentForm from "./form/commentFormView";
import CommentList from "./list/commentListView";
import { useCommentSection } from "../../../hooks/useCommentSection";
import { useState } from "react";

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

  const [showForm, setShowForm] = useState(false);

  // Don't show anything if there are no comments and no user to add comments
  if (!loading && comments.length === 0 && !userId) {
    return null;
  }

  return (
    <div className="comment-section">
      {comments.length > 0 && (
        <div className="comment-header">
          <h4>Comments</h4>
          {userId && !showForm && (
            <button
              type="button"
              className="comment_toggle_link comment_header_toggle"
              onClick={() => setShowForm(true)}
            >
              Add a comment
            </button>
          )}
        </div>
      )}
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
            <>
              {comments.length === 0 && !showForm && (
                <div className="comment-header">
                  <div></div>
                  <button
                    type="button"
                    className="comment_toggle_link comment_header_toggle"
                    onClick={() => setShowForm(true)}
                  >
                    Add a comment
                  </button>
                </div>
              )}
              {showForm && (
                <CommentForm
                  initialText={editTarget?.text}
                  isEditing={!!editTarget}
                  onSubmit={submitComment}
                  onCancel={() => {
                    cancelEdit();
                    setShowForm(false);
                  }}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
