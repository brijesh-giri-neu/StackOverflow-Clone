import mongoose from "mongoose";
import Answer from "../../models/answers";
import { IAnswer } from "../../types/types";

describe("Answer Model - Static Methods", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createAnswer", () => {
        it("should create a new answer", async () => {
            const mockAnswer: IAnswer = {
                text: "This is an answer",
                ans_by: new mongoose.Types.ObjectId(),
                ans_date_time: "2024-04-01",
                vote_score: 0
            };

            const expectedCreated = {
                ...mockAnswer,
                _id: new mongoose.Types.ObjectId(),
                vote_score: 0,
                ans_date_time: new Date("2024-04-01"),
            };

            jest.spyOn(Answer, "create").mockResolvedValueOnce(expectedCreated as any);

            const result = await Answer.createAnswer(mockAnswer);
            
            expect(Answer.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: mockAnswer.text,
                    ans_by: mockAnswer.ans_by,
                    ans_date_time: new Date(mockAnswer.ans_date_time), // convert string to Date
                })
            );

            expect(result.text).toBe(mockAnswer.text);
            expect(result.ans_by).toEqual(mockAnswer.ans_by);
        });
    });

    describe("getMostRecent", () => {
        it("should return answers sorted by ans_date_time descending", async () => {
            const ids = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];

            const mockAnswers = [
                { _id: ids[1], ans_date_time: new Date("2024-04-02") },
                { _id: ids[0], ans_date_time: new Date("2024-04-01") }
            ];

            const findMock = {
                sort: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValueOnce(mockAnswers)
            };

            jest.spyOn(Answer, "find").mockReturnValue(findMock as any);

            const result = await Answer.getMostRecent(ids);
            expect(Answer.find).toHaveBeenCalledWith({ _id: { $in: ids } });
            expect(findMock.sort).toHaveBeenCalledWith({ ans_date_time: -1 });
            expect(findMock.populate).toHaveBeenCalledWith("ans_by", "displayName");
            expect(result).toEqual(mockAnswers);
        });
    });

    describe("getLatestAnswerDate", () => {
        it("should return the latest ans_date_time from answer list", async () => {
            const latest = new Date("2024-04-05");
            const answers = [
                { ans_date_time: new Date("2024-04-01") },
                { ans_date_time: new Date("2024-04-05") },
                { ans_date_time: new Date("2024-03-30") }
            ];

            const result = await Answer.getLatestAnswerDate(answers as any);
            expect(result?.getTime()).toBe(latest.getTime());
        });

        it("should return undefined if the input is empty", async () => {
            const result = await Answer.getLatestAnswerDate([]);
            expect(result).toBeUndefined();
        });
    });
});
