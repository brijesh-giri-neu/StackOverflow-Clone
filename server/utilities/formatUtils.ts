import { IAnswerDocument, IAnswer, IQuestionDocument, IQuestion, IUserProfile, IUserProfileDocument, IUser, IUserDocument, ICommentDocument, IComment } from '../types/types';
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
        ans_by: answer.ans_by instanceof mongoose.Types.ObjectId
        ? answer.ans_by.toString()
        : answer.ans_by?.displayName?.toString() || "",
        ans_date_time: answer.ans_date_time.toISOString(),
        vote_score: answer.vote_score,
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
        asked_by: question.asked_by instanceof mongoose.Types.ObjectId
            ? question.asked_by.toString()
            : question.asked_by?.displayName?.toString() || "",
        views: question.views,
        ask_date_time: question.ask_date_time.toISOString(),
        vote_score: question.vote_score,
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
                    ans_by: ans.ans_by instanceof mongoose.Types.ObjectId
                    ? ans.ans_by
                    : ans.ans_by?.displayName?.toString() || "",
                    ans_date_time: ans.ans_date_time.toISOString(),
                    vote_score: ans.vote_score,
                };
            }
        }),
    };
}

/**
 * Converts _id fields in a UserProfile document (including the nested user reference)
 * to strings. This is useful when preparing the profile data for API responses.
 *
 * @param {IUserProfileDocument} profile - The Mongoose user profile document.
 * @returns {IUserProfileResponse} - The converted profile object with _id and user as strings.
 */
export function convertToIUserProfile(
    profile: IUserProfileDocument
): IUserProfile {
    let convertedUser: IUser | string;

    if (profile.user instanceof mongoose.Types.ObjectId) {
        convertedUser = {
            _id: profile.user.toString(),
            email: "",
            displayName: "",
            password: "",
        };
    } else {
        convertedUser = {
            _id: profile.user._id.toString(),
            email: profile.user.email,
            password: profile.user.password,
            displayName: profile.user.displayName,
        };
    }

    return {
        _id: profile._id.toString(),
        user: convertedUser,
        fullName: profile.fullName,
        location: profile.location || "",
        title: profile.title || "",
        aboutMe: profile.aboutMe || "",
        website: profile.website || "",
        twitter: profile.twitter || "",
        github: profile.github || "",
    };
}

/**
 * Converts the _id field in a User document to a string.
 * This is useful when preparing the user data for API responses.
 *
 * @param {IUserDocument} user - The Mongoose user document.
 * @returns {IUser} - The converted user object with _id as a string.
 */
export function convertToIUser(user: IUserDocument): IUser {
    return {
        _id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        password: user.password,
    };
}

/**
 * Converts a Mongoose ICommentDocument to a plain IComment object.
 * This is useful for preparing comment data for API responses by ensuring the `_id` field is a string
 * and preserving all relevant fields such as timestamps and deletion status.
 *
 * @param {ICommentDocument} comment - The Mongoose comment document to be converted.
 * @returns {IComment} - The converted comment object with `_id` as a string and all fields retained.
 */
export function convertToIComment(comment: ICommentDocument): IComment {
    return {
        _id: comment._id.toString(),
        text: comment.text,
        postId: comment.postId,
        postType: comment.postType,
        userId: comment.userId,
        isDeleted: comment.isDeleted,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
    };
}
