import express from 'express';
import { Response } from 'express';
import Tag from '../models/tags';

const router = express.Router();

/**
 * @route   GET /tag/getTagsWithQuestionNumber
 * @desc    Get all tags with their associated question counts. This route retrieves all questions, 
 *          populates their associated tags, and calculates how many times each tag is used across 
 *          all questions.
 * @access  Public
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Response} - A JSON response containing a list of tags and their associated question counts. 
 *                       Each entry will include the tag name and the number of questions using that tag.
 */
router.get("/getTagsWithQuestionNumber", async (_, res: Response) => {
    const tagCounts = await Tag.getTagQuestionCount();
    const result = Object.values(tagCounts);
    res.status(200).json(result);
});

export default router;
