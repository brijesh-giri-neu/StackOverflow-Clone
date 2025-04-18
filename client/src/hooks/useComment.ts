import { addComment, editComment, deleteComment, getCommentsForPost } from "../services/commentService";
import { PostType, CommentType } from "../types/entityTypes";

/**
 * Custom hook to handle comment operations for a given post.
 *
 * @param postId - The ID of the post (question or answer).
 * @param postType - The type of the post ("Question" or "Answer").
 * @param userId - The ID of the currently logged-in user (optional).
 * @returns Handlers to add, edit, delete, and fetch comments.
 */
export const useComment = (
    postId: string,
    postType: PostType,
    userId?: string
) => {
    const handleAddComment = async (text: string) => {
        if (userId) {
            try {
                await addComment({ postId, postType, text });
            } catch (err) {
                console.error("Failed to add comment:", err);
            }
        } else {
            console.log("User ID not available");
        }
    };

    const handleEditComment = async (commentId: string, text: string) => {
        if (userId) {
            try {
                await editComment({ _id: commentId, postId, postType, text });
            } catch (err) {
                console.error("Failed to edit comment:", err);
            }
        } else {
            console.log("User ID not available");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (userId) {
            try {
                await deleteComment(commentId);
            } catch (err) {
                console.error("Failed to delete comment:", err);
            }
        } else {
            console.log("User ID not available");
        }
    };

    const handleFetchComments = async (): Promise<CommentType[]> => {
        try {
            return await getCommentsForPost(postType, postId);
        } catch (err) {
            console.error("Failed to fetch comments:", err);
            return [];
        }
    };

    return {
        handleAddComment,
        handleEditComment,
        handleDeleteComment,
        handleFetchComments
    };
};
