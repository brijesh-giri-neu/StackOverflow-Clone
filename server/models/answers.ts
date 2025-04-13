import mongoose from "mongoose";
import { IAnswerModel, IAnswerDocument, IAnswer } from "../types/types";
import AnswerSchema from "./schema/answer";
import { IAnswerDB } from "../scripts/script_types";

/**
 * Static Method: Get the most recent answer from a list of answer IDs.
 *
 * @param {mongoose.Types.ObjectId[]} answers - An array of answer IDs.
 * @returns {Promise<IAnswerDocument[]>} - A promise that resolves to an array of answer documents sorted by most recent date.
 */
AnswerSchema.statics.getMostRecent = async function (
  answers: mongoose.Types.ObjectId[]
): Promise<IAnswerDocument[]> {
  return this.find({ _id: { $in: answers } }).sort({ ans_date_time: -1 }).populate("ans_by", "displayName");
};

/**
 * Static Method: Get the latest answer date for a list of answer documents.
 * 
 * @param {Array<IAnswerDB>} answers - An array of answer documents.
 * @returns {Promise<Date | undefined>} - A promise that resolves to the latest answer date or undefined if no answers exist.
 */
AnswerSchema.statics.getLatestAnswerDate = async function (
  answers: Array<IAnswerDB>
): Promise<Date | undefined> {
  if (!answers.length) return undefined;

  return new Date(
    Math.max(
      ...answers.map((a) => a.ans_date_time.getTime())
    )
  );
};

/**
 * Static Method: Create a new answer document.
 * 
 * @param {IAnswer} answer - The answer data object.
 * @returns {Promise<IAnswerDocument>} - A promise that resolves to the newly created answer document.
 */
AnswerSchema.statics.createAnswer = async function (
  answer: IAnswer
): Promise<IAnswerDocument> {
  const newAnswer = await this.create({
    text: answer.text,
    ans_by: answer.ans_by,
    ans_date_time: new Date(answer.ans_date_time)
  });
  return newAnswer;
}

/**
 * The Answer model representing the Answer collection in MongoDB.
 * This model provides static methods for querying and manipulating answer documents in the database.
 * 
 * @type {mongoose.Model<IAnswerDocument, IAnswerModel>}
 */
const Answer = mongoose.model<IAnswerDocument, IAnswerModel>("Answer", AnswerSchema);

export default Answer;
