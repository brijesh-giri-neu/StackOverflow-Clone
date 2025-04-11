import mongoose from "mongoose";
import { IVoteDocument, IVoteModel, PostType, VoteType } from "../../types/types";

  /**
 * The schema for a document in the Vote collection.
 *
 * @type {mongoose.Schema<IVoteDocument, IVoteModel>}
 * 
 * @property {VoteType} type - The type of the vote (1 for upvote, -1 for downvote).
 * @property {PostType} postType - The type of the post being voted on ("Question" or "Answer").
 * @property {mongoose.Types.ObjectId} postId - The ID of the post being voted on. Uses `refPath` to dynamically reference either a Question or an Answer.
 * @property {mongoose.Types.ObjectId} userId - The ID of the user who cast the vote.
 */
const VoteSchema = new mongoose.Schema<IVoteDocument, IVoteModel>(
  {
    type: { type: Number, enum: VoteType, required: true },
    postType: { type: String, enum: Object.values(PostType), required: true},
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'postType' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
  },
  { collection: "Vote" }
);

/**
 * Ensure a user can vote only once per post.
 */
VoteSchema.index({ userId: 1, postId: 1 }, { unique: true });


export default VoteSchema;
