import Textarea from "../../baseComponents/textarea/textAreaView";
import Form from "../../baseComponents/form/formView";
import { useCommentForm } from "../../../../hooks/useCommentForm";
import "./commentFormView.css";
interface Props {
  initialText?: string;
  isEditing?: boolean;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
}

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
            <button className="form_postBtn" onClick={handleSubmit}>
              {isEditing ? "Update Comment" : "Post Comment"}
            </button>
            {isEditing && onCancel && (
              <button className="form_postBtn secondary" onClick={handleCancel}>
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
