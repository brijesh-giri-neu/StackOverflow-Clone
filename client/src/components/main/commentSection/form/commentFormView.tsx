import Textarea from "../../baseComponents/textarea/textAreaView";
import Form from "../../baseComponents/form/formView";
import { useCommentForm } from "../../../../hooks/useCommentForm";
import "./commentFormView.css";

/**
 * Props for the CommentForm component.
 * Includes initial text (if editing), submission handler, and optional cancel handler.
 */
interface Props {
  initialText?: string;
  isEditing?: boolean;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
}

/**
 * A form component for adding or editing a comment.
 * Displays a textarea input and action buttons for submit/cancel.
 */
const CommentForm = ({ initialText = "", isEditing, onSubmit, onCancel }: Props) => {
  const {
    text,
    setText,
    textErr,
    handleSubmit,
    handleCancel,
  } = useCommentForm(initialText, onSubmit, onCancel);

  return (
    <div className="comment_form_container">
      <Form>
        <div className="comment_form_row">
          <div className="comment_textarea">
            <Textarea
              title={isEditing ? "Edit Comment" : "Add Comment"}
              id="commentTextInput"
              val={text}
              setState={setText}
              err={textErr}
              mandatory={false}
            />
          </div>

          <div className="btn_indicator_container">
            <button className="btn btn-primary form_postBtn" onClick={handleSubmit}>
              {isEditing ? "Update Comment" : "Post Comment"}
            </button>
            {onCancel && (
              <button className="btn btn-secondary form_postBtn secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CommentForm;