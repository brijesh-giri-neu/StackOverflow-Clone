// components/comments/CommentSection.tsx
import { PostType } from "../../../types/entityTypes";
import CommentForm from "./form/commentFormView";
import CommentList from "./list/commentListView";
import { useCommentSection } from "../../../hooks/useCommentSection";

interface Props {
  postId: string;
  postType: PostType;
  userId?: string;
}

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
