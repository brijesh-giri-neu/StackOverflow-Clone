import express from 'express';
import { Request, Response } from 'express';
import Tag from '../models/tags';
import { TagCountResponse } from '../types/types';
import { paginate } from '../utilities/pagination';

const router = express.Router();

/**
 * @route   GET /tag/getTagsWithQuestionNumber
 * @desc    Get a paginated list of tags with their associated question counts.
 *          Supports pagination through `page` and `limit` query parameters.
 * @access  Public
 * @param   {Request} req - The request object containing optional query parameters:
 *                          - page: Page number for pagination (default: "1")
 *                          - limit: Number of tags per page (default: "20")
 * @param   {Response} res - The response object used to send back the paginated tag counts.
 * @returns {Response} - A JSON response containing:
 *                       - data: An array of paginated tag counts
 *                       - pagination: Metadata including totalItems, totalPages, currentPage, and pageSize
 */
router.get("/getTagsWithQuestionNumber", async (req: Request, res: Response) => {
    const { page = "1", limit = "20" } = req.query;
  
    const pageString = page.toString();
    const limitString = limit.toString();
  
    const tagCountsMap = await Tag.getTagQuestionCount();
    const allTagCounts = Object.values(tagCountsMap) as TagCountResponse[];
  
    const { paginatedItems, pagination } = paginate<TagCountResponse>(allTagCounts, pageString, limitString);
  
    res.status(200).json({
      data: paginatedItems,
      pagination,
    });
  });

export default router;
