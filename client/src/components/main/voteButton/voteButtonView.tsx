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
    userId?: string;
    postId: string;
    postType: PostType;
    initialVote?: VoteValueType;
    voteScore: number;
}

const VoteButtons = ({
    userId,
    postId,
    postType,
    initialVote,
    voteScore,
}: VoteButtonProps) => {
    const { handleUpvote, handleDownvote } = useVote(
        postId,
        postType,
        userId,
    );

    const isUpVoted = initialVote? initialVote === 1 : false;
    const isDownVoted = initialVote? initialVote === -1 : false;

    return (
        <div className="vote_section">
            <button
                className={`vote_button ${isUpVoted ? "active_vote" : ""}`}
                onClick={handleUpvote}
                title="Upvote"
            >
                {isUpVoted ? <SolidUpIcon /> : <RegularUpIcon />}
            </button>

            <div className="vote_score">{voteScore}</div>

            <button
                className={`vote_button ${isDownVoted ? "active_vote" : ""}`}
                onClick={handleDownvote}
                title="Downvote"
            >
                {isDownVoted ? <SolidDownIcon /> : <RegularDownIcon />}
            </button>
        </div>
    );
};

export default VoteButtons;