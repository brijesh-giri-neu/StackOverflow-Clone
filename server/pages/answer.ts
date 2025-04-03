import express from "express";
import { Request, Response } from 'express';
import Answer from "../models/answers";
import Question from "../models/questions";
import { IAnswer } from "../types/types";
import { convertToIAnswer } from "../utilities/formatUtils";

const router = express.Router();

/**
 * @route   POST /answer/addAnswer
 * @desc    Add a new answer to a question. This route allows users to add a new answer to a specific question.
 *          The answer will be added to the database, and the question will be updated with the new answer's ID.
 * @access  Public
 * @param {Request} req - The request object, containing the body with `qid` (Question ID) and `ans` (Answer details).
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Response} - A JSON response containing the added answer, formatted according to the IAnswer structure.
 */
router.post('/addAnswer', async (req: Request, res: Response) => {
    const { qid, ans } = req.body;
    const { text, ans_by, ans_date_time } = ans;
    const question = await Question.findById(qid);

    if (!question) {
        return res.status(400).json({ message: "Question not found" });
    }

    const answer: IAnswer = {
        text,
        ans_by,
        ans_date_time,
    };

    const addedAnswer = await Answer.createAnswer(answer);
    await question.addAnswer(addedAnswer._id);
    res.status(200).json(convertToIAnswer(addedAnswer));
});

export default router;
