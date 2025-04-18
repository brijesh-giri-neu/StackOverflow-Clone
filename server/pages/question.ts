import express from 'express';
import { Request, Response } from 'express';
import Question from '../models/questions';
import { IQuestion, VoteType } from '../types/types';
import { filterQuestions } from '../services/questionFilterService';
import { sortQuestions } from '../services/questionSortService';
import Vote from '../models/votes';
import { paginate } from '../utilities/pagination';

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

    const userId = req.session?.userId;
    const currentUserVote: VoteType = VoteType.NoVote;

    if (userId) {
        const enriched = await enrichQuestionWithUserVotes(question, userId);
        return res.status(200).json(enriched);
    }
    res.status(200).json({
        ...question,
        currentUserVote
    });
});

/**
 * @route   GET /question/getQuestion
 * @desc    Get a list of questions. This route allows filtering, sorting, and pagination of questions based on query 
 *          parameters. It can sort by order (e.g., "newest"), filter by a search term, and paginate results.
 * @access  Public
 * @param   {Request} req - The request object, containing optional query parameters:
 *                          - order: Sorting order of the questions (default: "newest")
 *                          - search: Keyword to filter questions by
 *                          - page: Page number for pagination (default: "1")
 *                          - limit: Number of items per page (default: "10")
 * @param   {Response} res - The response object used to send back the filtered, sorted, and paginated questions.
 * @returns {Response} - A JSON response containing:
 *                       - data: An array of paginated questions
 *                       - pagination: Metadata including totalItems, totalPages, currentPage, and pageSize
 */
router.get('/getQuestion', async (req: Request, res: Response) => {
    const { order = "newest", search = "", page = "1", limit = "10" } = req.query;

    const orderString = order.toString();
    const searchString = search?.toString();
    const pageString = page.toString();
    const limitString = limit.toString();

    let filteredQuestions: IQuestion[] = await sortQuestions(orderString);
    if (search) {
        filteredQuestions = filterQuestions(filteredQuestions, searchString);
    }

    const { paginatedItems, pagination } = paginate<IQuestion>(filteredQuestions, pageString, limitString);

    res.status(200).json({
        data: paginatedItems,
        pagination,
    });
});

/**
 * Helper function to enrich a question and its answers with the current user's vote data.
 *
 * @param {IQuestion} question - The question to enrich with vote metadata.
 * @param {string} userId - The ID of the user whose votes are being fetched.
 * @returns {Promise<IQuestion & { currentUserVote: VoteType, answers: any[] }>} - The enriched question object.
 */
async function enrichQuestionWithUserVotes(question: IQuestion, userId: string) {
    const allPostIds = [
        question._id,
        ...question.answers.map((a) => a._id),
    ];

    const votes = await Vote.find({
        userId,
        postId: { $in: allPostIds },
    });

    const voteMap: Record<string, VoteType> = {};
    votes.forEach((vote) => {
        voteMap[vote.postId.toString()] = vote.type;
    });

    const enrichedAnswers = question.answers.map((a) => ({
        ...a,
        currentUserVote: voteMap[a._id!.toString()] ?? VoteType.NoVote,
    }));

    return {
        ...question,
        currentUserVote: voteMap[question._id!.toString()] ?? VoteType.NoVote,
        answers: enrichedAnswers,
    };
}

export default router;
