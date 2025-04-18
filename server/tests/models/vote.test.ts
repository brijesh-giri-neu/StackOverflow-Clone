import mongoose from "mongoose";
import Vote from "../../models/votes";
import Question from "../../models/questions";
import Answer from "../../models/answers";
import { PostType, VoteType } from "../../types/types";

jest.mock("../../models/questions");
jest.mock("../../models/answers");

describe("Vote Model - registerVote", () => {
    const userId = new mongoose.Types.ObjectId();
    const postId = new mongoose.Types.ObjectId();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new vote and update vote score", async () => {
        (Question.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockResolvedValue({ asked_by: new mongoose.Types.ObjectId() })
        });

        jest.spyOn(Vote, "findOne").mockResolvedValue(null);
        jest.spyOn(Vote, "findOneAndUpdate").mockResolvedValue({});
        (Question.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

        const vote = {
            userId,
            postId,
            type: VoteType.UpVote,
            postType: PostType.Question
        };

        const result = await Vote.registerVote(vote);

        expect(Vote.findOneAndUpdate).toHaveBeenCalledWith(
            { userId, postId },
            { type: VoteType.UpVote, postType: PostType.Question },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        expect(Question.findByIdAndUpdate).toHaveBeenCalledWith(postId, { $inc: { vote_score: 1 } });
        expect(result).toBeNull();
    });

    it("should update an existing vote and adjust vote score", async () => {
        (Answer.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockResolvedValue({ ans_by: new mongoose.Types.ObjectId() })
        });

        jest.spyOn(Vote, "findOne").mockResolvedValue({ type: VoteType.DownVote });
        jest.spyOn(Vote, "findOneAndUpdate").mockResolvedValue({});
        (Answer.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

        const vote = {
            userId,
            postId,
            type: VoteType.UpVote,
            postType: PostType.Answer
        };

        const result = await Vote.registerVote(vote);

        expect(Answer.findByIdAndUpdate).toHaveBeenCalledWith(postId, { $inc: { vote_score: 2 } });
        expect(result).toBeNull();
    });

    it("should do nothing if vote type is the same", async () => {
        (Answer.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockResolvedValue({ ans_by: new mongoose.Types.ObjectId() })
        });

        jest.spyOn(Vote, "findOne").mockResolvedValue({ type: VoteType.DownVote });

        const vote = {
            userId,
            postId,
            type: VoteType.DownVote,
            postType: PostType.Answer
        };

        const result = await Vote.registerVote(vote);

        expect(result).toBeNull();
        expect(Vote.findOneAndUpdate).not.toHaveBeenCalled();
        expect(Answer.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("should throw error if voting on own question", async () => {
        (Question.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockResolvedValue({ asked_by: userId })
        });

        const vote = {
            userId,
            postId,
            type: VoteType.UpVote,
            postType: PostType.Question
        };

        await expect(Vote.registerVote(vote)).rejects.toThrow("You cannot vote on your own post");
    });

    it("should throw error if voting on own answer", async () => {
        (Answer.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockResolvedValue({ ans_by: userId })
        });

        const vote = {
            userId,
            postId,
            type: VoteType.DownVote,
            postType: PostType.Answer
        };

        await expect(Vote.registerVote(vote)).rejects.toThrow("You cannot vote on your own post");
    });

    it("should throw error if post question is not found", async () => {
        (Question.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockResolvedValue(null)
        });

        const vote = {
            userId,
            postId,
            type: VoteType.UpVote,
            postType: PostType.Question
        };

        await expect(Vote.registerVote(vote)).rejects.toThrow("Question not found");
    });

    it("should throw error if post answer is not found", async () => {
        (Answer.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockResolvedValue(null)
        });

        const vote = {
            userId,
            postId,
            type: VoteType.UpVote,
            postType: PostType.Answer
        };

        await expect(Vote.registerVote(vote)).rejects.toThrow("Answer not found");
    });
});
