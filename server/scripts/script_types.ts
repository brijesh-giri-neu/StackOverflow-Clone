import mongoose from "mongoose";

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
  ans_by: string;
  ans_date_time: Date;
  vote_score: number;
}

export interface IQuestionDB {
  _id?: mongoose.Types.ObjectId;
  title: string;
  text: string;
  tags: ITagDB[];
  answers: (IAnswerDB | mongoose.Types.ObjectId)[];
  asked_by?: string;
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
  user: mongoose.Types.ObjectId; // Reference to the User document
  fullName: string;
  location?: string;
  title?: string;
  aboutMe?: string;
  website?: string;
  twitter?: string;
  github?: string;
}