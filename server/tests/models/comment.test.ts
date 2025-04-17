import mongoose from "mongoose";
import Comment from "../../models/comments";
import { PostType } from "../../types/types";
import { convertToIComment } from "../../utilities/formatUtils";

jest.mock("../../utilities/formatUtils");

describe("Comment Model - Static Methods", () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const mockPostId = new mongoose.Types.ObjectId();

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("addComment", () => {
        it("should create and return a new comment", async () => {
            const mockComment = {
                text: "This is a test comment",
                postId: mockPostId,
                postType: PostType.Question,
                userId: mockUserId
            };

            const createdDoc = {
                _id: new mongoose.Types.ObjectId(),
                ...mockComment,
                toObject: () => mockComment,
                __v: 0
            };

            jest.spyOn(Comment, "create").mockResolvedValue(createdDoc as any);
            (convertToIComment as jest.Mock).mockReturnValue(mockComment);

            const result = await Comment.addComment(mockComment as any);
            expect(Comment.create).toHaveBeenCalledWith(mockComment);
            expect(convertToIComment).toHaveBeenCalledWith(createdDoc);
            expect(result).toEqual(mockComment);
        });
    });

    describe("editComment", () => {
        it("should update comment text if not deleted", async () => {
            const comment = {
                _id: new mongoose.Types.ObjectId(),
                userId: mockUserId,
                text: "Updated comment"
            };

            const updatedDoc = {
                ...comment,
                isDeleted: false,
                toObject: () => comment,
                __v: 0
            };

            jest.spyOn(Comment, "findOneAndUpdate").mockResolvedValue(updatedDoc as any);
            (convertToIComment as jest.Mock).mockReturnValue(updatedDoc);

            const result = await Comment.editComment(comment as any);
            expect(Comment.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: comment._id, userId: comment.userId, isDeleted: false },
                { text: comment.text },
                { new: true }
            );
            expect(result).toEqual(updatedDoc);
        });

        it("should return null if comment is not found", async () => {
            jest.spyOn(Comment, "findOneAndUpdate").mockResolvedValue(null);

            const result = await Comment.editComment({
                _id: new mongoose.Types.ObjectId(),
                userId: mockUserId,
                text: "Doesn't matter"
            } as any);

            expect(result).toBeNull();
        });
    });

    describe("deleteComment", () => {
        it("should mark comment as deleted", async () => {
            const commentId = new mongoose.Types.ObjectId().toHexString();

            const deletedDoc = {
                _id: commentId,
                userId: mockUserId,
                isDeleted: true,
                text: "Deleted comment",
                toObject: () => this,
                __v: 0
            };

            jest.spyOn(Comment, "findOneAndUpdate").mockResolvedValue(deletedDoc as any);
            (convertToIComment as jest.Mock).mockReturnValue(deletedDoc);

            const result = await Comment.deleteComment(commentId, mockUserId.toHexString());
            expect(Comment.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: commentId, userId: mockUserId.toHexString() },
                { isDeleted: true },
                { new: true }
            );
            expect(result).toEqual(deletedDoc);
        });

        it("should return null if comment is not found", async () => {
            jest.spyOn(Comment, "findOneAndUpdate").mockResolvedValue(null);

            const result = await Comment.deleteComment("nonexistentId", mockUserId.toHexString());
            expect(result).toBeNull();
        });
    });

    describe("getCommentsForPost", () => {
        it("should return all non-deleted comments for a post", async () => {
            const postId = new mongoose.Types.ObjectId();
            const mockDocs = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    text: "Nice",
                    postId,
                    postType: PostType.Question,
                    userId: mockUserId,
                    isDeleted: false,
                    toObject: () => this
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    text: "Helpful",
                    postId,
                    postType: PostType.Question,
                    userId: mockUserId,
                    isDeleted: false,
                    toObject: () => this
                }
            ];

            jest.spyOn(Comment, "find").mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockDocs)
                })
            } as any);

            (convertToIComment as jest.Mock).mockImplementation((doc) => doc);

            const result = await Comment.getCommentsForPost(postId, PostType.Question);
            expect(Comment.find).toHaveBeenCalledWith({
                postId,
                postType: PostType.Question,
                isDeleted: false
            });
            expect(result).toHaveLength(2);
            expect(result[0].text).toBe("Nice");
        });
    });
});
