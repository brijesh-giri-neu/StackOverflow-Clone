import mongoose from "mongoose";
import { ICommentDocument, ICommentModel, PostType } from "../../types/types";

/**
 * The schema for a document in the Comment collection.
 * 
 * A comment belongs to a user and targets either a Question or an Answer.
 *
 * @type {mongoose.Schema<ICommentDocument, ICommentModel>}
 */
const CommentSchema = new mongoose.Schema<ICommentDocument, ICommentModel>(
  {
    text: { type: String, required: true, minlength: 1, maxlength: 1000 },
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
