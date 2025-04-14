/**
 * This module defines the functions to interact with the REST APIs for the questions service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { QuestionType, QuestionResponseType, PaginatedQuestionAPIResponseType } from "../types/entityTypes";

// The base URL for the questions API
const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

/**
 * Fetches questions from the server based on filtering, sorting, and pagination options.
 *
 * @param {string} order - The display order of the questions (e.g., "newest"). Defaults to "newest".
 * @param {string} search - A search query string to filter questions by title, text, or tags. Defaults to an empty string.
 * @param {number} page - The page number for pagination (1-based). Defaults to 1.
 * @param {number} limit - The number of questions to retrieve per page. Defaults to 10.
 * @returns {Promise<PaginatedQuestionAPIResponseType>} - A promise that resolves to a response containing the filtered list of questions and pagination metadata.
 * @throws Will throw an error if the request fails or the response status is not 200.
 */
const getQuestionsByFilter = async (
  order = "newest",
  search = "",
  page = 1,
  limit = 10
): Promise<PaginatedQuestionAPIResponseType> => {
  try {
    const res = await api.get(
      `${QUESTION_API_URL}/getQuestion`,
      {
        params: {
          order,
          search,
          page,
          limit,
        },
      }
    );

    if (res.status !== 200) {
      throw new Error("Error when fetching or filtering questions");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

/**
 * The function calls the API to get a question by its id,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param qid the id of the question to be fetched.
 * @returns the response data from the API, which contains the fetched question object.
 */
const getQuestionById = async (qid: string): Promise<QuestionResponseType> => {
  try {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);
    if (res.status !== 200) {
      throw new Error("Error when fetching question by id");
    }
    return res.data;
  } catch (error) {
    console.error(`Error fetching question ${qid}:`, error);
    throw error;
  }
};

/**
 * The function calls the API to add a new question,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param q the question object to be added.
 * @returns the response data from the API, which contains the question object added.
 */
const addQuestion = async (q: QuestionType): Promise<QuestionResponseType> => {
  try {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);
    if (res.status !== 200) {
      throw new Error("Error while creating a new question");
    }

    return res.data;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

export { getQuestionsByFilter, getQuestionById, addQuestion };
