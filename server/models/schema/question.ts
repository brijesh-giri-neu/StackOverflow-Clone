import mongoose from "mongoose";
import { IQuestionDocument, IQuestionModel } from "../../types/types";

/**
 * The schema for a document in the Question collection.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IQuestionDocument and IQuestionModel.
 * IQQuestionDocument is used to define the instance methods of the Question document.
 * IQuestionModel is used to define the static methods of the Question model.
 * 
 * @type {mongoose.Schema<IQuestionDocument, IQuestionModel>}
 *
 * @property {string} title - The title of the question (Required).
 * @property {string} text - The body of the question (Required).
 * @property {string} asked_by - The username of the person who asked the question (Required).
 * @property {Date} ask_date_time - The timestamp when the question was asked (Required).
 * @property {number} views - The number of times the question has been viewed (Defaults to 0).
 * @property {mongoose.Types.ObjectId[]} answers - An array of references to Answer documents.
 * @property {mongoose.Types.ObjectId[]} tags - An array of references to Tag documents.
 */
const QuestionSchema = new mongoose.Schema<IQuestionDocument, IQuestionModel>(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    asked_by: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    ask_date_time: { type: Date, required: true },
    views: { type: Number, default: 0 },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    vote_score: { type: Number, default: 0 },
  },
  { collection: "Question" }
);

/**
 * Instance Method: Increment the view count for a question.
 * 
 * @returns {Promise<IQuestionDocument>} - Returns the updated question document.
 */
QuestionSchema.methods.incrementViews = async function (this: IQuestionDocument): Promise<IQuestionDocument> {
  this.views += 1;
  await this.save();
  return this;
};

/**
 * Instance Method: Add an answer to a question.
 * 
 * @param {mongoose.Types.ObjectId} answerId - The ID of the answer to be added.
 * @returns {Promise<IQuestionDocument>} - Returns the updated question document.
 */
QuestionSchema.methods.addAnswer = async function (this: IQuestionDocument, answerId: mongoose.Types.ObjectId): Promise<IQuestionDocument> {
  this.answers.unshift(answerId);
  await this.save();
  return this;
};

/**
 * Virtual Property: Checks if a question has answers.
 *
 * @returns {boolean} - Returns `true` if the question has answers, otherwise `false`.
 */
QuestionSchema.virtual("hasAnswers").get(function (this: IQuestionDocument) {
  return this.answers.length > 0;
});

/**
 * Virtual Property: Gets the most recent activity on the question.
 * The most recent activity is either the ask date time (if there are no answers)
 * or the latest answer date.
 *
 * @returns {Date} - The timestamp of the most recent activity on the question.
 */
QuestionSchema.virtual("mostRecentActivity").get(function (this: IQuestionDocument) {
  if (!this.hasAnswers) {
    return this.ask_date_time;
  }
  const timestamps = [
    this.ask_date_time.getTime(),
    ...this.answers
      .filter(answer => "ans_date_time" in answer)
      .map(answer => new Date(answer.ans_date_time).getTime())
  ];
  return new Date(Math.max(...timestamps));
});

/**
 * Correctly export the schema.
 */
export default QuestionSchema;
