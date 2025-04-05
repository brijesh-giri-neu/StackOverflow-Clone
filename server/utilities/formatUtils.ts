import { IAnswerDocument, IAnswer, IQuestionDocument, IQuestion, IUserProfile, IUserProfileDocument, IUser, IUserDocument } from '../types/types';
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
    let convertedUser: IUser | mongoose.Types.ObjectId;

    if (profile.user instanceof mongoose.Types.ObjectId) {
        // If it's an ObjectId, leave it as is.
        convertedUser = profile.user;
    } else {
        // Otherwise, assume it's populated and convert its _id to a string.
        convertedUser = {
            _id: profile.user._id ? profile.user._id.toString() : "",
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