import mongoose from "mongoose";
import QuestionSchema from "./schema/question";
import { IQuestion, IQuestionDocument, IQuestionModel } from "../types/types";
import Tag from "./tags";
import Answer from "./answers";
import { convertToIAnswer, convertToIQuestion } from "../utilities/formatUtils";

/**
 * Static Method: Get all questions sorted by newest first.
 * 
 * @returns {Promise<IQuestion[]>} - A promise that resolves to an array of questions sorted by most recent.
 */
QuestionSchema.statics.getNewestQuestions = async function (): Promise<IQuestion[]> {
  return this.find()
    .sort({ ask_date_time: -1 })
    .populate({
      path: "answers",
      populate: {
        path: "ans_by",
        select: "displayName"
      }
    })
    .populate("tags")
    .populate("asked_by", "displayName")
    .lean()
    .then(questions => questions.map(convertToIQuestion));
};

/**
 * Static Method: Get all questions that have no answers.
 * 
 * @returns {Promise<IQuestion[]>} - A promise that resolves to an array of unanswered questions.
 */
QuestionSchema.statics.getUnansweredQuestions = async function (): Promise<IQuestion[]> {
  return this.find({ answers: { $size: 0 } })
    .sort({ ask_date_time: -1 })
    .populate("answers")
    .populate("tags")
    .populate("asked_by", "displayName")
    .lean()
    .then(questions => questions.map(convertToIQuestion));
};


/**
 * Static method: Get active questions (sorted by most recent activity)
 * 
 * @returns {Promise<IQuestion[]>} - A promise that resolves to an array of active questions.
 */
QuestionSchema.statics.getActiveQuestions = async function (): Promise<IQuestion[]> {
  const questions : IQuestionDocument[] = await this.find()
  .populate({
    path: "answers",
    populate: {
      path: "ans_by",
      select: "displayName"
    }
  }).populate('tags').populate("asked_by", "displayName").lean();
  
  const answeredQuestions: IQuestionDocument[] = [];
  const unansweredQuestions: IQuestionDocument[] = [];
  
  const answerDatesPromises = questions.map(async (q) => {
    const latestAnswerDate = await Answer.getLatestAnswerDate(q.answers);
    const categorizedQuestion = categorizeQuestion(q, latestAnswerDate);

    if (categorizedQuestion.category === 'answered') {
      answeredQuestions.push(categorizedQuestion);
    } else {
      unansweredQuestions.push(categorizedQuestion);
    }
  });

  await Promise.all(answerDatesPromises);
  const sortedQuestions = sortQuestions(answeredQuestions, unansweredQuestions);
  return sortedQuestions.map(convertToIQuestion);
};


/**
 * Static method: Find a question by ID and increment its views by 1
 * 
 * @param {string} qid - The ID of the question.
 * @returns {Promise<IQuestion | null>} - A promise that resolves to the updated question or null if not found.
 */
QuestionSchema.statics.findByIdAndIncrementViews = async function (qid: string): Promise<IQuestion | null> {
  const question = await this.findById(qid).populate("tags").populate("asked_by", "displayName");
  if (!question) return null;
  await question.incrementViews();
  const sortedAnswers = await Answer.getMostRecent(question.answers as mongoose.Types.ObjectId[]);
  const questionWithSortedAns: IQuestion = convertToIQuestion(question.toObject());
  questionWithSortedAns.answers = sortedAnswers.map((a) => convertToIAnswer(a.toObject()));
  return questionWithSortedAns;
};

/**
 * Static method: Create a new question
 * 
 * @param {IQuestion} question - The question data object.
 * @returns {Promise<IQuestion>} - A promise that resolves to the newly created question.
 */
QuestionSchema.statics.createQuestion = async function (
  question: IQuestion,
): Promise<IQuestion> {
  const tagNames = question.tags.map(t => t.name)
  const tags = await Tag.findOrCreateMany(tagNames);
  const tagIds = tags.map(tag => new mongoose.Types.ObjectId(tag._id));

  const newQuestion = await this.create({
    title: question.title,
    text: question.text,
    tags: tagIds,
    asked_by: question.asked_by,
    ask_date_time: new Date(question.ask_date_time),
    views: question.views,
    answers: question.answers
  });

  const populatedNewQuestion = await newQuestion.populate('tags');
  return convertToIQuestion(populatedNewQuestion);
};

/**
 * Categorizes a question as either 'answered' or 'unanswered' based on the latest answer date.
 * If no answer date is available, it considers the question's ask date as the most recent activity.
 * 
 * @param {IQuestionDocument} q - The question to categorize.
 * @param {Date | undefined} latestAnswerDate - The latest answer date, or undefined if there is no answer.
 * @returns {IQuestionDocument} - The question with a new `mostRecentActivity` and `category` properties.
 */
const categorizeQuestion = (q: IQuestionDocument, latestAnswerDate: Date | undefined) => {
  const mostRecentActivity = latestAnswerDate || q.ask_date_time;
  const category = latestAnswerDate ? 'answered' : 'unanswered';
  return { ...q, mostRecentActivity, category };
};

/**
 * Sorts two arrays of questions: one for answered questions and one for unanswered questions.
 * The answered questions are sorted by the most recent activity, and unanswered questions are sorted by the ask date.
 * 
 * @param {IQuestionDocument[]} answeredQuestions - The array of answered questions to be sorted.
 * @param {IQuestionDocument[]} unansweredQuestions - The array of unanswered questions to be sorted.
 * @returns {IQuestionDocument[]} - A single array with the sorted answered and unanswered questions.
 */
const sortQuestions = (answeredQuestions: IQuestionDocument[], unansweredQuestions: IQuestionDocument[]) => {
  answeredQuestions.sort((a, b) => b.mostRecentActivity.getTime() - a.mostRecentActivity.getTime());
  unansweredQuestions.sort((a, b) => b.ask_date_time.getTime() - a.ask_date_time.getTime());
  return [...answeredQuestions, ...unansweredQuestions];
};


/**
 * The Question model representing the Question collection in MongoDB.
 * This model provides static methods for querying and manipulating question documents in the database.
 * 
 * @type {mongoose.Model<IQuestionDocument, IQuestionModel>}
 */
const Question = mongoose.model<IQuestionDocument, IQuestionModel>("Question", QuestionSchema);

export default Question;
