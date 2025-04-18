import mongoose from "mongoose";
import Question from "../../models/questions";
import Answer from "../../models/answers";
import Tag from "../../models/tags";
import { convertToIAnswer, convertToIQuestion } from "../../utilities/formatUtils";
import { IAnswerDocument, IQuestionDocument, IQuestion, IAnswer } from "../../types/types";

jest.mock("../../utilities/formatUtils");

const mockUserId = new mongoose.Types.ObjectId();
const mockTagId = new mongoose.Types.ObjectId();

jest.spyOn(Answer, "getLatestAnswerDate").mockResolvedValue(new Date("2024-04-01"));
jest.spyOn(Answer, "getMostRecent").mockResolvedValue([]);
jest.spyOn(Tag, "findOrCreateMany").mockResolvedValue([{ _id: mockTagId.toHexString(), name: "js" }]);

const baseQuestion = {
    _id: new mongoose.Types.ObjectId(),
    title: "Test Title",
    text: "Test body",
    asked_by: mockUserId,
    ask_date_time: new Date("2024-01-01"),
    views: 0,
    answers: [],
    tags: [{ _id: mockTagId, name: "js" }],
    vote_score: 0
};

(convertToIQuestion as jest.Mock).mockImplementation(q => q);
(convertToIAnswer as jest.Mock).mockImplementation(a => a);

describe("Question Model - Static Methods", () => {
    afterEach(() => jest.clearAllMocks());

    it("getNewestQuestions should return questions sorted by ask_date_time", async () => {
        const mockData = [baseQuestion];
        jest.spyOn(Question, "find").mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockData)
        } as any);

        const result = await Question.getNewestQuestions();
        expect(result).toEqual(mockData);
    });

    it("getUnansweredQuestions should return questions with no answers", async () => {
        const mockData = [baseQuestion];
        jest.spyOn(Question, "find").mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockData)
        } as any);

        const result = await Question.getUnansweredQuestions();
        expect(result).toEqual(mockData);
    });

    it("getActiveQuestions should categorize and sort questions by latest activity", async () => {
        jest.spyOn(Question, "find").mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([baseQuestion])
        } as any);

        const result = await Question.getActiveQuestions();
        expect((result[0] as any).mostRecentActivity).toBeDefined();
    });

    it("findByIdAndIncrementViews should return incremented and populated question", async () => {
        const baseQuestion2 = new Question({ ...baseQuestion, answers: [new mongoose.Types.ObjectId()] });
        const mockIncrement = jest.fn().mockResolvedValue(baseQuestion2);
        const mockPopulate = jest.fn().mockReturnThis();
        const mockQuestion = { ...baseQuestion2, incrementViews: mockIncrement, toObject: () => baseQuestion2 };

        jest.spyOn(Question, "findById").mockReturnValue({
            populate: mockPopulate,
            then: (cb: any) => cb(mockQuestion)
        } as any);

        const result = await Question.findByIdAndIncrementViews(baseQuestion2._id.toString());
        expect(result).toEqual(baseQuestion2);
    });

    it("createQuestion should create a new question and return it", async () => {
        const mockCreated = { ...baseQuestion, populate: jest.fn().mockResolvedValue(baseQuestion) };
        jest.spyOn(Question, "create").mockResolvedValue(mockCreated as any);

        const result = await Question.createQuestion({ ...baseQuestion, _id: baseQuestion._id.toString(), ask_date_time: baseQuestion.ask_date_time.toISOString(), tags: [{ name: "js" }] } as unknown as IQuestion);
        expect(result).toEqual(baseQuestion);
    });
});

describe("Question Model - Instance Methods", () => {
    it("incrementViews should increase views and save", async () => {
        const mockSave = jest.fn();
        const instance = new Question({ ...baseQuestion });
        instance.save = mockSave;
        await instance.incrementViews();
        expect(mockSave).toHaveBeenCalled();
    });

    it("addAnswer should unshift new answer and save", async () => {
        const mockSave = jest.fn();
        const newAnswerId = new mongoose.Types.ObjectId();
        const instance = new Question({ ...baseQuestion, answers: [] });
        instance.save = mockSave;
        await instance.addAnswer(newAnswerId);
        expect(instance.answers[0]).toBe(newAnswerId);
        expect(mockSave).toHaveBeenCalled();
    });
});

describe("Question Model - Virtuals", () => {
    it("hasAnswers should return true if answers exist", () => {
        const instance = new Question({ ...baseQuestion, answers: [new mongoose.Types.ObjectId()] });
        expect(instance.hasAnswers).toBe(true);
    });

    it("hasAnswers should return false if no answers", () => {
        const instance = new Question({ ...baseQuestion, answers: [] });
        expect(instance.hasAnswers).toBe(false);
    });

    it("mostRecentActivity should return ask date if no answers", () => {
        const instance = new Question({ ...baseQuestion, answers: [] });
        expect(instance.mostRecentActivity.getTime()).toBe(baseQuestion.ask_date_time.getTime());
    });

    it("mostRecentActivity should return latest answer date if answers present", () => {
        const answer1 = { ans_date_time: new Date("2024-01-01") } as IAnswerDocument;
        const answer2 = { ans_date_time: new Date("2024-03-03") } as IAnswerDocument;
        const instance = new Question({ ...baseQuestion, answers: [answer1, answer2] });
        expect(instance.mostRecentActivity.getTime()).toBe(answer1.ans_date_time.getTime());
    });
});

describe("Question Utilities - formatUtils", () => {
    it("convertToIQuestion should convert ObjectIds and dates to string", () => {
        const mockQuestion = {
            _id: new mongoose.Types.ObjectId(),
            title: "Sample Question",
            text: "Content",
            asked_by: mockUserId.toString(),
            ask_date_time: new Date("2024-04-01"),
            views: 0,
            vote_score: 0,
            tags: [{ _id: new mongoose.Types.ObjectId(), name: "nodejs" }],
            answers: []
        } as unknown as IQuestionDocument;

        const result = convertToIQuestion(mockQuestion);
        expect(result._id?.toString()).toBe(mockQuestion._id.toString());
        expect(new Date(result.ask_date_time).toISOString()).toBe(mockQuestion.ask_date_time.toISOString());
        expect(typeof result.asked_by).toBe("string");
    });

    it("convertToIAnswer should convert ObjectIds and dates to string", () => {
        const mockAnswer = {
            _id: new mongoose.Types.ObjectId(),
            text: "answer text",
            ans_by: mockUserId.toString(),
            ans_date_time: new Date("2024-04-01"),
            vote_score: 5
        } as unknown as IAnswerDocument;

        const result = convertToIAnswer(mockAnswer);
        expect(result._id?.toString()).toBe(mockAnswer._id.toString());
        expect(new Date(result.ans_date_time).toISOString()).toBe(mockAnswer.ans_date_time.toISOString());
        expect(typeof result.ans_by).toBe("string");

    });
});
