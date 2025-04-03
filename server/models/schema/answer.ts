import mongoose from "mongoose";
import { IAnswerDocument, IAnswerModel } from "../../types/types";

/**
 * The schema for a document in the Answer collection.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IAnswerDocument and IAnswerModel.
 * IAnswerDocument is used to define the instance methods of the Answer document.
 * IAnswerModel is used to define the static methods of the Answer model.
 *
 * @type {mongoose.Schema<IAnswerDocument, IAnswerModel>}
 * 
 * @property {string} text - The content of the answer (Required).
 * @property {string} ans_by - The user who provided the answer (Required).
 * @property {Date} ans_date_time - The timestamp when the answer was created (Defaults to `Date.now`).
 */
const AnswerSchema = new mongoose.Schema<IAnswerDocument, IAnswerModel> (
  {
    text: { type: String, required: true },
    ans_by: { type: String, required: true },
    ans_date_time: { type: Date, required: true, default: Date.now }
  },
  { collection: "Answer" }
);

export default AnswerSchema;
