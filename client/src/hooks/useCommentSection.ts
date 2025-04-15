// hooks/useCommentSection.ts
import { useState, useEffect } from "react";
import { CommentType, PostType } from "../types/entityTypes";
import { useComment } from "./useComment";

export const useCommentSection = (
  postId: string,
  postType: PostType,
  userId?: string
) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [editTarget, setEditTarget] = useState<CommentType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  const {
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleFetchComments,
  } = useComment(postId, postType, userId);

  const loadComments = async () => {
    setLoading(true);
    const result = await handleFetchComments();
    setComments(result);
    setLoading(false);
  };

  const submitComment = async (text: string) => {
    if (!text.trim()) return;

    if (editTarget) {
      await handleEditComment(editTarget._id!, text);
      setEditTarget(null);
    } else {
      await handleAddComment(text);
    }
    await loadComments();
  };

  const deleteComment = async (commentId: string) => {
    await handleDeleteComment(commentId);
    await loadComments();
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  return {
    comments,
    editTarget,
    setEditTarget,
    submitComment,
    deleteComment,
    cancelEdit: () => setEditTarget(null),
    loading,
  };
};
