import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';
import { isAuthorized } from '../middlewares/auth/isAuthorized';
import Vote from '../models/votes';
import { VoteType, PostType } from '../types/types';

const router = express.Router();

/**
 * @route   POST /votes
 * @desc    Register or update a vote on a post (question or answer)
 * @access  Protected
 * @body    { postId: string, postType: "Question" | "Answer", type: -1 | 1 }
 * @returns {Response} - 200 OK if vote is registered/updated successfully
 */
router.post('/', isAuthenticated, isAuthorized, async (req: Request, res: Response) => {
    try {
        const { postId, postType, type, userId } = req.body;

        // Validation
        if (!postId || !postType || (type !== 1 && type !== -1)) {
            return res.status(400).json({ message: 'Invalid vote payload' });
        }

        await Vote.registerVote({
            postId: new mongoose.Types.ObjectId(postId),
            postType: postType as PostType,
            type: type as VoteType,
            userId: userId,
        });

        res.status(200).json({ message: 'Vote registered successfully' });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ message: 'Failed to register vote' });
    }
});

export default router;
