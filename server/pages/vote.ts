import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';
import { isAuthorized } from '../middlewares/auth/isAuthorized';
import Vote from '../models/votes';
import { VoteType, PostType } from '../types/types';
import { appRateLimiter } from '../middlewares/rateLimiter';

const router = express.Router();

/**
 * @route   POST /votes
 * @desc    Register or update a vote on a post (question or answer)
 * @access  Protected
 * @body    { postId: string, postType: "Question" | "Answer", type: -1 | 1 }
 * @returns {Response} - 200 OK if vote is registered/updated successfully
 */
router.post('/', isAuthenticated, isAuthorized, appRateLimiter, async (req: Request, res: Response) => {
    const { postId, postType, type, userId } = req.body;

    try {
        await Vote.registerVote({
            postId: new mongoose.Types.ObjectId(postId),
            postType: postType as PostType,
            type: type as VoteType,
            userId: userId,
        });
        res.status(200).json({ message: 'Vote registered successfully' });
    } catch (err: unknown) {
        if (err instanceof Error && err.message === "You cannot vote on your own post") {
            return res.status(403).json({ message: err.message });
        }
    }
});

export default router;
