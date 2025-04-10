import {
    FaCircleUp,
    FaRegCircleUp,
    FaCircleDown,
    FaRegCircleDown,
} from "react-icons/fa6";
import "./voteButtonView.css";

import type { FC, SVGProps } from "react";

// Typed icon components
const SolidUpIcon = FaCircleUp as FC<SVGProps<SVGSVGElement>>;
const RegularUpIcon = FaRegCircleUp as FC<SVGProps<SVGSVGElement>>;
const SolidDownIcon = FaCircleDown as FC<SVGProps<SVGSVGElement>>;
const RegularDownIcon = FaRegCircleDown as FC<SVGProps<SVGSVGElement>>;

interface VoteButtonsProps {
    score: number;
    onUpvote?: () => void;
    onDownvote?: () => void;
    isUpVoted: boolean;
    isDownVoted: boolean;
}

const VoteButtons = ({
    score,
    onUpvote,
    onDownvote,
    isUpVoted,
    isDownVoted,
}: VoteButtonsProps) => {
    return (
        <div className="vote_section">
            <button
                className={`vote_button ${isUpVoted ? "active_vote" : ""}`}
                onClick={onUpvote}
            >
                {isUpVoted ? <SolidUpIcon /> : <RegularUpIcon />}
            </button>

            <div className="vote_score">{score}</div>

            <button
                className={`vote_button ${isDownVoted ? "active_vote" : ""}`}
                onClick={onDownvote}
            >
                {isDownVoted ? <SolidDownIcon /> : <RegularDownIcon />}
            </button>
        </div>
    );
};

export default VoteButtons;
