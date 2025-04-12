import { REACT_APP_API_URL, api } from "./config";
import { PostType } from "../types/entityTypes";

const COMMENT_API_URL = `${REACT_APP_API_URL}/comment`;

/**
 * Adds a new comment to a question or answer.
 * 
 * @param comment - Object with postId, postType, and text.
 * @returns A promise resolving to the created comment.
 */
const addComment = async (comment: {
    postId: string;
    postType: PostType;
    text: string;
}) => {
    try {
        const res = await api.post(`${COMMENT_API_URL}/add`, comment);
        if (res.status !== 200) {
            throw new Error("Failed to add comment");
        }
        return res.data;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

/**
 * Edits an existing comment.
 * 
 * @param comment - Object with _id, postId, postType, and updated text.
 * @returns A promise resolving to the updated comment.
 */
const editComment = async (comment: {
    _id: string;
    postId: string;
    postType: PostType;
    text: string;
}) => {
    try {
        const res = await api.post(`${COMMENT_API_URL}/edit`, comment);
        if (res.status !== 200) {
            throw new Error("Failed to edit comment");
        }
        return res.data;
    } catch (error) {
        console.error("Error editing comment:", error);
        throw error;
    }
};

/**
 * Soft deletes a comment by ID.
 * 
 * @param commentId - The ID of the comment to delete.
 * @returns A promise resolving to the deleted comment object.
 */
const deleteComment = async (commentId: string) => {
    try {
        const res = await api.post(`${COMMENT_API_URL}/delete/${commentId}`);
        if (res.status !== 200) {
            throw new Error("Failed to delete comment");
        }
        return res.data;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};

/**
 * Fetches all comments for a specific post (question or answer).
 * 
 * @param postType - Either "Question" or "Answer"
 * @param postId - The ID of the question or answer
 * @returns A promise resolving to an array of comments
 */
const getCommentsForPost = async (postType: PostType, postId: string) => {
    try {
        const res = await api.get(`${COMMENT_API_URL}/${postType}/${postId}`);
        if (res.status !== 200) {
            throw new Error("Failed to fetch comments");
        }
        return res.data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};

export {
    addComment,
    editComment,
    deleteComment,
    getCommentsForPost
};
