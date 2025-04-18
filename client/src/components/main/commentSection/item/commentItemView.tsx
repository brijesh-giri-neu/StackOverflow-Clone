import { useIsCommentOwner } from "../../../../hooks/useCommentItem";
import { CommentType } from "../../../../types/entityTypes";

/**
 * Props for the CommentItem component.
 * Includes the comment data, current user ID, and edit/delete handlers.
 */
interface Props {
  comment: CommentType;
  currentUserId?: string;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Renders a single comment item with conditional edit/delete options
 * if the current user is the comment owner.
 */
const CommentItem = ({ comment, currentUserId, onEdit, onDelete }: Props) => {
  const isOwner = useIsCommentOwner(comment.userId, currentUserId);

  return (
    <li className="comment-item">
      <span>{comment.isDeleted ? "[deleted]" : comment.text}</span>
      {isOwner && !comment.isDeleted && (
        <div className="comment-actions">
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default CommentItem;
