import { useIsCommentOwner } from "../../../../hooks/useCommentItem";
import { CommentType } from "../../../../types/entityTypes";

interface Props {
    comment: CommentType;
    currentUserId?: string;
    onEdit: () => void;
    onDelete: () => void;
}
  
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
