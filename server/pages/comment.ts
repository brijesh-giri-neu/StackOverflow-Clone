import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';
import { isAuthorized } from '../middlewares/auth/isAuthorized';
import { PostType } from '../types/types';
import Comment from '../models/comments'

const router = express.Router();


router.post('/add', isAuthenticated, isAuthorized, async (req: Request, res: Response) => {
    const { postId, postType, text } = req.body;
    const userId = req.session.userId;

    // Validation
    if (!postId || !postType || !userId || !text) {
        return res.status(400).json({ message: 'Invalid comment payload' });
    }

    const comment = await Comment.addComment({
        postId: new mongoose.Types.ObjectId(postId),
        postType: postType as PostType,
        text: text,
        userId: new mongoose.Types.ObjectId(userId),
    });

    res.status(200).json(comment);
});

router.post('/edit', isAuthenticated, isAuthorized, async (req: Request, res: Response) => {
    const { _id ,postId, postType, text } = req.body;
    const userId = req.session.userId;

    // Validation
    if (!_id || !postId || !postType || !userId || !text) {
        return res.status(400).json({ message: 'Invalid comment payload' });
    }

    const comment = await Comment.editComment({
        _id: _id,   // Need commentId to edit existing comment
        postId: new mongoose.Types.ObjectId(postId),
        postType: postType as PostType,
        text: text,
        userId: new mongoose.Types.ObjectId(userId),
    });

    res.status(200).json(comment);
});

router.post('/delete/:id', isAuthenticated, isAuthorized, async (req: Request, res: Response) => {
    const _id = req.params.id;
    const userId = req.session.userId as string;

    const comment = await Comment.deleteComment(_id, userId);

    res.status(200).json(comment);
});

router.get('/:postType/:postId', async (req: Request, res: Response) => {
    const { postType, postId } = req.params;

    const parsedPostType = postType as PostType;
    const parsedPostId = new mongoose.Types.ObjectId(postId);

    const comment = await Comment.getCommentsForPost(parsedPostId, parsedPostType);
    
    res.status(200).json(comment);
});

export default router;
