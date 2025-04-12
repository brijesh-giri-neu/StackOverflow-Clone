import { CommentType } from "../../../../types/entityTypes";
import CommentItem from "../item/commentItemView";

interface Props {
    comments: CommentType[];
    currentUserId?: string;
    onEdit: (comment: CommentType) => void;
    onDelete: (id: string) => void;
  }
  
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
