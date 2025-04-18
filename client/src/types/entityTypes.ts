/**
 * @file This file contains the types of data model used in the application.
 */

/**
 * The type of an answer object.
 * @property {string} text - The answer text.
 * @property {string} ans_by - The user who answered the question.
 * @property {Date} ans_date_time - The date and time when the answer was posted.
 */
interface AnswerType {
  text: string;
  ans_by?: string;
  ans_date_time: Date;
  vote_score: number;
}

/**
 * The type of an answer object received from the server.
 * @property {string} ans_by - The user who answered the question.
 * @property {string} ans_date_time - The date and time when the answer was posted.
 * @property {string} text - The answer text.
 * @property {string} _id - The unique identifier of the answer.
 */
interface AnswerResponseType {
  ans_by: string;
  ans_date_time: string;
  text: string;
  _id: string;
  vote_score: number;
  currentUserVote: VoteValueType;
}

/**
 * The type of a question object.
 * @property {string} title - The title of the question.
 * @property {string} text - The text of the question.
 * @property {Tag[]} tags - An array of tag objects.
 * @property {string} asked_by - The user who asked the question.
 * @property {Date} ask_date_time - The date and time when the question was posted.
 * @property {number} views - The number of views of the question.
 */
interface QuestionType {
  title: string;
  text: string;
  tags: Tag[];
  asked_by: string;
  ask_date_time: Date;
}

/**
 * The type of a question object received from the server.
 * @property {string} _id - The unique identifier of the question.
 * @property {AnswerType[]} answers - An array of answer objects.
 * @property {number} views - The number of views of the question.
 * @property {string} title - The title of the question.
 * @property {Tag[]} tags - An array of tag objects.
 * @property {string} asked_by - The user who asked the question.
 * @property {string} ask_date_time - The date and time when the question was posted.
 * @property {string} text - The text of the question.
 */
interface QuestionResponseType {
  _id: string;
  answers: AnswerResponseType[];
  views: number;
  title: string;
  tags: { name: string }[];
  asked_by: string;
  ask_date_time: string;
  text: string;
  vote_score: number;
  currentUserVote: VoteValueType;
}

/**
 * The type of a question object.
 * @property {AnswerType[]} answers - An array of answer objects.
 * @property {number} views - The number of views of the question.
 * @property {string} title - The title of the question.
 * @property {string} text - The text of the question.
 * @property {string} asked_by - The user who asked the question.
 * @property {string} ask_date_time - The date and time when the question was posted.
 */
interface Question {
  answers: {
    text: string;
    ans_by: string;
    ans_date_time: string;
  }[];
  title: string;
  views: number;
  text: string;
  asked_by: string;
  ask_date_time: string;
}

/**
 * The type of a tag object.
 * @property {string} name - The name of the tag.
 */
interface Tag {
  name: string;
}

/**
 * The type of a tag object received from the server.
 * @property {string} name - The name of the tag.
 * @property {string} _id - The unique identifier of the tag.
 */
interface TagResponseType {
  name: string;
  _id: string;
  qcnt: number;
}

/**
 * The type of a user object.
 * @property {string} email - The user's email (unique identifier).
 * @property {string} displayName - The user's public display name.
 * @property {string} password - The user's password (used for login and registration).
 */
interface UserType {
  email: string;
  displayName: string;
  password: string; 
}

/**
 * The type of a user object received from the server.
 * @property {string} _id - The unique identifier of the user
 * @property {string} email - The user's email (unique identifier).
 * @property {string} displayName - The user's public display name.
 * @property {string} password - The user's password (used for login and registration).
 */
interface UserResponseType {
  _id: string;
  email: string;
  displayName: string;
  password: string; 
}

/**
 * The type of a user profile object.
 * @property {string} fullName - The user's full name.
 * @property {string} location - The user's location.
 * @property {string} title - The user's title or professional role.
 * @property {string} aboutMe - A short bio or description of the user.
 * @property {string} website - The user's personal or professional website link.
 * @property {string} twitter - The user's Twitter (X) profile link.
 * @property {string} github - The user's GitHub profile link.
 */
interface UserProfileType {
  user: UserResponseType;
  fullName: string;
  location?: string;
  title?: string;
  aboutMe?: string;
  website?: string;
  twitter?: string;
  github?: string;
}

/**
 * The type of a user object received from the server.
 * @property {string} _id - The unique identifier of the user.
 * @property {string} email - The user's email.
 * @property {string} displayName - The user's public display name.
 * @property {string} fullName - The user's full name.
 * @property {string} location - The user's location.
 * @property {string} title - The user's title.
 * @property {string} aboutMe - A short bio about the user.
 * @property {string} website - The user's website link.
 * @property {string} twitter - The user's Twitter profile link.
 * @property {string} github - The user's GitHub profile link.
 */
interface UserProfileResponseType {
  _id: string;
  user: UserResponseType;
  fullName?: string;
  location?: string;
  title?: string;
  aboutMe?: string;
  website?: string;
  twitter?: string;
  github?: string;
}

/**
 * Enum representing vote values a user can cast on a post.
 * 
 * @property {number} DownVote - Indicates a downvote (-1).
 * @property {number} UpVote - Indicates an upvote (+1).
 * @property {number} NoVote - Indicates no active vote (0).
 */
export enum VoteValueType {
  DownVote = -1,
  UpVote = 1,
  NoVote = 0,
}

/**
 * Enum representing the type of post associated with a vote or comment.
 * 
 * @property {string} Question - The post is a question.
 * @property {string} Answer - The post is an answer.
 */
export enum PostType {
  Question = "Question",
  Answer = "Answer"
}

/**
 * Represents the structure of a vote object sent to the server.
 * 
 * @property {string} postId - The ID of the post being voted on.
 * @property {PostType} postType - The type of the post.
 * @property {VoteValueType} type - The vote type (up, down, or no vote).
 * @property {string} userId - The ID of the user casting the vote.
 */
interface VoteType {
  postId: string;
  postType: PostType;
  type: VoteValueType;
  userId: string;
}

/**
 * Represents a standard response returned from the vote API.
 * 
 * @property {string} message - A message describing the result (e.g., "Vote registered").
 */
interface VoteResponseType {
  message: string;
}

/**
 * A lightweight user reference type used in populated fields (e.g., comments).
 * 
 * @property {string} _id - The unique identifier of the user.
 * @property {string} displayName - The public display name of the user.
 */
interface UserRefType {
  _id: string;
  displayName: string;
}

/**
 * Represents a comment object tied to a question or answer post.
 * 
 * @property {string} _id - The unique identifier of the comment.
 * @property {string} text - The content of the comment.
 * @property {string} postId - The ID of the post the comment belongs to.
 * @property {PostType} postType - The type of the post ("Question" or "Answer").
 * @property {(string | UserRefType)} userId - The user who made the comment (can be populated).
 * @property {boolean} [isDeleted] - Indicates if the comment has been soft-deleted.
 * @property {Date} [createdAt] - Timestamp when the comment was created.
 * @property {Date} [updatedAt] - Timestamp when the comment was last updated.
 */
interface CommentType {
  _id: string;
  text: string;
  postId: string;
  postType: PostType;
  userId: (string | UserRefType);
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Metadata describing pagination details for a paginated API response.
 * 
 * @property {number} totalItems - The total number of items across all pages.
 * @property {number} totalPages - The total number of pages available.
 * @property {number} currentPage - The current page number being returned.
 * @property {number} pageSize - The number of items per page.
 */
interface PaginationMetadataType {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Represents the complete API response for paginated questions.
 * 
 * @property {QuestionResponseType[]} data - The array of question objects for the current page.
 * @property {PaginationMetadataType} pagination - Metadata about the pagination state.
 */
interface PaginatedQuestionAPIResponseType {
  data: QuestionResponseType[];
  pagination: PaginationMetadataType;
}

/**
 * Represents the complete API response for paginated tags.
 * 
 * @property {TagResponseType[]} data - The array of tag objects for the current page.
 * @property {PaginationMetadataType} pagination - Metadata about the pagination state.
 */
interface PaginatedTagAPIResponseType {
  data: TagResponseType[];
  pagination: PaginationMetadataType;
}

export type {
  AnswerType,
  QuestionType,
  Question,
  Tag,
  AnswerResponseType,
  QuestionResponseType,
  TagResponseType,
  UserType,
  UserResponseType,
  UserProfileType,
  UserProfileResponseType,
  VoteType,
  VoteResponseType,
  CommentType,
  UserRefType,
  PaginationMetadataType,
  PaginatedQuestionAPIResponseType,
  PaginatedTagAPIResponseType
};