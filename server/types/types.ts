import mongoose from "mongoose";
import { IAnswerDB, IQuestionDB, ITagDB } from "../scripts/script_types";

/**
 * A type representing a question object
 * Use this type to define the shape of a question returned from Questions collection
 * 
 * @property {String} _id - The unique identifier of the question
 * @property {String} title - The title of the question
 * @property {String} text - The body of the question
 * @property {ITag[]} tags - The tags associated with the question
 * @property {IAnswer[]} answers - The answers to the question
 * @property {String} asked_by - The user who asked the question
 * @property {String} ask_date_time - The date and time the question was asked
 * @property {Number} views - The number of views the question has
 */
export interface IQuestion {
  _id?: string;
  title: string;
  text: string;
  tags: ITag[];
  answers: (IAnswer | mongoose.Types.ObjectId)[];
  asked_by?: string | mongoose.Types.ObjectId;
  ask_date_time: string;
  views: number;
  vote_score: number;
}

/**
 * A type representing an answer object
 * Use this type to define the shape of an answer returned from Answers collection
 * 
 * @property {String} _id - The unique identifier of the answer
 * @property {String} text - The body of the answer
 * @property {String} ans_by - The user who answered the question
 * @property {String} ans_date_time - The date and time the answer was posted
 */
export interface IAnswer {
  _id?: string;
  text: string;
  ans_by?: string | mongoose.Types.ObjectId;
  ans_date_time: string;
  vote_score: number;
}

/**
 * A type representing a tag object
 * Use this type to define the shape of a tag returned from Tags collection
 * 
 * @property {String} _id - The unique identifier of the tag
 * @property {String} name - The name of the tag
 */
export interface ITag {
  _id?: string;
  name: string;
}

/**
 * A type representing a user object.
 * Use this type to define the shape of a user returned from the Users collection.
 * 
 * @property {String} _id - The unique identifier of the user.
 * @property {String} email - The user's email.
 * @property {String} displayName - The user's display name.
 * @property {String} password - The user's password.
 */
export interface IUser {
  _id?: string;
  email: string;
  displayName: string;
  password: string;
  isDeleted?: boolean;
}

/**
 * A type representing a user profile object.
 * Use this type to define the shape of a user profile returned from the UserProfiles collection.
 * 
 * @property {String} _id - The unique identifier of the user profile.
 * @property {String} user - The associated user (typically the user's _id).
 * @property {String} fullName - The user's full name.
 * @property {String} [location] - The user's location.
 * @property {String} [title] - The user's title or professional role.
 * @property {String} [aboutMe] - A short bio or description of the user.
 * @property {String} [website] - The user's personal or professional website link.
 * @property {String} [twitter] - The user's Twitter (X) profile link.
 * @property {String} [github] - The user's GitHub profile link.
 */
export interface IUserProfile {
  _id?: string;
  user: (IUser | string);
  fullName?: string;
  location?: string;
  title?: string;
  aboutMe?: string;
  website?: string;
  twitter?: string;
  github?: string;
}

/**
 * A type representing a tag document schema in the tags collection
 * except the _id field, which is explicitly defined to have the type
 * mongoose.Types.ObjectId
 */
export interface ITagDocument
  extends Omit<mongoose.Document, "_id">, Omit<ITagDB, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A type representing a user document schema in the Users collection,
 * where the _id field is explicitly defined as mongoose.Types.ObjectId.
 */
export interface IUserDocument 
  extends Omit<mongoose.Document, "_id">, Omit<IUser, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A type representing a user profile document schema in the UserProfiles collection,
 * where the _id field is explicitly defined as mongoose.Types.ObjectId,
 * and the user field is explicitly defined as mongoose.Types.ObjectId.
 */
export interface IUserProfileDocument
  extends Omit<mongoose.Document, "_id">, Omit<IUserProfile, "_id" | "user"> {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | IUserDocument;
}

/**
 * A type representing a question document schema in the questions collection
 * except the _id field, which is explicitly defined to have the type
 * mongoose.Types.ObjectId and the answers field, 
 * which is explicitly defined to have the type mongoose.Types.Array
 * where the elements are either mongoose.Types.ObjectId or IAnswer objects
 * 
 * The IQuestionDocument interface also defines instance methods for a document in the questions collection.
 * 
 * Instance methods work on the document level.
 * 
 * @property {mongoose.Types.ObjectId} _id - Unique identifier.
 * @property {mongoose.Types.Array<mongoose.Types.ObjectId | IAnswer>} answers - Answers related to the question.
 * @method incrementViews - An async method that increments the views of a question by 1.
 * @method addAnswer -  An async method that adds an answer to a question.
 * @property {boolean} hasAnswers - A boolean virtual property that indicates whether the question has answers
 * @property {Date} mostRecentActivity - A Date virtual property that represents the most recent answer on the question.
 */
export interface IQuestionDocument
  extends Omit<mongoose.Document, "_id">, Omit<IQuestionDB, "_id" | "answers"> {
  _id: mongoose.Types.ObjectId;
  answers: mongoose.Types.Array<mongoose.Types.ObjectId | IQuestionDB["answers"][0]>;
  incrementViews(): Promise<IQuestionDocument>;
  addAnswer(answerId: mongoose.Types.ObjectId): Promise<IQuestionDocument>;
  hasAnswers: boolean;
  mostRecentActivity: Date;
}

/**
 * A type representing the model for the questions collection.
 * The interface also defines static methods for the model.
 * Static methods work on the model or collection level.
 * 
 * @method getNewestQuestions - An async method that returns all questions in newest order
 * @method getUnansweredQuestions - An async method that returns all questions that have no answers
 * @method getActiveQuestions - An async method that returns all questions in active order
 * @method findByIdAndIncrementViews - An async method that finds a question by id and increments its views by 1
 * @method createQuestion - An async method that creates a new question document.
 */
export interface IQuestionModel extends mongoose.Model<IQuestionDocument> {
  getNewestQuestions(): Promise<IQuestion[]>;
  getUnansweredQuestions(): Promise<IQuestion[]>;
  getActiveQuestions(): Promise<IQuestion[]>;
  findByIdAndIncrementViews(qid: string): Promise<IQuestion | null>;
  createQuestion(question: IQuestion): Promise<IQuestion>;
}

/**
 * A type representing the model for the tags collection
 * The interface also defines static methods for the model
 * 
 * @method findOrCreateMany - An async method that finds existing tags by name or creates new tags if they do not exist
 * @method validateTags - An async method that validates an array of tag ids is the same as the number of tag documents in the collection
 */
export interface ITagModel extends mongoose.Model<ITag> {
  findOrCreateMany(tagNames: string[]): Promise<ITag[]>;
  validateTags(tagIds: mongoose.Types.ObjectId[]): Promise<boolean>;
  getTagQuestionCount() : Promise<TagCountResponse>;
}

/**
 * A type representing a model for the answers collection
 * The interface also defines static methods for the model
 * 
 * @method getMostRecent - An async method that returns an array with the most recent answer document for a list of answer ids
 * @method getLatestAnswerDate - An async method that returns the latest answer date for a list of answer documents
 * @method createAnswer - An async method that creates a new answer document in the database.
 */
export interface IAnswerModel extends mongoose.Model<IAnswerDocument> {
  getMostRecent(answers: mongoose.Types.ObjectId[]): Promise<IAnswerDocument[]>;
  getLatestAnswerDate(answers: Array<IAnswerDB | object>): Promise<Date | undefined>;
  createAnswer(answer: IAnswer): Promise<IAnswerDocument>
}

/**
 * A type representing an answer document schema in the answers collection
 * except the _id field, which is explicitly defined to have the type.
 * 
 * @property {mongoose.Types.ObjectId} _id - Unique identifier.
 */
export interface IAnswerDocument
  extends Omit<mongoose.Document, "_id">, Omit<IAnswerDB, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A response type representing a tag and the number of questions associated with it.
 * 
 * @property {string} name - Tag name.
 * @property {number} qcnt - Number of questions associated with the tag.
 */
export interface TagCountResponse {
  name: string;
  qcnt: number;
}

/**
 * A type representing the model for the Users collection.
 * This interface defines static methods for user operations such as registration and login.
 * 
 * @method registerUser - An async method that registers a new user with email, displayName, and password.
 * @method loginUser - An async method that logs in a user using email and password.
 */
export interface IUserModel extends mongoose.Model<IUserDocument> {
  registerUser(user: IUser): Promise<IUser>;
  loginUser(email: string, password: string): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  deleteUserById(userId: string): Promise<void>;
}

/**
 * A type representing the model for the UserProfiles collection.
 * This interface defines static methods for profile operations such as retrieving and updating the profile.
 * 
 * @method getProfileByUserId - An async method that returns the user profile for a given user id.
 * @method updateUserProfile - An async method that updates the profile information for a given user.
 */
export interface IUserProfileModel extends mongoose.Model<IUserProfileDocument> {
  getProfileByUserId(userId: mongoose.Types.ObjectId): Promise<IUserProfile | null>;
  updateUserProfile(userId: mongoose.Types.ObjectId, profile: IUserProfile): Promise<IUserProfile>;
}

export enum VoteType {
  DownVote = -1,
  UpVote = 1,
  NoVote = 0,
}

export enum PostType {
  None = "None",
  Question = "Question",
  Answer = "Answer"
}

// TODO: Refactor the posts into a single collection that references Questions and Answers collection
export interface IVote {
  _id?: string;
  type: VoteType;
  postId: mongoose.Types.ObjectId;
  postType: PostType;
  userId: mongoose.Types.ObjectId;
}

export interface IVoteDocument
  extends Omit<mongoose.Document, "_id">, Omit<IVote, "_id">{
  _id: mongoose.Types.ObjectId;
}

export interface IVoteModel extends mongoose.Model<IVoteDocument> {
  registerVote(vote: IVote): Promise<null>;
}

export interface IComment {
  _id?: string;
  text: string;
  postId: mongoose.Types.ObjectId;
  postType: PostType;
  userId: mongoose.Types.ObjectId;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICommentDocument 
  extends Omit<mongoose.Document, "_id">, Omit<IComment, "_id">{
  _id: mongoose.Types.ObjectId;
}

export interface ICommentModel extends mongoose.Model<ICommentDocument> {
  addComment(comment: IComment): Promise<IComment>;
  editComment(comment: IComment): Promise<IComment | null>;
  deleteComment(commentId: string, userId: string): Promise<IComment | null>;
  getCommentsForPost(postId: mongoose.Types.ObjectId, postType: PostType): Promise<IComment[]>;
}

export interface PaginationMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  paginatedItems: T[];
  pagination: PaginationMetadata;
}