import { registerOrUpdateVote } from "../services/voteService";
import { PostType, VoteValueType } from "../types/entityTypes";

export const useVote = (
    postId: string,
    postType: PostType,
    userId?: string
) => {
    const handleUpvote = async () => {
        if(userId){
            registerOrUpdateVote({postId: postId, postType: postType, type: VoteValueType.UpVote, userId: userId})
        }
        else{
            console.log("User Id not available");
        }
    };

    const handleDownvote = async () => {
        if(userId){
            registerOrUpdateVote({postId: postId, postType: postType, type: VoteValueType.DownVote, userId: userId})
        } 
        else{
            console.log("User Id not available");
        }
    };

    return { handleUpvote, handleDownvote };
};
