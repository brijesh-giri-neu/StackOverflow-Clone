import { useState } from "react";
import { registerOrUpdateVote } from "../services/voteService";
import { PostType, VoteValueType } from "../types/entityTypes";

export const useVote = (
    postId: string,
    postType: PostType,
    userId?: string,
    initialVote: VoteValueType = VoteValueType.NoVote,
    initialScore: number = 0
) => {
    const [currentVote, setCurrentVote] = useState<VoteValueType>(initialVote);
    const [voteScore, setVoteScore] = useState<number>(initialScore);

    const handleVote = async (newVote: VoteValueType) => {
        if (!userId) {
            console.warn("User Id not available");
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
        } catch (err) {
            console.error("Vote failed:", err);
        }
    };
    return { currentVote, voteScore, handleVote };
};
