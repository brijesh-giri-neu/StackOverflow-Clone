import { useIsCommentOwner } from "../../../../hooks/useCommentItem";
import { CommentType, UserRefType } from "../../../../types/entityTypes";
import { getMetaData } from "../../../../utils";

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

  const authorName =
    typeof comment.userId === "string"
      ? "Unknown user"
      : (comment.userId as UserRefType).displayName;

  const createdMeta =
    comment.createdAt ? getMetaData(new Date(comment.createdAt)) : null;

  return (
    <li className="comment-item">
      <div className="comment_text">
        {comment.isDeleted ? "[deleted]" : comment.text}
      </div>
      <div className="comment_meta_wrapper">
        {!comment.isDeleted && (
          <div className="comment_meta">
            <span className="comment_author">{authorName}</span>
            {createdMeta && (
              <span className="comment_time">{createdMeta}</span>
            )}
          </div>
        )}
        {isOwner && !comment.isDeleted && (
          <div className="comment-actions">
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
          </div>
        )}
      </div>
    </li>
  );
};

export default CommentItem;
