import mongoose from "mongoose";
import VoteSchema from "./schema/vote";
import { IVote, IVoteDocument, IVoteModel, PostType } from "../types/types";
import Question from "./questions";
import Answer from "./answers";


VoteSchema.statics.registerVote = async function (vote: IVote): Promise<null> {
    const { userId, postId, type, postType } = vote;

    // Step 1: Find existing vote
    const existingVote = await this.findOne({ userId, postId });

    // Step 2: Determine the vote delta (score change)
    let delta = 0;
    if (!existingVote) {
        delta = type; // No existing vote → apply new vote directly
    } else if (existingVote.type !== type) {
        delta = type - existingVote.type; // Changing vote direction (e.g., upvote → downvote)
    } else {
        // Same vote already exists → no change
        return null;
    }

    // Step 3: Upsert the vote
    await this.findOneAndUpdate(
        { userId, postId },
        { type, postType },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Step 4: Update vote_score in the related post
    const update = { $inc: { vote_score: delta } };

    if (postType === PostType.Question) {
        await Question.findByIdAndUpdate(postId, update);
    } else if (postType === PostType.Answer) {
        await Answer.findByIdAndUpdate(postId, update);
    }

    return null;
};

/**
 * The User model representing the Users collection in MongoDB.
 * 
 * @type {mongoose.Model<IVoteDocument, IVoteModel>}
 */
const Vote = mongoose.model<IVoteDocument, IVoteModel>("Vote", VoteSchema);
export default Vote;
