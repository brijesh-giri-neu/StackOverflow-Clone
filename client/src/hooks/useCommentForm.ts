// hooks/useCommentForm.ts
import { useEffect, useState } from "react";

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
      setTextErr("Comment text cannot be empty");
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
