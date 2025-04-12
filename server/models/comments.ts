import mongoose from "mongoose";
import CommentSchema from "./schema/comment";
import { IComment, ICommentDocument, ICommentModel, PostType } from "../types/types";
import { convertToIComment } from "../utilities/formatUtils";

/**
 * Static Method: addComment
 * Creates a new comment on a post (Question or Answer).
 */
CommentSchema.statics.addComment = async function (
    comment: IComment
  ): Promise<IComment> {
    const newComment = await this.create(comment);
    return convertToIComment(newComment);
  };
  
  /**
   * Static Method: editComment
   * Updates a comment's text if it exists and is not deleted.
   */
  CommentSchema.statics.editComment = async function (
    comment: IComment
  ): Promise<IComment | null> {
    const updated = await this.findOneAndUpdate(
      { _id: comment._id, userId: comment.userId, isDeleted: false },
      { text: comment.text },
      { new: true }
    );
    return updated ? convertToIComment(updated) : null;
  };
  
  /**
   * Static Method: deleteComment
   * Soft deletes a comment by marking it as deleted and optionally redacting the text.
   */
  CommentSchema.statics.deleteComment = async function (
    commentId:  string,
    userId: string
  ): Promise<IComment | null> {
  
    const deleted = await this.findOneAndUpdate(
      { _id: commentId, userId: userId },
      { isDeleted: true},
      { new: true }
    );
  
    return deleted ? convertToIComment(deleted) : null;
  };
  
  /**
   * Static Method: getCommentsForPost
   * Fetches all non-deleted comments for a given post.
   */
  CommentSchema.statics.getCommentsForPost = async function (
    postId: mongoose.Types.ObjectId,
    postType: PostType
  ): Promise<IComment[]> {
    const comments = await this.find({ postId, postType, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate("userId", "displayName");
  
    return comments.map(comment => convertToIComment(comment));
  };
  
  /**
   * The Comment model representing the Comment collection in MongoDB.
   * Includes methods for adding, editing, deleting, and fetching comments.
   *
   * @type {mongoose.Model<ICommentDocument, ICommentModel>}
   */
  const Comment = mongoose.model<ICommentDocument, ICommentModel>("Comment", CommentSchema);
  export default Comment;