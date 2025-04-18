import mongoose from "mongoose";
import {
    convertToIAnswer,
    convertToIQuestion,
    convertToIUser,
    convertToIUserProfile,
    convertToIComment
} from "../../utilities/formatUtils";
import { PostType } from "../../types/types";

describe("formatUtils", () => {
    it("should convert IAnswerDocument to IAnswer", () => {
        const mockAnswerDoc = {
            _id: new mongoose.Types.ObjectId(),
            text: "Sample answer",
            ans_by: { displayName: "user1" },
            ans_date_time: new Date("2024-01-01T00:00:00Z"),
            vote_score: 5
        } as any;

        const result = convertToIAnswer(mockAnswerDoc);
        expect(result).toEqual({
            _id: mockAnswerDoc._id.toString(),
            text: "Sample answer",
            ans_by: "user1",
            ans_date_time: mockAnswerDoc.ans_date_time.toISOString(),
            vote_score: 5
        });
    });

    it("should convert IQuestionDocument to IQuestion", () => {
        const mockQuestionDoc = {
            _id: new mongoose.Types.ObjectId(),
            title: "Sample question?",
            text: "How does this work?",
            asked_by: { displayName: "user1" },
            views: 10,
            ask_date_time: new Date("2024-01-02T00:00:00Z"),
            vote_score: 3,
            tags: [{ _id: new mongoose.Types.ObjectId(), name: "tag1" }],
            answers: [{
                _id: new mongoose.Types.ObjectId(),
                text: "Answer text",
                ans_by: { displayName: "user2" },
                ans_date_time: new Date("2024-01-03T00:00:00Z"),
                vote_score: 2
            }]
        } as any;

        const result = convertToIQuestion(mockQuestionDoc);

        expect(result._id).toBe(mockQuestionDoc._id.toString());
        expect(result.title).toBe("Sample question?");
        expect(result.tags[0]._id).toBe(mockQuestionDoc.tags[0]._id.toString());
        expect(result.answers[0]).toMatchObject({
            text: "Answer text",
            ans_by: "user2",
            vote_score: 2
        });
        expect(result.asked_by).toBe("user1");
    });

    it("should convert IUserProfileDocument to IUserProfile", () => {
        const mockUserId = new mongoose.Types.ObjectId();
        const mockProfile = {
            _id: new mongoose.Types.ObjectId(),
            user: {
                _id: mockUserId,
                email: "user@example.com",
                displayName: "Test User",
                password: "hashedpass"
            },
            fullName: "John Doe",
            location: "NY",
            title: "Developer",
            aboutMe: "About me...",
            website: "https://example.com",
            twitter: "@user",
            github: "userGH"
        } as any;

        const result = convertToIUserProfile(mockProfile);
        expect(typeof result.user).toBe("object");
        if (typeof result.user !== "string") {
            expect(result.user._id).toBe(mockUserId.toString());
        }
        expect(result.fullName).toBe("John Doe");
    });

    it("should convert IUserDocument to IUser", () => {
        const userDoc = {
            _id: new mongoose.Types.ObjectId(),
            email: "test@example.com",
            displayName: "testuser",
            password: "secure"
        } as any;

        const result = convertToIUser(userDoc);
        expect(result).toEqual({
            _id: userDoc._id.toString(),
            email: "test@example.com",
            displayName: "testuser",
            password: "secure"
        });
    });

    it("should convert ICommentDocument to IComment", () => {
        const commentDoc = {
            _id: new mongoose.Types.ObjectId(),
            text: "Comment here",
            postId: new mongoose.Types.ObjectId(),
            postType: PostType.Question,
            userId: new mongoose.Types.ObjectId(),
            isDeleted: false,
            createdAt: new Date("2024-04-01T00:00:00Z"),
            updatedAt: new Date("2024-04-02T00:00:00Z")
        } as any;

        const result = convertToIComment(commentDoc);
        expect(result._id).toBe(commentDoc._id.toString());
        expect(result.text).toBe("Comment here");
        expect(result.postType).toBe(PostType.Question);
        expect(result.createdAt).toEqual(commentDoc.createdAt);
        expect(result.updatedAt).toEqual(commentDoc.updatedAt);
    });

    it("should handle answers that are ObjectIds", () => {
        const mockObjectId = new mongoose.Types.ObjectId();

        const questionDoc = {
            _id: new mongoose.Types.ObjectId(),
            title: "Q?",
            text: "Body",
            asked_by: new mongoose.Types.ObjectId(),
            views: 1,
            ask_date_time: new Date(),
            vote_score: 0,
            tags: [],
            answers: [mockObjectId]
        } as any;

        const result = convertToIQuestion(questionDoc);
        expect(result.answers[0]).toBe(mockObjectId);
    });

    it("should convert profile with user as ObjectId", () => {
        const mockUserId = new mongoose.Types.ObjectId();

        const profile = {
            _id: new mongoose.Types.ObjectId(),
            user: mockUserId,
            fullName: "Anonymous",
        } as any;

        const result = convertToIUserProfile(profile);
        expect(result.user).toEqual({
            _id: mockUserId.toString(),
            email: "",
            displayName: "",
            password: ""
        });
    });

});
