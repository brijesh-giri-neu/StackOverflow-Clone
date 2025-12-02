import { useState, useEffect } from "react";
import { CommentType, PostType } from "../types/entityTypes";
import { useComment } from "./useComment";

/**
 * A custom hook to manage the comment section for a post (question or answer).
 * It handles fetching, submitting, editing, and deleting comments.
 *
 * @param postId - The ID of the post.
 * @param postType - The type of the post (Question or Answer).
 * @param userId - The ID of the logged-in user (optional).
 * @returns An object with comment list, editing state, loading state, and handlers for comment actions.
 */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
