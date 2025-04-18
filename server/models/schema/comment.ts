import mongoose from "mongoose";
import { ICommentDocument, ICommentModel, PostType } from "../../types/types";

/**
 * The schema for a document in the Comment collection.
 * 
 * A comment belongs to a user and targets either a Question or an Answer.
 *
 * @type {mongoose.Schema<ICommentDocument, ICommentModel>}
 * 
 * @property {string} text - The content of the comment (Required, 1–600 characters).
 * @property {PostType} postType - The type of the post the comment is attached to ("Question" or "Answer").
 * @property {mongoose.Types.ObjectId} postId - Reference to the specific Question or Answer document (based on `postType`).
 * @property {mongoose.Types.ObjectId} userId - Reference to the user who created the comment.
 * @property {boolean} isDeleted - Flag indicating if the comment was soft-deleted (Defaults to false).
 */
const CommentSchema = new mongoose.Schema<ICommentDocument, ICommentModel>(
  {
    text: { type: String, required: true, minlength: 1, maxlength: 600 },
    postType: { type: String, enum: Object.values(PostType), required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "postType" },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    isDeleted: { type: Boolean, default: false }
  },
  {
    collection: "Comment",
    timestamps: true
  }
);

export default CommentSchema;
