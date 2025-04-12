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
    await checkIfVotingOwnPost(postId, postType, userId);
    const existingVote = await this.findOne({ userId, postId });
    let delta = 0;

    if (!existingVote) {
        delta = type;
    } else if (existingVote.type !== type) {
        delta = type - existingVote.type;
    } else {
        return null;
    }

    await this.findOneAndUpdate(
        { userId, postId },
        { type, postType },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await updateVoteScore(postId, postType, delta);
    return null;
};


async function checkIfVotingOwnPost(postId: mongoose.Types.ObjectId, postType: PostType, userId: mongoose.Types.ObjectId) {
    let postAuthorId: string | null = null;

    if (postType === PostType.Question) {
        const question = await Question.findById(postId).select("asked_by");
        if (!question) throw new Error("Question not found");
        if (question.asked_by) postAuthorId = question.asked_by?.toString();
    } else {
        const answer = await Answer.findById(postId).select("ans_by");
        if (!answer) throw new Error("Answer not found");
        postAuthorId = answer.ans_by?.toString();
    }

    if (postAuthorId === userId.toString()) {
        throw new Error("You cannot vote on your own post");
    }
}

async function updateVoteScore(postId: mongoose.Types.ObjectId, postType: PostType, delta: number) {
    const update = { $inc: { vote_score: delta } };

    if (postType === PostType.Question) {
        await Question.findByIdAndUpdate(postId, update);
    } else {
        await Answer.findByIdAndUpdate(postId, update);
    }
}

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
