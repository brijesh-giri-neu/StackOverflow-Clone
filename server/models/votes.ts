import mongoose from "mongoose";
import VoteSchema from "./schema/vote";
import { IVote, IVoteDocument, IVoteModel, PostType } from "../types/types";
import Question from "./questions";
import Answer from "./answers";

/**
 * Static Method: registerVote
 * 
 * Handles the registration or updating of a vote made by a user on a post (either a Question or an Answer).
 * 
 * @param {IVote} vote - The vote object containing userId, postId, postType, and vote type (up/down).
 * @returns {Promise<null>} Returns null after updating the vote and vote_score.
 */
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
 * The Vote model representing the Vote collection in MongoDB.
 * 
 * This model provides static methods for voting logic, including registering and updating
 * user votes on posts (Questions or Answers), and maintaining vote_score on the post itself.
 * 
 * @type {mongoose.Model<IVoteDocument, IVoteModel>}
 */
const Vote = mongoose.model<IVoteDocument, IVoteModel>("Vote", VoteSchema);
export default Vote;
