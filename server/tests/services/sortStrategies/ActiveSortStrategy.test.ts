import { ActiveSortStrategy } from "../../../services/sortStrategies/ActiveSortStrategy";
import Question from "../../../models/questions";
import { IQuestion } from "../../../types/types";

// Mock the Question model
jest.mock("../../../models/questions");

describe("ActiveSortStrategy", () => {
    const mockQuestions: IQuestion[] = [
        {
            _id: "1",
            title: "How to use useState in React?",
            text: "Need help managing state.",
            tags: [{ name: "react" }],
            answers: [],
            asked_by: "user1",
            ask_date_time: new Date().toISOString(),
            views: 12,
            vote_score: 7
        },
        {
            _id: "2",
            title: "Best practices for Express middleware?",
            text: "Looking for structure tips.",
            tags: [{ name: "express" }],
            answers: [],
            asked_by: "user2",
            ask_date_time: new Date().toISOString(),
            views: 25,
            vote_score: 3
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return active questions using getActiveQuestions()", async () => {
        (Question.getActiveQuestions as jest.Mock).mockResolvedValue(mockQuestions);

        const strategy = new ActiveSortStrategy();
        const result = await strategy.sort();

        expect(Question.getActiveQuestions).toHaveBeenCalled();
        expect(result).toEqual(mockQuestions);
    });
});
