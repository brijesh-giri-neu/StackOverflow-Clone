import { CommentType } from "../../../../types/entityTypes";
import CommentItem from "../item/commentItemView";

/**
 * Props for the CommentList component.
 * Includes an array of comments, current user ID, and edit/delete handlers.
 */
interface Props {
  comments: CommentType[];
  currentUserId?: string;
  onEdit: (comment: CommentType) => void;
  onDelete: (id: string) => void;
}

/**
 * Renders a list of comment items with edit and delete capabilities.
 */
const CommentList = ({ comments, currentUserId, onEdit, onDelete }: Props) => {
  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUserId={currentUserId}
          onEdit={() => onEdit(comment)}
          onDelete={() => onDelete(comment._id!)}
        />
      ))}
    </ul>
  );
};

export default CommentList;
