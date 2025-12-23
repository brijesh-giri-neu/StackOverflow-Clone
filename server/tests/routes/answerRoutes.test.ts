import "../setup/mocks";
import request from "supertest";

const app = require("../../server"); // CommonJS import style
import Answer from "../../models/answers";
import Question from "../../models/questions";
import { convertToIAnswer } from "../../utilities/formatUtils";
import { IAnswerDocument } from "../../types/types";

describe("POST /answer/addAnswer", () => {
    const qid = "question123";
    const reqBody = {
        qid,
        ans: {
            text: "This is an answer",
            ans_by: "User123",
            ans_date_time: new Date("2024-04-16T10:00:00Z"),
        },
    };

    const mockAnswer = {
        _id: "answer456",
        text: reqBody.ans.text,
        ans_by: reqBody.ans.ans_by,
        ans_date_time: reqBody.ans.ans_date_time,
        vote_score: 0,
        toObject: function () {
            return this;
        },
    } as unknown as IAnswerDocument;

    let consoleSpy: jest.SpyInstance;

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });
    
    it("should add a new answer and return it", async () => {
        const mockQuestion = { addAnswer: jest.fn().mockResolvedValue(undefined) };

        Question.findById = jest.fn().mockResolvedValue(mockQuestion);
        Answer.createAnswer = jest.fn().mockResolvedValue(mockAnswer);

        const response = await request(app).post("/answer/addAnswer").send(reqBody);

        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(convertToIAnswer(mockAnswer));
        expect(Question.findById).toHaveBeenCalledWith(qid);
        expect(mockQuestion.addAnswer).toHaveBeenCalledWith(mockAnswer._id);
    });

    it("should return 400 if question is not found", async () => {
        Question.findById = jest.fn().mockResolvedValue(null);
        const response = await request(app).post("/answer/addAnswer").send(reqBody);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: "Question not found" });
    });

    // it("should return 500 if something goes wrong", async () => {
    //     Question.findById = jest.fn().mockRejectedValue(new Error("DB error"));
    //     const response = await request(app).post("/answer/addAnswer").send(reqBody);
    //     expect(response.statusCode).toBe(500);
    //     expect(consoleSpy).toHaveBeenCalled();
    // });
});
