import { useState } from "react";
import { registerOrUpdateVote } from "../services/voteService";
import { PostType, VoteValueType } from "../types/entityTypes";
import { toast } from 'react-toastify';

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
