import "../setup/mocks";
import mongoose from "mongoose";
import Vote from "../../models/votes";
import { VoteType, PostType } from "../../types/types";

const request = require("supertest");
const app = require("../../server");

// Mock middlewares
jest.mock("../../middlewares/auth/isAuthenticated", () => ({
    isAuthenticated: (_req: any, _res: any, next: any) => next()
}));

jest.mock("../../middlewares/auth/isAuthorized", () => ({
    isAuthorized: (_req: any, _res: any, next: any) => next()
}));

jest.mock("../../middlewares/rateLimiter", () => ({
    appRateLimiter: (_req: any, _res: any, next: any) => next()
}));

describe("Vote Routes", () => {
    const votePayload = {
        postId: new mongoose.Types.ObjectId().toString(),
        postType: PostType.Question,
        type: VoteType.UpVote,
        userId: new mongoose.Types.ObjectId().toString()
    };

    const badvotePayload = {
        postId: null,
        postType: PostType.Question,
        type: VoteType.UpVote,
        userId: new mongoose.Types.ObjectId().toString()
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should register a new vote successfully", async () => {
        Vote.registerVote = jest.fn().mockResolvedValue(null);

        const response = await request(app).post("/vote").send(votePayload);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Vote registered successfully" });
        expect(Vote.registerVote).toHaveBeenCalledWith({
            postId: expect.any(mongoose.Types.ObjectId),
            postType: PostType.Question,
            type: VoteType.UpVote,
            userId: votePayload.userId
        });
    });

    it("should return 403 if voting on own post", async () => {
        Vote.registerVote = jest.fn().mockRejectedValue(new Error("You cannot vote on your own post"));

        const response = await request(app).post("/vote").send(votePayload);
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({ message: "You cannot vote on your own post" });
    });

    it("should return 400 if invalid payload is sent", async () => {
        Vote.registerVote = jest.fn().mockResolvedValue(null);
        const response = await request(app).post("/vote").send(badvotePayload);
        expect(response.statusCode).toBe(400);
        //expect(response.body).toEqual({ message: "Invalid vote payload" });
    });
});
