import { useState } from "react";
import { registerOrUpdateVote } from "../services/voteService";
import { PostType, VoteValueType } from "../types/entityTypes";
import { toast } from 'react-toastify';

/**
 * A custom React hook for managing voting functionality on a post (question or answer).
 *
 * @param {string} postId - The ID of the post being voted on.
 * @param {PostType} postType - The type of the post (Question or Answer).
 * @param {string} [userId] - The ID of the user casting the vote (optional).
 * @param {VoteValueType} [initialVote=VoteValueType.NoVote] - The user's initial vote on the post.
 * @param {number} [initialScore=0] - The initial vote score of the post.
 * @returns {{
 *   currentVote: VoteValueType,
 *   voteScore: number,
 *   handleVote: (newVote: VoteValueType) => Promise<void>
 * }} The current vote state, updated score, and a handler to register a vote.
 */
export const useVote = (
    postId: string,
    postType: PostType,
    userId?: string,
    initialVote: VoteValueType = VoteValueType.NoVote,
    initialScore: number = 0
) => {
    const [currentVote, setCurrentVote] = useState<VoteValueType>(initialVote);
    const [voteScore, setVoteScore] = useState<number>(initialScore);

    /**
     * Handles vote interaction: upvote, downvote, undo, or switch vote.
     * Updates local state and communicates with the server.
     *
     * @param {VoteValueType} newVote - The new vote to apply.
     */
    const handleVote = async (newVote: VoteValueType) => {
        if (!userId) {
            toast.warn("You must login to vote");
            return;
        }

        try {
            await registerOrUpdateVote({
                postId,
                postType,
                type: newVote,
                userId,
            });

            const delta = newVote - currentVote;
            setVoteScore((prev) => prev + delta);
            setCurrentVote(newVote);
        } catch (err: any) {
            const status = err?.response?.status;
            const message =
                status === 429
                    ? "You are voting too quickly. Please wait for sometime before voting again."
                    : err?.response?.data?.message || "Something went wrong while voting";

            toast.error(message);
        }
    };

    return { currentVote, voteScore, handleVote };
};
