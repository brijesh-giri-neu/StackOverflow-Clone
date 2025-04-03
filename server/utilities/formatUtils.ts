import { IAnswerDocument, IAnswer, IQuestionDocument, IQuestion } from '../types/types';
import mongoose from 'mongoose';

/**
 * Converts an IAnswerDocument to IAnswer, converting _id and ans_date_time to the appropriate types.
 * This is useful when preparing the answer data for API responses.
 *
 * @param {IAnswerDocument} answer - The answer document to be converted.
 * @returns {IAnswer} The converted answer object with _id and ans_date_time as strings.
 */
export function convertToIAnswer(answer: IAnswerDocument): IAnswer {
    return {
        _id: answer._id.toString(),
        text: answer.text,
        ans_by: answer.ans_by,
        ans_date_time: answer.ans_date_time.toISOString()
    };
}

/**
 * Converts _id fields in Question documents (including nested answers and tags) to strings.
 * This is useful when preparing the question data for API responses, ensuring that 
 * all ObjectId references are converted into strings.
 *
 * @param {IQuestionDocument} question - The question document to be converted.
 * @returns {IQuestion} The converted question object with _id and nested fields as strings.
 */
export function convertToIQuestion(question: IQuestionDocument): IQuestion {
    return {
        _id: question._id.toString(),
        title: question.title,
        text: question.text,
        asked_by: question.asked_by,
        views: question.views,
        ask_date_time: question.ask_date_time.toISOString(),
        tags: (question.tags || []).map(tag => ({
            ...tag,
            _id: tag._id ? tag._id.toString() : "",
        })),
        answers: (question.answers || []).map(ans => {
            if (ans instanceof mongoose.Types.ObjectId) {
                return ans;
            } else {
                return {
                    _id: ans._id?.toString(),
                    text: ans.text,
                    ans_by: ans.ans_by,
                    ans_date_time: ans.ans_date_time.toISOString(),
                };
            }
        }),
    };
}
