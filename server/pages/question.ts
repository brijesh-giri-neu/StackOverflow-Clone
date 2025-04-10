import express from 'express';
import { Request, Response } from 'express';
import Question from '../models/questions';
import { IQuestion } from '../types/types';
import { filterQuestions } from '../services/questionFilterService';
import { sortQuestions } from '../services/questionSortService';

const router = express.Router();

/**
 * @route   POST /question/addQuestion
 * @desc    Add a new question. This route allows users to submit a new question with a title, text, tags, 
 *          and other relevant details. The question will be added to the database.
 * @access  Public
 * @param {Request} req - The request object, containing the body with `title`, `text`, `tags`, `asked_by`, 
 *                        and `ask_date_time` fields.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Response} - A JSON response containing the newly created question.
 */
router.post('/addQuestion', async (req: Request, res: Response) => {
    const { title, text, tags, asked_by, ask_date_time } = req.body;
    const question: IQuestion = {
        title,
        text,
        tags,
        asked_by,
        ask_date_time,
        answers: [],
        views: 0,
        vote_score: 0,
    };
    const newQuestion = await Question.createQuestion(question);
    res.status(200).json(newQuestion);
});


/**
 * @route   GET /question/getQuestionById/:qid
 * @desc    Get a question by its ID. This route retrieves a specific question by its unique identifier 
 *          and increments its view count.
 * @access  Public
 * @param {Request} req - The request object, containing the `qid` parameter in the URL.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Response} - A JSON response containing the requested question, including its details and updated views.
 */
router.get('/getQuestionById/:qid', async (req: Request, res: Response) => {
    const { qid } = req.params;
    const question = await Question.findByIdAndIncrementViews(qid);
    if (!question) {
        return res.status(400).json({ message: "Question not found" });
    }
    res.status(200).json(question);
});

/**
 * @route   GET /question/getQuestion
 * @desc    Get a list of questions. This route allows filtering and sorting of questions based on query 
 *          parameters. It can sort by order (newest) and filter by search term.
 * @access  Public
 * @param {Request} req - The request object, containing `order` (sorting order) and `search` (search query) 
 *                        as query parameters.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Response} - A JSON response containing a list of questions based on the filter and sort criteria.
 */
router.get('/getQuestion', async (req: Request, res: Response) => {
    let { order = "newest", search = "" } = req.query;
    order = order.toString();
    search = search?.toString();
    let filteredQuestions: IQuestion[] = await sortQuestions(order);
    if (search) {
        filteredQuestions = filterQuestions(filteredQuestions, search);
    }
    res.status(200).json(filteredQuestions);
});

export default router;
