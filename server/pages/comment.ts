import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';
import { isAuthorized } from '../middlewares/auth/isAuthorized';
import { PostType } from '../types/types';
import Comment from '../models/comments';

const router = express.Router();

/**
 * @route POST /comment/add
 * @description Add a new comment to a question or answer.
 * @access Authenticated and Authorized users only
 * @param {string} postId - The ID of the post (question/answer) being commented on.
 * @param {PostType} postType - The type of the post ("Question" or "Answer").
 * @param {string} text - The comment text.
 * @returns {Object} The newly created comment.
 */
router.post('/add', isAuthenticated, isAuthorized, async (req: Request, res: Response) => {
    const { postId, postType, text } = req.body;
    const userId = req.session.userId;

    const comment = await Comment.addComment({
        postId: new mongoose.Types.ObjectId(postId),
        postType: postType as PostType,
        text: text,
        userId: new mongoose.Types.ObjectId(userId),
    });

    res.status(200).json(comment);
});

/**
 * @route POST /comment/edit
 * @description Edit an existing comment.
 * @access Authenticated and Authorized users only
 * @param {string} _id - The ID of the comment to edit.
 * @param {string} postId - The ID of the post associated with the comment.
 * @param {PostType} postType - The type of the post ("Question" or "Answer").
 * @param {string} text - The updated comment text.
 * @returns {Object} The updated comment.
 */
router.post('/edit', isAuthenticated, isAuthorized, async (req: Request, res: Response) => {
    const { _id ,postId, postType, text } = req.body;
    const userId = req.session.userId;

    const comment = await Comment.editComment({
        _id: _id,   // Need commentId to edit existing comment
        postId: new mongoose.Types.ObjectId(postId),
        postType: postType as PostType,
        text: text,
        userId: new mongoose.Types.ObjectId(userId),
    });

    res.status(200).json(comment);
});

/**
 * @route POST /comment/delete/:id
 * @description Soft deletes a comment by its ID.
 * @access Authenticated and Authorized users only
 * @param {string} id - The ID of the comment to delete.
 * @returns {Object} The deleted comment (marked as isDeleted).
 */
router.post('/delete/:id', isAuthenticated, isAuthorized, async (req: Request, res: Response) => {
    const _id = req.params.id;
    const userId = req.session.userId as string;

    const comment = await Comment.deleteComment(_id, userId);

    res.status(200).json(comment);
});

/**
 * @route GET /comment/:postType/:postId
 * @description Get all comments for a specific question or answer.
 * @access Public
 * @param {string} postType - The type of the post ("Question" or "Answer").
 * @param {string} postId - The ID of the post.
 * @returns {Array} List of comments for the specified post.
 */
router.get('/:postType/:postId', async (req: Request, res: Response) => {
    const { postType, postId } = req.params;

    const parsedPostType = postType as PostType;
    const parsedPostId = new mongoose.Types.ObjectId(postId);

    const comment = await Comment.getCommentsForPost(parsedPostId, parsedPostType);
    
    res.status(200).json(comment);
});

export default router;