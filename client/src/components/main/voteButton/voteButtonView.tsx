import {
    FaCircleUp,
    FaRegCircleUp,
    FaCircleDown,
    FaRegCircleDown,
} from "react-icons/fa6";
import "./voteButtonView.css";
import { useVote } from "../../../hooks/useVote";
import { PostType, VoteValueType } from "../../../types/entityTypes";

import type { FC, SVGProps } from "react";

// Typed icon components
const SolidUpIcon = FaCircleUp as FC<SVGProps<SVGSVGElement>>;
const RegularUpIcon = FaRegCircleUp as FC<SVGProps<SVGSVGElement>>;
const SolidDownIcon = FaCircleDown as FC<SVGProps<SVGSVGElement>>;
const RegularDownIcon = FaRegCircleDown as FC<SVGProps<SVGSVGElement>>;

interface VoteButtonProps {
    /** ID of the current user (optional if not logged in) */
    userId?: string;
    /** ID of the post being voted on */
    postId: string;
    /** Type of post being voted on ("Question" or "Answer") */
    postType: PostType;
    /** Initial vote value from the user (if any) */
    initialVote?: VoteValueType;
    /** Initial vote score for the post */
    voteScore: number;
}

/**
 * A voting button component for questions or answers.
 * Renders upvote/downvote buttons and displays the current vote score.
 *
 * @param userId - ID of the logged-in user
 * @param postId - ID of the post being voted on
 * @param postType - The type of the post (question or answer)
 * @param initialVote - The user's existing vote on the post, if any
 * @param voteScore - Initial vote count for the post
 */
const VoteButtons = ({
    userId,
    postId,
    postType,
    initialVote,
    voteScore,
}: VoteButtonProps) => {
    const {
        currentVote,
        voteScore: updatedScore,
        handleVote,
    } = useVote(postId, postType, userId, initialVote, voteScore);

    const isUpVoted = currentVote === VoteValueType.UpVote;
    const isDownVoted = currentVote === VoteValueType.DownVote;

    return (
        <div className="vote_section">
            <button
                className={`vote_button ${isUpVoted ? "active_vote" : ""}`}
                onClick={() =>
                    handleVote(
                        isUpVoted ? VoteValueType.NoVote : VoteValueType.UpVote
                    )
                }
                title="Upvote"
            >
                {isUpVoted ? <SolidUpIcon /> : <RegularUpIcon />}
            </button>
            <div className="vote_score">{updatedScore}</div>
            <button
                className={`vote_button ${isDownVoted ? "active_vote" : ""}`}
                onClick={() =>
                    handleVote(
                        isDownVoted ? VoteValueType.NoVote : VoteValueType.DownVote
                    )
                }
                title="Downvote"
            >
                {isDownVoted ? <SolidDownIcon /> : <RegularDownIcon />}
            </button>
        </div>
    );
};

export default VoteButtons;