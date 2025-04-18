import { useEffect, useState } from "react";

/**
 * A custom hook for managing the comment form state and validation.
 *
 * @param initialText - The initial value of the comment input (optional).
 * @param onSubmit - Function to call when a valid comment is submitted.
 * @param onCancel - Optional function to call when the user cancels editing.
 * @returns Form state and handlers for text input, submit, and cancel actions.
 */
export const useCommentForm = (
  initialText: string = "",
  onSubmit: (text: string) => void,
  onCancel?: () => void
) => {
  const [text, setText] = useState(initialText);
  const [textErr, setTextErr] = useState("");

  useEffect(() => {
    setText(initialText);
    setTextErr("");
  }, [initialText]);

  const handleSubmit = () => {
    if (!text.trim()) {
      setTextErr("Cannot post empty comment");
      return;
    }

    if (text.length > 600) {
      setTextErr("Comment cannot exceed 600 characters");
      return;
    }
    
    onSubmit(text.trim());
    setText("");
    setTextErr("");
  };

  return {
    text,
    setText,
    textErr,
    handleSubmit,
    handleCancel: () => {
      setTextErr("");
      onCancel?.();
    },
  };
};
