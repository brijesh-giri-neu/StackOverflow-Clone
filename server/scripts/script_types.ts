import mongoose from "mongoose";
import { PostType, VoteType } from "../types/types";

/**
 * The types in this file are used to define the shape of the documents
 * in the database. These types are used to define the schema of a document
 * in the questions, answers, and tags collections.
 * 
 * They are similar to the types defined in types.ts, but the id field is
 * explicitly defined to have the type mongoose.Types.ObjectId, which is
 * the type of the _id field used by Mongoose in a MongoDB document.
 * 
 * These types are used only the scripts used to populate the database with
 * test data.
 */

export interface IAnswerDB {
  _id?: mongoose.Types.ObjectId;
  text: string;
  ans_by: IUserDB | mongoose.Types.ObjectId;
  ans_date_time: Date;
  vote_score: number;
}

export interface IQuestionDB {
  _id?: mongoose.Types.ObjectId;
  title: string;
  text: string;
  tags: ITagDB[];
  answers: (IAnswerDB | mongoose.Types.ObjectId)[];
  asked_by?: IUserDB | mongoose.Types.ObjectId;
  ask_date_time: Date;
  views: number;
  vote_score: number;
}

export interface ITagDB {
  _id?: mongoose.Types.ObjectId;
  name: string;
}


/**
 * Represents a User document in the database.
 * @property {mongoose.Types.ObjectId} _id - The unique identifier for the document.
 * @property {string} email - The user's email (unique identifier).
 * @property {string} displayName - The user's public display name.
 * @property {string} password - The user's password.
 */
export interface IUserDB {
  _id?: mongoose.Types.ObjectId;
  email: string;
  displayName: string;
  password: string;
  isDeleted?: boolean;
}

/**
 * Represents a UserProfile document in the database.
 * @property {mongoose.Types.ObjectId} _id - The unique identifier for the document.
 * @property {mongoose.Types.ObjectId} user - Reference to the User document.
 * @property {string} fullName - The user's full name.
 * @property {string} [location] - The user's location.
 * @property {string} [title] - The user's title or professional role.
 * @property {string} [aboutMe] - A short bio or description of the user.
 * @property {string} [website] - The user's personal or professional website link.
 * @property {string} [twitter] - The user's Twitter (X) profile link.
 * @property {string} [github] - The user's GitHub profile link.
 */
export interface IUserProfileDB {
  _id?: mongoose.Types.ObjectId;
  user: IUserDB | mongoose.Types.ObjectId;
  fullName?: string;
  location?: string;
  title?: string;
  aboutMe?: string;
  website?: string;
  twitter?: string;
  github?: string;
}

/**
 * Represents the structure of a vote object used in database operations.
 *
 * @interface IVoteDB
 * @property {mongoose.Types.ObjectId} [_id] - Optional MongoDB-generated unique identifier for the vote document.
 * @property {VoteType} type - Type of the vote: 1 for upvote, -1 for downvote.
 * @property {PostType} postType - Indicates whether the vote is for a Question or an Answer.
 * @property {mongoose.Types.ObjectId} postId - ID of the post (Question or Answer) that the vote applies to.
 * @property {mongoose.Types.ObjectId} userId - ID of the user who cast the vote.
 */
export interface IVoteDB {
  _id?: mongoose.Types.ObjectId;
  type: VoteType;
  postType: PostType;
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

/**
 * Represents the structure of a Comment document used for database operations.
 *
 * @interface ICommentDB
 * @property {mongoose.Types.ObjectId} [_id] - Optional MongoDB-generated unique identifier.
 * @property {string} text - The content of the comment (1–600 characters).
 * @property {PostType} postType - The type of post being commented on ("Question" or "Answer").
 * @property {mongoose.Types.ObjectId} postId - The ID of the target question or answer.
 * @property {mongoose.Types.ObjectId} userId - The ID of the user who wrote the comment.
 * @property {boolean} [isDeleted] - Flag to indicate if the comment has been soft deleted.
 * @property {Date} [createdAt] - Timestamp when the comment was created.
 * @property {Date} [updatedAt] - Timestamp when the comment was last updated.
 */
export interface ICommentDB {
  _id?: mongoose.Types.ObjectId;
  text: string;
  postType: PostType;
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}