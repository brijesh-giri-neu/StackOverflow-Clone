import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import UserProfile from '../models/userProfiles';

const router = express.Router();

/**
 * @route   GET /userprofile/:userId
 * @desc    Retrieve the user profile associated with the given user's ObjectId.
 * @access  Public (or Protected, depending on your authentication)
 * @param   {Request} req - The request object containing the `userId` parameter.
 * @param   {Response} res - The response object to send the result back to the client.
 * @returns {Response} - A JSON response with the user profile, or a 404 error if not found.
 */
router.get('/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const profile = await UserProfile.getProfileByUserId(new mongoose.Types.ObjectId(userId));
    if (!profile) {
        return res.status(404).json({ message: 'User profile not found' });
    }
    res.status(200).json(profile);
});

/**
 * @route   PUT /userprofile/:userId
 * @desc    Update the user profile for the given user's ObjectId.
 *          This endpoint accepts updated profile fields in the request body.
 * @access  Public (or Protected, depending on your authentication)
 * @param   {Request} req - The request object containing the `userId` parameter and updated profile data in the body.
 * @param   {Response} res - The response object to send the updated profile back to the client.
 * @returns {Response} - A JSON response containing the updated user profile.
 */
router.put('/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updatedProfile = await UserProfile.updateUserProfile(
        new mongoose.Types.ObjectId(userId),
        req.body
    );
    res.status(200).json(updatedProfile);
});

export default router;
