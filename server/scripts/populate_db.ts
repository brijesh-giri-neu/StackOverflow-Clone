// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)

import mongoose from "mongoose";
import Answer from "../models/answers";
import Question from "../models/questions";
import Tag from "../models/tags";
import User from "../models/users";
import Vote from "../models/votes";
import Comment from "../models/comments";
import UserProfile from "../models/userProfiles";
import { PostType, VoteType } from "../types/types";
import { ITagDB, IAnswerDB, IQuestionDB, IUserDB, IUserProfileDB, IVoteDB, ICommentDB } from "./script_types";
import {
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q4_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
} from "../data/posts_strings";


// Get arguments passed on command line
const userArgs = process.argv.slice(2);

// Check if user has passed a valid MongoDB URL
if (!userArgs[0].startsWith("mongodb")) {
  console.log(
    "ERROR: You need to specify a valid MongoDB URL as the first argument"
  );
  process.exit(1);
}

// Connect to the MongoDB instance with the URL passed as argument
const mongoDB = userArgs[0];

mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


/**
 * An asynchronous function to create a user in the Users collection of the database
 * @param email - The user's email address (must be unique)
 * @param displayName - The display name of the user
 * @param password - The user's hashed password
 * @returns A promise that resolves to the user object created in the database
 */
function userCreate(
  email: string,
  displayName: string,
  password: string
): Promise<IUserDB> {
  const userDetail: IUserDB = { email, displayName, password };

  const user = new User(userDetail);
  return user.save();
}

/**
 * an asynchronous function to create a tag in the Tags collection of the database
 * @param name tag name
 * @returns a promise that resolves to the tag object created in the database
 */
async function tagCreate(name: string): Promise<ITagDB> {
  const tagDoc = await new Tag({ name }).save();

  const tagDB: ITagDB = {
    _id: new mongoose.Types.ObjectId(tagDoc._id),
    name: tagDoc.name
  };

  return tagDB;
}

/**
 * an asynchronous function to create an answer in the Answers collection of the database
 * @param text answer text
 * @param ans_by username of the user who answered the question
 * @param ans_date_time date and time when the answer was posted
 * @returns a promise that resolves to the answer object created in the database
 */
function answerCreate(
  text: string,
  ans_by: IUserDB,
  ans_date_time: Date,
  vote_score: number,
): Promise<IAnswerDB> {
  const answerDetail: IAnswerDB = { text, ans_by, ans_date_time, vote_score };

  const answer = new Answer(answerDetail);
  return answer.save();
}

/**
 * an asynchronous function to create a question in the Questions collection of the database
 * @param title question title
 * @param text question text
 * @param tags an array of tag objects
 * @param answers an array of answer objects
 * @param asked_by username of the user who asked the question
 * @param ask_date_time date and time when the question was posted
 * @param views number of views on the question
 * @returns a promise that resolves to the question object created in the database
 */
function questionCreate(
  title: string,
  text: string,
  tags: ITagDB[],
  answers: IAnswerDB[],
  asked_by: IUserDB,
  ask_date_time: Date,
  views: number,
  vote_score: number,
): Promise<IQuestionDB> {
  const qstnDetail: IQuestionDB = {
    title,
    text,
    tags,
    answers,
    asked_by,
    ask_date_time,
    views,
    vote_score,
  };
  if (ask_date_time) qstnDetail.ask_date_time = ask_date_time;
  if (views) qstnDetail.views = views;

  const qstn = new Question(qstnDetail);
  return qstn.save();
}

/**
 * An asynchronous function to create a user profile in the UserProfiles collection.
 * @param user - The user reference (must be an existing user document)
 * @param fullName - The full name of the user
 * @param location - (Optional) location string
 * @param title - (Optional) user's title or professional role
 * @param aboutMe - (Optional) bio or description
 * @param website - (Optional) website link
 * @param twitter - (Optional) Twitter/X link
 * @param github - (Optional) GitHub link
 * @returns A promise that resolves to the created UserProfile object
 */
function userProfileCreate(
  user: IUserDB,
  fullName?: string,
  location?: string,
  title?: string,
  aboutMe?: string,
  website?: string,
  twitter?: string,
  github?: string
): Promise<IUserProfileDB> {
  const profileDetail: IUserProfileDB = {
    user,
    fullName,
    location,
    title,
    aboutMe,
    website,
    twitter,
    github,
  };

  const profile = new UserProfile(profileDetail);
  return profile.save();
}


/**
 * An asynchronous function to create a vote in the Vote collection.
 *
 * @param {VoteType} type - The type of vote (1 for upvote, -1 for downvote).
 * @param {PostType} postType - The type of post being voted on ("Question" or "Answer").
 * @param {mongoose.Types.ObjectId} postId - The ID of the question or answer being voted on.
 * @param {mongoose.Types.ObjectId} userId - The ID of the user casting the vote.
 * @returns {Promise<IVoteDB>} A promise that resolves to the vote document created in the database.
 */
function createVote(
  type: VoteType,
  postType: PostType,
  postId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<IVoteDB> {
  const voteDetail: IVoteDB = {
    type,
    postType,
    postId,
    userId,
  };

  const vote = new Vote(voteDetail);
  return vote.save();
}

/**
 * An asynchronous function to create a comment in the Comment collection.
 *
 * @param {string} text - The content of the comment (must be 1–600 characters).
 * @param {PostType} postType - Indicates whether the comment is on a Question or an Answer.
 * @param {mongoose.Types.ObjectId} postId - The ID of the post being commented on.
 * @param {mongoose.Types.ObjectId} userId - The ID of the user writing the comment.
 * @returns {Promise<ICommentDB>} A promise that resolves to the saved comment document.
 */
function createComment(
  text: string,
  postType: PostType,
  postId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<ICommentDB> {
  const commentDetail: ICommentDB = {
    text,
    postType,
    postId,
    userId
  };

  const comment = new Comment(commentDetail);
  return comment.save();
}

/**
 * an asynchronous function to populate the database with tags, answers, and questions
 */
const populate = async () => {
  try {
    const t1 = await tagCreate("react");
    const t2 = await tagCreate("javascript");
    const t3 = await tagCreate("android-studio");
    const t4 = await tagCreate("shared-preferences");
    const t5 = await tagCreate("storage");
    const t6 = await tagCreate("website");

    const user1 = await userCreate(
      "test1@example.com",
      "Test User 1",
      "securepassword123"
    );

    const user2 = await userCreate(
      "test2@example.com",
      "Test User 2",
      "securepassword123"
    );

    const user3 = await userCreate(
      "test3@example.com",
      "Test User 3",
      "securepassword123"
    );

    const user4 = await userCreate(
      "test4@example.com",
      "Test User 4",
      "securepassword123"
    );

    const user5 = await userCreate(
      "test5@example.com",
      "Test User 5",
      "securepassword123"
    );

    await userProfileCreate(
      user1,
      "Alice Doe",
      "Boston",
      "Developer",
      "I build things for the web.",
      "https://alice.dev",
      "https://twitter.com/alice",
      "https://github.com/alice"
    );

    await userProfileCreate(
      user2,
      "Bob Smith",
      "NYC",
      "Engineer",
      "Passionate about infrastructure and AI.",
      "https://bobsmith.io",
      "https://twitter.com/bobsmith",
      "https://github.com/bobsmith"
    );

    await userProfileCreate(
      user3,
      "Charlie Johnson",
      "Seattle",
      "Frontend Developer",
      "Focused on React and TypeScript.",
      "https://charlie.dev",
      "https://twitter.com/charliecode",
      "https://github.com/charliejohnson"
    );

    await userProfileCreate(
      user4,
      "Dana Lopez",
      "Austin",
      "Data Scientist",
      "Turning data into insights.",
      "https://dana.codes",
      "https://twitter.com/danalopez",
      "https://github.com/danalopez"
    );

    await userProfileCreate(
      user5,
      "Evan Zhang",
      "San Francisco",
      "DevOps Engineer",
      "I love automating everything.",
      "https://evan.dev",
      "https://twitter.com/evanzhang",
      "https://github.com/evanzhang"
    );

    const a1 = await answerCreate(
      A1_TXT,
      user1,
      new Date("2023-11-20T03:24:42"),
      0
    );
    const a2 = await answerCreate(
      A2_TXT,
      user1,
      new Date("2023-11-23T08:24:00"),
      0
    );
    const a3 = await answerCreate(
      A3_TXT,
      user1,
      new Date("2023-11-18T09:24:00"),
      0
    );
    const a4 = await answerCreate(
      A4_TXT,
      user2,
      new Date("2023-11-12T03:30:00"),
      0
    );
    const a5 = await answerCreate(
      A5_TXT,
      user2,
      new Date("2023-11-01T15:24:19"),
      0
    );
    const a6 = await answerCreate(
      A6_TXT,
      user2,
      new Date("2023-02-19T18:20:59"),
      0
    );
    const a7 = await answerCreate(
      A7_TXT,
      user2,
      new Date("2023-02-22T17:19:00"),
      0
    );
    const a8 = await answerCreate(
      A8_TXT,
      user1,
      new Date("2023-03-22T21:17:53"),
      -2
    );

    const q1 = await questionCreate(
      Q1_DESC,
      Q1_TXT,
      [t1, t2],
      [a1, a2],
      user1,
      new Date("2022-01-20T03:00:00"),
      10,
      0
    );
    const q2 = await questionCreate(
      Q2_DESC,
      Q2_TXT,
      [t3, t4, t2],
      [a3, a4, a5],
      user2,
      new Date("2023-01-10T11:24:30"),
      121,
      0
    );
    await questionCreate(
      Q3_DESC,
      Q3_TXT,
      [t5, t6],
      [a6, a7],
      user1,
      new Date("2023-02-18T01:02:15"),
      200,
      0
    );
    const q4 = await questionCreate(
      Q4_DESC,
      Q4_TXT,
      [t3, t4, t5],
      [a8],
      user2,
      new Date("2023-03-10T14:28:01"),
      103,
      2
    );

    // Votes on Question Q2
    await createVote(VoteType.UpVote, PostType.Question, q2._id!, user1._id!);
    await createVote(VoteType.DownVote, PostType.Question, q2._id!, user3._id!);

    // Votes on Question Q4
    await createVote(VoteType.UpVote, PostType.Question, q4._id!, user5._id!);
    await createVote(VoteType.UpVote, PostType.Question, q4._id!, user1._id!);

    // Votes on answer a8 (belongs to Q4)
    await createVote(VoteType.DownVote, PostType.Answer, a8._id!, user3._id!);
    await createVote(VoteType.DownVote, PostType.Answer, a8._id!, user4._id!);

    // 3 Comments on questions (Q1, Q2, Q4)
    await createComment("This question really helped me understand routing.", PostType.Question, q1._id!, user3._id!);
    await createComment("I encountered this issue too — thanks for asking!", PostType.Question, q2._id!, user4._id!);
    await createComment("Good to see someone else using shared preferences!", PostType.Question, q4._id!, user5._id!);

    // 3 Comments on answers (a1, a5, a8)
    await createComment("This is the cleanest solution I've seen.", PostType.Answer, a1._id!, user2._id!);
    await createComment("Thanks! Your answer worked perfectly.", PostType.Answer, a5._id!, user1._id!);
    await createComment("Very detailed explanation. Appreciate it!", PostType.Answer, a8._id!, user3._id!);

    console.log("done");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    db.close();
  }
};

populate();

console.log("processing ...");