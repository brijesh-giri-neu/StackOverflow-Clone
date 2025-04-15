/**
 * The module defines the functions to interact with the REST APIs for the tags service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { PaginatedTagAPIResponseType } from "../types/entityTypes";

// The base URL for the tags API
const TAG_API_URL = `${REACT_APP_API_URL}/tag`;

/**
 * Fetches a paginated list of tags from the server along with the number of questions associated with each tag.
 *
 * @param {number} page - The page number for pagination (1-based). Defaults to 1.
 * @param {number} limit - The number of tags to retrieve per page. Defaults to 20.
 * @returns {Promise<PaginatedTagAPIResponseType>} - A promise that resolves to the paginated tag list and pagination metadata.
 * @throws Will throw an error if the request fails or the response status is not 200.
 */
const getTagsWithQuestionNumber = async (
  page = 1,
  limit = 20
): Promise<PaginatedTagAPIResponseType> => {
  try {
    const res = await api.get(
      `${TAG_API_URL}/getTagsWithQuestionNumber`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    if (res.status !== 200) {
      throw new Error("Error when fetching tags with question number");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

export { getTagsWithQuestionNumber };
