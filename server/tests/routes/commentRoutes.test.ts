import "../setup/mocks";
import mongoose from "mongoose";

const request = require("supertest");
const app = require("../../server");
import Comment from "../../models/comments";
import { PostType } from "../../types/types";


jest.mock("../../middlewares/auth/isAuthenticated", () => ({
    isAuthenticated: (req: any, _res: any, next: any) => {
        req.session = {
            userId: "67fb790b042090ddf9c2be1b",
            touch: () => { },
            save: (cb: any) => cb(),
            cookie: {
                secure: false,
            },
        };
        next();
    },
}));


jest.mock("../../middlewares/auth/isAuthorized", () => ({
    isAuthorized: (_req: any, _res: any, next: any) => next()
}));

describe("Comment Routes", () => {
    const userId = "67fb790b042090ddf9c2be1b";
    const postId = "67fb7953042090ddf9c2be23";
    const commentId = new mongoose.Types.ObjectId().toString();

    const commentResponse = {
        _id: commentId,
        text: "this is new comment",
        postId,
        postType: PostType.Question,
        userId,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should add a new comment", async () => {
        Comment.addComment = jest.fn().mockResolvedValue(commentResponse);

        const response = await request(app).post("/comment/add").send({
            postId,
            postType: PostType.Question,
            text: "this is new comment",
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(commentResponse);
    });

    it("should edit an existing comment", async () => {
        const editedComment = { ...commentResponse, text: "edited comment" };
        Comment.editComment = jest.fn().mockResolvedValue(editedComment);

        const response = await request(app).post("/comment/edit").send({
            _id: commentId,
            postId,
            postType: PostType.Question,
            text: "edited comment",
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.text).toBe("edited comment");
    });

    it("should delete a comment", async () => {
        const deletedComment = { ...commentResponse, isDeleted: true };
        Comment.deleteComment = jest.fn().mockResolvedValue(deletedComment);

        const response = await request(app).post(`/comment/delete/${commentId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.isDeleted).toBe(true);
    });

    it("should fetch all comments for a post", async () => {
        const comments = [commentResponse];
        Comment.getCommentsForPost = jest.fn().mockResolvedValue(comments);

        const response = await request(app).get(`/comment/Question/${postId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(comments);
    });

    it("should return 400 if add comment payload is invalid", async () => {
        const response = await request(app).post("/comment/add").send({
            postId,
            text: "Missing postType",
        }) .send({});
        expect(response.statusCode).toBe(400);
        //expect(response.body).toHaveProperty("message", "Invalid comment payload");
    });
});
