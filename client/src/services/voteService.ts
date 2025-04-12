import { REACT_APP_API_URL, api } from "./config";
import { VoteType, VoteResponseType} from "../types/entityTypes";

const VOTE_API_URL = `${REACT_APP_API_URL}/vote`;

/**
 * Registers or updates a vote on a post (question or answer).
 * 
 * @param vote - The vote object containing postId, postType, and type (+1 or -1)
 * @returns A promise that resolves to the vote response message.
 */
const registerOrUpdateVote = async (
    vote: VoteType
): Promise<VoteResponseType> => {
    try {
        const res = await api.post(VOTE_API_URL, vote);
        if (res.status !== 200) {
            throw new Error("Failed to register or update vote");
        }
        return res.data;
    } catch (error) {
        console.error("Error submitting vote:", error);
        throw error;
    }
};

export { registerOrUpdateVote };
