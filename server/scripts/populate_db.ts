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
  Q5_DESC,
  Q5_TXT,
  Q6_DESC,
  Q6_TXT,
  Q7_DESC,
  Q7_TXT,
  Q8_DESC,
  Q8_TXT,
  Q9_DESC,
  Q9_TXT,
  Q10_DESC,
  Q10_TXT,
  Q11_DESC,
  Q11_TXT,
  Q12_DESC,
  Q12_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
  A9_TXT,
  A10_TXT,
  A11_TXT,
  A12_TXT,
  A13_TXT,
  A14_TXT,
  A15_TXT,
  A16_TXT,
  A17_TXT,
  A18_TXT,
  A19_TXT,
  A20_TXT,
  A21_TXT,
  A22_TXT,
  A23_TXT,
  A24_TXT,
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
    const t7 = await tagCreate("nodejs");
    const t8 = await tagCreate("python");
    const t9 = await tagCreate("css");
    const t10 = await tagCreate("sql");
    const t11 = await tagCreate("typescript");
    const t12 = await tagCreate("docker");
    const t13 = await tagCreate("git");
    const t14 = await tagCreate("rest-api");
    const t15 = await tagCreate("authentication");
    const t16 = await tagCreate("async-await");
    const t17 = await tagCreate("flexbox");
    const t18 = await tagCreate("react-native");

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

    const user6 = await userCreate(
      "sarah.chen@example.com",
      "Sarah Chen",
      "password1234"
    );

    const user7 = await userCreate(
      "mike.wilson@example.com",
      "Mike Wilson",
      "mypassword12"
    );

    const user8 = await userCreate(
      "emma.brown@example.com",
      "Emma Brown",
      "securepass99"
    );

    const user9 = await userCreate(
      "david.lee@example.com",
      "David Lee",
      "davidpass88"
    );

    const user10 = await userCreate(
      "lisa.anderson@example.com",
      "Lisa Anderson",
      "lisapass77"
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

    await userProfileCreate(
      user6,
      "Sarah Chen",
      "Los Angeles",
      "Full Stack Developer",
      "Building scalable web applications with modern technologies.",
      "https://sarahchen.dev",
      "https://twitter.com/sarahchen",
      "https://github.com/sarahchen"
    );

    await userProfileCreate(
      user7,
      "Mike Wilson",
      "Chicago",
      "Backend Engineer",
      "Specializing in microservices and distributed systems.",
      "https://mikewilson.io",
      "https://twitter.com/mikewilson",
      "https://github.com/mikewilson"
    );

    await userProfileCreate(
      user8,
      "Emma Brown",
      "Portland",
      "UI/UX Designer & Developer",
      "Creating beautiful and functional user interfaces.",
      "https://emmabrown.design",
      "https://twitter.com/emmabrown",
      "https://github.com/emmabrown"
    );

    await userProfileCreate(
      user9,
      "David Lee",
      "Denver",
      "Software Architect",
      "Designing robust and maintainable software systems.",
      "https://davidlee.tech",
      "https://twitter.com/davidlee",
      "https://github.com/davidlee"
    );

    await userProfileCreate(
      user10,
      "Lisa Anderson",
      "Miami",
      "Security Engineer",
      "Passionate about application security and best practices.",
      "https://lisaanderson.security",
      "https://twitter.com/lisaanderson",
      "https://github.com/lisaanderson"
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

    const a9 = await answerCreate(
      A9_TXT,
      user3,
      new Date("2023-04-15T10:30:00"),
      0
    );

    const a10 = await answerCreate(
      A10_TXT,
      user4,
      new Date("2023-04-16T14:20:00"),
      0
    );

    const a11 = await answerCreate(
      A11_TXT,
      user5,
      new Date("2023-05-01T09:15:00"),
      0
    );

    const a12 = await answerCreate(
      A12_TXT,
      user6,
      new Date("2023-05-02T11:45:00"),
      0
    );

    const a13 = await answerCreate(
      A13_TXT,
      user7,
      new Date("2023-05-10T16:30:00"),
      0
    );

    const a14 = await answerCreate(
      A14_TXT,
      user8,
      new Date("2023-05-11T08:20:00"),
      0
    );

    const a15 = await answerCreate(
      A15_TXT,
      user9,
      new Date("2023-05-20T13:10:00"),
      0
    );

    const a16 = await answerCreate(
      A16_TXT,
      user10,
      new Date("2023-05-21T15:00:00"),
      0
    );

    const a17 = await answerCreate(
      A17_TXT,
      user1,
      new Date("2023-06-01T10:00:00"),
      0
    );

    const a18 = await answerCreate(
      A18_TXT,
      user2,
      new Date("2023-06-02T12:30:00"),
      0
    );

    const a19 = await answerCreate(
      A19_TXT,
      user3,
      new Date("2023-06-10T14:15:00"),
      0
    );

    const a20 = await answerCreate(
      A20_TXT,
      user4,
      new Date("2023-06-11T09:45:00"),
      0
    );

    const a21 = await answerCreate(
      A21_TXT,
      user5,
      new Date("2023-06-15T11:20:00"),
      0
    );

    const a22 = await answerCreate(
      A22_TXT,
      user6,
      new Date("2023-06-16T13:00:00"),
      0
    );

    const a23 = await answerCreate(
      A23_TXT,
      user7,
      new Date("2023-06-20T15:30:00"),
      0
    );

    const a24 = await answerCreate(
      A24_TXT,
      user8,
      new Date("2023-06-21T10:10:00"),
      0
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

    const q5 = await questionCreate(
      Q5_DESC,
      Q5_TXT,
      [t2, t7, t16],
      [a9, a10],
      user3,
      new Date("2023-04-10T08:00:00"),
      245,
      0
    );

    const q6 = await questionCreate(
      Q6_DESC,
      Q6_TXT,
      [t8],
      [a11, a12],
      user4,
      new Date("2023-04-25T12:00:00"),
      189,
      0
    );

    const q7 = await questionCreate(
      Q7_DESC,
      Q7_TXT,
      [t9, t17],
      [a13, a14],
      user5,
      new Date("2023-05-05T10:00:00"),
      312,
      0
    );

    const q8 = await questionCreate(
      Q8_DESC,
      Q8_TXT,
      [t10],
      [a15, a16],
      user6,
      new Date("2023-05-15T14:00:00"),
      156,
      0
    );

    const q9 = await questionCreate(
      Q9_DESC,
      Q9_TXT,
      [t1, t11],
      [a17, a18],
      user7,
      new Date("2023-05-25T09:00:00"),
      278,
      0
    );

    const q10 = await questionCreate(
      Q10_DESC,
      Q10_TXT,
      [t12],
      [a19, a20],
      user8,
      new Date("2023-06-05T11:00:00"),
      167,
      0
    );

    const q11 = await questionCreate(
      Q11_DESC,
      Q11_TXT,
      [t13],
      [a21, a22],
      user9,
      new Date("2023-06-10T13:00:00"),
      134,
      0
    );

    const q12 = await questionCreate(
      Q12_DESC,
      Q12_TXT,
      [t14, t15],
      [a23, a24],
      user10,
      new Date("2023-06-15T15:00:00"),
      298,
      0
    );

    // Votes on Question Q2
    await createVote(VoteType.UpVote, PostType.Question, q2._id!, user1._id!);
    await createVote(VoteType.DownVote, PostType.Question, q2._id!, user3._id!);

    // Votes on Question Q4
    await createVote(VoteType.UpVote, PostType.Question, q4._id!, user5._id!);
    await createVote(VoteType.UpVote, PostType.Question, q4._id!, user1._id!);

    // Votes on Question Q5
    await createVote(VoteType.UpVote, PostType.Question, q5._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Question, q5._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Question, q5._id!, user4._id!);
    await createVote(VoteType.UpVote, PostType.Question, q5._id!, user5._id!);

    // Votes on Question Q6
    await createVote(VoteType.UpVote, PostType.Question, q6._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Question, q6._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Question, q6._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Question, q6._id!, user5._id!);
    await createVote(VoteType.UpVote, PostType.Question, q6._id!, user6._id!);
    await createVote(VoteType.UpVote, PostType.Question, q6._id!, user7._id!);
    await createVote(VoteType.UpVote, PostType.Question, q6._id!, user8._id!);

    // Votes on Question Q7
    await createVote(VoteType.UpVote, PostType.Question, q7._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Question, q7._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Question, q7._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Question, q7._id!, user4._id!);
    await createVote(VoteType.UpVote, PostType.Question, q7._id!, user6._id!);

    // Votes on Question Q8
    await createVote(VoteType.UpVote, PostType.Question, q8._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Question, q8._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Question, q8._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Question, q8._id!, user5._id!);
    await createVote(VoteType.UpVote, PostType.Question, q8._id!, user7._id!);

    // Votes on Question Q9
    await createVote(VoteType.UpVote, PostType.Question, q9._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Question, q9._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Question, q9._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Question, q9._id!, user4._id!);
    await createVote(VoteType.UpVote, PostType.Question, q9._id!, user5._id!);
    await createVote(VoteType.UpVote, PostType.Question, q9._id!, user6._id!);
    await createVote(VoteType.UpVote, PostType.Question, q9._id!, user8._id!);

    // Votes on Question Q10
    await createVote(VoteType.UpVote, PostType.Question, q10._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Question, q10._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Question, q10._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Question, q10._id!, user4._id!);
    await createVote(VoteType.UpVote, PostType.Question, q10._id!, user5._id!);
    await createVote(VoteType.UpVote, PostType.Question, q10._id!, user7._id!);

    // Votes on Question Q11
    await createVote(VoteType.UpVote, PostType.Question, q11._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Question, q11._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Question, q11._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Question, q11._id!, user4._id!);

    // Votes on Question Q12
    await createVote(VoteType.UpVote, PostType.Question, q12._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Question, q12._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Question, q12._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Question, q12._id!, user4._id!);
    await createVote(VoteType.UpVote, PostType.Question, q12._id!, user5._id!);
    await createVote(VoteType.UpVote, PostType.Question, q12._id!, user6._id!);
    await createVote(VoteType.UpVote, PostType.Question, q12._id!, user8._id!);

    // Votes on answer a8 (belongs to Q4)
    await createVote(VoteType.DownVote, PostType.Answer, a8._id!, user3._id!);
    await createVote(VoteType.DownVote, PostType.Answer, a8._id!, user4._id!);

    // Votes on answer a9 (belongs to Q5)
    await createVote(VoteType.UpVote, PostType.Answer, a9._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a9._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a9._id!, user4._id!);

    // Votes on answer a11 (belongs to Q6)
    await createVote(VoteType.UpVote, PostType.Answer, a11._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a11._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a11._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a11._id!, user6._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a11._id!, user7._id!);

    // Votes on answer a13 (belongs to Q7)
    await createVote(VoteType.UpVote, PostType.Answer, a13._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a13._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a13._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a13._id!, user4._id!);

    // Votes on answer a17 (belongs to Q9)
    await createVote(VoteType.UpVote, PostType.Answer, a17._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a17._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a17._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a17._id!, user4._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a17._id!, user5._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a17._id!, user6._id!);

    // Votes on answer a19 (belongs to Q10)
    await createVote(VoteType.UpVote, PostType.Answer, a19._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a19._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a19._id!, user4._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a19._id!, user5._id!);

    // Votes on answer a23 (belongs to Q12)
    await createVote(VoteType.UpVote, PostType.Answer, a23._id!, user1._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a23._id!, user2._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a23._id!, user3._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a23._id!, user4._id!);
    await createVote(VoteType.UpVote, PostType.Answer, a23._id!, user5._id!);

    // Comments on questions
    await createComment("This question really helped me understand routing.", PostType.Question, q1._id!, user3._id!);
    await createComment("I encountered this issue too — thanks for asking!", PostType.Question, q2._id!, user4._id!);
    await createComment("Good to see someone else using shared preferences!", PostType.Question, q4._id!, user5._id!);
    await createComment("Great question! I've been struggling with this as well.", PostType.Question, q5._id!, user6._id!);
    await createComment("This is a common issue when working with async code. Thanks for the detailed explanation!", PostType.Question, q5._id!, user7._id!);
    await createComment("Performance questions are always interesting. Looking forward to the answers.", PostType.Question, q6._id!, user8._id!);
    await createComment("Flexbox can be tricky at first. Once you get the hang of it, it's very powerful.", PostType.Question, q7._id!, user9._id!);
    await createComment("SQL JOINs are fundamental but can be confusing. Good question!", PostType.Question, q8._id!, user10._id!);
    await createComment("TypeScript with React is a great combination once you understand the typing.", PostType.Question, q9._id!, user1._id!);
    await createComment("Docker issues can be frustrating. Hope you find a solution!", PostType.Question, q10._id!, user2._id!);
    await createComment("Merge conflicts are part of team development. Good strategies here!", PostType.Question, q11._id!, user3._id!);
    await createComment("Security is crucial. This is an important topic to discuss.", PostType.Question, q12._id!, user4._id!);

    // Comments on answers
    await createComment("This is the cleanest solution I've seen.", PostType.Answer, a1._id!, user2._id!);
    await createComment("Thanks! Your answer worked perfectly.", PostType.Answer, a5._id!, user1._id!);
    await createComment("Very detailed explanation. Appreciate it!", PostType.Answer, a8._id!, user3._id!);
    await createComment("Perfect example! This is exactly what I needed.", PostType.Answer, a9._id!, user5._id!);
    await createComment("I prefer Promise chaining too, but async/await is more readable for complex flows.", PostType.Answer, a10._id!, user6._id!);
    await createComment("Great point about generator expressions. Memory efficiency matters!", PostType.Answer, a12._id!, user7._id!);
    await createComment("The height issue is often overlooked. Thanks for pointing that out!", PostType.Answer, a13._id!, user8._id!);
    await createComment("ROW_NUMBER() is a powerful function. Thanks for the example!", PostType.Answer, a16._id!, user9._id!);
    await createComment("React.FC is helpful but some teams prefer explicit typing. Both work!", PostType.Answer, a17._id!, user10._id!);
    await createComment("Docker logs are essential for debugging. Good tip!", PostType.Answer, a19._id!, user1._id!);
    await createComment("Communication is key when resolving conflicts. Well said!", PostType.Answer, a21._id!, user2._id!);
    await createComment("Security best practices are crucial. Thanks for the comprehensive answer!", PostType.Answer, a23._id!, user3._id!);
    await createComment("Passport.js is a great library. It handles so much for you.", PostType.Answer, a24._id!, user4._id!);

    console.log("done");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    db.close();
  }
};

populate();

console.log("processing ...");