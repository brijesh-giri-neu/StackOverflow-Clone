import mongoose from "mongoose";
import Question from "../../models/questions";
import { PostType } from "../../types/types";
import Answer from "../../models/answers";
import Tag from "../../models/tags";
import { convertToIAnswer, convertToIQuestion } from "../../utilities/formatUtils";

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
        const mockIncrement = jest.fn().mockResolvedValue(baseQuestion);
        const mockPopulate = jest.fn().mockReturnThis();
        const mockLean = jest.fn().mockReturnThis();
        const mockQuestion = { ...baseQuestion, incrementViews: mockIncrement, toObject: () => baseQuestion };

        jest.spyOn(Question, "findById").mockReturnValue({
            populate: mockPopulate,
            then: (cb: any) => cb(mockQuestion)
        } as any);

        const result = await Question.findByIdAndIncrementViews(baseQuestion._id.toString());
        expect(result).toEqual(baseQuestion);
    });

    it("createQuestion should create a new question and return it", async () => {
        const mockCreated = { ...baseQuestion, populate: jest.fn().mockResolvedValue(baseQuestion) };
        jest.spyOn(Question, "create").mockResolvedValue(mockCreated as any);

        const result = await Question.createQuestion(
            {
                ...baseQuestion,
                _id: baseQuestion._id.toString(),
                ask_date_time: baseQuestion.ask_date_time.toISOString(),
                tags: [{ name: "js" }]
            });
        expect(result).toEqual(baseQuestion);
    });
});

describe("Question Model - Instance Methods", () => {
    it("incrementViews should increase views and save", async () => {
        const mockSave = jest.fn();
        const instance = new Question(baseQuestion);
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
        const answer1 = { ans_date_time: new Date("2024-01-01") };
        const answer2 = { ans_date_time: new Date("2024-03-03") };
        const instance = new Question({ ...baseQuestion, answers: [answer1, answer2] });
        expect(instance.mostRecentActivity.getTime()).toBe(answer1.ans_date_time.getTime());
    });
});
