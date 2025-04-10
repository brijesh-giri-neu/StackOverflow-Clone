import mongoose from "mongoose";
import { IVoteDocument, IVoteModel, PostType, VoteType } from "../../types/types";

const postTypeValues = Object.keys(PostType)
  .filter(key => isNaN(Number(key))) as (keyof typeof PostType)[];

const VoteSchema = new mongoose.Schema<IVoteDocument, IVoteModel>(
  {
    type: { type: Number, enum: VoteType, required: true },
    postType: { type: String, enum: postTypeValues, required: true},
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'postType' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
  },
  { collection: "Vote" }
);

export default VoteSchema;
